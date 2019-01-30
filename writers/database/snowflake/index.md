---
title: Snowflake
permalink: /writers/database/snowflake/
---

* TOC
{:toc}

This writer sends data to a [Snowflake](https://www.snowflake.com/) database. It can either write data
to an existing Snowflake database, or to a new database it provisions to you. The latter case is useful
for sharing your data in form of an SQL database with some service. For example, you can use it to send
data to [Tableau](https://www.tableau.com/), [PowerBI](https://powerbi.microsoft.com/en-us/), etc.

## Create New Configuration
Find the Tableau writer in the list of writers and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/writers/database/snowflake/ui1.png)

The first step is to **Setup Credentials**:

{: .image-popup}
![Screenshot - Main page](/writers/database/snowflake/ui2.png)

There are two modes of operation of the writer:

- **Own Snowflake database** --- Use this when you have your own Snowflake database - i.e you have a contract with Snowflake, or someone gave you credentials of a database to write to.
- **Keboola Snowflake database** --- In this mode, the writer will create a new database for you and **give you credentials** to it.

{: .image-popup}
![Screenshot - Credential types](/writers/database/snowflake/credentials.png)

### Own Snowflake database
You need to provide *host name* (account name), *user name*, *password*, *database name* and *schema*. We highly recommend that you create
a dedicated user for the writer in your snowflake database. The user needs to have the following permissions:

{: .image-popup}
![Screenshot - Own Credentials](/writers/database/snowflake/own-credentials.png)

### Keboola Snowflake database
The credentials will be provisioned for you:

{: .image-popup}
![Screenshot - Provisioned Credentials](/writers/database/snowflake/provisioned-credentials.png)

You can share the credentials with whatever service needs to access your data --- for example with [Tableau Online](https://www.tableau.com/products/cloud-bi).
Note that the database is provided solely for the purpose of **sharing your existing data** with outside world. This means that it must not be receiving any data (outside those provided by the writer itself of course). This is a contractual limitation.
Also note that the number of provisioned snowflake databases is part of [Project limits](/management/project/limits/).

## Writing
There are two options how the extractor can write data to tables - full load mode and incremental mode.
In incremental mode, the data are bulk inserted into the table and the table structure must match 
(including the data types). That means the structure of the target table will not be modified.

Swap

## Using the Snowflake writer to connect to Tableau


