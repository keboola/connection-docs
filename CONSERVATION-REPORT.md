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
  kbagent line under it. Retired from the box: "no installs" is the UI tab line on every page, and
  the page body already says the forecast API needs no account and no key. The body sentence "The
  sixth table is not a file you download" read as if the five CSVs were, so it now says the sixth
  table does not come from a file.
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

`public/getting-started/hub-demo.mp4` and `hub-demo-poster.png` were **removed 2026-09-29**,
replaced on the hub by `hub-explainer.mp4` and its poster. The screenshots of Kai's two answers and
of the Apps list lived only in that clip and go with it; Kai's answers are still on `ask/`, in text
and in its own clip. `app/grid-preview.png` stays and is reused on the explainer's last slide. No
page text changed.


## 2026-09-29 — Getting Started text pass (David Esner's "too wordy"; DECISIONS.md, same date)

Moved, so not lost: PathIntro's approvals, tool permissions and plan mode paragraph → the hub,
"Approvals and plan mode". Each step's "Where you are / When you finish" paragraph → the first row
of its Before you start box. load/'s sample-data table → cards (`sample.mjs`), its forecast-URL
explanation → a fold. transform/'s bucket-names and "which SQL" paragraphs → bullets; the band
definitions and the half-open paragraph → a fold. Every "If it goes wrong" item on the eight pages →
a fold, word for word. The hub's steps table → the course line (`course.mjs`), outcomes shortened.

Cut, with no new home (flavour or repetition, no fact lost):

| Page | Cut | Why it can go |
|---|---|---|
| all GS pages | "about N minutes" in PageMeta; the hub's Minutes column and "about 80 minutes" | Nikita, 29 Sep: estimates, not measurements; the hub keeps one measured number |
| load/ | "Apart, the sales file can plot a summer but cannot say what any day was." and the S02 / P07 / rain examples of "half a story" | the intro and "each table is half a story" carry the point |
| load/ | "The extra minutes pay for themselves" (Prompt tab); "which is why a proof of concept usually starts there" and "the run you kicked off by hand becomes one that repeats on a schedule" (Going further); "they differ in how they sign in and what they fetch" | the instruction stays, the persuasion goes |
| transform/ | "That is the safeguard … data lineage"; "contract customers choose theirs. Close the dialog and carry that word into your tab."; "(`products` is not needed)" | the mapping bullet and the tabs say it |
| ask/ | "Everywhere else in this guide Kai stood in for your clicking." | the bullet says Kai reads here |
| app/ | "does not want to ask" (Brno manager); "and the shared password above" (Going further) | trimmed sentences, same meaning |
| automate/ | "That is the whole model, and it makes the ordering obvious …" (the three-phase reasoning, now the strip); "Each later phase needs the previous one's output, so the split is the whole point"; "Kai set the schedule because the prompt asked for it"; "A flow nobody gets told about is just a button"; "on a scheduled production flow that is the one setting nobody should skip" | the strip and the Errors sentence carry it |
| check/ | "a duration chart over time"; "Both inputs are fixed, so the count is too, and it catches both directions of failure"; the Schedules-count bullet | the schedule toggle lives on automate/ |
| hub | "The **Next** control at the foot of every page follows this order."; "It needs a Google account you can authorize" (Going further) | the course line shows the order; write/'s own box names the Google account |

Correction, same day, after the fact-check: four transform/ cuts in the table above were restored,
so only "Close the dialog and carry that word into your tab" stays cut there: "It is also how
Keboola tracks lineage", "contract customers choose theirs", "(`products` is not needed for this
table)" and "give them exactly these names in the input mapping, or edit the queries to match". The
hub's time line says "plus sign-up and reading".

Also cut on 29 Sep, after the checker: the hub's "This guide" link card under "Where to start
instead" (it linked Get a project, which the course line above it already starts with). Masked, not
cut: a colleague's name in `transform/mapping.png` (PRDCT-616).

