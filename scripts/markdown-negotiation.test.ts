// Tests for src/lib/markdown-negotiation.mjs, which middleware.ts uses to
// serve a page's markdown twin on `Accept: text/markdown`. Run: npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { prefersMarkdown, twinPath } from '../src/lib/markdown-negotiation.mjs';

test('a browser Accept header gets the HTML', () => {
  assert.equal(prefersMarkdown('text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'), false);
  assert.equal(prefersMarkdown('*/*'), false);
  assert.equal(prefersMarkdown(''), false);
  assert.equal(prefersMarkdown(null), false);
});

test('a client that asks for markdown gets it', () => {
  assert.equal(prefersMarkdown('text/markdown'), true);
  assert.equal(prefersMarkdown('text/markdown, text/html;q=0.9'), true);
  assert.equal(prefersMarkdown('text/html, text/markdown'), true);
  assert.equal(prefersMarkdown('Text/Markdown; charset=utf-8'), true);
});

test('markdown ranked below HTML, or at q=0, gets the HTML', () => {
  assert.equal(prefersMarkdown('text/html, text/markdown;q=0.5'), false);
  assert.equal(prefersMarkdown('text/markdown;q=0'), false);
  assert.equal(prefersMarkdown('text/markdown;q=abc'), false);
});

test('a page path maps to its twin', () => {
  assert.equal(twinPath('/'), '/index.md');
  assert.equal(twinPath('/storage/'), '/storage/index.md');
  assert.equal(twinPath('/storage/tables'), '/storage/tables/index.md');
});

test('assets, functions and pages without a twin are left alone', () => {
  assert.equal(twinPath('/storage/index.md'), null);
  assert.equal(twinPath('/llms.txt'), null);
  assert.equal(twinPath('/_astro/x.js'), null);
  assert.equal(twinPath('/pagefind/pagefind.js'), null);
  assert.equal(twinPath('/api/chat'), null);
  assert.equal(twinPath('/changelog/'), null);
  assert.equal(twinPath('/changelog'), null);
});
