import assert from 'node:assert/strict';
import { DEMO_SCENARIOS } from '../src/lib/demo/fixtures.ts';
import { runLandVerification } from '../src/lib/verification/rules.ts';

// Expected outcomes are independent of the fixture's declared expectations.
const expected = {
  A: ['GREEN', []], B: ['GREEN', []],
  C: ['YELLOW', ['SELLER_NAME_VARIATION']],
  D: ['YELLOW', ['PLOT_MORTGAGED']],
  E: ['RED', ['DOUBLE_SALE_DETECTED']],
  F: ['RED', ['SELLER_OWNER_MISMATCH']],
  G: ['RED', ['EXCESSIVE_AREA_REQUESTED']],
  H: ['RED', ['DEED_HASH_MISMATCH']],
};

const snapshot = JSON.stringify(DEMO_SCENARIOS);
for (const scenario of DEMO_SCENARIOS) {
  const result = await runLandVerification({ ...structuredClone(scenario), targetDeedNo: scenario.deedNo });
  const [status, codes] = expected[scenario.code];
  assert.equal(result.overallStatus, status, `Case ${scenario.code} status`);
  assert.deepEqual(result.issues.map(issue => issue.code).sort(), [...codes].sort(), `Case ${scenario.code} exact issues`);
  console.log(`PASS Case ${scenario.code}: ${status}`);
}
assert.equal(JSON.stringify(DEMO_SCENARIOS), snapshot, 'Baseline fixtures must not be mutated');
console.log('All 8 synthetic cases passed with exact risk outcomes and immutable fixtures.');
