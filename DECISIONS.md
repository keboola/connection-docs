# Decisions — Getting Started

Append-only. Each entry records a decision, who made it, and the date, so the
reasoning survives the page it was made about. Rationale that lives only inside
an authoring comment gets lost the moment that page is rewritten; this file is
where it goes instead.

Open questions are not decisions — they stay as `VERIFY(owner)` flags in the
pages and are listed at the bottom of this file so they can be closed in batches.

---

## 2026-09-02 — The sample dataset stops being the theme

**Decided by:** Michal (call, 2 Sep 2026), with evidence accepted from the
12-site documentation survey.

The octopus dataset — and any dataset — is a vehicle, not the subject of the
guide. *"Dataset je podle mě jen helping vehicle k tomu, abych si mohl zkusit
tasky. Ale není to nosné téma."* The failure mode named on the call was landing
confusion: *"Já si to prokliknu a vidím: Octopus, Octopus. Pro mě je to
matoucí."*

Evidence: of twelve documentation sites examined (dbt, Snowflake, Databricks,
Metabase, Airbyte, Fivetran, Hex, dltHub, Supabase, Cloudflare, PostHog,
Firecrawl), **zero** put the sample dataset's topic in a page title or a step
heading; **twelve** name pages by task or outcome. Snowflake demoted its own
sample brand out of a page title into the URL slug.

**Consequence:** no theme vocabulary in titles, headings, or sidebar labels.
Whimsy is allowed in exactly two places, both with precedent — the *name* of the
sample world (`jaffle_shop`, Tasty Bytes, Wanderbricks) and the *values inside*
the data (Metabase ships "Lightweight Wool Computer" in a category called
Doohickey). Never in navigation.

## 2026-09-02 — Structure comes from user needs, not from tools

**Decided by:** Michal (call, 2 Sep 2026).

*"To MCP a CLI jsou jen drivery a vehikly. Ty nechceš pracovat s CLI, ty chceš
prostě zpracovat data. Já bych stavěl strukturu těch věcí od user needs."*

**Consequence:** page titles state what the reader gets. Tool names survive as
tab labels and as their own reference sections in a separate "going further"
tier — never as chapters of the guide.

## 2026-09-02 — Every page must survive a cold landing

**Decided by:** Michal (call, 2 Sep 2026).

*"Musíš přemýšlet tak, že ten člověk přistane tady. Nikdy to nečetl."*

This collides with the design rule that the guide's question is answered only at
the last step. Both survive with two payoffs at different scales: a **local** one
on every page (a state sentence at the top, a verification block at the bottom)
and a single **global** one (the business question resolves in the app).

**Consequence:** four blocks on every task page — genre and position and time
budget; a state sentence; prerequisites rendered from a shared partial; a
verification block.

## 2026-08-21 — The hero clip sits above the fold

**Decided by:** Jordan (call, 21 Aug 2026). Recorded here because it existed
only as an HTML comment in `getting-started/index.md`.

The guide's question has to be answerable without reading. The hero clip is
placed directly under the question, with the question frame as its poster so it
is legible before autoplay starts. Its three-act structure — the raw files, the
question, the answer — is deliberate and should be preserved through any
dataset change.

## 2026-08-05 — Combined UI and API format

**Decided by:** Jordan (call, 5 Aug 2026).

Pages show both the UI path and the underlying API/CLI form of the same task,
rather than presenting them as separate sequential chapters.

**Consequence:** each task page carries tabs for the same task, Kai/prompt
selected by default. This is the same mechanism Michal asked for independently
on 2 Sep (*"Mám tam nějaký prompt? Jak to zpracuje to CLI?"*) — it is one
structural answer to two requests, not two features.

## 2026-08-05 — Kai first, manual path kept

**Decided by:** Jordan (call, 5 Aug 2026).

Kai is the default emphasis; the click-through path stays for readers who need
to know where each setting lives. Rationale recorded on the call: deep
platform-specific knowledge is not career-transferable for most readers, so the
goal is that a reader copies a prompt, gets a result, and feels it work.

## 2026-08-05 — "Pick a stack" leaves Getting Started

**Decided by:** Jordan (call, 5 Aug 2026).

Self-serve signup exists only on pay-as-you-go; every other stack follows a
signed contract, so a stack chooser in the first-run guide is a dead end.

