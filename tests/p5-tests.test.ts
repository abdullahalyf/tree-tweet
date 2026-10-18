import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_SCENARIOS } from '../src/lib/demo/fixtures';
import { runLandVerification } from '../src/lib/verification/rules';
import { computeDeedHash } from '../src/lib/verification/hash';
import type { AcquisitionStatus, DeedRecord } from '../src/lib/db/schema';

// Explicit synthetic metadata isolates each safety test from missing-evidence warnings.
function plot() {
  const sample = structuredClone(DEMO_SCENARIOS[0]);
  return {
    ...sample,
    khatian: { ...sample.khatian, mutation_history: [{ date: '2024-01-15', status: 'done' as const, reference: 'SYNTHETIC-P5-HISTORY' }] },
    plotStatus: { ...sample.plotStatus, acquisition_status: 'not_reported' as AcquisitionStatus },
  };
}

test('P5: complete synthetic evidence preserves the clean control', async () => {
  assert.equal((await runLandVerification(plot())).overallStatus, 'GREEN');
});

test('P5: acquisition evidence controls risk conservatively', async (t) => {
  for (const acquisition_status of [undefined, 'unknown', 'unsupported']) {
    await t.test(`unknown acquisition ${String(acquisition_status)} cannot be green`, async () => {
      const sample = plot();
      Object.assign(sample.plotStatus, { acquisition_status });
      assert.notEqual((await runLandVerification(sample)).overallStatus, 'GREEN');
    });
  }
  await t.test('acquisition notice alone is a warning', async () => {
    const sample = plot();
    sample.plotStatus.acquisition_status = 'notice';
    assert.equal((await runLandVerification(sample)).overallStatus, 'YELLOW');
  });
  await t.test('acquired land is critical', async () => {
    const sample = plot();
    sample.plotStatus.acquisition_status = 'acquired';
    const result = await runLandVerification(sample);
    assert.equal(result.overallStatus, 'RED');
    assert.ok(result.issues.some(issue => issue.severity === 'CRITICAL'));
  });
  await t.test('unknown acquisition does not suppress a known court dispute', async () => {
    const sample = plot();
    sample.plotStatus.acquisition_status = 'unknown';
    sample.plotStatus.court_case = true;
    assert.equal((await runLandVerification(sample)).overallStatus, 'RED');
  });
});

test('P5: mutation history must be present and credible', async (t) => {
  const histories = [
    undefined,
    [],
    [{ date: '2025-02-29', status: 'done', reference: 'SYNTHETIC' }],
    [{ date: '2024-01-15', status: 'done', reference: '' }],
    [{ date: '2024-01-15', status: 'pending', reference: 'SYNTHETIC' }],
  ];
  for (const [index, mutation_history] of histories.entries()) {
    await t.test(`missing or inconsistent history ${index} cannot be green`, async () => {
      const sample = plot();
      Object.assign(sample.khatian, { mutation_history });
      assert.notEqual((await runLandVerification(sample)).overallStatus, 'GREEN');
    });
  }
});

test('P5: missing owner and seller cannot be certified by a matching hash', async () => {
  const sample = plot();
  sample.khatian.owner_name = '';
  sample.deeds[0].seller = '';
  sample.deeds[0].hash = await computeDeedHash(sample.deeds[0]);
  assert.notEqual((await runLandVerification(sample)).overallStatus, 'GREEN');
});

test('P5: conflicting latest mutation events warn regardless of input order', async () => {
  const entries = [
    { date: '2024-01-15', status: 'done' as const, reference: 'SYNTHETIC-DONE' },
    { date: '2024-01-15', status: 'pending' as const, reference: 'SYNTHETIC-PENDING' },
  ];
  for (const history of [entries, [...entries].reverse()]) {
    const sample = plot();
    Object.assign(sample.khatian, { mutation_history: history });
    const result = await runLandVerification(sample);
    assert.equal(result.overallStatus, 'YELLOW');
    assert.ok(result.issues.some(issue => issue.code === 'MUTATION_HISTORY_CONFLICT'));
  }
});

test('P5: invalid status on a nonselected deed cannot be ignored', async () => {
  const sample = plot();
  const other = { ...sample.deeds[0], deed_no: 'P5-OTHER', status: 'unknown' } as unknown as DeedRecord;
  other.hash = await computeDeedHash(other);
  sample.deeds.push(other);
  const result = await runLandVerification({ ...sample, targetDeedNo: sample.deedNo });
  assert.notEqual(result.overallStatus, 'GREEN');
});
