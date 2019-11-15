---
title: Database Extractors
permalink: /components/extractors/database/
redirect_from:
    - /extractors/database/

---

* TOC
{:toc}

Extractors import data from external sources and integrate it to the Keboola Connection (KBC) environment.

There are a number of extractors for [**SQL databases**](/components/extractors/database/sqldb/):

- [Cloudera Impala](https://www.cloudera.com/products/open-source/apache-hadoop/impala.html)
- [Firebird](http://www.firebirdsql.org/)
- [IBM DB2](https://www.ibm.com/analytics/us/en/technology/db2/)
- [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/)
- [MySQL](https://www.mysql.com/)
- [Oracle](https://www.oracle.com/index.html)
- [PostgreSQL](https://www.postgresql.org/)
- [Redshift](https://aws.amazon.com/redshift/)
- [Snowflake](https://www.snowflake.com/)
- [Teradata](https://www.teradata.com/)

They are all [configured](/components/extractors/database/sqldb/#create-new-configuration) in the same way and 
have an [advanced mode](/components/extractors/database/sqldb/). *(Their basic configuration is also part 
of our [tutorial](/tutorial/load/database/).)* 

On the other hand, the extractor for [MongoDB](https://www.mongodb.com/), a **NoSQL database**, 
requires a [different configuration](/components/extractors/database/mongodb/). 
[Configuration](/components/extractors/database/bigquery/) of the [BigQuery](https://cloud.google.com/bigquery/) extractor is also covered in another [tutorial](/tutorial/ad-hoc/) of ours.

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
