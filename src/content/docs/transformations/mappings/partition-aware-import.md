---
title: Partition-Aware Import
slug: 'transformations/mappings/partition-aware-import'
description: 'Make incremental loads into a large partitioned BigQuery table read and bill only the partitions the new rows touch: requirements, setup and how to check it.'
---

On BigQuery, partition-aware import makes an incremental load deduplicate only against the partitions the new rows belong to, instead of reading the whole destination table.

#### Partition-aware import (BigQuery)

On an incremental load with a primary key, Keboola deduplicates the new rows against the destination table. On a large
table, this step reads the whole destination table even when the new rows touch only a few days. **Partition-aware
import** limits the deduplication to the destination partitions that the new rows actually belong to, so BigQuery
reads (and bills) only those partitions.

##### How it works

1. Before deduplication, Keboola reads the distinct values of the destination's partitioning column from the loaded data.
2. It adds a filter on that column to the deduplication statement, for example
   ``AND dest.`date` IN ('2026-10-12', '2026-10-13')``. For `DATETIME` and `TIMESTAMP` columns, the filter is a time
   range for each partition (in UTC for `TIMESTAMP`).
3. BigQuery prunes all other partitions of the destination table.

The data loaded into the table is the same as without the option; only the amount of data BigQuery reads changes.

##### Requirements

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

##### Setting it up

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

##### When it helps

It helps most when each load touches a small part of a large table, typically daily or hourly loads that write only
recent dates. If a load contains rows spread across most partitions, the filter saves little.

##### Checking that it is used

- The parameters of the storage import job and the `storage.tableImportStarted` and `storage.tableImportDone` events of
  the job show `partitionAwareImport: true`. This only confirms that the option was enabled for the load, not that the
  filter was applied.
- Whether the filter was applied shows in the BigQuery job history of the project: the deduplication statement
  (`MERGE`, or `UPDATE`, `DELETE`, and `INSERT`) contains the filter on the partitioning column, and its bytes processed
  drop accordingly.

**Next:** [Direct Mode output mapping →](/transformations/mappings/direct-mode/)
