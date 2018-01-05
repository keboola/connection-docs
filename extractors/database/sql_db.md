---
title: Extractors for SQL Databases
permalink: /extractors/database/sqldb/
---

* TOC
{:toc}

*All extractors for SQL databases are configured in the same way.*
*See our [tutorial](/tutorial/load/database/) for help.*

## Database Extractor Configuration
After creating a new configuration and setting up database credentials,
select which tables you want to import to KBC Storage.

## Advanced Mode -- Best Practices
If you'd prefer to write your own query to extract data to KBC Storage, use the advanced mode checkbox.

{: .image-popup}
![Screenshot - Advanced Mode](/extractors/database/advancedMode.png)

Please keep the following in mind when using the advanced mode:

- Use as **simple queries** as possible. Avoid doing complex joins and aggregations.
Keep in mind that these queries are executed on the database server you are extracting from.
This database system might not be designed or optimized for complex SELECT queries.
Complex queries may result in timeouts, or they might produce unnecessary loads on your internal systems.
Instead, import raw data, and then use KBC tools to give it the shape you want.

- Define a **primary key** where possible. Primary keys substantially speed up both the data loads and further processing of the table.

## MySQL Encryption
The MySQL database server also supports encrypting the whole database communication using SSL Certificates. See the
[official guide](http://dev.mysql.com/doc/refman/5.7/en/creating-ssl-files-using-openssl.html) for instructions on setting it up.
