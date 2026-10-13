/**
 * external-links.mjs — rehype plugin: links that leave help.keboola.com open
 * in a new tab.
 *
 * A reader in the middle of a guide who follows a link out to the platform,
 * GitHub or a vendor's console lands somewhere with its own navigation (a
 * sign-up wizard, a login, a repository), and the browser's Back button no
 * longer leads back to the page. Links inside the docs stay in the same tab:
 * Back returns to the same spot on the page.
 *
 * Each external link gets target="_blank", rel="noopener", the class
 * `kbc-external` (a ↗ marker in custom.css) and a visually hidden
 * "(opens in a new tab)" for screen readers. The hidden text carries
 * data-pagefind-ignore so site search neither indexes it nor shows it in
 * excerpts. rel is "noopener" only, so Keboola's own sites, such as the sign-up
 * wizard, still see that a visitor came from the docs.
 *
 * Two kinds of links get target and rel without the rest:
 * - a link inside a heading gets no hidden text, because the heading's anchor
 *   id and its table-of-contents entry are built from the heading's text;
 * - a link whose only content is an image (a badge) gets no arrow, which
 *   would otherwise wrap onto its own line under the image.
 *
 * It handles markdown links (hast elements), raw HTML blocks in .md pages
 * (raw nodes, such as a hand-written <table>), and JSX <a> in .mdx pages
 * (mdxJsx elements). HTML that a component injects with set:html never
 * reaches a rehype plugin, so components pass those strings through
 * externalizeHtml() below (Prereqs.astro does). Pages built outside markdown,
 * such as src/pages/404.astro, aren't covered.
 */

import { visit } from 'unist-util-visit';

const SITE_HOSTS = new Set(['help.keboola.com']);
const CLASS = 'kbc-external';
const HINT = ' (opens in a new tab)';
const HINT_HTML = `<span class="sr-only" data-pagefind-ignore>${HINT}</span>`;
const REL = 'noopener';

