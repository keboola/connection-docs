# Phase 1 Migration Audit Log

**Branch:** `feature/astro-migration`  
**Repo:** `keboola/connection-docs`  
**Auditor:** Nikita Zverev  
**Date:** 2026-06-02  

---

## Summary

Full build passes — 271 pages, no fatal errors. Audit identified 4 categories of issues:
- 2 fixed (rendering bugs)
- 3 fixed (visual/CSS)
- 2 pending (mechanical migration artifacts — ready for PR)

---

## Fixed

### F-1 — Duplicate first paragraph on every page
**File:** `src/components/PageTitle.astro`  
**Type:** Rendering bug  

`PageTitle.astro` auto-extracted the first body paragraph via `deriveLedeFromBody()` and rendered it as a styled lede *above* the page title. The same paragraph then rendered again as normal body content — visible duplication on every page without an explicit `description:` in frontmatter.

**Change:**
```diff
- const lede = (description && description.trim())
-   || deriveLedeFromBody(entry?.body as string | undefined);
+ const lede = description && description.trim();
```

The `deriveLedeFromBody` function is retained in the file but no longer called. The styled lede now only appears when a page explicitly sets `description:` in its frontmatter.

---

### F-2 — Wrong page title on Google Data Policy page
**File:** `src/content/docs/overview/google-data-policy.md`  
**Type:** Frontmatter migration artifact  

The migration script copied the parent section title (`Keboola Overview`) onto this page instead of deriving a title from the page content.

**Change:**
```diff
- title: Keboola Overview
+ title: Google Data Usage Policy
```

---

### F-3 — Paragraph spacing too large
**File:** `src/styles/custom.css`  
**Type:** Visual rendering  

Default Starlight `--sl-content-gap-y: 1rem` combined with `line-height: 1.7` and `h2 margin-top: 40px` made pages feel overly airy.

**Changes:**
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

### F-4 — "Ask Kai" block: label and prompt on one line
**File:** `src/styles/custom.css`  
**Type:** Layout bug  

`.b-ask-body` contained two `<span>` elements (inline by default), causing "Ask Kai about this page" and the placeholder text to render side-by-side on a single line instead of stacking vertically.

**Change:**
```diff
-.b-ask-body { flex: 1; min-width: 0; }
+.b-ask-body {
+  flex: 1;
+  min-width: 0;
+  display: flex;
+  flex-direction: column;
+  gap: 2px;
+}
```

Also reduced the block's bottom margin (`32px → 24px`) and added `text-overflow: ellipsis` to the prompt line.

---

### F-5 — "On this page" heading too small
**File:** `src/styles/custom.css`  
**Type:** Visual  

The right-sidebar TOC heading was `11px` — barely readable at normal viewing distance.

**Change:**
```diff
-.right-sidebar-panel h2 { font-size: 11px; }
+.right-sidebar-panel h2 { font-size: 16px; }
```

---

## Fixed (continued)

### F-6 — Jekyll Kramdown attribute syntax renders as literal text (41 occurrences)
**Type:** Migration artifact  

Four DBT documentation files contained Jekyll Kramdown inline attribute syntax (`{: width="100%" }`) after image tags. Standard Markdown (used by Astro/remark) does not recognize this syntax — rendered as visible garbage text after every image.

The image files themselves exist and resolve correctly. Only the attribute suffix was stripped.

**Affected files:**
| File | Occurrences |
|---|---|
| `src/content/docs/transformations/dbt/transformation/transformation.md` | 16 |
| `src/content/docs/transformations/dbt/cli/cli.md` | 13 |
| `src/content/docs/transformations/dbt/cloud/cloud.md` | 10 |
| `src/content/docs/transformations/dbt/flows/flows.md` | 3 |
| `src/content/docs/transformations/dbt/index.md` | 3 |

**Change:**
```diff
- ![](imgs/2776563898.png){: width="100%" }
+ ![](imgs/2776563898.png)
```

---

### F-7 — Unknown code fence language `bigquery`
**Type:** Migration artifact  

One file used ` ```bigquery ` as a code fence language identifier. Astro's expressive-code highlighter does not recognise it, falling back to plain unformatted text. The build emitted a `[WARN]` for this.

**Affected file:** `src/content/docs/storage/byodb/external-buckets/index.md` line 92

**Change:**
```diff
- ```bigquery
+ ```sql
```

---

## Catalogued — Phase 3 (do not fix now)

### C-1 — Tautological introductory paragraphs
Many section index pages open with a paragraph that re-states what the page title already communicates (e.g. the home page opens with "Welcome to the Keboola documentation — a comprehensive resource..."). These existed in the original Jekyll site and are a content quality issue, not a migration artifact. Scheduled for Phase 3 rewrite.

---

## Remaining Week-1 Tasks

- [x] Fix Kramdown `{: width=... }` attributes (41 occurrences across dbt docs)
- [x] Fix `bigquery` code fence → `sql`
- [ ] **Open PR** — commit all fixes to a branch and open pull request for Jordan's review
- [ ] **Sync with Jordan** — triage this log, agree on Phase 2 priorities
