---
title: Set up Direct Mode output mapping
slug: 'transformations/mappings/direct-mode/set-up'
sidebar:
  label: Set Up Direct Mode
description: 'Turn on Direct Mode output mapping in a Snowflake or BigQuery transformation, workspace or the SQL Editor (Create writable table), and write idempotent SQL that is safe to re-run.'
search_keywords: [direct mode, unload_strategy, direct-grant, create writable table, writable tables, idempotent SQL, MERGE]
---

How to switch an output mapping to Direct Mode in a transformation, a workspace or the SQL Editor, and how to write
SQL that stays correct without Keboola's deduplication. What Direct Mode is and when it pays off is in
[Direct Mode output mapping](/transformations/mappings/direct-mode/).

<!-- How-to-type page. Split from the former single mappings page (PRDCT-376), text carried over from main 2026-11-12. -->

## Before you start

- Direct Mode is a **private beta**: ask [Keboola Support](/management/support/) to enable it for your project.
  <!-- VERIFY(Nikita): same open question as on direct-mode/index.md: the toggle was seen in a new Free Plan project with no Support request. -->
- The project runs on **Snowflake** or **BigQuery**.
- In a transformation or workspace, the destination table already exists in Storage (the SQL Editor can create it
  for you). Its bucket must not be read-only, external or linked from another project.
- On a development branch, the project has [Branched storage](/components/branches/); without it, Direct Mode writes
  from a branch change production data on Snowflake.

## In a transformation

**Goal:** a Snowflake or BigQuery transformation writes straight into a Storage table.

1. In the transformation, add an output mapping.
2. Switch the mode from **Guided Mode** to **Direct Mode**.
3. Pick an existing Storage table as the destination; the dialog then shows the full table path to copy into your SQL.

The mode cannot be switched on an existing mapping — delete the mapping and create a new one instead.

**Result:** on the next run, your SQL writes to the Storage table, and Keboola refreshes the table metadata afterwards.

Under the hood, Direct Mode is the `unload_strategy` field on the output table in the configuration JSON:

```json
{
  "storage": {
    "output": {
      "tables": [
        {
          "destination": "out.c-my-bucket.my_table",
          "unload_strategy": "direct-grant"
        }
      ]
    }
  }
}
```

The `unload_strategy` field accepts two values:
- `direct-grant` — Write directly to the Storage table (Direct Mode output mapping).
- `copy` — Standard output mapping (default when the field is omitted).

You can mix both strategies in a single transformation — some tables can use Direct Mode output mapping while
others use the standard copy strategy.

## In a workspace

**Goal:** write to a Storage table directly from a workspace instead of the **Unload Data** round trip.

In a **standalone Snowflake or BigQuery workspace**, open the **Output Mapping** section in the workspace detail,
add an output, and select **Direct Mode**.

As in a transformation, pick an existing Storage table as the destination, and to change the mode of a mapping,
delete it and create a new one.

**Result:** the write privileges are granted as soon as you save the mapping, so your very next query can write to
the table.

## In the SQL Editor, with a new table

**Goal:** create the destination Storage table on the fly from a working table in the
[SQL Editor](/workspace/sql-editor/).

1. In the **Working Tables** section, click the three dots next to a working table and select **Create writable table**.
2. Set the destination bucket and table name, adjust the column definitions and the primary key.
3. Click **CREATE WRITABLE TABLE**.

Keboola creates the Storage table (creating the bucket first if it does not exist yet) and registers it as a
Direct Mode output mapping. The source working table itself is not modified or copied — only its column
structure is used as the template for the new Storage table.

**Result:** the new table appears in the **Writable tables** section of the Storage Explorer with the **DG** badge, and
the workspace can write to it right away. Use the three-dots menu there to remove the mapping (and with it the
workspace's write access).

## Good practices

The examples below use Snowflake syntax.

**Write idempotent SQL.** Because there is no automatic rollback on failure, your SQL should be safe
to re-run. Use patterns like `MERGE` or `DELETE` + `INSERT` within a transaction:

```sql
BEGIN;
DELETE FROM "in.c-my-bucket"."sales"
  WHERE date = CURRENT_DATE();
INSERT INTO "in.c-my-bucket"."sales"
  SELECT * FROM "my_staging_table"
  WHERE date = CURRENT_DATE();
COMMIT;
```

**Handle deduplication yourself.** Use `MERGE` statements or explicit `DELETE` before `INSERT`
to avoid duplicate rows:

```sql
MERGE INTO "in.c-my-bucket"."customers" AS target
USING "my_staging_table" AS source
ON target."id" = source."id"
WHEN MATCHED THEN UPDATE SET
  target."name" = source."name",
  target."email" = source."email"
WHEN NOT MATCHED THEN INSERT ("id", "name", "email")
  VALUES (source."id", source."name", source."email");
```

**Test in a non-production environment first.** Direct Mode output mapping writes affect data immediately.
Validate your transformation logic thoroughly before pointing it at production tables.

**Use the read-only storage path for table references.** In your SQL, reference tables by their
full Storage path (e.g., `"SCHEMA"."in.c-bucket"."table"`), not by workspace-local names.

What to avoid, and why, is in
[What Keboola no longer does for you](/transformations/mappings/direct-mode/#what-keboola-no-longer-does-for-you).
