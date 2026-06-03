# Phase 2 — UI/UX Fixes Log

**Branch:** pending — to be created after Phase 1 PR is merged  
**Scope:** Visual and layout improvements to the Astro Starlight Beacon design system.  
These changes do NOT affect content meaning and are NOT migration artifacts.  
They are deferred from Phase 1 per Jordan's phasing rules.

---

## Queued Fixes

### U-1 — Paragraph spacing too large
**File:** `src/styles/custom.css`  
**Observation:** Default Starlight `--sl-content-gap-y: 1rem` combined with `line-height: 1.7`
and `h2 margin-top: 40px` makes pages feel overly airy compared to typical docs sites.

**Proposed change:**
```diff
- --sl-line-height: 1.7;
+ --sl-line-height: 1.65;
+ --sl-content-gap-y: 0.875rem;

- margin-top: 40px;   /* h2 */
- margin-bottom: 16px;
+ margin-top: 32px;
+ margin-bottom: 14px;
```

---

### U-2 — "Ask Kai" block: label and prompt render on one line
**File:** `src/styles/custom.css`  
**Observation:** `.b-ask-body` contains two `<span>` elements (inline by default).
"Ask Kai about this page" and the placeholder text sit side-by-side instead of stacking vertically.

**Proposed change:**
```diff
-.b-ask-body { flex: 1; min-width: 0; }
+.b-ask-body {
+  flex: 1;
+  min-width: 0;
+  display: flex;
+  flex-direction: column;
+  gap: 2px;
+}
 .b-ask-label {
   font-size: 13px;
   font-weight: 600;
   color: var(--fg-1);
+  line-height: 1.3;
 }
 .b-ask-prompt {
   font-size: 12.5px;
   color: var(--fg-3);
+  line-height: 1.3;
+  white-space: nowrap;
+  overflow: hidden;
+  text-overflow: ellipsis;
 }
```

Also reduce block bottom margin:
```diff
- margin: 0 0 32px;
+ margin: 0 0 24px;
```

---

### U-3 — "On this page" TOC heading too small
**File:** `src/styles/custom.css`  
**Observation:** Right-sidebar TOC heading is `11px` — barely readable at normal viewing distance.

**Proposed change:**
```diff
-.right-sidebar-panel h2 { font-size: 11px; }
+.right-sidebar-panel h2 { font-size: 16px; }
```
