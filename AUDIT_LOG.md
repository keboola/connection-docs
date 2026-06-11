# Phase 1 Migration Audit Log

**Repo:** `keboola/connection-docs`  
**Auditor:** Nikita Zverev  
**Started:** 2026-06-02 | **Last updated:** 2026-06-08

## PR Status

| PR | Branch | Phase | Status |
|---|---|---|---|
| [#934](https://github.com/keboola/connection-docs/pull/934) | `fix/phase1-migration-audit` | Phase 1 | ✅ **Merged** |
| [#935](https://github.com/keboola/connection-docs/pull/935) | `fix/phase1-code-review` | Phase 1 CR | 🟢 Open — awaiting review |
| [#939](https://github.com/keboola/connection-docs/pull/939) | `feat/phase2-ui-arrow` | Phase 2 UI | 🟢 Open — awaiting review |

---

## Summary

Build passes — 275 pages, no fatal errors (2 harmless framework warnings).

| Category | Count | Status |
|---|---|---|
| Rendering bugs (component level) | 1 | ✅ All fixed |
| Frontmatter migration artifacts | 2 | ✅ All fixed — baked into `migrate.mjs` |
| Kramdown syntax artifacts | 2 | ✅ Fixed — baked into `migrate.mjs` |
| HTML alert blocks not converted | 1 | ✅ Fixed — baked into `migrate.mjs` |
| Code fence artifacts | 1 | ✅ Fixed — baked into `migrate.mjs` |
| Sidebar not regenerated after merge | 1 | ✅ Fixed — 25 pages now visible in nav |
| Audit log files breaking build | 1 | ✅ Fixed — added to `SKIP_FILES` |
| Single-line triple-backtick spans | 1 | ✅ Fixed — baked into `migrate.mjs` |
| Telemetry table invalid markdown | 1 | ✅ Fixed — baked into `migrate.mjs` |
| Cross-branch content gaps | 7 | ✅ All resolved after main sync + migrate re-run |
| Code review fixes (PR #935) | 2 | ✅ Fixed — baked into `migrate.mjs` (PR open) |
| Phase 2 UI implemented | 4 | ✅ Applied — in `custom.css` + `AskKaiDrawer.astro` |
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
| F-13 Alert links/code/bold stripped | `scripts/migrate.mjs` `convertHtmlAlerts()` fixed order | ✅ Yes — baked into script |
| F-14 Stale `flows/conditional-flows/` blocking redirect | `scripts/migrate.mjs` `POST_MIGRATE_DELETE` | ✅ Yes — deleted on every run |
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

### F-13 — `convertHtmlAlerts()` stripped hyperlinks and lost code/bold formatting
**Type:** Migration script bug — found in code review  
**Durability:** ✅ Permanent — fixed in `migrate.mjs`

The catch-all `.replace(/<[^>]+>/g, '')` in `convertHtmlAlerts()` ran before specific tag conversions, stripping `<a href>`, `<code>`, and `<b>` wholesale. Link text survived but URLs were lost; inline code lost its formatting.

**Affected pages (confirmed):**
- `ai/mcp-server/index.md` — `/mcp` and `/sse` lost backtick formatting
- `components/extractors/communication/email-attachments/index.md` — stack URL links lost
- `components/extractors/communication/email-imap/index.md` — MS Outlook component link lost

**Fix in `migrate.mjs`:** Reordered conversions so specific tags are handled before the generic strip:
```diff
- .replace(/<i[^>]*><\/i>/gi, '')
- .replace(/<\/?strong>/gi, '**')
- .replace(/<[^>]+>/g, '')          // stripped links/code too
+ .replace(/<i[^>]*>[\s\S]*?<\/i>/gi, '')
+ .replace(/<a\s[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
+ .replace(/<code>([\s\S]*?)<\/code>/gi, '`$1`')
+ .replace(/<\/?(?:strong|b)>/gi, '**')
+ .replace(/<\/?(?:em|i)>/gi, '_')
+ .replace(/<[^>]+>/g, '')          // only strips remaining unknown tags
```

---

### F-14 — `flows/conditional-flows/` stale page blocking redirect (code review)
**Type:** Migration script bug — found in code review  
**Durability:** ✅ Permanent — fixed in `migrate.mjs` via `POST_MIGRATE_DELETE`

`flows/index.md` declares `redirect_from: ['/flows/conditional-flows/']` but `migrate.mjs` also regenerated `src/content/docs/flows/conditional-flows/index.md` from the old Jekyll source. The redirect-from integration skips any redirect whose target HTML already exists, so visitors kept landing on the stale retired page instead of the current Conditional Flows page.

**Fix:** Added `POST_MIGRATE_DELETE` array to `migrate.mjs`. After every migration run, listed directories are deleted from `src/content/docs/`. Stale `flows/conditional-flows/` directory and all its images (8 files) deleted.

```js
const POST_MIGRATE_DELETE = [
  'flows/conditional-flows', // moved to flows/index.md with redirect_from
];
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

## Phase 2 UI/UX — Applied ✅

Full details in **`UI_FIXES_LOG.md`**. Changes are in `src/styles/custom.css` and `src/components/AskKaiDrawer.astro` — neither is touched by `migrate.mjs`.

| ID | Issue | Status |
|---|---|---|
| U-1 | Paragraph spacing too large — `line-height`, `content-gap-y`, `h2` margins | ✅ Applied |
| U-2 | "Ask Kai" block label/prompt on one line — missing `flex-direction: column` | ✅ Applied |
| U-3 | "On this page" TOC font `11px` — too small | ✅ Applied — `14px` heading, `14px` links |
| U-4 | Sidebar collapse toggle — Stripe-style `←` button, fade animation, frozen right TOC | ✅ Applied — PR #939 open |

**Sidebar collapse implementation notes:**
- Button sits LEFT of grey dividing line at HOME-nav level (`nav-height + 88px`)
- Fade animation: sidebar `opacity→0` (0.22s) then `width: 0` snaps — no visible shrinking
- Right "On this page" stays frozen: `flex-shrink:0; width:var(--sl-sidebar-width)`
- State persisted in `localStorage`, restored on every Astro view transition
- Root cause: `--sl-sidebar-width` is shared between left sidebar pane AND right TOC width formula — targeting `.sidebar-pane` width directly avoids breaking the right panel

---

## Catalogued — Phase 3 (do not fix now)

### C-1 — Tautological introductory paragraphs
Many section index pages open with a paragraph that re-states what the page title already communicates (e.g. the home page opens with "Welcome to the Keboola documentation — a comprehensive resource..."). These existed in the original Jekyll site and are a content quality issue, not a migration artifact. Scheduled for Phase 3 rewrite.

---

## Task Status

### Phase 1 — Complete ✅
- [x] F-1 Duplicate first paragraph — `PageTitle.astro`
- [x] F-2 Wrong page title — `migrate.mjs` `TITLE_OVERRIDES`
- [x] F-6 Kramdown `{: width=...}` — 41 occurrences stripped
- [x] F-7 `bigquery` fence → `sql` — `migrate.mjs` `FENCE_LANG_ALIASES`
- [x] F-8 Kramdown `{: .alert.alert-*}` — `migrate.mjs` `convertAlertAttributes()` (12 occurrences)
- [x] F-9 HTML `<div class="alert">` — `migrate.mjs` `convertHtmlAlerts()`
- [x] F-10 Sidebar not regenerated — ran `convert-nav.mjs`, 275 pages built
- [x] F-11 Audit logs breaking build — `migrate.mjs` `SKIP_FILES`
- [x] F-12 Single-line ` ```x``` ` spans — `migrate.mjs` `expandSingleLineFences()` (36 occurrences)
- [x] F-13 Alert links/code stripped — `migrate.mjs` `convertHtmlAlerts()` fix (PR #935)
- [x] F-14 `flows/conditional-flows/` blocking redirect — `migrate.mjs` `POST_MIGRATE_DELETE` (PR #935)
- [x] M-1…M-7 — resolved by merging `main` + rerunning `migrate.mjs`
- [x] PR #934 — **merged** into `feature/astro-migration`
- [ ] PR #935 — open, awaiting Jordan's review (Phase 1 CR fixes)

### Phase 2 — Applied, PRs open
- [x] U-1 Paragraph spacing — `custom.css`
- [x] U-2 Ask Kai block layout — `custom.css`
- [x] U-3 TOC font size ×1.5 — `custom.css`
- [x] U-4 Sidebar collapse toggle — `custom.css` + `AskKaiDrawer.astro`
- [ ] PR #939 — open, awaiting Jordan's review (sidebar arrow position fix)

### Phase 3 — Not started (pending Phase 2 merge)
- [ ] Content rewrite — task-oriented, agent-optimized pages
- [ ] Feedback vote buttons
- [ ] Edit → auto-open PR for contributions

---

## Phase 2 — Systematic migration-fidelity audit (2026-06-09)

This is the full-site mechanical pass Jordan's onboarding calls "your first real
task" — the earlier F-/M- findings were caught ad hoc; this is exhaustive.

**Tool:** `scripts/audit-phase2.mjs` (read-only; run after `astro build`). Crawls
all **439** built HTML pages in `dist/` + **274** markdown sources for: broken
internal links, missing images, old-domain link smells, heading hierarchy,
malformed tables, unclosed code fences.

### Results

| Check | Count | Severity |
|---|---|---|
| Broken internal links | 36 | 🔴 High (33 = missing assets, 3 = dead page links) |
| Missing images | **0** | ✅ Clean — confirms M-2 held |
| Malformed tables | **0** | ✅ Clean |
| In-content links to old domains | 162 | 🟠 Medium-High |
| Multiple `<h1>` per page | 5 | 🟡 Medium |
| Unclosed/unbalanced code fence | 1 | 🟡 Low |
| External links (not network-checked) | 1555 | ⚪ Deferred |

> A first run reported 600 "old-domain" hits; ~438 were the legitimate `<head>`
> canonical tag on every page. The audit now scans **body content only**, so the
> 162 are genuine in-content cross-references.

### A-1 — Downloadable assets not migrated (≈33 broken links) 🔴
**Root cause:** `migrate.mjs` copies only `IMAGE_EXTS`
(`.png/.jpg/.jpeg/.gif/.svg/.webp`). Pages link to downloadable **`.csv` / `.zip`
/ `.docx` / `.json`** sample files that exist in the Jekyll source (e.g.
`transformations/source.csv`, `tutorial/branches/bitcoin_price.csv`,
`tutorial/onboarding/usage-blueprint/…-blueprint-document.docx`,
`components/ip-addresses/kbc-public-ip.json`) but are never copied.
**Fix (durable):** add a `DOWNLOAD_EXTS` set to `migrate.mjs`, copy those files
alongside images (dual copy → `src/content/docs` + `public`).
Affected: `transformations/{python,r}-plain/*`, `transformations/{bigquery,oracle,
snowflake-plain}`, `tutorial/load/*`, `tutorial/branches/*`,
`components/extractors/**`, `components/ip-addresses`, `tutorial/onboarding/usage-blueprint`.

### A-2 — Dead internal page links (3) 🔴
- `/404` → `/overview/environment/` (no such page)
- `/components/extractors/other/telemetry-data/` → `/ai/kai-assistant/` (no such page)
- `/workspace/table-export/` → `/integrate/storage/api/importer/#download-a-file`
  — an `/integrate/…` path that **only exists in the developer docs** (resolves
  for free once dev docs are unified; until then repoint to developers.keboola.com).
**Fix:** confirm correct targets with Jordan (content-fact), then fix links/redirects.

### A-3 — In-content absolute links to legacy domains (162) 🟠
Body links hard-coded to `https://help.keboola.com/…` and
`https://developers.keboola.com/…` instead of relative internal routes. When the
Astro site replaces help.keboola.com, the help-domain ones bounce readers back to
the old site. **Fix (durable):** a `migrate.mjs` transform rewriting
`https://help.keboola.com/<path>` → `/<path>` where the path exists in the new
site. The `developers.keboola.com` subset is the strongest evidence for dev-docs
unification (those become internal once unified) — see `DEV_DOCS_INTEGRATION.md`.

### A-4 — Multiple `<h1>` per page (5) 🟡
`/data-apps/python-js/` (4), `/workspace/snowflake-workspaces-access-changes/` (4),
`/storage/byobq/` (3), `/data-apps/storage-access/` (2), `/management/notifications/` (2).
Likely raw `<h1>` HTML carried over from Jekyll on top of the page-title `<h1>`.
**Fix:** demote in-content `<h1>`→`<h2>` (verify each).

### A-5 — Unclosed/unbalanced code fence (1) 🟡
`flows/templates/datahub/datahub.md` — 5 ``` markers (odd). Verify manually.

### A-6 — Clean ✅
0 missing images, 0 malformed tables — image migration (M-2) and table conversion
held across the whole site.

### Not yet covered (next iterations)
- External link validation (1555 links — network pass, do separately).
- Old↔new page-for-page fidelity diff vs the live Jekyll site.
- Visual table/heading spot-check on the flagged pages.

### Phase 2 audit — task checklist
- [x] **A-1 Add `DOWNLOAD_EXTS` copy to `migrate.mjs`** — ✅ done. 24 assets now
      copied (dual: `src/content/docs` + `public`); broken links **36 → 3**.
- [x] **A-7 (new) Skip `claude.md`/`CLAUDE.md` in migration** — ✅ done. The
      validation re-run revealed `migrate.mjs` was copying the instructions file
      into `src/content/docs/` (same class as F-11) — added to `SKIP_FILES`. Also
      added `dist`/`.astro`/`.vercel` to `SKIP_DIRS` (never a migration source).
- [ ] A-2 Fix 3 dead page links — **needs Jordan** (correct targets are a content
      fact): `/overview/environment/`, `/ai/kai-assistant/`, `/integrate/…` (dev-docs).
- [ ] A-3 Rewrite legacy-domain links → internal — **deferred**: needs a two-pass
      transform that only rewrites when the target route exists (else it would
      turn working external links into broken internal ones). Don't touch the
      `developers.keboola.com` subset until dev docs are unified.
- [ ] A-4 Demote stray in-content `<h1>` on 5 pages — **deferred**: these are real
      markdown `#` body headings, so fixing properly means shifting heading levels
      on those pages (borderline Phase-3 content work). Low severity.
- [ ] A-5 Repair datahub fence — **deferred**: needs a careful human look at the
      SQL block (mis-editing the fence could make it worse). 1 page, low severity.
- [ ] External-link network check (separate pass)
- [x] **Old↔new page-tree fidelity** — ✅ automated in `scripts/switchover.mjs`
      (page-tree diff, see cutover section below). Per-page *content* fidelity diff
      still open.

> Bonus fix landed with the migrate re-run: a stale **duplicate "Important:" line**
> in `storage/data-streams/data-streams.md` (curly vs straight apostrophe) is now
> de-duplicated by the script.

---

## Production cutover — Jekyll → Astro switchover (2026-06-11)

Getting the Astro site live at help.keboola.com (replacing Jekyll). Mechanical
only — content rewrite is a separate, later phase.

### Done
- Merged into `feature/astro-migration`: **#942** (Phase 2 UI), **#943** (Phase 2
  migration fixes + audit tooling), **#944** (Kai → AI Service API, dropped the MCP).
- Synced `feature/astro-migration` with `main` (telemetry + BigQuery SQL-editor
  docs, #937/#938). Build clean, 274 pages. #897 (→ `main`) is no longer behind.
- Repo guides added (**#946**): `AGENTS.md`, `CLAUDE.md`, refreshed `README.md`.

### Switchover script — `scripts/switchover.mjs` (#945)
The repo still **duplicates** (Jekyll source + generated Astro). The script does
the one-time cutover (dry-run by default, never auto-commits):

1. Preflight (clean tree, on a branch ≠ main).
2. Finalize Astro — `migrate.mjs` + `convert-nav.mjs`.
3. Pre-cutover build.
4. **Page-tree diff (migration-completeness gate)** — diffs the Jekyll source page
   tree against the generated Astro tree; **aborts before deletion if any Jekyll
   page has no Astro counterpart** (excludes redirect stubs + `POST_MIGRATE_DELETE`;
   override with `--force`). Latest run: **269 Jekyll pages → all matched, 0
   missing**; 5 Astro-only (`flows/orchestrator/*`, fine).
5. `git rm` the Jekyll source (20 entries: 13 content dirs + `_includes`/
   `_layouts`/`_sass`/`assets` + `_config.yml` + root `index.md`/`404.md`).
6. Post-cutover build — must still pass (Astro stands alone).
7. Summary; no commit.
   `_data/` is kept (still feeds `convert-nav.mjs`); `migrate.mjs` becomes obsolete
   afterward (content is then edited directly in `src/content/docs/`).

### Remaining (maintainer / hands-on)
- [ ] Run `scripts/switchover.mjs --apply` with Jordan → review → commit.
- [ ] Approve + merge **#897** (`feature/astro-migration` → `main`).
- [ ] Set Kai env vars in Vercel (`AI_SERVICE_URL`, `KBC_STORAGE_API_TOKEN`).
- [ ] Switch the `help.keboola.com` domain to the Astro deployment.
