# Phase 1 Migration Audit Log

**Branch:** `fix/phase1-migration-audit`  
**Repo:** `keboola/connection-docs`  
**Auditor:** Nikita Zverev  
**Started:** 2026-06-02 | **Last updated:** 2026-06-03

---

## Summary

Full build passes — 271 pages, no fatal errors.

| Category | Count | Status |
|---|---|---|
| Rendering bugs (component level) | 1 | ✅ All fixed |
| Frontmatter migration artifacts | 2 | ✅ All fixed — 1 baked into `migrate.mjs` |
| Kramdown syntax artifacts | 1 | ✅ Fixed — already handled by `migrate.mjs` |
| Code fence artifacts | 1 | ✅ Fixed — baked into `migrate.mjs` |
| Cross-branch content gaps | 7 | ✅ All resolved after main sync + migrate re-run |
| Deferred UI/UX (Phase 2) | 3 | 📋 Logged in `UI_FIXES_LOG.md` |
| Deferred content quality (Phase 3) | 1 | 📋 Catalogued below |

---

## Durability of each fix

| Fix | Location | Survives `migrate.mjs` rerun? |
|---|---|---|
| F-1 Duplicate paragraph | `src/components/PageTitle.astro` | ✅ Always — script never touches components |
| F-2 Wrong page title | `scripts/migrate.mjs` `TITLE_OVERRIDES` | ✅ Yes — baked into script |
| F-6 Kramdown `{: width=...}` | `scripts/migrate.mjs` `removeKramdownAttrs()` | ✅ Always — was already in script |
| F-7 `bigquery` code fence | `scripts/migrate.mjs` `FENCE_LANG_ALIASES` | ✅ Yes — baked into script |
| M-1…M-7 Content gaps | Resolved by merging `main` + rerunning script | ✅ Self-healing on every future rerun |

---

## Fixed — Component / Frontend

### F-1 — Duplicate first paragraph on every page
**File:** `src/components/PageTitle.astro`  
**Type:** Rendering bug  
**Durability:** Permanent — `migrate.mjs` never touches `src/components/`

`PageTitle.astro` contained a `deriveLedeFromBody()` function that automatically extracted the first body paragraph and rendered it as a styled lede above the page content. The same paragraph then rendered again as normal body text — causing visible duplication on every page that did not have an explicit `description:` in its frontmatter.

**Change:**
```diff
- const lede = (description && description.trim())
-   || deriveLedeFromBody(entry?.body as string | undefined);
+ const lede = description && description.trim();
```

`deriveLedeFromBody` is retained in the file but no longer called. The styled lede now only appears when a page explicitly sets `description:` in its frontmatter.

---

## Fixed — Migration Script (`scripts/migrate.mjs`)

### F-2 — Wrong page title on Google Data Policy page
**File:** `src/content/docs/overview/google-data-policy.md`  
**Type:** Frontmatter migration artifact  
**Durability:** ✅ Permanent — fixed in `migrate.mjs` via `TITLE_OVERRIDES` map

The Jekyll source had `title: Keboola Overview` (copied from the parent section). The migration faithfully reproduced the wrong title. Now corrected via a per-file override in the script.

**Change in generated file:**
```diff
- title: Keboola Overview
+ title: Google Data Usage Policy
```

**Change in `migrate.mjs`:**
```js
const TITLE_OVERRIDES = {
  'overview/google-data-policy.md': 'Google Data Usage Policy',
};
```
Applied in `transformFile()` after all other frontmatter transforms. To fix other wrong titles in future, add an entry to this map.

---

### F-6 — Jekyll Kramdown `{: width="..."}` renders as literal text (41 occurrences)
**Type:** Migration artifact  
**Durability:** ✅ Permanent — already handled by `removeKramdownAttrs()` in `migrate.mjs`

Four DBT documentation files contained Jekyll Kramdown inline attribute syntax after image tags. Astro's remark pipeline does not recognise this syntax — it rendered as visible garbage text after every image.

**Affected files:**
| File | Occurrences |
|---|---|
| `transformations/dbt/transformation/transformation.md` | 16 |
| `transformations/dbt/cli/cli.md` | 13 |
| `transformations/dbt/cloud/cloud.md` | 10 |
| `transformations/dbt/flows/flows.md` | 3 |
| `transformations/dbt/index.md` | 3 |

**Example change:**
```diff
- ![](imgs/2776563898.png){: width="100%" }
+ ![](imgs/2776563898.png)
```

Note: image files themselves were present and resolving correctly — only the attribute suffix was the problem.

---

### F-7 — Unknown code fence language `bigquery`
**Type:** Migration artifact  
**Durability:** ✅ Permanent — fixed in `migrate.mjs` via `FENCE_LANG_ALIASES` map

