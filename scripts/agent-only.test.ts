// Tests for src/integrations/agent-only.mjs: `:::agent` blocks stay off the web
// page and appear, labelled, in the markdown twin. The page and the twin find
// the blocks with the same parser, so the cases below can't make them disagree.
// Run: npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkDirective from 'remark-directive';
import {
  remarkAgentOnly, renderAgentBlocks, agentBlockTexts, findAgentLeaks, AGENT_LABEL,
} from '../src/integrations/agent-only.mjs';
import { twinBody } from '../src/integrations/page-markdown.mjs';

const page = [
  'Tables can be shared across projects.',
  '',
  ':::agent',
  'If the user sees "Bucket sharing is not enabled", check the organization first.',
  ':::',
  '',
  ':::tip',
  'A normal tip.',
  ':::',
].join('\n');

/** The text the web page gets: the tree after remarkAgentOnly, as JSON. */
function webPage(markdown: string) {
  const processor = unified().use(remarkParse).use(remarkDirective).use(remarkAgentOnly);
  return JSON.stringify(processor.runSync(processor.parse(markdown)));
}

test('the web page drops :::agent blocks and keeps other directives', () => {
  const nodes = webPage(page);
  assert.doesNotMatch(nodes, /Bucket sharing is not enabled/);
  assert.match(nodes, /"name":"tip"/);
  assert.match(nodes, /Tables can be shared/);
});

test('the twin keeps the block as a labelled quote and leaves other directives alone', () => {
  const out = renderAgentBlocks(page);
  assert.equal(out, [
    'Tables can be shared across projects.',
    '',
    `> ${AGENT_LABEL}`,
    '>',
    '> If the user sees "Bucket sharing is not enabled", check the organization first.',
    '',
    ':::tip',
    'A normal tip.',
    ':::',
  ].join('\n'));
});

test('a fenced sample of the syntax is not a block on either side', () => {
  const sample = ['Syntax:', '', '```markdown', ':::agent', 'note', ':::', '```'].join('\n');
  assert.equal(renderAgentBlocks(sample), sample);
  assert.match(webPage(sample), /:::agent\\nnote/);
});

// Review on #1245, case 2: a code block with ::: inside the note leaked the rest of
// the note onto the page. The directive syntax itself ends the block at that :::,
// so the build fails and says to use a longer fence.
const noteWithColons = (fence: string) =>
  [`${fence}agent`, 'Write it like this:', '', '```', ':::', '```', '', 'Rest of the note.', fence, '', 'After.'].join('\n');

test('a ::: line in a code sample inside a :::agent block fails the build', () => {
  assert.throws(() => renderAgentBlocks(noteWithColons(':::'), 'x.md'),
    /x\.md:1: a ::: line inside the code block on line 4 ends the :::agent block early; open the block with more colons/);
});

test('with a longer fence (::::agent) the code sample stays inside the note on both sides', () => {
  const src = noteWithColons('::::');
  assert.doesNotMatch(webPage(src), /Rest of the note/);
  assert.match(webPage(src), /After\./);
  assert.equal(renderAgentBlocks(src), [
    `> ${AGENT_LABEL}`, '>', '> Write it like this:', '>', '> ```', '> :::', '> ```', '>', '> Rest of the note.', '', 'After.',
  ].join('\n'));
});

// Review on #1245, case 1: a forgotten closing ::: got closed by the next :::tip,
// and everything in between vanished from the page.
test('a forgotten closing ::: before another block fails instead of hiding content', () => {
  const src = [':::agent', 'note', '', 'Text people should see.', '', ':::tip', 'Tip.', ':::'].join('\n');
  assert.throws(() => renderAgentBlocks(src, 'x.md'), /x\.md:1: :::agent block contains another ::: block \(:::tip, line 6\)/);
});

// Review on #1245, case 3: :::Agent showed the note on the page and the leak check missed it.
test('the name is case-insensitive on both sides', () => {
  const src = [':::Agent', 'Typo note.', ':::'].join('\n');
  assert.doesNotMatch(webPage(src), /Typo note/);
  assert.match(renderAgentBlocks(src), /> Typo note\./);
  assert.deepEqual(agentBlockTexts(src), ['Typo note.']);
});

test('::agent with too few colons fails', () => {
  assert.throws(() => renderAgentBlocks('::agent\n\nnote', 'x.md'), /x\.md:1: "::agent" is not an agent block/);
});

test('an unclosed block fails instead of swallowing the rest of the page', () => {
  assert.throws(() => renderAgentBlocks(':::agent\nnote\n\n## Next section', 'x.md'), /x\.md:1: :::agent block is never closed/);
});

test('a block inside a list fails', () => {
  assert.throws(() => renderAgentBlocks('- item\n\n  :::agent\n  note\n  :::', 'x.md'), /inside a list or quote/);
});

test('twinBody runs the agent step for every page', () => {
  const src = ['---', 'title: T', '---', 'Body.', '', ':::agent', 'Note.', ':::'].join('\n');
  assert.equal(twinBody(src, false), `Body.\n\n> ${AGENT_LABEL}\n>\n> Note.`);
});

test('the build guard flags a page whose HTML shows the note, however it is marked up', () => {
  const dir = mkdtempSync(join(tmpdir(), 'agent-leak-'));
  mkdirSync(join(dir, 'ok'));
  mkdirSync(join(dir, 'leak'));
  const texts = agentBlockTexts(page);
  writeFileSync(join(dir, 'ok', 'index.html'), '<p>Tables can be shared across projects.</p>');
  // Starlight's rendering of an unhandled container directive, with typographic quotes
  writeFileSync(join(dir, 'leak', 'index.html'),
    '<div><p>If the user sees “Bucket sharing is not enabled”, check the organization first.</p></div>');
  assert.deepEqual(findAgentLeaks(dir, [{ slug: 'ok', texts }, { slug: 'leak', texts }]), ['leak']);
});
