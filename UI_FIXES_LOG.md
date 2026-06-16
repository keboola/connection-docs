# Phase 2 — UI/UX Fixes Log

**Branch:** `fix/phase1-migration-audit` (applied locally; separate Phase 2 PR pending)  
**Scope:** Visual and layout improvements to the Astro Starlight Beacon design system.  
These changes do NOT affect content meaning and are NOT migration artifacts.

---

## Applied ✅

### U-1 — Paragraph spacing too large
**File:** `src/styles/custom.css`  
**Status:** ✅ Applied

Default Starlight `--sl-content-gap-y: 1rem` + `line-height: 1.7` + `h2 margin-top: 40px` made pages feel overly airy. Reduced all three.

```diff
- --sl-line-height: 1.7;
+ --sl-line-height: 1.6;
- /* no override — defaulted to Starlight 1rem */
+ --sl-content-gap-y: 0.6rem;

- margin-top: 40px;   /* h2 */
- margin-bottom: 16px;
+ margin-top: 32px;
+ margin-bottom: 14px;
```

---

### U-2 — "Ask Kai" block: label and prompt render on one line
**File:** `src/styles/custom.css`  
**Status:** ✅ Applied

`.b-ask-body` lacked `flex-direction: column` so label and prompt sat side-by-side. Fixed stacking, tightened padding, improved button and kbd styles.

```diff
-.b-ask-body { flex: 1; min-width: 0; }
+.b-ask-body {
+  flex: 1; min-width: 0;
+  display: flex; flex-direction: column; gap: 1px;
+}
+.b-ask-label { line-height: 1.3; }
+.b-ask-prompt { line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
```

Block padding tightened `14px 18px → 12px 16px`, bottom margin `32px → 24px`.  
Button removed uppercase/letter-spacing; kbd shortcuts use semi-transparent style.

---

### U-3 — "On this page" TOC font too small and hard to read
**File:** `src/styles/custom.css`  
**Status:** ✅ Applied (×1.5 scale from original)

TOC heading was `11px` and links were `12.5px` — both too small for comfortable reading.

```diff
- .right-sidebar-panel h2  { font-size: 11px; color: var(--fg-3); letter-spacing: 1px; }
+ .right-sidebar-panel h2  { font-size: 14px; color: var(--fg-1); letter-spacing: 0.6px; font-weight: 700; }

- .right-sidebar-panel a   { font-size: 12.5px; line-height: 18px; padding: 4px 0; }
+ .right-sidebar-panel a   { font-size: 14px;   line-height: 20px; padding: 6px 0; }

- .right-sidebar-panel li ul a { font-size: 12px; }
+ .right-sidebar-panel li ul a { font-size: 13px; }
```

Active indicator dot enlarged `4px → 5px`, padding-left `14px → 16px`.

---

### U-4 — Sidebar collapse toggle (hide/show left nav)
**Files:** `src/styles/custom.css`, `src/components/AskKaiDrawer.astro`  
**Status:** ✅ Applied

