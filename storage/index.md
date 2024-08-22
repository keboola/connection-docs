---
title: Storage
permalink: /storage/
---

* TOC
{:toc}

*See our [Getting Started](/tutorial/load/) tutorial for instructions on how to use Storage.*

As the central [Keboola subsystem](/overview/), Storage manages everything related to **storing** data and **accessing** it.
It is implemented as a layer on top of database engines that we use as our backends
([Snowflake](https://www.snowflake.com/), [Redshift](https://aws.amazon.com/redshift/)).
By default all projects use the Snowflake backend as it is faster and more scalable. If, for some
reason, you need to use the Redshift backend, contact our [support](/management/support).

As with all other Keboola components, everything that can be done through the UI can be also done programmatically
via the [Storage API](https://keboola.docs.apiary.io/).
See our [developers guide](https://developers.keboola.com/integrate/storage/) to learn more.
Every Storage operation must be authorized via a [token](/management/project/tokens/). 
It is also recorded in [Events](/management/project/tokens/#token-events) and
[Jobs](/management/jobs/).

## Storage Data
The Storage component manages all data stored in each Keboola project:

- [Data tables](/storage/tables/) (Table Storage) --- organized into [buckets](/storage/buckets/)
- [Data files](/storage/files/) (File Storage) --- all raw files uploaded to your project
- [Component configurations](/components/)

Different storage technologies are used for the above data --- [Amazon S3 Storage](https://aws.amazon.com/s3/)
for [File Storage](/storage/files/) and [Amazon Redshift](https://aws.amazon.com/redshift/) or
[Snowflake](https://www.snowflake.com/product/) for [Table Storage](/storage/tables/). The database system
behind the Table Storage is referred to as a **backend**.

Data in Table Storage is internally stored in a **database backend** (project backend). From the point of
view of the Keboola user, the only notable difference is that Snowflake allows 16MB table cell size while
Redshift is limited to 64kB table cell size.

### Redshift Table Size
The table size reported on the Redshift backend often tends to be inaccurate, especially for tables with
many small incremental loads.

Since this is an issue of Redshift itself, we decided to **recalculate** the table size by ourselves.
All recalculating jobs are executed **automatically** when loading data to tables and
when the actual table size is greater than 500MB.

However, any recalculating job can be also invoked manually by [calling the Table
Optimize method in Storage API](https://keboola.docs.apiary.io/#reference/tables/table-optimize/optimize-table).
