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
 * Each external link gets target="_blank", rel="noopener noreferrer", the
 * class `kbc-external` (a ↗ marker in custom.css) and a visually hidden
 * "(opens in a new tab)" for screen readers.
 *
 * It handles markdown links (hast elements), raw HTML blocks in .md pages
 * (raw nodes, such as a hand-written <table>), and JSX <a> in .mdx pages
 * (mdxJsx elements). HTML that a component injects with set:html never
 * reaches a rehype plugin, so components pass those strings through
 * externalizeHtml() below (Prereqs.astro does).
 */

import { visit } from 'unist-util-visit';

const SITE_HOSTS = new Set(['help.keboola.com']);
const CLASS = 'kbc-external';
const HINT = ' (opens in a new tab)';

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
  properties: { className: ['sr-only'] },
  children: [{ type: 'text', value: HINT }],
});

function markElement(node) {
  const props = node.properties ?? (node.properties = {});
  if (props.target) return;
  props.target = '_blank';
  props.rel = ['noopener', 'noreferrer'];
  const cls = Array.isArray(props.className) ? props.className : props.className ? [props.className] : [];
  props.className = [...cls, CLASS];
  node.children = [...(node.children ?? []), hintNode()];
}

function jsxAttr(node, name) {
  return node.attributes?.find((a) => a.type === 'mdxJsxAttribute' && a.name === name);
}

function markJsx(node) {
  if (jsxAttr(node, 'target')) return;
  const add = (name, value) => node.attributes.push({ type: 'mdxJsxAttribute', name, value });
  add('target', '_blank');
  add('rel', 'noopener noreferrer');
  const cls = jsxAttr(node, 'class') ?? jsxAttr(node, 'className');
  if (cls && typeof cls.value === 'string') cls.value = `${cls.value} ${CLASS}`;
  else add('class', CLASS);
  node.children = [...(node.children ?? []), hintNode()];
}

export default function externalLinks() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type === 'element' && node.tagName === 'a' && isExternalHref(node.properties?.href)) {
        markElement(node);
      } else if (
        (node.type === 'mdxJsxTextElement' || node.type === 'mdxJsxFlowElement') &&
        node.name === 'a'
      ) {
        const href = jsxAttr(node, 'href')?.value;
        if (isExternalHref(href)) markJsx(node);
      } else if (node.type === 'raw' && /<a\s/i.test(node.value)) {
        node.value = externalizeHtml(node.value);
      }
    });
  };
}

/**
 * The same treatment for an HTML string: a component's set:html, or a raw
 * HTML block in a .md page. Changes `<a href=…>` tags whose href comes first
 * and that have no target yet; an existing class attribute gets the class
 * added to it.
 */
export function externalizeHtml(html) {
  return html.replace(
    /<a\s+href=(["'])([^"']+)\1([^>]*)>([\s\S]*?)<\/a>/g,
    (whole, q, href, rest, text) => {
      if (!isExternalHref(href) || /\btarget=/i.test(rest)) return whole;
      const attrs = /\bclass=(["'])/.test(rest)
        ? rest.replace(/\bclass=(["'])([^"']*)\1/, (m, cq, v) => `class=${cq}${v} ${CLASS}${cq}`)
        : `${rest} class="${CLASS}"`;
      return `<a href=${q}${href}${q} target="_blank" rel="noopener noreferrer"${attrs}>${text}<span class="sr-only">${HINT}</span></a>`;
    },
  );
}