Later the same day the transform/ bullets were cut again, so three phrases quoted in the correction
above ("(`products` is not needed for this table)", "give them exactly these names", "It is also
how") are now worded differently; the facts behind them are still on the page: `products` is not
read, the input-mapping names must match the SQL, and mappings are how Keboola tracks lineage.

## 2026-10-01 — The Free Plan run

Michal Jeřábek's review (30 Sep) and the run in Free Plan project 6375 replaced these. Each has a
new home or a reason:

| Page | What went | Where it lives now, or why it can go |
|---|---|---|
| ask/ | `kai-ask-staffing.mp4` and its poster (project 264's week, only Brno flagged, with the pointer) | `ask/kai-ask.png`, the same question answered in 6375; which café, which day and why are in the Check and the folded answer |
| ask/ | "two cafés were flagged on the same two days ... *a thin start-of-week roster colliding with warm, dry weather*" | the fold now gives the screenshots' week (three café-days) in Kai's words; the old quote described a week no image shows |
| hub | the 29.6-s `hub-explainer.mp4`, a caption per step and a closing question | the 10-s cut keeps the four step titles and the closing line; the step texts are in the course line under the clip |
| app/ | step 3: "asks once before it writes code: a **Confirmation required** card", and the quote "This is a private draft that updates live as Kai builds" | not what the builder did in 6375 (no card until Publish); steps 3 and 5 now say when it asks |
| app/ | step 5: "no dialog appears", **Deploy App** on a **Not Deployed** page, "It has not succeeded in our project yet"; the box's "Publishing it to production has not worked in our project yet" | superseded: Publish to production asks twice and the app came up Active; the failure fold keeps 264's two causes |
| automate/ | "Expect the loads to take a couple of minutes ...; the app phase is slowest" | the run's own figures (128, 40, 24 s); 264's are in DECISIONS.md 2026-09-09 |
| check/ | "most of it for the app deploy"; "Our week had four" | the run's figures; three flags in the screenshots' week |
| project/ | "250 GB of Storage" | 50 GB, the new project's own limit (DECISIONS.md 2026-10-01) |
| hub | "The Apps builder ... asks once before it writes code" (the first rewrite, the same morning) | replaced by what the run showed |

Nothing else was cut. Nineteen screenshots were replaced in place under the same file names; six
are new.

The reviewers' fix pass the same evening (fact-checker, guide-tester, checker) replaced these:

| Page | What went | Where it lives now, or why it can go |
|---|---|---|
| hub | "Nothing here is one-way." | "Most of it can be undone.", followed by what Versions does not undo (tables already written, the schedule, an app's code) |
| hub | "asks before it changes the published app" | "when you publish it asks twice"; the merge into main happened without a card |
| transform/ | "You may get an editor for that one code, where you can also name it; call it `Staffing outlook`." | opening a saved code shows that editor and its rename pencil; **Create Multiple Queries** opened **All Queries** in both Free Plan projects |
| transform/ | "Later steps depend only on the table name" | later steps use the full table ID, so the Check names it |
| transform/, check/ | "rarely none (a cool, wet week can flag nothing)" | under 18 °C nothing is flagged; a mild wet week still flags Brno, so "wet" was wrong |
| ask/ | "In a wet week Kai will tell you nobody is short-handed" | the same correction, as a week under 18 °C |
| app/ | "most of it the preview starting" | the container start was not timed; the five minutes stay |
| app/ | "click **Create app** to get back to it" | the list and its **Create app** button were seen; the click was not made |
| automate/ | "The app does not need that restart ..., because it reads `staffing_outlook` each time someone opens it" | true of the app built in the run only; the box now says how to ask about yours |
| load/ | "the rest of the guide assumes you have seen where a configuration and its rows live" | kept as the reason the UI tab helps, next to "say so in the same chat" as the first recovery |
| load/ | `06-storage-tables.png` cut after two of five tables | the same page at a taller window, all five tables |
| task pages (PathIntro) | "Nothing here is one-way" | "Most of it can be undone", the hub's wording; the hub fold says what cannot |
| app/ | "It should compare true and false, not `1` or text" (written in this pass) | the working app converts the text it gets, so the test now says to turn whatever arrives into true or false |
| app/ | "nothing is published until step 5" | step 3 already says nothing is published until you say so |
| transform/ | "the result is the same table" | "the same rows and figures, though Kai picks its own column types" |
| transform/ | "Storage found the same bucket under both spellings in our project, so keep what the field gives you. Neither the bucket nor the table exists yet" | the lookup fact moved to the comment; the step now says which case applies to whom and to use your own table ID later |
| load/ | `04-row-settings.png`'s side panel (264's daily scheduled runs) | cropped off; the row's settings are what the step needs |

The flow lost its app phase the same evening (DECISIONS.md 2026-10-01, ruling 1, reversed at
Nikita's decision). What went with it:

| Page | What went | Where it lives now, or why it can go |
|---|---|---|
| automate/ | the prompt's line "Phase 3 redeploys the data app ... so it shows the new table" and the strip's "Phase 3: redeploy the app" | the app reads the table on every request; a bullet says the app is not in the flow, and the box says how to check yours |
| automate/ | UI step 6, adding the data app to a third phase | step 6 now adds the Sheets destination there, which the old step also covered |
| automate/ | the YAML's `redeploy` phase and `task-app` task, "Without the app, delete the `redeploy` phase…", and how to find the app's configuration ID | not needed without the phase; app/'s CLI tab still shows how to get the configuration ID |
| automate/ | the cost box's paragraph on the third phase restarting the app | replaced by how to ask whether your app reads the table live, and the open question on app running time |
| check/ | the fold "The app phase fails, and the rest succeeds" | no app phase; app/'s deploy fold keeps the disabled-app banner and **Start** |
| app/ | "Kai also names the app, and not always the same way… The flow on the next page asks for it by name" | the flow no longer needs the name; the step says where to read it |
| automate/, check/ | the run's own figures of the morning (128, 40, 24 s; 3 min 25 s) | the two-phase run's (4 min 33 s, 53 s; 5 min 38 s); the morning's are in DECISIONS.md and the automate/ comment |
| check/ | "in an older project our first run failed at the app phase with `staffing_outlook` already rebuilt" | no app phase; the bullet now gives the transformation failing after the loads |
| automate/ | the cost box's "between 2½ and 6 minutes a run, depending mostly on how long they waited to start" and "10 to 30 minutes a month" | extend/jobs/ bills only `standard` jobs and not waiting time: about 2½ and 4 minutes, 10 to 20 a month |
| app/ | CLI tab: the configuration ID as "the one a flow task takes", and "A flow task that deploys the app makes the same call, so a broken app would turn a scheduled run red" | the guide's flow has no app task any more |

## 2026-10-02: Leftovers outside the retitle

After the retitle (DECISIONS.md, same date) a guide test found pages that still described the guide
in its old order or linked it by old names. What went:

| Page | What went | Where it lives now, or why it can go |
|---|---|---|
| home (`index.md`) | "load data, transform it with SQL, deliver the result, and put it on a schedule. It starts by getting you a project, free." | the hub's order, with Kai and the app: load data into Storage, transform it with SQL into one table, ask Kai about that table, build an app on it, schedule a flow that rebuilds the table every week. Delivery is the Send a table to Google Sheets side trip, listed on the hub and on Going further; "free" is now "a free project is enough" |
| ad-hoc/ | the opening "After you have loaded your tables, either from a URL or using a data source connector, manipulated the data in SQL, written it into Google Sheets, and set everything to run automatically, let's take a look at some additional Keboola features related to doing ad-hoc analysis." | dropped: the page uses none of those steps, and the hub gives the guide's order. The new opening says where the side trip branches off and what it does |
| ad-hoc/ | "This part of the tutorial shows how to work with arbitrary data in Python in a completely unrestricted way. Although our examples use the Python language, the very same can be achieved using R." and "Before you start, you should have a basic understanding of the Python language." | the new opening ("any code you like", "The examples use Python; the same can be done in R") and the **You need** box, whose last item is a basic understanding of Python |
| ad-hoc/ | `## Final Note`: "This is the end of our stroll around Keboola. On our walk, we missed quite a few things: Applications, Python and R transformations, Snowflake features, to name a few. However, teaching you everything was not really the point of this tutorial. We wanted to show you how Keboola can help in connecting different systems together." | dropped as the end of a tutorial the page no longer ends. What it listed has homes: Applications, the component category the 2018 text meant, is its own section under Components (`/components/applications/`); the Wrap Up links Python Transformation and Workspaces for R; Going further's **Pick your next thing** covers SQL, Python, R and dbt transformations. The hub says what the guide is for |
| ad-hoc/ | the links "Return to the beginning" and "contact us" | the new **Going further** list, as Getting started with Keboola and Keboola Support |
| ad-hoc/ | the caution box as the page's first block, titled "These Google Cloud steps describe an older console" | under the opening and the **You need** box, titled "Parts of this page are out of date": the same Google paragraph, then a line pointing to the note at the start of Exploring Data, which already says that sandboxes are legacy |
| ad-hoc/ | `index.md`, with three `<!-- -->` authoring comments | `index.mdx`, for the `PageMeta` line and the `Prereqs` box the other side trips have; the comments are `{/* */}` with the same text |
| going-further/ | "Two worked examples sit in this tier"; "what it does beyond the arc" | "Two of the side trips above are worked examples"; "beyond this guide" |
| `components/extractors/database/` index, mysql, ms-sql, oracle, postgresql | the link texts "Tutorial - Loading Data with Database Extractor", "Tutorial - Loading Data from Database" and "Loading Data with Database data source connector" | the target's title, Load from a database |
| storage/api/tde-exporter/ | "This component is normally a part of the [Tableau Writer](/getting-started/write/), but it can also be used as a standalone component.", whose link opened the Google Sheets side trip (its old target `/tutorial/write/` redirects there) | "In the UI, this component is the [Tableau TDE](/components/writers/bi-tools/tableau/) data destination connector. Through the API you can also run it on its own, with a stored configuration or a custom one sent in the request.": the Storage API index lists `tde-exporter` itself as Tableau TDE, a writer, and the page's own Running the Component section covers both kinds of configuration. In the next paragraph, `the *Storage* --- *File uploads* section` is "the *Files* section of *Storage*", the name `storage/files/` gives it |
| ad-hoc/ | "[Transformation](/getting-started/transform/)" in the Wrap Up, the SQL page, for Python code | "[Python transformation](/transformations/python-plain/)" |
| branches/ | the title "Development Branches"; the footers "Next: Overview" on ad-hoc/ and "Previous: Overview" on prepare-tables/, both opening that page | "Development branches", as the sidebar, the hub and Going further have it; the two footers name the page through `next:` and `prev:` in their frontmatter |
| branches/ | "The feature Development Branches allows you to modify"; the link texts "Preparing table manipulating configurations", "Preparing file manipulating configurations", "Working with tables in a branch", "Working with files in a branch" and "Project diff" | "Development branches let you modify"; each link now says its page's title (Prepare the table configurations, Prepare the file configurations, Work with tables in a branch, Work with files in a branch, Review the project diff) |

The fact-checker, guide-tester and checker rounds the same day added these, all of the same kinds:

| Page | What went | Where it lives now, or why it can go |
|---|---|---|
| project/ | the footer "Previous: Overview", which opens the hub | "Previous: Getting started with Keboola", through `prev:` in its frontmatter |
| going-further/ | "Everything you just did by clicking can be done by an AI assistant instead." | "An AI assistant can carry out most of this guide's steps for you", because the guide is prompt first and the hub names what no assistant can do (a signup form, a Google consent screen, a branch merge) |
| going-further/ | "the one you have been using through this guide's **Prompt** tabs" | "the one this guide's **Prompt** tabs use", which holds for a reader on the UI or CLI tabs too |
| going-further/ | the `variables` link to `/transformations/variables/`, a redirect stub | `/components/variables/`, the page the stub forwards to |
| overview/ | "a running pipeline in about 30 minutes" | "a scheduled pipeline and an app, in about 30 minutes with Kai, plus sign-up and reading", the hub's outcome and time |
| check/ | "delivery on Send a table to Google Sheets, and apps on Build an app", in the old order | apps first, then the spreadsheet delivery as the side trip it is |
| write/ | the description "Send the table you just built out of Keboola" | "Send a Storage table out of Keboola": the page is reached from anywhere, and its **Where you are** already says the table is in Storage |

Nothing went to MISSING.md: no removed sentence was the only place a fact lived.
