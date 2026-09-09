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
| The hub's hero clip `map-tour.mp4` (octopus tour, 25 s) and its poster | `index.mdx` | The sample world changed on 2026-09-03; a clip answering the old question under the new text would mislead. Phase 2 re-shoots it from the live pipeline in project 264. Until then the "What you will build" table carries Jordan's first-screen requirement. Tracked in MISSING.md. |
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
