import test from 'node:test';
import assert from 'node:assert/strict';
import { executeLandVerification } from '../src/lib/services/landService';
import { normalizeDagNo } from '../src/lib/validation/normalize';
import { registerSyntheticDeed, restoreSyntheticDeed, resetCustomRegistry, getCustomRegisteredDeeds } from '../src/lib/demo/registry';
import { DEMO_SCENARIOS } from '../src/lib/demo/fixtures';

test('Hardening: malformed plot identifiers never alias a clean green fixture', async () => {
  for (const dagNo of ['01!01', '01 01', '0101<script>', '০১|০১']) {
    assert.equal(normalizeDagNo(dagNo), '');
    assert.equal((await executeLandVerification({ dagNo })).success, false);
  }
  assert.equal(normalizeDagNo(' ০১০১ '), '0101');
  assert.equal((await executeLandVerification({ dagNo: '০১০১' })).result?.overallStatus, 'GREEN');
});

test('Hardening: untrusted service calls fail without throwing or returning trusted records', async () => {
  const invalid: unknown[] = [null, {}, { dagNo: 101 }, { dagNo: '0101', deedNo: {} },
    { dagNo: '0101', proposedArea: Infinity }, { dagNo: '0101', sellerName: [] }];
  for (const value of invalid) {
    const response = await executeLandVerification(value as Parameters<typeof executeLandVerification>[0]);
    assert.equal(response.success, false);
    assert.equal(response.result, null);
  }
});

test('Hardening: existing receipt identifiers cannot bypass validation or baseline protection', async () => {
  resetCustomRegistry();
  const snapshot = JSON.stringify(DEMO_SCENARIOS);
  try {
    const result = await registerSyntheticDeed({ deed_no: 'HARDEN-1', dag_no: '0097', seller: 'Synthetic seller', buyer: 'Synthetic buyer', area: 5, date: '2024-02-29' });
    assert.ok(result.deed);
    const saved = structuredClone(result.deed);
    assert.equal(await restoreSyntheticDeed(saved), true);
    assert.equal(await restoreSyntheticDeed({ ...saved, area: Infinity }), false);
    assert.equal(await restoreSyntheticDeed({ ...saved, area: 7 }), false);
    assert.equal(await restoreSyntheticDeed({ ...DEMO_SCENARIOS[0].deeds[0], deed_no: DEMO_SCENARIOS[0].deedNo.toLowerCase() }), false);
    assert.deepEqual(getCustomRegisteredDeeds(), [saved]);
    assert.equal(JSON.stringify(DEMO_SCENARIOS), snapshot);
  } finally { resetCustomRegistry(); }
});