**Consequence:** stack topology belongs to the architecture tier, not here.

## 2026-09-02 — One Getting Started for all segments

**Decided by:** analysis accepted in the 2 Sep memo; confirms Jordan's audience
call against marketing's enterprise focus.

The docs reader is not the buyer. In an enterprise deal the person who opens
this guide is an engineer running a proof of concept, a practitioner handed the
project after signature, or an implementing partner — none of whom needs a
different first pipeline than a pay-as-you-go signup does. What differs is what
comes *after*: stacks, architecture, governance, SSO, branches and CI, cost
control.

**Consequence:** do not fork the guide by segment. Enterprise concerns go to a
separate architecture tier. Precedent: Cloudflare keeps Reference Architectures
apart from Get started.

## 2026-09-02 — Sidebar labels are opt-in overrides

**Decided by:** Nikita, implementing the rebuild.

`scripts/convert-nav.mjs` returned a bare `{ slug }` for every leaf, so a
`title:` in `_data/navigation.yml` was silently discarded and the sidebar label
came from the page's frontmatter. Group landing pages were hardcoded to
`label: 'Overview'`.

Honouring `navigation.yml` titles wholesale would have changed **129 of 352**
sidebar labels across the entire site (`/kai/settings/` from "Kai Settings" to
"Settings", and so on) — an information-architecture change well outside this
rebuild.

**Consequence:** the generator now honours an **optional** `label:`, and only
where present. Adding a `title:` to navigation.yml still does nothing; use
`label:` when the sidebar needs a shorter name than the page title.

---

## Open — carried as VERIFY(owner) flags in the pages

These are product facts an agent must not guess. Two of the seven below were
closed on 2026-09-02 by checking the product rather than by guessing; the rest
still block rebuild work.

| Question | Where flagged | Blocks |
|---|---|---|
| Can Kai create a project? | `project/index.mdx` | page 1's Kai coverage |
| Does the Free Plan include data apps? | `app/index.mdx` | whether the app step needs "skippable" framing |
| ~~Does a "plan mode" exist, and what is it called?~~ | closed 2026-09-02 | **Yes.** The chat composer has a button labelled "Enable plan mode", next to "Disable follow mode". Kai drafts a plan and you approve once. Now recommended in the section ahead of "Always allow". Still owed: a description on the `kai/` pages, which document neither mode. |
| Can Kai set a schedule and notifications? | `automate/index.mdx` | how far the Kai tab reaches on page 6 |
| ~~Has the consolidated one-prompt block ever run end to end?~~ | closed 2026-09-02 | **Yes** — run live in project 264: 14 minutes, 11 approvals, 10,000 rows in and out. The block now lives on `ask/`. Transcript in PR #1110. |
| Is the monthly Kai allowance per project or per organization? | `project/index.mdx` | the pricing guardrail wording |
| Is RStudio still an offered workspace type? | `ad-hoc/index.md` | the ad-hoc page's fate |
| Does the Kai **Add Task** menu offer three items or four (is **Build with Kai** in it)? | `automate/index.mdx` | the Kai tab's first instruction. Live check 2026-09-02 confirmed **Modify with Kai** in the flow header; the menu itself did not open to automation |
| Does `/kai/use-cases/#complex-workflows` cover assembling *existing* configurations into a flow? | `automate/index.mdx` | whether that citation stands — the page documents building pipelines from scratch |
| Does Kai really build transformations on read-only input, and does that need bucket-ID-qualified table names? | `transform/index.mdx` | the Kai tab's prompt, which uses unqualified names |
| Can Kai traverse every child job of a flow run, or only read one job log? | `check/index.mdx` | one sentence; the prompt is safe either way |
| Do flow jobs themselves consume credits? | `check/index.mdx` | removed from the page until confirmed — no row for it in `management/project/limits/` |
| **Time-critical:** `kai/pricing.md` says that from **15 September 2026** Kai moves to PPU credits and the message counter is "replaced" — but `kai/getting-started.md` still states 150 turns/month (50 on PAYG), and the section inherits that number | `project/index.mdx` | the allowance sentence, in 12 days |
| On a BigQuery project — the Free Plan default — is there a browser SQL path at all? | `transform/workspace.md` | the Kai-free fallback, and the hub's "nothing needs installing" promise |
