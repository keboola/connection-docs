---
title: Database
permalink: /extractors/database/
---

There are a number of database extractors, which share common properties. These are:

- [Cloudera Impala](https://www.cloudera.com/products/apache-hadoop/impala.html)
- [Firebird](http://www.firebirdsql.org/)
- [IBM DB2](http://www.ibm.com/analytics/us/en/technology/db2/)
- [Microsfot SQL Server](https://en.wikipedia.org/wiki/Microsoft_SQL_Server)
- [MySQL](https://www.mysql.com/)
- [Oracle](http://www.oracle.com/index.html)
- [PostgreSQL](http://www.postgresql.org/)

If you need help configuring these extractors, you should follow the
corresponding part of the [Tutorial](/overview/tutorial/load/database/).
There is also a [MongoDB](https://www.mongodb.com/) extractor which has a different configuration and
is described on a [separate page](/extractors/mongodb/).

## Database extractor configuration
Each of the above database extractors is configured in a same way. First you need to create configuration, then set up database credentials,
then you can specify individual queries, which extract data from your server into KBC Storage. We recommend that you:

- Use as simple queries as possible. You should avoid doing complex joins and aggregations in the extract queries. Keep in mind that these queries are
executed on the database server, you're extracting from. This database system might not be desgined or optimized for complex SELECT queries. Complex queries may
result in timeouts or they might produce unnecessary loads on your internal systems. You should generally import raw data and then use KBC tools to transform them
into the shape you want.
- Define primary key where possible. Primary keys substantialy speed up both the data loads and further processing of the table.


## Connecting to database
Generally the connection to your internal database must be well secured. If you (or your system administrator) wants to
avoid exposing your database server to the internet, we highly recommend setting up a SSH Tunnel
for the connection:

{: .image-popup}
![Schema - SSH tunnel](/extractors/database/ssh/ssh-tunnel.jpg)

A [Secure Shell (SSH)](https://en.wikipedia.org/wiki/Secure_Shell) [tunnel](https://en.wikipedia.org/wiki/Tunneling_protocol) consists of encrypted connection created
through SSH protocol connection. You may set up this tunnel to connect to your database server, which is located in your private network and you don't want it
to be accessed directly from the internet. The SSH connection is encrypted and uses public - private key pair for user authorization. For
detailed instructions for your system administrator for setting up a SSH tunel, see the [developer documentation](https://developers.keboola.com/integrate/database/).
While setting up an SSH tunnel requires some work from your system administrator, it is the most reliable and secure option for connecting to your database server.

