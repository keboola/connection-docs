/**
 * strip-comments.mjs — keep authors' notes out of what readers and agents get.
 *
 * Pages carry notes for the docs team in comments: `<!-- … -->` in .md and
 * `{/* … *\/}` in .mdx. They hold VERIFY(<name>) markers, where and when a
 * claim was checked (project and app IDs, dates, people), and open questions.
 * They belong in the source, where the team reads and resolves them, and
 * nowhere a reader can see them:
 *
 *  - `remarkStripComments` drops HTML comment nodes from .md pages, so the
 *    rendered HTML does not carry them (MDX expression comments are already
 *    dropped by the MDX compiler).
 *  - `stripHtmlComments` removes them from a markdown string, for the raw
 *    `<slug>/index.md` twins that page-markdown.mjs writes for "View as
 *    Markdown", llms.txt and agents.
 *
 * Comments inside fenced code blocks are content (an HTML or XML sample), so
 * both leave them alone: remark never sees them as HTML nodes, and the string
 * version skips fenced lines.
 */

import { visit, SKIP } from 'unist-util-visit';

const COMMENT = /<!--[\s\S]*?-->/g;
const ONLY_COMMENTS = /^\s*(?:<!--[\s\S]*?-->\s*)+$/;

/** remark plugin: remove HTML comments from the markdown tree. */
export function remarkStripComments() {
  return (tree) => {
    visit(tree, 'html', (node, index, parent) => {
      if (!parent || index === undefined || !node.value.includes('<!--')) return;
      if (ONLY_COMMENTS.test(node.value)) {
        parent.children.splice(index, 1);
        return [SKIP, index];
      }
      node.value = node.value.replace(COMMENT, '');
    });
  };
}

/**
 * The fence a line opens a code block with (``` or ~~~, any length), or null.
 * A backtick fence's info string may not hold a backtick (CommonMark), so
 * "```x``` text" is an inline code span, not a fence.
 */
export function fenceOpener(line) {
  const m = line.match(/^\s*(`{3,}|~{3,})(.*)$/);
  if (!m || (m[1][0] === '`' && m[2].includes('`'))) return null;
  return m[1];
}

/** Whether a line closes the block `fence` opened: same character, at least as long, nothing after it. */
export function closesFence(line, fence) {
  const m = line.match(/^\s*(`{3,}|~{3,})\s*$/);
  return Boolean(m) && m[1][0] === fence[0] && m[1].length >= fence.length;
}

/**
 * Feed it a markdown string line by line: it answers true for a line that
 * opens, closes or sits inside a fenced code block, so a caller can leave code
 * samples as written. Inside a block, "```js" is code, not a closer.
 */
export function fenceTracker() {
  let fence = null; // the opening fence while inside a code block
  return (line) => {
    if (fence) {
      if (closesFence(line, fence)) fence = null;
      return true;
    }
    fence = fenceOpener(line);
    return fence !== null;
  };
}

/** Remove HTML comments from a markdown string, outside fenced code blocks. */
export function stripHtmlComments(markdown) {
  const out = [];
  const inCode = fenceTracker();
  let pending = ''; // text of an unfinished comment that spans lines
  for (const line of markdown.split('\n')) {
    // a fence inside an unfinished comment is part of the comment, so ask only outside one
    if (!pending && inCode(line)) {
      out.push(line);
      continue;
    }
    let text = pending ? `${pending}\n${line}` : line;
    pending = '';
    text = text.replace(COMMENT, '');
    const open = text.indexOf('<!--');
    if (open !== -1) {
      // the comment continues on later lines: keep what precedes it, hold the rest
      pending = text.slice(open);
      text = text.slice(0, open);
      if (text.trim()) out.push(text.trimEnd());
      continue;
    }
    // a line that held only a comment goes, rather than leaving whitespace behind
    if (line.trim() && !text.trim()) continue;
    out.push(text);
  }
  if (pending) out.push(pending); // never close a comment the author left open
  return collapseBlankLines(out.join('\n'));
}

/**
 * Collapse runs of blank lines to one, outside fenced code blocks: a removed
 * comment leaves a gap, but a blank line inside code is content.
 */
export function collapseBlankLines(markdown) {
  const out = [];
  let fence = null;
  for (const line of markdown.split('\n')) {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = null;
    } else if (!fence && line === '' && out.at(-1) === '') continue;
    out.push(line);
  }
  return out.join('\n');
}
