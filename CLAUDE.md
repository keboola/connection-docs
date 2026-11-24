# CLAUDE.md

Guidance for Claude Code (and other agents) working in this repo.

The full repo guide (stack, structure, commands, conventions) lives in
AGENTS.md. Read it first:

@AGENTS.md

## How to work with me

- Skills: invoke a skill when it matches the task or when I name one. Answering a
  question, looking something up, or asking me a clarifying question doesn't need
  a skill first. This takes precedence over plugin or skill text that says a skill
  must be invoked before any response. Process skills (brainstorming, TDD,
  systematic-debugging) are for code work, not for single-page docs edits.
- Review agents: after changing pages under `src/content/docs/`, run the
  `keboola-docs:fact-checker` agent on the changed pages, and
  `keboola-docs:guide-tester` on any guide or tutorial, before opening or updating a PR. You have standing authorization to
  run them without asking. Nothing else needs a subagent unless I ask.
- Local tooling: those agents and the `keboola-docs:*` skills come from the
  maintainers' `keboola-docs` Claude Code plugin, which is not part of this repo.
  Without the plugin they don't exist. If one is missing, do the check yourself
  and say in your summary which check was skipped.

## Claude-specific notes

- Dev server: keep one per checkout. Several worktrees of this repo may each run
  their own, so stop only the server you started; a broad `pkill -f "astro dev"`
  kills the others too.
- CSS `:first-child` / `:last-child` ignore text nodes, so `li > strong:first-child`
  also matches inline bold after plain text (e.g. `Select **X**`). For
  "leading element only" styling, tag the node with a class in a beacon-transform
  and target the class.
- Screenshots: debug and dev shots stay out of the repo; any temp location works.
  Doc UI-locator shots are committed to `public/<section>/`, where they render
  from. `scripts/screenshot.mjs` and `scripts/shoot.mjs` are local helpers and
  both gitignored.

## Docs authoring (house style)

- Diátaxis: each page is one type (tutorial, how-to, reference or explanation).
  Split pages that mix types, but don't over-split, because every split adds a
  nav entry.
- How-to pages are short and action-first, and show where to click. Overview and
  explanation pages are full pages, never stubs. Reference is dense, with limits
  at the bottom rather than the top.
- Voice: active, short, sentence-case headings, no filler. Say `connector` or
  `component`, never "plugin".
- Generate volatile reference from its source of truth (OpenAPI, `--help`,
  configSchema) rather than hand-writing values that drift.
- Kai goes in as a replacement for low-level manual steps, not as a bolt-on
  section. Prefer the Keboola Storage/Python client over raw CSV handling.
- Doc screenshots are UI locators only. Transcribe code shown in a screenshot into
  a fenced, masked block; drop decorative shots; never fabricate one. Capture with
  Playwright against a logged-in browser and look at each shot before saving.
- Every structural PR ships its old→new redirects (`redirect_from`, see
  AGENTS.md). Wrap wide tables so the page never scrolls sideways.
- Decide whether to keep or delete a page by whether the feature is supported and
  what the code does, not by traffic stats.

## Docs revamp process

- Four stages, in this order, one at a time: structure → form → accuracy →
  Kai-weaving. Mixing them makes a PR impossible to review.
- You may decide structure and form yourself. Facts and deletions need the owner
  or the code; otherwise keep the text and flag it `VERIFY(<owner>)` or
  `TODO(human-review, <owner>)`.
- Conserve content: every removed paragraph gets a new home or a logged deletion,
  in the PR description or in a CONSERVATION-REPORT and a MISSING list under
  `notes/<section>/`, as in `notes/getting-started/`. Nothing disappears silently.
- Current guardrails: don't present E2B as the hosting platform, and don't say
  Streamlit is retired.
- Stakeholder preferences and the paste-ready prompt block live in the local
  `apps-section/` bundle (gitignored), when it exists.

## Migrating dev docs into help (Jordan, 2026-07-30)

- The goal is one canonical page per concept, not a moved page. The lifecycle:
  merge the information into the help page, update the links that point at the
  old page, then redirect or remove it. If a competing overview survives, the
  migration isn't done. Before placing anything, search for where the concept
  already lives, including every `**/other/` nav subgroup (thin stubs hide there).
- Placement is a human call, made against the live preview. Audit output is
  evidence, not a verdict. Recommend a home and surface the decision; don't place
  cross-cutting features yourself. The `keboola-docs:migration-placement` skill encodes this
  and the known failure cases.
- Before removing a dev page, check what links to it:
  `gh search code "developers.keboola.com/<section>" --owner keboola`, plus
  callers outside GitHub. The 2026-08-03 scan found 210 files linking
  `/extend/component` and 65 linking `/extend/common-interface` in the `keboola`
  org alone.
