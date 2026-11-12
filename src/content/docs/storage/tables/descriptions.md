---
title: Table and column descriptions
slug: 'storage/tables/descriptions'
sidebar:
  label: Descriptions
search_keywords: [description, column description, table description, comment, COMMENT, KBC.description]
description: 'Table and column descriptions in Storage: editing them in the UI and API, size limits per backend, external tables, workspaces, Data Gateway and KBC.description metadata.'
---

Every Storage table and column can carry a description. This page lists where descriptions come from, where they are written, and their limits.

<!-- Reference-type page. Split from the former single tables page (PRDCT-486); text carried over from main 2026-11-12. -->

Tables and columns carry a description that is part of the
[table definition](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/buckets/-bucketId-/tables-definition).
It is the text shown for the table and its columns in Storage and returned by the API as `description`.

## Edit Descriptions in the Storage UI
On Snowflake and BigQuery projects, open a bucket and then a table.
- **Table description:** on the **Overview** tab, the **Table Description** box has an **Add description** button.
  An existing description opens for editing when you click it.
- **Column description:** on the **Schema** tab, each column row has a **Description** cell with an
  **Edit Description** button.

Descriptions are Markdown, within the [size limit](#descriptions-in-your-backend), and are saved with **Save**.
Saving a description in the UI turns off the **Managed by Keboola** switch of the table, so Keboola components stop
updating the descriptions of the table and all its columns. You can turn it on again from the same box.
The description of an alias shows the description of its source table and is read-only, as are the descriptions of
tables in buckets backed by an external schema (see [Descriptions of External Tables](#descriptions-of-external-tables)).

## Set Descriptions Through the API
Send the table `description`, and a description for each column, when you
[create a table with a definition](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/buckets/-bucketId-/tables-definition)
or [update its definition](https://api.keboola.com/?service=storage#put-/v2/storage/branch/-branchId-/tables/-tableId-/definition).
When you create a table, a column description goes in the column's `definition.description`; when you update a
table, it is the column's `description`.
The [table list](https://api.keboola.com/?service=storage#get-/v2/storage/branch/-branchId-/table-list)
returns the table description and, with `include=definition`, the column descriptions.

## Descriptions in Your Backend
On Snowflake and BigQuery projects the descriptions are written to the database itself: a Snowflake `COMMENT` on
the table and its columns, and the BigQuery table and column description. Storage writes them when the table is
created and whenever a description changes. You can therefore see the same text in a SQL client or in the
BigQuery console.

Storage accepts descriptions up to 65,535 bytes (fewer characters for non-ASCII text) and stores the full text,
which stays available through the Storage API. The backend receives only the part within its own limit:

| Backend | Longest description written to the backend |
|---|---|
| Snowflake | 16,384 characters |
| BigQuery | 1,024 characters |

<!-- TODO(DMD-2640): remove the exception below once Storage truncates column descriptions before writing them to BigQuery. -->
Exception: on BigQuery, column descriptions are not truncated when you save them through the table definition
update, which is also what the Storage UI and components use. An update with a column description longer than
1,024 characters fails, so keep BigQuery column descriptions within the limit.

Descriptions are not written to the backend for:
- aliases that are not materialized as a view, and tables in [linked buckets](/catalog/);
- tables in buckets backed by an external schema: their description comes from the source, and nothing is written
  back to it (see [Descriptions of External Tables](#descriptions-of-external-tables));
- projects on other backends.

Aliases that synchronize columns with their source read the description of the table they point to; an alias's
own table description takes precedence. A materialized alias view carries the resolved description as its comment
(Snowflake) or description (BigQuery), and is updated when a description changes.

## Descriptions of External Tables
In [external buckets](/storage/byodb/external-buckets/) (a registered Snowflake schema or Secure Data Share, or a
BigQuery external dataset), the source owns the descriptions. When you register the bucket, and on every refresh,
Storage takes the table and column descriptions from the source comments: the Snowflake `COMMENT` or the BigQuery
description. Nothing is ever written back to the source.

The descriptions are read-only in the Storage UI. To change one, edit the comment in Snowflake or BigQuery and
refresh the bucket. The [definition update](https://api.keboola.com/?service=storage#put-/v2/storage/branch/-branchId-/tables/-tableId-/definition)
rejects a changed description with HTTP 400 and the error code `storage.tables.externalDescriptionNotEditable`.

Newly registered buckets get the descriptions right away. Buckets registered before November 10, 2026 get them only
for tables whose comment changes later. To load them for all tables, open the bucket, choose **Refresh bucket** and
check **Reload all tables**. If you run into a problem, contact [Keboola support](/management/support/).

Descriptions you wrote in Keboola earlier are replaced by the source comment when the table is refreshed. If the
source has no comment, the description is cleared; in a Secure Data Share bucket it is kept.

A refresh that changes a description emits the `storage.tableDescriptionChanged` or `storage.columnDescriptionChanged`
event. The event, listed among the events of the bucket and of the table, contains both the previous and the new
text, up to 8,000 characters each. Comments longer than 65,535 bytes are skipped, and characters such as emoji are
stored as `?`.

A `KBC.description` metadata row written through the
[metadata API](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/tables/-id-/metadata)
is not changed by a refresh. The UI does not show it, but it stays readable through the Storage API.

## Descriptions in Workspaces and Data Gateway
Storage table and column descriptions are written to the tables loaded into Snowflake and BigQuery
[workspaces](/workspace/): as a Snowflake `COMMENT` or a BigQuery description. SQL clients, the MCP server and Kai
therefore see the same context as Storage.

- A [`COPY` load](/transformations/mappings/input/#loading-type-snowflake-and-bigquery) writes the descriptions when it
  creates the workspace table. An incremental load into an existing table keeps the descriptions it already has.
- A `CLONE` load keeps the descriptions of the source table on Snowflake and gets the Storage descriptions on BigQuery.
- The input mapping can set its own table or column description for a workspace load, in the input mapping editor
  in the UI. The description in Storage stays unchanged. An empty description in the input mapping falls back to the
  Storage description.
- [Data Gateway](/components/applications/data-gateway/) (Snowflake): the comments reach the reader account through
  the share. Existing tables get them on their next Data Gateway run.

The `VIEW` load type and the Snowflake and BigQuery writers do not carry descriptions yet.

## Relation to KBC.description Metadata
The description in the table definition is the source of truth. For compatibility, Storage mirrors it into the
`KBC.description` [metadata](/storage/tables/#metadata) under the `storage` provider. A `KBC.description` written by another provider
(for example a component) is only a fallback, used when the table or column has no description from the user or from
Storage. For a typed table whose description field in the table definition is empty, the table detail falls back to the
`KBC.description` that Storage wrote; the
[table list](https://api.keboola.com/?service=storage#get-/v2/storage/branch/-branchId-/table-list) does not.
New integrations should read and write the `description` field of the table definition, not the metadata.

**Next:** [Data types →](/storage/tables/data-types/)
