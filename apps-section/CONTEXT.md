# Apps docs — working context

Single source of truth for the Apps section of the Help Documentation Revamp.
Read this fully before editing anything. It gathers: the proposal, the
stakeholder requirements from recorded calls, competitor best-practices, the
screenshot workflow, and the non-negotiable discipline.

Canonical proposal (verbatim): Linear document `docs-content-proposal-6381f4e8dc22`
("Docs Content Proposal"). This file summarizes it; the Linear doc wins on conflict.

---

## 1. Project & goal

Restructure Keboola's docs (`help.keboola.com`, Astro/Starlight, ~250 pages) into a
unified, task-first, Diátaxis-organized, AI-readable site. Work section by section,
pilot before scale. Apps is the current pilot (redirected from Transformations by Jordan).

Resolved decisions:
- Dev prose guides merge into `help.keboola.com`; generated API reference at
  `api.keboola.com` stays separate and is linked.
- Publish section by section (not one big-bang relaunch).

## 2. Non-negotiable discipline

- **Four-stage pipeline, in order:** structure → form → accuracy (owner sign-off) →
  Kai-weaving. Never conflate them.
- **Structure/form** = agent/Nikita can decide. **Accuracy (facts, deletions)** =
  only a knowledge owner or code can confirm. Do NOT assert or "fix" a fact without
  a source; mark it `TODO(human-review, <owner>)` or `VERIFY(<owner>)`.
- **Content conservation:** every piece of old content lands in a new home OR is a
  LOGGED deliberate deletion. MISSING ≠ delete — it's a candidate for owner review.
- **Kai = replacement, not addition:** weave Kai in where it replaces low-level
  manual detail; do not create a parallel Kai section.
- **Screenshot standard:** keep UI-locator shots; transcribe code/config/output from
  screenshots into fenced blocks with masked placeholders; drop decorative shots.
- **Do NOT document (roadmap/unsolved):** pricing / session-based billing (owner
  Pavel Doležal), in-app Kai-toggle, semantic layer.
- **E2B:** do not assert E2B as the live hosting mechanism. Operator is live today;
  E2B is pending Groupon/SOX sign-off.
- **Streamlit:** supported-but-specialized, its own subtree. Do NOT state it is retired.

## 3. Proposal — key positions (summary)

- Problem: mixed-type "frankenstein" pages; no frontmatter `description` (hurts
  search + Ask Kai); content/code drift (docs contain stale/untrue facts).
- Principles: task-first, Diátaxis, AI-readable.
- Navigation: domain-based; every page single-purpose.
- Diátaxis page types: tutorial / how-to / reference / explanation.
- AI layer: rely on Ask Kai RAG + MCP + markdown page exports; llms.txt/llms-full.txt
  is frozen (too large, contested value — see §6).

## 4. Requirements from the stakeholder calls

From Jordan (29 Jun):
- Split frankenstein pages; single purpose each. Good.
- Deletion is expected: remove untrue/stale content and over-explanation.
- Overview pages should be fuller; how-to pages shorter, action-first.
- Limits go at the BOTTOM of reference pages, never the top; promote best-practices.
- Weave Kai in as a REPLACEMENT (push people to Kai → they skip low-level detail).
- Loop in owners; assign pages to them; Jordan/Michal are final quality gate.
- Delete the release changelog from docs (belongs in the real changelog).
- Apps > Transformations in priority; Streamlit content belongs under Streamlit.

From Michal (30 Jun):
- Apps is a big strategic bet (2+ teams). Lead with the low-floor persona.
- Show product advantages + inspire; run "what you can build".
- "Apps usually run on JavaScript/Python; Streamlit sometimes if needed." Kai picks
  the framework. Streamlit likely deprioritized/retiring — but confirm with Miro.
- Structure around the app lifecycle: why care → what you can build → how to build
  (Kai / UI / local) → make it secure/settings → (not: pricing).
- "Imagine you know nothing" — compare to Vercel/lovable/base44; borrow best-in-class.
- Accuracy example: docs claim a hard Snowflake limit, but backend size is selectable.

## 5. Personas & voice

Personas: (a) developer — CLI/local/own-git, strict reference; (b) business builder —
Kai/UI, prompt-first (LEAD with this); (c) consumer/admin — auth/OIDC/sharing pages,
technical register. Different register per page TYPE is correct Diátaxis, not drift.

Voice (Keboola style guide): active voice, short sentences (~25 words max), sentence-case
headings, action-first, no filler ("just", "basically", "simply"), `connector`/`component`
not "plugin". Low-floor tone for how-to/explanation; dense/precise for reference.

## 6. Competitor best-practices (actionable)

