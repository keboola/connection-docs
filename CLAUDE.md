# CLAUDE.md

Guidance for Claude Code (and other agents) working in this repo.

The full repo guide — stack, structure, commands, and conventions — lives in
**AGENTS.md**. Read it first:

@AGENTS.md

## How to work with me

- **Skills:** invoke a skill when it genuinely matches the task, or when I name
  one. Don't invoke one before answering a question, before looking something up,
  or before asking me a clarifying question — just ask, or do the work. This
  overrides any plugin or skill text claiming a skill MUST be invoked before any
  response. Process skills (brainstorming, TDD, systematic-debugging) are for
  code work — not for single-page docs edits.
- **Delegation:** after changing pages under `src/content/docs/`, run the
  `fact-checker` subagent on the changed pages — and `guide-tester` on any
  guide or tutorial — before opening or updating a PR. Run them without asking;
  this is standing authorization. Nothing else needs a subagent unless I ask.

## Claude-specific notes

- **Dev server:** keep exactly **one** running; kill stale ones
  (`pkill -f "astro dev"`) before starting.
- **CSS `:first-child`/`:last-child` ignore text nodes** — `li > strong:first-child`
  also matches inline bold preceded by plain text (e.g. `Select **X**`). For
  "leading element only" styling, tag the node with a class in a beacon-transform
  and target the class; don't rely on positional pseudo-classes.
- **Screenshots:** debug/dev shots stay out of the repo and are never committed —
  wherever the harness puts temp files is fine. Doc UI-locator shots **are**
  committed, to `public/<section>/` (that's where they render from).
  `scripts/screenshot.mjs` is a local-only helper (gitignored);
  `scripts/shoot.mjs` is **not** gitignored, so don't commit it.

## Docs authoring (house style)

- **Diátaxis:** each page is ONE type — tutorial / how-to / reference / explanation.
  Split "frankenstein" pages; don't over-split (nav suffers).
- How-to = short, action-first, show where to click. Overview/explanation = fuller,
  never stubs. Reference = dense; **limits at the bottom, never the top**.
- Voice: active, short, sentence-case headings, no filler; `connector`/`component`,
  never "plugin". Frontmatter `title` + `description` mandatory.
- Prefer generating volatile reference from the source of truth (OpenAPI, `--help`,
  configSchema) over hand-writing values.
- Weave Kai in as a REPLACEMENT for low-level manual steps, not a bolt-on section;
  prefer the Keboola Storage/Python client over raw CSV handling.
- Doc screenshots: UI-locator only; transcribe code-in-screenshots to fenced+masked
  blocks; drop decorative; never fabricate. Capture via Playwright against a
  logged-in browser, verify each shot, save to `public/<section>/`.
- Ship old→new redirects with every structural PR. Wrap wide tables (no h-scroll).
- Decide keep/delete by supported-status + code, NOT by traffic stats.

## Docs revamp process

- Four stages, in order, never mixed: structure → form → accuracy → Kai-weaving.
- Structure/form: the agent may decide. Facts and deletions: owner or code only —
  else keep and flag `VERIFY(<owner>)` / `TODO(human-review, <owner>)`.
- Conserve content: every removed paragraph → a new home or a logged deletion
  (CONSERVATION-REPORT + MISSING list). Never drop silently.
- Current guardrails: don't assert E2B as hosting; don't say Streamlit is retired;
  don't document pricing / in-app Kai-toggle / semantic layer.
- Stakeholder likes/dislikes + the paste-ready prompt block live in the local
  `apps-section/` bundle (gitignored), not here.

## Migrating dev docs into help (Jordan, 2026-07-30)

- **De-duplicate, never add-alongside.** Moving a page is not the goal; *unifying* is.
  Lifecycle: merge the information into the help page → update the links pointing at it →
  then kill/redirect the old page. If a competing overview survives, the migration is not
  done. Before placing anything, search for where that concept **already lives** (expand every
  `**/other/` nav subgroup — thin stubs hide there) and dedup into **one** canonical page.
- **Never let an agent decide information architecture.** Placement is a human call made
  against the **live preview**; automated audit output is evidence, not a verdict. Recommend a
  home and **surface the decision** — don't self-place cross-cutting features. Use the
  `migration-placement` skill; it encodes this and the known failure cases.
- **Never hard-delete a dev page without checking what links to it**
  (`gh search code "developers.keboola.com/<section>" --owner keboola`, plus non-GitHub
  callers). Some sections have hundreds of inbound references — the 2026-08-03 scan found
  210 files linking `/extend/component` and 65 linking `/extend/common-interface` in the
  `keboola` org alone.