No way to hide the left sidebar — forces users to scroll on smaller desktops. Added a fixed-position tab anchored to the right edge of the sidebar (viewport-relative to avoid Starlight's `overflow: hidden` clipping).

**How it works:**
- A `<button id="ak-sidebar-collapse">` is injected into `<body>` via `AskKaiDrawer.astro` on page load and after every Astro view transition
- Positioned `fixed` at `left: var(--sl-sidebar-width)`, vertically centred
- Clicking toggles `sidebar-collapsed` class on `<html>` and persists to `localStorage`
- When collapsed: `nav.sidebar` → `width: 0`, button slides to `left: 0`, arrow rotates 180°
- Hidden on mobile (`< 1152px`) where Starlight uses its own mobile nav

**CSS summary:**
```css
#ak-sidebar-collapse { position: fixed; top: 50%; left: var(--sl-sidebar-width); … }
:root.sidebar-collapsed nav.sidebar { width: 0 !important; overflow: hidden; }
:root.sidebar-collapsed #ak-sidebar-collapse { left: 0; }
:root.sidebar-collapsed #ak-sidebar-collapse svg { transform: rotate(180deg); }
```

**JS summary (AskKaiDrawer.astro):**
```js
const ensureCollapseBtn = () => {
  if (document.getElementById('ak-sidebar-collapse')) return;
  if (window.innerWidth < 1152) return;
  // inject button → document.body
  // click toggles 'sidebar-collapsed' on documentElement + persists to localStorage
};
ensureCollapseBtn();
document.addEventListener('astro:page-load', ensureCollapseBtn);
// Restore persisted state on every load
applySidebarState(localStorage.getItem('kbc-sidebar-collapsed') === 'true');
```

---

## Notes for Phase 2 PR

- All four fixes live in `src/styles/custom.css` and `src/components/AskKaiDrawer.astro`
- Neither file is touched by `migrate.mjs` — these changes are permanent across all future migration reruns
- U-4 (sidebar collapse) state survives page navigation via Astro view transitions because `AskKaiDrawer.astro` uses `transition:persist` and re-runs `ensureCollapseBtn` on `astro:page-load`
- Jordan's Phase 2 also includes: feedback vote buttons and Edit → auto-open PR (not yet implemented)

---

## Session 2026-06-09 — Header / sidebar / spacing refinements

> Files touched: `src/styles/custom.css`, `src/components/PageTitle.astro`,
> `src/components/AskKaiDrawer.astro`, `src/components/Head.astro`.
> None are touched by `migrate.mjs`.

### U-5 — Content pushed ~600px down the page
**File:** `src/styles/custom.css` · ✅ Applied

`.sidebar-pane` had `position: relative` (unlayered, so it beat Starlight's
`@layer` `position: fixed`). That dropped the fixed sidebar into normal flow and
shoved `.main-frame` down. Removed the `position: relative` — Starlight's
`position: fixed` + `overflow-y: auto` (working scroll) came back automatically.

### U-6 — Floating grey stripe next to the header Kai button
**File:** `src/styles/custom.css` · ✅ Applied

The stripe was Starlight's `.social-icons::after` separator, rendered even though
no social icons are configured. Hidden it:
```css
.social-icons::after { display: none !important; }
```

### U-7 — Content jumps on new-tab load (FOUC of collapsed sidebar)
**File:** `src/components/Head.astro` · ✅ Applied

`localStorage` restore ran in a deferred ES module (after first paint). Moved a
synchronous restore into a `<script is:inline>` in `<head>` so the
`sidebar-collapsed` class is set **before** first paint; also re-applied in
`astro:before-swap` for view-transition navigations.

### U-8 — Sidebar/content divider line "disappeared" on scroll
**File:** `src/styles/custom.css` · ✅ Applied

Replaced the faint `border-right` on the (scrollable) `.sidebar-pane` with a
**fixed, full-height** divider that can't drop out on scroll/short pages/nav:
```css
@media (min-width: 50rem) {
  :root[data-has-sidebar] .main-frame::before {
    content:''; position:fixed; top:var(--sl-nav-height); bottom:0;
    left:var(--sl-sidebar-width); width:1px; background:var(--sl-color-gray-5);
    z-index:1; pointer-events:none; transition:left .22s ease;
  }
  :root[data-has-sidebar].sidebar-collapsed .main-frame::before { left:40px; }
}
```

### U-9 — "Ask Kai about this page" block → home page only
**File:** `src/components/PageTitle.astro` · ✅ Applied

The `.b-ask` block rendered on every page. Now conditionally rendered only on the
root home page (`const isHome = pageSlug === ''`) — `{isHome && (<div class="b-ask">…)}`.
Conditional **render** (not CSS hide) so no empty gap remains on other pages.

### U-10 — Removed "BETA" label on header Kai button
**Files:** `src/components/AskKaiDrawer.astro`, `src/styles/custom.css` · ✅ Applied

Dropped the `<span class="ak-hk-beta">BETA</span>` from the injected button and
deleted the now-unused `.ak-hk-beta` CSS rule.

### U-11 — Gap between page title and first paragraph too large
**File:** `src/styles/custom.css` · ✅ Applied

After U-9 removed the Ask Kai block, the title→content gap was ~80px (two stacked
content-panels at 24px padding each + margins). Collapsed the panel junction to
~24px:
```css
.content-panel:has(.b-pagehead) { padding-bottom: 0 !important; }
.content-panel + .content-panel  { padding-top: 0 !important; }
```
`!important` is required: on Astro view-transition swaps the override otherwise
loses to Starlight's layered default. **Verify in a production build**, not dev
(see note below).

### U-12 — Sidebar collapse toggle reworked (supersedes U-4)
**File:** `src/styles/custom.css` (+ injection in `AskKaiDrawer.astro`) · ✅ Applied

The toggle now lives **inside** `.sidebar-pane` (top-right, `top:16px; right:8px`),
not fixed to the viewport. Final styling: `27px` box, `14px` icon, `--bg-1`
background + `1px` border + subtle shadow so it's clearly visible (was a
transparent 24px hit-area that read as invisible).
Collapsed rail stays `40px`; the button is centred there with `right:6px`.

