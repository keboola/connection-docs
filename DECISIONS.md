# Decisions — Getting Started

Append-only. Each entry records a decision, who made it, and the date, so the
reasoning survives the page it was made about. Rationale that lives only inside
an authoring comment gets lost the moment that page is rewritten; this file is
where it goes instead.

Open questions are not decisions — they stay as `VERIFY(owner)` flags in the
pages and are listed at the bottom of this file so they can be closed in batches.

---

## 2026-09-02 — The sample dataset stops being the theme

**Decided by:** Michal (call, 2 Sep 2026), with evidence accepted from the
12-site documentation survey.

The octopus dataset — and any dataset — is a vehicle, not the subject of the
guide. *"Dataset je podle mě jen helping vehicle k tomu, abych si mohl zkusit
tasky. Ale není to nosné téma."* The failure mode named on the call was landing
confusion: *"Já si to prokliknu a vidím: Octopus, Octopus. Pro mě je to
matoucí."*

Evidence: of twelve documentation sites examined (dbt, Snowflake, Databricks,
Metabase, Airbyte, Fivetran, Hex, dltHub, Supabase, Cloudflare, PostHog,
Firecrawl), **zero** put the sample dataset's topic in a page title or a step
heading; **twelve** name pages by task or outcome. Snowflake demoted its own
sample brand out of a page title into the URL slug.

**Consequence:** no theme vocabulary in titles, headings, or sidebar labels.
Whimsy is allowed in exactly two places, both with precedent — the *name* of the
sample world (`jaffle_shop`, Tasty Bytes, Wanderbricks) and the *values inside*
the data (Metabase ships "Lightweight Wool Computer" in a category called
Doohickey). Never in navigation.

## 2026-09-02 — Structure comes from user needs, not from tools

**Decided by:** Michal (call, 2 Sep 2026).

*"To MCP a CLI jsou jen drivery a vehikly. Ty nechceš pracovat s CLI, ty chceš
prostě zpracovat data. Já bych stavěl strukturu těch věcí od user needs."*

**Consequence:** page titles state what the reader gets. Tool names survive as
tab labels and as their own reference sections in a separate "going further"
tier — never as chapters of the guide.

## 2026-09-02 — Every page must survive a cold landing

**Decided by:** Michal (call, 2 Sep 2026).

*"Musíš přemýšlet tak, že ten člověk přistane tady. Nikdy to nečetl."*

This collides with the design rule that the guide's question is answered only at
the last step. Both survive with two payoffs at different scales: a **local** one
on every page (a state sentence at the top, a verification block at the bottom)
and a single **global** one (the business question resolves in the app).

**Consequence:** four blocks on every task page — genre and position and time
budget; a state sentence; prerequisites rendered from a shared partial; a
verification block.

## 2026-08-21 — The hero clip sits above the fold

**Decided by:** Jordan (call, 21 Aug 2026). Recorded here because it existed
only as an HTML comment in `getting-started/index.md`.

The guide's question has to be answerable without reading. The hero clip is
placed directly under the question, with the question frame as its poster so it
is legible before autoplay starts. Its three-act structure — the raw files, the
question, the answer — is deliberate and should be preserved through any
dataset change.

## 2026-08-05 — Combined UI and API format

**Decided by:** Jordan (call, 5 Aug 2026).

Pages show both the UI path and the underlying API/CLI form of the same task,
rather than presenting them as separate sequential chapters.

**Consequence:** each task page carries tabs for the same task, Kai/prompt
selected by default. This is the same mechanism Michal asked for independently
on 2 Sep (*"Mám tam nějaký prompt? Jak to zpracuje to CLI?"*) — it is one
structural answer to two requests, not two features.

## 2026-08-05 — Kai first, manual path kept

**Decided by:** Jordan (call, 5 Aug 2026).

Kai is the default emphasis; the click-through path stays for readers who need
to know where each setting lives. Rationale recorded on the call: deep
platform-specific knowledge is not career-transferable for most readers, so the
goal is that a reader copies a prompt, gets a result, and feels it work.

## 2026-08-05 — "Pick a stack" leaves Getting Started

**Decided by:** Jordan (call, 5 Aug 2026).

Self-serve signup exists only on pay-as-you-go; every other stack follows a
signed contract, so a stack chooser in the first-run guide is a dead end.

**Consequence:** stack topology belongs to the architecture tier, not here.

## 2026-09-02 — One Getting Started for all segments

**Decided by:** analysis accepted in the 2 Sep memo; confirms Jordan's audience
call against marketing's enterprise focus.

The docs reader is not the buyer. In an enterprise deal the person who opens
this guide is an engineer running a proof of concept, a practitioner handed the
project after signature, or an implementing partner — none of whom needs a
different first pipeline than a pay-as-you-go signup does. What differs is what
comes *after*: stacks, architecture, governance, SSO, branches and CI, cost
control.

**Consequence:** do not fork the guide by segment. Enterprise concerns go to a
separate architecture tier. Precedent: Cloudflare keeps Reference Architectures
apart from Get started.

## 2026-09-02 — Sidebar labels are opt-in overrides

**Decided by:** Nikita, implementing the rebuild.

`scripts/convert-nav.mjs` returned a bare `{ slug }` for every leaf, so a
`title:` in `_data/navigation.yml` was silently discarded and the sidebar label
came from the page's frontmatter. Group landing pages were hardcoded to
`label: 'Overview'`.

Honouring `navigation.yml` titles wholesale would have changed **129 of 352**
sidebar labels across the entire site (`/kai/settings/` from "Kai Settings" to
"Settings", and so on) — an information-architecture change well outside this
rebuild.

**Consequence:** the generator now honours an **optional** `label:`, and only
where present. Adding a `title:` to navigation.yml still does nothing; use
`label:` when the sidebar needs a shorter name than the page title.

## 2026-09-03 — The sample world is Boolabean, a fictional coffee chain

**Decided by:** Nikita, on the delegated call ("придумай сам"), against the five
criteria in the 2 Sep memo.

**The name.** Every natural café or bakery name is taken by a real business —
checked Kolache Bar, Kettle & Crumb, Poppyseed, Bakelane, Crumbline, Kettleflow;
all of them exist. `jaffle_shop` collides the same way, so uniqueness is not the
criterion — *not impersonating anyone* is. So the name follows Databricks'
Wanderbricks and Snowflake's Tasty Bytes: a pun on our own brand.
**Boolabean** — Keboola plus coffee bean. Obviously invented, easy to say and
search, and free.

