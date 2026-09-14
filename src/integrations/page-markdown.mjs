import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { sharedText } from '../components/getting-started/prereqs.mjs';

/**
 * Astro integration that emits a raw-markdown copy of every docs page.
 *
 * For each content file with a `slug` in its frontmatter, this writes the
 * page's source markdown (frontmatter stripped, `# <title>` prepended) to
 * `<outDir>/<slug>/index.md`, so every published page is also reachable as
 * plain markdown at `https://help.keboola.com/<slug>/index.md` — for the
 * "View as Markdown" page action and for LLMs/agents ingesting the docs.
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
 * Authoring comments never reach the published markdown.
 *
 * Both comment forms carry the same thing: provenance for whoever edits the
 * page next — live-walk dates, job and configuration IDs from the demo
 * project, exception IDs, VERIFY(owner) flags, notes about what is visible in
 * a capture. That is internal (PRDCT-616), and the markdown twin is public and
 * machine-read, so it is stripped here rather than translated. Rationale that
 * outlives an edit belongs in DECISIONS.md, which is version-controlled and
 * not served.
 */
function stripComments(body) {
  return body
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')   // MDX  {/* … */}
    .replace(/<!--[\s\S]*?-->/g, '');       // HTML <!-- … -->
}

/**
 * Render <Prereqs needs={[…]}> as text.
 *
 * The component's own markup is dropped with every other component wrapper,
 * which used to take the prerequisites with it: the twin told an agent to load
 * data without mentioning that a project has to exist first. The wording comes
 * from the same table the component renders (prereqs.mjs), so the two cannot
 * drift.
 */
function prereqsToText(tag) {
  const needs = tag.match(/needs=\{\[([^\]]*)\]\}/);
  const keys = needs
    ? needs[1].split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)
    : ['project'];
  const lines = keys.map(sharedText).filter(Boolean);
  if (!lines.length) return [];
  return ['', '**Before you start**', '', ...lines.map((l) => `- ${l}`), ''];
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
 * lowercase HTML written inline in a page is left alone. Two of them carry
 * meaning a reader needs and are rendered rather than dropped: a tab's
 * `label`, and <Prereqs>.
 */
function stripMdx(body) {
  const withoutImports = body.replace(/^import\s[^\n]*?;\s*$/gm, '');
  const withoutComments = stripComments(withoutImports);

  const INDENT = '    ';
  const open = /^\s*<[A-Z][A-Za-z0-9]*\b[^>]*(?<!\/)>\s*$/;
  const selfClosing = /^\s*<[A-Z][A-Za-z0-9]*\b[^>]*\/>\s*$/;
  const close = /^\s*<\/[A-Z][A-Za-z0-9]*\s*>\s*$/;

  let depth = 0;
  const out = [];

  for (const line of withoutComments.split('\n')) {
    if (selfClosing.test(line)) {
      if (/^\s*<Prereqs\b/.test(line)) out.push(...prereqsToText(line));
      continue;
    }
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
      // <Prereqs needs={…}> with page-specific <li> children in its slot: the
      // shared lines go in first, the children follow as the list they are.
      if (/^\s*<Prereqs\b/.test(line)) out.push(...prereqsToText(line));
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

export default function pageMarkdown() {
  return {
    name: 'page-markdown',
    hooks: {
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

        for (const file of findMarkdownFiles(contentDir)) {
          const content = readFileSync(file, 'utf-8');
          const fm = parseFrontmatter(content);

          // Pages without a slug aren't published; the 404 page has no
          // canonical URL worth mirroring.
          if (fm.slug === undefined || fm.slug === '404') continue;

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
          // .md pages carry the same authoring notes as HTML comments.
          const body = (isMdx ? stripMdx(raw) : stripComments(raw)).replace(/\n{3,}/g, '\n\n').trim();
          const md = (fm.title ? `# ${fm.title}\n\n` : '') + body + '\n';

          mkdirSync(mdDir, { recursive: true });
          writeFileSync(mdFile, md);
          written++;
        }

        logger.info(`Emitted ${written} raw-markdown pages (${skipped} skipped)`);
      },
    },
  };
}
