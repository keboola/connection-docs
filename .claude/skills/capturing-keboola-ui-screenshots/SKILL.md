---
name: capturing-keboola-ui-screenshots
description: Use when an Apps docs page (src/content/docs/data-apps/) needs a real Keboola product-UI screenshot — Apps list, Create App, app config/Overview, Kai chat, deploy wizard, auth screens — and a placeholder or stale image must be replaced with a live capture.
---

# Capturing Keboola UI screenshots for the Apps docs

## Overview

The Apps docs reach the real product UI behind your Keboola login. Capture it by
connecting Playwright to your **already-open, logged-in Chrome over CDP** — no
re-login, no session file to hand over. PNGs are written straight into
`public/data-apps/`, where the docs reference them by absolute path
(`/data-apps/<name>.png`). Tool: `apps-section/shoot-cdp.mjs`.

## Prerequisites

1. **Chrome with the debug port open**, fully quit first, then relaunched:
   ```
   open -a "Google Chrome" --args --remote-debugging-port=9222
   ```
   Stay logged into Keboola. Verify: `curl -s localhost:9222/json/version`.
2. **Playwright** installed (already in the repo).
3. **Work in a development branch** in the project so nothing touches production.

## Two capture modes

**Static screens — navigate + shoot** (no interaction):
```
cd apps-section
node shoot-cdp.mjs "<keboola-url>" <outname.png> [waitMs] [full]
node shoot-cdp.mjs current <outname.png>   # shoot the tab you already drove to
```

**Interactive flows — a throwaway CDP driver** (click/fill to reach a state).
Write it in `apps-section/` so `playwright` resolves; output temp shots to
`apps-section/shots/` (gitignored); delete the driver after. Reusable core:
```js
import { chromium } from 'playwright';
const browser = await chromium.connectOverCDP('http://localhost:9222');
const page = await browser.contexts()[0].newPage();
await page.goto(URL, { waitUntil: 'networkidle' });
// Kill the "Latest update" promo toast that clutters shots:
await page.evaluate(() => {
  for (const el of document.querySelectorAll('body *')) {
    const t = el.textContent || '';
    if (t.trim().startsWith('Latest update') && t.length < 400) {
      let n = el; for (let i = 0; i < 6 && n.parentElement; i++) {
        const r = n.getBoundingClientRect();
        if (r.width < 640 && r.height < 360 && r.left < 700) { n.style.display = 'none'; break; }
        n = n.parentElement; } } }
});
// The page scrolls inside #scroll-container, not window — let Playwright scroll:
await page.getByRole('button', { name: /create streamlit app/i }).scrollIntoViewIfNeeded();
await page.screenshot({ path: 'shots/foo.png' });          // viewport
await page.getByText('or create manually').screenshot(...) // tight element crop
await browser.close(); // disconnects CDP only; leaves your Chrome open
```

## Place & verify

1. View each temp shot; keep the best, `cp` it to `public/data-apps/<name>.png`
   matching the doc's `![alt](/data-apps/<name>.png)` reference.
2. Reference/rename in the Markdown; delete any stale image it replaces (grep the
   old name first — must be unreferenced).
3. `npm run build` clean, then `node scripts/audit-phase2.mjs` → **MISSING IMAGES: 0**.
4. Delete the scratch driver and `apps-section/shots/`.

## Safety — confirm side effects first

Navigation and screenshots are free. **Creating an app, Deploy/Redeploy, Approve,
Delete, or any irreversible control needs explicit per-action confirmation** — even
under a broad "go ahead." Create only in a dev branch, capture, and report every
draft you leave (name + App ID) so the owner can clean up. Never enter credentials.

## Ground the prose, not just the image

Screens you capture are directly observed product behavior — use them to replace
`VERIFY`/`TODO` guesses with accurate steps and labels. Keep a light `VERIFY` only
for things you *didn't* open (e.g. a link's destination, other stacks/versions).

## Common mistakes

| Symptom | Fix |
|---|---|
| `Could not connect to Chrome on :9222` | Chrome wasn't fully quit before relaunch; the `--args` flag is ignored otherwise. |
| Shot is at page top, target below fold | Window scroll doesn't move `#scroll-container`; use `locator.scrollIntoViewIfNeeded()`. |
| Promo "Latest update" toast in frame | Remove it via the `evaluate` helper before shooting. |
| Modal captured mid-transition (ghosted) | Add `waitForTimeout(600–900)` after the click before the shot. |
| Whole tall page needed | Pass `full` to `shoot-cdp.mjs`; otherwise it shoots the viewport. |