**The schema is deliberately mundane**, per the evidence: five tables,
`stores` / `products` / `sales` / `staffing` / `weather_daily`. Whimsy lives only
in the product values — "Iced Latte, Extremely Iced", "Cold Brew, Patient",
"Decaf, Genuinely" — which is the Metabase slot ("Lightweight Wool Computer").
No theme word appears in a page title or the sidebar.

**The static half is generated but the weather is real.** `scripts/gen-boolabean.py`
pulls 92 days of actual observations from open-meteo's archive API for each
café's real coordinates, then generates sales that genuinely depend on it. Seeded,
so the numbers the guide quotes are reproducible.

**The live half is not shipped.** The guide fetches tomorrow's forecast from
open-meteo at read time — no authentication — which is what finally makes the
scheduling step teach something: run it again tomorrow and the answer has moved.
dltHub pays the same price for the same reason.

**The question, after testing it against the data:**
*"Which day next week will leave a café short-handed?"*

It started as *"should we put an extra person on this weekend?"* — and the data
said no. Rosters already allow for the weekend (the Prague café goes from three
people to four), so the weekend is the part the manager has already solved. What
the roster cannot see is the weather: a 26 °C Monday is riskier than a cool
Saturday, because nobody staffed up for it. In the forecast tested on 2026-09-03,
the two stretched days were a Monday and a Tuesday, and the weekend was fine.

Keeping the weekend wording would have produced a guide whose closing question
answers "no" — so the question changed to fit the data, not the other way round.
This is also a better demonstration: the insight is that *the roster is built on
the day of the week and demand is built on the weather*, which is exactly the
kind of thing you only see once two sources are joined.

Verified in the data before committing to it:

| Signal | Result |
|---|---|
| Iced-to-hot drink ratio by temperature band | 0.45 below 18 °C → 1.54 above 28 °C |
| Rain, terrace cafés vs indoor | −25% vs −12% — the terrace is the difference |
| Rosters vs actual demand | 55 stretched days of 552; 29 of them 26 °C+, 16 on a weekend |

The rosters are planned from each café's typical week, not from what actually
happened — a manager writing next week's rota does not know the weather. That is
why a shortfall exists at all, and it is the thing the forecast join predicts.

**Cost, stated plainly:** the live source adds one connector configuration the
static-only version would not need, and open-meteo's CSV is two-block with units
in the header (`temperature_2m_max (°C)`), so it needs a `skip-lines` processor —
the same processor Kai reached for unprompted in the 2 Sep run.

---

## 2026-09-08 — The pipeline runs as four prompts, and the numbers match

**Decision:** the section teaches the Boolabean pipeline as four prompts in one Kai chat —
load, forecast, transform, ask — because that is what was run end to end in project 264 today
and checked against an offline reference. "Everything in one prompt" stays an experiment
paragraph, not the spine of the section.

**What ran (control run, plan mode off, 14.4 min, 12 approvals, 0 nudges):**

| stage | minutes | approvals | Kai's report | independent check (Storage API) |
|---|---|---|---|---|
| load — `1-load.txt` | 5.6 | 7 (config, 5 rows, run) | stores 6, products 18, sales 9,761, staffing 552, weather_daily 552 | identical |
| forecast — `2-forecast.txt` | 3.5 | 3 | forecast 42 rows, columns `location_id, time, temperature_2m_max, precipitation_sum` | identical |
| transform — `3-transform.txt` | 3.7 | 2 (create, run) | `staffing_outlook` 42 rows; most stretched Brno, Tue 2026-09-08, 31.2 °C dry, ~169 units / 2 staff = 84.4 | 42 rows, 42 distinct (store, date), 0 empty cells, 4 short-handed, 32.0–84.4 per person |
| ask — `4-ask.txt` | 1.3 | 0 (read-only) | "a thin start-of-week roster colliding with warm, dry weather" | — |

Kai's four flagged rows match the offline reference (a Python re-implementation of the same spec,
run on the same day's forecast) to the decimal: Brno Tue 84.4 and Mon 83.5, Prague Mon 73.0 and Tue 71.3. **On the day this was
written** (forecast window 2026-09-08 … 09-14) that is the whole answer; the forecast is live, so
`check/` states the shape — 42 rows, a handful of red days — and not these values.

**What Kai did differently from the plan, and why it stands:**

- open-meteo's preamble: the prompt said "skip the first eight lines"; Kai set `skip-lines: 9`
  and named the four columns in the manifest instead of reading the header. Same 42 rows, and the
  names come out without the header's unit suffixes (`temperature_2m_max (°C)` → `temperature_2m_max`).
  The UI tab can show either; the SQL on page 3 uses the clean names.
- the transformation reads the source tables by fully qualified name
  (`"KBC_EUW3_264"."in.c-keboola-ex-http-…"."sales"`) with an **empty input mapping** — the
  read-only-input behaviour Jordan described on 5 Aug, now observed rather than reported.
- half-open bands as `CASE WHEN t < 18 … WHEN t < 23 … WHEN t < 28 … ELSE`, twenty `TRY_CAST`s,
  no `BETWEEN` anywhere. The roster is `ROUND(AVG(staff_on_shift))` per `DAYNAME` — exact, because
  the headcount is constant per store and weekday (42 combinations, 0 with two values).
- output aliases were unquoted, so Snowflake returned `STORE_NAME … SHORT_HANDED` in upper case.
  **Not cosmetic, as the next run showed** — see "The output-mapping trap" below. The page's own SQL
  leaves aliases unquoted too, and says why.

**Product behaviour the pages must state honestly (seen twice, 3 Sep and 8 Sep):** on a
four-part prompt Kai answers "I'll tackle this in stages", fetches the component schema, and
stops after the first stage until told to continue. The staged version needed no nudge at all.
The `ask/` paragraph on "the same request as one prompt" says so instead of promising a one-shot.

**The output-mapping trap (plan-mode run, 2026-09-08, job 102863448):** Kai's second
transformation quoted its aliases in lower case (`AS "store_name"`) while writing into the
`staffing_outlook` table the first run had already created with upper-case columns. The job
failed in 26 s with

