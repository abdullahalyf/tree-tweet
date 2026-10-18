import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/components/guide/useGuideMotion.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;

function harness({ paused = false, reduced = false, observer = true } = {}) {
  const callbacks = new Map();
  const observers = [];
  const animations = [];
  const listeners = new Map();
  let frameId = 0;
  let cleanup;
  const eventTarget = (label, target = {}) => Object.assign(target, {
    addEventListener(type, callback) { listeners.set(`${label}:${type}`, callback); },
    removeEventListener(type, callback) {
      if (listeners.get(`${label}:${type}`) === callback) listeners.delete(`${label}:${type}`);
    },
  });
  const style = () => ({
    values: new Map(),
    setProperty(key, value) { this.values.set(key, value); },
    removeProperty(key) { this.values.delete(key); },
    getPropertyValue(key) { return this.values.get(key) || ''; },
  });
  const scene = { style: style(), dataset: {}, getBoundingClientRect: () => ({ top: 400, height: 250 }) };
  const card = {
    contains: element => element === card,
    animate() {
      let reject;
      const animation = { canceled: false, finished: new Promise((_, fail) => { reject = fail; }), cancel() { this.canceled = true; reject(new Error('canceled')); } };
      animations.push(animation);
      return animation;
    },
  };
  const root = { style: style(), querySelector: () => scene, querySelectorAll: () => [card] };
  const preference = eventTarget('preference', { matches: reduced });
  const window = eventTarget('window', {
    innerHeight: 844, innerWidth: 390, scrollY: 0,
    matchMedia: () => preference,
    requestAnimationFrame(callback) { callbacks.set(++frameId, callback); return frameId; },
    cancelAnimationFrame(id) { callbacks.delete(id); },
  });
  const document = eventTarget('document', { hidden: false, activeElement: null, documentElement: { scrollHeight: 5000 } });
  class IntersectionObserver {
    constructor(callback) { this.callback = callback; this.targets = new Set(); this.disconnected = false; observers.push(this); }
    observe(element) { this.targets.add(element); }
    unobserve(element) { this.targets.delete(element); }
    disconnect() { this.targets.clear(); this.disconnected = true; }
    enter(element, isIntersecting = true) { if (this.targets.has(element)) this.callback([{ target: element, isIntersecting }]); }
  }
  if (observer) window.IntersectionObserver = IntersectionObserver;
  const exports = {};
  runInNewContext(compiled, {
    exports, window, document, IntersectionObserver,
    require: name => {
      assert.equal(name, 'react');
      return { useEffect: effect => { cleanup = effect(); } };
    },
  });
  exports.useGuideMotion({ current: root }, paused);
  return {
    window, document, root, scene, card, callbacks, observers, animations, listeners, preference,
    cleanup: () => cleanup(),
    event: name => listeners.get(name)?.(),
    flush: () => { const tasks = [...callbacks.values()]; callbacks.clear(); tasks.forEach(callback => callback()); },
  };
}

test('disabled motion and missing observers keep content static without scroll listeners', () => {
  for (const options of [{ paused: true }, { reduced: true }, { observer: false }]) {
    const app = harness(options);
    assert.equal(app.observers.length, 0);
    assert.equal(app.callbacks.size, 0);
    assert.equal(app.listeners.has('window:scroll'), false);
    assert.equal(app.animations.length, 0);
    app.cleanup();
    assert.equal(app.listeners.size, 0);
  }
});

test('many scroll events share one frame; scene visibility and background state control playback', () => {
  const app = harness();
  const sceneObserver = app.observers.find(observer => observer.targets.has(app.scene));
  sceneObserver.enter(app.scene);
  assert.equal(app.scene.dataset.sceneActive, 'true');
  app.window.scrollY = 1200;
  for (let i = 0; i < 100; i++) app.event('window:scroll');
  assert.equal(app.callbacks.size, 1);
  app.flush();
  const progress = Number(app.root.style.getPropertyValue('--reading-progress'));
  assert.ok(progress > 0 && progress < 1);
  assert.ok(app.scene.style.getPropertyValue('--scene-shift').endsWith('px'));
  app.document.hidden = true;
  app.event('document:visibilitychange');
  assert.equal(app.scene.dataset.sceneActive, 'false');
  app.document.hidden = false;
  app.event('document:visibilitychange');
  assert.equal(app.scene.dataset.sceneActive, 'true');
  sceneObserver.enter(app.scene, false);
  assert.equal(app.scene.dataset.sceneActive, 'false');
  app.cleanup();
  assert.equal(app.callbacks.size, 0);
  assert.equal(app.listeners.size, 0);
});

test('focused destinations stay still and nonfocused sections reveal only once', () => {
  for (const focused of [true, false]) {
    const app = harness();
    app.document.activeElement = focused ? app.card : null;
    const reveal = app.observers.find(observer => observer.targets.has(app.card));
    reveal.enter(app.card);
    reveal.enter(app.card);
    assert.equal(app.animations.length, focused ? 0 : 1);
    app.cleanup();
    assert.ok(app.animations.every(animation => animation.canceled));
  }
});

test('changing reduced-motion preference cancels active work and can safely resume', () => {
  const app = harness();
  app.observers.find(observer => observer.targets.has(app.scene)).enter(app.scene);
  app.observers.find(observer => observer.targets.has(app.card)).enter(app.card);
  app.flush();
  app.event('window:scroll');
  app.preference.matches = true;
  app.event('preference:change');
  assert.equal(app.scene.dataset.sceneActive, 'false');
  assert.equal(app.callbacks.size, 0);
  assert.equal(app.listeners.has('window:scroll'), false);
  assert.equal(app.scene.style.getPropertyValue('--scene-shift'), '');
  assert.equal(app.root.style.getPropertyValue('--reading-progress'), '');
  assert.ok(app.observers.every(observer => observer.disconnected));
  assert.ok(app.animations.every(animation => animation.canceled));
  app.preference.matches = false;
  app.event('preference:change');
  assert.equal(app.listeners.has('window:scroll'), true);
  assert.equal(app.callbacks.size, 1);
  app.cleanup();
  assert.equal(app.listeners.size, 0);
  assert.equal(app.callbacks.size, 0);
  assert.ok(app.observers.every(observer => observer.disconnected));
});
