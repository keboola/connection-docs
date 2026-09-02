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

## Pending — wave one, not yet executed

| Content | From | Planned destination |
|---|---|---|
| Project isolation, the three entry routes, Storage/Jobs locators, the three sign-in failure modes, the Kai orientation prompt, and the Kai-free workspace fallback | `getting-started/project/index.md` | merged into page 1 (`getting-started/index.mdx`) |
| `## Ask it the question you started with` | `getting-started/automate/index.mdx` | new page 4, `getting-started/ask/` |
| `## Check it worked`, job topology, All Runs reading | `getting-started/automate/index.mdx` | new page 7, `getting-started/check/` — a verification block stays behind on page 6 |
| The step → effect → UI table | `getting-started/next-steps/index.md` | new page 7, `getting-started/check/` |
| Job-log reading and the row-count sanity check | `getting-started/transform/index.mdx` | new page 7, `getting-started/check/` |
| The one-prompt consolidated block | `getting-started/next-steps/index.md` | new page 4, `getting-started/ask/` — without the "now that you have seen the pieces" framing, which is false on page 4 of 7, and without the flow/app clauses that describe later pages |
| Kai / MCP / kbagent comparison and eight of the nine "pick your next thing" entries | `getting-started/next-steps/index.md` | new `getting-started/going-further/` — minus the "In beta" clause, retired 15 Sep 2026 |
| `## Phases and tasks`, notification cards | `getting-started/automate/index.mdx` | `/flows/` and `/management/notifications/` — **only the parts those pages lack**; the existing notifications page is richer than the arc's table and must not be overwritten |
| `## How a transformation works`, mapping explanation | `getting-started/transform/index.mdx` | `/transformations/` |
| `## Sending data out` | `getting-started/write/index.mdx` | `/components/writers/` |
| Five delivery failure modes | `getting-started/write/index.mdx` | page 7 keeps at most one; the rest go to `/components/writers/storage/google-sheets/` |
| The configuration-rows teaching (one configuration, four rows) | `getting-started/load/index.mdx` | **at risk** in wave two's data split — the arc is its only teaching site and `automate` depends on it. Needs a destination before the split lands. |

| `## Check it worked`, the All Runs reading, job topology, and four of the five flow failure modes | `automate/index.mdx` | new page `getting-started/check/`; a short verification block stays on `automate` so page 6 does not end blind | moved |
| The "everything succeeds but the sheet is unchanged" failure | `automate/index.mdx` | `getting-started/check/`, generalized to any delivery task — **caught in review: my own carve dropped it, and it existed nowhere else** | moved |
| The step → effect → where-it-lives table | `next-steps/index.md` | `getting-started/check/` | moved |
| The row-count sanity check and its two failure directions | `transform/index.mdx` prose | `getting-started/check/`, stated once as "the one number that proves the join" | moved |

| `## Pick your next thing` (eight of nine entries), `## Drive Keboola with an agent`, `## When you get stuck` | `next-steps/index.md` | new `getting-started/going-further/`, which inherits `/getting-started/next-steps/` as a redirect | moved |
| `## What you built` table | `next-steps/index.md` | `getting-started/check/` — it is verification, not routing | moved |
| The ninth entry, "I am rolling this out to a team" | `next-steps/index.md` | the architecture tier — it is the one entry that is not a next step for this guide's reader | moved out of section |
| The kbagent "In beta" clause | `next-steps/index.md` | **dropped** — the beta pill retires 2026-09-15 per Jordan (21 Aug) | dropped |
| The side-trip list, each with a reason to read it | scattered across the arc's "Going further" blocks | `getting-started/going-further/` | merged |

## Deliberate deletions

| Content | Why | Where the information survives |
|---|---|---|
| Eight `db-picture*.png` captures of the Snowflake connector setup | Re-shot the same Add Component → credentials → select-tables flow that `sqldb-1..4` already illustrate on the destination page | `/components/extractors/database/sqldb/#initial-setup` (done, PR #1109) |
| Ten hand-written `**Next:**` pointers | Starlight generates pagination from sidebar order; the hand-written ones had already drifted — six pointed at the wrong page | sidebar order |
| Chapter numbering in titles and bodies ("Step 3 of 7") | The new titles are outcomes; numbering breaks the moment a page moves, and no surveyed vendor uses it | reading order lives in the sidebar |
| `writing1.png` | Orphan — grep-confirmed unreferenced | n/a |

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
