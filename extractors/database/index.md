---
title: Database Extractors
permalink: /extractors/database/
---

Extractors import data from external sources and integrate it to the Keboola Connection (KBC) environment.
There are a number of extractors for **SQL databases**.

- [Cloudera Impala](https://www.cloudera.com/products/apache-hadoop/impala.html)
- [Firebird](http://www.firebirdsql.org/)
- [IBM DB2](http://www.ibm.com/analytics/us/en/technology/db2/)
- [Microsoft SQL Server](https://www.microsoft.com/en/server-cloud/products/sql-server/)
- [MySQL](https://www.mysql.com/)
- [Oracle](http://www.oracle.com/index.html)
- [PostgreSQL](http://www.postgresql.org/)

*See our [tutorial](/tutorial/load/database/) for help with configuring these extractors.*
*They all are configured in the same way.*

On the other hand, the extractor for [MongoDB](https://www.mongodb.com/), a **NoSQL database**, requires a [different configuration](/extractors/database/mongodb/).

## Connecting to Database
The connection to your internal database must be well secured. If you, or your system administrator, want to avoid exposing your database server to the internet,
we highly recommend setting up an SSH Tunnel for the connection.

{: .image-popup}
![Schema - SSH tunnel](/extractors/database/ssh-tunnel.jpg)

A [Secure Shell (SSH)](https://en.wikipedia.org/wiki/Secure_Shell) [tunnel](https://en.wikipedia.org/wiki/Tunneling_protocol) consists of an encrypted connection created
through the SSH protocol connection. You can set up this tunnel to connect to your database server located in your private network that you do not want
to be accessed directly from the internet. The SSH connection is encrypted and uses public - private key pair for user authorization.

Find detailed instructions for setting up an SSH tunnel in the [developer documentation](https://developers.keboola.com/integrate/database/).
While setting up an SSH tunnel requires some work, it is the most reliable and secure option for connecting to your database server.

#### Note for Azure hosted MsSql Server instances 

Mssql Server hosted on Azure will normally have a host name such as `[srvName].databases.microsoft.net`  
The `[srvName]` is not an instance name, so the instance name should be left blank.  
But the username needs to have the suffix `@[srvName]` as in, for example `keboola@srvKeboola`