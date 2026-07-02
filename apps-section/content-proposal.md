# Docs Content Proposal

*Local copy of the canonical Linear document `docs-content-proposal-6381f4e8dc22`
([link](https://linear.app/keboola/document/docs-content-proposal-6381f4e8dc22)).
Author: Jordan Burger · Project: Help Documentation Revamp · updated 23 Jun 2026.
The Linear doc wins on any conflict; this copy is for offline/agent context.*

> Companion to *Phase 1 Audit Findings*. Built on the **Diátaxis** classification
> (diataxis.fr) captured on every page during the audit (Block 0). Direction agreed
> in Phase 3: **organize around the customer's task, not the product's internal
> structure**, and make pages usable by **AI agents** (Ask Kai + external LLMs),
> not just humans.

## The problem (from the audit)

The content is largely accurate and maintained — the issue is **shape**:

- **Filed by product architecture, not intent.** 254/254 page titles are feature/noun
  labels; the nav mirrors *extractor / writer / transformation / management*. A
  customer with a task ("get Snowflake data in, model it, push to Tableau") must
  already know Keboola's taxonomy and visit 3+ branches.
- **"Frankenstein" pages** mix 2+ Diátaxis types on one page. They can't be improved
  without splitting.
- **Duplication across categories**, orphan pages, and a site-wide metadata gap (no
  `description`) that hurts search + Ask Kai.

## The framework — Diátaxis × domain

Every page is classified by **type** (the user's need) and **domain** (the subject):

- **Type:** `tutorial` (learning, action) · `how-to` (task, action) · `reference`
  (lookup, knowledge) · `explanation` (understanding, knowledge) · `mixed` =
  frankenstein → must be split.
- **Domain (11):** Get Started · Concepts · Data In/Out · Transformations · Storage ·
  Flows & Automation · Workspaces & Apps · AI · Extending · Integrate · Manage.

## Target navigation (proposed)

Top level = the 11 domains (task-first, not component-type). Within each domain the
four Diátaxis types are separated, and **user vs developer is a facet/filter, not a
separate site**. Reference + explanation are written once and shared across
audiences; only tutorials/how-to may differ.

```
Get Started         tutorials + first-run how-tos
Concepts            explanation — what Keboola is, project model, storage model
Data In/Out         per connector: how-to (configure) + reference (fields) + shared concepts
Transformations     per backend: how-to + reference + when-to-use explanation
Storage             concepts + how-to + reference
Flows & Automation  explanation + how-to (Flows; legacy Orchestrator clearly marked)
Workspaces & Apps   how-to + reference        <-- Apps lives here
AI                  Kai / MCP / AI Kit — how-to + reference
Extending           components, Common Interface — reference + tutorials (dev facet)
Integrate           API, CLI, client libraries — reference (dev facet)
Manage              projects, users, billing, jobs — how-to + reference
```

A thin task-oriented **"Guides"** entry routes by customer intent into the existing
how-to pages without duplicating content.

## The target page standard (humans + agents)

Each task/how-to page: **one task, self-contained**, literal control names with
navigation paths, copy-pasteable config, an explicit **"confirm it worked"** step,
troubleshooting, and frontmatter `description` + keywords. **Keep genuinely useful
screenshots** (so a human knows *where* to act) — text must stand alone, but we don't
strip every visual.

**Title in the user's words, not the product's.** H1 + frontmatter `description` must
use the customer's **symptom vocabulary** (e.g. "deprecated", not "access changes"),
covering singular/plural + synonyms.

## Migration sequence (strangler-fig)

1. **Faithful & clean** — finish code-vs-docs audit + mechanical cleanup + `description`
   backfill.
2. **Top-level duplicates** — pick canonical homes, 301 the rest.
3. **Split frankensteins** by domain, highest-traffic first.
4. **AI layer in parallel** — `.md` endpoints, front-matter from Block 0, generated
   reference. A page is "migrated" only when: 301 from old URL, inbound links fixed,
   `.md` endpoint confirmed.

## Redirect map

Every Merge/Kill/split decision emits an `old-path → new-path (301)` row in a
versioned table, shipped with the structural PR.

## The page standard extras (from Traffic Insights)

- Sequence splits by density × **branded/task demand**, not raw impressions.
- Title + `description` in the user's words (symptom vocabulary).
- **Ship a migration page with every breaking change**, same day, titled in symptom
  words, with a banner on the affected page; keep the old URL as the interception
  point.
- AI/MCP queries are the best-converting on the site ("keboola data apps" 21% CTR) →
  build the AI-readable layer in parallel, not last.

## Execution — pilot & sequencing

- **Step 0 — Pilot one domain end-to-end before scaling.** (Proposal's recommended
  pilot was Transformations; the Apps section was subsequently taken as the active
  pilot — see CONTEXT.md.)
- **Step 1 — Mechanical, parallel:** `description` backfill; term sweeps; time-sensitive
  blockers.
- **Step 2 — Dedup & canonical homes.**
- **Step 3 — Split frankensteins** by domain, density × traffic.
- **Step 4 — Task/Guides layer + AI layer, in parallel.**

## Open questions for the team

- Dedicated **"Guides / How-to"** top-level section, or weave task pages in?
- Confirm screenshot policy: **keep useful visuals, text must stand alone**.
- developers.keboola.com folds into the single site — confirm **when** (proposal:
  after the pilot validates the page template).
- Priority customer tasks — traffic data attached; Ask Kai / internal-search
  zero-result queries still needed to fully rank intent.
