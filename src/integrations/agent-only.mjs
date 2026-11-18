/**
 * agent-only.mjs — notes for AI agents that stay off the web page.
 *
 * A page can carry a block meant only for agents reading its markdown twin
 * (`<slug>/index.md`, "View as Markdown", llms.txt): exact error messages, what
 * to check first, edge cases that would clutter the page for people.
 *
 *     :::agent
 *     If the user sees "Bucket sharing is not enabled", check the organization
 *     setting first.
 *     :::
 *
 * Both sides find the blocks with the same parser (remark + remark-directive),
 * so they cannot disagree about where a block starts and ends:
 *
 *  - `remarkAgentOnly` drops agent blocks from the page's markdown tree, so the
 *    rendered HTML (and the Pagefind index built from it) never carries them.
 *    Without it, Starlight renders an unknown container directive as a plain
 *    `<div>`, and the note would show on the page.
 *  - `findAgentBlocks` parses the twin's source the same way and returns each
 *    block's position; `renderAgentBlocks` rebuilds the twin from those
 *    positions, turning each block into a quote labelled "Note for agents".
 *
 * Anything ambiguous fails the build instead of guessing: a block that is never
 * closed, a block that contains another `:::` block (usually a forgotten
 * closing `:::`), a code sample whose `:::` line ends the block early (open it
 * with more colons, `::::agent` … `::::`), a block nested in a list or quote, or
 * `::agent` with too few colons. The name is matched case-insensitively, so
 * `:::Agent` is still a block.
 *
 * `findAgentLeaks` is the build guard: page-markdown.mjs fails the build when the
 * text of an agent block shows up in its page's HTML.
 *
 * Hidden is not private: the repo and the twin are public. Never put anything in
 * an agent block that a reader may not see.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkDirective from 'remark-directive';
import { visit, SKIP } from 'unist-util-visit';

export const AGENT_LABEL = '**Note for agents:**';

const isAgentName = (node) => typeof node.name === 'string' && node.name.toLowerCase() === 'agent';

/** A `:::agent` container directive, whatever the case of its name. */
export function isAgentBlock(node) {
  return node.type === 'containerDirective' && isAgentName(node);
}

/** remark plugin: remove agent blocks from the tree. */
export function remarkAgentOnly() {
  return (tree) => {
    visit(tree, (node, index, parent) => {
      if (!isAgentBlock(node) || !parent || index === undefined) return;
      parent.children.splice(index, 1);
      return [SKIP, index];
    });
  };
}

const parser = unified().use(remarkParse).use(remarkDirective);
const CLOSING_FENCE = /(^|\n)[ \t]*:{3,}[ \t]*$/;
const OPENING_CODE_FENCE = /^[ \t]*(`{3,}|~{3,})/;
const CLOSING_CODE_FENCE = /\n[ \t]*(`{3,}|~{3,})[ \t]*$/;

/**
 * Parse `markdown` and return its agent blocks in document order as
 * `{ start, end, innerStart, innerEnd }` offsets: the whole block, and the
 * content between its fences. Throws, naming `file` and the line, on anything
 * the twin and the page could read differently.
 */
export function findAgentBlocks(markdown, file = 'page') {
  const tree = parser.parse(markdown);
  const blocks = [];
  const fail = (node, why) => {
    throw new Error(`${file}:${node.position.start.line}: ${why}`);
  };
  visit(tree, (node, _index, parent) => {
    if ((node.type === 'leafDirective' || node.type === 'textDirective') && isAgentName(node)) {
      fail(node, `"${node.type === 'leafDirective' ? '::' : ':'}${node.name}" is not an agent block; write :::agent on its own line and close it with :::`);
    }
    if (!isAgentBlock(node)) return;
    if (parent?.type !== 'root') fail(node, ':::agent block inside a list or quote; put it at the top level of the page');
    const { start, end } = node.position;
    if (!CLOSING_FENCE.test(markdown.slice(start.offset, end.offset))) {
      fail(node, ':::agent block is never closed; add ::: on its own line after the note');
    }
    let nested = null;
    let cutCode = null;
    visit(node, (child) => {
      if (child !== node && child.type === 'containerDirective') nested ??= child;
      if (child.type === 'code') {
        const code = markdown.slice(child.position.start.offset, child.position.end.offset);
        if (OPENING_CODE_FENCE.test(code) && !CLOSING_CODE_FENCE.test(code)) cutCode ??= child;
      }
    });
    // A ::: line inside a code sample ends the directive there (that is how the
    // directive syntax works), which cuts the code block and puts the rest of the
    // note on the page. A longer fence (::::agent … ::::) avoids it.
    if (cutCode) {
      fail(node, `a ::: line inside the code block on line ${cutCode.position.start.line} ends the :::agent block early; open the block with more colons than any ::: inside it, e.g. ::::agent … ::::`);
    }
    if (nested) {
      fail(node, `:::agent block contains another ::: block (:::${nested.name}, line ${nested.position.start.line}); is the closing ::: of the agent block missing?`);
    }
    const kids = node.children;
    blocks.push({
      start: start.offset,
      end: end.offset,
      innerStart: kids.length ? kids[0].position.start.offset : start.offset,
      innerEnd: kids.length ? kids.at(-1).position.end.offset : start.offset,
    });
    return SKIP;
  });
  return blocks;
}

/** Rebuild the markdown with every agent block turned into a labelled quote. */
export function renderAgentBlocks(markdown, file = 'page') {
  let out = '';
  let at = 0;
  for (const b of findAgentBlocks(markdown, file)) {
    const inner = markdown.slice(b.innerStart, b.innerEnd);
    const quoted = inner.split('\n').map((line) => (line.trim() ? `> ${line}` : '>'));
    out += markdown.slice(at, b.start) + [`> ${AGENT_LABEL}`, '>', ...quoted].join('\n');
    at = b.end;
  }
  return out + markdown.slice(at);
}

/** The text of each agent block in a page, without the fences. */
export function agentBlockTexts(markdown, file = 'page') {
  return findAgentBlocks(markdown, file).map((b) => markdown.slice(b.innerStart, b.innerEnd));
}

/**
 * Words only, lower-cased: markdown syntax, HTML tags and entities and
 * typographic quotes differ between the source and the page, the words don't.
 */
function words(text) {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[#a-z0-9]+;/gi, ' ')
    .replace(/\]\([^)]*\)/g, ' ') // a markdown link's URL is not on the page
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Build guard: the pages (`{ slug, texts }`, texts from agentBlockTexts) whose
 * built HTML in outDir contains the opening words of one of their agent blocks.
 * Returns the slugs of the pages that leak.
 */
export function findAgentLeaks(outDir, pages) {
  const leaks = [];
  for (const { slug, texts } of pages) {
    const file = join(outDir, slug, 'index.html');
    if (!texts.length || !existsSync(file)) continue;
    const html = words(readFileSync(file, 'utf-8'));
    if (texts.some((t) => { const w = words(t).slice(0, 80); return w && html.includes(w); })) {
      leaks.push(slug || '/');
    }
  }
  return leaks;
}
