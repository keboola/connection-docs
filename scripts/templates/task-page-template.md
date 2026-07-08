---
# === REQUIRED FRONTMATTER (every field earns its place for humans AND AI agents) ===
title: How do I <do the task>?          # Phrase as the customer's question. This is the page's job.
slug: 'how-to/<short-task-slug>'         # Stable, descriptive, task-based.
description: <One sentence: what this page lets you accomplish and the key tool/steps.>
                                         # Feeds on-site search, the page lede, SEO meta, AND the Ask Kai RAG index.
                                         # Write it so it answers the title on its own.
keywords:                                # 4–8 phrases a user or agent would actually search.
  - <natural-language phrasing of the task>
  - <product/feature name>
  - <synonyms and the "wrong" words people use>
task: <Imperative one-liner of the goal>
audience: <e.g. New users / Admins / Developers>
last_verified: <YYYY-MM-DD>              # When a human last confirmed the steps against the live product.
related:                                 # Reference pages this task routes into for depth.
  - /<path-to-reference-page>/
---

<!--
AUTHORING RULES — delete this comment block before publishing.

ONE PAGE = ONE TASK. A reader (human or agent) lands here and can finish the task
without first having to understand how Keboola is structured internally.

WRITE FOR AGENTS (this also makes it better for humans):
  • Be literal. Name controls exactly: **Set Up Credentials First**, not "the button".
  • Give the navigation path: (Components → Data Source Connectors → Add Component).
  • NEVER rely on a screenshot to carry meaning. No "as shown above", "the icon on the right".
    If a step needs a visual, describe the outcome in words instead.
  • Every code/config block is copy-pasteable, with placeholders in CAPS (MY_WAREHOUSE).
  • State success criteria explicitly (the "Confirm it worked" step) — agents need to know when they're done.
  • Define or link any term the reader may not know; don't assume the Keboola taxonomy.
  • Use the fixed heading set below so anchors are predictable and retrieval is consistent.
  • Keep links absolute (/section/page/) so a copied-as-Markdown page still resolves.

SCREENSHOTS: default to none. Add an image ONLY when it conveys something words cannot
(e.g. a topology diagram). A screenshot of a form or a button is not that — describe it.
-->

You want to <plain statement of the goal and why someone does this>. In Keboola this is done with **<the tool/feature>**. This page takes you from <starting point> to <finished outcome>.

**Time:** ~<n> minutes · **You will need:** <one-line prerequisites summary>.

## Before you start

Make sure you have:

- <Prerequisite 1 — account/permission/access>
- <Prerequisite 2 — information to have ready, e.g. connection details>
- <Prerequisite 3 — anything to set up elsewhere first, with a link>

## Step 1 — <first concrete action, named for its outcome>

<Literal instructions. If config/code is involved, put it in a fenced block with CAPS placeholders.>

## Step 2 — <next action>

1. <Numbered, single-action steps.>
2. <Name every control and the path to it.>
3. <Click **Save** / **Run** / **Create** — use the real label.>

## Step 3 — <continue until the task is done>

<...>

## Confirm it worked

1. <How to check the result, e.g. open **Storage** and find the bucket.>
2. <What "success" looks like — counts, a status, a visible object.>

You have now <restated finished outcome>.

## <Optional: the most common next step or variation>

<e.g. "Load only new rows next time", "Schedule it to run automatically". One per heading, task-framed.>

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| <what the user sees> | <why> | <what to do, with a link if deeper> |

## Related

- [<Reference page>](/<path>/) — <what depth it adds>.
- [<Tutorial or adjacent task>](/<path>/) — <when to go there>.
