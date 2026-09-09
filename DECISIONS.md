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

## Open — carried as VERIFY(owner) flags in the pages

These are product facts an agent must not guess. Two of the seven below were
closed on 2026-09-02 by checking the product rather than by guessing; the rest
still block rebuild work.

| Question | Where flagged | Blocks |
|---|---|---|
| Can Kai create a project? | `project/index.mdx` | page 1's Kai coverage |
| Does the Free Plan include data apps? | `app/index.mdx` | whether the app step needs "skippable" framing |
| ~~Does a "plan mode" exist, and what is it called?~~ | closed 2026-09-02 | **Yes.** The chat composer has a button labelled "Enable plan mode", next to "Disable follow mode". Kai drafts a plan and you approve once. Now recommended in the section ahead of "Always allow". Still owed: a description on the `kai/` pages, which document neither mode. |
| ~~Can Kai set a schedule and notifications?~~ | half closed 2026-09-09 | **Schedule: yes.** Asked for "every day at 06:00 Europe/Prague", Kai created a Scheduler configuration (`0 6 * * *`, Europe/Prague, enabled) for the flow it had just built. **Notifications: not tested**; the page keeps them manual. |
| ~~Has the consolidated one-prompt block ever run end to end?~~ | closed 2026-09-02 | **Yes** — run live in project 264: 14 minutes, 11 approvals, 10,000 rows in and out. The block now lives on `ask/`. Transcript in PR #1110. |
| Is the monthly Kai allowance per project or per organization? | `project/index.mdx` | the pricing guardrail wording |
| Is RStudio still an offered workspace type? | `ad-hoc/index.md` | the ad-hoc page's fate |
| Does the Kai **Add Task** menu offer three items or four (is **Build with Kai** in it)? | `automate/index.mdx` | the Kai tab's first instruction. Live check 2026-09-02 confirmed **Modify with Kai** in the flow header; the menu itself did not open to automation |
| Does `/kai/use-cases/#complex-workflows` cover assembling *existing* configurations into a flow? | `automate/index.mdx` | whether that citation stands — the page documents building pipelines from scratch |
| ~~Does Kai really build transformations on read-only input, and does that need bucket-ID-qualified table names?~~ | closed 2026-09-08 | **Yes, and yes.** The live transformation in project 264 has an empty input mapping and reads `"KBC_EUW3_264"."in.c-keboola-ex-http-01m20b1fwj3px5x6bzzckeb81a"."sales"` by full name — see the 2026-09-08 entry above. |
| Can Kai traverse every child job of a flow run, or only read one job log? | `check/index.mdx` | one sentence; the prompt is safe either way |
| Do flow jobs themselves consume credits? | `check/index.mdx` | removed from the page until confirmed — no row for it in `management/project/limits/` |
| **Time-critical:** `kai/pricing.md` says that from **15 September 2026** Kai moves to PPU credits and the message counter is "replaced" — but `kai/getting-started.md` still states 150 turns/month (50 on PAYG), and the section inherits that number | `project/index.mdx` | the allowance sentence, in 12 days |
| On a BigQuery project — the Free Plan default — is there a browser SQL path at all? | `transform/workspace.md` | the Kai-free fallback, and the hub's "nothing needs installing" promise |
