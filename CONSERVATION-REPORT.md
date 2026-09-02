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
| Project isolation, the three entry routes, the Storage/Jobs locators, the three sign-in failure modes and the Kai orientation prompt | `project/index.mdx` | merged into page 1 — **blocked** on the pre-seeded-project decision, which decides whether pages 1 and 2 merge at all |
| `## Phases and tasks`, notification cards | `automate/index.mdx` | `/flows/` and `/management/notifications/` — **only the parts those pages lack**; the existing notifications page is richer than the arc's table and must not be overwritten |
| `## How a transformation works`, the mapping explanation | `transform/index.mdx` | `/transformations/` |
| `## Sending data out` | `write/index.mdx` | `/components/writers/` |
| Four of the five delivery failure modes | `write/index.mdx` | `/components/writers/storage/google-sheets/`; `check/` keeps the one that is about flow ordering |
| The configuration-rows teaching (one configuration, four rows) | `load/index.mdx` | **at risk** in wave two's data split — the arc is its only teaching site and `automate` depends on it. Needs a destination before the split lands. |

## Deliberate deletions

| Content | Why | Where the information survives |
|---|---|---|
| Eight `db-picture*.png` captures of the Snowflake connector setup | Re-shot the same Add Component → credentials → select-tables flow that `sqldb-1..4` already illustrate on the destination page | `/components/extractors/database/sqldb/#initial-setup` (done, PR #1109) |
| Seven hand-written `**Next:**`/`**Back to:**` pointers | Starlight generates pagination from sidebar order (`pagination: true` in astro.config.mjs), and the hand-written ones had drifted — several pointed at pages that had moved. Verified after removal: transform → "Ask a question and get an answer", app → "Make it run every morning", check → end of section, all generated correctly | sidebar order |
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
