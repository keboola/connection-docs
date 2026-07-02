# Apps section — concrete update plan

*Synthesized from: `content-proposal.md` (canonical Linear proposal, site-wide IA),
`CONTEXT.md` (Apps brief + mentor calls), the vault note `Sections/Apps.md`
(findings/owners), `Competitor-doc-benchmarks.md`, and the screenshot workflow
(`Method.append.md`). Google Drive ("keboola docs revamp project") was unreachable
this session — the Jordan (29 Jun) and Michal (30 Jun) calls are used via their
distillations in CONTEXT.md §4 and the vault note. Reconnect Drive if you want the
raw transcripts folded in.*

Apps is the **active pilot** of the revamp (redirected here from Transformations by
Jordan). Domain = **Workspaces & Apps**. It must prove the reusable page template +
the four-stage pipeline before other domains scale.

---

## 1. Where it stands now

Structure + form is **realized in the repo** (branch `PRDCT-358-apps-restructure`,
worktree `/Users/nikita/keboola-docs-apps`): the 15 old pages → 13 new pages from the
approved skeleton (hub, getting-started, examples, what-are-apps, build-with-kai,
build-in-the-ui, build-locally, authentication, publish-and-share, reference,
streamlit/index + lock-version + design-guide). `npm run build` is clean; sidebar
regenerated; all accuracy flags embedded.

**Not done yet** (this plan covers it): the conservation report for this rebuild,
real screenshots, the accuracy pass, Kai-weaving, the redirect decisions, and the
review/publish gate.

## 2. What "update the apps" means — the four-stage pipeline

Never conflate the stages. We are **finishing stage 2, blocked on stage 3**:

| Stage | Who decides | Status |
|---|---|---|
| 1 Structure | agent / Nikita | ✅ done |
| 2 Form | agent / Nikita | ✅ done (punch list below) |
| 3 Accuracy | **owner or code only** | ⏳ blocked (Miro on vacation) |
| 4 Kai-weaving | agent + owner | ⬜ not started |

## 3. The plan, phase by phase

### Phase A — Finalize structure + form (no owners needed)
- Write `CONSERVATION-REPORT.md` (old→new map + MISSING deletion-candidate list +
  redirect table). Deletion candidates already identified: the old python-js
  Flask/Nginx/Supervisord/`keboola-config` scaffold + Hello World (superseded by the
  React+Vite+Express model → Adam); python-js Troubleshooting + Key terms (old model);
  release changelog (delete, Jordan); old index "Example Apps" (→ examples pending
  Miro); old "Why build apps" value-prop (superseded by lean what-are-apps).
- Apply the **page standard** (proposal §5) to every page: one task per how-to,
  literal control names + nav paths, copy-pasteable config, an explicit **"confirm it
  worked"** step, troubleshooting, `description` present. (Descriptions ✅; add the
  "confirm it worked" step to getting-started / build-* during the accuracy pass since
  exact UI labels are owner-gated.)
- **Titles in the user's words** (Traffic Insights): sanity-check H1 + `description`
  against symptom vocabulary ("data app", "publish app", "app authentication").

### Phase B — Screenshots (Nikita, local — never fabricated)
- Pages carry placeholders `![alt](../assets/apps/<name>.png)` + `<!-- SCREENSHOT(owner) -->`;
  currently backed by 1×1 stubs so the build stays green.
- Capture locally with `apps-section/screenshots.mjs` (Playwright) under your own
  Keboola login: `login` → `apps` (gallery) → `ui` (product screens). Drop the real
  PNGs into `src/content/docs/assets/apps/`, replacing the stubs.
- **Mask** project IDs / tokens / `KBC_` / private data (script `MASK` list).
- **Sequence:** product-UI shots only **after** the owner verifies the flow (Phase C);
  gallery shots only for apps Miro clears as public. Transcribe any code inside a shot
  into a fenced block (e.g. Streamlit `hello-world-code.png`).

### Phase C — Accuracy pass (owner sign-off — the critical path)
Route each embedded flag to its owner; do **not** fix blind. Miro's return unblocks
the OIDC + framework + UI-flow set.

