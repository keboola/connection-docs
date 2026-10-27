// Tests for src/integrations/page-markdown.mjs, the code that writes each page's
// markdown twin (View as Markdown, llms.txt). Run: npm test
//
// stripMdx turns an .mdx page into plain markdown. stripSearchMarkup drops the
// <span data-pagefind-…> wrappers a page adds to tune site search; each of its
// cases below is a shape that broke in review: nested spans, self-closing
// spans, and span samples inside code.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { stripMdx, stripSearchMarkup } from '../src/integrations/page-markdown.mjs';
import { fenceTracker } from '../src/integrations/strip-comments.mjs';

const prereqs = (inner: string) =>
  `<Prereqs needs={['project']} tabs={3} groupLabel="For this page">\n${inner}\n</Prereqs>\n\nBody.`;

test('an MDX comment inside <Prereqs> does not swallow the from/to slots', () => {
  const out = stripMdx(prereqs([
    '  {/* editor note */}',
    '  <span slot="from">a project with empty Storage.</span>',
    '  <span slot="to">six tables in Storage.</span>',
  ].join('\n')));
  assert.match(out, /\*\*Where you are:\*\* a project with empty Storage\. \*\*When you finish:\*\* six tables in Storage\./);
  assert.doesNotMatch(out, /editor note/);
});

test('an HTML comment before a group item leaves the item in its own list', () => {
  const out = stripMdx(prereqs([
    '  <!-- note -->',
    '  <li slot="group">group item</li>',
  ].join('\n')));
  assert.match(out, /For this page:\n\n- group item/);
  assert.doesNotMatch(out, /<!--|note -->/);
});

test('tabs become headings, a rule closes the group, and fenced YAML keeps its indentation', () => {
  const out = stripMdx([
    "import { Tabs, TabItem } from '@astrojs/starlight/components';",
    '',
    '## Do it',
    '',
    '<Tabs syncKey="path">',
    '  <TabItem label="UI">',
    '    1. Click **Run**.',
    '  </TabItem>',
    '  <TabItem label="CLI / API">',
    '    ```yaml',
    '    phases:',
    '      - name: load',
    '        tasks: []',
    '    ```',
    '  </TabItem>',
    '</Tabs>',
    '',
    'After.',
  ].join('\n'));
  assert.doesNotMatch(out, /import|<Tabs|<TabItem/);
  assert.match(out, /### UI\n\n1\. Click \*\*Run\*\*\./);
  assert.match(out, /### CLI \/ API/);
  assert.match(out, /```yaml\nphases:\n  - name: load\n    tasks: \[\]\n```/);
  assert.match(out, /---\n\nAfter\./);
});

test('<details> folds out: the summary becomes a bold line and the rest follows', () => {
  const out = stripMdx('<details><summary>Why <code>out.c-</code>?</summary>\n\nBecause.\n\n</details>');
  assert.match(out, /^\*\*Why `out\.c-`\?\*\*\n\nBecause\./);
  assert.doesNotMatch(out, /<\/?details|<\/?summary/);
});

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

test('fenceTracker: a fence with an info string inside a block is code, not a closer', () => {
  const inCode = fenceTracker();
  const lines = ['````md', '```js', 'x', '```', '````', 'after'];
  assert.deepEqual(lines.map(inCode), [true, true, true, true, true, false]);
  const plain = fenceTracker();
  assert.deepEqual(['```', '```js', 'still code', '```', 'after'].map(plain), [true, true, true, true, false]);
});

test('fenceTracker: an inline code span at the start of a line opens no block', () => {
  const inCode = fenceTracker();
  assert.deepEqual(['```x``` text', 'next'].map(inCode), [false, false]);
  const wrapped = '<span data-pagefind-weight="5">y</span>';
  assert.equal(stripSearchMarkup(['```x``` text', wrapped].join('\n')), '```x``` text\ny');
});
