// Tests for stripSearchMarkup() in src/integrations/page-markdown.mjs. Run: npm test
//
// The markdown twin drops the <span data-pagefind-…> wrappers a page adds to
// tune site search. Each case below is a shape that broke in review: nested
// spans, self-closing spans, and span samples inside code.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { stripSearchMarkup } from '../src/integrations/page-markdown.mjs';

test('a weighted heading loses the wrapper and keeps its text', () => {
  assert.equal(
    stripSearchMarkup('#### <span data-pagefind-weight="5">Apps pricing</span>'),
    '#### Apps pricing',
  );
});

test('a span nested inside a wrapper keeps its own tags', () => {
  assert.equal(
    stripSearchMarkup('<span data-pagefind-weight="2">a <span class="x">b</span> c</span>'),
    'a <span class="x">b</span> c',
  );
});

test('a self-closing wrapper goes and does not eat a later closer', () => {
  assert.equal(
    stripSearchMarkup('<span data-pagefind-meta="tier:free" /><span class="x">b</span>'),
    '<span class="x">b</span>',
  );
});

test('data-pagefind-ignore is a wrapper too: the reader keeps the text', () => {
  assert.equal(stripSearchMarkup('<span data-pagefind-ignore>old label</span>'), 'old label');
});

test('a span sample in inline code stays as written', () => {
  const single = 'Use `<span data-pagefind-weight="5">Title</span>` in a heading.';
  const double = 'Or ``<span data-pagefind-weight="5">a `tick`</span>`` with a backtick inside.';
  assert.equal(stripSearchMarkup(single), single);
  assert.equal(stripSearchMarkup(double), double);
});

test('a span sample in a fenced block stays as written, for ``` and ~~~', () => {
  for (const fence of ['```', '~~~']) {
    const md = [`${fence}html`, '<span data-pagefind-weight="5">Title</span>', fence].join('\n');
    assert.equal(stripSearchMarkup(md), md);
  }
});

test('text after a fenced block is stripped again', () => {
  const md = ['```', '<span data-pagefind-weight="5">x</span>', '```', '<span data-pagefind-weight="5">y</span>'].join('\n');
  assert.equal(stripSearchMarkup(md), ['```', '<span data-pagefind-weight="5">x</span>', '```', 'y'].join('\n'));
});

test('data-pagefind- inside an attribute value is not a wrapper', () => {
  const md = '<span title="see data-pagefind-weight">x</span>';
  assert.equal(stripSearchMarkup(md), md);
});

test('a stray closer with no opener stays', () => {
  assert.equal(stripSearchMarkup('text</span>'), 'text</span>');
});
