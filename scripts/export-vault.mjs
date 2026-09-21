#!/usr/bin/env node
/**
 * export-vault.mjs — mirror the docs into an Obsidian vault.
 *
 * One note per page at `<slug>.md` (home -> `home.md`). Internal links become
 * path wikilinks (`[[storage/api|Storage API]]`) so the Obsidian graph shows the
 * real cross-link structure of the docs; legacy `redirect_from` URLs are
 * resolved to their current target. The nav hierarchy is added as a `parent`
 * property (a wikilink, so it also shows up as a graph edge — filter it out
 * in the graph view via the `nav-edge` tag when you only want content links).
 *
 * Nothing is edited by hand in the output: re-run after every docs change.
 *
 * Usage:
 *   node scripts/export-vault.mjs [--out <dir>] [--clean] [--no-nav-edges]
 *
 *   --out          output directory (default: _graph/vault — gitignored)
 *   --clean        wipe the output directory first
 *   --no-nav-edges do not emit the `parent` wikilink property
 *
 * Also writes `<out>/_meta/report.json` with unresolved links, orphans
 * (no inbound content links) and per-section counts.
 */

import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { loadCorpus, isAssetPath, SITE, ROOT } from './lib/docs-corpus.mjs';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(name);
  return i === -1 ? def : args[i + 1];
};
const OUT = resolve(ROOT, opt('--out', '_graph/vault'));
const CLEAN = args.includes('--clean');
const NAV_EDGES = !args.includes('--no-nav-edges');

const notePath = (slug) => (slug === '' ? 'home' : slug);
const wikilink = (slug, label, anchor = '') => {
  const target = notePath(slug) + (anchor ? `#${anchor}` : '');
  return label && label !== target ? `[[${target}|${label}]]` : `[[${target}]]`;
};

const yamlStr = (s) => JSON.stringify(String(s));

function main() {
  const corpus = loadCorpus();
  const { pages, bySlug } = corpus;

  if (CLEAN && existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
  mkdirSync(join(OUT, '_meta'), { recursive: true });

  const inbound = new Map(pages.map((p) => [p.slug, new Set()]));
  const unresolved = [];
  const children = new Map();
  for (const p of pages) {
    if (p.navParent != null && bySlug.has(p.navParent)) {
      if (!children.has(p.navParent)) children.set(p.navParent, []);
      children.get(p.navParent).push(p);
    }
  }

  let linksRewritten = 0;

  for (const page of pages) {
    const outLinks = new Set();

    // [text](/path/) , [text](/path/#anchor) , [text](#anchor)
    const body = page.body.replace(
      /(!?)\[([^\]]*)\]\((\/[^)\s]*|#[^)\s]*)\)/g,
      (m, bang, text, href) => {
        if (bang) {
          // images: point at the live site so they render in Obsidian
          return `![${text}](${SITE}${href})`;
        }
        if (href.startsWith('#')) {
          return `[[#${href.slice(1)}|${text}]]`;
        }
        if (isAssetPath(href)) return `[${text}](${SITE}${href})`;

        const [path, anchor = ''] = href.split('#');
        const target = corpus.resolve(path);
        if (target == null) {
          unresolved.push({ from: page.slug, href, text });
          return m;
        }
        linksRewritten += 1;
        if (target !== page.slug) {
          outLinks.add(target);
          inbound.get(target).add(page.slug);
        }
        return wikilink(target, text, anchor);
      },
    );

    const fm = [
      '---',
      `title: ${yamlStr(page.title)}`,
      `slug: ${yamlStr(page.slug)}`,
      `url: ${page.url}`,
      `source: ${page.file}`,
      `section: ${yamlStr(page.section || 'home')}`,
      `section_title: ${yamlStr(page.sectionTitle)}`,
    ];
    if (page.description) fm.push(`description: ${yamlStr(page.description)}`);
    if (page.navDepth != null) fm.push(`nav_depth: ${page.navDepth}`);
    if (page.navOrder != null) fm.push(`nav_order: ${page.navOrder}`);
    fm.push(`in_nav: ${page.inNav}`);
    if (NAV_EDGES && page.navParent != null && bySlug.has(page.navParent)) {
      fm.push(`parent: ${yamlStr(wikilink(page.navParent))}`);
    }
    if (page.redirectFrom.length) {
      fm.push('legacy_urls:');
      for (const r of page.redirectFrom) fm.push(`  - /${r}/`);
    }
    fm.push('tags:', `  - section/${page.section || 'home'}`);
    if (!page.inNav) fm.push('  - not-in-nav');
    fm.push(`aliases:`, `  - ${yamlStr(page.title)}`);
    fm.push('---', '');

    const kids = children.get(page.slug) ?? [];
    const navSection = kids.length
      ? ['', '## Pages in this section (nav)', '', ...kids.map((k) => `- ${wikilink(k.slug, k.title)}`), '']
      : [];

    const note = [...fm, `# ${page.title}`, '', body, ...navSection].join('\n');
    const file = join(OUT, `${notePath(page.slug)}.md`);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, note);
    page._outLinks = outLinks;
  }

  // ---- report -------------------------------------------------------------
  const orphans = pages
    .filter((p) => inbound.get(p.slug).size === 0 && p.slug !== '')
    .map((p) => ({ slug: p.slug, title: p.title, section: p.section, in_nav: p.inNav }));
  const deadEnds = pages
    .filter((p) => p._outLinks.size === 0)
    .map((p) => ({ slug: p.slug, title: p.title, section: p.section }));
  const sections = {};
  for (const p of pages) {
    const s = p.section || 'home';
    sections[s] ??= { pages: 0, out_links: 0, in_links: 0 };
    sections[s].pages += 1;
    sections[s].out_links += p._outLinks.size;
    sections[s].in_links += inbound.get(p.slug).size;
  }

  const report = {
    generated: new Date().toISOString(),
    pages: pages.length,
    links_rewritten: linksRewritten,
    unresolved_links: unresolved.length,
    orphans: orphans.length,
    dead_ends: deadEnds.length,
    sections,
    orphan_pages: orphans,
    dead_end_pages: deadEnds,
    unresolved: unresolved,
  };
  writeFileSync(join(OUT, '_meta', 'report.json'), JSON.stringify(report, null, 2));

  const edges = [];
  for (const p of pages) for (const t of p._outLinks) edges.push(`${p.slug}\t${t}`);
  writeFileSync(join(OUT, '_meta', 'edges.tsv'), ['source\ttarget', ...edges].join('\n') + '\n');

  writeFileSync(
    join(OUT, '_meta', 'README.md'),
    [
      '# Generated vault — do not edit',
      '',
      'Regenerate with `npm run export:vault` from the connection-docs repo.',
      '',
      '- One note per docs page, path = slug. Internal links are wikilinks; legacy URLs are resolved.',
      '- `parent` property = nav hierarchy (also a graph edge). Content links are what the body contains.',
      '- Graph tips: colour groups by `tag:#section/…`; filter `-tag:#not-in-nav` to hide stray pages.',
      '- `report.json` lists orphans (no inbound content links), dead ends, unresolved links.',
      '- `edges.tsv` is the content-link graph for networkx/Gephi.',
      '',
    ].join('\n'),
  );

  console.log(
    `vault: ${OUT}\n` +
      `pages ${pages.length} | links rewritten ${linksRewritten} | unresolved ${unresolved.length} | ` +
      `orphans ${orphans.length} | dead ends ${deadEnds.length}`,
  );
  if (unresolved.length) {
    console.log('unresolved (first 10):');
    for (const u of unresolved.slice(0, 10)) console.log(`  ${u.from} -> ${u.href}`);
  }
}

main();
