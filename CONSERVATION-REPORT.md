# Conservation report — Getting Started rebuild

CLAUDE.md requires that every paragraph removed during a revamp either finds a
new home or is logged as a deliberate deletion. This file is that ledger for the
Getting Started rebuild. One row per moved or removed unit, added in the same PR
that moves it — not afterwards.

Status values: **moved** (lives elsewhere now), **merged** (folded into another
page), **dropped** (deliberately deleted, with the reason), **pending** (planned,
not yet done).

---

## Wave one

| Content | From | To | Status |
|---|---|---|---|
| Decision rationale that existed only in authoring comments — hero-above-the-fold (Jordan, 21 Aug), the clip's three-act script, combined UI+API format (5 Aug), Kai-first, "pick a stack" removal | HTML comments in `getting-started/index.md`, `automate/index.mdx` | `DECISIONS.md` | moved |
| The fourteen live `VERIFY(owner)` flags | scattered across nine section pages | indexed in `DECISIONS.md`, flags left in place | moved (index only) |
| Sidebar-label mechanics: why `navigation.yml` titles were inert | undocumented | `DECISIONS.md` + a comment in `scripts/convert-nav.mjs` | moved |

## Wave one, executed

| Content | From | To | Status |
|---|---|---|---|
| The per-page "Two ways to do it" paragraph and the Kai-approval explanation | `load/index.mdx` (and the other four tabbed pages, pending) | `src/components/getting-started/PathIntro.astro`, stated once | moved |
| The hand-written `## What you need` list | `load/index.mdx` | `src/components/getting-started/Prereqs.astro`, keyed wording | moved |
| Ordinals in copy ("Step 2 of the arc", "[step 5]") | `load/index.mdx` | replaced by page names; order lives in the sidebar | dropped, logged in `DECISIONS.md` |
| Live-walk provenance for the HTTP connector walk (264, 2026-08-04) | the page's authoring comment | kept in place, stale half rewritten | kept |
| `## Ask it the question you started with` — both prompts, both checks, the read-only explanation, the "if the numbers differ" recovery, and the `kai-ask-basin` clip with its recording provenance | `automate/index.mdx` (it was misfiled at the bottom of the automation page) | new page `getting-started/ask/`; clip assets moved to `public/getting-started/ask/` | moved |
| The Kai-free fallback ("run the same aggregate in a workspace instead") | `project/index.md:113-115` | `getting-started/ask/`, so the page is not Kai-only | moved |
| The consolidated one-prompt block | `next-steps/index.md` | `getting-started/ask/`, **trimmed**: the "now that you have seen the pieces" framing is false on page 4 of 7, and the flow/app clauses describe later pages | moved, edited |
| The Apps-availability caveat | duplicated in `app/index.mdx` prose and its troubleshooting list | `Prereqs` on that page, once | merged |
| Ordinals and the "Two ways to do it" paragraph on `transform` and `app` | both pages | `PageMeta` / `PathIntro` | moved |

## Pending

| Content | From | Planned destination |
|---|---|---|
| Project isolation, the three entry routes, what a stack is, the five locators, the Kai orientation prompt, the two checks and the three sign-in failure modes | `project/index.mdx` | `getting-started/index.mdx` → **Get a project** (routes, project + stack in one paragraph, **Find your way around**, the tip, **Check it worked** and **If it goes wrong** as two bold-led paragraphs); the two `VERIFY(owner)` comments travelled with their facts; `/getting-started/project/` redirects to the hub | merged 2026-09-09 |
| `## Phases and tasks`, notification cards | `automate/index.mdx` | `/flows/` and `/management/notifications/` — **only the parts those pages lack**; the existing notifications page is richer than the arc's table and must not be overwritten |
| `## How a transformation works`, the mapping explanation | `transform/index.mdx` | `/transformations/` |
| `## Sending data out` | `write/index.mdx` | `/components/writers/` |
| Four of the five delivery failure modes | `write/index.mdx` | `/components/writers/storage/google-sheets/`; `check/` keeps the one that is about flow ordering |
| The configuration-rows teaching (one configuration, four rows) | `load/index.mdx` | **at risk** in wave two's data split — the arc is its only teaching site and `automate` depends on it. Needs a destination before the split lands. |

## Deliberate deletions

