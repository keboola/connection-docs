---
title: Storage
permalink: /storage/
---

* TOC
{:toc}

*See our [Getting Started](/tutorial/load/) tutorial for instructions on how to use Storage.*

As the central [KBC subsystem](/overview/), Storage manages everything related to **storing** data and **accessing** it.
It is implemented as a layer on top of database engines that we use as our backends
([Snowflake](http://www.snowflake.net/), [Redshift](https://aws.amazon.com/redshift/)).
By default all projects use the Snowflake backend as it is faster and more scalable. If, for some
reason, you need to use the Redshift backend, contact our [support](/management/support).

As with all other KBC components, everything that can be done through the UI can be also done programmatically
via the [Storage API](http://docs.keboola.apiary.io/).
See our [developers guide](https://developers.keboola.com/integrate/storage/) to learn more.
Every Storage operation must be authorized via a [token](/management/project/tokens/).
It is also recorded in [Events](/management/project/tokens/#token-events) and
[Jobs](/management/jobs/).

## Storage Data
The Storage component manages all data stored in each KBC project:

- [Data tables](/storage/tables/) (Table Storage) --- organized into [buckets](/storage/buckets/)
- [Data files](/storage/file-uploads/) (File Storage) --- all raw files uploaded to your project
- [Component configurations](/storage/configurations/)

Different storage technologies are used for the above data --- [Amazon S3 Storage](https://aws.amazon.com/s3/)
for [Files Storage](/storage/file-uploads/) and [Amazon Redshift](https://aws.amazon.com/redshift/) or
[Snowflake](https://www.snowflake.net/product/) for [Table Storage](/storage/tables/). The database system
behind the Table Storage is referred to as a **backend**.

### Backend Properties
Data in Table Storage are internally stored in a **database backend** (project backend). Specific properties of
each backend are compared in the following table:

Feature | Redshift | Snowflake
---------- | ---------- | -------------
Export formats | `RFC`  | `RFC`
Maximum number of columns in single table | 1200 | 1200 |
Maximum table cell size |  64kB | 1MB |

### Redshift Table Size
The table size reported on the Redshift backend often tends to be inaccurate, especially for tables with
many small incremental loads.

Since this is an issue of Redshift itself, we decided to **recalculate** the table size by ourselves.
All recalculating jobs are executed **automatically** when loading data to tables and
when the actual table size is greater than 500MB.

However, any recalculating job can be also invoked manually by [calling the Table
Optimize method in Storage API](http://docs.keboola.apiary.io/#reference/tables/table-optimize/optimize-table).