### Dev vs. production — CSS persistence across navigation ⚠️
`npm run dev` (Vite) injects CSS as `<style>` tags that **do not survive** Astro
view-transition swaps, so a correct rule can look "broken after navigating" on
localhost:4321. The production build uses persistent `<link>` stylesheets that do
survive. **Always confirm cross-navigation CSS with `npx astro build && npx astro
preview`** before concluding there's a bug. (U-11 verified: 24px holds on every
page after navigating in the build.)

### U-13 — Ask Kai removed from pages; polished Kai card in the search modal
**Files:** `src/components/PageTitle.astro`, `src/components/AskKaiDrawer.astro`,
`src/styles/custom.css` · ✅ Applied

- Removed the per-page `.b-ask` "Ask Kai about this page" block from **all** pages
  (incl. home — fully supersedes U-9). Header `KAI – AI ASSISTANT` button kept.
- **Added** a polished Kai card at the top of the search modal: gradient badge +
  "Ask Kai" title + subtitle that live-updates to the typed query (`"<query>"`) +
  arrow. Clicking it closes the search modal, opens the Kai chat drawer, and sends
  the query (chosen approach: banner → existing drawer chat, not an inline chat).

**How (AskKaiDrawer.astro):**
```js
const ensureSearchKaiCta = () => {
  const frame = document.querySelector('site-search dialog .dialog-frame');
  if (!frame || frame.querySelector('.ak-search-cta')) return;
  // inject <button.ak-search-cta> before frame.lastElementChild (above search/results)
  // readQuery() <- input.pagefind-ui__search-input ; frame 'input' listener live-updates label
  // click: dialog.close(); openDrawer(); if (q) send(q);
};
ensureSearchKaiCta();
document.addEventListener('astro:page-load', ensureSearchKaiCta);
```
The dialog markup is in the DOM even when closed, so the CTA is injected at page
load (re-run after view transitions; dup-guarded). Real Pagefind search runs in
**prod builds only**, so verified with `astro build && astro preview`: CTA present
on open, label updates to the typed query, click sends `"how do I set up a flow"`
to the drawer and closes search. Works light + dark; the CTA itself also renders
in dev (above the "search only in production" notice).

---

### U-14 — Logo invisible in dark mode
**Files:** `astro.config.mjs`, `src/assets/logo-dark.png`
**Status:** ✅ Applied

The near-black "Keboola" wordmark + mascot vanished against the dark theme
background (single `logo.src` used for both themes). Added a brand-blue variant
(`#097CF7`, Azure Radiance — recolored from the original via `sharp`, so the hex
is exact rather than a CSS-filter approximation) and wired separate light/dark
logos so Starlight swaps per theme.

```diff
 logo: {
-  src: './src/assets/logo.png',
+  light: './src/assets/logo.png',   // near-black wordmark — light theme
+  dark: './src/assets/logo-dark.png', // #097CF7 variant — dark theme
   replacesTitle: true,
 },
```

Verified in the production build: the blue logo emits with `light:sl-hidden`
(shown only in dark theme), the original with `dark:sl-hidden`.

---

### U-15 — Ask Kai entry points shown even when the backend is unconfigured
**Files:** `api/chat.ts`, `src/components/AskKaiDrawer.astro`
**Status:** ✅ Applied

Kai only works when `AI_SERVICE_URL` + `KBC_STORAGE_API_TOKEN` are set; otherwise
`/api/chat` returns the "wiring up" stub. The static frontend can't see server
env, so it advertised Kai even on unconfigured deploys (e.g. the #897 preview).
Added a config probe and gated the entry points on it.

```diff
+// api/chat.ts — config probe for the static frontend
+if (req.method === 'GET') {
+  res.end(JSON.stringify({ enabled: Boolean(AI_SERVICE_URL && KBC_TOKEN) }));
+  return;
+}
```

The drawer probes `GET /api/chat` once per session (`sessionStorage`-cached),
removes the header button + search CTA when `enabled` is false, and early-returns
from both `ensure*` injectors. Optimistic default (configured = normal prod case)
avoids a flash. Once the env vars are set at launch, Kai shows normally.

**Fails closed.** A non-ok response (e.g. a static deploy with no `/api/chat`, or
the S3 fallback) or a network error hides the entry points instead of leaving the
optimistic default — so Kai isn't advertised where it would 404 (the window after
cutover before the DNS flip to Vercel, and the rollback path). A non-ok result is
cached `false` (a static deploy stays static); a network error is not cached, so a
later navigation re-probes in case it was transient.
