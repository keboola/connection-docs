# Apps docs restructure — handoff prompt

Paste this into a fresh session to continue. It captures the goal, all decisions, current
state, and what's left.

---

You are continuing the **Apps section restructure** of the Keboola help docs
(Astro/Starlight). This is the **structure + form** stage of a four-stage pipeline
(structure → form → **accuracy** → **Kai-weaving**). Accuracy and Kai-weaving are LATER,
separate stages — do NOT verify or "fix" product facts now; only move/shape content and
leave the owner flags in place.

## Where everything is
- **Repo/worktree:** `/Users/nikita/keboola-docs-apps`, branch `PRDCT-358-apps-restructure`
  (off clean `main`). Nothing is committed or pushed. **No PR** (explicitly not wanted).
- **Handoff bundle:** `apps-section/` in the repo — `CONTEXT.md` (full brief, owner map,
  accuracy flags), `STRUCTURE.md` (old→new map), `content-proposal.md` (canonical Linear
  proposal `docs-content-proposal-6381f4e8dc22`), `APPS-UPDATE-PLAN.md` (phased plan),
  `screenshots.mjs` (capture tool), `CLAUDE-CODE-PROMPT.md`.
- **Vault (research notes):** `~/Library/CloudStorage/OneDrive-Personal/Obsidian/Docs Revamp/`
  (`Sections/Apps.md`, `Competitor-doc-benchmarks.md`, `Method.md`, `Decisions.md`).
- **Dev server:** `npm run dev` → http://localhost:4321 (keep ONE running; `pkill -f "astro dev"` first).
  Build: `npm run build`. Sidebar: edit `_data/navigation.yml` then `npm run gen:sidebar`
  (and RESTART dev — sidebar/nav changes need a restart).
- **Live Keboola project used for the walkthrough:** "Documentation Analysis", project
  **6015**, stack `connection.us-east4.gcp.keboola.com` (dev branch). A demo app
  **"Website Analytics Dashboard"** (id `01kwfwawmycmz7jsnhk5r0576j`) is deployed there
  (currently Stopped) — kept for screenshot capture; delete when done.

## Final decided structure (Apps nav order)
Overview (hub) → Getting started → What people build → Build with Kai → Build in the UI →
Build locally → What are Keboola apps → **Python/JS Apps** → **Streamlit Apps**
(children: Lock package versions, Streamlit design guide) → Authentication →
Publish and share → Apps reference.

Files under `src/content/docs/data-apps/`: `index.md`, `getting-started.md`, `examples.md`,
`what-are-apps.md`, `build-with-kai.md`, `build-in-the-ui.md`, `build-locally.md`,
`python-js.md`, `authentication.md`, `publish-and-share.md`, `reference.md`,
`streamlit/index.md`, `streamlit/lock-version.md`, `streamlit/design-guide.md`.

