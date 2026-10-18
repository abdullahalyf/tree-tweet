import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_SCENARIOS } from '../src/lib/demo/fixtures';
import { registerSyntheticDeed, resetCustomRegistry, findDeedByDeedNo } from '../src/lib/demo/registry';
import type { SyntheticDeedInput } from '../src/lib/demo/registry';
import { runLandVerification } from '../src/lib/verification/rules';
import { computeDeedHash, verifyDeedIntegrity } from '../src/lib/verification/hash';
import { validateSearchQuery } from '../src/lib/validation/schemas';
import { parseBanglaNumber } from '../src/lib/validation/normalize';
import { executeLandVerification } from '../src/lib/services/landService';
import type { DeedRecord, PlotStatusRecord } from '../src/lib/db/schema';

const baseline = JSON.stringify(DEMO_SCENARIOS);
const clean = () => structuredClone(DEMO_SCENARIOS[0]);
const input = (): SyntheticDeedInput => ({
  deed_no: 'RELIABILITY-TEST', dag_no: '0099', seller: 'Synthetic seller',
  buyer: 'Synthetic buyer', area: 5, date: '2024-02-29',
});

test('Reliability: absent evidence never earns a reassuring green', async (t) => {
  await t.test('unknown explicit deed is critical and never substitutes another deed', async () => {
    const result = await runLandVerification({ ...clean(), targetDeedNo: 'UNKNOWN-DEED' });
    assert.equal(result.overallStatus, 'RED');
    assert.equal(result.selectedDeed, null);
    assert.ok(result.issues.some(issue => issue.severity === 'CRITICAL'));
  });
  await t.test('a known plot with no deeds is incomplete', async () => {
    const result = await runLandVerification({ ...clean(), deeds: [] });
    assert.notEqual(result.overallStatus, 'GREEN');
    assert.equal(result.selectedDeed, null);
    assert.ok(result.issues.length > 0);
  });
  await t.test('missing encumbrance evidence is incomplete', async () => {
    const result = await runLandVerification({ ...clean(), plotStatus: null });
    assert.notEqual(result.overallStatus, 'GREEN');
    assert.ok(result.issues.length > 0);
  });
  for (const record of ['khatian', 'plotStatus', 'deed'] as const) {
    await t.test(`a ${record} belonging to another dag is rejected even with a valid hash`, async () => {
      const plot = clean();
      if (record === 'deed') {
        plot.deeds[0].dag_no = '9999';
        plot.deeds[0].hash = await computeDeedHash(plot.deeds[0]);
      } else {
        plot[record].dag_no = '9999';
      }
      const result = await runLandVerification(plot);
      assert.notEqual(result.overallStatus, 'GREEN');
      assert.ok(result.issues.some(issue => issue.severity === 'CRITICAL'));
    });
  }
});

test('Reliability: invalid areas are rejected at boundaries and by the engine', async (t) => {
  for (const area of [NaN, Infinity, -Infinity, -1, 0]) {
    await t.test(`search and verification reject proposed area ${area}`, async () => {
      assert.equal(validateSearchQuery({ dagNo: '0101', proposedArea: area }).isValid, false);
      const result = await runLandVerification({ ...clean(), proposedArea: area });
      assert.notEqual(result.overallStatus, 'GREEN');
    });
    await t.test(`invalid stored area ${area} cannot be green even when freshly hashed`, async () => {
      const plot = clean();
      plot.deeds[0].area = area;
      plot.deeds[0].hash = await computeDeedHash(plot.deeds[0]);
      assert.notEqual((await runLandVerification(plot)).overallStatus, 'GREEN');
    });
  }
  for (const area of ['5junk', '5.2.3', '৫শতক', 'Infinity', '1e999', '5,000']) {
    await t.test(`numeric text must be consumed in full: ${area}`, () => {
      assert.equal(parseBanglaNumber(area), null);
      assert.equal(validateSearchQuery({ dagNo: '0101', proposedArea: area }).isValid, false);
    });
  }
  for (const remaining of [NaN, Infinity, -1]) {
    await t.test(`invalid remaining area ${remaining} cannot be green`, async () => {
      const plot = clean();
      plot.khatian.remaining_area = remaining;
      assert.notEqual((await runLandVerification(plot)).overallStatus, 'GREEN');
    });
  }
});

