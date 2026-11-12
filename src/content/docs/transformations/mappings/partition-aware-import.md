---
title: Speed up incremental loads with partition-aware import (BigQuery)
slug: 'transformations/mappings/partition-aware-import'
sidebar:
  label: Partition-Aware Import
description: 'Make incremental loads into a large partitioned BigQuery table read and bill only the partitions the new rows touch: requirements, setup and how to check it is used.'
search_keywords: [partition-aware import, partitioned table, BigQuery partitions, incremental load cost, deduplication]
---

On BigQuery, partition-aware import makes an incremental load deduplicate only against the partitions the new rows
belong to, so BigQuery reads (and bills) those partitions instead of the whole destination table. It is an option of
the [table output mapping](/transformations/mappings/output/#table-output-mapping).

<!-- How-to-type page. Split from the former single mappings page (PRDCT-376), text carried over from main 2026-11-12. -->

## How it works

On an incremental load with a primary key, Keboola deduplicates the new rows against the destination table. On a large
table, this step reads the whole destination table even when the new rows touch only a few days. With partition-aware
import:

1. Before deduplication, Keboola reads the distinct values of the destination's partitioning column from the loaded data.
2. It adds a filter on that column to the deduplication statement, for example
   ``AND dest.`date` IN ('2026-10-12', '2026-10-13')``. For `DATETIME` and `TIMESTAMP` columns, the filter is a time
   range for each partition (in UTC for `TIMESTAMP`).
3. BigQuery prunes all other partitions of the destination table.

The data loaded into the table is the same as without the option; only the amount of data BigQuery reads changes.

It helps most when each load touches a small part of a large table, typically daily or hourly loads that write only
recent dates. If a load contains rows spread across most partitions, the filter saves little.

## Before you start

The option takes effect only when **all** of the following conditions are met. If any of them is not met, the load
runs as before, without an error.

- The project uses the BigQuery backend.
- **Incremental** is enabled and a **Primary key** is set.
- The destination table is partitioned by a column:
  - time-unit column partitioning on a `DATE`, `DATETIME`, or `TIMESTAMP` column (`HOUR`, `DAY`, `MONTH`, or `YEAR`), or
  - integer-range partitioning on an `INT64` column.

  Ingestion-time partitioning is not supported.
- The partitioning column is **part of the primary key**.
- The loaded data contains at most 4,000 distinct values of the partitioning column. For time-unit partitioning, the
  values are counted per partition unit (e.g., per day for `DAY` partitioning); for integer-range partitioning, every
  distinct integer counts, even when several of them fall into the same range partition. Above the limit, the
  deduplication runs without the filter. This does not lift BigQuery's own limit on the number of partitions a single
  job can modify.

## Set it up

**Goal:** an incremental output mapping whose deduplication reads only the partitions it loads into.

1. **Partition the destination table.** Partitioning is set when a table is created; it cannot be added to an existing
   table.
    - New table: create it with [kbagent](/cli/) (`kbagent storage create-table` with `--time-partitioning-type` and
      `--time-partitioning-field`, or the `--range-partitioning-*` options), or with the
      [table definition API](https://keboola.docs.apiary.io/#reference/tables/create-table-definition/create-new-table-definition)
      (`timePartitioning` or `rangePartitioning`).
    - Existing table: create a partitioned copy with `kbagent storage create-table --source-table-id`, then replace
      the original with `kbagent storage swap-tables`. See the [kbagent command reference](/cli/commands/).
2. **Include the partitioning column in the primary key**, both on the table (`--primary-key` when creating it) and in
   the output mapping. This changes the deduplication: two rows with the same key but a different partitioning value
   (e.g., a different `date`) are kept as two rows.
3. **Enable the option** in the table output mapping by checking **Partition-aware import**. The checkbox is shown only
   when Incremental loading is enabled and a primary key is set.

   ![Partition-aware import option in the table output mapping](/transformations/mappings/partition-aware-import.png)

   In the configuration JSON, the option is stored as `partition_aware_import`:

   ```json
   {
     "source": "out_product_prices",
     "destination": "out.c-prices.out_product_prices",
     "incremental": true,
     "primary_key": ["product_id", "date"],
     "partition_aware_import": true
   }
   ```

**Result:** the next incremental load reads only the destination partitions that its rows belong to.

## Check that it is used

- The parameters of the storage import job and the `storage.tableImportStarted` and `storage.tableImportDone` events of
  the job show `partitionAwareImport: true`. This only confirms that the option was enabled for the load, not that the
  filter was applied.
- Whether the filter was applied shows in the BigQuery job history of the project: the deduplication statement
  (`MERGE`, or `UPDATE`, `DELETE`, and `INSERT`) contains the filter on the partitioning column, and its bytes processed
  drop accordingly.

**Next:** [Direct Mode output mapping →](/transformations/mappings/direct-mode/)