/** True for an absolute http(s) URL on another host. */
export function isExternalHref(href) {
  if (typeof href !== 'string' || !/^https?:\/\//i.test(href)) return false;
  try {
    return !SITE_HOSTS.has(new URL(href).hostname);
  } catch {
    return false;
  }
}

const hintNode = () => ({
  type: 'element',
  tagName: 'span',
  properties: { className: ['sr-only'], dataPagefindIgnore: true },
  children: [{ type: 'text', value: HINT }],
});

const isBlankText = (n) => n.type === 'text' && !n.value.trim();
const isImage = (n) =>
  (n.type === 'element' && (n.tagName === 'img' || n.tagName === 'picture')) ||
  ((n.type === 'mdxJsxTextElement' || n.type === 'mdxJsxFlowElement') && (n.name === 'img' || n.name === 'Image'));
const imageOnly = (node) => {
  const kids = (node.children ?? []).filter((n) => !isBlankText(n));
  return kids.length > 0 && kids.every(isImage);
};

/** An existing rel, as a token list, with noopener added once. */
const withRel = (tokens) => (tokens.includes(REL) ? tokens : [...tokens, REL]);
const relTokens = (value) => (Array.isArray(value) ? value : String(value ?? '').split(/\s+/)).filter(Boolean);

function markElement(node, inHeading) {
  const props = node.properties ?? (node.properties = {});
  if (props.target) return;
  props.target = '_blank';
  props.rel = withRel(relTokens(props.rel));
  if (!imageOnly(node)) {
    const cls = Array.isArray(props.className) ? props.className : props.className ? [props.className] : [];
    props.className = [...cls, CLASS];
  }
  if (!inHeading) node.children = [...(node.children ?? []), hintNode()];
}

const isJsx = (n) => n.type === 'mdxJsxTextElement' || n.type === 'mdxJsxFlowElement';

const hrefOf = (attrs) => (attrs.match(/\bhref=(["'])([^"']+)\1/) || [])[2];
const opensNewTab = (attrs) => isExternalHref(hrefOf(attrs)) && !/\btarget=/i.test(attrs);

/** How many external <a …> in an HTML string close somewhere else. */
function unclosedExternal(html) {
  const rest = html.replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, '');
  return [...rest.matchAll(/<a\b([^>]*)>/gi)].filter((m) => opensNewTab(m[1])).length;
}

function jsxAttr(node, name) {
  return node.attributes?.find((a) => a.type === 'mdxJsxAttribute' && a.name === name);
}

function markJsx(node, inHeading) {
  if (jsxAttr(node, 'target')) return;
  const add = (name, value) => node.attributes.push({ type: 'mdxJsxAttribute', name, value });
  add('target', '_blank');
  // Extend what the author wrote rather than add a second attribute: JSX keeps
  // only the last of two, so a duplicate would drop the author's value.
  const rel = jsxAttr(node, 'rel');
  if (!rel) add('rel', REL);
  else if (typeof rel.value === 'string') rel.value = withRel(relTokens(rel.value)).join(' ');
  if (!imageOnly(node)) {
    const cls = jsxAttr(node, 'class') ?? jsxAttr(node, 'className');
    if (!cls) add('class', CLASS);
    else if (typeof cls.value === 'string') cls.value = `${cls.value} ${CLASS}`;
    // a class={expression} is left alone: the link opens in a new tab without the arrow
  }
  if (!inHeading) node.children = [...(node.children ?? []), hintNode()];
}

export default function externalLinks() {
  return (tree) => {
    // Links inside h1–h6 get no hidden text (see the header).
    // A heading is a markdown one (element) or one written as JSX in .mdx.
    const inHeading = new WeakSet();
    visit(tree, (node) => {
      const tag = node.type === 'element' ? node.tagName : isJsx(node) ? node.name : null;
      if (tag && /^h[1-6]$/.test(tag)) visit(node, (n) => void inHeading.add(n));
    });

    visit(tree, (node, index, parent) => {
      if (node.type === 'element' && node.tagName === 'a' && isExternalHref(node.properties?.href)) {
        markElement(node, inHeading.has(node));
      } else if (isJsx(node) && node.name === 'a') {
        const href = jsxAttr(node, 'href')?.value;
        if (isExternalHref(href)) markJsx(node, inHeading.has(node));
      } else if (node.type === 'raw' && /<a\s/i.test(node.value)) {
        const hint = !inHeading.has(node);
        // Inline HTML in a paragraph arrives as separate raw nodes for <a …>
        // and </a>; put the hidden text before the closing tag that follows.
        let open = hint ? unclosedExternal(node.value) : 0;
        node.value = externalizeHtml(node.value, { hint });
        for (let i = index + 1; open > 0 && parent && i < parent.children.length; i++) {
          const next = parent.children[i];
          if (next.type !== 'raw' || !next.value.includes('</a>')) continue;
          next.value = next.value.replace('</a>', `${HINT_HTML}</a>`);
          open--;
        }
      }
    });
  };
}

/** Add target, rel and (unless asked not to) the class to an <a> tag's attribute string. */
function tagAttrs(attrs, withClass) {
  // an existing rel gets noopener added; a second rel attribute would be ignored
  const rel = /\brel=(["'])([^"']*)\1/;
  let out = rel.test(attrs)
    ? `${attrs.replace(rel, (m, q, v) => `rel=${q}${withRel(relTokens(v)).join(' ')}${q}`)} target="_blank"`
    : `${attrs} target="_blank" rel="${REL}"`;
  if (!withClass) return out;
  return /\bclass=(["'])/.test(out)
    ? out.replace(/\bclass=(["'])([^"']*)\1/, (m, q, v) => `class=${q}${v} ${CLASS}${q}`)
    : `${out} class="${CLASS}"`;
}

/**
 * The same treatment for an HTML string: a component's set:html, or a raw
 * HTML block in a .md page. A whole <a …>…</a> gets the hidden text too,
 * unless `hint` is false (a link inside a heading); an opening <a …> whose
 * closing tag sits in another raw node (inline HTML in a paragraph) gets
 * target, rel and the class here, and the plugin adds the hidden text at the
 * closing tag. Tags that already have a target are left alone.
 */
export function externalizeHtml(html, { hint = true } = {}) {
  const whole = html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (m, attrs, text) => {
    if (!opensNewTab(attrs)) return m;
    const media = /^\s*<(img|picture)\b[^>]*>\s*(<\/picture>\s*)?$/i.test(text);
    return `<a${tagAttrs(attrs, !media)}>${text}${hint ? HINT_HTML : ''}</a>`;
  });
  return whole.replace(/<a\b([^>]*)>/gi, (m, attrs) =>
    opensNewTab(attrs) ? `<a${tagAttrs(attrs, true)}>` : m,
  );
}
