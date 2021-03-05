---
title: Database Extractors
permalink: /components/extractors/database/
redirect_from:
    - /extractors/database/

---

* TOC
{:toc}

Extractors import data from external sources and integrate it to the Keboola Connection environment.

## SQL databases

There are a number of extractors for [**SQL databases**](/components/extractors/database/sqldb/):

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

They are all [configured](/components/extractors/database/sqldb/#create-new-configuration) in the same way and 
have an [advanced mode](/components/extractors/database/sqldb/). 
- Their basic configuration is also part of the [Tutorial - Loading Data with Database Extractor](/tutorial/load/database/). 

## NoSQL databases

Unlike the extractors for SQL databases, extractors for **NoSQL databases** require a different configuration (except the [BigQuery Extractor](/components/extractors/database/bigquery/) for the [BigQuery](https://cloud.google.com/bigquery/) database, which is quite similar to SQL databases and also supports the [advanced mode](/components/extractors/database/sqldb/)):

- [MongoDB extractor](/components/extractors/database/mongodb/) for the [MongoDB](https://www.mongodb.com/) database and the [CosmosDB MongoDB API](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-introduction).
- [CosmosDB extractor](/components/extractors/database/cosmosdb/) for the [CosmosDB SQL API](https://docs.microsoft.com/en-us/azure/cosmos-db/tutorial-query-sql-api).
- [Azure Storage Table extractor](/components/extractors/database/cosmosdb/) for the [Azure Table storage](https://azure.microsoft.com/en-us/services/storage/tables) and the [Cosmos DB Table API](https://docs.microsoft.com/en-us/azure/cosmos-db/table-introduction).

## Connecting to Database
The connection to your internal database must be well secured. If you, or your system administrator, 
want to avoid exposing your database server to the internet, we highly recommend setting up an SSH Tunnel for the connection.

{: .image-popup}
![Schema - SSH tunnel](/components/extractors/database/ssh-tunnel.jpg)

A [Secure Shell (SSH)](https://en.wikipedia.org/wiki/Secure_Shell) [tunnel](https://en.wikipedia.org/wiki/Tunneling_protocol) consists of an encrypted connection created
through an SSH protocol connection. You can set up this tunnel to connect to your database server located in your private network that you do not want
to be accessed directly from the internet. The SSH connection is encrypted and uses a public-private key pair for user authorization.

Find detailed instructions for setting up an SSH tunnel in the [developer documentation](https://developers.keboola.com/integrate/database/).
While setting up an SSH tunnel requires some work, it is the most reliable and secure option for connecting to your database server.

## Incremental Fetching
Some database extractors support the feature of **Incremental Fetching**. Incremental fetching allows to dramatically 
reduce the amount of data loaded from the source database server if the nature of the database permits. Incremental fetching
can be used when the source table contains an ordering (ordinal) column and no rows are deleted (or the deletions are not important).
There are two typical scenarios:

- A table to which rows are only added and the rows have numeric and raising ID.
- A table in which rows are added and modified and it contains a column with last modification time.

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

This incremental fetching feature is related to [**Incremental Loading**](/storage/tables/#incremental-loading).
While not required, it is recommended to turn on incremental loading when fetching data incrementally, otherwise
the table in Storage will contain only newly added rows. This may sound like a good idea when you want to
process only the newly added rows. In that case, however, you should do so using 
[**Incremental Processing**](/storage/tables/#incremental-processing). The advantage of using incremental processing over 
having only newly added rows in a Storage table is that the table contains all loaded data and it is not necessary 
to synchronize extraction and processing.
