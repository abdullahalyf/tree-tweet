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
const { scenarioEnglish, localizeIssue } = load('../src/lib/i18n/issues.ts');
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

const { getBuyerChecklist, readMutationHistory } = load('../src/lib/i18n/buyerChecklist.ts');
const completeEvidence = () => ({
  khatian: { owner_name: 'Owner', land_type: 'normal', mutation_status: 'done', mutation_history: [{ date: '2025-02-01', status: 'done', reference: 'DEMO-1' }] },
  selectedDeed: { seller: 'Owner' },
  plotStatus: { court_case: false, acquisition_status: 'not_reported' }, issues: [],
});
const checkState = (data, id) => getBuyerChecklist(data).find(check => check.id === id).state;

test('buyer checklist covers exactly the five P5 questions and missing acquisition stays unknown', () => {
  const data = completeEvidence();
  assert.equal(getBuyerChecklist(data).map(check => check.id).join(','), 'owner,mutation,court,khas,acquisition');
  assert.ok(getBuyerChecklist(data).every(check => check.state === 'clear'));
  for (const value of [undefined, null, 'unknown', '', 'false']) {
    data.plotStatus.acquisition_status = value;
    assert.equal(checkState(data, 'acquisition'), 'missing');
  }
  for (const value of ['notice', 'acquired']) {
    data.plotStatus.acquisition_status = value;
    assert.equal(checkState(data, 'acquisition'), 'review');
  }
});

test('complete mutation status alone cannot imply complete mutation history', () => {
  const data = completeEvidence();
  delete data.khatian.mutation_history;
  assert.equal(checkState(data, 'mutation'), 'missing');
  for (const history of [[], [{date:'2025-02-30',status:'done',reference:'DEMO'}], [{date:'2025-02-01',status:'done',reference:''}]]) {
    assert.equal(readMutationHistory(history).length, 0);
    data.khatian.mutation_history = history;
    assert.equal(checkState(data, 'mutation'), 'missing');
  }
  data.khatian.mutation_status = 'pending';
  assert.equal(checkState(data, 'mutation'), 'review-missing');
});

test('known court and acquisition risks remain visible with incomplete records', () => {
  const data = completeEvidence();
  data.plotStatus.court_case = true;
  data.plotStatus.acquisition_status = 'notice';
  data.issues = [{code:'RECORD_DATA_INCOMPLETE'}];
  assert.equal(checkState(data, 'court'), 'review-missing');
  assert.equal(checkState(data, 'acquisition'), 'review-missing');
});

test('plain issue copy gives an action without leaking hash jargon or raw engine text', () => {
  const issue = { code:'DEED_HASH_MISMATCH', severity:'CRITICAL', titleBn:'SHA-256', descriptionBn:'DEED_HASH_MISMATCH stored hash ABCDEF0123456789' };
  const bn = localizeIssue(issue, 'bn');
  const en = localizeIssue(issue, 'en');
  assert.equal(bn.title, 'দলিলের তথ্য মিলছে না');
  assert.equal(en.title, 'Deed details do not match');
  for (const value of [bn,en]) {
    assert.ok(value.action.length > 20);
    assert.doesNotMatch(value.title + value.description + value.action, /SHA|hash|হ্যাশ|DEED_HASH|ABCDEF/i);
  }
  for (const code of ['ACQUISITION_NOTICE','LAND_ACQUIRED','ACQUISITION_STATUS_UNAVAILABLE','MUTATION_HISTORY_UNAVAILABLE']) {
    assert.notEqual(localizeIssue({...issue,code}, 'en').title, 'Further checks are needed');
    assert.ok(localizeIssue({...issue,code}, 'bn').action.length > 20);
  }
});
