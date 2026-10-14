/**
 * Phase 2 — systematic migration-fidelity audit.
 *
 * Crawls the built site in `dist/` (the authoritative output a reader gets) plus
 * the markdown source, and reports the mechanical breakages Jordan's Phase 2 cares
 * about: broken internal links, missing images, Jekyll/old-domain link smells,
 * heading-hierarchy problems, malformed tables, and unclosed code fences.
 *
 * Read-only. Run after `astro build`:  node scripts/audit-phase2.mjs
 */
import {
  readFileSync, readdirSync, statSync, existsSync,
} from 'fs';
import { join, relative, dirname, resolve } from 'path';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const DIST = join(ROOT, 'dist');
const SRC = join(ROOT, 'src', 'content', 'docs');

if (!existsSync(DIST)) {
  console.error('No dist/ — run `astro build` first.');
  process.exit(1);
}

// ---- helpers ---------------------------------------------------------------
function walk(dir, test) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full, test));
    else if (test(full)) out.push(full);
  }
  return out;
}

const htmlFiles = walk(DIST, (f) => f.endsWith('.html') && !f.includes('/pagefind/'));
const route = (f) => '/' + relative(DIST, f).replace(/index\.html$/, '').replace(/\.html$/, '');

// Resolve whether an internal absolute path exists in the build output.
function resolves(p) {
  p = p.split('#')[0].split('?')[0];
  if (!p) return true;
  const cands = [
    join(DIST, p),
    join(DIST, p, 'index.html'),
    join(DIST, p.replace(/\/$/, '') + '.html'),
    join(DIST, p.replace(/\/$/, '') + '/index.html'),
  ];
  return cands.some(existsSync);
}

const findings = { brokenLinks: [], missingImages: [], jekyllSmell: [], multiH1: [], extCount: 0 };

const ATTR = /(?:href|src)\s*=\s*["']([^"']+)["']/gi;

for (const file of htmlFiles) {
  const raw = readFileSync(file, 'utf8');
  // Scan in-content links only — drop <head> so canonical/og/preload links
  // (which legitimately point at the production host) don't show as smells.
  const bi = raw.search(/<body[\s>]/i);
  const html = bi >= 0 ? raw.slice(bi) : raw;
  const r = route(file);

  // headings: more than one <h1> is a hierarchy bug
  const h1s = (html.match(/<h1[\s>]/gi) || []).length;
  if (h1s > 1) findings.multiH1.push({ page: r, count: h1s });

  let m;
  ATTR.lastIndex = 0;
  while ((m = ATTR.exec(html))) {
    const url = m[1].trim();
    const isImg = m[0].toLowerCase().startsWith('src');

    if (/^(mailto:|tel:|javascript:|data:|#)/i.test(url)) continue;
    if (/^https?:\/\//i.test(url)) {
      findings.extCount++;
      // old-docs / Jekyll smell: absolute links back to the legacy docs host
      if (/help\.keboola\.com|developers\.keboola\.com/i.test(url) && !isImg) {
        findings.jekyllSmell.push({ page: r, url, kind: 'absolute-old-docs-link' });
      }
      continue;
    }
    if (!url.startsWith('/')) continue; // skip protocol-relative / odd

    // Jekyll-style .html links inside content (should be clean routes)
    if (/\.html(\?|#|$)/i.test(url) && !url.startsWith('/_astro/')) {
      findings.jekyllSmell.push({ page: r, url, kind: 'jekyll-.html-link' });
    }

    if (!resolves(url)) {
      if (isImg || /\.(png|jpe?g|gif|svg|webp|avif)$/i.test(url)) {
        findings.missingImages.push({ page: r, url });
      } else {
        findings.brokenLinks.push({ page: r, url });
      }
    }
  }
}

// ---- source-level checks (markdown) ---------------------------------------
const mdFiles = walk(SRC, (f) => f.endsWith('.md') || f.endsWith('.mdx'));
const fenceIssues = [];
const tableIssues = [];

for (const file of mdFiles) {
  const rel = relative(SRC, file);
  const body = readFileSync(file, 'utf8').replace(/^---\n[\s\S]*?\n---\n/, ''); // drop frontmatter
  const lines = body.split('\n');

  // unclosed code fences (odd number of ``` lines)
  const fences = (body.match(/^```/gm) || []).length;
  if (fences % 2 !== 0) fenceIssues.push({ file: rel, fences });

  // malformed tables: a separator row (|---|---|) whose column count differs
  // from the header row directly above it
  for (let i = 1; i < lines.length; i++) {
    if (/^\s*\|?[\s:-]*-{3,}[\s:|-]*$/.test(lines[i]) && lines[i].includes('|')) {
      const cols = (s) => s.trim().replace(/^\||\|$/g, '').split('|').length;
      const head = lines[i - 1];
      if (head.includes('|') && cols(head) !== cols(lines[i])) {
        tableIssues.push({ file: rel, line: i + 1, header: cols(head), sep: cols(lines[i]) });
      }
    }
  }
}

// ---- report ----------------------------------------------------------------
const head = (t) => `\n${'─'.repeat(64)}\n${t}\n${'─'.repeat(64)}`;
console.log(head('PHASE 2 AUDIT — migration fidelity'));
console.log(`Pages crawled (dist): ${htmlFiles.length}   Markdown sources: ${mdFiles.length}`);
console.log(`External links seen: ${findings.extCount} (not network-checked)`);

const dump = (title, arr, fmt) => {
  console.log(head(`${title}: ${arr.length}`));
  arr.slice(0, 60).forEach((x) => console.log('  ' + fmt(x)));
  if (arr.length > 60) console.log(`  …and ${arr.length - 60} more`);
};

dump('BROKEN INTERNAL LINKS', findings.brokenLinks, (x) => `${x.page}  →  ${x.url}`);
dump('MISSING IMAGES', findings.missingImages, (x) => `${x.page}  →  ${x.url}`);
dump('JEKYLL / OLD-DOCS LINK SMELLS', findings.jekyllSmell, (x) => `[${x.kind}] ${x.page}  →  ${x.url}`);
dump('MULTIPLE <h1> PER PAGE', findings.multiH1, (x) => `${x.page}  (${x.count} h1)`);
dump('UNCLOSED CODE FENCES (source)', fenceIssues, (x) => `${x.file}  (${x.fences} fences)`);
dump('MALFORMED TABLES (source)', tableIssues, (x) => `${x.file}:${x.line}  header=${x.header} sep=${x.sep}`);

const total = findings.brokenLinks.length + findings.missingImages.length +
  findings.jekyllSmell.length + findings.multiH1.length + fenceIssues.length + tableIssues.length;
console.log(head(`TOTAL ISSUES: ${total}`));
