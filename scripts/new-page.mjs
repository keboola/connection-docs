#!/usr/bin/env node
/**
 * new-page.mjs — scaffold a standard, ready-to-edit docs page.
 *
 * Creates a page that already meets the bar (title, slug, filled-in description,
 * task-oriented skeleton), optionally wires it into the sidebar, and prints a
 * review checklist — so a new page is a 10-second process, not a copy-paste ritual.
 *
 * Usage:
 *   npm run new:page -- --title "How do I schedule a flow?" --section "How-to Guides"
 *   node scripts/new-page.mjs --title "…" [--slug how-to/schedule-a-flow] \
 *        [--section "How-to Guides"] [--type how-to|concept] [--nav] [--force]
 *
 * --nav   also inserts the page under its section in _data/navigation.yml
 *         (run `npm run gen:sidebar` afterwards).
 */
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(ROOT, 'src', 'content', 'docs');
const NAV = join(ROOT, '_data', 'navigation.yml');

const arg = (k, d = null) => {
  const i = process.argv.indexOf(`--${k}`);
  return i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')
    ? process.argv[i + 1]
    : d;
};
const flag = (k) => process.argv.includes(`--${k}`);

const title = arg('title');
if (!title) {
  console.error('✗ --title is required.  e.g. --title "How do I schedule a flow?"');
  process.exit(1);
}
const type = arg('type', 'how-to');
const slug =
  arg('slug') ||
  `${type === 'how-to' ? 'how-to/' : ''}` +
    title.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
const section = arg('section');

const TEMPLATES = {
  'how-to': (t) => `${oneLine(t)} explains the goal in one sentence so search,
the page lede, and Ask Kai have something to work with — replace this with the
real description.

Open with the reader's task and the outcome: what they want to do and what they
will have when they're done.

## Before you start

- What they need (access, credentials, prerequisites).

## Steps

1. **First action** — do the thing and what to expect.
2. **Second action** — keep each step a single, verifiable move.
3. **Verify** — how the reader knows it worked.

## Troubleshooting

- **Symptom** — the likely cause and the fix.

## Next steps

- Where to go after succeeding here.
`,
  concept: () => `One-sentence definition of the concept — replace the description above.

Explain what it is, why it matters, and when to use it. Link out to the how-to
guides that put it into practice.
`,
};

const buildDesc = (t) =>
  type === 'how-to'
    ? `Step-by-step guide: ${oneLine(t).replace(/\?$/, '').replace(/^How do I /i, '').trim()}.`
    : `Overview of ${oneLine(t)}.`;

function oneLine(t) {
  return t.trim();
}

const filePath = join(DOCS, slug.endsWith('/') ? `${slug}index.md` : `${slug}.md`);
if (existsSync(filePath) && !flag('force')) {
  console.error(`✗ ${filePath} already exists. Pass --force to overwrite.`);
  process.exit(1);
}

// Full Phase-3 frontmatter (see src/content.config.ts and
// scripts/templates/task-page-template.md) — a scaffolded page must pass the
// docs-page PR checklist without the author re-inventing the field set.
const cleanTask = oneLine(title).replace(/\?$/, '').replace(/^How do I /i, '');
const today = new Date().toISOString().slice(0, 10);
const fmLines = [
  `title: ${/[:#'"]/.test(title) ? JSON.stringify(title) : title}`,
  `slug: '${slug}'`,
  `description: ${JSON.stringify(buildDesc(title))}`,
  `keywords: # 3–5 phrases users would actually search for`,
  `  - ${cleanTask.toLowerCase()}`,
];
if (type === 'how-to') {
  fmLines.push(
    `task: ${cleanTask.charAt(0).toUpperCase() + cleanTask.slice(1)}`,
    `audience: New and existing Keboola users`,
  );
}
fmLines.push(
  `last_verified: ${today} # date the steps were last checked against the product`,
  `related: [] # absolute slugs, e.g. /components/extractors/database/`,
);

const page = `---
${fmLines.join('\n')}
---

${(TEMPLATES[type] || TEMPLATES['how-to'])(title)}`;

mkdirSync(dirname(filePath), { recursive: true });
writeFileSync(filePath, page);

// Optional: insert into navigation under the named section.
let navNote = '';
if (flag('nav') && section) {
  const nav = readFileSync(NAV, 'utf8');
  const url = `/${slug.replace(/\/?$/, '/')}`;
  const escaped = section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(title:\\s*${escaped}\\s*\\n\\s*items:\\n)`);
  if (re.test(nav)) {
    const insert = `      - url: ${url}\n        title: ${title}\n`;
    writeFileSync(NAV, nav.replace(re, `$1${insert}`));
    navNote = `✓ added to "${section}" in navigation.yml — run \`npm run gen:sidebar\`\n`;
  } else {
    navNote = `⚠ section "${section}" not found in navigation.yml — add the nav entry by hand\n`;
  }
}

console.log(`
✓ created ${filePath.replace(ROOT + '/', '')}
${navNote}Checklist before you open a PR:
  □ Replace the draft description with a real one (≤160 chars, says the outcome)
  □ Fill keywords (3–5 real search phrases) and related (2–4 absolute slugs)
  □ Verify the steps in the product, then confirm last_verified
  □ Lead with the reader's task, not the feature
  □ Each step is a single verifiable action; no "as shown above"
  □ Link to related pages with absolute paths (/section/page/)
  □ npm run gen:sidebar   (if you used --nav)
  □ npm run build && node scripts/content-lint.mjs   → clean
`);
