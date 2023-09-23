---
title: Database Data Source Connectors
permalink: /components/extractors/database/
redirect_from:
    - /extractors/database/

---

* TOC
{:toc}

Data source connectors import data from external sources and integrate it to the Keboola environment.

## SQL Databases

There are a number of connectors for [**SQL databases**](/components/extractors/database/sqldb/):

- [Cloudera Impala](https://www.cloudera.com/products/open-source/apache-hadoop/impala.html)
- [Firebird](http://www.firebirdsql.org/)
- [IBM DB2](https://www.ibm.com/analytics/db2)
- [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/)
- [MySQL](https://www.mysql.com/)
- [Oracle](https://www.oracle.com/index.html)
- [PostgreSQL](https://www.postgresql.org/)
- [Redshift](https://aws.amazon.com/redshift/)
- [Snowflake](https://www.snowflake.com/)
- [Teradata](https://www.teradata.com/)

There may exist several variants of connectors for each database type, depending on the strategy used. 
In general there are be two types of connectors:

### Query Based Connectors

These connectors work on a relational level, meaning they perform queries against the source database in order to sync data. 
This is the simplest approach suitable for most use cases, allowing for Timestamp-based CDC replication.

They are all [configured](/components/extractors/database/sqldb/#create-new-configuration) in the same way and 
have an [advanced mode](/components/extractors/database/sqldb/). 

Their basic configuration is also part of the [Tutorial - Loading Data from Database](/tutorial/load/database/). 

### Log based Sync Connectors

This type of connector performs log-based replication. There connectors may have different set of features and UI options, depending on the database type. 
Use log-based connectors for more advanced use-cases where high performance and less load on the source DB system is required.

Typically, these connectors are useful in following scenarios:

- Users require to sync every change to the source including deletes
- The source database does not contain any suitable timestamp column to
  enable [incremental fetching](/components/extractors/database/#incremental-fetching) and contain extremely large
  tables.
- The source cannot be queried directly to eliminate any additional load.

## NoSQL Databases

Unlike the connectors for SQL databases, connectors for **NoSQL databases** require a different configuration (except the
[BigQuery data source connector](/components/extractors/database/bigquery/) for the [BigQuery](https://cloud.google.com/bigquery/) 
database, which is quite similar to SQL databases and also supports the [advanced mode](/components/extractors/database/sqldb/)):

- [MongoDB connector](/components/extractors/database/mongodb/) for the [MongoDB](https://www.mongodb.com/) database and the [CosmosDB MongoDB API](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-introduction).
- [CosmosDB connector](/components/extractors/database/cosmosdb/) for the [CosmosDB SQL API](https://docs.microsoft.com/en-us/azure/cosmos-db/tutorial-query-sql-api).
- [Azure Storage Table connector](/components/extractors/database/cosmosdb/) for the [Azure Table storage](https://azure.microsoft.com/en-us/services/storage/tables) and the [Cosmos DB Table API](https://docs.microsoft.com/en-us/azure/cosmos-db/table-introduction).

## Connecting to Database
The connection to your internal database must be well secured. If you, or your system administrator,
want to avoid exposing your database server to the internet, we highly recommend setting up an SSH Tunnel for the connection.

{: .image-popup}
![Schema - SSH tunnel](/components/extractors/database/ssh-tunnel.jpg)

A [Secure Shell (SSH)](https://en.wikipedia.org/wiki/Secure_Shell) [tunnel](https://en.wikipedia.org/wiki/Tunneling_protocol)
consists of an encrypted connection created through an SSH protocol connection. You can set up this tunnel to connect to 
your database server located in your private network that you do not want to be accessed directly from the internet. The SSH
connection is encrypted and uses a public-private key pair for user authorization.

Find detailed instructions for setting up an SSH tunnel in the [developer documentation](https://developers.keboola.com/integrate/database/).
While setting up an SSH tunnel requires some work, it is the most reliable and secure option for connecting to your database server.


## Change Data Capture (CDC)

Change data capture (CDC) refers to the process of identifying and capturing changes made to data in a database and then delivering those changes to the destination system. 
In short, CDC identifies the rows in source tables that have changed since the last replication and propagates them to the Storage. 

There may be different approaches to the CDC. Keboola database connectors support variety of these approaches, so you can choose the one most suitable.

- **Timestamp-based** - Using last_updated timestamp or other incremental column the database can be queried to retrieve only latest changes each run.
- **Trigger-based** - DBAs may create set of triggers that replicate change on each INSERT, UPDATE, DELETE. These tables can be then queried and changes replicated in the destination
- **Log-based** - Reading the database low-level proprietary transaction log directly to replicate the changes.



| CDC Type                                                                     | Pros                                                                               | Cons                                                                                                                                                         | Keboola Implementation                                                                 |
|------------------------------------------------------------------------------|------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| [**Timestamp-based**](/components/extractors/database/#incremental-fetching) | - low cost<br/>-simple to use                                                      | - may increase load on the database<br/>- Can only process soft-deletes not DELETE statements<br/>- the source tables must have appropriate column available | Incremental Fetching                                                                   |
| **Trigger-based**                                                            | - can capture DELETES<br/>- customizable                                           | - executional overhead and higher load on the production<br/>- Implementation overhead<br/>- events may need to be replicated in downstream logic            | Using standard [DB Extractors](/components/extractors/database/sqldb/)                 |
| [**Log-based**](/components/extractors/database/#log-based-replication)      | - no computational overhead on production<br/>- can detect hard DELETEs<br/>- Fast | - higher costs<br/>- may be overkill for small use-cases                                                                                                     | Binlog type extractors like [MySql Binlog CDC](/components/extractors/database/mysql/) |



### Incremental Fetching

Some database connectors support the feature of **Incremental Fetching**. This is an implementation of `timestamp-based replication`. Incremental fetching allows to dramatically 
reduce the amount of data loaded from the source database server if the nature of the database permits. Incremental fetching
can be used when the source table contains an ordering (ordinal) column and no rows are deleted (or the deletions are not important).
There are two typical scenarios:

- A table to which rows are only added, and the rows have numeric and raising ID.
- A table in which rows are added and modified, and it contains a column with last modification time.

To enable incremental fetching, you have to specify the ordering column. When incremental fetching is 
enabled, the rows in the table are extracted in the order specified by the ordering column. The last
fetched value is recorded in the configuration state. When the extraction runs again, only new rows 
are fetched from the sourced database. To configure incremental fetching, go to table details:

{: .image-popup}
![Screenshot - Configuration Detail](/components/extractors/database/db-detail.png)

Then select the ordering column:

{: .image-popup}
![Screenshot - Incremental Fetching](/components/extractors/database/incremental-fetching-1.png)

The last fetched value is displayed in the configuration:

{: .image-popup}
![Screenshot - Incremental Fetching](/components/extractors/database/incremental-fetching-2.png)

The rows are fetched from the source table including the last fetched value. Therefore it is
ideal to have the ordering column set as a primary key so that you don't receive duplicated rows in 
the Storage table. In case you need to fetch the entire table, you can clear the stored value.

This incremental fetching feature is related to [**incremental loading**](/storage/tables/#incremental-loading).
While not required, it is recommended to turn on incremental loading when fetching data incrementally, otherwise
the table in Storage will contain only newly added rows. This may sound like a good idea when you want to
process only the newly added rows. In that case, however, you should do so using 
[**incremental processing**](/storage/tables/#incremental-processing). The advantage of using incremental processing over 
having only newly added rows in a Storage table is that the table contains all loaded data and it is not necessary 
to synchronize extraction and processing.


### Log-based replication

Due to the differences in log replication implementation in different systems, 
our log-based connectors may differ in configuration options and behaviour based on the source database.

In general the log-based connectors function in this way:

- The frequency of updates depends on the user (e.g. every 5min) hence run in micro-batches.
- Initial load is performed as full-sync using chunked direct queries.
- Each consecutive load is performed from the database log incrementally.
- Sync modes
  - Append mode -> capture every change and append to destination table. The result table might need to be processed further to replicate the source.
  - Standard mode -> deduplicate each batch (keep only latest event) and upsert to destination. The result table is replica of the source.
- Some connectors can handle Schema changes without enforcing full-sync.
- Some connectors enforce full-sync on schema change.

The currently supported log based connectors:

- [MySql Binlog CDC](/components/extractors/database/mysql/)