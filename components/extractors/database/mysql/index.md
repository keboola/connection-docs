---
title: MySql
permalink: /components/extractors/database/mysql/
---

* TOC
{:toc}

[MySql](https://www.mysql.com/) is an open source database enables delivering high-performance and scalable web-based and embedded database applications.

Our connectors support most recent versions of MySql / AWS Aurora. You may choose different strategies to sync your data:

- [Query based connector](/components/extractors/database/sqldb/#create-new-configuration)
- [Log based CDC](/components/extractors/database/mysql#log-based-binlog-cdc)


# Query based connector

This is [standard connector](https://components.keboola.com/components/keboola.ex-db-mysql) that performs queries against the source database in order to sync data. 
This is the simplest approach suitable for most use cases, allowing for  [Time-stamp based](/components/extractors/database/#incremental-fetching) CDC replication.

They are all [configured](/components/extractors/database/sqldb/#create-new-configuration) in the same way and 
have an [advanced mode](/components/extractors/database/sqldb/). 

Their basic configuration is also part of the [Tutorial - Loading Data with Database Extractor](/tutorial/load/database/). 

# MySQL Log-based CDC

[This connector](https://components.keboola.com/components/kds-team.ex-mysql-cdc) works with MySQL databases hosted on AWS RDS, Aurora MySQL, and standard non-hosted MySQL. It also supports MariaDB databases.

{% include public-beta-warning.html %}


## Functionality

This connector uses [Debezium connector](https://debezium.io/documentation/reference/stable/connectors/mysql.html)
under the hood.

**NOTE** The component abstracts the underlying Debezium connector configuration and provides a simplified interface for
the user. This means that only subset of the Debezium connector capabilities are exposed to the user.

MySQL has a binary log (binlog) that records all operations in the order in which they are committed to the database.
This includes changes to table schemas as well as changes to the data in tables. MySQL uses the binlog for replication
and recovery.

This MySQL connector reads the binlog, produces change events for row-level `INSERT`, `UPDATE`, and `DELETE` operations.

As MySQL is typically set up to purge binlogs after a specified period of time, the MySQL connector performs an initial
*consistent snapshot* of each of your databases. The MySQL connector reads the binlog from the point at which the
snapshot was made.

**Supported Versions:**

**MySQL**:

- Database: 8.0.x, 8.2, Driver: 8.3.0

**MariaDB**:

- Database: 11.1.2, Driver: 3.2.0

### Snapshots

When the connector is first started, it performs an initial *consistent snapshot* of your database.
This snapshot enables the connector to establish a baseline for the current state of the database.

The connector completes a series of tasks when it performs the snapshot.
The exact steps vary with the snapshot mode and with the table locking policy that is in effect for the database.

You can select from various snapshot modes in the `Sync Options` > `Replication Mode` configuration property.

For more technical detail on how the Snapshots work see the
Debezium [official documentation](https://debezium.io/documentation/reference/stable/connectors/mysql.html#mysql-snapshots).

### Schema Drift

To ensure correct processing of events that occur after a schema change, MySQL includes in the transaction log not only
the row-level changes that affect the data, but also the DDL statements that are applied to the database.
As the connector encounters these DDL statements in the binlog, it parses them and updates an in-memory representation
of each table’s schema.
The connector uses this schema representation to identify the structure of the tables at the time of each insert,
update, or delete operation and to produce the appropriate change event.
In a separate output table `io_debezium_connector_mysql_schema_changes` the connector records all DDL statements along
with the
position in the binlog where each DDL statement appeared.

The connector is capable of seamlessly handling schema changes in the source database, e.g. `ADD`, `DROP` columns.

The schema changes are handled in a following manner:

- **ADD column**
    - Such column is added to the destination table. Historic values will be empty (default not reflected).
    - The DDL will be logged in the resulting `io_debezium_connector_mysql_schema_changes`
- **DROP column**
    - The column will remain in the destination table.
    - The column NOT NULL constraint will be overridden and removed if present.
    - It's values will be NULL/EMPTY since the deletion.
    - The DDL will be emitted into the `io_debezium_connector_mysql_schema_changes`.

#### Schema change table

`io_debezium_connector_mysql_schema_changes` is a table that contains the schema changes that are applied to the
database.
This table is a representation of the
underlying [Debezium Schema Change Topic](https://debezium.io/documentation/reference/stable/connectors/mysql.html#mysql-schema-change-topic).

Note that the DDLs are collected only for the tracked tables by default.

| Column name                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
|-----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `source`                    | The `source` field is structured exactly as standard data change events that the connector writes to table-specific topics. This field is useful to correlate events on different topics.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `ts_ms`                     | Optional field that displays the time at which the connector processed the event. The time is based on the system clock in the JVM running the Kafka Connect task. In the source object, ts\_ms indicates the time that the change was made in the database. By comparing the value for payload.source.ts\_ms with the value for payload.ts\_ms, you can determine the lag between the source database update and Debezium.                                                                                                                                                                                                                      |
| `databaseName` `schemaName` | Identifies the database and the schema that contains the change. The value of the `databaseName` field is used as the message key for the record.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `ddl`                       | This field contains the DDL that is responsible for the schema change. The `ddl` field can contain multiple DDL statements. Each statement applies to the database in the `databaseName` field. Multiple DDL statements appear in the order in which they were applied to the database.  Clients can submit multiple DDL statements that apply to multiple databases. If MySQL applies them atomically, the connector takes the DDL statements in order, groups them by database, and creates a schema change event for each group. If MySQL applies them individually, the connector creates a separate schema change event for each statement. |
| `tableChanges`              | An array of one or more items that contain the schema changes generated by a DDL command.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `type`                      | Describes the kind of change. The value is one of the following:    `CREATE`  Table created.  `ALTER`  Table modified.  `DROP`  Table deleted.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `id`                        | Full identifier of the table that was created, altered, or dropped. In the case of a table rename, this identifier is a concatenation of `*<old>*,*<new>*` table names.                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `table`                     | Represents table metadata after the applied change.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `primaryKeyColumnNames`     | List of columns that compose the table’s primary key.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `columns`                   | Metadata for each column in the changed table.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `attributes`                | Custom attribute metadata for each table change.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

### Data Type Mapping

The MySQL datatypes are mapped to
the [Keboola Connection Base Types](https://help.keboola.com/storage/tables/data-types/#base-types) as follows:

| Source Type | Base Type | Note                                                                             |
|-------------|-----------|----------------------------------------------------------------------------------|
| INTEGER     | INTEGER   |                                                                                  |
| TINYINT     | INTEGER   |                                                                                  |
| SMALLINT    | INTEGER   |                                                                                  |
| MEDIUMINT   | INTEGER   |                                                                                  |
| BIGINT      | INTEGER   |                                                                                  |
| FLOAT       | NUMERIC   |                                                                                  |
| DOUBLE      | NUMERIC   |                                                                                  |
| DECIMAL     | NUMERIC   |                                                                                  |
| DATE        | DATE      | `YYYY-MM-DD` Format When Native Types are disabled                               |
| DATETIME    | TIMESTAMP | `YYYY-MM-DD HH:MM:SS` Format When Native Types are disabled                      |
| TIMESTAMP   | TIMESTAMP | `YYYY-MM-DD HH:MM:SS+TZ` Format When Native Types are disabled. TZ is always UTC |
| TIME        | TIMESTAMP |                                                                                  |
| YEAR        | INTEGER   |                                                                                  |
| CHAR        | STRING    |                                                                                  |
| VARCHAR     | STRING    |                                                                                  |
| BLOB        | STRING    | Representation depends on the selected Binary Handling Mode                      |
| TEXT        | STRING    |                                                                                  |
| TINYBLOB    | STRING    | Representation depends on the selected Binary Handling Mode                      |
| TINYTEXT    | STRING    |                                                                                  |
| MEDIUMBLOB  | STRING    | Representation depends on the selected Binary Handling Mode                      |
| MEDIUMTEXT  | STRING    |                                                                                  |
| LONGBLOB    | STRING    | Representation depends on the selected Binary Handling Mode                      |
| LONGTEXT    | STRING    |                                                                                  |
| ENUM        | STRING    |                                                                                  |
| SET         | STRING    |                                                                                  |
| BIT         | STRING    |                                                                                  |
| BINARY      | STRING    |                                                                                  |
| VARBINARY   | STRING    |                                                                                  |
| GEOMETRY    | STRING    |                                                                                  |
| JSON        | STRING    |                                                                                  |
| BOOLEAN     | BOOLEAN   |                                                                                  |
| BIT(1)      | BOOLEAN   |                                                                                  |

### System columns

Each result table will contain the following system columns:

| Name                    | Base Type | Note                                                                                                                                                                     |
|-------------------------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| KBC__OPERATION          | STRING    | Event type, e.g. `r` - read on init sync; `c` - INSERT; `u` - UPDATE; `d` - DELETE                                                                                       |
| KBC__EVENT_TIMESTAMP_MS | TIMESTAMP | Source database transaction timestamp. MS since epoch if Native types are not enabled.                                                                                   |
| KBC__DELETED            | BOOLEAN   | True when the event is a delete event (the record is deleted)                                                                                                            |
| KBC__BATCH_EVENT_ORDER  | INTEGER   | Numerical order of the events in the current batch (extraction). You can use this in combination with `KBC__EVENT_TIMESTAMP_MS` to mark the latest event per record (ID) |

### Supported MySQL topologies

The Debezium MySQL connector supports the following MySQL topologies:

#### Standalone

When a single MySQL server is used, the server must have the binlog enabled (*and optionally GTIDs enabled*) so the
Debezium MySQL connector can monitor the server. This is often acceptable, since the binary log can also be used as an
incremental [backup](https://dev.mysql.com/doc/refman/8.0/en/backup-methods.html). In this case, the MySQL connector
always connects to and follows this standalone MySQL server instance.

#### Primary and replica

The Debezium MySQL connector can follow one of the primary servers or one of the replicas (*if that replica has its
binlog enabled*), but the connector sees changes in only the cluster that is visible to that server. Generally, this is
not a problem except for the multi-primary topologies.

The connector records its position in the server’s binlog, which is different on each server in the cluster. Therefore,
the connector must follow just one MySQL server instance. If that server fails, that server must be restarted or
recovered before the connector can continue.

#### High available clusters

A variety of [high availability](https://dev.mysql.com/doc/mysql-ha-scalability/en/) solutions exist for MySQL, and they
make it significantly easier to tolerate and almost immediately recover from problems and failures. Most HA MySQL
clusters use GTIDs so that replicas are able to keep track of all changes on any of the primary servers.

#### Multi-primary

[Network Database (NDB) cluster replication](https://dev.mysql.com/doc/refman/8.0/en/mysql-cluster-replication-multi-source.html)
uses one or more MySQL replica nodes that each replicate from multiple primary servers. This is a powerful way to
aggregate the replication of multiple MySQL clusters. This topology requires the use of GTIDs.

A Debezium MySQL connector can use these multi-primary MySQL replicas as sources, and can fail over to different
multi-primary MySQL replicas as long as the new replica is caught up to the old replica. That is, the new replica has
all transactions that were seen on the first replica. This works even if the connector is using only a subset of
databases and/or tables, as the connector can be configured to include or exclude specific GTID sources when attempting
to reconnect to a new multi-primary MySQL replica and find the correct position in the binlog.

#### Hosted

There is support for the Debezium MySQL connector to use hosted options such as Amazon RDS and Amazon Aurora.

Because these hosted options do not allow a global read lock, table-level locks are used to create the *consistent
snapshot*.

### Using the connector with a MariaDB database

Although it is possible to use the MySQL driver to connect and stream changes from MariaDB, it’s best to configure the
Debezium MySQL connector to use the MariaDB adapter mode, so that the connector can take advantage of the MariaDB
driver, and its unique feature stack.

To toggle the MariaDB support mode, the `Connector adapter`configuration property
must be specified with a value of `MariaDB`.

This mode utilizes the MariaDB driver instead of the MySQL driver, meaning that you must also provide the database
protocol and JDBC driver strings that are compliant with MariaDB, see the example below.

After you apply the Maria DB supplemental configuration, the Debezium MySQL connector uses the MariaDB adapter
connector, which natively streams changes from MariaDB binary transaction logs.

## Prerequisites

### Setting up MySQL

Some MySQL setup tasks are required before you can install and run a Debezium connector.

#### Creating a user

A Debezium MySQL connector requires a MySQL user account. This MySQL user must have appropriate permissions on all
databases for which the Debezium MySQL connector captures changes.

Prerequisites

* A MySQL server.
* Basic knowledge of SQL commands.

Procedure

1. Create the MySQL user:

```sql
CREATE USER 'user'@'localhost' IDENTIFIED BY 'password';
```

2. Grant the required permissions to the user:

```sql
GRANT SELECT, RELOAD, SHOW DATABASES, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'user' IDENTIFIED BY 'password';
```

The table below describes the permissions.

If using a hosted option such as Amazon RDS or Amazon Aurora that does not allow a global read lock, table-level locks are used to create the *consistent snapshot*. In this case, you need to also grant `LOCK TABLES` permissions to the user that you create. See [snapshots](#snapshots) for more details.


3. Finalize the user’s permissions:

```
mysql> FLUSH PRIVILEGES;
```

Descriptions of user permissions:

| Keyword                    | Description                                                                                                                                                              |
|----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `SELECT`                   | Enables the connector to select rows from tables in databases. This is used only when performing a snapshot.                                                             |
| `RELOAD`                   | Enables the connector the use of the `FLUSH` statement to clear or reload internal caches, flush tables, or acquire locks. This is used only when performing a snapshot. |
| `SHOW DATABASES`           | Enables the connector to see database names by issuing the `SHOW DATABASE` statement. This is used only when performing a snapshot.                                      |
| `REPLICATION SLAVE`        | Enables the connector to connect to and read the MySQL server binlog.                                                                                                    |
| `REPLICATION CLIENT`       | Enables the connector the use of the following statements:   * `SHOW MASTER STATUS` * `SHOW SLAVE STATUS` * `SHOW BINARY LOGS`     The connector always requires this.   |
| `ON`                       | Identifies the database to which the permissions apply.                                                                                                                  |
| `TO 'user'`                | Specifies the user to grant the permissions to.                                                                                                                          |
| `IDENTIFIED BY 'password'` | Specifies the user’s MySQL password.                                                                                                                                     |

#### Enabling the binlog

You must enable binary logging for MySQL replication. The binary logs record transaction updates for replication tools
to propagate changes.

Prerequisites

* A MySQL server.
* Appropriate MySQL user privileges.

Procedure

1. Check whether the `log-bin` option is already on:

```
// for MySql 5.x
mysql> SELECT variable_value as "BINARY LOGGING STATUS (log-bin) ::"
FROM information_schema.global_variables WHERE variable_name='log_bin';
// for MySql 8.x
mysql> SELECT variable_value as "BINARY LOGGING STATUS (log-bin) ::"
FROM performance_schema.global_variables WHERE variable_name='log_bin';
```

2. If it is `OFF`, configure your MySQL server configuration file with the following properties, which are described in
   the table below:

```
server-id         = 223344 # Querying variable is called server_id, e.g. SELECT variable_value FROM information_schema.global_variables WHERE variable_name='server_id';
log_bin                     = mysql-bin
binlog_format               = ROW
binlog_row_image            = FULL
binlog_expire_logs_seconds  = 864000
```

3. Confirm your changes by checking the binlog status once more:

```
// for MySql 5.x
mysql> SELECT variable_value as "BINARY LOGGING STATUS (log-bin) ::"
FROM information_schema.global_variables WHERE variable_name='log_bin';
// for MySql 8.x
mysql> SELECT variable_value as "BINARY LOGGING STATUS (log-bin) ::"
FROM performance_schema.global_variables WHERE variable_name='log_bin';
```

4. If you run MySQL on Amazon RDS, you must enable automated backups for your database instance for binary logging to
   occur.
   If the database instance is not configured to perform automated backups, the binlog is disabled, even if you apply
   the settings described in the previous steps.

Descriptions of MySQL binlog configuration properties:

| Property                     | Description                                                                                                                                                                                                                                                                                                                                         |
|------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `server-id`                  | The value for the `server-id` must be unique for each server and replication client in the MySQL cluster. During MySQL connector set up, Debezium assigns a unique server ID to the connector.                                                                                                                                                      |
| `log_bin`                    | The value of `log_bin` is the base name of the sequence of binlog files.                                                                                                                                                                                                                                                                            |
| `binlog_format`              | The `binlog-format` must be set to `ROW` or `row`.                                                                                                                                                                                                                                                                                                  |
| `binlog_row_image`           | The `binlog_row_image` must be set to `FULL` or `full`.                                                                                                                                                                                                                                                                                             |
| `binlog_expire_logs_seconds` | The `binlog_expire_logs_seconds` corresponds to deprecated system variable `expire_logs_days`. This is the number of seconds for automatic binlog file removal. The default is `2592000`, which equals 30 days. Set the value to match the needs of your environment. See [MySQL purges binlog files](#mysql-purges-binlog-files-used-by-debezium). |

#### Enabling GTIDs

Global transaction identifiers (GTIDs) uniquely identify transactions that occur on a server within a cluster. Though
not required for a Debezium MySQL connector, using GTIDs simplifies replication and enables you to more easily confirm
if primary and replica servers are consistent.

GTIDs are available in MySQL 5.6.5 and later. See
the [MySQL documentation](https://dev.mysql.com/doc/refman/8.0/en/replication-options-gtids.html#option_mysqld_gtid-mode)
for more details.

**Prerequisites**

* A MySQL server.
* Basic knowledge of SQL commands.
* Access to the MySQL configuration file.

**Procedure**

1. Enable `gtid_mode`:

```sql
mysql> gtid_mode=ON
```

2. Enable `enforce_gtid_consistency`:

```sql
mysql> enforce_gtid_consistency=ON
```

3. Confirm the changes:

```sql
mysql> show global variables like '%GTID%';
```

Result

```
+--------------------------+-------+
| Variable_name            | Value |
+--------------------------+-------+
| enforce_gtid_consistency | ON    |
| gtid_mode                | ON    |
+--------------------------+-------+
```

Descriptions of GTID options:

| Option                     | Description                                                                                                                                                                                                                       |
|----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `gtid_mode`                | Boolean that specifies whether GTID mode of the MySQL server is enabled or not.   * `ON` = enabled * `OFF` = disabled                                                                                                             |
| `enforce_gtid_consistency` | Boolean that specifies whether the server enforces GTID consistency by allowing the execution of statements that can be logged in a transactionally safe manner. Required when using GTIDs.   * `ON` = enabled * `OFF` = disabled |

#### Configuring session timeouts

When an initial consistent snapshot is made for large databases, your established connection could timeout while the
tables are being read. You can prevent this behavior by configuring `interactive_timeout` and `wait_timeout` in your
MySQL configuration file.

**Prerequisites**

* A MySQL server.
* Basic knowledge of SQL commands.
* Access to the MySQL configuration file.

**Procedure**

1. Configure `interactive_timeout`:

```
mysql> interactive_timeout=<duration-in-seconds>
```

2. Configure `wait_timeout`:

```
mysql> wait_timeout=<duration-in-seconds>
```

Descriptions of MySQL session timeout options:

| Option                | Description                                                                                                                                                                                                                                        |
|-----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `interactive_timeout` | The number of seconds the server waits for activity on an interactive connection before closing it. See [MySQL’s documentation](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_interactive_timeout) for more details. |
| `wait_timeout`        | The number of seconds the server waits for activity on a non-interactive connection before closing it. See [MySQL’s documentation](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_wait_timeout) for more details.     |

#### Enabling query log events

You might want to see the original `SQL` statement for each binlog event.
Enabling the `binlog_rows_query_log_events` option in the MySQL configuration or `binlog_annotate_row_events` in the
MariaDB configuration file allows you to do this.

This option is available in MySQL 5.6 and later.

Prerequisites

* A MySQL server.
* Basic knowledge of SQL commands.
* Access to the MySQL configuration file.

Procedure

* Enable `binlog_rows_query_log_events` in MySQL or `binlog_annotate_row_events` in MariaDB:

```
mysql> binlog_rows_query_log_events=ON
```

```
mariadb> binlog_annotate_row_events=ON
```

`binlog_rows_query_log_events` or `binlog_annotate_row_events` is set to a value that enables/disables support for
including the original `SQL` statement in the binlog entry.

	+ `ON` = enabled
	+ `OFF` = disabled

#### Validating binlog row value options

Check `binlog_row_value_options` variable, and make sure that value is **not** set to `PARTIAL_JSON`, since in such case
connector might fail to consume **UPDATE** events.

**Prerequisites**

* A MySQL server.
* Basic knowledge of SQL commands.
* Access to the MySQL configuration file.

Procedure

1. Check current variable value

```sql
show global variables where variable_name = 'binlog_row_value_options';
```

2. Result

```
+--------------------------+-------+
| Variable_name            | Value |
+--------------------------+-------+
| binlog_row_value_options |       |
+--------------------------+-------+
```

3. In case value is `PARTIAL_JSON`, unset this variable by:

```sql
set @@global.binlog_row_value_options="" ;
```



### Signalling table

The connector needs access to a signalling table in the source database. The signalling table is used by to connector to
store various signal events and incremental snapshot watermarks.

#### Creating a signaling data collection

You create a signaling table by submitting a standard SQL DDL query to the source database.

**Prerequisites**

You have sufficient access privileges to create a table on the source database.

**Procedure**

Submit a SQL query to the source database to create a table that is consistent with the required structure, as shown in
the following example:

The following example shows a CREATE TABLE command that creates a three-column debezium_signal table:

```sql
CREATE TABLE debezium_signal (id VARCHAR(42) PRIMARY KEY, type VARCHAR(32) NOT NULL, data TEXT NULL);
```

## Configuration

### Connection Settings

{: .image-popup}
![img.png](/components/extractors/database/mysql/img.png)

- **Connector adapter**: The connector adapter to be used. The following options are available:
    - `MySQL`: The connector uses the MySQL driver to connect to the MySQL database.
    - `MariaDB`: The connector uses the MariaDB driver to connect to the MariaDB database.
- **Host**: The hostname of the MySQL server.
- **Port**: The port number of the MySQL server.
- **User**: The username to be used to connect to the MySQL server.
- **Password**: The password to be used to connect to the MySQL server.

#### SSH Tunnel

You may opt to use a SSH Tunnel to secure your connection. Find detailed instructions for setting up an SSH tunnel in
the [developer documentation](https://developers.keboola.com/integrate/database/. While setting up an SSH tunnel requires some work, it is the most reliable and secure
option for connecting to your database server.

### Data Source


{: .image-popup}
![img_1.png](/components/extractors/database/mysql/img_1.png)

- **Schemas**: The schemas to be included in the CDC. The schemas are the databases in the MySQL instance.
- **Tables**: The tables to be included in the CDC. If left empty, all tables in the selected schemas will be included.

#### Column Filters

The column filters are used to specify which columns should be included in the extraction. The lists can be defined as a
comma-separated list of
fully-qualified names, i.e. in the form `schemaName.tableName.columnName`.

To match the name of a column, connector applies the regular expression that you specify as an **anchored regular
expression**. That is, the expression is used to match the entire name string of the column; it does not match
substrings that might be present in a column name.

**TIP**: To test your regex expressions, you can use online tools such as [this one](https://regex101.com/).

- **Column Filter Type**: The column filter type to be used. The following options are available:
    - `None`: No filter applied, all columns in all tables will be extracted.
    - `Include List`: The columns to be included in the CDC.
    - `Exclude List`: The columns to be excluded from the CDC.
- **Column List**: List of the fully-qualified column names or regular expressions that match the columns to be included
  or excluded (based on the selected filter type).

### Sync Options

{: .image-popup}
![img_2.png](/components/extractors/database/mysql/img_2.png)

- **Signalling Table**: The name of the signalling table in the source database. The signalling table is used by the
  connector to store various signal events and incremental snapshot watermarks. See more in
  the [Signalling table](#signalling-table) section.
- **Replication Mode**: The replication mode to be used. The following options are available:
    - `Standard`: The connector performs an initial *consistent snapshot* of each of your databases. The connector reads
      the binlog from the point at which the snapshot was made.
    - `Changes only`: The connector reads the changes from the binlog immediately, skipping the initial load.
- **Binary data handler**: Specifies how binary columns, for example, blob, binary, varbinary, should be represented in
  change events. The following options are available:
    - `Base64`: represents binary data as a base64-encoded String.
    - `Base64-url-safe`: represents binary data as a base64-url-safe-encoded String.
    - `Hex`: represents binary data as a hex-encoded (base16) String.
    - `Bytes`: represents binary data as a byte array.
- **Snapshot Fetch Size**: During a snapshot, the connector reads table content in batches of rows. This property
  specifies the maximum number of rows in a batch. The default value is `10240`.
- **Snapshot parallelism**: Specifies the number of threads that the connector uses when performing an initial snapshot.
  To enable parallel initial snapshots, set the property to a value greater than 1. In a parallel initial snapshot, the
  connector processes multiple tables concurrently. Note that setting up high values may lead to OOM errors. Change the
  default value on your own risk.

### Destination

The destination is a mandatory configuration option. It is used to specify how the data is loaded into the destination
tables.

{: .image-popup}
![img_3.png](/components/extractors/database/mysql/img_3.png)

#### Load Type

The `Load Type` configuration option specifies how the data is loaded into the destination tables.

The following options are available:

- `Incremental Load - Deduplicated`: The connector upserts records into the destination table. The connector uses the
  primary key to perform upsert. The connector does not delete records from the destination table.
- `Incremental Load - Append`: The connector produces no primary key. The order of the events will be given by
  the `KBC__EVENT_TIMESTAMP_MS` column + helper `KBC__BATCH_EVENT_ORDER` column which contains the order in one batch.
- `Full Load - Deduplicated`: The destination table data will be replaced with the current batch and deduplicated by the
  primary key.
- `Full Load - Append`: The destination table data will be replaced with the current batch and the batch won't be
  deduplicated.

#### Output bucket

Optionally, you may specify an output bucket bucket in Keboola Storage (without the stage prefix) that will be used to store the result tables.
