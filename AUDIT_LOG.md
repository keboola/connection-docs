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
| Frontmatter migration artifacts | 2 | ✅ All fixed — baked into `migrate.mjs` |
| Kramdown syntax artifacts | 2 | ✅ Fixed — baked into `migrate.mjs` |
| HTML alert blocks not converted | 1 | ✅ Fixed — baked into `migrate.mjs` |
| Code fence artifacts | 1 | ✅ Fixed — baked into `migrate.mjs` |
| Sidebar not regenerated after merge | 1 | ✅ Fixed — 25 pages now visible in nav |
| Audit log files breaking build | 1 | ✅ Fixed — added to `SKIP_FILES` |
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
| F-8 Kramdown `{: .alert.alert-*}` | `scripts/migrate.mjs` `convertAlertAttributes()` | ✅ Yes — baked into script |
| F-9 HTML `<div class="alert">` | `scripts/migrate.mjs` `convertHtmlAlerts()` | ✅ Yes — baked into script |
| F-10 Sidebar not regenerated | Run `node scripts/convert-nav.mjs` after each merge | ⚠️ Manual step — must be part of sync workflow |
| F-11 Audit logs in content dir | `scripts/migrate.mjs` `SKIP_FILES` | ✅ Yes — baked into script |
| F-12 Single-line ` ```x``` ` spans | `scripts/migrate.mjs` `expandSingleLineFences()` | ✅ Yes — baked into script |
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

### F-8 — Kramdown `{: .alert.alert-*}` blocks rendered as plain text (12 occurrences)
**Type:** Migration artifact  
**Durability:** ✅ Permanent — fixed in `migrate.mjs` via `convertAlertAttributes()`

Four files used Jekyll Kramdown block-level alert attributes (a line before the paragraph they style). `migrate.mjs` was stripping the marker via `removeKramdownAttrs()` but leaving the following paragraph as unstyled plain text — losing the warning/info box visible on the live site.

**Affected files:**
| File | Occurrences |
|---|---|
| `storage/bucket-exposure/index.md` | 2 |
| `storage/byodb/external-buckets/index.md` | 7 |
| `storage/byodb/snowflake-secure-data-sharing/index.md` | 1 |
| `transformations/dbt/transformation/transformation.md` | 2 |

**Example change:**
```diff
- {: .alert.alert-warning}
- Important: This feature is currently available in BETA…
+ :::caution
+ Important: This feature is currently available in BETA…
+ :::
```

**Change in `migrate.mjs`:** Added `convertAlertAttributes()` with mapping:
- `alert-warning` → `:::caution`
- `alert-info` → `:::note`
- `alert-danger` → `:::danger`
- `alert-success` → `:::tip`

Runs before `removeKramdownAttrs()` so the marker is still present when the paragraph is converted.

---

### F-9 — HTML `<div class="alert alert-*">` blocks not converted (data-streams page broken)
**Type:** Migration artifact  
**Durability:** ✅ Permanent — fixed in `migrate.mjs` via `convertHtmlAlerts()`

`storage/data-streams/data-streams.md` contained a `<div class="alert alert-warning">` HTML block preceded by `<div class="clearfix"></div>`. These rely on Bootstrap CSS and Font Awesome icons that don't exist in Astro — the alert rendered as broken unstyled HTML and the clearfix div left an empty block.

`migrate.mjs` had no handler for this form (only the Kramdown `{:}` form was handled).

**Example change:**
```diff
- <div class="clearfix"></div>
- <div class="alert alert-warning" role="alert">
-     <i class="fas fa-exclamation-circle"></i>
-     <strong>Important:</strong> Changing the table's name will create a new table…
- </div>
+ :::caution
+ **Important:** Changing the table's name will create a new table…
+ :::
```

**Change in `migrate.mjs`:** Added `convertHtmlAlerts()` which:
- Strips `<div class="clearfix">` entirely
- Converts `<div class="alert alert-TYPE">` to the matching `:::` admonition
- Strips `<i class="fas …">` icon tags (FA not available in Astro)
- Converts `<strong>` to `**` markdown bold

