# Missing — what Getting Started does not yet cover

Gaps found while auditing the section, kept here so they are visible between
PRs. A gap is either something a reader needs and cannot find, or something the
guide asserts without a verified source.

---

## Content gaps

| Gap | Why it matters | Where it belongs |
|---|---|---|
| No "check it worked" page | Verification is scattered across five pages, so a reader who lands mid-guide cannot tell whether their own run is healthy. Absent at PostHog and Firecrawl too — a place to be better than the field. | new page 7, `getting-started/check/` |
| No page for the "AI answer" step | Michal asked for *"něco typu AI answer"*; today the closest thing is a closing section misfiled at the bottom of the automation page. | new page 4, `getting-started/ask/` |
| ~~No landing page for the going-further tier~~ | Done 2026-09-02: `getting-started/going-further/` exists and carries `next-steps`. | — |
| Load captures 01–07 | They show the previous sample's configuration and table names; the steps they illustrate are unchanged, the labels in them are not. Reshoot from the `Boolabean sales` and `Boolabean forecast` configurations in project 264 (phase 2), plus one new capture: the forecast row in the code editor. | `public/getting-started/load/` |
| Transform captures 00–10 | They show the previous sample's transformation, mappings and table. Reshoot from `Boolabean staffing outlook` in project 264 (phase 2): the five-table input mapping across two buckets is the frame that changed most. | `public/getting-started/transform/` |
| BigQuery run of the transform SQL | The BigQuery block on `transform/` is a translation of the verified Snowflake block and has not been executed; there is no BigQuery project available to this work. Free Plan projects default to BigQuery, so this is the dialect most new readers will paste. Needs one run by someone with a BigQuery project (plan decision 7). | `transform/index.mdx`, flagged `VERIFY(owner)` |
| Ask clip | `ask/index.mdx` shows no clip since the sample world changed; record Kai answering the staffing question in the live chat (project 264), with the pointer on the flagged rows (phase 2). | `public/getting-started/ask/`, `scripts/record.mjs` |
| Write captures and clip | `write/index.mdx` text now sends `staffing_outlook`; captures 01, writing2, writing3, writing7, writing11 and the removed kai-write clip still show the previous configuration. Reshooting needs a live Google authorization in project 264, i.e. Nikita's OAuth in a 15-minute shared window (plan decision 5). Google's own consent screens (writing4-6) stay as they are. | `public/getting-started/write/` |
| Automate and check captures | `automate/` 01–09 and `check/` 09-all-runs show the previous flow. Reshoot from "Boolabean morning outlook" in project 264 (phase 2): the two-task first phase is the frame that changed most, and All Runs should show a run with a red phase 3 next to a green one. | `public/getting-started/automate/`, `public/getting-started/check/` |
| Hero clip for the hub | `index.mdx` lost its 25-second map tour when the sample world changed; the first screen is text-only until phase 2 re-shoots three acts (five files → the question → the grid) from the live pipeline in project 264. | `public/getting-started/`, `scripts/compositor.html` scene |
| No shared prerequisites partial | Every page hand-writes its prerequisites, so they drift within a release. Cloudflare renders one partial 4,087 times across 1,966 pages for exactly this reason. | `src/components/getting-started/Prereqs.astro` |
| The guide never says "run it again tomorrow and the answer moved" | The scheduling step is the one that teaches least, because the sample data is static. Airbyte has the same gap and never narrates it. | page 6, once the data has a live half |
| The manual path has no CLI coverage per task | `kbagent` exists and has a reference section, but no task page shows the same task done with it. | tabs on task pages, if decision #3 lands |

## Unverified assertions

Fourteen `VERIFY(owner)` flags are live in the section; the full list is indexed
in `DECISIONS.md`. The ones that are load-bearing for the rebuild:

- Whether Kai can create a project (page 1 assumes it cannot).
- Whether the Free Plan includes data apps (decides if page 5 needs "skippable" framing).
- Whether a "plan mode" exists in the Kai chat, and its exact name.
- Whether Kai can set a schedule and notifications (decides the reach of page 6's Kai tab).
- Whether the monthly Kai allowance is per project or per organization.
- The exact label of the Google Sheets append option.

## Measurement gaps

The guide states four different time budgets that have never been measured
against each other: "under an hour" and "roughly six minutes of job runtime" and
"maybe fifteen minutes" inside the section, against "about 30 minutes" on both
`docs/index.md` and `overview/index.md`. One measured walk settles all four.

## Fixture gaps

The four sample CSVs are served from `public/getting-started/` and have **no
`vercel.json` rule**, so their URLs cannot be redirected if the dataset changes
— only `vercel.json` can redirect a `.csv`. Four more identical copies live
under `public/tutorial/`. A fixture change is therefore six files plus
`vercel.json`, and the HTTP connector reference at
`components/extractors/storage/http/index.md:10` still says the connector
"loads a single CSV file", which the multi-row sample contradicts.