> Failed to process output mapping: Failed to load table
> "out.c-Boolabean-staffing-outlook.staffing_outlook": Some columns are missing in the csv
> file. Missing columns: STORE_NAME, CITY, … Expected columns: STORE_NAME, CITY, …

The mechanism is not "Snowflake wants upper case" (Kai's reading) but that an **existing Storage
table's column names must match exactly, case included**, and Snowflake upper-cases unquoted
identifiers. The reader hits this the first time they edit the SQL and re-run: a change in
quoting is enough. Kai diagnosed and fixed it unprompted (upper-cased the ten aliases). This is
the failure mode `transform/` and `check/` carry; the fix is one line — quote consistently or
not at all — and the message is quoted verbatim so it can be searched.

**Plan mode, measured (staged run with plan mode on, 2026-09-08):** Kai writes a plan file,
shows "Ready for approval", and after that approval asks for every change exactly as before —
the load stage took 8 approvals to the control run's 7. Plan mode is a review gate, not a way to
approve once. `PathIntro.astro` and `index.mdx` said the opposite; both corrected the same day. A
second thing seen only in plan mode: Kai handed control back while the load job was still running
("Checking status every 2 seconds…" → "What's next?"), so a reader may need to ask for the row
counts — the pages should not promise the report arrives unprompted. Only the **first** prompt of
the chat got a written plan; the forecast, transform and ask prompts ran with the ordinary
per-change approvals (3, 3, 0). The second plan-mode run ended at 23.7 min with the ask stage
timed out, for a reason that is mine: Kai's "run the transformation again" card is textually
identical to the first run's card and the runner skipped it as already approved, so the
approval expired on Kai's side ("The re-run approval timed out, so I've paused"). Runner fixed;
the third plan-mode run is the clean figure: **14.3 min, 15 approvals (8 + 3 + 4 + 0), no
nudge**, all four stages done — against the control run's 14.4 min and 12. The output-mapping
trap fired again (quoted lower-case aliases into the existing upper-case table), Kai fixed and
re-ran it unprompted, and the answer came out identical: 42 rows, Brno on Tuesday at 84.4 per
person. Two of two plan-mode runs hit the trap; the control run, which wrote the table first, did
not — so the page shows the failure as what happens on a *second* run, which is when a reader
meets it.

**Measurement notes for table A of the plan:** the chat shows no "Used monthly budget" indicator
in project 264 any more, so turns consumed could not be logged; approvals were counted only when
the click removed an enabled button in a card not seen before (the previous runner clicked one
resolved card 172 times, because approval cards keep their buttons in the chat history).

---

## 2026-09-09 — The hub absorbs "Get a project"

**Decision:** `getting-started/project/` is no longer a page. Its content is the **Get a project**
section of the hub, and the old URL redirects there.

**Why:** it was the only step without a Kai path, it took five minutes, and every reader of the hub
needs it before step one anyway — so the hub kept sending people away and back. Michal's ask was
that the first screen shows what you get; the steps list now starts with data, not with sign-up.
The wave-one plan already called for this merge; the Boolabean rewrite was the natural moment,
because the hub had to be rewritten top to bottom regardless.

**What stayed and where:** everything — CONSERVATION-REPORT.md lists the mapping block by block,
including both `VERIFY(owner)` comments. Nothing on the page was a fact only the project page
carried. Four inbound links repointed (`docs/index.md`, `pay-as-you-go/`, the shared `Prereqs`
partial, the nav); `src/sidebar.mjs` regenerated and lost one line.

**Cost:** the hub is longer (about 230 lines against 158), and its first screen is text until the
phase-2 clip lands.

---

## 2026-09-09 — The forecast is a second configuration, and by hand it is JSON

**Decision:** `load/` builds two HTTP configurations: `Boolabean sales` with five rows for the
static files, and `Boolabean forecast` with one row for the open-meteo URL. The Kai tab is two
prompts, the click-through tab finishes the forecast row in the **Code Editor**.

**Why two:** the forecast lives on another host, so it cannot share the base URL, and the flow on
page 5 wants to refresh it every morning while the history stays put. Kai split it the same way
unprompted in all three runs.

**Why JSON:** the visual row form has no field for skipping the seven metadata lines and the blank
line before open-meteo's header. Its **Header & Primary Key** section offers *Read the header from
the file(s) header*, *Set Header* and a primary key, nothing about leading lines (form read live
in project 264, 2026-09-09). The skip needs the `keboola.processor-skip-lines` processor, and a row
carrying it opens in the code editor only: the **Visual Editor** button is disabled with the
tooltip "Can't close the code editor, the configuration is not compatible. Revert your changes to
allow switching back to the visual editor." The page shows the exact `processors` block Kai wrote
and says the disabled button is expected, rather than pretending the form can do it.

**Nine, not eight:** Kai skipped the header too and named the columns in the manifest, so the
columns come out as `temperature_2m_max` instead of the header's `temperature_2m_max (°C)`. The
page teaches that version and names the alternative (8 with *Read the header*) in "If it goes
wrong", with its symptom.

---

## 2026-09-09 — Transform data keeps its title, and its SQL was run in the shape the page shows

**Title:** stays *Transform data*. The plan floated *Combine it with data you don't have* for this
page; dropped, because Jordan asked for exactly *Transform data* on 21 Aug after finding the
previous clever title confusing. A second clever title is not the fix for a confusing one.

**SQL:** the Snowflake block on the page is not Kai's query copied out. Kai built on read-only
input with fully qualified table names, which is not what a reader with an input mapping types. The
page's block uses the mapped names (`sales`, `weather_daily`, `staffing`, `stores`, `forecast`),
quoted identifiers and readable band labels, and it was run in that exact form through a temporary
transformation in project 264 with that exact input mapping (job 103114885, 61 s, then deleted
along with its bucket): 42 rows, 42 distinct (store, date), 0 empty cells, 4 short-handed, top row
Brno / Tue / 84.4, identical to Kai's output and to the offline reference. The BigQuery block is a
translation and carries a `VERIFY(owner)`; MISSING.md lists the run.

**Case convention:** the page quotes its output aliases, so the table gets lower-case columns. The
Kai runs did the opposite (unquoted → upper case), which is how the output-mapping trap fired on
8 September. The page names the trap by its exact error text in "If it goes wrong" and says it
happens in both directions: Kai first, then hand-written, or the reverse.

**Structural checks instead of numbers:** the check section asks for 42 rows, no repeated (café,
date), and a *few* flagged rows, with "two to eight is usual, zero in a wet week is right" in place
of a count. The day-of-writing values live in a comment and here, not in the reader's text.

---

## 2026-09-09 — The Sheets side trip sends staffing_outlook after all

**Decision:** `write/` is re-themed in text to `staffing_outlook`; its captures and clip are not
reshot in this PR.

**Why the text changes:** plan decision 5 said to leave the side trips with "their own examples",
because reshooting the Google flow needs Nikita's OAuth. The example on this page was the table the
main path used to build, `out.c-octopus-atlas.octopus_atlas`, which no reader of the new guide
will have. Keeping it would have made the page a dead end at step 8. Changing names in text costs
nothing and needs no authorization, so the names change: configuration `Boolabean outlook to
Sheets`, spreadsheet `Boolabean staffing outlook`, sheet `staffing_outlook`, 42 rows.

**Why the media does not:** the Keboola-side stills and the clip show the previous configuration
and would need a live Google authorization to redo, so they stay as UI locators with a MISSING.md
entry, and the clip comes off the page rather than showing the wrong thing. The Google consent
captures are Google's screens and are unaffected.

---

## 2026-09-09 — The flow has three phases, and Kai set its schedule

**Decision:** `automate/` teaches a three-phase flow: the two HTTP configurations in parallel, then
the transformation, then the data app redeploy (with the Sheets destination alongside it for
readers who took that side trip). Schedule 06:00 Europe/Prague, before the first café opens.

**Observed:** Kai built exactly that from the prompt on the page (flow `01m23dcqs9j2gw0q9z8y25j9v2`,
three approvals: create, update, run), named the phases itself ("Extract source data", "Build
staffing outlook", "Redeploy data app"), and created a real Scheduler configuration
(`0 6 * * *`, Europe/Prague, enabled). That closes the VERIFY on whether Kai can set a schedule:
it can, when asked. Notifications were not asked of it and the page keeps them manual.

**First run:** phase 1 success in 121 s (the sales configuration fans out into a job per row),
phase 2 success in 41 s, phase 3 error after 282 s: the data app deploy failed with "Internal
Server Error occurred." The run is kept as the worked example on `check/`: a red run whose earlier
phases did their work. What the failure means for the app page is recorded separately once the
retry is in.

**Screenshots:** all nine automate captures and the All Runs capture show the previous flow;
MISSING.md carries the reshoot.

---

## 2026-09-09 — The app is a six-by-seven grid, built live to a running draft; production is flagged

**Decision (plan decision 4):** the app shows the answer directly: a grid, cafés down and forecast
days across, one number per cell, red where `short_handed` is true, one caption with the count. No
map, no filters. A map of six cafés would be a picture of the Czech Republic with six dots; the
question is about days, not places.

**Observed in the builder (project 264, 2026-09-09, 5 min 44 s):** prompt → one approval → Kai
creates the production configuration, then a draft on its own branch, boots a Python/JS dev
container, writes the code, opens a live preview ("This is a private draft that updates live as Kai
builds"). Buttons: Preview, Code, Publish to production. The page teaches exactly that sequence,
including the sentence about saying what *not* to build.

**Not observed, and flagged:** an Active production app. "Publish to production" produced no
dialog, no configuration version and no job, twice; the production app read "Not Deployed" and
two deploys (the flow's phase 3 and a direct one) failed after about 4.5 minutes with "Internal
Server Error occurred." and nothing in Terminal Logs. The page therefore says publishing and
starting are two steps, tells the reader what a failed deploy looks like and what to send Support,
and never promises the grid is up. Exception IDs are in the page comment and in MISSING.md for a
bug report. The daily flow in 264 will keep failing at phase 3 until this is resolved; leaving it
is deliberate, because a red phase next to green ones is the example `check/` uses.

**Media:** the map clip and its stills are gone; phase 2 records the grid from the draft preview,
which needs no password.

---

## 2026-09-09 — Fact-check of the rewritten pages: two real errors, corrected

The fact-checker pass (CLAUDE.md standing authorization) over the nine rewritten pages found about
45 claims confirmed, two wrong, and a handful of drifts. All fixed the same day; recorded here
because both errors were mine and both would have misled a reader with a correct table.

**Wrong, and load-bearing:** `check/` and `transform/` said an empty `expected_units` happens on a
*cold, wet* forecast day and that a filled value on such a day would mean the bands were drawn
wrong. Computed from `weather_daily.csv` with the page's own `CASE`: every café has cold, wet
history (2–13 days); five of six have **no cold, dry** day at all. The band with no history is cold
and dry. Both pages now say so, and `check/` no longer turns a correct table into a failure signal.

**Wrong, inherited from the octopus design:** "more than 42 rows means the `BETWEEN` trap". That
was true when bands were a lookup table joined by range. With `CASE` bands (first match wins),
`GROUP BY` per (café, band) and equality joins, nothing in the query can multiply rows; the output
is bounded by the 42 forecast rows however the thresholds are written. Where a boundary day lands
still matters (nine summer days sit exactly on a temperature threshold, twelve exactly on 0.5 mm),
and the two `CASE`s must match, but the symptom is an empty average, not a 43rd row. Both pages now
name the real causes of a count over 42: duplicated input rows (incremental load left on, a café
listed twice).

**Drifts corrected:** the hub's step list said "one sentence … one button" and "the schedule is two
clicks", both predating the 09-09 observations; the hub's opening roster now matches the Brno café
(2, 2, then 3); `check/` said six tables are joined (five are); the auto-sleep figure was this
app's setting, not a default; the automate prompt names an app the reader was never told to name
(now: "use your app's own name"); `load/` no longer asserts one job for a direct run; three Open
rows pointed at the deleted project page. New `VERIFY(owner)`: whether Guided Mode's auto-filled
destination keeps the capital B of `out.c-Boolabean-staffing-outlook`; the time-critical Kai
allowance sentence on the hub.

---

## 2026-09-09 — Guide test: followable by a human and by an agent, no blockers

The guide-tester pass (cold read of all nine pages plus read-only label checks in project 264
against the objects the pages describe) found no blocker and three things a reader would have had
to guess; fixed the same day.

- **Column names.** The transform prompt described the ten output columns in words; the later
  pages type them exactly. The prompt now lists them. Kai's own build had produced those names, in
  upper case because it did not quote its aliases, so the check now says upper case is the same
  names. Not re-run in the new wording (noted on the page).
- **Which SQL dialect.** How to find out was inside the click-through tab only, while the Kai
  prompt opened with "Snowflake" and the Free Plan defaults to BigQuery. The "look in the New
  Transformation dialog" paragraph now sits above the tabs.
- **Two diagnoses for one symptom** (more than 42 rows) between `transform/` and `check/`: already
  aligned by the fact-check commit; the tester read the page mid-edit.

Also from the live read: after several failed starts the platform **disables** a data app (banner
"failed to start automatically multiple times", button **Start App**), so the scheduled flow's app
phase keeps failing until someone starts it by hand — now stated on `app/` and `check/`. The
phase-scoped Add Task menu has exactly Component / Notification / Variable; the empty-canvas menu
stays unverified, and the automate page now says "in some projects" for Build with Kai. The
forecast prompt asks for nine skipped lines and the four column names directly, which is what Kai
did on its own in the live run. Everything else the tester checked live matched the pages: nav,
Storage tabs, the HTTP card and row form, the transformation sections, the flow's tabs and phase
names, the schedule's timezone, the Notifications cards, the Jobs fan-out (six lines for the
five-file configuration), the data app's settings, all links and the Next order.

---

## 2026-09-14 — Time budgets come from word counts plus measured Kai wall time

**Decision:** the hub says an hour and a half and carries `minutes="80"`; the steps carry 15 / 15 /
5 / 15 / 15 / 5. The plan's target of a 45-minute full pass is not met and is not claimed.

**Method (in place of a literal stopwatch):** words per page with comments and code removed, one
tab's worth (about 60%) at 200 words per minute, plus the wall time Kai took in the 8–9 September
runs: load 9 min (two prompts, jobs included), transform 4, ask 3 for two questions, app 6 to a
running draft plus a deploy, flow 3 to build plus an 8-minute first run. Reading everything on every
page is nearer 80 minutes; the building alone, Kai path, was about 30. Both numbers are on the hub,
so the reader knows which one they are signing up for. Re-measure with a real reader when one is
available; the ±20% tolerance in the plan applies to that measurement, not to this estimate.

---

## 2026-09-14 — Phase 2: media shot from the live pipeline, nothing staged

**What was shot, and how:** 26 stills and two clips, all from project 264 as it stands after five
scheduled mornings, with a logged-in Playwright session, as element captures without the top bar
(no names, no project title). Load 01–08 from the real `Boolabean sales` and `Boolabean forecast`
configurations; the base-URL capture (03) shows `https://help.keboola.com/getting-started/boolabean/`
because the live configuration was switched to that value for one screenshot and switched back
in the same script (both PUTs logged, restoration verified). Transform 00–10 from a temporary
mapped copy of the transformation, created and deleted within a minute; 00 cropped to its header
so a colleague's name in the list stays out. Automate 01 and 05–09 and check 09 from the live
flow: the All Runs capture shows the five red scheduled runs, which is the example `check/`
describes. The app grid is the draft preview's iframe, captured after opening the draft in the
builder (the draft container booted itself); production still does not deploy.

**Clips:** the hero, three acts on the compositor scene (rows verbatim from the CSVs, the question
as poster, the grid as background), 32 s, 0.9 MB. The ask clip, a 104-second live recording of the
Kai panel compressed to 44 s with the 50-second thinking stretch at 6x; the pointer lands on Kai's
conclusion. Kai's answer on the recording day (14 Sept, forecast 14–20 Sept): only Brno flagged,
Monday 72.3 and Tuesday 85.2 per person on a two-person roster, "warm and completely dry".

**Not shot, and why:** the Sheets captures and clip (need Nikita's Google authorization); the flow
builder's component picker and second-phase step (would mean starting a flow-creation flow, which
the read-only capture session did not do; both images removed rather than shown with old names,
the Add Task menu capture kept because it is theme-neutral). The load page's click-through steps now
use the base-URL-with-folder convention Kai built, so the captures and the text agree.

**Things learned the hard way:** `/private/tmp` scratch files older than three days are purged by
macOS, which took the reference SQL and the run logs with it — the SQL was restored from the page
itself. The fact-check fix from 09-09 (cold, dry is the band with no history) is visible in the
grid: the dashes sit on cold, dry days.

---

## 2026-09-14 — Three tabs: Prompt · UI · CLI / API, and the hub goes dry

**Decision:** task pages offer the same task three ways, in this order, with these exact labels:
**Prompt** (paste into Kai) · **UI** (click by click) · **CLI / API** (`kbagent`, with the raw
request beside it where there is no command). Starlight stores the reader's choice under the
label *text*, so the three strings are a contract; it is written into `PathIntro.astro`'s header,
and a page that spells one differently silently drops out of the sync.

**Why:** Michal asked it directly on 2 September — "Mám tam nějaký prompt? Jak to zpracuje to
CLI?" — and warned that without it "neztratila se nám podstata" ("kočičky"). Jordan had agreed
the same mechanism on 5 August ("combined UI + API format"). Two independent asks, one answer.
The third tab also ends the awkwardness of a guide that mentions the CLI only as a link.

**Rollout:** one page per commit. `PathIntro` takes `tabs={3}`; the default stays the old two-tab
wording until the last page is converted, so an unconverted page never advertises a tab it does
not have. `load/` is first and is the stop point: the pattern goes to Michal before the rest
follow.

**Verified before shipping (load/, 2026-09-14, project 264, kbagent v0.93.1):** `config new
--push --no-files` created a throwaway configuration; `config row-create` added rows with exactly
the processors block on the page; `job run --wait` finished green (job 104214515); `storage
tables --bucket-id` and `storage table-detail` read back 6 and 18 rows with their columns; the
curl POST created a second throwaway configuration through the Storage API. Both configurations
trashed and the bucket dropped the same minute. `npm run check:cli` passes against the repo's
v0.76.1 reference, so every flag exists in both versions.

---

## 2026-09-14 — The hub is dry again, and Get a project is a page again

**Decision:** the hub opens with the question, the clip and a table of the seven steps (what each
produces, how long it takes). The café story is gone; the sample world is described once, on
`load/`. **Get a project** returns to `/getting-started/project/`.

**Why:** Michal, 2 September: "dataset je jen helping vehicle… není to nosné téma… já bych v tom
byl sušší", and "já bych to už nedělal moc složitější". The merge of 9 September had made the hub
230 lines that opened with two paragraphs of narrative. Get a project is also the only step with
no prompt and no command, so as a hub section it broke the rule the rest of the arc now follows.
Its URL had been a redirect to the hub anchor for five days; it is a real page again, and the nav,
the shared `Prereqs` link and the two inbound links point back at it.

**Also taken from Stripe** (Nikita, 14 September): a "Where to start instead" table at the foot of
the hub — this guide, the kbagent CLI, the MCP server, and building an app with Kai. It is where
Michal's "MCP a CLI jsou jen drivery a vehikly" lands without them becoming topics inside the
guide. Not taken: the three-column layout with code following the prose (a custom Starlight layout
override; the cheap substitute is the `.gs-pair` grid for a capture beside its request), and the
by-business-type use-case grid (one guide, one dataset).

---

## 2026-09-14 — Authoring comments no longer ship to agents

**Decision:** `page-markdown.mjs` strips `{/* … */}` and `<!-- … -->` from the `/<slug>/index.md`
twins instead of publishing them, and renders `<Prereqs>` as text.

**Why:** the twins are public and machine-read. They were carrying demo-project configuration IDs,
job and exception IDs, capture notes and VERIFY flags — internal by PRDCT-616. Rationale that
outlives an edit belongs here, in a file that is versioned and not served. The `<Prereqs>` half is
the opposite failure: the component was dropped with the others, so the twin told an agent to load
data without mentioning that a project has to exist first. The wording now comes from
`prereqs.mjs`, which both the component and the integration import, so they cannot drift.

---

## 2026-09-15 — The three tabs are on every task page, and the CLI found the app bug

**Done:** `load/`, `transform/`, `ask/`, `app/` and `automate/` each carry **Prompt · UI ·
CLI / API**; `check/` gets a read-only terminal section instead of tabs, because it is about
reading state, not a task with three ways to do it; `write/` keeps two tabs (renamed to Prompt and
UI so the reader's saved choice stays coherent) and says why it has no third: a browser consent
screen cannot be driven from a terminal.

**Every command was run against project 264 before it shipped** (kbagent v0.93.1, alias
`docs-demo`), and everything it created was deleted the same minute:

| page | verified | result |
|---|---|---|
| load | `config new --push --no-files`, `config row-create`, `job run --wait`, `storage tables`, `storage table-detail`, plus the curl POST | job 104214515 green, 6 and 18 rows |
| transform | `transformation create --sql-file --created-table`, `transformation edit --storage @file`, `job run --wait`, `storage table-detail` | job 104346054 green, 42 rows |
| ask | `kai ask -m "…"` | answered in 22 s with the same café, day and flag count as the chat |
| app | `data-app list`, `data-app deploy --wait`, `data-app runs` | deploy failed — see below |
| automate | `flow validate`, `flow new --file`, `flow schedule --cron --timezone --enabled` | flow and schedule created, both deleted |

**What the CLI taught us that the UI would not.** `transformation create` leaves the input mapping
empty, so the page needs a second command (`transformation edit --storage`) to add the five inputs
— the UI tab's mapping section has no single-command equivalent, and pretending otherwise would
have shipped a recipe that fails on the first run. And `data-app runs` prints the container's
startup log, which finally explains the deploy failures the UI reported only as "Internal Server
Error occurred": the 14 Sept run cloned the repo and died on `App must have keboola-config/nginx/
directory`, and both 15 Sept runs died earlier, on `Authentication failed …/app-74021219.git`
("Credentials are incorrect or have expired"). So publishing does carry the code; production fails
because the app Kai generated has no nginx config outside dev mode, and because the managed Git
credentials have since expired. Both belong in a bug report to the Apps team, with the run IDs.

**One trap recorded for whoever does this next:** `flow schedule-remove` prompts for confirmation,
so aborting it leaves a scheduler configuration pointing at a flow you then delete. Delete the
scheduler explicitly (`config delete --component-id keboola.scheduler`).

---

## 2026-09-15 — What the two review passes caught on the three-tab conversion

Both subagents (CLAUDE.md standing authorization) ran against the converted pages. Between them
they found three blockers, and every one was in the new CLI path or in what an agent reads.

**The markdown twin read as three jobs, not three choices.** `PathIntro` renders in HTML but was
dropped from `/<slug>/index.md`, so an agent reading the twin saw "ask Kai to build it", "click
through and build it", "build it from a terminal" as consecutive instructions — three HTTP
configurations on one page if executed literally. The intro's wording now lives in
`pathintro.mjs`, imported by both the component and the integration, and leads with "they are
alternatives, not steps". The same pass fixed the `<Prereqs>` slot, which was shipping raw JSX
(`The <code>staffing_outlook</code> table … from{' '}<a href="…">`) into the twin.

**The CLI journey had two dead ends.** The forecast row's JSON was named as a file and never
shown, and the flow's YAML needed a data-app *configuration* ID while the app page only ever
produced the numeric app ID. Both are now in the pages, along with where every other `<config-id>`
comes from.

**`<your-stack>` and `$KBC_TOKEN` were never defined**, in a copy-paste command. The load page's
CLI tab now says what they are and where to read them, and its prerequisites say plainly that this
tab — unlike the other two — needs something installed.

**The CLI tab was Snowflake-only on a guide that tells Free Plan readers they are on BigQuery.**
`--component-id` is optional and defaults to the project's backend, so the commands now omit it.

**`manual={false}` was hiding the third tab.** On `app/` it short-circuited the intro, so the page
with three tabs told the reader there were two. It is an additional paragraph now, not a branch.

**Two honesty fixes, both mine.** `app/` promised the status "turns Active, Open App appears" on a
page whose own failure list says production has never come up here — it now says so where the
reader meets it. And the same page compared "two red cells" in a capture with "four" in the check,
sixteen lines apart, as if one week; the count is described as moving with the forecast.

Everything else the passes raised was confirmed: 41 factual claims on the CLI tabs check out
against the command reference, the Storage API pages and the CSVs, and the three tab labels are
byte-identical across all six pages.

---

## 2026-09-15 — The side trips get the same tabs, and the three pages that do not

The main path carries three tabs; the pages hanging off it still carried the shape the tabs
replaced, a `:::tip[Do it with Kai]` box above a list of clicks. Two patterns for one thing in one
section is the thing Nikita called mixed up, so the side trips now use the tabs too — and the
pages where a path genuinely does not exist say so instead of pretending.

**Three tabs, walked live in 264 and cleaned up the same minute.** `load/database/` gets the full
set: the Kai box became the **Prompt** tab with its "never paste a password into the chat" warning
intact, and the **CLI / API** tab is a configuration holding the sample credentials, one row per
table, and a run — created, run, counted and deleted on 2026-09-15 (job 104350143; OPPORTUNITY
639, ACCOUNT 275, USER 28, which is where the check numbers come from). `transform/workspace/`
gets them too, and its CLI tab is the strongest of the three: `workspace create`, `load`, `query`,
`detail`, `delete`, all run against the control table.

Two things that walk taught the page, neither of them guessable. `workspace create` prints a
private key once and says it cannot be retrieved later, so the page says it in a caution rather
than letting a reader discover it after closing the terminal. And a query against a freshly
loaded table fails — `Object 'STAFFING_OUTLOOK' does not exist or not authorized` — because
Storage spells table names in lower case while Snowflake folds an unquoted name to upper case. The
same query with the name quoted answers 42. It is the trap `ask/` already documents for columns,
one level up.

**Two tabs on `load/googlesheets/`**, matching `write/` and for the same reason: the consent screen
and the Drive picker are dialogs in the reader's own Google account, so a terminal cannot start the
task. Both pages now say that in the same words, and both say what `kbagent` *can* drive once the
authorization exists.

**No tabs on the branch tutorial, and the reason is a product fact.** `kbagent branch merge` does
not merge — it prints the URL of the merge screen. The diff and the partial-merge checkboxes are
where the decision gets made, so four of those six pages could not have an honest CLI tab. Instead
the branch hub gained one short section saying what the CLI does (create, use, list, reset,
delete, and `--branch` on read-only commands) and what it hands back to the browser.

**No tabs on `ad-hoc/`.** Most of that page is the Google Cloud console — service accounts, IAM
roles, a storage bucket — which is nobody's CLI and nobody's Kai. It needs a rewrite, not a tab,
and it still calls workspaces sandboxes.

**`project/`, `check/` and `going-further/` stay as they are.** Getting a project is a signup form,
`check/` already has its terminal section, and `going-further/` routes rather than does.

VERIFY(owner): `load/googlesheets/` still loads `level.csv`, the pre-Boolabean sample, so the
section reads as two datasets. Swapping it means reshooting steps 5-12 against a live Google
authorization, which needs Nikita's own account — the same blocker as the `write/` captures.

---

## 2026-09-15 — What the reviews caught on the side trips

Both passes ran again on the three converted pages. They agreed on the blocker, and each found
things the other did not.

**The one worked query in the workspace tab selected columns that do not exist.** It asked for
`cafe_name` and `forecast_date`; the table has `STORE_NAME` and `DATE`. My live run had used
`SELECT COUNT(*)`, which names no columns, so the example was the one thing on the page nobody had
executed. Fixed and re-run against the control table.

Chasing it turned the casing note into something better than it was. I had written "Storage spells
names in lower case, so quote them", which is half a rule. Measured, all four ways: the table is
stored lower case and needs quotes, the columns are stored upper case and break when quoted lower
case. The table was named by the output mapping, which keeps what you write; the columns came out
of SQL that did not quote its aliases, so the backend upper-cased them. The page now carries the
four rows and the reason, and the troubleshooting bullet covers both directions instead of sending
a reader round in a circle.

**Three product facts were wrong in the same tab.** `--read-only` defaults to *on*, the opposite
of the dialog's unchecked box. The **Connect** button opens Snowflake's own Snowsight, not a
Keboola console — and direct access needs a dedicated backend, which the free project this guide
starts from does not have, so that step now routes to the SQL Editor. And the workspace picker's
labels are "Snowflake SQL Workspace" and "Google BigQuery Workspace".

**Two tabs did not stand alone.** `workspace create` prints the ID every later command needs, and
the page never said to keep it. The database page kept its credentials inside the UI tab while the
Prompt tab pointed at them, which contradicts "pick one tab and carry on" — they are their own
section now, above the tabs, where all three paths can reach them.

**Two sections spoke past the reader who chose Prompt.** "Check it worked" on the workspace page
assumed a workspace, which the Prompt reader deliberately never made; it now says so first, the
way `write/` does. The Sheets handoff told the reader to do "steps 5 to 9, both inside Google" —
but two of those five are Keboola screens, and a reader who let Kai build the configuration was
never told how to get to it. Both fixed.

**Dropped the "reading this with an agent?" line.** The plan asked for it, but it landed on three
side trips and no main-path page, and every page already has *View as Markdown* in its title bar.
Either it goes on all twelve or on none; it is off for now.

Everything else held: 118 factual claims confirmed, including all six live runs as they are stated,
the three sample-database row counts against the repo's own CSVs, and the tab-label contract across
all nine tabbed pages.

Worth knowing separately: `_data/cli/command-reference.md` is generated from kbagent v0.76.1 while
the installed CLI is v0.93.2, so the gate runs seventeen minor versions behind. It cost us a true
sentence this week — `kbagent config restore` is real, and the gate rejected it.

---

## 2026-09-15 — The hero clip, taken apart frame by frame

Nikita asked for two things on the clip: the highlighted moments look cut off, and the blue marker
is redundant when something is already lit. A review pass over all 31 stills confirmed both and
found more.

**Every cut-out was placed as if its coordinates were a corner.** `spotAt` reads them as a centre
and subtracts half the width and height, so all three tour stops sat half a row above their target.
The Brno stop, the payoff of the whole clip, lit the café above it and left the cell it was
captioning dimmed. The dash stop cut a line of text in half, bright above and dim below, which
reads as a rendering fault. The stops now carry centres measured against the grid's own cell edges,
and act 1 lights the whole file card rather than a token inside a line of monospace, which is what
used to slice the characters either side of `S02`.

**Three blue markers pointed at one thing.** The cut-out had a blue outline, a pulsing blue ring sat
inside it, and the caption chip carried a blue dot. On the dash stop the ring physically covered the
dash the caption exists to explain. All three are gone. The lit rectangle and the sentence do the
pointing.

**The caption parked on the payoff row in every beat.** It was pinned to the bottom, and the grid's
last row is its bottom row, so the chip covered Brno in all three acts including the final frame. It
now sits in whichever half the spotlight is not in.

**The poster was two layers of text on top of each other.** Act 2 drew the question straight onto
the live grid over a white wash rather than the dark scrim the other two acts use, so the question
crossed the numbers behind it. That frame is the page's `poster`, which made it the first thing a
reader sees. The question has its own panel now, over the same scrim as everything else.

**The first frame gave away the ending.** Frame 0 was the finished grid, cross-dissolving into act
1. It opens on the scrim now.

**Four files on screen, five in every caption.** `products.csv` was missing. It is there now, with
its real columns and its real first row: I had typed a plausible one from memory, and checking it
against the file caught that both the column name and the values were invented. All five rows in
act 1 are verbatim.

**Not fixed, and it needs the owner.** The app capture is 966x744 and the grid's last row needs 765,
so Brno is cut off by its own screenshot in every frame. The clip is cropped to 724 so the cut falls
between two lines instead of through them, which reads as a crop rather than a fault, but the row is
still short. A taller capture means unlocking the data app, and its password is not mine to handle.

---

## 2026-09-16 — The broken-link PR already exists, so this is two links instead

The link check has been reporting one blocker since the rebuild started, `/extend/component/running/`
pointing at `/integrate/jobs/`. Chasing it properly turned up 29 broken internal links across the
site, all landing on three dev-docs paths that were never migrated: `/integrate/jobs/`,
`/overview/encryption/` and `/overview/api/`.

The developers-docs retirement branch already decides where each one belongs, in its
`redirect_to` frontmatter: jobs to `/management/jobs/api/`, encryption to
`/extend/common-interface/encryption/`, the API overview to `/overview/apis/`. None of those three
pages exists on help yet, which is why every inbound link is broken.

**PR #1120 creates all three, and repoints the links.** Its diff drops 50 lines carrying the old
paths and adds 67 with the new ones, and it touches every single page that carries one of the 29.
A second pull request would have collided with it on every file and fixed nothing that is not
already fixed there. #1094 then flips the remaining dev-domain absolute links once #1120 lands;
that PR states the merge order itself.

What was left that nobody else owns: two links that resolve only through a redirect, both created by
this branch retiring the `/tutorial/` slugs. They now point at the real page.

| was | now |
|---|---|
| `/tutorial/onboarding/architecture-guide/` in `catalog/multi-project/` | `/overview/onboarding/architecture-guide/` |
| `/extractors/ip-addresses/` in the generic extractor's SSH proxy page | `/components/ip-addresses/` |

A third one, in `storage/api/tde-exporter/`, is left alone on purpose: #1120 edits that file, and
two branches rewriting the same line is how a merge conflict gets made for no gain.

---

## Open — carried as VERIFY(owner) flags in the pages

These are product facts an agent must not guess. Two of the seven below were
closed on 2026-09-02 by checking the product rather than by guessing; the rest
still block rebuild work.

| Question | Where flagged | Blocks |
|---|---|---|
| Can Kai create a project? | `index.mdx` (Get a project) | page 1's Kai coverage |
| Does the Free Plan include data apps? | `app/index.mdx` | whether the app step needs "skippable" framing |
| ~~Does a "plan mode" exist, and what is it called?~~ | closed 2026-09-02 | **Yes.** The chat composer has a button labelled "Enable plan mode", next to "Disable follow mode". Kai drafts a plan and you approve once. Now recommended in the section ahead of "Always allow". Still owed: a description on the `kai/` pages, which document neither mode. |
| ~~Can Kai set a schedule and notifications?~~ | half closed 2026-09-09 | **Schedule: yes.** Asked for "every day at 06:00 Europe/Prague", Kai created a Scheduler configuration (`0 6 * * *`, Europe/Prague, enabled) for the flow it had just built. **Notifications: not tested**; the page keeps them manual. |
| ~~Has the consolidated one-prompt block ever run end to end?~~ | closed 2026-09-02 | **Yes** — run live in project 264: 14 minutes, 11 approvals, 10,000 rows in and out. The block now lives on `ask/`. Transcript in PR #1110. |
| Is the monthly Kai allowance per project or per organization? | `index.mdx` (Get a project) | the pricing guardrail wording |
| Is RStudio still an offered workspace type? | `ad-hoc/index.md` | the ad-hoc page's fate |
| Does the Kai **Add Task** menu offer three items or four (is **Build with Kai** in it)? | `automate/index.mdx` | the Kai tab's first instruction. Live check 2026-09-02 confirmed **Modify with Kai** in the flow header; the menu itself did not open to automation |
| Does `/kai/use-cases/#complex-workflows` cover assembling *existing* configurations into a flow? | `automate/index.mdx` | whether that citation stands — the page documents building pipelines from scratch |
| ~~Does Kai really build transformations on read-only input, and does that need bucket-ID-qualified table names?~~ | closed 2026-09-08 | **Yes, and yes.** The live transformation in project 264 has an empty input mapping and reads `"KBC_EUW3_264"."in.c-keboola-ex-http-01m20b1fwj3px5x6bzzckeb81a"."sales"` by full name — see the 2026-09-08 entry above. |
| Can Kai traverse every child job of a flow run, or only read one job log? | `check/index.mdx` | one sentence; the prompt is safe either way |
| Do flow jobs themselves consume credits? | `check/index.mdx` | removed from the page until confirmed — no row for it in `management/project/limits/` |
| **Time-critical:** `kai/pricing.md` says that from **15 September 2026** Kai moves to PPU credits and the message counter is "replaced" — but `kai/getting-started.md` still states 150 turns/month (50 on PAYG), and the section inherits that number | `index.mdx` (Get a project) | the allowance sentence, in 12 days |
| On a BigQuery project — the Free Plan default — is there a browser SQL path at all? | `transform/workspace.md` | the Kai-free fallback, and the hub's "nothing needs installing" promise |
