# PRDCT-376 — consolidated human-review queue

Every `TODO(human-review)` marker left inline across the Transformations section
split, grouped for sign-off. The markers remain in-source; this is the index.
(63 markers across 15 files.)

## A. Reference facts to verify against component code (SoT not in this repo)

The component config schemas / READMEs are not in the docs repo and were not
reachable, so these carried-over values could not be verified against code.
Nothing was invented, renamed, or removed — only flagged.

- **Snowflake** (`snowflake-plain/reference.md`): backend sizes + default; 7,200 s
  query timeout; 8,192-char comment segfault; `ABORT_TRANSFORMATION` name/semantics;
  AWS-US timestamp parameter overrides; copy/clone loading types; Free-Plan backend
  availability.
- **BigQuery** (`bigquery/reference.md`, `bigquery/how-to.md`): the "2 hours" query
  timeout vs current GCP quota; `Query timeout` parameter name/units and that default
  `0` = "use BigQuery default"; `ABORT_TRANSFORMATION` semantics.
- **Oracle** (`oracle/index.md`): exact default/behavior of the optional `schema`
  config field (added per instruction; semantics unconfirmed).
- **DuckDB** (`duckdb/reference.md`): default Timeout (1 h); default for "Automatic
  data types"; backend sizes / memory figures / default; Free-Plan availability;
  parameter names `threads` / `max_memory_mb`; list of supported DuckDB versions.
- **Python** (`python-plain/reference.md`): current Python version; 8 GB memory /
  6 h / CPU limits; preinstalled package list; backend sizes / default / plan.
- **R** (`r-plain/reference.md`): R `4.4.1` is current + other selectable versions
  (version bumped 4.0.5 → 4.4.1 per instruction); 16 GB / 6 h / CPU limits;
  preinstalled packages; backend sizes / default / plan.

## B. UI labels / control names to confirm (how-to pages)

In `snowflake-plain/how-to.md`, `bigquery/how-to.md`, `duckdb/how-to.md`,
`python-plain/how-to.md`, `r-plain/how-to.md`, `oracle/index.md`: the literal
navigation/label strings — e.g. **Components → Transformations**, **New
Transformation**, the per-backend type label (e.g. "Snowflake SQL Transformation"),
**New Table Input/Output**, **Create Table** — were written from convention and
need a quick check against the live UI. Also the DuckDB sample CSV's column names.

## C. dbt screenshots — alt text unverified

The images were not viewable while editing, so alt text on **kept** screenshots is
context-derived and prefixed `TODO(human-review: alt unverified)`. Verify each
against the actual image (12 kept):

- `dbt/transformation/transformation.md` (10): configuration overview, database
  connection, project repository, load branches, execution steps, step edit,
  freshness, output mapping, run panel, Discover timeline.
- `dbt/cloud/cloud.md` (2): dbt Cloud Trigger config, dbt Cloud API source connector config.

Plus `dbt/cli/cli.md`: `TODO(human-review: add generated source-file example)` —
the dropped "generated source file" screenshot should be replaced with a short
fenced YAML example (its exact contents weren't reconstructable from the page).

## D. Content correctness

- `transformations/index.md`: the first "Other features" table row was malformed
  (no feature name, an extra cell, rowspan 9 vs 8 real features). It was removed and
  the rowspan corrected to 8. **If it represented a real feature, re-add it with the
  correct name/value.**

## E. Diátaxis mapping note (not a defect)

- **python-plain** and **r-plain** were Block-0-tagged how-to + reference + **tutorial**.
  Because page `type` is constrained to how-to | reference | explanation, the
  tutorial/dev-walkthrough facet was folded into each **how-to** ("Develop and
  debug"). Confirm this is acceptable, or split a dedicated tutorial page later.
- **transformations/index.md** was kept as a single combined landing (not URL-split
  into explanation+reference) to preserve load-bearing anchors such as
  `#writing-scripts` referenced by every backend how-to.
