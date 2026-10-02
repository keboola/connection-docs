import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { sharedText, tabsText, LABELS as PREREQ_LABELS } from '../components/prereqs.mjs';

/**
 * Astro integration that emits a raw-markdown copy of every docs page.
 *
 * For each content file with a `slug` in its frontmatter, this writes the
 * page's source markdown (frontmatter stripped, `# <title>` prepended) to
 * `<outDir>/<slug>/index.md`, so every published page is also reachable as
 * plain markdown at `https://help.keboola.com/<slug>/index.md` — for the
 * "View as Markdown" page action and for LLMs/agents ingesting the docs.
 *
 * It also writes `<outDir>/llms.txt` — the index that makes those per-page
 * markdown copies discoverable. Without it an agent has to already know a slug
 * to find anything; the raw pages were being emitted with no entry point.
 *
 * Runs in the `astro:build:done` hook, after all pages have been built.
 * Follows the same pattern as redirect-from.mjs.
 */

/**
 * Recursively find all .md and .mdx files in a directory.
 */
function findMarkdownFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      findMarkdownFiles(full, files);
    } else if (extname(full) === '.md' || extname(full) === '.mdx') {
      files.push(full);
    }
  }
  return files;
}

/**
 * Inline JSX and HTML a page writes by hand, as markdown.
 *
 * The <li> children a page passes into <Prereqs> come through the slot as raw
 * source — `<code>x</code>` and `from{' '}<a href="/y/">Y</a>` — which is
 * unreadable in the twin and, worse, hides the one prerequisite the page cared
 * enough to spell out.
 */
function inlineToMarkdown(line) {
  return line
    .replace(/\{'\s*'\}/g, ' ')
    .replace(/<a href="([^"]+)">([^<]*)<\/a>/g, '$2 ($1)')
    .replace(/<\/?(code|strong|em|b|i)>/g, (m) => (m.includes('code') ? '`' : '**'))
    .replace(/<li(?:\s[^>]*)?>\s*/g, '- ')
    .replace(/\s*<\/li>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Render <Prereqs needs={[…]}> as text.
 *
 * The component's own markup is dropped with every other component wrapper,
 * which would take the prerequisites with it: the twin would tell an agent to
 * load data without mentioning that a project has to exist first. The wording
 * comes from the same table the component renders (prereqs.mjs), so the two
 * cannot drift.
 */
function prereqsToText(tag) {
  const needs = tag.match(/needs=\{\[([^\]]*)\]\}/);
  const keys = needs
    ? needs[1].split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)
    : ['project'];
  const lines = keys.map(sharedText).filter(Boolean);
  // The "You need" heading prints even with no shared items: the page's own
  // <li> children follow it.
  return ['', `**${PREREQ_LABELS.box}**`, '', `${PREREQ_LABELS.needs}:`, '', ...lines.map((l) => `- ${l}`)];
}

/** The second list of <Prereqs>, under the page's own `groupLabel`. */
function prereqsGroupToText(tag, items) {
  const label = tag.match(/\bgroupLabel="([^"]*)"/);
  if (!label || !items.length) return [];
  return ['', `${label[1]}:`, '', ...items];
}

/** The tab list of <Prereqs>, one line per tab, printed after the page's own items. */
function prereqsTabsToText(tag, overrides = {}) {
  const tabs = tag.match(/tabs=\{(\d)\}/);
  const count = tabs ? Number(tabs[1]) : 0;
  if (!count) return [''];
  return ['', `${PREREQ_LABELS.tabs}:`, '', ...tabsText(count, overrides).map((l) => `- ${l}`), ''];
}

/**
 * Drop the <span data-pagefind-…> wrappers a page adds to tune site search.
 * A reader of the twin gets nothing from them, and in a heading they print as
 * raw HTML: `#### <span data-pagefind-weight="5">Apps pricing</span>`.
 */
function stripSearchMarkup(text) {
  return text.replace(/<span\b(?=[^>]*\bdata-pagefind-)[^>]*>([\s\S]*?)<\/span>/g, '$1');
}

/**
 * Reduce an .mdx body to plain markdown.
 *
 * The raw-markdown copies exist so an agent can read a page as text, so MDX
 * machinery has to come out rather than ship verbatim: a stray
 * `import ... from '@astrojs/starlight/components';` or a bare `<Tabs>` tag is
 * noise at best and misleading at worst.
 *
 * Component wrappers are dropped and their children kept, which flattens a
 * tabbed page into its sections one after another — the right shape for a
 * reader who cannot click a tab. Children are also dedented by one level per
 * wrapper, because MDX authors indent them and four leading spaces would
 * otherwise turn ordinary prose into an indented code block.
 *
 * Components are matched on an uppercase initial, the JSX convention, so
 * lowercase HTML written inline in a page is left alone. Three of them carry
 * meaning a reader needs and are rendered rather than dropped: a tab's
 * `label`, <Prereqs>, and <StageStrip>, which prints as a numbered list.
 * MDX comments become HTML comments, except inside those two lists, where
 * they are dropped.
 */
