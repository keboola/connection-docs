---
title: Database
permalink: /extractors/database/
---

There are a number of database extractors sharing common properties. 

- [Cloudera Impala](https://www.cloudera.com/products/apache-hadoop/impala.html)
- [Firebird](http://www.firebirdsql.org/)
- [IBM DB2](http://www.ibm.com/analytics/us/en/technology/db2/)
- [Microsoft SQL Server](https://www.microsoft.com/en/server-cloud/products/sql-server/)
- [MySQL](https://www.mysql.com/)
- [Oracle](http://www.oracle.com/index.html)
- [PostgreSQL](http://www.postgresql.org/)

See our [tutorial](/tutorial/load/database/) for help with configuring these extractors. They all are configured in the same way.
The [MongoDB](https://www.mongodb.com/) extractor requires a [different configuration](/extractors/mongodb/).

## Database Extractor Configuration
After creating a new configuration, and setting up database credentials, 
specify individual queries for importing data from your server into KBC Storage: 
 
- Use as **simple queries** as possible. Avoid doing complex joins and aggregations. 
Keep in mind that these queries are executed on the database server you are extracting from. 
This database system might not be designed or optimized for complex SELECT queries. 
Complex queries may result in timeouts, or they might produce unnecessary loads on your internal systems. 
Instead, import raw data and then use KBC tools to give it the shape you want.
- Define a **primary key** where possible. Primary keys substantially speed up both the data loads and further processing of the table.


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

### MySQL Encryption
The MySQL database server also supports encrypting the whole database communication using SSL Certificates. See the
[official guide](http://dev.mysql.com/doc/refman/5.7/en/creating-ssl-files-using-openssl.html) for instructions on setting it up.
