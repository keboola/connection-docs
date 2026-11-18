// Tests for src/integrations/agent-only.mjs: `:::agent` blocks stay off the web
// page and appear, labelled, in the markdown twin. Run: npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkDirective from 'remark-directive';
import { remarkAgentOnly, renderAgentBlocks, agentBlockTexts, findAgentLeaks, AGENT_LABEL } from '../src/integrations/agent-only.mjs';

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

function tree(markdown: string) {
  const processor = unified().use(remarkParse).use(remarkDirective).use(remarkAgentOnly);
  return processor.runSync(processor.parse(markdown));
}

test('the web build drops :::agent blocks and keeps other directives', () => {
  const nodes = JSON.stringify(tree(page));
  assert.doesNotMatch(nodes, /Bucket sharing is not enabled/);
  assert.match(nodes, /"name":"tip"/);
  assert.match(nodes, /Tables can be shared/);
});

test('the markdown twin keeps the block as a labelled quote', () => {
  const out = renderAgentBlocks(page);
  assert.match(out, new RegExp(`> ${AGENT_LABEL.replace(/\*/g, '\\*')}\n>\n> If the user sees "Bucket sharing is not enabled"`));
  assert.doesNotMatch(out, /:::agent/);
  assert.match(out, /:::tip\nA normal tip\.\n:::/);
});

test('a fenced sample of the syntax is left as written', () => {
  const sample = ['```markdown', ':::agent', 'note', ':::', '```'].join('\n');
  assert.equal(renderAgentBlocks(sample), sample);
});

test('a code block inside an agent block is quoted with it', () => {
  const out = renderAgentBlocks([':::agent', '```', ':::', '```', ':::'].join('\n'));
  assert.equal(out, [`> ${AGENT_LABEL}`, '>', '> ```', '> :::', '> ```'].join('\n'));
});

test('an unclosed block fails instead of swallowing the rest of the page', () => {
  assert.throws(() => renderAgentBlocks(':::agent\nnote\n\n## Next section', 'x.md'), /x\.md: :::agent block opened on line 1 is never closed/);
});

test('agentBlockTexts returns each block without its markers', () => {
  assert.deepEqual(agentBlockTexts(page), ['If the user sees "Bucket sharing is not enabled", check the organization first.']);
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
