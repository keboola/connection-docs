/**
 * twin-cleanup.mjs: the last step of a page's markdown twin, for a reader who
 * has only the text (an agent, `llms-full.txt`, a paste into a chat).
 * page-markdown.mjs (twinParts) runs it on every twin.
 *
 *  - Links and images point at absolute URLs. `/storage/` means nothing in a
 *    file pasted elsewhere, and in llms-full.txt `#anchor` no longer says which
 *    page it belongs to. Root-relative, page-relative (`./x.png`) and same-page
 *    (`#x`) targets resolve against the page's own URL; a target with a scheme
 *    (`https:`, `mailto:`, `cursor:`) stays as written.
 *  - Starlight asides (`:::note`, `:::tip`, `:::caution`, `:::danger`, with an
 *    optional `[title]`) become quotes headed by their label, which every
 *    markdown reader understands. `:::agent` blocks are agent-only.mjs's and
 *    are already quotes by the time this runs.
 *  - Markup that only works in a browser goes: `<script src>` tags and the
 *    empty `<div id="…"></div>` a script fills in. An inline `<script>` stays:
 *    on the telemetry page it holds the data model (tables, columns and their
 *    descriptions) the diagram draws, which is text an agent can use. A `<video>` becomes a link to the
 *    file, with its `aria-label` as the text, and a one-line `<a href>` (the
 *    download button) a markdown link.
 *
 * Fenced code and inline code spans are samples and stay as written.
 */
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkDirective from 'remark-directive';
import { visit } from 'unist-util-visit';
import { fenceTracker, collapseBlankLines } from './strip-comments.mjs';

const SCHEME = /^[a-z][a-z0-9+.-]*:/i;
// a code span: a run of N backticks closed by the next run of exactly N
const CODE_SPAN = /(?<!`)(`+)(?!`)[\s\S]*?(?<!`)\1(?!`)/g;

/** A link target made absolute against the page URL; a target with a scheme is left alone. */
export function absoluteUrl(target, pageUrl) {
  if (!target || SCHEME.test(target) || target.startsWith('//')) return target;
  try {
    return new URL(target, pageUrl).href;
  } catch {
    return target;
  }
}

/**
 * Run `fn` on the prose of `markdown`: everything outside fenced code blocks
 * and inline code spans. Text is handed over a paragraph at a time, because a
 * code span (or a link) may run onto the next line.
 */
export function mapProse(markdown, fn) {
  const outsideSpans = (para) => {
    let out = '';
    let last = 0;
    for (const m of para.matchAll(CODE_SPAN)) {
      out += fn(para.slice(last, m.index)) + m[0];
      last = m.index + m[0].length;
    }
    return out + fn(para.slice(last));
  };
  const inCode = fenceTracker();
  const out = [];
  let para = [];
  const flush = () => {
    if (para.length) out.push(outsideSpans(para.join('\n')));
    para = [];
  };
  for (const line of markdown.split('\n')) {
    if (inCode(line) || !line.trim()) {
      flush();
      out.push(line);
    } else para.push(line);
  }
  flush();
  return out.join('\n');
}

/** Make every link and image target in prose absolute. */
export function absoluteLinks(markdown, pageUrl) {
  const abs = (t) => absoluteUrl(t, pageUrl);
  const target = (open, t) => (t.startsWith('<') ? `${open}<${abs(t.slice(1, -1))}>` : `${open}${abs(t)}`);
  return mapProse(markdown, (text) =>
    text
      // [text](target "title") and ![alt](target), the target bare or in <…>
      .replace(/(\]\(\s*)(<[^>\n]*>|[^)\s]+)/g, (m, open, t) => target(open, t))
      // [label]: target   (a reference definition, alone on its line)
      .replace(/^(\s{0,3}\[[^\]\n]+\]:\s*)(<[^>\n]*>|\S+)/gm, (m, open, t) => target(open, t))
      // href="…", src="…" and poster="…" in inline HTML
      .replace(/\b(href|src|poster)=(["'])([^"']*)\2/g, (m, attr, q, t) => `${attr}=${q}${abs(t)}${q}`),
  );
}

const ASIDES = { note: 'Note', tip: 'Tip', caution: 'Caution', danger: 'Danger' };
const parser = unified().use(remarkParse).use(remarkDirective);

/** Starlight asides as quotes headed by their label (`> **Caution: Title**`). */
export function asidesToQuotes(markdown) {
  if (!/^\s*:{3,}\s*(note|tip|caution|danger)\b/im.test(markdown)) return markdown;
  const tree = parser.parse(markdown);
  const blocks = [];
  visit(tree, 'containerDirective', (node) => {
    const name = String(node.name).toLowerCase();
    if (!ASIDES[name] || !node.position) return;
    const label = node.children.find((c) => c.data?.directiveLabel);
    const title = label?.position
      ? markdown.slice(label.position.start.offset, label.position.end.offset).trim().replace(/^\[([\s\S]*)\]$/, '$1')
      : '';
    const body = node.children.filter((c) => c !== label);
    const { start, end } = node.position;
    const lineStart = markdown.lastIndexOf('\n', start.offset - 1) + 1;
    const indent = markdown.slice(lineStart, start.offset);
    const inner = body.length
      ? markdown.slice(body[0].position.start.offset, body.at(-1).position.end.offset)
      : '';
    // continuation lines carry the aside's own indentation (inside a list): take it off once
    const lines = inner ? inner.split('\n').map((l, i) => (i && l.startsWith(indent) ? l.slice(indent.length) : l)) : [];
    const quoted = [`> **${ASIDES[name]}${title ? `: ${title}` : ''}**`, ...(lines.length ? ['>'] : []), ...lines.map((l) => (l.trim() ? `> ${l}` : '>'))];
    blocks.push({ from: lineStart, to: end.offset, text: quoted.map((l) => indent + l).join('\n') });
  });
  // An aside inside another stays inside its parent's quote as written (rare,
  // and still readable); only the outermost ones are replaced.
  const outer = blocks.filter((b) => !blocks.some((o) => o !== b && o.from <= b.from && o.to >= b.to));
  let out = markdown;
  for (const b of outer.sort((x, y) => y.from - x.from)) out = out.slice(0, b.from) + b.text + out.slice(b.to);
  return out;
}

/** Browser-only markup, as text or not at all. */
export function dropWidgets(markdown) {
  return mapProse(markdown, (text) =>
    text
      .replace(/<script\b[^>]*\bsrc=[^>]*>\s*<\/script>/gi, '')
      .replace(/<div\b[^>]*>\s*<\/div>/gi, '')
      .replace(/<video\b([^>]*)>([\s\S]*?)<\/video>/gi, (m, attrs, inner) => {
        const label = attrs.match(/aria-label=(["'])([\s\S]*?)\1/)?.[2] ?? 'Video';
        const src = inner.match(/<source\b[^>]*\bsrc=(["'])([^"']*)\1/)?.[2] ?? attrs.match(/\bsrc=(["'])([^"']*)\1/)?.[2];
        return src ? `[Video: ${label}](${src})` : `Video: ${label}`;
      })
      .replace(/<a\b[^>]*\bhref=(["'])([^"']*)\1[^>]*>([^<\n]*)<\/a>/gi, (m, q, href, label) => `[${label.trim()}](${href})`),
  );
}

/** All of the above: widgets and asides first, then the links they leave. */
export function cleanTwin(markdown, pageUrl) {
  const out = asidesToQuotes(dropWidgets(markdown));
  return collapseBlankLines(pageUrl ? absoluteLinks(out, pageUrl) : out);
}
