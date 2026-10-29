// Tests for src/components/getting-started/pathintro.mjs, the tab intro on the
// Getting Started task pages. It has two wordings on purpose: the short one the
// page shows (pathIntroHtml, rendered by PathIntro.astro) and the fuller one the
// markdown twin keeps for agents (pathIntroText). These tests hold the two to the
// same facts for every <PathIntro> a page uses. Run: npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathIntroHtml, pathIntroText } from '../src/components/getting-started/pathintro.mjs';
import { tagProps } from '../src/integrations/page-markdown.mjs';

function* mdxPages(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* mdxPages(path);
    else if (path.endsWith('.mdx')) yield path;
  }
}

const uses = [...mdxPages('src/content/docs/getting-started')].flatMap((file) =>
  [...readFileSync(file, 'utf8').matchAll(/^\s*<PathIntro\b[^\n]*\/>\s*$/gm)].map((m) => ({
    file,
    props: tagProps(m[0]),
  })),
);

const plain = (html: string) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');

test('the Getting Started pages use PathIntro', () => {
  assert.ok(uses.length >= 9, `found ${uses.length}`);
});

for (const { file, props } of uses) {
  test(`${file}: the page and the twin say the same things`, () => {
    const page = pathIntroHtml(props).map((p) => plain(p.html)).join('\n');
    const twin = pathIntroText(props).join('\n').replace(/\*\*/g, '');
    const ways = props.manual === false || props.tabs === 3 ? 'three' : 'two';
    for (const text of [page, twin]) {
      assert.match(text, new RegExp(`\\b${ways}\\b`, 'i'));
      if (ways === 'two') assert.doesNotMatch(text, /\bthree\b/i);
      assert.match(text, /not (two |three )?steps/);
      assert.equal(/only Prompt builds it/.test(text), props.manual === false);
      assert.equal(/Kai asks before each change/.test(text), props.approvals !== false);
      assert.equal(text.includes(`One thing stays yours either way: ${props.yours}.`), Boolean(props.yours));
      assert.match(text, /can be undone/);
      assert.match(text, /say so in the same chat/);
    }
  });
}

test('the page escapes a `yours` value rather than injecting it as HTML', () => {
  const [, yours] = pathIntroHtml({ tabs: 3, yours: `<b>this</b> & "that" isn't` });
  assert.equal(
    yours.html,
    'One thing stays yours either way: &lt;b&gt;this&lt;/b&gt; &amp; &quot;that&quot; isn&#39;t.',
  );
  assert.equal(plain(yours.html), `One thing stays yours either way: <b>this</b> & "that" isn't.`);
});

test('the undo line comes last, marked for its own class', () => {
  const lines = pathIntroHtml({ tabs: 3, yours: 'x' });
  assert.equal(lines.at(-1).recovery, true);
  assert.ok(lines.slice(0, -1).every((p) => !p.recovery));
});
