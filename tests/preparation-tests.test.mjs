import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/components/guide/paperPreparationStore.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const exports = {};
runInNewContext(compiled, { exports });
const { createPaperPreparationStore, PAPER_PREPARATION_KEY } = exports;
const plain = value => JSON.parse(JSON.stringify(value));
function storage(initial = null) {
  let value = initial, reads = 0, writes = 0;
  return {
    getItem(key) { assert.equal(key, PAPER_PREPARATION_KEY); reads++; return value; },
    setItem(key, next) { assert.equal(key, PAPER_PREPARATION_KEY); writes++; value = next; },
    removeItem(key) { assert.equal(key, PAPER_PREPARATION_KEY); value = null; },
    get value() { return value; }, get reads() { return reads; }, get writes() { return writes; },
  };
}

test('restored preparation whitelists exactly five status keys and ignores malformed JSON', () => {
  for (const raw of ['{', 'null', 'false', '[]', '"collected"', '{"owner":{"status":"collected"}}']) {
    assert.deepEqual(plain(createPaperPreparationStore(() => storage(raw)).getSnapshot()), {});
  }
  const saved = storage('{"owner":"collected","mutation":"mismatch","case":"missing","khas":"clear","acquisition":true,"name":"Private name","__proto__":{"owner":"collected"}}');
  const app = createPaperPreparationStore(() => saved);
  assert.deepEqual(plain(app.getSnapshot()), { owner: 'collected', mutation: 'mismatch', case: 'missing' });
  assert.equal(app.getSnapshot().name, undefined);
  app.setPaper('khas', 'collected');
  assert.deepEqual(JSON.parse(saved.value), { owner: 'collected', mutation: 'mismatch', case: 'missing', khas: 'collected' });
});

test('server snapshot is stable empty; client snapshots are cached and survive subscriber remounts', () => {
  const saved = storage('{"owner":"collected"}');
  const app = createPaperPreparationStore(() => saved);
  assert.strictEqual(app.getServerSnapshot(), app.getServerSnapshot());
  assert.deepEqual(plain(app.getServerSnapshot()), {});
  assert.equal(saved.reads, 0, 'SSR does not access browser storage');
  const first = app.getSnapshot();
  assert.strictEqual(first, app.getSnapshot());
  assert.equal(saved.reads, 1);
  assert.ok(Object.isFrozen(first));
  let calls = 0;
  const unsubscribe = app.subscribe(() => { calls++; });
  app.setPaper('mutation', 'mismatch');
  assert.equal(calls, 1);
  unsubscribe();
  const nextMount = app.getSnapshot();
  assert.equal(nextMount.owner, 'collected');
  assert.equal(nextMount.mutation, 'mismatch');
  app.setPaper('case', 'collected');
  assert.equal(calls, 1, 'unmounted subscriber is not called');
  assert.equal(saved.reads, 1);
});

test('invalid updates cannot write arbitrary fields, and identical updates do not publish or rewrite', () => {
  const saved = storage();
  const app = createPaperPreparationStore(() => saved);
  let calls = 0;
  app.subscribe(() => { calls++; });
  for (const [id, status] of [['name', 'collected'], ['owner', 'clear'], ['__proto__', 'mismatch'], ['case', {}]]) app.setPaper(id, status);
  assert.deepEqual(plain(app.getSnapshot()), {});
  assert.equal(saved.writes, 0);
  app.setPaper('owner', 'collected');
  const stable = app.getSnapshot();
  app.setPaper('owner', 'collected');
  assert.strictEqual(app.getSnapshot(), stable);
  assert.equal(saved.writes, 1);
  assert.equal(calls, 1);
});

test('clear removes persisted marks, publishes empty state, and a fresh tab session reads nothing', () => {
  const saved = storage('{"owner":"collected","case":"mismatch"}');
  const app = createPaperPreparationStore(() => saved);
  app.getSnapshot();
  let calls = 0;
  app.subscribe(() => { calls++; });
  app.clearPapers();
  assert.equal(saved.value, null);
  assert.deepEqual(plain(app.getSnapshot()), {});
  assert.equal(calls, 1);
  app.clearPapers();
  assert.equal(calls, 1);
  assert.deepEqual(plain(createPaperPreparationStore(() => saved).getSnapshot()), {});
});

test('blocked storage retains usable in-memory changes and clear still notifies subscribers', () => {
  for (const getStorage of [() => { throw new Error('denied'); }, () => ({ getItem() { throw new Error('denied'); }, setItem() { throw new Error('quota'); }, removeItem() { throw new Error('denied'); } }), () => null]) {
    const app = createPaperPreparationStore(getStorage);
    let calls = 0;
    app.subscribe(() => { calls++; });
    app.setPaper('acquisition', 'mismatch');
    assert.deepEqual(plain(app.getSnapshot()), { acquisition: 'mismatch' });
    app.clearPapers();
    assert.deepEqual(plain(app.getSnapshot()), {});
    assert.equal(calls, 2);
  }
});
