// screenshots.mjs — capture docs screenshots for the Apps section.
//
// WHY LOCAL: these pages need your Keboola login and reach app/hub domains
// that a sandbox can't. Run this on your own machine, logged in as you.
//
// SETUP (once):
//   npm init -y
//   npm i -D playwright
//   npx playwright install chromium
//
// STEP 1 — save your login once (opens a browser, you log in by hand):
//   node screenshots.mjs login
//   -> logs into Keboola in the opened window, then press "Resume" in the
//      Playwright inspector. It writes auth.json (your session). Never commit it.
//
// STEP 2 — capture the competition gallery apps (you must have access):
//   node screenshots.mjs apps
//
// STEP 3 — capture the getting-started product-UI shots (headed, you drive):
//   node screenshots.mjs ui
//   -> for the static screens it auto-navigates for you; for the Kai build
//      screens, submit the prompt in the opened window to reach the state,
//      then press "Resume" and it screenshots. Repeat per target.
//
// Output: ./shots/*.png — filenames already match the doc placeholders.
// The docs reference images by absolute path (/data-apps/<name>.png), which are
// served from the repo's public/ dir. Move the shots there:
//   cp shots/*.png <repo>/public/data-apps/
// (or set OUT_DIR below straight to <repo>/public/data-apps).

import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

// Write straight into the repo so `ui` shots replace the placeholders in place.
// (Was './shots' + a manual cp; kept relative to this script's apps-section/ dir.)
const OUT_DIR = '../public/data-apps';
const AUTH = 'auth.json';

// Your stack + project (Documentation Analysis = project 6015 on us-east4 GCP).
const CONNECTION_URL = 'https://connection.us-east4.gcp.keboola.com/';
const PROJECT = 'https://connection.us-east4.gcp.keboola.com/admin/projects/6015';

// Gallery apps — Jordan's three picks for "What people build". Public (no login),
// but they sleep, so the first load can take a minute (the script waits).
const APPS = [
  { file: 'examples-seasonal.png',         url: 'https://seasonal-74013643.hub.europe-west3.gcp.keboola.com/' },
  { file: 'examples-flight-shockwave.png', url: 'https://flight-shockwave-1304626299.hub.keboola.com/' },
  { file: 'examples-color-season.png',     url: 'https://color-season-analyzer-43672911.hub.us-east4.gcp.keboola.com/' },
];

// Getting-started product-UI shots. Static screens auto-navigate (url set);
// the Kai build screens need you to submit a prompt to reach the state, then Resume.
const UI = [
  { file: 'getting-started-apps-list.png',   url: `${PROJECT}/data-apps`,
    hint: 'Apps list — the "+ Create App" button is top-right.' },
  { file: 'getting-started-create-app.png',  url: `${PROJECT}/data-apps/new`,
    hint: '"Build web apps from your Keboola data" — the Kai "Describe what you want to build" prompt + the manual Streamlit / Python-JS cards below.' },
  { file: 'getting-started-kai-build.png',   url: `${PROJECT}/data-apps/new`,
    hint: 'Submit a build prompt, wait until Kai shows "Listing buckets" / "Getting table detail" and the proposed plan, then Resume.' },
  { file: 'getting-started-approve.png',     url: null,
    hint: 'In the same chat: the "Modifying app — Confirmation required" card with the config visible and the Approve button. Resume before you click Approve.' },
  { file: 'getting-started-deployed.png',    url: null,
    hint: 'After approving + deploy: Kai\'s final message with the "Dashboard URL" and "Configuration" links. Resume to shoot.' },
];

// Elements to hide before shooting (project IDs, tokens, emails, private data).
// Tune these selectors to your UI. Masked areas render as solid boxes.
const MASK = [
  '[data-testid*="token"]', '[class*="token"]',
  '[data-testid*="project-id"]', 'code:has-text("KBC_")',
];

mkdirSync(OUT_DIR, { recursive: true });
const mode = process.argv[2];

if (mode === 'login') {
  const browser = await chromium.launch({ headless: false });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(CONNECTION_URL);
  console.log('\n>> Log in by hand, then press "Resume" in the inspector.\n');
  await page.pause();                 // you log in manually here
  await ctx.storageState({ path: AUTH });
  console.log(`Saved session to ${AUTH}`);
  await browser.close();

} else if (mode === 'apps') {
  const browser = await chromium.launch({ headless: false });
  const ctx = await browser.newContext({
    storageState: AUTH,
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,             // crisp retina shots
  });
  const page = await ctx.newPage();
  for (const { file, url } of APPS) {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 }); // apps sleep — allow cold start
      await page.waitForTimeout(5000); // let the app finish waking + charts/animations settle
      const mask = MASK.map(s => page.locator(s));
      await page.screenshot({ path: `${OUT_DIR}/${file}`, mask, fullPage: false });
      console.log('captured', file);
    } catch (e) {
      console.warn('SKIP', file, '-', e.message); // gated / no access / offline
    }
  }
  await browser.close();

} else if (mode === 'ui') {
  const browser = await chromium.launch({ headless: false });
  const ctx = await browser.newContext({
    storageState: AUTH,
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  for (const { file, hint, url } of UI) {
    if (url) {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
      await page.waitForTimeout(1500);
    }
    console.log(`\n>> ${hint}\n   Adjust the view if needed, then press "Resume" to shoot ${file}`);
    await page.pause();               // you drive to / trigger the exact screen
    const mask = MASK.map(s => page.locator(s));
    await page.screenshot({ path: `${OUT_DIR}/${file}`, mask, fullPage: false });
    console.log('captured', file);
  }
  await browser.close();

} else {
  console.log('Usage: node screenshots.mjs <login|apps|ui>');
}
