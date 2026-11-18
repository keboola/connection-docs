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
 * Two halves, like strip-comments.mjs:
 *
 *  - `remarkAgentOnly` drops `:::agent` blocks from the markdown tree, so the
 *    rendered HTML (and the Pagefind index built from it) never carries them.
 *    Without it, Starlight renders an unknown container directive as a plain
 *    `<div>`, and the note would show on the page.
 *  - `renderAgentBlocks` turns the same blocks into a labelled quote in the
 *    markdown string that page-markdown.mjs writes for the twin.
 *
 * `findAgentLeaks` is the build guard: page-markdown.mjs fails the build when the
 * text of an agent block shows up in its page's HTML.
 *
 * Hidden is not private: the repo and the twin are public. Never put anything in
 * an agent block that a reader may not see.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { visit, SKIP } from 'unist-util-visit';

export const AGENT_LABEL = '**Note for agents:**';

/** remark plugin: remove `:::agent` container directives from the tree. */
export function remarkAgentOnly() {
  return (tree) => {
    visit(tree, 'containerDirective', (node, index, parent) => {
      if (node.name !== 'agent' || !parent || index === undefined) return;
      parent.children.splice(index, 1);
      return [SKIP, index];
    });
  };
}

const OPEN = /^\s*:::agent\s*$/;
const CLOSE = /^\s*:::\s*$/;
const FENCE = /^\s*(`{3,}|~{3,})/;

/**
 * Walk the markdown, calling `onLine(line, inAgent)` for every line outside the
 * agent markers and `onOpen()` at each block start. Fenced code outside a block
 * is skipped over (a sample that shows the syntax is not a block); a fence
 * inside a block belongs to it. An unclosed block throws, so a typo fails the
 * build instead of quietly swallowing the rest of the page.
 */
function walkAgentBlocks(markdown, file, onLine, onOpen) {
  let fence = null; // the opening fence while inside a code block
  let inAgent = false;
  let openedAt = 0;
  markdown.split('\n').forEach((line, i) => {
    const marker = line.match(FENCE);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = null;
      onLine(line, inAgent);
      return;
    }
    if (!fence && !inAgent && OPEN.test(line)) {
      inAgent = true;
      openedAt = i + 1;
      onOpen();
      return;
    }
    if (!fence && inAgent && CLOSE.test(line)) {
      inAgent = false;
      return;
    }
    onLine(line, inAgent);
  });
  if (inAgent) throw new Error(`${file}: :::agent block opened on line ${openedAt} is never closed`);
}

/** Turn `:::agent` … `:::` into a quote that starts with the label. */
export function renderAgentBlocks(markdown, file = 'page') {
  const out = [];
  walkAgentBlocks(
    markdown,
    file,
    (line, inAgent) => out.push(inAgent ? (line.trim() ? `> ${line}` : '>') : line),
    () => out.push(`> ${AGENT_LABEL}`, '>'),
  );
  return out.join('\n');
}

/** The text of each `:::agent` block in a page, without the markers. */
export function agentBlockTexts(markdown, file = 'page') {
  const blocks = [];
  walkAgentBlocks(
    markdown,
    file,
    (line, inAgent) => { if (inAgent) blocks[blocks.length - 1].push(line); },
    () => blocks.push([]),
  );
  return blocks.map((lines) => lines.join('\n'));
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
