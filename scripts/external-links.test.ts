// Tests for src/integrations/external-links.mjs. Run: npm test
// They pin the paths where review found bugs: attributes matched by their whole
// name, an author's rel, the hint before an inline </a> that sits in a later
// raw node, image-only links, and links in headings.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import externalLinks, { externalizeHtml, isExternalHref } from '../src/integrations/external-links.mjs';

const HINT = '<span class="sr-only" data-pagefind-ignore> (opens in a new tab)</span>';

// Small hast and MDX nodes, built by hand so the tests need no parser.
const text = (value: string): any => ({ type: 'text', value });
const el = (tagName: string, properties: any = {}, children: any[] = []): any => ({ type: 'element', tagName, properties, children });
const a = (href: string, children: any[] = [text('link')], properties: any = {}): any => el('a', { href, ...properties }, children);
const raw = (value: string): any => ({ type: 'raw', value });
const jsx = (name: string, attrs: Record<string, string>, children: any[] = [], type = 'mdxJsxTextElement'): any => ({
  type,
  name,
  attributes: Object.entries(attrs).map(([n, value]) => ({ type: 'mdxJsxAttribute', name: n, value })),
  children,
});
const attrOf = (node: any, name: string) => node.attributes.filter((x: any) => x.name === name);
const isHint = (n: any) =>
  n?.type === 'element' && n.tagName === 'span' && n.properties.className?.includes('sr-only') && n.properties.dataPagefindIgnore === true;
const run = (...children: any[]) => externalLinks()({ type: 'root', children });

test('isExternalHref: only absolute http(s) URLs on another host', () => {
  assert.equal(isExternalHref('https://github.com/keboola'), true);
  assert.equal(isExternalHref('http://example.com/x'), true);
  for (const href of ['https://help.keboola.com/data-apps/', '/data-apps/', '#step-2', 'mailto:support@keboola.com', 'https://', undefined]) {
    assert.equal(isExternalHref(href), false, String(href));
  }
});

test('externalizeHtml: an external link gets target, rel, the class and the hint', () => {
  assert.equal(
    externalizeHtml('<a href="https://github.com/keboola">GitHub</a>'),
    `<a href="https://github.com/keboola" target="_blank" rel="noopener" class="kbc-external">GitHub${HINT}</a>`,
  );
});

test('externalizeHtml: internal, relative, anchor and mailto links stay as they are', () => {
  const html = '<a href="https://help.keboola.com/cli/">CLI</a> <a href="/cli/">CLI</a> <a href="#x">x</a> <a href="mailto:a@b.cz">mail</a>';
  assert.equal(externalizeHtml(html), html);
});

test('externalizeHtml: attributes in any order, and an existing class is extended', () => {
  assert.equal(
    externalizeHtml('<a class="btn" href="https://example.com">Go</a>'),
    `<a class="btn kbc-external" href="https://example.com" target="_blank" rel="noopener">Go${HINT}</a>`,
  );
});

test("externalizeHtml: an author's rel keeps its tokens and gains noopener once", () => {
  assert.equal(
    externalizeHtml('<a href="https://example.com" rel="nofollow">x</a>'),
    `<a href="https://example.com" rel="nofollow noopener" target="_blank" class="kbc-external">x${HINT}</a>`,
  );
  const out = externalizeHtml('<a href="https://example.com" rel="noopener">x</a>');
  assert.equal(out.match(/ rel=/g)?.length, 1);
  assert.match(out, / rel="noopener"/);
});

test('externalizeHtml: href, target, rel and class match by their whole name', () => {
  // data-href is not the link's address
  const internal = '<a data-href="https://example.com" href="/cli/">CLI</a>';
  assert.equal(externalizeHtml(internal), internal);
  // data-target is not a target, and data-rel and data-class stay as they are
  assert.equal(
    externalizeHtml('<a href="https://example.com" data-target="x" data-rel="y" data-class="z">x</a>'),
    `<a href="https://example.com" data-target="x" data-rel="y" data-class="z" target="_blank" rel="noopener" class="kbc-external">x${HINT}</a>`,
  );
});

test('externalizeHtml: a link that already has a target is left alone', () => {
  const html = '<a href="https://example.com" target="_self">x</a>';
  assert.equal(externalizeHtml(html), html);
});

test('externalizeHtml: an image-only link gets the hint but no arrow class', () => {
  assert.equal(
    externalizeHtml('<a href="https://example.com"><img src="/badge.svg" alt="Install"></a>'),
    `<a href="https://example.com" target="_blank" rel="noopener"><img src="/badge.svg" alt="Install">${HINT}</a>`,
  );
});

test('externalizeHtml: a link that holds only a <picture> gets no arrow class', () => {
  const pic = '<picture><source srcset="/b.avif" type="image/avif"><img src="/b.png" alt="Install"></picture>';
  assert.equal(
    externalizeHtml(`<a href="https://example.com">${pic}</a>`),
    `<a href="https://example.com" target="_blank" rel="noopener">${pic}${HINT}</a>`,
  );
});

