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

/** Remove HTML comments from a markdown string, outside fenced code blocks. */
export function stripHtmlComments(markdown) {
  const out = [];
  let fence = null; // the opening fence (``` or ~~~, any length) while inside a code block
  let pending = ''; // text of an unfinished comment that spans lines
  for (const line of markdown.split('\n')) {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (!pending && marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = null;
      out.push(line);
      continue;
    }
    if (fence) {
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
  return out.join('\n').replace(/\n{3,}/g, '\n\n');
}
