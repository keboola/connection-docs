---
title: BigQuery Partitioning and Clustering in Output Mapping
slug: 'transformations/mappings/bigquery-partitioning-clustering'
description: 'Set the partitioning and clustering of a BigQuery table created by a table output mapping, in the configuration or in the table manifest.'
---

On the BigQuery backend, a [table output mapping](/transformations/mappings/#table-output-mapping) can set the
partitioning and the clustering of the destination table. The layout is applied when output mapping creates the
table. Output mapping never changes the layout of a table that already exists; to convert an existing table, see
[Repartition a BigQuery table](/storage/tables/bigquery-repartition/).

In the UI, the table output mapping of a BigQuery project has fields for these options. The same options can be
written in the configuration JSON, and a component can set them in the manifest of its output table.

## Options

Each output table accepts three optional keys:

```json
{
  "storage": {
    "output": {
      "tables": [
        {
          "source": "traffic_deal",
          "destination": "out.c-traffic.traffic_deal",
          "time_partitioning": { "type": "DAY", "field": "report_date" },
          "clustering": { "fields": ["country_code", "deal_id"] }
        }
      ]
    }
  }
}
```

| Key | Content |
|---|---|
| `time_partitioning` | `type` (required), `field` (optional), `expiration_ms` (optional) |
| `range_partitioning` | `field` (required), `range` (required) with `start`, `end` and `interval` (all required) |
| `clustering` | `fields` (required), a list of at least one column |

Only one of `time_partitioning` and `range_partitioning` can be set for a table. A configuration with both is
rejected with `Only one of "time_partitioning" or "range_partitioning" can be defined.`

The keys have the same content as `timePartitioning`, `rangePartitioning` and `clustering` of the
[table definition API](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/buckets/-bucketId-/tables-definition).
Output mapping does not validate the values. BigQuery validates them when the table is created, and the job fails
with a user error that carries the message from BigQuery.

### Time partitioning

- `type` is `HOUR`, `DAY`, `MONTH` or `YEAR`.
- `field` is the partitioning column. It must be a `DATE`, `DATETIME` or `TIMESTAMP` column. `HOUR` is not available
  for a `DATE` column. Without `field`, the table is partitioned by ingestion time.
- `expiration_ms` is the time in milliseconds for which BigQuery keeps the storage of a partition. It is set when the
  table is created.

```json
"time_partitioning": { "type": "MONTH", "field": "created_at", "expiration_ms": "7776000000" }
```

The partitioning column needs a date or time type in the created table. A table without
[native data types](/storage/tables/data-types/) has only `STRING` columns, so time partitioning by a column fails
when the job runs. Clustering works on such a table.

### Range partitioning

- `field` is an `INT64` column.
- `range.start` is the start of the range (inclusive), `range.end` is its end (exclusive), and `range.interval` is the
  width of each partition.

```json
"range_partitioning": { "field": "customer_id", "range": { "start": 0, "end": 100000, "interval": 1000 } }
```

### Clustering

`fields` lists the clustering columns in clustering order. BigQuery accepts at most 4 clustering columns.

```json
"clustering": { "fields": ["country_code", "deal_id"] }
```

## Behavior

| Situation | Behavior |
|---|---|
| The destination table does not exist and its columns are known | The table is created with the requested layout. |
| The destination table does not exist and its columns are not known (no `columns` and no `schema` in the output mapping or in the manifest) | The job fails with a user error: `Cannot create table "..." with the option(s) "...": the columns of the table are unknown. Set "columns" or "schema" in the output mapping or in the manifest.` |
| The destination table exists with the requested layout | The data is loaded as usual. |
| The destination table exists with a different layout | The data is loaded as usual and the layout of the table is not changed. The job logs a message that names the current layout, the requested layout and the keys that differ. |
| The destination table exists and the output mapping has none of the three keys | The data is loaded as usual. A missing key means that the output mapping does not request a layout, so a table partitioned by other means never causes that message. |
| The output table uses [Direct Mode](#direct-mode-output-mapping) | The keys are ignored and the job logs a warning. |
| The destination bucket is on another backend than BigQuery | The keys are not sent to Storage and have no effect. The data is loaded as usual and the job logs a warning. |

Only the keys that are set are compared with the existing table. An output mapping that sets only `clustering` does
not compare the partitioning.

A full load and an incremental load both keep the layout of the destination table.

## Direct Mode output mapping

A [Direct Mode output mapping](/transformations/mappings/#direct-mode-output-mapping)
(`unload_strategy: direct-grant`) does not create its destination table. The transformation writes into a table that
already exists, so output mapping has no table to apply the layout to. Create the table with the layout beforehand:

- with [kbagent](/cli/): `kbagent storage create-table` with the `--time-partitioning-*`, `--range-partitioning-*`
  and `--clustering-field` options (see the [command reference](/cli/commands/)), or
- with the
  [table definition API](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/buckets/-bucketId-/tables-definition)
  (`timePartitioning`, `rangePartitioning`, `clustering`).

When a Direct Mode output table carries one of the three keys, the job logs this warning and continues:
`Output table "..." has unload_strategy "direct-grant": output mapping does not create the table and ignores "...". Create the table with this layout through the Storage API beforehand.`

## Manifest

A component sets the layout of a table it produces with the same three keys in the
[output table manifest](/extend/common-interface/manifest-files/out-tables-manifests/#partitioning-and-clustering-bigquery).

A value in the configuration overrides the value from the manifest:

- `time_partitioning` or `range_partitioning` in the configuration replaces the partitioning from the manifest,
  including a partitioning of the other kind.
- `clustering` in the configuration replaces `clustering` from the manifest.
- A key that the configuration does not set keeps its value from the manifest.

## Loads and partition limits

- BigQuery allows at most 10,000 partitions in one table. A load that would take the table over this limit fails with
  a user error. Choose a coarser granularity, for example `MONTH` instead of `DAY`.
- One BigQuery statement can modify at most 4,000 partitions. With `DAY` partitioning, 4,000 partitions are less than
  11 years of data. When a full or an incremental load spans more than 4,000 partitions, Keboola writes the data in
  several ranges of the partitioning column inside one transaction. The load either completes, or leaves the table
  unchanged.
- A table partitioned by ingestion time is not affected: a load writes into one partition.

## Incremental loads

On an incremental load with a primary key, Keboola deduplicates the new rows against the destination table.
Partitioning the table does not limit this step: the `MERGE` still reads the whole table. When the primary key
contains the partitioning column, enable
[Partition-aware import](/transformations/mappings/#partition-aware-import-bigquery) (`partition_aware_import`) in the
same output mapping. The deduplication then reads only the partitions that the new rows belong to.

```json
{
  "source": "traffic_deal",
  "destination": "out.c-traffic.traffic_deal",
  "incremental": true,
  "primary_key": ["deal_id", "report_date"],
  "time_partitioning": { "type": "DAY", "field": "report_date" },
  "partition_aware_import": true
}
```

## Existing tables

BigQuery does not change the partitioning of an existing table, and output mapping does not change the layout of an
existing table. To partition an existing table, to change its partitioning, or to change its clustering, follow
[Repartition a BigQuery table](/storage/tables/bigquery-repartition/).
