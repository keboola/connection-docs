---
title: External Datasets
lastUpdated: 2026-11-19
description: 'What an external dataset is: a read-only bucket mapped to a Snowflake schema or BigQuery dataset you own. Covers BigLake tables, mappings and limitations.'
slug: 'storage/byodb/external-buckets'
---

If you operate Keboola in Bring-Your-Own-Database (BYODB) mode using your own data warehouse, the data in the warehouse won't automatically be visible or accessible within Keboola. To address this, we offer the **External Datasets** feature.

<!-- Explanation-type page. Source: the External Datasets page as it stood on main before the split into this page and a how-to page. Structure checked 2026-11-19, facts not re-verified. -->

The implementation of **External Datasets requires the [BYODB](/storage/byodb/) to be enabled first**.
Unless specified otherwise, this description refers to the implementation of Snowflake and BigQuery.

To register an external dataset, refresh it, query it, share it or remove it, follow [Register and use an external dataset](/storage/byodb/external-buckets/register/).

## What is an external dataset?
Storage in Keboola is organized into [buckets](/storage/buckets/). An external dataset is a special type of bucket wherein Keboola does not manage 
its content. It can be located _anywhere in the storage backend used by your Keboola project_ (Snowflake or BigQuery) and is a virtual bucket connected 
to a Snowflake schema or BigQuery dataset, respectively.

All table-like objects (such as tables, views, and external tables) inside the schema (in Snowflake)
or dataset (in BigQuery) are mapped to tables in the bucket. Access to the bucket is read-only; you cannot write to the bucket from Keboola. A single schema can 
be registered simultaneously with multiple projects in Keboola.

## BigLake tables
Keboola generally does not support external tables, except for [BigLake tables](https://cloud.google.com/bigquery/docs/create-cloud-storage-table-biglake). 
Please ensure that any table you are using is of this type. External tables of other types will not work in transformations and workspaces due to permission issues.

Please ensure that you can perform a `SELECT * FROM <table> LIMIT 1` query on your created BigLake table. Keboola checks this during the registration process. 
If the `SELECT` fails, the table will be skipped. 

The only exceptions are tables configured with `require_hive_partition_filter=true`. Such configurations of BigLake tables are supported by Keboola, but 
`SELECT` operations (like Data Preview) will fail. This is expected behavior. You can still use these tables in your workspaces and transformations, but 
appropriate `WHERE` conditions are necessary.

## Using an external dataset

Table and column descriptions come from the comments in the source: the Snowflake `COMMENT` or the BigQuery
description. They are read-only in Keboola and are updated when you register or [refresh](/storage/byodb/external-buckets/register/#refresh-an-external-dataset) the bucket. Learn more in
[Descriptions of External Tables](/storage/tables/descriptions/#descriptions-of-external-tables).

External datasets can be used in an [input mapping](/transformations/mappings/#input-mapping). If you would like to disable usage of External datasets in input mapping, reach out to our support to disable it.
They are also accessible via the [read-only input mapping](/transformations/mappings/#read-only-input-mapping).
Keep in mind that external buckets cannot be used in an [output mapping](/transformations/mappings/#output-mapping) as they are not writable.

## Usage recommendations

* Use external datasets to work with data in your warehouse that has been produced by third-party tools outside Keboola.
* Use external datasets to access data in table-like structures that are not directly supported by Keboola (e.g., views and external tables).
* Using external datasets to load data from services with existing components into Keboola is **discouraged**. Consider the following limitations of such an approach:
    * You would have to orchestrate, maintain, and monitor the external pipeline, which Keboola normally does for you.
    * Manipulation of the data will not be tracked in the Keboola audit trail.
    * Event-driven triggering is not supported for external datasets, so you must manually synchronize the external and Keboola pipelines based on time.
* While there are legitimate uses of external tools, keep in mind that by having data pipelines outside Keboola, you lose the main benefit of Keboola—the ability to orchestrate, maintain, monitor, and audit the pipelines in one place.

## Limitations

* Table names can't be longer than **92 characters** and can contain only **alphanumeric** characters, **dashes**, and **underscores**. Tables that do not meet these requirements **will be ignored**.
* Table names are not case-sensitive. You cannot create two tables with the same name that differ only in letter case.
* [Creating snapshots](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/tables/-id-/snapshots) from tables in external buckets is not supported.
* A read-only input mapping with an external dataset has a limitation. If you delete and recreate a registered table in the source schema, our [read-only input mapping](/workspace/#read-only-input-mapping) will lose access to this table. This occurs because we aim to limit clients from having excessive permissions, such as [OWNERSHIP](https://docs.snowflake.com/en/sql-reference/sql/grant-privilege#restrictions-and-limitations), on their external schemas. **However, manually refreshing the bucket addresses this issue.** To resolve it permanently, [grant the read-only role future access](/storage/byodb/external-buckets/register/#keep-read-only-input-mapping-access-to-recreated-tables) to your tables and views.

---

**Next:** [Register and use an external dataset →](/storage/byodb/external-buckets/register/)