function stripMdx(body) {
  const withoutImports = body.replace(/^import\s[^\n]*?;\s*$/gm, '');
  const withComments = withoutImports.replace(
    /\{\/\*([\s\S]*?)\*\/\}/g,
    (_, inner) => `<!--${inner}-->`,
  );

  const INDENT = '    ';
  // Comments inside <Prereqs> and <StageStrip> are dropped: a markdown list
  // can't hold them, and glued to the next item they'd hide its slot="group".
  const COMMENT = /<!--[\s\S]*?-->/g;
  const open = /^\s*<[A-Z][A-Za-z0-9]*\b[^>]*(?<!\/)>\s*$/;
  const selfClosing = /^\s*<[A-Z][A-Za-z0-9]*\b[^>]*\/>\s*$/;
  const close = /^\s*<\/[A-Z][A-Za-z0-9]*\s*>\s*$/;

  let depth = 0;
  let inStrip = false;
  let stripN = 0;
  let inPrereqs = false;
  let prereqsTag = '';
  let prereqsTabs = {};
  const groupItems = [];
  const slot = [];
  const out = [];

  for (const line of withComments.split('\n')) {
    if (selfClosing.test(line)) {
      if (/^\s*<Prereqs\b/.test(line)) out.push(...prereqsToText(line), ...prereqsTabsToText(line));
      continue;
    }
    if (close.test(line)) {
      depth = Math.max(0, depth - 1);
      if (/^\s*<\/StageStrip>/.test(line)) { inStrip = false; slot.length = 0; out.push(''); }
      if (/^\s*<\/Prereqs>/.test(line)) {
        out.push(...prereqsGroupToText(prereqsTag, groupItems), ...prereqsTabsToText(prereqsTag, prereqsTabs));
        inPrereqs = false;
        prereqsTabs = {};
        groupItems.length = 0;
        slot.length = 0;
      }
      continue;
    }
    if (open.test(line)) {
      // A tab or card carries its identity in `label`; without it the
      // flattened sections run together and a reader cannot tell which
      // variant is which.
      const label = line.match(/\blabel=["']([^"']+)["']/);
      if (label) out.push('', `**${label[1]}**`, '');
      // <Prereqs needs={…}> with page-specific <li> children in its slots: the
      // shared lines go in first, the children follow as the lists they are.
      if (/^\s*<Prereqs\b/.test(line)) { out.push(...prereqsToText(line)); inPrereqs = true; prereqsTag = line; }
      if (/^\s*<StageStrip\b/.test(line)) { inStrip = true; stripN = 0; }
      depth += 1;
      continue;
    }

    let text = line;
    for (let i = 0; i < depth && text.startsWith(INDENT); i += 1) {
      text = text.slice(INDENT.length);
    }
    if (inStrip) {
      // one <li> per stage: flatten it, number it, and end the bold title with a period
      slot.push(text);
      if (/<\/li>/.test(text)) {
        const item = inlineToMarkdown(slot.join(' ').replace(COMMENT, '')).replace(/^- /, '');
        slot.length = 0;
        if (item) out.push(`${++stripN}. ${item.replace(/^\*\*(.+?)\*\*\s*/, '**$1.** ')}`);
      }
      continue;
    }
    if (inPrereqs) {
      // the slots hold raw <li> JSX, or a tab's own line as <span slot="…">;
      // buffer until the item closes, then flatten
      slot.push(text);
      const joined = slot.join(' ').replace(COMMENT, '');
      const tabLine = joined.match(/^\s*<span slot="(prompt|ui|cli)">([\s\S]*)<\/span>\s*$/);
      if (tabLine) {
        prereqsTabs[tabLine[1]] = inlineToMarkdown(tabLine[2]);
        slot.length = 0;
        continue;
      }
      if (/<\/li>/.test(text)) {
        const item = inlineToMarkdown(joined);
        // <li slot="group"> items belong to the second list, printed at </Prereqs>
        if (item) (/^\s*<li\s+slot="group"/.test(joined) ? groupItems : out).push(item.startsWith('- ') ? item : `- ${item}`);
        slot.length = 0;
      }
      continue;
    }
    out.push(text);
  }

  return out.join('\n').replace(/\n{3,}/g, '\n\n');
}

/**
 * Parse YAML frontmatter from a markdown file's content.
 * Extracts only scalar fields (we need `slug` and `title`).
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const fm = {};
  for (const line of match[1].split('\n')) {
    const keyVal = line.replace(/\r$/, '').match(/^([\w][\w_-]*):\s*(.*)/);
    if (keyVal) {
      const val = keyVal[2].trim();
      if (val) fm[keyVal[1]] = val.replace(/^['"]|['"]$/g, '');
    }
  }
  return fm;
}

/**
 * Strip the frontmatter block from a markdown file's content.
 */
