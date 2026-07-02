# Claude Code prompt — realize the Apps section (structure + form)

Paste everything below into Claude Code, run from the docs repo, with `CONTEXT.md`
and the `apps-section/` skeleton available in the working directory.

---

You are restructuring the **Apps** docs section in this repo (Astro/Starlight,
content under `src/content/docs/data-apps/`).

**Read `CONTEXT.md` first, in full.** It is the source of truth for the why, the
discipline, the owner map, and the accuracy flags. Then read every file in
`apps-section/` — that is the approved target skeleton (hub, getting-started,
examples, what-are-apps, build-with-kai, build-in-the-ui, build-locally,
authentication, reference, streamlit/index) plus `STRUCTURE.md` (the old→new map).

Your job: move the REAL existing content from the current `data-apps/` pages into the
new structure defined by the skeleton. You are NOT inventing content, NOT fixing facts,
NOT the accuracy stage.

## Setup
- Work from CLEAN main. Fresh branch: `PRDCT-<APPS-ID>-apps-restructure` (I'll give you
  the id — put it in the branch AND the PR title so Linear links). Don't touch any dirty
  tree; read old pages with `git show main:<path>`.

## Do exactly this
1. Apply the old→new map in `STRUCTURE.md`: create the new files from the skeleton, and
   fill each with the REAL content from the corresponding old page(s). Where the skeleton
   has "[to be confirmed by owner]" placeholders, insert the actual old text — do not
   write new facts.
2. Merges/moves/splits per the map: OIDC 4→1 into `authentication.md`; lock-streamlit
   3→1 under `streamlit/`; move `general-design-guide` under `streamlit/`; split
   `python-js` and `storage-access` by Diátaxis type.
3. Create `getting-started.md` (tutorial) and `examples.md` (gallery) from the skeleton.
4. DELETE the release changelog content; log it in the conservation report.

## Hard rules (from CONTEXT.md — do not violate)
- **Conserve content.** Every old paragraph → a new home or a LOGGED deletion. Surface a
  MISSING list of deliberate-deletion candidates; never drop silently.
- **Do NOT invent or fix facts.** Move existing text as-is. If old text is clearly wrong,
  leave it and keep/add the `VERIFY(<owner>)` flag from the skeleton. This is not the
  accuracy pass.
- **Preserve every `VERIFY(...)` and `TODO(human-review, ...)` comment.** You may remove
  scaffolding comments (`DIÁTAXIS`, `MOVE/MERGE/SPLIT`). Keep all owner/accuracy flags.
- **Screenshots: placeholders only, never fabricate.** Keep each `![alt](../assets/apps/
  <name>.png)` + `<!-- SCREENSHOT(...) -->`. For any code/config living inside an old
  screenshot, transcribe it into a fenced block with masked placeholders and drop the
  image. Do not generate or download images. (Nikita captures real shots later via
  `screenshots.mjs`.)
- **Frontmatter `title` + `description` on every page.** Fix `sidebar.order` so the
  section reads: hub, getting-started, examples, what-are-apps, build-with-kai,
  build-in-the-ui, build-locally, authentication, publish-and-share, reference, streamlit.
- **Form/voice:** sentence-case headings, active voice, short sentences, no filler;
  `connector`/`component` not "plugin"; limits at the bottom of reference pages.
- Fix internal links to new paths. Do NOT assert E2B as hosting; do NOT document pricing/
  Kai-toggle/semantic-layer; do NOT state Streamlit is retired.

## Output
1. Restructured files under `src/content/docs/data-apps/`.
2. `CONSERVATION-REPORT.md` (in the PR description, not shipped): table of every OLD page
   → where each chunk went (moved/merged/split/deleted) + the MISSING deletion-candidate
   list for Nikita's review.
3. A list of old→new URL redirects needed, and any broken links found.

## Finish
- Open a DRAFT PR, base `main`, title `PRDCT-<APPS-ID>: restructure Apps section (structure + form)`.
- Do NOT merge, do NOT push to main, do NOT resolve VERIFY/TODO flags, do NOT capture screenshots.
- Show me: the new file tree, the CONSERVATION-REPORT, the deletion candidates, and the
  redirect list — before I review.
