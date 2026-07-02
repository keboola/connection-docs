// shoot-cdp.mjs — capture screenshots from YOUR already-open Chrome (real, logged-in session).
//
// WHY: a fresh Playwright browser gets blocked by Google SSO. Connecting to your
// real Chrome over CDP reuses your existing Keboola login — no re-login, nothing
// to hand over. Playwright writes the PNG straight to public/data-apps/.
//
// ONE-TIME (you): fully quit Chrome, then relaunch it with the debug port open:
//   open -a "Google Chrome" --args --remote-debugging-port=9222
// Stay logged into Keboola. That's it — the rest is run by Claude Code.
//
// USAGE (Claude runs these):
//   node shoot-cdp.mjs <url|current> <outname.png> [waitMs] [full]
//     url       navigate a new tab to this URL, then shoot
//     current   shoot the tab you already have open (for states you drove to)
//     outname   file saved to ../public/data-apps/<outname.png>
//     waitMs    settle time before the shot (default 2500; raise for heavy apps)
//     full      pass the literal word "full" for a full-page shot
//
// Examples:
//   node shoot-cdp.mjs "https://connection.us-east4.gcp.keboola.com/admin/projects/6015/data-apps" getting-started-apps-list.png
//   node shoot-cdp.mjs current getting-started-kai-build.png 1500

import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../public/data-apps');
const CDP = 'http://localhost:9222';

const [, , target, outname, waitMsArg, fullArg] = process.argv;
if (!target || !outname) {
  console.error('usage: node shoot-cdp.mjs <url|current> <outname.png> [waitMs] [full]');
  process.exit(1);
}
const waitMs = Number(waitMsArg ?? 2500);
const fullPage = fullArg === 'full';

let browser;
try {
  browser = await chromium.connectOverCDP(CDP);
} catch {
  console.error(`Could not connect to Chrome on ${CDP}.\nQuit Chrome fully, then run:\n  open -a "Google Chrome" --args --remote-debugging-port=9222`);
  process.exit(1);
}

const ctx = browser.contexts()[0];
if (!ctx) {
  console.error('Connected, but no browser context found. Is a Chrome window open and logged in?');
  process.exit(1);
}

let page;
let openedTab = false;
if (target === 'current') {
  const pages = ctx.pages();
  page = pages[pages.length - 1]; // most recently active tab
  if (!page) { console.error('No open tab to capture.'); process.exit(1); }
  await page.bringToFront();
} else {
  page = await ctx.newPage();
  openedTab = true;
  await page.goto(target, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
}

await page.waitForTimeout(waitMs);

const out = path.join(OUT_DIR, outname);
await page.screenshot({ path: out, fullPage });
console.log('saved →', out, '   (url:', page.url() + ')');

if (openedTab) await page.close();
await browser.close(); // disconnects CDP only; does NOT close your Chrome