Runs alongside `convertAlertAttributes()` so both alert patterns are fully covered.

---

### F-10 — Sidebar not regenerated after merging `main` (25 pages invisible in nav)
**Type:** Process gap  
**Durability:** ✅ Resolved — `node scripts/convert-nav.mjs` must be re-run after every `main` merge

After merging the latest `main` commits, `src/sidebar.mjs` was not regenerated. The content files existed and built correctly, but were invisible in the navigation. Affected pages:

- `storage/bucket-exposure`
- `flows/flows-legacy` + `flows/flow-migration-guide`
- `storage/data-streams/opentelemetry`
- All 20 flow templates

**Fix:** Ran `node scripts/convert-nav.mjs`. Build page count went from 271 → 275.

**Note for Jordan:** The workflow after every `main` sync should be:
1. `git merge origin/main`
2. `node scripts/migrate.mjs`
3. `node scripts/convert-nav.mjs`
4. `astro build` to verify

---

### F-12 — Single-line triple-backtick spans treated as broken code fences (36 occurrences)
**File:** `components/extractors/marketing-sales/bing-ads/report-presets-columns-and-pk/index.md`  
**Type:** Migration artifact  
**Durability:** ✅ Permanent — fixed in `migrate.mjs` via `expandSingleLineFences()`

Jekyll/Kramdown treats ` ```content``` ` on one line as an inline code span. Remark (used by Astro) treats the opening ` ``` ` as a fenced code block start and takes the entire content (`TimePeriod, CurrencyCode, ...`) as the language identifier — breaking rendering completely for the entire Bing Ads report presets page.

**Example change:**
```diff
- ```TimePeriod, CurrencyCode, AdDistribution, DeviceType, …```
+ ```
+ TimePeriod, CurrencyCode, AdDistribution, DeviceType, …
+ ```
```

**Change in `migrate.mjs`:** Added `expandSingleLineFences()` which converts any line matching ` ```content``` ` (open and close on same line) to a proper 3-line fenced code block. Runs before `convertHighlightBlocks()` and `remapFenceLanguages()`.

---

### F-11 — `AUDIT_LOG.md` and `UI_FIXES_LOG.md` copied into `src/content/docs/` breaking build
**Type:** Process gap  
**Durability:** ✅ Permanent — both files added to `SKIP_FILES` in `migrate.mjs`

`migrate.mjs` scanned the repo root and copied all `.md` files — including the audit logs — into `src/content/docs/`. Astro's content collection schema requires frontmatter with `title:`, so the build failed with `InvalidContentEntryDataError`.

**Fix in `migrate.mjs`:**
```diff
 const SKIP_FILES = new Set([
   'README.md', 'LICENSE', 'LICENSE.md', 'CONTRIBUTING.md',
+  'AUDIT_LOG.md', 'UI_FIXES_LOG.md',
 ]);
```

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
- [x] F-2 Wrong page title — `migrate.mjs` `TITLE_OVERRIDES`
- [x] F-6 Kramdown `{: width=...}` — 41 occurrences stripped
- [x] F-7 `bigquery` fence → `sql` — `migrate.mjs` `FENCE_LANG_ALIASES`
- [x] F-8 Kramdown `{: .alert.alert-*}` — `migrate.mjs` `convertAlertAttributes()` (12 occurrences, 4 files)
- [x] F-9 HTML `<div class="alert">` — `migrate.mjs` `convertHtmlAlerts()` (data-streams + others)
- [x] F-10 Sidebar not regenerated — ran `convert-nav.mjs`, 275 pages now built
- [x] F-11 Audit logs breaking build — added to `migrate.mjs` `SKIP_FILES`
- [x] F-12 Single-line ` ```x``` ` spans — `migrate.mjs` `expandSingleLineFences()` (36 occurrences, Bing Ads)
- [x] M-1…M-7 — all resolved by merging `main` + rerunning `migrate.mjs`
- [ ] **Open PR** — push branch and open pull request for Jordan's review
- [ ] **Sync with Jordan** — triage this log, agree on Phase 2 priorities
