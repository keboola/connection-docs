# PRDCT-376 — consolidated human-review queue

Every `TODO(human-review)` marker left inline across the Transformations section
split, grouped for sign-off. The markers remain in-source; this is the index.

> **Reconciled with PRDCT-354 (Devin "Audit vs code").** Page `type`s were
> aligned to Block 0 (added a `tutorial` type; retyped cli, r-plain
> array-splitter/binary/plots, duckdb/snowflake-migration → tutorial;
> troubleshooting → how-to; flows → explanation). Items below that Block B
> verified against component code are marked **Resolved**; only the genuinely
> unverifiable ones remain open.

## Resolved via PRDCT-354 audit (Block B — verified vs code)

- **Snowflake** (`snowflake-plain/reference.md`): `query_timeout=7200`,
  `ABORT_TRANSFORMATION`, and copy/clone loading types — confirmed.
- **BigQuery** (`bigquery/reference.md`): `Query timeout` parameter default `0`
  and `ABORT_TRANSFORMATION` (STRING DEFAULT '') — confirmed.
- **DuckDB** (`duckdb/reference.md`): `threads`, `max_memory_mb`, `dtypes_infer`,
  `debug`, `syntax_check`, `duckdb_version`, **supported versions {1.5.2, 1.4.4}**,
  the 4 sync actions, and block orchestration — confirmed.
- **Oracle** (`oracle/index.md`): the optional `schema` field is `db.schema`
  (`scalarNode('schema')`) — confirmed.

## A. Reference facts still unverifiable (platform-level / not in code audit)

- **Snowflake** (`snowflake-plain/reference.md`): backend sizes + default;
  8,192-char comment segfault; AWS-US timestamp parameter overrides; Free-Plan
  backend availability.
- **BigQuery** (`bigquery/reference.md`): the "2 hours" GCP query-runtime claim
  (platform-side; current GCP quota may be 6 h).
- **DuckDB** (`duckdb/reference.md`): backend sizes / memory figures; default Timeout (1 h).
- **Python** (`python-plain/reference.md`): current Python version; 8 GB memory /
  6 h / CPU limits; preinstalled package list; backend sizes / default / plan.
- **R** (`r-plain/reference.md`): R `4.4.1` confirmed (PRDCT-354 Block A, bumped
  4.0.5 → 4.4.1); 16 GB / 6 h / CPU limits; preinstalled packages; backend sizes.

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

`dbt/cli/cli.md`: the `kbc dbt init` outputs (env vars, `profiles.yml`, generated
`models/_sources/*.yml`) are now transcribed to fenced blocks with masked
placeholders.

`code-patterns/index.md`: `TODO(human-review: transcribe generated-code screenshot)` —
the "Generated Code" screenshot shows code (should be a fenced block); content is
code-pattern-specific and wasn't viewable here, so add a representative example.

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
