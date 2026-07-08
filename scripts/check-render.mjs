/**
 * Render / layout regression check (Playwright, headless).
 *
 * Runs against a LOCAL `astro preview` (no login needed). Catches the class of
 * bug that shipped in PRDCT-379: wide tables collapsing to display:block (empty
 * box / clipping), plus general horizontal-overflow and broken-image regressions
 * that a plain `astro build` never notices.
 *
 * Usage:
 *   npm run preview &                # serves dist at http://localhost:4321
 *   PREVIEW_URL=http://localhost:4321 node scripts/check-render.mjs
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, dirname, resolve } from 'path';
import { chromium } from 'playwright';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const DIST = join(ROOT, 'dist');
const BASE = (process.env.PREVIEW_URL || 'http://localhost:4321').replace(/\/$/, '');
const TABLE_CAP = Number(process.env.TABLE_CAP || 25);

if (!existsSync(DIST)) { console.error('No dist/ — run `astro build` first.'); process.exit(1); }

function walk(dir) {
  const out = [];
  for (const n of readdirSync(dir)) {
    const f = join(dir, n); const st = statSync(f);
    if (st.isDirectory()) { if (!f.includes('/pagefind')) out.push(...walk(f)); }
    else if (f.endsWith('.html')) out.push(f);
  }
  return out;
}
const route = (f) => '/' + relative(DIST, f).replace(/index\.html$/, '').replace(/\.html$/, '');

// Pick pages that actually contain a wrapped table; cap for runtime.
// Sort so the sample is deterministic — readdir order differs between macOS
// and Linux, and a platform-dependent sample means local pass / CI fail.
const all = walk(DIST).sort();
const tablePages = [];
let tablePagesTotal = 0;
for (const f of all) {
  if (!readFileSync(f, 'utf8').includes('beacon-table-scroll')) continue;
  tablePagesTotal++;
  if (tablePages.length < TABLE_CAP) tablePages.push(route(f));
}
if (tablePagesTotal > tablePages.length) {
  console.log(`(sampling ${tablePages.length} of ${tablePagesTotal} table pages — raise TABLE_CAP to widen)`);
}
// Representative spread for the multi-viewport layout check.
const layoutPages = [...new Set(['/', ...tablePages])].slice(0, 8);

console.log(`Render check → ${BASE}  (table pages: ${tablePages.length}, layout pages: ${layoutPages.length})`);

const fails = [];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

async function goto(path) {
  const res = await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 45000 }).catch((e) => ({ err: e.message }));
  if (res && res.err) { fails.push(`${path} — navigation failed: ${res.err}`); return false; }
  await page.waitForTimeout(300);
  return true;
}

// 1) table health + image load + heading ids
for (const p of tablePages) {
  if (!(await goto(p))) continue;
  const r = await page.evaluate(() => {
    const out = [];
    for (const wrap of document.querySelectorAll('.sl-markdown-content .beacon-table-scroll')) {
      const t = wrap.querySelector(':scope > table');
      if (!t) { out.push('table-scroll wrapper has no direct <table>'); continue; }
      const cs = getComputedStyle(t), wcs = getComputedStyle(wrap);
      if (cs.display !== 'table') out.push(`table display:${cs.display} (expected table) — narrow/clipped regression`);
      if (!['auto', 'scroll'].includes(wcs.overflowX)) out.push(`wrapper overflow-x:${wcs.overflowX} (expected auto)`);
    }
    for (const img of document.querySelectorAll('.sl-markdown-content img')) {
      if (!img.complete || img.naturalWidth === 0) out.push(`image failed to load: ${img.getAttribute('src')}`);
    }
    for (const h of document.querySelectorAll('.sl-markdown-content h2, .sl-markdown-content h3')) {
      if (!h.id) out.push(`heading without id: "${(h.textContent || '').trim().slice(0, 40)}"`);
    }
    return out;
  });
  r.forEach((msg) => fails.push(`${p} — ${msg}`));
}

// 2) no horizontal body scroll across viewports
for (const p of layoutPages) {
  for (const vw of [375, 768, 1280]) {
    await page.setViewportSize({ width: vw, height: 900 });
    if (!(await goto(p))) continue;
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (over > 2) fails.push(`${p} @${vw}px — horizontal overflow (${over}px past viewport)`);
  }
  await page.setViewportSize({ width: 1280, height: 900 });
}

await browser.close();

const line = (t) => `\n${'─'.repeat(64)}\n${t}\n${'─'.repeat(64)}`;
if (!fails.length) { console.log(line('OK — render/layout checks passed')); process.exit(0); }
console.log(line(`RENDER FAILURES: ${fails.length}`));
fails.slice(0, 100).forEach((f) => console.log('  ✗ ' + f));
if (fails.length > 100) console.log(`  …and ${fails.length - 100} more`);
process.exit(1);
