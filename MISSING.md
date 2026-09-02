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
| No landing page for the going-further tier | The nav group has never had one, so the group's landing slot renders as a second "Overview". | new `getting-started/going-further/` |
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
