---
title: Microsoft SQL
permalink: /components/extractors/database/microsoft-sql/
---

* TOC
{:toc}

[MS SQL](https://www.microsoft.com/en-us/sql-server/) is a relational database management system stores and retrieves data as requested by other software applications. 

This connector supports most recent versions of the SQL Server and Azure SQL deployments.



## Default Functionality

This is [standard SQL Database connector](/components/extractors/database/sqldb) that performs queries against the source database in order to sync data. 
This is the simplest approach suitable for most use cases, allowing for [Time-stamp based](/components/extractors/database/#incremental-fetching) CDC replication.

All SQL Database connectors are [configured](/components/extractors/database/sqldb/#create-new-configuration) in the same way and have an [advanced mode](/components/extractors/database/sqldb/). 

To guide you through the basic configuration, you may follow the [Tutorial - Loading Data with Database Extractor](/tutorial/load/database/). 

## CDC (Change Data Capture) mode

This connector supports incremental syncs using the MS SQL native [Change Data Capture (CDC)](https://learn.microsoft.com/en-us/sql/relational-databases/track-changes/about-change-data-capture-sql-server) functionality.

This mode of [Incremental Fetching](/components/extractors/database/#incremental-fetching) is available only for tables for which the CDC is enabled in your server. See the [official documentation](https://learn.microsoft.com/en-us/sql/relational-databases/track-changes/enable-and-disable-change-data-capture-sql-server?view=sql-server-ver16) 
for more information on the setup on the server side.

### Setup

The tables that have CDC enabled are marked in the `Table` dropdown with `[CDC]` prefix. 

{: .image-popup}
![Screenshot - CDC Table Detail](/components/extractors/database/ms-sql/cdc_table.png)

Once you select the CDC enabled table, the option `CDC Mode` will appear in the `Incremental Fetching` box. Check it to enable the CDC syncing of the table.

### Functionality

Once you enable the `CDC mode` the component will sync the new increments using the system function [`cdc_get_net_changes](https://learn.microsoft.com/en-us/sql/relational-databases/system-functions/cdc-fn-cdc-get-net-changes-capture-instance-transact-sql?view=sql-server-ver16) with dynamic boundaries based on component state, 
this will ensure that only recent changes will be pulled. The biggest advantage of this approach is that it can capture quickly all changes **including deletes**.

Initial load of the table will perform a Full Sync just like the standard  [Incremental Fetching](/components/extractors/database/#incremental-fetching) mode. After the initial load, CDC tables will be used and the result table will contain the following additional system column:

- `KBC__DELETED` -> [0,1] flag marking if the row was deleted. `0` -> not deleted. `1` -> deleted.

### Limitations

- The schema (DDL) changes are not supported and will not be reflected to the table after the CDC is set up. If the DDL is destructive the sync may fail with various [errors](https://learn.microsoft.com/en-us/sql/relational-databases/track-changes/about-change-data-capture-sql-server?view=sql-server-ver16#handling-changes-to-source-table)
- The retention window of changes available in the CDC tables may differ per [setup](https://learn.microsoft.com/en-us/sql/relational-databases/track-changes/administer-and-monitor-change-data-capture-sql-server?view=sql-server-ver16#structure-of-the-cleanup-job).
  If the configuration is executed after the CDC table rolls out (e.g. some events would be missing), the component automatically falls back to a full sync and reloads the entire table. Which may cause longer execution. Note that this behaviour is configurable.