| What | Where it was | Why it is gone |
|---|---|---|
| The OBIS / WoRMS provenance paragraph and the "every octopus in this data is real" line | `load/index.mdx` | Retired with the octopus dataset (DECISIONS 2026-09-03). The new sample is declared fictional on the page in one sentence; the only real source is the live forecast, and that is said too. |
| The "deepest sighting" Data Sample reading (Grimpoteuthis challengeri, 4,838 m) | `transform/index.mdx` | Replaced by the same move on the new table: sort by `expected_units_per_person` descending and read the top row, which the next page asks Kai to explain. The teaching point (the joined table answers what the raw file could not) is unchanged. |
| The ask clip `kai-ask-basin.mp4` and poster (Kai answering the basin question, 2026-08-26) | `ask/index.mdx`, `public/getting-started/ask/` | Retired with the sample world; the files are removed from `public/`. Phase 2 records the new answer from the live chat. The two documented checks it illustrated (2,632 sightings, 26%, 50 species) are replaced by the structural checks on the new page. |
| The write clip `kai-write.mp4` and poster (Kai fixing a sheet title and running the destination, 2026-08-26) | `write/index.mdx`, `public/getting-started/write/` | Retired: it showed the previous configuration. What it demonstrated (Kai reads the configuration, notices the sheet was titled "Sheet1", shows the diff, asks, fixes, runs to Success) is kept as a comment calibrating the prompt. Re-recording needs Nikita's Google authorization (plan decision 5). |
| The "deepest sighting" reading of the delivered sheet | `write/index.mdx` | Replaced by sorting the sheet by `expected_units_per_person`, the same move the transform page teaches. |
| The two-phase pipeline description and the octopus flow prompt | `automate/index.mdx` | Replaced by the three-phase flow (two loads in parallel → transformation → app redeploy); the parallelism paragraph that used to say "nothing runs in parallel yet" now describes the two connectors that do. The hand-built steps gain one step (adding a second task to phase 1 with the phase's own +), which the page already explained in prose. |
| The 10,000-row join check and the `depth_zone` 4,465-of-10,000 reading | `check/index.mdx` | Replaced by the 42-row check (6 × 7) and the reading of which columns may be empty (`expected_units` on a band the summer never had). The failure list gains the app-phase failure observed on the first live run and drops the Google Sheets delivery case from the main list, since delivery is a side trip. |
| The app clip `app-preview.mp4`, its poster and `octopus-map-preview.png` (the nearest-sighting map, 2026-08-26) | `app/index.mdx`, `public/getting-started/app/` | Retired with the sample world; files removed. The moment they showed (type your coordinates, the answer updates) has no equivalent in a grid; the new page's moment is the caption count matching the red cells. Phase 2 records the grid from the draft preview. |
| Automate captures 03 (component picker) and 04 (second phase) | `automate/index.mdx`, `public/getting-started/automate/` | Removed 2026-09-14: both showed the previous sample's names. Steps 3 and 5 are fully described in text, and the finished canvas (05, reshot) shows the result; MISSING.md carries the picker reshoot. |
| The hub's café-story opening (two paragraphs: rosters by weekday, demand reading the weather) and "The sales file alone can plot a summer…" | `index.mdx` | Deleted 2026-09-14, not moved: Michal asked the hub to be drier and the dataset to stop carrying the page. The same facts are on `load/` under "The sample data" (six cafés, the five files, what each one knows), and the roster/weather mechanic is explained where it is used, in `transform/` under "What the SQL has to do". |
| The hub's "Get a project" section (three routes, stack paragraph, Find your way around, checks, failures) | `index.mdx` | Back to its own page `getting-started/project/` 2026-09-14, trimmed: the stack paragraph is one sentence plus a link, and the Kai-allowance VERIFY travelled with it. |
| `automate/02-add-task.png`, the Add Task menu still | `automate/index.mdx` | Replaced 2026-09-22 by `add-task.gif`. Not the same menu: the still showed the phase toolbar's three-item Add Task menu; the GIF shows the standalone + above the first phase, whose menu also offers Conditions, then the picker that Component opens. The three-item menu is still described in the prose of the same section. |
| `load/db-picture8.png`, the Advanced Mode capture | `load/database.mdx` | Deleted 2026-09-22: decorative by the step's own admission ("this walk does not need them"). The sentence now says where the button is, top right of the configuration page, which is what a locator owes the reader. |
| `write/writing1.png`, `load/08-forecast-code-editor.png`, `automate/09-all-runs.png` (3) | unreferenced | Deleted 2026-09-22 after a sweep of all 142 images: writing1 lost its page in the rewrite, 08-forecast-code-editor was superseded by `forecast-row-code-editor.gif`, and 09-all-runs was byte-identical to the copy under `check/` that the page actually links. `automate/automate1.png` looked orphaned too and was kept: `flows/flows-legacy/index.md:61` still uses it. |
| Google's own screens: `load/allow.png`, `load/access-to-spreadsheets.png`, `load/find-spreadsheet.png`, `load/google-sheets-spreadsheet.png`, `write/writing6.png` (5) | `load/googlesheets.mdx`, `write/index.mdx` | Deleted 2026-09-22. Three carried a colleague's e-mail address, and all five picture a vendor UI we do not control: Michal's test showed Google's buttons had already moved since these were shot. The steps now say what to do there and link Google's own help, which is the rule the usability test produced. |
| Workspace list views: `transform/workspaces4.png`, `5`, `6` (3) | `transform/workspace.mdx` | Deleted 2026-09-22: each shows a colleague's name in the Last Change, Last Use or Versions column. Steps 4 to 6 read without them; a reshoot must be a filtered or element capture, not a full list. |
| `transform/workspaces7.png`, the Connect dialog | `transform/workspace.mdx:155` | Deleted 2026-09-22: a live Snowflake host, user, database and schema in one frame, and stale besides — it shows password auth where the workspace now issues a key pair. The step already spells out both routes in text. |
| `write/writing11.png` | `write/index.mdx:196` | Deleted 2026-09-22: an unmasked top bar (organization, project, branch, avatar) and the retired sample world. It also contradicted its own step, which says the click opens the spreadsheet while the picture showed a Keboola page. |
| `ad-hoc/ex-bigquery-6.png`, the service-account key screenshot | `ad-hoc/index.md:114` | Deleted 2026-09-22, not masked: its only content was a pasted Google service-account JSON (private key, client_email, project_id), and the sentence above it already says what to paste. House style and Google's own guide both say not to use images of text or code. The masked twin of the same file survives at the old path in PR #1100. |
| The hub's hero clip `map-tour.mp4` (octopus tour, 25 s) and its poster | `index.mdx` | The sample world changed on 2026-09-03; a clip answering the old question under the new text would mislead. Replaced by `outlook-tour.mp4`, shot from the live pipeline in project 264. The two files stayed in `public/` unreferenced until 2026-09-16, when they were deleted: 1.15 MB serving no page, and the last octopus-era asset in the repo. |
| "No Kai path here" call-out and the project page's own `PageMeta` (5 min) | `project/index.mdx` | The step is now a section of the hub; its five minutes fold into the hub's total, to be re-measured in the phase-3 stopwatch pass. |


| Content | Why | Where the information survives |
|---|---|---|
| Eight `db-picture*.png` captures of the Snowflake connector setup | Re-shot the same Add Component → credentials → select-tables flow that `sqldb-1..4` already illustrate on the destination page | `/components/extractors/database/sqldb/#initial-setup` (done, PR #1109) |
| Seven hand-written `**Next:**`/`**Back to:**` pointers | Starlight generates pagination from sidebar order (`pagination: true` in astro.config.mjs), and the hand-written ones had drifted — several pointed at pages that had moved. Verified after removal: transform → "Ask a question and get an answer", app → "Make it run every morning", check → end of section, all generated correctly | sidebar order |
| Chapter numbering in titles and bodies ("Step 3 of 7") | The new titles are outcomes; numbering breaks the moment a page moves, and no surveyed vendor uses it | reading order lives in the sidebar |
| `writing1.png` | Orphan — grep-confirmed unreferenced | n/a |

## Verification pass, 2026-09-02 — what it caught

A fact-check of all ten pages plus three walkthroughs (linear, cold landing, project without Kai)
found 85 issues. The ones that were real defects in this branch, now fixed:

| Defect | Where | Why it mattered |
|---|---|---|
| The page printed its own source code | `going-further/index.md` | It was `.md`, so the MDX import never compiled: the built page showed `import PageMeta from …` as body text and `gs-pagemeta` appeared zero times. The same trap as the earlier `.md`/`.mdx` comment bug — third occurrence on this branch. Renamed to `.mdx`. |
| Verification called a correct build broken | `check/index.mdx` | It said the added columns "should be populated, not empty". `depth_zone` is empty on **5,535 of 10,000** rows by design — only 4,465 sightings recorded a depth, and the LEFT JOIN keeps the rest. Rewritten to name the real failure signals: a derived column empty on *every* row, or `depth_zone` filled on all 10,000. |
| The hub advertised the pre-rebuild route | `index.mdx` | Its numbered list still read project → load → transform → **write** → automate → app, omitting both new pages and selling the spreadsheet as a required step, while the sidebar and generated pagination said otherwise. Rebuilt to match. |
| The flow was still built around the spreadsheet | `automate/index.mdx` | The prompt, the check and "you now have three phases" assumed a page that now sits *after* this one in Going further. Two phases are the default; delivery is the add-on. |
| A promised click-through path that does not exist | `app/index.mdx`, `index.mdx`, `ask/index.mdx` | `PathIntro` claimed "the same task click by click … either tab reaches the same result", but the app's second tab has no procedure — building by hand is a git-and-code workflow. Kai is now a stated prerequisite there, and the two Kai-only pages are named honestly on all three pages. |
| Ordinals pointing at the wrong pages | `project/index.mdx` | "step 4 … authorize Google" and "step 5's closing question" survived the sweep and now named different pages entirely. Replaced with page names. |

## Regression found and fixed in this wave

`public/getting-started/transform/04-input-mapping.png`,
`06-output-mapping.png` and `07-configured.png` were **byte-identical**
(`1feaa6990456e936707f2f20554368b0`) — three captions pointing a reader at the
same picture. Introduced by the 27 Aug reshoot, not inherited: the shoot used
`scrollIntoViewIfNeeded` on a page that fitted the viewport, so all three
"scrolls" produced the same frame.

Re-shot 2026-09-02 as **element/region captures** rather than full-page ones, so
each frame is necessarily distinct and shows only its own panel — which also
matches the house rule that doc screenshots are UI locators. `04` shows the four
input rows, `06` the single output row, `07` the Queries/Blocks panel where the
code lives (the SQL itself stays transcribed in fenced blocks on the page, not
in an image). `05` was never referenced by any page — the numbering simply
skips it; no file is owed.

`public/getting-started/outlook-tour.mp4` and `outlook-tour-poster.png` were
**removed 2026-09-23**, replaced on the hub by `hub-demo.mp4` and its poster.
Nothing the clip carried is lost: its five file cards are the sample paragraph
on `load/`, its question frame is the goal sentence on the hub, and its closing
grid is the fourth and sixth beat of the new clip, from the same
`app/grid-preview.png`. The reason is in DECISIONS.md (2026-09-23): the hub now
opens with what the guide is for, so the clip shows the results rather than the
ingredients. Jordan's 21 Aug decisions on the three acts and on the poster carry
VERIFY(Jordan) there.

**"Before you start" rewritten as two lists, 2026-09-25.** Nothing a reader needs was dropped. One
sentence was retired; the rest moved or became items in the new lists:

- `load/`, "Nothing else. No installs, no credentials, no files to download." It contradicted the
  kbagent line under it. Kept as a thing, "Nothing to download: the connector fetches the sample
  files from a public URL, and the forecast API needs no account"; "no installs" is now the UI tab
  line on every page.
- `project/`, the same sentence. Retired: the box there lists an email address or an invite, and a
  page with no tabs has nothing to install.
- `app/`, "Whether the Free Plan includes data apps is not settled in our own docs". Moved into a
  `VERIFY(owner)` author comment beside the box; the question stays in the DECISIONS Open table,
  and the reader keeps the action (no Apps, skip the page).
- `transform/`, "The bucket names contain configuration IDs, so yours will not match the
  screenshots." Moved into the body paragraph that already says the bucket names do not matter.
- The three hand-written "For the CLI / API tab only: kbagent…" items on `load/`,
  `load/database` and `transform/workspace` are replaced by the shared tab lines.
- The hub's sentence "Everything here can be done in the browser… A free project is enough to
  begin." is replaced by the box, which points at "How every page works" for the tab needs.
