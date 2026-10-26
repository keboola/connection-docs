# Missing — what Getting Started does not yet cover

Gaps found while auditing the section, kept here so they are visible between
PRs. A gap is either something a reader needs and cannot find, or something the
guide asserts without a verified source.

Refreshed 2026-10-12 against the pages (Jordan's review on #1116, item 8): the gaps
still open come first, and the closed ones are kept below with what closed them.

---

## Open

| Gap | Why it matters | Where it belongs |
|---|---|---|
| Write and Google Sheets captures | `write/` captures 01, writing2, writing3, writing7 and writing11, and the `load/googlesheets` captures, still show the previous sample's names, and writing2.png shows the wrong step. Reshooting needs a live Google authorization in a test project, which only Nikita can give. Google's own consent screens (writing4-6) stay as they are. | `public/getting-started/write/`, `public/getting-started/load/` |
| UI-path captures from project 264 | `load/03` (base URL) and `04` (row settings) are still from 264. Kai's objects in Free Plan projects cannot stand in: their base URL is the branch preview host and their rows carry processors. | `public/getting-started/load/` |
| No cold-weather history in the sample | The history is June to August. In a week under 18 °C nothing can be flagged (the highest cold-band figure is 65.5 a person, the threshold 67), and on dry cold days five of the six cafés have no history. `transform/`, `ask/`, `app/` and `check/` say so. **2026-10-12:** the BigQuery run in 6439 got the week of 12 to 18 October: 29 of 42 rows without `expected_units`, none flagged. From about mid-October to April a reader's grid has no red cells. Adding cold days to `sales` and `weather_daily` is an owner call; `scripts/gen-boolabean.py` can regenerate both. | `public/getting-started/boolabean/` |
| The guide never shows "run it again next week and the answer moved" | The data has a live half now, the forecast, but no page shows a second week's table next to the first, so the scheduling step still teaches the least. Airbyte has the same gap and never narrates it. | `automate/` |
| The markdown twin drops `PageMeta` | `src/integrations/page-markdown.mjs` renders the box, PathIntro and the course pictures as text, but not PageMeta, so an agent reading a twin never sees the page's genre, its track or its time. One branch in the integration fixes it for every page. | `src/integrations/page-markdown.mjs` |
| The box sits after the tab intro on `write/` | On `write/` the "Before you start" box comes after `<PathIntro>`; on every other task page it comes first. A form fix. | `write/index.mdx` |
| Does a running data app count against the Free Plan minutes? | The weekly flow does not start the app, but an app people open runs until **Auto Sleep** (15 minutes by default). `management/pay-as-you-go/` counts "any process" and exempts only flow jobs. The cost box on `automate/` says it could not be confirmed. | `automate/index.mdx`, `VERIFY(Miro)` |
| `management/pay-as-you-go/` says 250 GB | A Free Plan project created on 2026-10-01 (6375) reports `storage.dataSizeBytes = 50000000000` in its own Storage API limits. `project/` gives no Storage figure until this is settled; both pages carry a `VERIFY(Nikita)`. | `management/pay-as-you-go/index.md` |
| Labels on linked pages outside this guide | `kai/settings.md` names the Kai settings tabs "Tool Permissions" and "System Instructions"; the live panel shows **Tools**, **Instructions** and **Notifications**. `components/index.md` says "Move to Trash"; the live label is **Delete configuration**. `flows/index.md` says every task in a phase runs in parallel; the keboola.flow schema runs notifications, then variables, one after another, and only job tasks in parallel, as `automate/` says. `components/extractors/storage/http/index.md` says the connector "loads a single CSV file", which the guide's five-row configuration contradicts. (`data-apps/publish-and-share.md` was fixed by the Apps PRs.) | those four pages |
| `cli/getting-started.mdx` may list too many static-token features | It says Kai, data apps, the semantic layer, streams and the Python SDK need a static token. keboola/cli `docs/auth.md` §4 refuses only `kai` and the Python SDK on a browser sign-in. The guide's boxes follow the CLI repo (a master token for Kai only). Owner: the CLI section. | `cli/getting-started.mdx` |
| Paths not rerun on the Free Plan | The CLI / API tabs against a Free Plan project; `ask/`'s BigQuery queries inside a workspace; the neutral transform prompt on a Snowflake project. | every CLI / API tab, `ask/`, `transform/` |
| Sign-up from your own AI assistant | The MCP server's `create_project` creates a project for a session with no Keboola credentials, but only on a stack with agent provisioning, and no public stack listed it on 2026-10-01. A fourth way in is drafted in a comment on `project/`; it goes live after a walk-through on such a stack. Question for the MCP team (DMD-1939). | `project/`, `VERIFY(MCP team, DMD-1939)` |
| The Apps builder's **Deploy** buttons | `app/`'s step 5 names the **Publish to Production** button, as the Apps pages do. In the 8 Oct run the builder's header and the *Draft ready* card offered **Deploy** instead, and nobody has tried whether it is the same action (`VERIFY(Nikita)`). | `app/index.mdx` |
| Build an app from an external agent through MCP | `data-apps/build-locally` covers building with an AI agent through kbagent, and the hub links the MCP server. The MCP route itself (an agent calling `deploy_data_app`) is documented nowhere on the site. Owner: Apps (PRDCT-692). | `data-apps/` or `ai/mcp-server/` |

## Closed

| Gap | Closed | How |
|---|---|---|
| A terminal query that assumes a Kai-built table | 2026-10-26 | `transform/workspace` gives the lower-case query for a table built with the SQL on `transform/` and the upper-case one for a table Kai built, and its case table covers both. |
| Open-Meteo's terms for a weekly call, and the credit on `ask/` and `app/` | 2026-10-26 | Jordan, approving #1116: keep the live call and accept the risk; `load/` stops quoting the free tier's terms; the credit line is on `ask/` and `app/` too. |
| A BigQuery run of the transform SQL | 2026-10-12 | Run as printed in Free Plan project 6439 through the five-table input mapping and the lower-case output mapping: job success in 61 s, 42 rows. Earlier, 2026-10-01: the query body as a read-only query in 6375. |
| Weather provenance and licence | 2026-10-12 | `weather_daily.csv` is real Open-Meteo archive data (all 552 rows, 1,104 values, equal the archive on 2026-10-12); `load/` says so and carries the CC BY 4.0 attribution; `scripts/gen-boolabean.py` rebuilds the five CSVs byte for byte. |
| A shared prerequisites partial | 2026-10-12 | The guide's own box, in use since wave one, merged into the site-wide `src/components/Prereqs.astro` (Jordan's review on #1116, item 6); one component, one style. |
| Four different time budgets | 2026-10-12 | `index.md`, `overview/index.md` and the hub all say about 30 minutes with Kai, plus sign-up (#1187). |
| No `vercel.json` rule for the sample files, and copies under `public/tutorial/` | 2026-10-12 | `vercel.json` 308s the old `/tutorial/*.csv` and the `.docx`; the copies are deleted (#1187); the Boolabean files live in `public/getting-started/boolabean/`. |
| Data app deploy broken in 264, and the flow's app phase | 2026-10-01 | The deploy worked in Free Plan project 6375; the flow has no app phase since that evening. 264's failure is the Apps team's. |
| Production deploy of the data app | 2026-10-01 | In 6375 **Publish to production** asked twice and the app came up **Active**; `app/` follows the Apps pages since #1144 and #1187. |
| `data-apps/getting-started` promises a live app the guide said could not deploy | 2026-10-01 | Same run; `app/` links the Apps pages instead of contradicting them (Jordan's review on #1116, item 2). |
| CLI / API tab on the task pages, and CLI coverage per task | 2026-09-15 | Every task page has the three tabs; `check/` has a read-only terminal section; `write/` says why it has none. |
| A "check it worked" page | wave one | `check/`. |
| A page for the "AI answer" step | wave one | `ask/`, after Michal asked for a step where AI answers the question. |
| A landing page for the going-further tier | 2026-09-02 | `going-further/`. |
| The approval count disagreed between the hub and `automate/` | 2026-10-01 | The hub and PathIntro say Kai asks before each change it makes, and a run is a change. |
| Clips with the mascot | 2026-10-01 | `outlook-tour.mp4` gone 2026-09-23; the ask clip replaced by a still from 6375. |
| Load, transform, automate and check captures | 2026-10-01 | Reshot in 6375 (automate 02 kept, theme-neutral; 03 and 04 removed from the page); `add-task.gif` reshot. |
| Ask, app and hero clips | 2026-09-14 to 2026-10-07 | The ask clip became a still, the app clip a still (`grid-preview.png`), the hero clip `hub-explainer.mp4`, 10 s. |

## Unverified assertions

Twenty-one `VERIFY(owner)` flags are live in the section (2026-10-12), indexed at
the end of `DECISIONS.md`. The ones that are load-bearing for the guide:

- Whether Kai can create a project (`project/`, ask the Kai team).
- Whether the monthly allowance is per project or per organization (`project/`).
- Which Storage limit is right for the Free Plan, 50 GB or 250 GB (`project/`).
- Whether a running data app counts against the Free Plan minutes (`automate/`).
- Whether flow jobs consume credits on contract plans (`check/`).
