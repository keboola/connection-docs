---
title: Tables in Storage
slug: 'storage/tables'
sidebar:
  label: Tables
description: 'What a Storage table is: buckets, importing into an existing table, table and column naming rules, alias tables, metadata, and how primary keys and incremental loading fit in.'
search_keywords: [table, tables, alias, alias table, metadata, column names, table detail]
---

Tables hold your project's data in Storage. This page explains what a table and an alias are and the rules every
table follows. For tasks such as creating an alias or deleting rows, see [Manage tables](/storage/tables/manage/).

<!-- Explanation-type page. Split from the former single tables page (PRDCT-486); text carried over from main 2026-11-12, tab name live-verified in #1010. -->

## What a table is

The *Table Storage* for your project is available under the **Tables & Buckets** tab in the Storage section.
All data tables are organized into [buckets](/storage/buckets/) that can also be
used to [share tables](/catalog/) between projects.

The actual data tables and the buckets are created primarily by Keboola components (data source connectors, transformations,
and applications), or they are imported from CSV files. If you want to import data into an already
**existing table**, the imported table must contain all the columns of the existing table, even if the existing
table is empty. If any columns are missing, you will receive an error message similar to the following:

    Some columns are missing in the CSV file. Missing columns: lat,long. Expected columns: lat,long.
    Please check if the expected "," delimiter is used in the CSV file.

The imported file **may** also contain additional columns not present in the existing
table. In that case, the columns from the imported table will be added to the existing table.

Table and column names can contain only alphanumeric characters. Dash and
underscores are allowed. Column names must not start or end with dash `-` or underscore
character `_`.

When you select a table from any bucket in Storage, detailed information about the table will be displayed
at the top of the screen. This is what we refer to as the **table detail** throughout our documentation.

## Aliases

Apart from actual tables, it is also possible to create aliases. They behave similarly to
[database views](https://en.wikipedia.org/wiki/View_(SQL)).

An alias does not contain any actual data; it is simply a link to some already existing data.
Therefore, an alias cannot be written to, and its size does not count toward your project quota.

Alias tables are automatically materialized as physical database VIEWs. This makes them fully accessible in workspaces and
transformations via [read-only storage access](/transformations/mappings/input/#read-only-input-mapping) — no input mapping configuration is required.
Filtered aliases are also supported; the filter condition is enforced as a `WHERE` clause in the VIEW.
In [linked buckets](/catalog/), alias VIEWs from the source project are automatically mirrored to the destination project,
making them immediately queryable there as well.

By default, alias columns are automatically synchronized with the source table. Columns added to the source
table will be added to the alias automatically.
You can prevent this by disabling *Synchronize columns with source table*.

Aliases with automatically synchronized columns and without a filter can be chained.

An alias lives only as long as its source table: deleting a table deletes its aliases too, after a confirmation.
How to create one is in [Create an alias table](/storage/tables/manage/#create-an-alias-table).

## Metadata

Each [Table Storage](/storage/) object (bucket, table, column) has an associated key-value
store. This can be used to store arbitrary metadata (information about the data itself). Apart from
arbitrary user-defined metadata, there is also some information stored automatically. For example,
each bucket and table has information about which configuration of which component created them.
One important use case of metadata is [Column Data Types](/storage/tables/data-types/).
Table and column [descriptions](/storage/tables/descriptions/) live in the table definition and are mirrored into
metadata.

## Incremental loading

Each table may have a **primary key** that identifies its rows: values are deduplicated on load, and with
**incremental loading** new rows are added and existing rows updated instead of the table being cleared. Components
can then use **incremental processing** to read only the rows changed since their last successful run, or within a
time window you set. How this works, with
examples, is in [Primary keys and incremental loading](/storage/tables/incremental-loading/).

## This section

- [Manage tables](/storage/tables/manage/): create an alias, set a primary key, truncate a table, delete rows.
- [Primary keys and incremental loading](/storage/tables/incremental-loading/): deduplication, incremental loads and
  incremental processing.
- [Table and column descriptions](/storage/tables/descriptions/): where descriptions come from and their limits.
- [Data types](/storage/tables/data-types/): native data types and the table definition.
- [CSV files](/storage/tables/csv-files/), [Table import and export](/storage/tables/uploads/) and
  [Backups and restorations](/storage/tables/backups/).

**Next:** [Manage tables →](/storage/tables/manage/)
