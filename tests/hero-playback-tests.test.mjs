import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/components/guide/useHeroPlayback.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;

// These tests exercise the real effect with controlled browser visibility and
// clocks. They intentionally do not wait seven seconds or install a DOM library.
function harness({ paused = false, reduced = false, observer = true, hidden = false, mounted = true } = {}) {
  const listeners = new Map();
  const intervals = new Map();
  const observers = [];
  let nextInterval = 0;
  let effectCleanup;
  let advances = 0;
  const eventTarget = (label, target = {}) => Object.assign(target, {
    addEventListener(type, callback) {
      const key = `${label}:${type}`;
      if (!listeners.has(key)) listeners.set(key, new Set());
      listeners.get(key).add(callback);
    },
    removeEventListener(type, callback) {
      const key = `${label}:${type}`;
      listeners.get(key)?.delete(callback);
      if (listeners.get(key)?.size === 0) listeners.delete(key);
    },
  });
  const preference = eventTarget('preference', { matches: reduced });
  const root = { dataset: {} };
  const rootRef = { current: mounted ? root : null };
  const document = eventTarget('document', { hidden });
  const setInterval = (callback, delay) => {
    const id = ++nextInterval;
    intervals.set(id, { callback, delay });
    return id;
  };
  const clearInterval = id => intervals.delete(id);
  const window = eventTarget('window', { matchMedia: () => preference, setInterval, clearInterval });
  class IntersectionObserver {
    constructor(callback) { this.callback = callback; this.targets = new Set(); this.disconnected = false; observers.push(this); }
    observe(element) { this.targets.add(element); }
    disconnect() { this.targets.clear(); this.disconnected = true; }
    enter(isIntersecting) {
      if (this.targets.has(root)) this.callback([{ target: root, isIntersecting, intersectionRatio: isIntersecting ? 1 : 0 }]);
    }
  }
  if (observer) window.IntersectionObserver = IntersectionObserver;
  const exports = {};
  runInNewContext(compiled, {
    exports, document, window, IntersectionObserver, setInterval, clearInterval,
    require(name) {
      assert.equal(name, 'react');
      return { useEffect: effect => { effectCleanup = effect(); } };
    },
  });
  const advance = () => { advances += 1; };
  const render = nextPaused => {
    effectCleanup?.();
    effectCleanup = undefined;
    exports.useHeroPlayback(rootRef, nextPaused, advance);
  };
  render(paused);
  return {
    intervals, listeners, observers, preference, document, root,
    get advances() { return advances; },
    event(name) { [...(listeners.get(name) || [])].forEach(callback => callback()); },
    visible(value = true) { observers.at(-1)?.enter(value); },
    tick() { [...intervals.values()].forEach(interval => interval.callback()); },
    render,
    cleanup() { effectCleanup?.(); effectCleanup = undefined; },
  };
}

test('hero advances every seven seconds only while visible, without duplicate timers', () => {
  const app = harness();
  assert.equal(app.intervals.size, 0, 'no rotation before visibility is known');
  assert.equal(app.root.dataset.heroActive, 'false');
  app.visible();
  assert.equal(app.intervals.size, 1);
  assert.equal(app.root.dataset.heroActive, 'true');
  assert.equal([...app.intervals.values()][0].delay, 7000);
  app.tick();
  assert.equal(app.advances, 1);
  app.visible();
  app.event('document:visibilitychange');
  assert.equal(app.intervals.size, 1, 'repeated visibility events do not stack clocks');
  app.visible(false);
  assert.equal(app.intervals.size, 0);
  assert.equal(app.root.dataset.heroActive, 'false');
  app.tick();
  assert.equal(app.advances, 1);
  app.visible();
  app.tick();
  assert.equal(app.advances, 2);
  app.cleanup();
  assert.equal(app.intervals.size, 0);
  assert.equal(app.root.dataset.heroActive, 'false');
  assert.equal(app.listeners.size, 0);
  assert.ok(app.observers.every(item => item.disconnected));
});

test('background documents stop playback and resume only when the hero is visible', () => {
  const app = harness({ hidden: true });
  app.visible();
  assert.equal(app.intervals.size, 0);
  app.document.hidden = false;
  app.event('document:visibilitychange');
  assert.equal(app.intervals.size, 1);
  app.document.hidden = true;
  app.event('document:visibilitychange');
  assert.equal(app.intervals.size, 0);
  assert.equal(app.root.dataset.heroActive, 'false');
  app.visible(false);
  app.document.hidden = false;
  app.event('document:visibilitychange');
  assert.equal(app.intervals.size, 0);
  app.cleanup();
});

test('caller pause and reduced motion prevent rotation even after visibility changes', () => {
  for (const options of [{ paused: true }, { reduced: true }, { observer: false }, { mounted: false }]) {
    const app = harness(options);
    app.visible();
    app.event('document:visibilitychange');
    app.tick();
    assert.equal(app.intervals.size, 0);
    assert.equal(app.advances, 0);
    if (options.mounted !== false) assert.equal(app.root.dataset.heroActive, 'false');
    app.cleanup();
    assert.equal(app.listeners.size, 0);
  }
});

test('runtime reduced-motion preference stops the active clock and can safely resume', () => {
  const app = harness();
  app.visible();
  assert.equal(app.intervals.size, 1);
  app.preference.matches = true;
  app.event('preference:change');
  assert.equal(app.intervals.size, 0);
  assert.equal(app.root.dataset.heroActive, 'false');
  app.tick();
  assert.equal(app.advances, 0);
  app.preference.matches = false;
  app.event('preference:change');
  app.visible();
  assert.equal(app.intervals.size, 1);
  app.tick();
  assert.equal(app.advances, 1);
  app.cleanup();
  app.event('preference:change');
  assert.equal(app.intervals.size, 0);
  assert.equal(app.listeners.size, 0);
});

test('caller interaction pause clears old effects; resuming creates one fresh clock', () => {
  const app = harness();
  app.visible();
  assert.equal(app.intervals.size, 1);
  // BuyerHero combines focus, hover, explicit pause, and manual slide selection
  // into this argument. The hook must dispose a clock whenever it turns true.
  app.render(true);
  app.visible();
  app.tick();
  assert.equal(app.intervals.size, 0);
  assert.equal(app.root.dataset.heroActive, 'false');
  assert.equal(app.advances, 0);
  assert.ok(app.observers.slice(0, 1).every(item => item.disconnected));
  app.render(false);
  app.visible();
  assert.equal(app.intervals.size, 1);
  app.tick();
  assert.equal(app.advances, 1);
  app.cleanup();
  assert.equal(app.intervals.size, 0);
  assert.equal(app.listeners.size, 0);
});