test('Reliability: partial and invalid status records remain conservative', async (t) => {
  await t.test('missing mortgage evidence does not hide a known court dispute', async () => {
    const result = await runLandVerification({
      ...clean(),
      plotStatus: { dag_no: '0101', court_case: true } as PlotStatusRecord,
    });
    assert.equal(result.overallStatus, 'RED');
    assert.ok(result.issues.some(issue => issue.severity === 'CRITICAL'));
  });
  for (const status of ['unknown', null]) {
    await t.test(`unsupported deed status ${status} cannot receive GREEN`, async () => {
      const plot = clean();
      plot.deeds[0] = { ...plot.deeds[0], status } as unknown as DeedRecord;
      assert.notEqual((await runLandVerification(plot)).overallStatus, 'GREEN');
    });
  }
});

test('Reliability: registration rejects invalid data without storing a deed', async (t) => {
  const invalid: Partial<SyntheticDeedInput>[] = [
    ...[NaN, Infinity, -Infinity, -1, 0, '5junk', '৫শতক', '5.2.3'].map(area => ({ area })),
    ...['2025-02-29', '2024-02-30', '2026-04-31', '2026-13-01', 'nonsense'].map(date => ({ date })),
    ...(['deed_no', 'dag_no', 'seller', 'buyer', 'prev_hash'] as const).map(field => ({ [field]: 'A|B' })),
  ];
  for (const [index, override] of invalid.entries()) {
    await t.test(`reject invalid registration ${JSON.stringify(override)}`, async () => {
      resetCustomRegistry();
      const candidate = { ...input(), deed_no: `RELIABILITY-${index}`, ...override };
      try {
        const result = await registerSyntheticDeed(candidate);
        assert.equal(result.success, false);
        assert.equal(result.deed, null);
        assert.ok(result.error);
        assert.equal(findDeedByDeedNo(candidate.deed_no), null);
      } finally {
        resetCustomRegistry();
      }
    });
  }
});

test('Reliability: Bangla search, valid leap date, hash compatibility and fixture isolation', async () => {
  resetCustomRegistry();
  try {
    const query = validateSearchQuery({ dagNo: ' ০১০১ ', deedNo: 'deed-২০২৪-০০০১', proposedArea: '৫.০০' });
    assert.equal(query.isValid, true);
    assert.equal(query.data?.dagNo, '0101');
    assert.equal(query.data?.deedNo, 'DEED-2024-0001');
    assert.equal(query.data?.proposedArea, 5);
    const registration = await registerSyntheticDeed({ ...input(), dag_no: '০০৯৯', area: '৫.০০' });
    assert.equal(registration.success, true);
    assert.ok(registration.deed);
    assert.equal(registration.deed.dag_no, '0099');
    assert.equal(registration.deed.date, '2024-02-29');
    assert.equal((await verifyDeedIntegrity(registration.deed)).isValid, true);
    assert.equal(await computeDeedHash(clean().deeds[0]), 'f5e09e09af91efb48fc6b19971d1489d492314b41a93e5af7b26cd0bf9389f2e');
    for (const scenario of DEMO_SCENARIOS) {
      const result = await runLandVerification({ ...structuredClone(scenario), targetDeedNo: scenario.deedNo });
      assert.equal(result.overallStatus, scenario.expectedStatus, `Case ${scenario.code}`);
    }
    assert.equal(JSON.stringify(DEMO_SCENARIOS), baseline);
  } finally {
    resetCustomRegistry();
  }
  assert.equal(findDeedByDeedNo(input().deed_no), null);
  assert.equal(JSON.stringify(DEMO_SCENARIOS), baseline);
});

test('Reliability: service preserves unknown-deed failure and normalizes Bangla input in demo mode', async () => {
  const response = await executeLandVerification({ dagNo: '0101', deedNo: 'UNKNOWN-DEED' });
  assert.equal(response.success, true);
  assert.equal(response.source, 'demo');
  assert.ok(response.result);
  assert.equal(response.result.overallStatus, 'RED');
  assert.equal(response.result.selectedDeed, null);
  const normalized = await executeLandVerification({ dagNo: '০১০১', deedNo: 'deed-২০২৪-০০০১' });
  assert.equal(normalized.success, true);
  assert.equal(normalized.result?.overallStatus, 'GREEN');
  assert.equal(normalized.result?.selectedDeed?.deed_no, 'DEED-2024-0001');
});
