import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { sharedText, tabsText, linksToText, LABELS as PREREQ_LABELS } from '../components/prereqs.mjs';
import { stripHtmlComments, collapseBlankLines } from './strip-comments.mjs';
import { pathIntroText } from '../components/getting-started/pathintro.mjs';
import { courseListText, courseBarText } from '../components/getting-started/course.mjs';
import { sampleText } from '../components/getting-started/sample.mjs';

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
 * Read the props off a one-line component tag, for the components whose text a
 * reader of the twin needs. Attributes are read left to right, so a word inside
 * a quoted value is never taken for a prop of its own: `"…"` and `'…'` are
 * strings, `{…}` keeps a number or boolean as one and drops a string
 * literal's quotes, and a bare name is `true`.
 */
function tagProps(tag) {
  const props = {};
  const attrs = tag.replace(/^\s*<[A-Za-z][\w.]*/, '').replace(/\/?>\s*$/, '');
  for (const [, name, dq, sq, expr] of attrs.matchAll(/([\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)\}))?/g)) {
    if (dq !== undefined) props[name] = dq;
    else if (sq !== undefined) props[name] = sq;
    else if (expr !== undefined) props[name] = exprValue(expr.trim());
    else props[name] = true;
  }
  return props;
}

/** The value of a `{…}` prop: the literal where it is one, else the source text. */
function exprValue(raw) {
  if (raw === 'true' || raw === 'false') return raw === 'true';
  if (/^\d+$/.test(raw)) return Number(raw);
  const str = raw.match(/^(["'`])([\s\S]*)\1$/);
  return str ? str[2] : raw;
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
  return linksToText(line.replace(/\{'\s*'\}/g, ' '))
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
 * which used to take the prerequisites with it: the twin told an agent to load
 * data without mentioning that a project has to exist first. The wording comes
 * from the same table the component renders (prereqs.mjs), so the two cannot
 * drift.
 */
function prereqsToText(tag, { mayHaveOwn = false } = {}) {
  const needs = tag.match(/needs=\{\[([^\]]*)\]\}/);
  const keys = needs
    ? needs[1].split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)
    : ['project'];
  const lines = keys.map(sharedText).filter(Boolean);
  // The "You need" heading prints when something can follow it: shared items,
  // or the page's own <li> children (project/ has only those). An open tag
  // that ends up with no items takes the heading back out at its close tag
  // (check/ passes needs={[]} and only the from/to slots).
  const heading = lines.length || mayHaveOwn ? [`${PREREQ_LABELS.needs}:`, ''] : [];
  return ['', `**${PREREQ_LABELS.box}**`, '', ...heading, ...lines.map((l) => `- ${l}`)];
}

/** The list under the page's own `groupLabel`, from its <li slot="group"> children. */
function prereqsGroupToText(tag, items) {
  const label = tag.match(/\bgroupLabel="([^"]*)"/);
  if (!label || !items.length) return [];
  return ['', `${label[1]}:`, '', ...items];
}

/** The tab lines of <Prereqs>, one per tab, printed after the page's own items. */
function prereqsTabsToText(tag, overrides = {}) {
  const tabs = tag.match(/tabs=\{(\d)\}/);
  const count = tabs ? Number(tabs[1]) : 0;
  if (!count) return [''];
  return ['', `${PREREQ_LABELS.tabs}:`, '', ...tabsText(count, overrides).map((l) => `- ${l}`), ''];
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
 * reader who cannot click a tab. Each tab's label becomes a heading, and a
 * rule closes the group, so what follows the tabs does not read as part of
 * the last one. Children are also dedented by the indentation their author
 * actually gave them inside the wrapper (measured on the first child line),
 * because four leading spaces would otherwise turn ordinary prose into an
 * indented code block; children written flush left keep their own list and
 * code indentation (2026-09-29: load/'s steps 10-13 lost theirs).
 *
 * Components are matched on an uppercase initial, the JSX convention, so
 * lowercase HTML written inline in a page is left alone. Several carry
 * meaning a reader needs and are rendered rather than dropped: a tab's
 * `label`, <Prereqs> (src/components/Prereqs.astro), <StageStrip> as a
 * numbered list, and the Getting Started pictures below. MDX comments become
 * HTML comments, which the caller removes with stripHtmlComments
 * (strip-comments.mjs), outside fenced code; inside the <Prereqs> and
 * <StageStrip> lists they are dropped here.
 */
export function stripMdx(body) {
  const withoutImports = body.replace(/^import\s[^\n]*?;\s*$/gm, '');
  // <details> is how a page folds away what most readers can skip; the twin
  // has no folding, so the summary becomes a bold line and the rest follows.
  // The <summary> may share the <details> line or have its own; either way it
  // is one line, so a fold written another way is left as it is rather than
  // run on into the text below it.
  const fold = (t) => `**${t.trim().replace(/<\/?code>/g, '`')}**`;
  const withoutComments = withoutImports
    .replace(/\{\/\*([\s\S]*?)\*\/\}/g, (_, inner) => `<!--${inner}-->`)
    .replace(/^[ \t]*<details[^>]*>[ \t]*<summary>([^\n]*?)<\/summary>[ \t]*$/gm, (m, t) => fold(t))
    .replace(/^[ \t]*<details[^>]*>[ \t]*$/gm, '')
    .replace(/^[ \t]*<\/details>[ \t]*$/gm, '')
    .replace(/^[ \t]*<summary>([^\n]*?)<\/summary>[ \t]*$/gm, (m, t) => fold(t));
  const COMMENT = /<!--[\s\S]*?-->/g;

  const open = /^\s*<[A-Z][A-Za-z0-9]*\b[^>]*(?<!\/)>\s*$/;
  const selfClosing = /^\s*<[A-Z][A-Za-z0-9]*\b[^>]*\/>\s*$/;
  const close = /^\s*<\/[A-Z][A-Za-z0-9]*\s*>\s*$/;

  const indents = [];   // extra indentation of each open wrapper's children
  const stripOf = () => indents.reduce((a, b) => a + b, 0);
  const lead = (l) => l.length - l.trimStart().length;
  let inPrereqs = false;
  let prereqsItems = 0;
  let lastHeading = 2;  // level of the latest markdown heading outside code
  let tabsLevel = 3;    // tab labels sit one level below the section that holds the tabs
  let prereqsTag = '';
  let prereqsTabs = {};
  let prereqsState = {};
  let prereqsStart = -1;
  let inStrip = false;
  let stripN = 0;
  const groupItems = [];
  const slot = [];
  const out = [];

  // Inside a fenced code block the code's own indentation is content: YAML
  // nests by it. Such a line loses only what its opening fence lost to the
  // wrapper dedent, and is never read as a component tag. (2026-09-29: the
  // flow.yaml on automate/ lost every 4-space level and no longer parsed.)
  let fence = null;

  const lines = withoutComments.split('\n');
  for (let n = 0; n < lines.length; n += 1) {
    const line = lines[n];
    if (fence) {
      const text = fence.strip && line.startsWith(' '.repeat(fence.strip)) ? line.slice(fence.strip) : line;
      const closer = line.match(/^\s*(`{3,}|~{3,})\s*$/);
      if (closer && closer[1][0] === fence.marker[0] && closer[1].length >= fence.marker.length) fence = null;
      out.push(text);
      continue;
    }
    if (selfClosing.test(line)) {
      if (/^\s*<Prereqs\b/.test(line)) out.push(...prereqsToText(line), ...prereqsTabsToText(line));
      if (/^\s*<PathIntro\b/.test(line)) {
        out.push('', ...pathIntroText(tagProps(line)).map((p) => p + '\n'));
      }
      // The Getting Started pictures carry text a reader needs: where a step
      // sits in the course, the sample tables, a process drawn as boxes, a card
      // that links somewhere. Each comes from the same data as the component.
      if (/^\s*<CourseLine\b/.test(line)) {
        const props = tagProps(line);
        const text = props.layout === 'list' ? courseListText() : courseBarText(props.current);
        out.push('', ...text, '');
      }
      if (/^\s*<SampleData\b/.test(line)) out.push('', ...sampleText(), '');
      if (/^\s*<FromTo\b/.test(line)) {
        const { from, to } = tagProps(line);
        out.push('', `**${PREREQ_LABELS.from}:** ${from} **${PREREQ_LABELS.to}:** ${to}`, '');
      }
      if (/^\s*<FlowStrip\b/.test(line)) {
        const steps = String(tagProps(line).steps ?? '').split('|').map((x) => x.trim()).filter(Boolean);
        if (steps.length) out.push('', steps.join(' → '), '');
      }
      if (/^\s*<LinkCard\b/.test(line)) {
        const { title, href, description } = tagProps(line);
        if (title && href) out.push(`- [${title}](${href})${description ? `: ${description}` : ''}`);
      }
      continue;
    }
    if (close.test(line)) {
      indents.pop();
      if (/^\s*<\/Tabs>/.test(line)) out.push('', '---', '');
      if (/^\s*<\/StageStrip>/.test(line)) { inStrip = false; slot.length = 0; out.push(''); }
      if (/^\s*<\/Prereqs>/.test(line)) {
        if (!prereqsItems && out[prereqsStart + 3] === `${PREREQ_LABELS.needs}:`) out.splice(prereqsStart + 3, 2);
        out.push(...prereqsGroupToText(prereqsTag, groupItems), ...prereqsTabsToText(prereqsTag, prereqsTabs));
        // "Where you are" and "When you finish" arrive in the slot but read
        // first, straight under the box's heading, as they do on the page
        const state = [
          prereqsState.from && `**${PREREQ_LABELS.from}:** ${prereqsState.from}`,
          prereqsState.to && `**${PREREQ_LABELS.to}:** ${prereqsState.to}`,
        ].filter(Boolean);
        if (state.length && prereqsStart >= 0) out.splice(prereqsStart + 2, 0, '', state.join(' '));
        inPrereqs = false;
        prereqsTabs = {};
        prereqsState = {};
        prereqsStart = -1;
        prereqsItems = 0;
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
      if (/^\s*<Tabs\b/.test(line)) tabsLevel = Math.min(6, lastHeading + 1);
      if (label) out.push('', /^\s*<TabItem\b/.test(line) ? `${'#'.repeat(tabsLevel)} ${label[1]}` : `**${label[1]}**`, '');
      // <Prereqs needs={…}> with page-specific <li> children in its slot: the
      // shared lines go in first, the children follow as the list they are.
      if (/^\s*<StageStrip\b/.test(line)) { inStrip = true; stripN = 0; }
      if (/^\s*<Prereqs\b/.test(line)) {
        prereqsStart = out.length;
        const head = prereqsToText(line, { mayHaveOwn: true });
        prereqsItems = head.filter((l) => l.startsWith('- ')).length;
        out.push(...head);
        inPrereqs = true;
        prereqsTag = line;
      }
      // how far this wrapper's author indented its children: the first
      // non-blank line inside it, relative to the tag itself
      let k = n + 1;
      while (k < lines.length && !lines[k].trim()) k += 1;
      const child = k < lines.length && !close.test(lines[k]) ? lead(lines[k]) - lead(line) : 0;
      indents.push(Math.max(0, child));
      continue;
    }

    const strip = Math.min(stripOf(), lead(line));
    const text = line.slice(strip);
    const opener = line.match(/^\s*(`{3,}|~{3,})/);
    if (opener) fence = { marker: opener[1], strip: line.length - text.length };
    if (inStrip || inPrereqs) {
      // Both lists are built from raw <li> JSX, buffered until the item closes,
      // then flattened. An author's comment is dropped here rather than left for
      // stripHtmlComments: glued to the next item it would hide that item's
      // slot="…" and its list marker. A comment over several lines waits for
      // its end.
      slot.push(text);
      const joined = slot.join(' ').replace(COMMENT, '');
      if (joined.includes('<!--')) continue;
      if (!joined.trim()) { slot.length = 0; continue; }
      if (inStrip) {
        // one <li> per stage: number it, and end the bold title with a period
        if (/<\/li>/.test(joined)) {
          const item = inlineToMarkdown(joined).replace(/^- /, '');
          slot.length = 0;
          if (item) out.push(`${++stripN}. ${item.replace(/^\*\*(.+?)\*\*\s*/, '**$1.** ')}`);
        }
        continue;
      }
      // <Prereqs> also takes a tab's own line, or a state card, as <span slot="…">
      const tabLine = joined.match(/^\s*<span slot="(prompt|ui|cli|from|to)">([\s\S]*)<\/span>\s*$/);
      if (tabLine) {
        const key = tabLine[1];
        if (key === 'from' || key === 'to') prereqsState[key] = inlineToMarkdown(tabLine[2]);
        else prereqsTabs[key] = inlineToMarkdown(tabLine[2]);
        slot.length = 0;
        continue;
      }
      if (/<\/li>/.test(joined)) {
        const item = inlineToMarkdown(joined);
        if (item) {
          const li = item.startsWith('- ') ? item : `- ${item}`;
          // <li slot="group"> items belong to the box's second list, printed at </Prereqs>
          if (/^\s*<li\s+slot="group"/.test(joined)) groupItems.push(li);
          else { out.push(li); prereqsItems += 1; }
        }
        slot.length = 0;
      }
      continue;
    }
    const heading = text.match(/^(#{2,6})\s/);
    if (heading) lastHeading = heading[1].length;
    out.push(text);
  }

  return collapseBlankLines(out.join('\n'));
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
          // authors' notes (VERIFY markers, where a claim was checked) stay in the source; comments
          // and blank lines inside fenced code are content and survive (strip-comments.mjs)
          const body = stripHtmlComments(isMdx ? stripMdx(raw) : raw).trim();
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