test('externalizeHtml: hint: false leaves the hidden text out', () => {
  assert.equal(
    externalizeHtml('<a href="https://example.com">x</a>', { hint: false }),
    '<a href="https://example.com" target="_blank" rel="noopener" class="kbc-external">x</a>',
  );
});

test('externalizeHtml: a lone opening tag gets target, rel and the class, but no hint', () => {
  assert.equal(
    externalizeHtml('<a href="https://example.com">'),
    '<a href="https://example.com" target="_blank" rel="noopener" class="kbc-external">',
  );
});

test('externalizeHtml: a second run changes nothing', () => {
  const once = externalizeHtml('<p><a href="https://example.com" rel="nofollow">x</a> and <a href="https://example.org">');
  assert.equal(externalizeHtml(once), once);
});

test('plugin: a markdown link gets target, rel, the class and the hint; internal links stay', () => {
  const ext = a('https://example.com');
  const int = a('/data-apps/');
  run(el('p', {}, [ext, text(' and '), int]));
  assert.equal(ext.properties.target, '_blank');
  assert.deepEqual(ext.properties.rel, ['noopener']);
  assert.ok(ext.properties.className.includes('kbc-external'));
  assert.ok(isHint(ext.children.at(-1)));
  assert.equal(int.properties.target, undefined);
  assert.equal(int.children.length, 1);
});

test("plugin: an author's rel keeps its tokens, and an existing target is left alone", () => {
  const nofollow = a('https://example.com', [text('x')], { rel: ['nofollow'] });
  const self = a('https://example.com', [text('y')], { target: '_self' });
  run(el('p', {}, [nofollow, self]));
  assert.deepEqual(nofollow.properties.rel, ['nofollow', 'noopener']);
  assert.equal(self.properties.target, '_self');
  assert.equal(self.properties.className, undefined);
  assert.equal(self.children.length, 1);
});

test('plugin: a link in a heading, markdown or JSX, gets no hidden text', () => {
  const md = a('https://github.com');
  const mdx = jsx('a', { href: 'https://github.com' }, [text('GitHub')]);
  run(el('h2', { id: 'see-github' }, [text('See '), md]), jsx('h3', {}, [mdx], 'mdxJsxFlowElement'));
  assert.equal(md.properties.target, '_blank');
  assert.equal(md.children.length, 1);
  assert.equal(attrOf(mdx, 'target')[0]?.value, '_blank');
  assert.equal(mdx.children.length, 1);
});

test('plugin: an image-only link gets the hint but no arrow class', () => {
  const badge = a('https://example.com/install', [el('img', { src: '/badge.svg', alt: 'Install' })]);
  run(el('p', {}, [badge]));
  assert.equal(badge.properties.target, '_blank');
  assert.equal(badge.properties.className, undefined);
  assert.ok(isHint(badge.children.at(-1)));
});

test('plugin: inline raw HTML gets the hint before the </a> in a later raw node', () => {
  const open = raw('<a href="https://example.com">');
  const close = raw('</a>');
  run(el('p', {}, [text('See '), open, text('the site'), close, text('.')]));
  assert.equal(open.value, '<a href="https://example.com" target="_blank" rel="noopener" class="kbc-external">');
  assert.equal(close.value, `${HINT}</a>`);
});

test('plugin: an inline HTML badge in a paragraph gets the hint but no arrow class', () => {
  const open = raw('<a href="https://example.com">');
  const img = raw('<img src="/badge.svg" alt="Install">');
  const close = raw('</a>');
  run(el('p', {}, [open, img, close]));
  assert.equal(open.value, '<a href="https://example.com" target="_blank" rel="noopener">');
  assert.equal(close.value, `${HINT}</a>`);
});

test('plugin: an inline HTML link around a picture and text keeps the arrow class', () => {
  const open = raw('<a href="https://example.com">');
  run(el('p', {}, [open, raw('<img src="/x.svg" alt="">'), text(' GitHub'), raw('</a>')]));
  assert.match(open.value, /class="kbc-external"/);
});

test('plugin: inline raw HTML in a heading gets no hint at the closing tag', () => {
  const open = raw('<a href="https://example.com">');
  const close = raw('</a>');
  run(el('h2', {}, [open, text('site'), close]));
  assert.match(open.value, / target="_blank"/);
  assert.equal(close.value, '</a>');
});

test('plugin: a raw HTML block with a whole link gets the full treatment', () => {
  const table = raw('<table><tr><td><a href="https://example.com">x</a></td></tr></table>');
  run(table);
  assert.equal(
    table.value,
    `<table><tr><td><a href="https://example.com" target="_blank" rel="noopener" class="kbc-external">x${HINT}</a></td></tr></table>`,
  );
});

