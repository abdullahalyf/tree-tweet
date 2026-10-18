import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

// Exercise the real neutral module. No source-text assertions or duplicate
// route implementation: these are the published navigation/content contract.
const source = readFileSync(new URL('../src/components/guide/guideTopics.ts', import.meta.url), 'utf8');
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const context = { exports: {} };
runInNewContext(output, context);
const { checks, guideTopicTitles, isGuideTopic } = context.exports;

test('the public guide contains exactly five P5 checks and three supporting pages', () => {
  const expected = ['owner', 'mutation', 'case', 'khas', 'acquisition', 'papers', 'preparation', 'help'];
  assert.deepEqual(Object.keys(guideTopicTitles).sort(), [...expected].sort());
  for (const topic of expected) assert.equal(isGuideTopic(topic), true, `missing public topic: ${topic}`);
  assert.deepEqual(Array.from(checks, check => check.id), ['owner', 'mutation', 'case', 'khas', 'acquisition']);
  assert.equal(new Set(Array.from(checks, check => check.id)).size, 5);
});

test('topic guard rejects prototype keys, unknown values and noncanonical route spellings', () => {
  for (const value of ['__proto__', 'constructor', 'prototype', 'toString', 'hasOwnProperty', '', 'unknown', 'Owner', 'CASE', ' owner', 'owner ', '../owner', 'owner/help', 'owner?view=search']) {
    assert.equal(isGuideTopic(value), false, `unexpected public topic: ${value}`);
  }
});

test('every public page and check has a distinct nonempty Bangla and English title', () => {
  for (const [topic, title] of Object.entries(guideTopicTitles)) {
    assert.equal(title.length, 2, topic);
    assert.equal(typeof title[0], 'string', topic);
    assert.equal(typeof title[1], 'string', topic);
    assert.ok(title[0].trim().length > 0 && title[1].trim().length > 0, topic);
    assert.match(title[0], /[\u0980-\u09ff]/u, `missing Bangla title: ${topic}`);
    assert.match(title[1], /[A-Za-z]/u, `missing English title: ${topic}`);
    assert.notEqual(title[0], title[1], topic);
  }
  for (const check of checks) {
    assert.deepEqual(Array.from(check.title), Array.from(guideTopicTitles[check.id]));
    assert.ok(check.body[0].trim() && check.body[1].trim(), check.id);
    assert.ok(check.office[0].trim() && check.office[1].trim(), check.id);
  }
});

test('P5 service destinations use HTTPS official hosts and bilingual link labels', () => {
  const approvedHosts = new Set([
    'dlrms.land.gov.bd', 'mutation.land.gov.bd', 'causelist.judiciary.gov.bd',
    'case.gov.bd', 'www.land.gov.bd', 'larms.land.gov.bd',
  ]);
  for (const check of checks) {
    assert.ok(check.links.length > 0, `${check.id} has no official service`);
    for (const link of check.links) {
      const url = new URL(link.href);
      assert.equal(url.protocol, 'https:', link.href);
      assert.ok(approvedHosts.has(url.hostname), `unreviewed service host: ${link.href}`);
      assert.equal(url.username, '', link.href);
      assert.equal(url.password, '', link.href);
      assert.equal(url.port, '', link.href);
      assert.ok(link.bn.trim().length > 0 && link.en.trim().length > 0, link.href);
    }
  }
});
