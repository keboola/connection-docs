<!--
Docs page PR. To use this template, append ?template=docs-page.md to the PR URL,
or pick it from the template dropdown. (The default template stays for other PRs.)
See scripts/templates/task-page-template.md and the docs framework.
-->

## What & why

<!-- The task this page answers, and why it's needed. Link the source pages the facts came from. -->

## Stage-4 quality gate

**Structure & type**
- [ ] Correct page type (task / reference / concept); not a duplicate of existing content
- [ ] Title matches type (a question for task pages); `slug` stable and descriptive
- [ ] Standard heading skeleton (task pages: **Before you start → Step N → Confirm it worked → Troubleshooting → Related**)

**Frontmatter**
- [ ] `description` written and actually answers the title
- [ ] `keywords` include real search phrases + synonyms
- [ ] `last_verified` set to today; `related` links present
- [ ] Any new frontmatter keys exist in `src/content.config.ts`

**Agent-readable body**
- [ ] No screenshots carrying load-bearing meaning; no visual deixis ("as shown above")
- [ ] Every control named exactly, with its navigation path
- [ ] Code/config blocks copy-pasteable with CAPS placeholders
- [ ] All links absolute and resolving; no `.html` or Liquid `{% %}` leftovers

**Accuracy**
- [ ] Facts trace to verified product behavior; anything uncertain flagged for a maintainer

**Build**
- [ ] `npm run build` clean
- [ ] `node scripts/content-lint.mjs` clean (or only known/accepted items)
- [ ] `node scripts/audit-phase2.mjs` clean (for link/image/table changes)
- [ ] `npm run gen:sidebar` run if `_data/navigation.yml` changed

> **Acceptance test:** could an AI agent with the right account access complete this task using only the page text — no screenshots, no other pages? If yes, ship it.