test("plugin: JSX <a> extends an author's rel instead of adding a second one", () => {
  const link = jsx('a', { href: 'https://example.com', rel: 'nofollow' }, [text('x')]);
  run(el('p', {}, [link]));
  assert.equal(attrOf(link, 'target')[0]?.value, '_blank');
  assert.deepEqual(attrOf(link, 'rel').map((x: any) => x.value), ['nofollow noopener']);
  assert.equal(attrOf(link, 'class')[0]?.value, 'kbc-external');
  assert.ok(isHint(link.children.at(-1)));
});

// set:html skips the rehype plugin, so a component that injects authored HTML
// has to call externalizeHtml() itself, as Prereqs.astro does. A new sink, or a
// rewrite that drops the call, fails here. Sinks that never carry authored links
// are listed with the reason.
const EXEMPT = [
  { file: 'Head.astro', expr: /^importMap$/, why: 'an import map, no links' },
  { file: 'FlowStrip.astro', expr: /^html$/, why: 'escaped step text with only <code> added, so it holds no <a>' },
  { file: 'NotFoundSuggestions.astro', expr: /^JSON\.stringify\(pages\)/, why: 'JSON data for a script' },
  { file: 'StageStrip.astro', expr: /^html$/, why: "the slot's HTML, which the rehype plugin has already processed" },
];

/** The expression inside each set:html={…}, braces balanced. */
function setHtmlExpressions(source: string) {
  const out: string[] = [];
  for (let i = source.indexOf('set:html={'); i !== -1; i = source.indexOf('set:html={', i + 1)) {
    const start = i + 'set:html={'.length;
    let depth = 1;
    let j = start;
    for (; j < source.length && depth > 0; j++) {
      if (source[j] === '{') depth++;
      else if (source[j] === '}') depth--;
    }
    out.push(source.slice(start, j - 1).trim());
  }
  return out;
}

test('src: every set:html runs its HTML through externalizeHtml, or is listed with a reason', () => {
  // all of src/, so a sink in a page or a layout is caught as well as one in a component
  const dir = fileURLToPath(new URL('../src/', import.meta.url));
  const files = readdirSync(dir, { recursive: true }).map(String).filter((f) => f.endsWith('.astro'));
  const sinks = files.flatMap((f) => setHtmlExpressions(readFileSync(join(dir, f), 'utf8')).map((expr) => ({ file: f, expr })));
  assert.ok(sinks.length > 0, 'no set:html found; has src/ moved?');
  const unchecked = sinks.filter(
    ({ file, expr }) => !expr.includes('externalizeHtml(') && !EXEMPT.some((e) => e.file === basename(file) && e.expr.test(expr)),
  );
  assert.deepEqual(unchecked, [], 'wrap these in externalizeHtml(), or add them to EXEMPT with the reason');
});

// The hand-built trees above can't show what the real parser hands the plugin.
// This runs a .md page through the processor Astro itself uses (resolved from
// astro's own dependencies, so it is the version the build runs), with rehype-raw
// and heading ids after the plugin, as in the build.
async function renderMd(md: string) {
  const fromAstro = createRequire(createRequire(import.meta.url).resolve('astro/package.json'));
  const { createMarkdownProcessor } = await import(pathToFileURL(fromAstro.resolve('@astrojs/markdown-remark')).href);
  const processor = await createMarkdownProcessor({ rehypePlugins: [externalLinks], syntaxHighlight: false });
  return processor.render(md);
}

test('pipeline: a .md page, with markdown links, inline HTML, a badge and an HTML block', async () => {
  const { code, metadata } = await renderMd([
    '## Install from [GitHub](https://github.com/keboola)',
    '',
    'A <a href="https://example.com"><img src="/b.svg" alt="Install"></a> badge, <a href="https://example.org">a site</a> and [the CLI](/cli/).',
    '',
    '<table><tr><td><a href="https://example.net">x</a></td></tr></table>',
  ].join('\n'));
  // the heading's link opens in a new tab, and its id and TOC text carry no hint
  assert.match(code, /<h2 id="install-from-github">Install from <a href="https:\/\/github\.com\/keboola" target="_blank" rel="noopener" class="kbc-external">GitHub<\/a><\/h2>/);
  assert.deepEqual(metadata.headings.map((h: any) => h.text), ['Install from GitHub']);
  // the inline badge: hint, no arrow class; the inline text link: both
  assert.ok(
    code.includes('<a href="https://example.com" target="_blank" rel="noopener"><img src="/b.svg" alt="Install"><span class="sr-only" data-pagefind-ignore=""> (opens in a new tab)</span></a>'),
    code,
  );
  assert.match(code, /<a href="https:\/\/example\.org" target="_blank" rel="noopener" class="kbc-external">a site<span class="sr-only"/);
  assert.match(code, /<a href="\/cli\/">the CLI<\/a>/);
  // the HTML block's link
  assert.match(code, /<a href="https:\/\/example\.net" target="_blank" rel="noopener" class="kbc-external">x<span class="sr-only"/);
});
