# Apps section — structure + form pass

This is the **structure + form** stage of the four-stage pipeline (structure → form → accuracy → Kai-weaving). Accuracy and Kai-weaving are **not** done here. Facts that need owner sign-off are marked inline.

## Old → new map

| Old (15 pages) | New | Action |
|---|---|---|
| `index.md` | `index.md` | Reshaped into a clean hub (nav + why + 3 build paths). Concept content split out. |
| (concept content, was mixed into index) | `what-are-apps.md` | **Split out** as explanation. |
| `python-js/index.md` | `build-with-kai.md` + `build-locally.md` + `reference.md` | **Split** by Diátaxis type and by build path. |
| `storage-access/index.md` | `build-locally.md` + `reference.md` | **Split**; data-access detail folded into how-to/reference. |
| `authentication/index.md` | `authentication.md` | Kept, expanded to absorb OIDC. |
| `oidc/auth0`, `oidc/google-cloud-platform`, `oidc/microsoft-entra-id`, `oidc/okta` | `authentication.md` (provider sections) | **Merge 4 → 1.** |
| `backend-versions/index.md` | `reference.md` | Folded into reference. |
| `lock-streamlit-version/index.md`, `.../code-deployment`, `.../git-deployment` | `streamlit/lock-version.md` | **Merge 3 → 1**, moved under Streamlit. |
| `general-design-guide/index.md` | `streamlit/design-guide.md` | **Moved** under Streamlit (it's Streamlit-only). |
| `streamlit/index.md` | `streamlit/index.md` | Kept as the Streamlit subtree hub. |
| `terminal-log-tab/terminal-log-tab.md` | `reference.md` (or own ref page) | Filename outlier; fold in. <!-- rename to index.md if kept standalone --> |
| release changelog content (wherever it sat) | — | **Delete.** Belongs in the real changelog, not docs (Jordan). |

Result: 15 → ~10 pages, single-purpose, Diátaxis-typed.

## What I changed (form)

- **Build paths, not frameworks.** How-to is organized as Build with Kai / in the UI / locally. Kai-first to match the low-floor persona (Michal).
- **Kai woven in as replacement**, not a separate section (Jordan): it's the lead how-to and is referenced from explanation + reference.
- **Streamlit isolated** under `/streamlit/` and framed as supported-but-specialized. Not stated as retired (pending Miro).
- **Frontmatter `description` on every page** (mandatory backfill).
- **Limits moved to the bottom** of reference (Jordan).
- Sentence-case headings, active voice, short sentences (Keboola style guide).

## Accuracy flags (NOT fixed here — for owners)

All marked inline as `<!-- VERIFY(owner) -->` or `<!-- TODO(human-review, owner) -->`.

- **Adam Výborný:** `KBC_TOKEN` (reserved/auto-injected, server-side; current page wrongly says add as secret); "uppercased" = variable *name* not value; Python 3.10/3.11/3.13; scaffold (React+Vite+Express, `src/App.tsx`, `server/index.ts`); Kai-in-E2B prerequisite; draft→production flow; read-only-by-default claim.
- **Miro:** OIDC field names; Auth0 page mislabeled "Google OAuth 2.0"; GCP invalid `http://keboola.com` (→ `keboola.com`); Entra non-existent "Tenant ID"; per-app settings table; UI build flow; design-guide + lock-version move/merge; framework positioning; basic-auth rotation gotcha.
- **Michal Jeřábek / Pavel Synek:** hosting model (Operator live, E2B pending — don't assert E2B); backend versions (NO-SOURCE).
- **404 to fix (Nikita):** `data-app-python-js` README link (appeared on two old pages).

## Still pending (next stages)

- Accuracy verification pass with owners (blocked on Miro's return).
- Create `streamlit/design-guide.md` and `streamlit/lock-version.md` from moved/merged source.
- Examples gallery — confirm with Miro which competition apps can be public.
- Scope decision: keep `data-apps` separate from `components/applications`, or unify? (Jordan/Miro.)
- Real UI-locator screenshots; transcribe code-in-screenshots to fenced blocks with masked placeholders.

## Added after Michal's feedback (content pages)

- `getting-started.md` — NEW **tutorial** (Diátaxis 4th type). One concrete worked example: build + publish a sales dashboard with Kai. Hand-holding, for newcomers. This is the "getting started with apps" Michal asked for.
- `examples.md` — NEW **gallery** ("What people build"). Competition apps as cards, grouped by type (dashboards / narratives / creative / games). Screenshot placeholder per card; live URLs collected in the vault Apps note.
- Hub `index.md` updated: added "Start here" → getting-started; "What people build" now links to examples.

New page count: ~10 → ~12 (getting-started + examples).

### Screenshots — how to actually produce them (not fabricated here)
Every image is a placeholder: a markdown `![descriptive alt](path)` + an HTML `<!-- SCREENSHOT(owner) -->` note saying what to capture. Workflow:
- UI-locator shots (Kai screen, publish flow) → capture with Playwright MCP or manually. Mask project IDs / tokens / private data.
- Competition-app shots → gated apps, so an owner (or the app's author) provides them.
- Follow the screenshot standard: keep UI-locator shots, transcribe any code/config in a shot into fenced blocks, drop decorative images.

### Two owner gates before these ship
- Tutorial steps + publish flow → VERIFY with Adam Vyborny / Miro (accuracy pass).
- Which competition apps can be PUBLIC → Miro's call (many are gated/canary).

### Note: sidebar order
`getting-started` and `examples` are set to order 2 and 3; the existing files still carry their old numbers, so the numeric `sidebar.order` across the section needs a 2-minute final renumber pass. Trivial, do it once the page set is final.
