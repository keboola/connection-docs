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
| ~~Load captures 01–07~~ | Done 2026-09-14: 01–08 reshot from the Boolabean configurations as element captures (no top bar); 03 shows the published base URL via a temporary, immediately reverted change to the live configuration; 08 is new (the forecast row in the code editor). | — |
| ~~Transform captures 00–10~~ | Done 2026-09-14 from a temporary mapped copy of the transformation (created and deleted the same minute); 00 cropped to the section header so no other project's names appear. | — |
| BigQuery run of the transform SQL | The BigQuery block on `transform/` is a translation of the verified Snowflake block and has not been executed; there is no BigQuery project available to this work. Free Plan projects default to BigQuery, so this is the dialect most new readers will paste. Needs one run by someone with a BigQuery project (plan decision 7). | `transform/index.mdx`, flagged `VERIFY(owner)` |
| ~~Ask clip~~ | Done 2026-09-14: `ask/kai-ask-staffing.mp4` (44 s from a 104-s live recording; the thinking stretch runs at 6x, the pointer lands on Kai's conclusion). | — |
| Write captures and clip | `write/index.mdx` text now sends `staffing_outlook`; captures 01, writing2, writing3, writing7, writing11 and the removed kai-write clip still show the previous configuration. Reshooting needs a live Google authorization in project 264, i.e. Nikita's OAuth in a 15-minute shared window (plan decision 5). Google's own consent screens (writing4-6) stay as they are. | `public/getting-started/write/` |
| Automate and check captures | Done 2026-09-14 for automate 01, 05–09 and check 09 (All Runs with five red scheduled runs). Still open: automate 02 is the previous shoot's Add Task menu (theme-neutral, kept); 03 (component picker) and 04 (second phase) were removed from the page instead of reshot, because capturing the picker means starting a flow-creation flow in 264. | `public/getting-started/automate/` |
| ~~App clip~~ | Done 2026-09-14 as a still: `app/grid-preview.png`, the draft preview's grid with the caption "2 of 42 café-days are short-handed". A clip would add nothing a grid does not already show at a glance; the hero clip carries the motion. | — |
| Production deploy of the data app | Both production deploys of "Staffing Outlook Grid" failed with an application error (exception IDs in `app/index.mdx`'s comment) and "Publish to production" produced no visible effect. Needs someone with platform logs to say whether the publish carried the code to `main` or the deploy fails for a platform reason; until then the page describes the draft and flags production. Candidate bug report for the Apps team. | `app/index.mdx`, flagged `VERIFY(owner)` |
| ~~Hero clip for the hub~~ | Done 2026-09-14: `outlook-tour.mp4` (32 s, three acts: four raw CSV rows → the question → the app's draft preview with two red cells), poster = the question frame. | — |
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
