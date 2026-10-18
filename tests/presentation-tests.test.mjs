import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

// These modules contain pure data/functions with type-only imports. Loading them
// without a child compiler process also works in restricted Windows sandboxes.
function load(relative) {
  const source = readFileSync(new URL(relative, import.meta.url), 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const context = { exports: {} };
  runInNewContext(output, context);
  return context.exports;
}
const { scenarioEnglish } = load('../src/lib/i18n/issues.ts');
const { DEMO_SCENARIOS } = load('../src/lib/demo/fixtures.ts');
const { getFlagState, hasCompletePlotStatus, getCheckState } = load('../src/lib/i18n/presentation.ts');

test('English case captions agree with the immutable fixture risk facts', () => {
  assert.deepEqual(Object.keys(scenarioEnglish), Array.from(DEMO_SCENARIOS, sc => sc.code));
  const byCode = Object.fromEntries(DEMO_SCENARIOS.map(sc => [sc.code, sc]));
  for (const code of ['A', 'B']) {
    const sc = byCode[code];
    assert.equal(sc.expectedStatus, 'GREEN');
    assert.equal(sc.khatian.land_type, 'normal');
    assert.equal(sc.khatian.mutation_status, 'done');
    assert.equal(sc.plotStatus.mortgaged, false);
    assert.equal(sc.plotStatus.court_case, false);
    assert.match(scenarioEnglish[code], /no risk detected/i);
    assert.doesNotMatch(scenarioEnglish[code], /khas|pending|mortgage/i);
  }
  assert.notEqual(byCode.C.khatian.owner_name, byCode.C.deeds[0].seller);
  assert.match(scenarioEnglish.C, /name variation/i);
  assert.equal(byCode.D.plotStatus.mortgaged, true);
  assert.equal(byCode.D.khatian.mutation_status, 'done');
  assert.match(scenarioEnglish.D, /mortgage/i);
  assert.doesNotMatch(scenarioEnglish.D, /pending/i);
  assert.ok(byCode.E.deeds.filter(deed => deed.status === 'active').length > 1);
  assert.match(scenarioEnglish.E, /double sale/i);
  assert.notEqual(byCode.F.khatian.owner_name, byCode.F.deeds[0].seller);
  assert.match(scenarioEnglish.F, /seller does not match/i);
  assert.ok(byCode.G.deeds[0].area > byCode.G.khatian.remaining_area);
  assert.match(scenarioEnglish.G, /exceeds remaining/i);
  assert.match(byCode.H.deeds[0].hash, /TAMPERED/);
  assert.match(scenarioEnglish.H, /fingerprint mismatch/i);
});

test('unknown flags cannot masquerade as explicit negative evidence', () => {
  assert.equal(getFlagState(true), 'reported');
  assert.equal(getFlagState(false), 'not-reported');
  for (const value of [undefined, null, '', 0, 1, 'false', 'true', {}]) assert.equal(getFlagState(value), 'unknown');
  assert.equal(hasCompletePlotStatus({ mortgaged: false, court_case: false }), true);
  for (const value of [null, {}, { mortgaged: false }, { court_case: true }, { mortgaged: false, court_case: 'false' }]) assert.equal(hasCompletePlotStatus(value), false);
});

test('known risks remain visible alongside incomplete evidence', () => {
  assert.equal(getCheckState(false, true), 'review-incomplete');
  assert.equal(getCheckState(false, false), 'incomplete');
  assert.equal(getCheckState(true, true), 'review');
  assert.equal(getCheckState(true, false), 'clear');
});
