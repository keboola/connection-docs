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

## Deferred — Phase 2 UI/UX

Visual and layout issues spotted during the audit that are outside Phase 1 scope.
Full details and proposed diffs are in **`UI_FIXES_LOG.md`**.

| ID | Issue |
|---|---|
| U-1 | Paragraph spacing too large (`line-height`, `content-gap-y`, `h2` margins) |
| U-2 | "Ask Kai" block — label and prompt render on one line instead of stacking |
| U-3 | "On this page" TOC heading `11px` — too small to read comfortably |

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
