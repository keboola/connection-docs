---
title: 'Transform Your Data'
slug: 'getting-started/transform'
description: 'Create an SQL transformation that joins your loaded tables into one denormalized table, and learn how input and output mapping keep Storage safe.'
redirect_from:
  - /tutorial/manipulate/
---

Four raw tables are not much use on their own. This step joins them into one wide table with
SQL, and introduces the mechanism that keeps your source data safe while you do it.
Step 3 of the [Getting Started](/getting-started/) arc.

<!-- Tutorial-type page (step 3 of 6). SQL verified against Snowflake syntax; UI labels and screenshots pending live verification in demo project 264. -->

## What you need

Four tables in Storage — `opportunity`, `account`, `user` and `level` — from
[Load Your Data](/getting-started/load/). They sit in whatever bucket the connector created,
and its name contains a configuration ID, so yours will not match the screenshots.

That does not matter. What the SQL depends on is the **Table name** you give each table in the
input mapping below: those must be exactly `opportunity`, `account`, `user` and `level`, or you
have to edit the queries to match.

## How a transformation works

A transformation never runs against your Storage tables directly. Keboola copies the tables
you ask for into a temporary database schema, runs your queries there, and copies back only
the results you ask for. Three settings control that:

1. **[Input mapping](/transformations/mappings/#input-mapping)** — which Storage tables get
   copied in, and what they are called inside the transformation. Anything you do not list
   is not visible to your code.
2. **[Output mapping](/transformations/mappings/#output-mapping)** — which tables your code
   produces get written back to Storage, and where. Anything you do not list is thrown away
   when the job ends.
3. **Queries** — the SQL itself, organized into named code blocks.

That is the safeguard: the only tables your transformation can change are the ones named in
the output mapping. It is also what lets Keboola track data lineage across the project.

![Screenshot - How mapping works](/getting-started/transform/mapping.png)

## Create the transformation

1. Open **Transformations**.

   ![Screenshot - Transformations section](/getting-started/transform/transformations-intro.png)

2. Click **Create Transformation** and **note which SQL transformations your project offers** —
   *Snowflake SQL* or *BigQuery SQL* (and possibly *DuckDB*, in beta). Which ones appear
   depends on the project: new [Free Plan](/management/payg-project/) projects default to the
   [BigQuery backend](/storage/), while contract customers choose theirs. Pick the SQL
   transformation your project offers, and use the matching query block below.

   <!-- VERIFY(owner): button label — this page says "Create Transformation",
   transformations/duckdb/index.md:22 says "New Transformation", and the dialog in
   create-transformation.png is titled "New Transformation". Settle it on the live walk. -->

   ![Screenshot - Create a transformation](/getting-started/transform/create-transformation.png)

3. Name it `Denormalize opportunities`, add a description, and put it in a folder called
   `Opportunity`. Folders are cosmetic but they are the difference between a browsable
   project and a wall of configurations.

   ![Screenshot - Name the transformation](/getting-started/transform/name-transformation.png)

## Set the input mapping

1. Click **New Table Input**.

   ![Screenshot - New input mapping](/getting-started/transform/input-mapping1.png)

2. Set **Source** to your `account` table — the field searches, so typing `acc` finds it.
   **Table name** fills in automatically as `account`; that is the name your SQL will use, and
   it is what makes the queries below work regardless of which bucket the table lives in. Click
   **Add Input**.

3. Add the other three the same way — `opportunity`, `user` and `level`. You can select
   several tables at once.

   ![Screenshot - Adding several input tables](/getting-started/transform/IM-add-tables.png)

You should end up with four inputs:

![Screenshot - The finished input mapping](/getting-started/transform/input-mapping3.png)

Input mapping has more to it — incremental processing with **Changed in Last**, column
filters, data filters. None of it is needed here; see
[input mapping](/transformations/mappings/#input-mapping) when you have a large table to
process.

## Set the output mapping

1. Click **New Table Output**.

   ![Screenshot - New output mapping](/getting-started/transform/output-mapping1.png)

2. In **Table name**, enter `opportunity_denorm`. This is the name of a table your SQL will
   create — it does not exist yet.

3. **Destination** auto-fills to `out.c-denormalize-opportunities.opportunity_denorm` — the
   `out` stage, a new bucket named after the transformation, and the table. Neither the
   bucket nor the table exists yet; both are created the first time the transformation runs.

   ![Screenshot - The finished output mapping](/getting-started/transform/output-mapping2.png)

## Write the queries

Click **New Code**. The editor creates `Block 1` and puts a code inside it — name that code
`Opportunity denorm`, paste the SQL for **your project's backend**, and click **Save**.

### If your project uses Snowflake

```sql
CREATE TABLE "tmp_level" AS
    SELECT "Name", CASE
        WHEN "Level" = 'S' THEN 'Senior'
        WHEN "Level" = 'M' THEN 'Intermediate'
        WHEN "Level" = 'J' THEN 'Junior' END AS "Level"
    FROM "level";

CREATE TABLE "tmp_opportunity" AS
    SELECT *, CASE
        WHEN "Probability" < 50 THEN 'Poor'
        WHEN "Probability" < 70 THEN 'Good'
        ELSE 'Excellent' END AS "ProbabilityClass"
    FROM "opportunity";

CREATE TABLE "opportunity_denorm" AS
    SELECT "tmp_opportunity".*,
        "user"."Name" AS "UserName", "user"."Sales_Market" AS "UserSalesMarket",
        "user"."Global_Market" AS "UserGlobalMarket",
        "account"."Name" AS "AccountName", "account"."Region" AS "AccountRegion",
        "account"."Status" AS "AccountStatus", "account"."FirstOrder" AS "AccountFirstOrder"
    FROM "tmp_opportunity"
        JOIN "user" ON "tmp_opportunity"."OwnerId" = "user"."Id"
        JOIN "account" ON "tmp_opportunity"."AccountId" = "account"."Id"
        JOIN "tmp_level" ON "user"."Name" = "tmp_level"."Name";
```

Three queries, in order: spell out the seniority codes; classify each opportunity by how
likely it is to close; then join everything into `opportunity_denorm`. Only that last table
is in the output mapping, so the two `tmp_` tables vanish when the job finishes.

Every identifier is double-quoted because Snowflake uppercases unquoted ones, and the
column names in the sample data are mixed case.

![Screenshot - The code block](/getting-started/transform/new-code.png)

### If your project uses BigQuery

[BigQuery](/transformations/bigquery/) does not quote identifiers this way, and CTEs replace
the temporary tables. The result is the same table:

```sql
CREATE TABLE opportunity_denorm AS
WITH tmp_level AS (
    SELECT
        Name,
        CASE
            WHEN Level = 'S' THEN 'Senior'
            WHEN Level = 'M' THEN 'Intermediate'
            WHEN Level = 'J' THEN 'Junior'
        END AS Level
    FROM
        level
),
tmp_opportunity AS (
    SELECT
        * EXCEPT (_timestamp),
        CASE
            WHEN CAST(Probability as INT64) < 50 THEN 'Poor'
            WHEN CAST(Probability as INT64) < 70 THEN 'Good'
            ELSE 'Excellent'
        END AS ProbabilityClass
    FROM
        opportunity
)
SELECT
    tmp_opportunity.*,
    user.Name AS UserName,
    user.Sales_Market AS UserSalesMarket,
    user.Global_Market AS UserGlobalMarket,
    account.Name AS AccountName,
    account.Region AS AccountRegion,
    account.Status AS AccountStatus,
    account.FirstOrder AS AccountFirstOrder
FROM
    tmp_opportunity
JOIN
    user ON tmp_opportunity.OwnerId = user.Id
JOIN
    account ON tmp_opportunity.AccountId = account.Id
JOIN
    tmp_level ON user.Name = tmp_level.Name;
```

<!-- VERIFY(owner): this BigQuery variant is carried over from the previous version of the
page and has NOT been run against a BigQuery project — the demo project (264) is Snowflake,
so it could not be tested during the rewrite. It matters more than it used to: new Free Plan
projects default to BigQuery (storage/index.md), so this is the block most new readers will
use. The original also referenced `Level`.`Level` inside the CTE, which looks wrong;
corrected to `Level` here but unverified. -->

## Run it and check the result

Click **Run Transformation**. That creates a background job which copies the input tables
in, runs your SQL, and writes `opportunity_denorm` back to Storage.

![Screenshot - Running the transformation](/getting-started/transform/run-transformation.png)

Watch it in **Jobs**, or via the notification that appears when the job starts. A green
job means it worked.

![Screenshot - Successful job](/getting-started/transform/transf-successful.png)

Then open **Storage**: there is a new bucket `out.c-denormalize-opportunities` holding
`opportunity_denorm`. The table list has a **Recently updated by** column showing which
configuration last wrote to each table — the fastest way to answer "where did this table
come from?" months later.

![Screenshot - The new table in Storage](/getting-started/transform/table-in-storage.png)

## If it goes wrong

- **`Object 'ACCOUNT' does not exist`** (Snowflake). A table is missing from the input
  mapping, or the **Table name** inside the transformation differs from what the SQL uses.
  Snowflake uppercases unquoted identifiers, which is why every identifier is double-quoted.
  On BigQuery the equivalent error is `Table ... was not found`.
- **The job succeeds but Storage has no new table.** The output mapping is empty or names a
  table your SQL never creates. The names must match exactly: `opportunity_denorm`.
- **`Numeric value '' is not recognized`.** Tables loaded from CSV arrive as text columns
  unless you give them types, so an empty cell is `''` rather than `NULL` and a comparison
  like `"Probability" < 50` fails on it. The sample data has no empty values, so you will not
  hit this here — but with your own data, cast defensively:
  `TRY_CAST("Probability" AS NUMBER(38,9))` on Snowflake,
  `SAFE_CAST(Probability AS INT64)` on BigQuery.
- **You want to see what the query actually returns before saving.** That is what a
  [workspace](/getting-started/transform/workspace/) is for.

:::tip[Or ask Kai]
Kai reads the job log, so it is faster at this than you are:

> My transformation `Denormalize opportunities` failed. Read the last job's log and tell me
> what to fix.
:::

## Going further

- [Use a Workspace](/getting-started/transform/workspace/) — develop and test queries
  against a copy of the data before committing them to a transformation. This is how the
  work is really done.

**Next:** [Send your data somewhere →](/getting-started/write/)