| Flag / area | Owner | File |
|---|---|---|
| `#KBC_TOKEN` reserved/auto-injected (not a secret); "uppercased" = variable *name*; Python 3.10/3.11/3.13; React+Vite+Express scaffold; Kai-in-E2B prerequisite; draft→production; read-only-by-default | **Adam Výborný** | reference, build-with-kai, build-locally, getting-started |
| OIDC field names; Auth0 "Google OAuth 2.0"; GCP `http://keboola.com`→`keboola.com`; Entra "Tenant ID"; per-app settings; UI build flow; framework positioning; basic-auth rotation | **Miro** (blocker) | authentication, build-in-the-ui, reference, what-are-apps, streamlit |
| Hosting model (Operator live, **E2B pending — don't assert E2B**); backend versions (NO-SOURCE) | **Michal Jeřábek / Pavel Synek** | what-are-apps, reference |
| Which competition apps are public | **Miro** | examples |
| `data-app-python-js` README 404 | Nikita | (fix link) |

### Phase D — Kai-weaving (after accuracy)
- Weave Kai in as a **replacement**, not a parallel section (Jordan): build-with-kai is
  already the lead how-to; from what-are-apps / reference, point low-level tasks to Kai
  so users skip manual detail. No separate "Kai" subtree.

### Phase E — Redirects, links, AI layer (parallel, competitor-derived)
- **Ship a redirect table with the structural PR** (Cloudflare practice; proposal §7).
  Preserved `redirect_from` already covers `/components/*` and `/data-apps/oidc/*`.
  **Still needed** (live slugs that moved): `/data-apps/python-js/` →
  `build-with-kai`; `/storage-access/` → `reference#data-access`; `/backend-versions/`
  → `reference#backend-versions`; `/terminal-log-tab/` → `reference#terminal-log`;
  `/general-design-guide/` → `streamlit/design-guide`; `/lock-streamlit-version/`(+code/git)
  → `streamlit/lock-version`; `/authentication/{auth0,google-cloud-platform,microsoft-entra-id,okta}/`
  → `authentication#<provider>`.
- **CI broken-anchor-link audit** (htmltest-style) — move Devin's manual link checks
  into CI; run `scripts/audit-phase2.mjs` after build meanwhile.
- **AI layer:** confirm `.md` page exports resolve for the new pages; keep `llms-full`
  frozen (measured ~0.1% read rate) and rely on Ask Kai RAG + MCP + `.md` (competitor
  finding). AI/MCP queries convert best ("keboola data apps" 21% CTR) → do this in
  parallel, not last.
- Consider a repo `CLAUDE.md`/style-guide addition (Diátaxis + screenshot + accuracy
  rules) so future agents stay on-standard.

### Phase F — Review gate + publish
- Before merge: **Jordan/Michal quality gate** (they are the final arbiters). Show the
  concrete before/after — this pilot produces the reusable template for every later
  domain.
- Publish **section by section** (agreed), not a big-bang relaunch.

## 4. Sequencing & critical path

- **Now, unblocked:** Phase A (conservation report, page-standard tidy) + Phase E
  redirect table + link/AI checks. These need no owners.
- **Blocked on Miro's return:** most of Phase C (OIDC, framework wording, UI flow) and
  therefore the UI screenshots in Phase B and Kai-weaving in Phase D.
- **Adam can unblock in parallel:** the Kai/env/scaffold facts (Phase C) — his answers
  don't wait on Miro.
- Do **not** publish until accuracy sign-off; ship the redirect table with the PR.

## 5. Do-NOT list (carried from CONTEXT + proposal)
No pricing/session-billing, in-app Kai-toggle, or semantic layer. Don't assert E2B as
the live hosting model. Don't state Streamlit is retired (supported-but-specialized).
Use `connector`/`component`, not "plugin". Don't fabricate screenshots or fix facts
without an owner/code source.

## 6. Open decisions to escalate
- **Scope:** unify `data-apps/` (13) with `components/applications/` (12) into one
  "Workspaces & Apps" narrative, or keep separate? → Jordan/Miro.
- **Streamlit framing:** exact "default vs supported / what's superseded" wording → Miro.
- **Public examples:** which competition apps can ship publicly → Miro.
- **Guides layer:** dedicated top-level Guides hub vs. woven-in task pages (proposal
  open question) — affects whether Apps how-tos are also surfaced from a task hub.

## 7. Source index
- `apps-section/content-proposal.md` — canonical Linear proposal (site-wide IA).
- `apps-section/CONTEXT.md` — Apps brief, mentor-call requirements, owner map, flags.
- `apps-section/STRUCTURE.md` — old→new page map.
- vault `Sections/Apps.md` (+ `Apps.append.md`) — findings, owners, competition apps.
- vault `Competitor-doc-benchmarks.md` — Cloudflare/Stripe/Anthropic practices to copy.
- vault `Method.append.md` — screenshot + AI-layer + tooling stance.
- `apps-section/screenshots.mjs` — local capture tool.
