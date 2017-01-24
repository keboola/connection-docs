---
title: Storage
permalink: /storage/
---

* TOC
{:toc}

*See our [Getting Started](/tutorial/load/) tutorial for instructions on how to use Storage.*

As the central [KBC subsystem](/overview/), *Storage* manages everything related to **storing** data and **accessing** it.
It is implemented as a layer on top of various database engines that we use as our *backends*
([MySQL/MariaDB](https://mariadb.org/),
[Redshift](https://aws.amazon.com/redshift/), and [Snowflake](http://www.snowflake.net/)).

As with all other KBC components, everything that can be done through the UI can be also done programatically via
the [Storage API](http://docs.keboola.apiary.io/). See our [developers' guide](https://developers.keboola.com/integrate/storage/) to learn more.
Every operation done in Storage must be authorized via a [token](/storage/tokens/).

## Storage Data
The Storage component manages all data stored in each KBC project:

- [Data tables](/storage/tables/) --- organized into [buckets](/storage/buckets/)
- [Data files](/storage/file-uploads/) --- all raw files uploaded to your project
- [Component configurations](/storage/configurations/)

## Backend Properties
Data in Storage are internally stored in a **database backend**. Specific properties of each backend
are compared in the following table:

Feature | MySQL | Redshift | Snowflake
---------- | ----------- | ---------- | -------------
Partial Import (Deprecated) | ✓ | x | x
Export formats | `RFC`, `ESCAPED`\*, `RAW`\* | `RFC`, `ESCAPED`\*, `RAW`\*  | `RFC`
Maximum number of columns in single table | Max. row size of 65,535 bytes | 1200 | 1200 |
Maximum table cell size | 64kB | 64kB | 1MB |
Sync export (Data Preview) columns limit | x | x | 110 |

\* `ESCAPED` and `RAW` formats are different for `Redshift` and `Mysql`

### Redshift Table Size

The reported table size on the Redshift backend often tends to be inaccurate and 
affects mostly tables with many small incremental loads.

Since this is an issue of Redshift itself, we decided to **recalculate** Table Size by ourselves.
All recalculating jobs are executed **automatically** when loading data to tables and 
when the actual table size is greater than 500MB.

However, any recalculating job can be also called manually by [calling the Table 
Optimize method in Storage API](http://docs.keboola.apiary.io/#reference/tables/table-optimize/optimize-table).

{%comment %}
Backendy
- vypsat a strucne uvest jake jsou mezi nimi rozdily, odkaz na billing a na sales

Jobs/Events ze je to k nicemu a lepsi jsou events u Jobu

kopirovani/sdileni dat mezi projekty
{% endcomment %}
