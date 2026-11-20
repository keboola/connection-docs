---
title: Repartition a BigQuery Table
slug: 'storage/tables/bigquery-repartition'
description: 'Convert an existing BigQuery Storage table to a partitioned or clustered layout: copy, validate, swap, and the clustering change in place.'
---

BigQuery does not change the partitioning of an existing table. To partition an existing Storage table, or to change
its partitioning, you create a copy of the table with the new layout and swap the two tables. The table keeps its ID.
The clustering of a table can be changed in place, without a copy.

This guide applies to the BigQuery backend. To set the layout of a table that does not exist yet, see
[BigQuery partitioning and clustering in output mapping](/transformations/mappings/bigquery-partitioning-clustering/).

## Choose the method

| Goal | Method |
|---|---|
| Change, add or remove the clustering only | [Change the clustering in place](#change-the-clustering-in-place) |
| Add or change the partitioning, with or without clustering; the partitioning column is `DATE`, `DATETIME` or `TIMESTAMP` | [Copy and swap](#copy-and-swap) |
| Partition by a date that is stored in a `STRING` column, or partition a table without native data types | The type-change path of the [kbagent skill](#kbagent-skill) |

## Copy and swap

### Before you start

- **Requirements.** The copy is created in the same bucket as the original table. The swap refuses two tables from
  different buckets, and it refuses an alias.
- **Cost.** The copy is one full scan of the source table. The storage of the table is doubled until you delete the
  old table. The copy is new data, so BigQuery bills it as active storage even where the original has aged into
  long-term storage.
- **Granularity.** One BigQuery statement can modify at most 4,000 partitions, and the copy is one statement. For a
  table with more than 4,000 distinct days in the partitioning column, use `MONTH` instead of `DAY`.
- **Writers.** The copy is a snapshot. Storage does not block a write that lands between the copy and the swap, and
  such a write is lost. Stop every writer of the table for the duration: loads, Direct Mode output mapping writes and
  streaming writers. A running DML statement on the table blocks the swap. Rows that were streamed recently can be
  invisible to the copy for up to 90 minutes, and BigQuery refuses to rename a table for about 5 hours after the last
  streaming write, sometimes longer. Start the copy after the streaming buffer is empty, and the swap after BigQuery
  allows the rename.
- **Objects outside Storage.** Table-level IAM bindings and row access policies that were set directly in BigQuery
  stay with the physical table, so after the swap they are on the old table. Search indexes are dropped by the swap.
  Record them before you start, apply the IAM bindings and the row access policies to the copy before the swap, and
  create the search indexes again after the swap.
- **Policy tags.** The copy carries the policy tags of the source only when
  [BigQuery policy tags](/storage/byodb/bigquery-policy-tags/) are enabled for the backend and the project. Otherwise
  the copy is created without them.

### 1. Create the copy

Create a table from the source table with the new layout, in the same bucket. With [kbagent](/cli/):

```bash
kbagent storage create-table --project my-project --bucket-id out.c-traffic --name traffic_deal_repart --source-table-id out.c-traffic.traffic_deal --time-partitioning-type DAY --time-partitioning-field report_date --clustering-field country_code --primary-key deal_id --primary-key report_date
```

The same call through the
[table definition API](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/buckets/-bucketId-/tables-definition)
is a `POST` to `/v2/storage/buckets/out.c-traffic/tables-definition` with this body:

```json
{
  "name": "traffic_deal_repart",
  "source": { "tableId": "out.c-traffic.traffic_deal" },
  "primaryKeysNames": ["deal_id", "report_date"],
  "timePartitioning": { "type": "DAY", "field": "report_date" },
  "clustering": { "fields": ["country_code"] }
}
```

The copy takes its columns from the source table: names, types, nullability, defaults and descriptions, in the same
order. Do not send `columns`. The primary key is the one that the request names, so repeat the primary key of the
original table. Every column named in the primary key, the partitioning and the clustering must exist in the source
table.

### 2. Validate the copy

Compare the copy with the original before the swap:

```bash
kbagent --json storage table-detail --project my-project --table-id out.c-traffic.traffic_deal_repart
```

- The row count equals the row count of the original. A difference means that a write landed after the copy.
- The columns, their types and the primary key are the same.
- `definition.timePartitioning`, `definition.rangePartitioning` and `definition.clustering` show the requested layout.
- Each column that is protected by a policy tag on the original is protected on the copy.
- The IAM bindings and the row access policies that you applied to the copy equal the recorded ones.

Do not swap when one of the checks fails.

### 3. Swap the tables

```bash
kbagent storage swap-tables --project my-project --table-id out.c-traffic.traffic_deal --target-table-id out.c-traffic.traffic_deal_repart --branch 0 --yes
```

`--branch 0` runs the swap in production; it needs kbagent 1.0.0 or later. Through the API, the swap is a `POST` to
`/v2/storage/tables/out.c-traffic.traffic_deal/swap` with `targetTableId` set to the ID of the copy.

The swap runs as a Storage job. After it, `out.c-traffic.traffic_deal` holds the new layout and
`out.c-traffic.traffic_deal_repart` holds the old table. An alias of the original table keeps pointing at the same
table ID, so it reads the new table.

- Do not run the swap again when the command times out. The job still runs, and a second swap swaps the tables back.
  Wait for the job instead.
- When the job fails with `storage.tables.swapMetadataFailed`, the data is swapped and the metadata of the two tables
  can be inconsistent. Do not run the swap again and do not write to either table. Contact
  [Keboola Support](/management/support/).

### 4. After the swap

- Check the layout in the detail of the original table ID.
- Create the search indexes again.
- Read every alias of the table and compare its columns and its row count with the table.
- Resume the writers and check that the next load succeeds and keeps the layout.
- When the table is loaded incrementally and its primary key contains the partitioning column, enable
  [Partition-aware import](/transformations/mappings/#partition-aware-import-bigquery) in the output mapping that
  loads it. Without it, the deduplication of each load still reads the whole table.

### 5. Roll back or clean up

While the old table exists, a second swap of the same two tables is the rollback. Time travel of the new table starts
when the copy was created; an earlier state can be restored only from the old table. Keep the old table until you are
sure about the new one (the kbagent skill keeps it for 7 days). Then preview the deletion and delete it:

```bash
kbagent storage delete-table --project my-project --table-id out.c-traffic.traffic_deal_repart --dry-run
kbagent storage delete-table --project my-project --table-id out.c-traffic.traffic_deal_repart --yes
```

## Change the clustering in place

The [table definition update](https://api.keboola.com/?service=storage#put-/v2/storage/branch/-branchId-/tables/-tableId-/definition)
accepts `clustering` for a BigQuery table. Send a `PUT` to
`/v2/storage/tables/out.c-traffic.traffic_deal/definition` with this body:

```json
{ "clustering": { "fields": ["country_code"] } }
```

- `fields` lists 1 to 4 existing columns of the table in clustering order.
- `"clustering": null` removes the clustering.
- A request without `clustering` leaves the clustering unchanged.
- The request is rejected with 422 on other backends, for an alias, and for an unknown column or more than 4 columns.
  For a table in a linked bucket it is rejected with 403. Change the clustering on the source table; an alias and a
  linked bucket read the same physical table.
- The partitioning cannot be changed this way.

BigQuery applies the new clustering to data written after the change. Rows that are already in the table keep their
order until they are rewritten:

- A full load rewrites the table, so the next full load writes the whole table clustered.
- A table that is loaded only incrementally keeps its existing rows unclustered. Either wait, or use
  [copy and swap](#copy-and-swap), which rewrites all rows.

The change itself rewrites no data. BigQuery returns a table in long-term storage to active storage pricing when a
new clustering is applied.

## kbagent skill

The kbagent plugin for Claude Code (see [kbagent for AI agents](/cli/for-agents/#claude-code-plugin)) contains the
skill
[kbagent-bigquery-repartition](https://github.com/keboola/cli/tree/main/plugins/kbagent/skills/kbagent-bigquery-repartition).
It runs the copy and swap procedure for one table and adds the steps that this guide only names: the preflight record
(writers, aliases, sharing, policy tags, IAM bindings, row access policies, search indexes), the choice of
granularity, the type-change path for a date stored in a `STRING` column, the validation queries, the rollback, and the
recovery of a failed swap. Every write waits for a confirmation.