## Final decisions (the ones I made through the chat)
1. **Keep build-path how-to pages AND framework pages.** Build with Kai / in the UI /
   locally are the how-to entry points; **Python/JS Apps** is a dedicated compelling
   overview ("full control, any framework, JS frontends, server-side backend, expose an
   API/MCP, own Git") and **Streamlit Apps** is its own subtree ("quick Python option").
2. **Build approaches differ by framework** (reflect this): Streamlit = paste-code in UI /
   Git repo / Kai; Python/JS = local own-git / Git repo in UI / Kai-with-E2B. Python/JS is
   the "powerful/unique" option to sell users on.
3. **Getting started** = a detailed, screenshot-rich, Kai-first tutorial built from a REAL
   flow performed live in project 6015 (describe → Kai explores Storage → plans → approve →
   deploys), plus **Story of Us** as the inspiring data-narrative example, plus a richer
   overview (the live-site depth the user liked).
4. **Diátaxis + task-first**, sentence-case headings, active voice, limits at the bottom of
   reference. This is a middle path between the strict task-first proposal and the familiar
   framework pages — flag it to Jordan/Michal if it goes to review.
5. **Content conservation:** every old paragraph → a new home or a logged deletion. Release
   changelog deleted. Old python-js Flask/Nginx/keboola-config scaffold content is a
   deletion candidate (superseded by the React+Vite+Express model).
6. **Story of Us** is the showcase app (no official competition "winner" was found; it's
   org-gated to keboola.com so neither the user's keboola.consulting account nor the agent
   can open it).

## Image storage convention (important — I got this wrong once)
Docs reference images by **absolute path** `/data-apps/<name>.png`, served from
**`public/data-apps/`** (NOT from `src/content/docs/`). Put every Apps image (and real
screenshots) in `public/data-apps/`. Current images there are **grey placeholder PNGs**
(1200×700, generated) so the pages render; they are NOT real screenshots.

## Screenshots — the open problem
Real screenshots must be captured with `apps-section/screenshots.mjs` (Playwright, run
locally under the user's login) and copied to `public/data-apps/` under the exact
placeholder filenames. `screenshots.mjs` is pre-configured for project 6015 and the five
getting-started screens (Apps list, Create App screen, Kai build/plan, Approve, Deployed)
plus the gallery apps. NOTE: driving the browser via Claude-in-Chrome CANNOT save files
into the repo (save_to_disk writes browser-side, unreachable) — so the agent cannot add
real screenshots itself; the user runs `screenshots.mjs` or saves images manually.
Placeholder filenames in `public/data-apps/`: `getting-started-{apps-list,create-app,
kai-build,approve,deployed}.png`, `examples-{story-of-us,sre-insights,biotech-checker,
color-season,data-rap,ai-apocalypse,gate-array}.png`.

## Accuracy flags left in the pages (do NOT resolve — for owners, later stage)
- **Adam Vyborný:** `#KBC_TOKEN` is reserved/auto-injected/server-side (docs wrongly say add
  as a secret); "the value is uppercased" → it's the variable NAME; Python 3.10/3.11/3.13
  (not 3.10-only); React+Vite+Express scaffold; Kai-in-E2B prerequisite; draft→production.
- **Miro:** OIDC field names; Auth0 page mislabels "Google OAuth 2.0"; GCP `http://keboola.com`
  → `keboola.com`; Entra non-existent "Tenant ID"; framework positioning; which competition
  apps can be shown publicly.
- **Michal Jeřábek / Pavel Synek:** hosting model — Operator is live, E2B pending; do NOT
  assert E2B as the hosting mechanism; backend versions (no reachable source).

## Hard constraints
- Don't document: pricing/session-billing, in-app Kai toggle, semantic layer.
- Don't state Streamlit is retired (supported-but-specialized). Use `connector`/`component`,
  not "plugin".
- No PR, no push, no merge, don't resolve VERIFY/TODO flags, don't fabricate screenshots.

## What's DONE
- All 14 pages realized; nav + generated sidebar updated; `npm run build` clean (only the
  pre-existing `/404` route-conflict warning). Cross-section links fixed (`kai/python-client.md`).
  All Apps images serve 200 as placeholders from `public/data-apps/`.

## What's PENDING (next steps)
1. Capture and drop in **real screenshots** (`screenshots.mjs` → `public/data-apps/`).
2. Write **`CONSERVATION-REPORT.md`** (repo root): old→new content map + MISSING
   deliberate-deletion candidates + redirect list.
3. **Redirects:** existing `redirect_from` entries were preserved; the moved live-slug URLs
   (`/data-apps/{storage-access,backend-versions,terminal-log-tab,general-design-guide,
   lock-streamlit-version(+code/git),authentication/<provider>}/`) still need redirect
   decisions — list them, don't silently rely on them.
4. Decide on the **demo app** in project 6015 (delete or keep).
5. Later stages (separate): **accuracy pass** with owners (Miro on vacation is the blocker),
   then **Kai-weaving**. If this goes to review, get Jordan/Michal buy-in on the
   framework-pages-alongside-build-paths structure.

Start by reading `apps-section/CONTEXT.md` and `apps-section/STRUCTURE.md`, then run the dev
server and review `src/content/docs/data-apps/`.
