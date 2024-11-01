---
title: Microsoft SQL
permalink: /components/extractors/database/microsoft-sql/
---

* TOC
{:toc}

[MS SQL](https://www.microsoft.com/en-us/sql-server/) is a relational database management system that stores and retrieves data as requested by other software applications. 

This connector supports the most recent versions of both SQL Server and Azure SQL deployments.

## Default Functionality

This [standard SQL database connector](/components/extractors/database/sqldb) performs queries against the source database to synchronize data. 
It offers a straightforward approach suitable for most use cases, enabling [time-stamp based](/components/extractors/database/#incremental-fetching) CDC replication.

All SQL database connectors are [configured](/components/extractors/database/sqldb/#create-new-configuration) similarly and offer an [advanced mode](/components/extractors/database/sqldb/). 

For guidance on basic configuration, please refer to our tutorial: [Loading Data with Database data source connector](/tutorial/load/database/). 

## CDC (Change Data Capture) Mode

This connector facilitates incremental syncs using the MS SQL's native [Change Data Capture (CDC)](https://learn.microsoft.com/en-us/sql/relational-databases/track-changes/about-change-data-capture-sql-server) functionality.

This mode of [incremental fetching](/components/extractors/database/#incremental-fetching) is available only for tables with CDC enabled on your server. For more details on the server-side setup, 
refer to the [official documentation](https://learn.microsoft.com/en-us/sql/relational-databases/track-changes/enable-and-disable-change-data-capture-sql-server?view=sql-server-ver16).

### Setup

Tables with CDC enabled are indicated in the `Table` dropdown with a `[CDC]` prefix. 

{: .image-popup}
![Screenshot - CDC Table Detail](/components/extractors/database/ms-sql/cdc_table.png)

Upon selecting a CDC-enabled table, the `CDC Mode` option will become visible in the `Incremental Fetching` box. Check this option to activate the CDC syncing for that table.

### Functionality

Once you activate the `CDC mode`, the component will synchronize new increments using the system function [`cdc_get_net_changes](https://learn.microsoft.com/en-us/sql/relational-databases/system-functions/cdc-fn-cdc-get-net-changes-capture-instance-transact-sql?view=sql-server-ver16). 
This utilizes dynamic boundaries based on the component state, ensuring that only the most recent changes are retrieved. The primary advantage of this method is its ability to swiftly capture all modifications, **including deletions**.

The table's initial load will undergo a full sync, similar to the standard [incremental fetching](/components/extractors/database/#incremental-fetching) mode. After the initial load, CDC tables come to play.
The resulting table will contain an additional system column:

- `KBC__DELETED` -> [0,1] 
This flag indicates whether the row was deleted. `0` indicates it was not deleted, and `1` indicates deletion.

### Limitations

- Schema (DDL) changes are not supported. Any alterations post-CDC setup will not reflect in the table. Destructive DDL may lead to synchronization failures with various [errors](https://learn.microsoft.com/en-us/sql/relational-databases/track-changes/about-change-data-capture-sql-server?view=sql-server-ver16#handling-changes-to-source-table).
- The retention window for changes in the CDC tables can vary per [setup](https://learn.microsoft.com/en-us/sql/relational-databases/track-changes/administer-and-monitor-change-data-capture-sql-server?view=sql-server-ver16#structure-of-the-cleanup-job).
  If the configuration runs after a period longer than the CDC retention window (i.e., some older change events might have been already dropped from the CDC table), the component will do a full sync, reloading the entire table. This could prolong execution times.
  <br>***Note:** This behavior can be adjusted.*
