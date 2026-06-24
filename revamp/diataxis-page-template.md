# Diátaxis page template

Copy the block for the page type you are writing into a new Markdown file under
`src/content/docs/…`, then fill it in. One page serves **exactly one** reader
need. If you find yourself writing two of these on one page, split it.

Frontmatter is identical across types except `type:`. Required keys: `title`,
`slug`, `description`, `keywords`, `type`. Add `redirect_from` only on a page
that takes over an old URL (usually the hub).

Conventions to match (see existing pages):
- **Title + `description` in the user's words / symptom vocabulary**, not feature
  labels. Cover singular/plural + obvious synonyms in `keywords`.
- **The text must carry all the meaning.** Remove every screenshot and the page
  must still be fully doable. Keep a screenshot only if it genuinely helps a
  human locate something in the UI, and give it real alt text.
- **All code/config in fenced blocks**, never as a screenshot.
- Root-relative links (`/transformations/…/`).
- Anything you can't verify against the component code / config schema →
  `<!-- TODO(human-review): … -->` inline. Never silently add/rename/remove fields.

---

## How-to

```markdown
---
title: How do I <do the task>?
slug: '<section>/<page>/how-to'
description: <One sentence: the task, the tool, and the end state, in the user's words.>
keywords:
  - <task phrase>
  - <synonym / plural>
  - <product term the user might search>
type: how-to
---

<1–2 sentences: the situation the reader is in and what this page gets them to.
Link to the matching explanation and reference pages.>

**Time:** ~N minutes · **You will need:** <prerequisites in one line.>

## Before you start

<Bulleted prerequisites: access, credentials, an existing resource, etc.>

## Step 1 — <imperative>

1. <Literal control + navigation path, e.g. **Components → Transformations**.>
2. <Copy-pasteable value or config.>

## Step 2 — <imperative>

…

## Step N — Run it and confirm it worked

1. <Run / save action.>
2. <The explicit, observable success check — what the reader should SEE.>

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| <error/symptom> | <cause> | <fix, with a link if relevant> |

## Related

- [<reference page>](…)
- [<explanation page>](…)
```

---

## Reference

```markdown
---
title: <Thing> reference
slug: '<section>/<page>/reference'
description: <One sentence: lookup reference for X — list the main things covered.>
keywords:
  - <field / parameter names>
  - <limits / types the user searches>
type: reference
---

<One line: what this is reference for, with links to the how-to and explanation.>

<!-- TODO(human-review): state which facts below are unverified against the
     component code / config schema, if any. -->

## <Limits / Parameters / Types …>

| <Field> | <Value/Type> | Notes |
|---|---|---|
| … | … | … |

<Reference is lookup-only: no narrative, no steps. Tables and fenced examples.
Written once and shared across user/dev audiences.>
```

---

## Explanation

```markdown
---
title: When should I use <thing>? (or: Understanding <thing>)
slug: '<section>/<page>/explanation'
description: <One sentence: what the reader will understand and the decision it helps them make.>
keywords:
  - <concept>
  - when to use <thing>
  - <thing> vs <alternative>
type: explanation
---

<What it is, in plain terms, with links to the how-to and reference.>

## What it is

## Why / how it fits

## When to use it (and when not to)

<Explanation is conceptual: no step-by-step, no exhaustive field lists. Written
once and shared across user/dev audiences.>
```

---

## The hub (thin link page left at the OLD url)

```markdown
---
title: <Existing page title>
slug: '<existing/old/slug>'
description: <One sentence pointing readers onward.>
keywords:
  - <existing search terms>
type: explanation
redirect_from:
  - <older path(s) that already pointed here>
---

<1–2 sentences of what the thing is.>

This page is split by what you need:

- **[How do I …?](…/how-to/)** — …
- **[… reference](…/reference/)** — …
- **[When should I use …?](…/explanation/)** — …
```