function stripFrontmatter(content) {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
}

/**
 * Build the llms.txt index from the pages we just emitted.
 *
 * Grouped by top-level slug segment, and each group is titled with that
 * section's own root page ("storage" -> "Storage") rather than a slug
 * prettified by hand, so the index and the nav cannot drift apart.
 */
function buildLlmsTxt(site, siteTitle, pages) {
  const byTitle = new Map(pages.map((p) => [p.slug, p.title]));
  const url = (slug) => new URL(slug ? `/${slug}/` : '/', site).href;

  const sections = new Map();
  for (const page of pages) {
    const key = page.slug.split('/')[0];
    if (!sections.has(key)) sections.set(key, []);
    sections.get(key).push(page);
  }

  const lines = [
    `# ${siteTitle}`,
    '',
    '> Product documentation for Keboola, the data platform: loading and storing data,',
    '> transformations, flows, apps, AI features, and extending the platform with',
    '> your own components.',
    '',
    'Every page below is also available as plain markdown by appending `index.md` to its',
    'URL — for example `https://help.keboola.com/storage/index.md`.',
    '',
  ];

  const root = sections.get('') ?? [];
  sections.delete('');
  if (root.length) {
    lines.push('## Home', '');
    for (const p of root) lines.push(entry(p, url));
    lines.push('');
  }

  // `pages` arrives sorted by slug, so each group is already in order.
  for (const key of [...sections.keys()].sort()) {
    const group = sections.get(key);
    lines.push(`## ${byTitle.get(key) ?? key}`, '');
    for (const p of group) lines.push(entry(p, url));
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * One index line. The label is escaped because an unescaped `]` in a title
 * closes the link early and spills the rest into the URL position; the
 * description is flattened because the scalar frontmatter parser can hand back
 * a value with stray whitespace, and a newline would end the entry mid-line.
 */
function entry(page, url) {
  const label = String(page.title).replace(/([[\]])/g, '\\$1');
  const description = page.description ? String(page.description).replace(/\s+/g, ' ').trim() : '';
  const suffix = description ? `: ${description}` : '';
  return `- [${label}](${url(page.slug)})${suffix}`;
}

export default function pageMarkdown({ siteTitle = 'Keboola User Documentation' } = {}) {
  let site;

  return {
    name: 'page-markdown',
    hooks: {
      'astro:config:done': ({ config }) => {
        site = config.site;
      },
      'astro:build:done': async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);

        // Resolve src/content/docs relative to this integration file.
        const thisDir = fileURLToPath(new URL('.', import.meta.url));
        const contentDir = join(thisDir, '..', 'content', 'docs');

        if (!existsSync(contentDir)) {
          logger.warn(`Content directory not found: ${contentDir}`);
          return;
        }

        let written = 0;
        let skipped = 0;
        const index = [];

        for (const file of findMarkdownFiles(contentDir)) {
          const content = readFileSync(file, 'utf-8');
          const fm = parseFrontmatter(content);

          // Pages without a slug aren't published; the 404 page has no
          // canonical URL worth mirroring.
          if (fm.slug === undefined || fm.slug === '404') continue;

          // Index before the collision guard below: a page that loses the race
          // for its index.md is still published as HTML, and leaving it out of
          // llms.txt would make it exactly as undiscoverable as having no index
          // at all. A folded or literal block scalar (`>`/`|`) is not a
          // one-liner, and the scalar-only frontmatter parser above would hand
          // back the indicator rather than the text.
          const description =
            fm.description && !/^[>|]/.test(fm.description) ? fm.description : '';
          index.push({ slug: fm.slug, title: fm.title ?? fm.slug, description });

          const mdDir = fm.slug ? join(outDir, fm.slug) : outDir;
          const mdFile = join(mdDir, 'index.md');

          // Never clobber an existing file (e.g. two sources mapping to one slug).
          if (existsSync(mdFile)) {
            logger.warn(`Skipping ${fm.slug || '/'} (index.md already exists)`);
            skipped++;
            continue;
          }

          const isMdx = extname(file) === '.mdx';
          const raw = stripFrontmatter(content);
          const body = stripSearchMarkup(isMdx ? stripMdx(raw) : raw).trim();
          const md = (fm.title ? `# ${fm.title}\n\n` : '') + body + '\n';

          mkdirSync(mdDir, { recursive: true });
          writeFileSync(mdFile, md);
          written++;
        }

        logger.info(`Emitted ${written} raw-markdown pages (${skipped} skipped)`);

        if (site) {
          index.sort((a, b) => a.slug.localeCompare(b.slug));
          writeFileSync(join(outDir, 'llms.txt'), buildLlmsTxt(site, siteTitle, index));
          logger.info(`Wrote llms.txt indexing ${index.length} pages`);
        } else {
          logger.warn('No `site` configured — skipping llms.txt');
        }
      },
    },
  };
}
