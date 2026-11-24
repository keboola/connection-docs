// Tests for src/integrations/twin-cleanup.mjs, the last step of every markdown
// twin: absolute links, asides as quotes, no browser-only markup. Run: npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { absoluteLinks, asidesToQuotes, cleanTwin, dropWidgets } from '../src/integrations/twin-cleanup.mjs';
import { twinParts } from '../src/integrations/page-markdown.mjs';

const PAGE = 'https://help.keboola.com/storage/tables/';

test('root-relative, page-relative and same-page links become absolute', () => {
  const out = absoluteLinks('See [Buckets](/storage/buckets/), ![a](./x.png), [up](../files/) and [here](#limits).', PAGE);
  assert.equal(out, 'See [Buckets](https://help.keboola.com/storage/buckets/), ![a](https://help.keboola.com/storage/tables/x.png), [up](https://help.keboola.com/storage/files/) and [here](https://help.keboola.com/storage/tables/#limits).');
});

test('links with a scheme, titles and angle brackets', () => {
  assert.equal(absoluteLinks('[k](https://keboola.com/) [m](mailto:a@b.c) [c](cursor://x/y)', PAGE), '[k](https://keboola.com/) [m](mailto:a@b.c) [c](cursor://x/y)');
  assert.equal(absoluteLinks('[t](/a/ "Title")', PAGE), '[t](https://help.keboola.com/a/ "Title")');
  assert.equal(absoluteLinks('[t](</a b/>)', PAGE), '[t](<https://help.keboola.com/a%20b/>)');
});

test('reference definitions and HTML attributes become absolute', () => {
  assert.equal(absoluteLinks('[x][r]\n\n[r]: /storage/', PAGE), '[x][r]\n\n[r]: https://help.keboola.com/storage/');
  assert.equal(absoluteLinks('<img src="/a.png" width="45%"> <a href=\'/b/\'>b</a>', PAGE), '<img src="https://help.keboola.com/a.png" width="45%"> <a href=\'https://help.keboola.com/b/\'>b</a>');
});

test('code samples keep their links as written', () => {
  const src = 'Text [a](/a/).\n\n```md\n[a](/a/)\n```\n\nInline `[a](/a/)` and `<img src="/x">`.';
  const out = absoluteLinks(src, PAGE);
  assert.match(out, /Text \[a\]\(https:\/\/help\.keboola\.com\/a\/\)/);
  assert.match(out, /```md\n\[a\]\(\/a\/\)\n```/);
  assert.match(out, /`\[a\]\(\/a\/\)` and `<img src="\/x">`/);
});

test('asides become labelled quotes, with or without a title', () => {
  assert.equal(asidesToQuotes(':::caution[Storage token deprecation]\nOld tokens stop working.\n:::\n\nAfter.'),
    '> **Caution: Storage token deprecation**\n>\n> Old tokens stop working.\n\nAfter.');
  assert.equal(asidesToQuotes(':::tip\nOne.\n\nTwo.\n:::'), '> **Tip**\n>\n> One.\n>\n> Two.');
});

test('an aside keeps its code block, and one in a list stays in the list', () => {
  const out = asidesToQuotes(':::note\nRun:\n\n```bash\nkbagent --help\n```\n:::');
  assert.equal(out, '> **Note**\n>\n> Run:\n>\n> ```bash\n> kbagent --help\n> ```');
  const list = asidesToQuotes('1. Step.\n\n   :::note\n   Inside.\n   :::\n2. Next.');
  assert.equal(list, '1. Step.\n\n   > **Note**\n   >\n   > Inside.\n2. Next.');
});

test('a ::: line in a code sample is not an aside', () => {
  const src = '```md\n:::note\nx\n:::\n```';
  assert.equal(asidesToQuotes(src), src);
});

test('scripts and empty widget divs go; a video and a download button become links', () => {
  const out = dropWidgets([
    '<div id="diagram-viewer"></div>',
    '',
    '<script src="https://unpkg.com/d3@7/dist/d3.min.js"></script>',
    '',
    '<video autoplay muted poster="/p.png" aria-label="How it works">',
    '  <source src="/v.mp4" type="video/mp4" />',
    '</video>',
    '',
    '<a class="btn" href="/s.zip" download="s.zip">⬇ Download the skill</a>',
  ].join('\n'));
  assert.doesNotMatch(out, /<div|<script|<video/);
  // an inline script carries data (the telemetry data model) and stays
  assert.equal(dropWidgets('<script>\nwindow.X = {"a": 1};\n</script>'), '<script>\nwindow.X = {"a": 1};\n</script>');
  assert.match(out, /\[Video: How it works\]\(\/v\.mp4\)/);
  assert.match(out, /\[⬇ Download the skill\]\(\/s\.zip\)/);
});

test('cleanTwin makes the links the widgets leave absolute', () => {
  assert.equal(cleanTwin('<a href="/s.zip">Get it</a>', PAGE), '[Get it](https://help.keboola.com/s.zip)');
  // without a page URL the links stay as written (tests and callers that have none)
  assert.equal(cleanTwin('[a](/a/)'), '[a](/a/)');
});

test('the twin pipeline runs the cleanup when the build passes the page URL', () => {
  const page = "---\ntitle: T\nslug: 'storage/tables'\n---\n:::tip\nSee [Files](/storage/files/).\n:::";
  assert.equal(twinParts(page, false, 'p', { pageUrl: PAGE }).body, '> **Tip**\n>\n> See [Files](https://help.keboola.com/storage/files/).');
});
