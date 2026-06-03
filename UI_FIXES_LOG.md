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