One file used ` ```bigquery ` as a code fence language. Astro's expressive-code highlighter does not recognise it — the build emitted a `[WARN]` and the block rendered as plain unformatted text.

**Affected file:** `storage/byodb/external-buckets/index.md`

**Change in generated file:**
```diff
- ```bigquery
+ ```sql
```

**Change in `migrate.mjs`:**
```js
const FENCE_LANG_ALIASES = {
  bigquery: 'sql',
};
```
The new `remapFenceLanguages()` function runs in `transformBody()` after highlight-block conversion. To silence future unknown-language build warnings, add an entry to this map.

---

## Fixed — Cross-Branch Content Gaps

> **Audit method:** `git diff FETCH_HEAD:<old-path> src/content/docs/<new-path>` across all 269 pages, comparing `main` against `feature/astro-migration`.  
> **Root cause of all M-series issues:** `main` received new commits after the last `migrate.mjs` run. Merging `main` and re-running the script resolved all of them automatically.

---

### M-1 — 5 pages not present in migrated site ✅ RESOLVED
**Resolution:** Merge + `migrate.mjs` rerun

| Page | Note |
|---|---|
| `data-apps/oidc/index.md` | Was a `redirect_to` stub — script correctly folded its URL into `redirect_from` on `/data-apps/authentication/` |
| `flows/flow-migration-guide/index.md` | Now migrated |
| `flows/flows-legacy/index.md` | Now migrated |
| `storage/bucket-exposure/index.md` | Now migrated |
| `storage/data-streams/opentelemetry/index.md` | Now migrated |

---

### M-2 — 21 images missing from `/public` ✅ RESOLVED
**Resolution:** Merge + `migrate.mjs` rerun

Images were added to `main` after the last migration run and not yet copied to `/public`. All 21 now present:

```
/flows/conditional-flows-variables-*.png  (4 files)
/flows/conditional-flows-*.png            (7 files)
/flows/flow-migration-guide/*.png         (4 files)
/storage/bucket-exposure/figures/*.png    (5 files)
/transformations/mappings/manual-output-mapping.png
```

---

### M-3 — `flows/index.md` had wrong content version ✅ RESOLVED
**Resolution:** Merge + `migrate.mjs` rerun

The migrated Flows page described the legacy "Flow Builder" product instead of the current "Conditional Flows" feature. The `main` branch had been updated to Conditional Flows after the last `migrate.mjs` run. Now correctly titled and structured.

---

### M-4 — "flows" incorrectly replaced with "orchestrations" in 3 places ✅ RESOLVED
**Resolution:** Merge + `migrate.mjs` rerun

The migrated content used stale terminology ("orchestrations") from an older `main` snapshot. Updated `main` content uses the current term "flows" consistently.

| File | Wrong text | Correct text |
|---|---|---|
| `management/project/tokens/index.md` | `for example, orchestrations` | `for example, flows` |
| `management/project/tokens/index.md` | `they can trigger orchestrations` | `they can trigger flows` |
| `overview/index.md` | `[flows](/flows/orchestrator)` | `[flows](/flows/)` |

---

### M-5 — Alias table paragraph dropped from `storage/tables/index.md` ✅ RESOLVED
**Resolution:** Merge + `migrate.mjs` rerun

The following paragraph was absent in the migration but present in `main`:

> *"Alias tables are automatically materialized as physical database VIEWs. This makes them fully accessible in workspaces and transformations via read-only storage access — no input mapping configuration is required. Filtered aliases are also supported; the filter condition is enforced as a `WHERE` clause in the VIEW."*

---

### M-6 — Missing `redirect_from: /storage/tokens/` ✅ RESOLVED
**Resolution:** Merge + `migrate.mjs` rerun

The tokens page was previously accessible at `/storage/tokens/`. The redirect was absent in the migration, which would have caused 404s for any external links. Now present.

---

### M-7 — Oxford comma dropped in `transformations/mappings/index.md` ✅ RESOLVED
**Resolution:** Merge + `migrate.mjs` rerun

```diff
- remove the filter completely from the input mapping, take advantage of the clone loading, and do the filtering
+ remove the filter completely from the input mapping, take advantage of the clone loading and do the filtering
```
The stale `main` snapshot had already removed the comma; the updated `main` restores it.

---

## Deferred — Phase 2 UI/UX

Visual and layout issues spotted during the audit. Outside Phase 1 scope — full details and proposed diffs are in **`UI_FIXES_LOG.md`**.

| ID | File | Issue |
|---|---|---|
| U-1 | `src/styles/custom.css` | Paragraph spacing too large (`line-height 1.7`, `content-gap-y 1rem`, `h2 margin-top 40px`) |
| U-2 | `src/styles/custom.css` | "Ask Kai" block — `.b-ask-body` missing `flex-direction: column`, label and prompt render on one line |
| U-3 | `src/styles/custom.css` | "On this page" TOC heading `11px` — too small to read comfortably |

---

## Catalogued — Phase 3 (do not fix now)

### C-1 — Tautological introductory paragraphs
Many section index pages open with a paragraph that re-states what the page title already communicates (e.g. the home page opens with "Welcome to the Keboola documentation — a comprehensive resource..."). These existed in the original Jekyll site and are a content quality issue, not a migration artifact. Scheduled for Phase 3 rewrite.

---

## Remaining Tasks

- [x] F-1 Duplicate first paragraph — `PageTitle.astro`
- [x] F-2 Wrong page title — `migrate.mjs` + generated file
- [x] F-6 Kramdown `{: width=...}` — 41 occurrences stripped
- [x] F-7 `bigquery` fence → `sql` — `migrate.mjs` + generated file
- [x] M-1…M-7 — all resolved by merging `main` + rerunning `migrate.mjs`
- [ ] **Open PR** — push branch and open pull request for Jordan's review
- [ ] **Sync with Jordan** — triage this log, agree on Phase 2 priorities
