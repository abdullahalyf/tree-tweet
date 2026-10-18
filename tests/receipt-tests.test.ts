import test from 'node:test';
import assert from 'node:assert/strict';
import {
  registerSyntheticDeed, restoreSyntheticDeed, resetCustomRegistry,
  findDeedByDeedNo, getCustomRegisteredDeeds, getCompletePlotFromRegistry,
} from '../src/lib/demo/registry';
import { DEMO_SCENARIOS } from '../src/lib/demo/fixtures';
import { verifyDeedIntegrity } from '../src/lib/verification/hash';
import { runLandVerification } from '../src/lib/verification/rules';

const snapshot = JSON.stringify(DEMO_SCENARIOS);
const input = (id = 'RECEIPT-TEST') => ({
  deed_no: id, dag_no: '0098', seller: 'Synthetic receipt seller',
  buyer: 'Synthetic receipt buyer', area: 5, date: '2024-02-29',
});

// Each case owns the process-local registry and restores it even on assertion failure.
test('Receipts: restoration, untrusted storage and concurrent registration', async (t) => {
  t.afterEach(() => {
    resetCustomRegistry();
    assert.equal(JSON.stringify(DEMO_SCENARIOS), snapshot, 'Synthetic baselines must remain unchanged');
  });
  t.beforeEach(() => resetCustomRegistry());

  async function receipt() {
    const registered = await registerSyntheticDeed(input());
    assert.equal(registered.success, true);
    assert.ok(registered.deed);
    const saved = structuredClone(registered.deed);
    resetCustomRegistry();
    return saved;
  }

  await t.test('a valid browser receipt restores into a clean registry with its original digest', async () => {
    const saved = await receipt();
    assert.equal(findDeedByDeedNo(saved.deed_no), null);
    assert.equal(await restoreSyntheticDeed(saved), true);
    const restored = findDeedByDeedNo(saved.deed_no);
    assert.ok(restored);
    for (const field of ['deed_no', 'dag_no', 'seller', 'buyer', 'area', 'date', 'prev_hash', 'hash'] as const) {
      assert.equal(restored[field], saved[field]);
    }
    assert.equal((await verifyDeedIntegrity(restored)).isValid, true);
    assert.equal(await restoreSyntheticDeed(saved), true);
    assert.equal(getCustomRegisteredDeeds().length, 1, 'Restoration must be idempotent');
  });

  await t.test('edited receipt area retains the original hash and produces a critical mismatch', async () => {
    const saved = await receipt();
    const edited = { ...saved, area: 7 };
    assert.equal(await restoreSyntheticDeed(edited), true);
    const restored = findDeedByDeedNo(saved.deed_no);
    assert.ok(restored);
    assert.equal(restored.hash, saved.hash, 'Never silently rehash a browser receipt');
    assert.equal((await verifyDeedIntegrity(restored)).isValid, false);
    const plot = getCompletePlotFromRegistry(saved.dag_no);
    assert.ok(plot);
    const result = await runLandVerification({ ...plot, targetDeedNo: saved.deed_no });
    assert.equal(result.overallStatus, 'RED');
    assert.ok(result.issues.some(issue => issue.code === 'DEED_HASH_MISMATCH' && issue.severity === 'CRITICAL'));
  });

  await t.test('browser storage cannot replace a baseline deed', async () => {
    const original = structuredClone(DEMO_SCENARIOS[0].deeds[0]);
    assert.equal(await restoreSyntheticDeed({ ...original, area: 999 }), false);
    assert.deepEqual(findDeedByDeedNo(original.deed_no), original);
    assert.equal(getCustomRegisteredDeeds().length, 0);
  });

  await t.test('malformed untrusted receipt data is rejected without insertion', async () => {
    const valid = await receipt();
    const invalid: unknown[] = [null, {}, [], 'receipt',
      { ...valid, hash: 'not-a-digest' }, { ...valid, status: 'cancelled' },
      { ...valid, area: Infinity }, { ...valid, area: '5junk' },
      { ...valid, seller: 'A|B' }, { ...valid, date: '2025-02-29' },
      { ...valid, dag_no: null }, { ...valid, buyer: 42 },
    ];
    for (const candidate of invalid) {
      assert.equal(await restoreSyntheticDeed(candidate), false);
      assert.equal(getCustomRegisteredDeeds().length, 0);
    }
  });

  await t.test('concurrent registrations for the same identifier accept exactly one deed', async () => {
    const results = await Promise.all(Array.from({ length: 12 }, () => registerSyntheticDeed(input('CONCURRENT-SAME'))));
    assert.equal(results.filter(result => result.success).length, 1);
    assert.equal(getCustomRegisteredDeeds().length, 1);
    assert.equal((await verifyDeedIntegrity(getCustomRegisteredDeeds()[0])).isValid, true);
  });

  await t.test('concurrent distinct registrations cannot exceed the 200-record demo bound', async () => {
    for (let index = 0; index < 199; index++) {
      assert.equal((await registerSyntheticDeed(input(`CAPACITY-${index}`))).success, true);
    }
    const results = await Promise.all(Array.from({ length: 12 }, (_, index) => registerSyntheticDeed(input(`FINAL-${index}`))));
    assert.equal(results.filter(result => result.success).length, 1);
    assert.equal(getCustomRegisteredDeeds().length, 200);
    assert.equal(new Set(getCustomRegisteredDeeds().map(deed => deed.deed_no)).size, 200);
  });
});
