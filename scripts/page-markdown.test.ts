// Tests for stripMdx in src/integrations/page-markdown.mjs, the code that turns an
// .mdx page into its markdown twin (View as Markdown, llms.txt). Run: npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stripMdx } from '../src/integrations/page-markdown.mjs';

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
