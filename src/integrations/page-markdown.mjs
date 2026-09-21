import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

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
 * lowercase HTML written inline in a page is left alone.
 */
function stripMdx(body) {
  const withoutImports = body.replace(/^import\s[^\n]*?;\s*$/gm, '');
  const withComments = withoutImports.replace(
    /\{\/\*([\s\S]*?)\*\/\}/g,
    (_, inner) => `<!--${inner}-->`,
  );

  const INDENT = '    ';
  const open = /^\s*<[A-Z][A-Za-z0-9]*\b[^>]*(?<!\/)>\s*$/;
  const selfClosing = /^\s*<[A-Z][A-Za-z0-9]*\b[^>]*\/>\s*$/;
  const close = /^\s*<\/[A-Z][A-Za-z0-9]*\s*>\s*$/;

  let depth = 0;
  const out = [];

  for (const line of withComments.split('\n')) {
    if (selfClosing.test(line)) continue;
    if (close.test(line)) {
      depth = Math.max(0, depth - 1);
      continue;
    }
    if (open.test(line)) {
      // A tab or card carries its identity in `label`; without it the
      // flattened sections run together and a reader cannot tell which
      // variant is which.
      const label = line.match(/\blabel=["']([^"']+)["']/);
      if (label) out.push('', `**${label[1]}**`, '');
      depth += 1;
      continue;
    }

    let text = line;
    for (let i = 0; i < depth && text.startsWith(INDENT); i += 1) {
      text = text.slice(INDENT.length);
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
    '> transformations, flows, data apps, AI features, and extending the platform with',
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
          const body = (isMdx ? stripMdx(raw) : raw).trim();
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