- **Cloudflare docs = same stack (Astro/Starlight), study first.** Steal: a component
  library instead of hand-v&#233;rlayout (callout, api-request, tables); a redirect table
  shipped with every structural PR (old URLs die on restructure); CI broken-anchor-link
  audit; "content like a product".
- **Stripe / Markdoc:** typed, schema-validated custom tags → broken docs become
  build-time errors. Consider Starlight's Markdoc support for validated blocks. Deeper
  lesson: tooling isn't the secret; content quality/investment is.
- **Anthropic / Mintlify (AI-native):** serve markdown page exports (`.md` URL) for AI;
  a `CLAUDE.md` in the docs repo trains Claude Code on your standards; PR-triggered doc
  reviews. But: llms.txt real AI-agent read rate is ~0.1% and no major LLM confirms
  reading arbitrary llms.txt → keep llms-full frozen; prefer RAG + MCP + `.md` exports.
- Generated API reference stays separate (Stripe/Cloudflare pattern) — already decided.

## 7. Apps section — current → target (Diátaxis)

Old (15 pages under `src/content/docs/data-apps/`) → new (~12), single-purpose:
- `index.md` → hub (nav + why + build paths). Concept split out.
- NEW `getting-started.md` → tutorial (one worked example: dashboard with Kai).
- NEW `examples.md` → gallery ("what you can build" — competition apps).
- `what-are-apps.md` → explanation (concept + governance + framework framing).
- `build-with-kai.md` / `build-in-the-ui.md` / `build-locally.md` → how-to by BUILD PATH.
- `authentication.md` → MERGE the 4 OIDC pages (auth0, gcp, entra, okta) into one.
- `reference.md` → env vars, per-app settings, backend versions (limits at bottom).
- `publish-and-share.md` → how-to.
- `streamlit/index.md` (+ moved `design-guide`, merged `lock-version` 3→1) → subtree.
- DELETE: release changelog, dead code patterns, generic non-Keboola truths.

A skeleton of all these files already exists in `apps-section/` (the sibling folder /
zip) with frontmatter, prose, and inline flags. Realize it in the repo; don't reinvent.

## 8. Owner map (Linear lead vs Slack source-of-truth) + accuracy assignments

- Kai-build path: Linear lead **Jordan**; technical SoT **Adam V&#253;born&#253;** (env vars,
  KBC_TOKEN, dev/prod, E2B enablement) → assign python-js/build accuracy to Adam.
- Frameworks / Direct Storage / OIDC: **Miro &#268;illík** (Apps owner; on vacation = the
  accuracy blocker).
- Hosting / backend versions / E2B: **Michal Je&#345;ábek** + **Pavel Synek**.
- Data-app core UI: **Jakub Smagin**. Sandbox/preview: **Pepa Martinec**.
- Pricing: **Pavel Doležal** (do not document).
- Sign-off authority overall: **Michal Je&#345;ábek**; final quality gate: **Jordan**.

## 9. Accuracy findings to fix in the accuracy stage (do NOT fix blind)

- `#KBC_TOKEN` documented as a secret → reserved, auto-injected, server-side only,
  silently shadowed (user-breaking) → Adam.
- "the value is uppercased" → it's the variable NAME → Adam.
- "Python 3.10 only" → stale; 3.10/3.11/3.13 → Adam.
- Auth0 page says "Google OAuth 2.0"; GCP `http://keboola.com` should be `keboola.com`;
  Entra "Tenant ID" field does not exist → Miro.
- Streamlit fallback: without "Kai in E2B" enabled, Kai builds Streamlit → framework
  "default" is not uniform per project → Adam/Miro.
- NO-SOURCE (private backend): `code-deployment` page, backend-versions changelog →
  `TODO(human-review)`.
- 404: `data-app-python-js` README link (was on two old pages).

## 10. Screenshots — workflow (do NOT fabricate images)

- In docs, every image is a placeholder: `![descriptive alt](../assets/apps/<name>.png)`
  plus `<!-- SCREENSHOT(<owner>): what to capture -->`. The alt text doubles as the spec.
- Nikita captures them with `screenshots.mjs` (in `apps-section/`), run locally under
  his own Keboola login: `login` (save session) → `apps` (gallery) → `ui` (product
  screens). Filenames already match the placeholders.
- Mask project IDs / tokens / `KBC_` / private data (script has a `MASK` list).
- Sequencing: capture product-UI shots AFTER Adam/Miro verify the flow. Gallery shots
  only for apps Miro clears as publicly showable (many are gated/canary).

## 11. Open decisions (raise before finalizing)

- Scope: unify `data-apps/` (15) with `components/applications/` (12) into one narrative,
  or keep separate? → Jordan/Miro.
- Exact Streamlit framing ("default vs supported / what's superseded") → Miro.
- Which competition apps ship publicly → Miro.
