/**
 * Generates the site-wide social card at `public/og-default.png` (1200x630).
 *
 * Starlight emits `twitter:card: summary_large_image` on every page but never
 * supplies an image, so a shared link renders an empty card in Slack, LinkedIn
 * and X. `src/components/Head.astro` points `og:image` at the file this script
 * writes.
 *
 * Rendered through Playwright rather than composed with sharp so the card uses
 * the same Inter webfont as the site instead of whatever the local font stack
 * happens to resolve to. Same approach as scripts/shoot.mjs.
 *
 * The output is committed — regenerate and commit only when the brand assets
 * or the wording change:
 *
 *   node scripts/make-og-image.mjs
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const OUT = join(root, 'public', 'og-default.png');

// Inlined as a data URI so the page has no network dependency beyond the font.
const logo = readFileSync(join(root, 'src', 'assets', 'logo-dark.png')).toString('base64');

// Keboola design-system tokens, mirrored from src/styles/custom.css.
const GREY_900 = '#101114';
const GREY_300 = '#a2aab8';
const GREY_400 = '#7c8594';
const GREEN_500 = '#1ec71e';

const html = `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    background: ${GREY_900};
    font-family: Inter, -apple-system, 'Helvetica Neue', Arial, sans-serif;
    color: #fff;
    padding: 72px;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  img { width: 176px; height: 50px; }
  h1 { font-size: 88px; font-weight: 600; letter-spacing: -0.03em; line-height: 1; }
  p  { font-size: 32px; font-weight: 400; color: ${GREY_300}; margin-top: 24px; max-width: 900px; line-height: 1.4; }
  .rule { width: 64px; height: 4px; background: ${GREEN_500}; margin-bottom: 20px; }
  .url { font-size: 24px; color: ${GREY_400}; }
</style></head>
<body>
  <img src="data:image/png;base64,${logo}" alt="">
  <div>
    <h1>Documentation</h1>
    <p>Keboola is a data platform as a service. Storage, transformations, connectors and flows.</p>
  </div>
  <div>
    <div class="rule"></div>
    <div class="url">help.keboola.com</div>
  </div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const buf = await page.screenshot({ type: 'png' });
await browser.close();

writeFileSync(OUT, buf);
console.log(`Wrote ${OUT} (${(buf.length / 1024).toFixed(1)} kB)`);
