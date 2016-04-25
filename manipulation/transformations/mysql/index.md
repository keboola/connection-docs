---
title: MySQL
permalink: /manipulation/transformations/mysql/
---

* TOC
{:toc}

MySQL is simple yet powerful.

As a rule of thumb, if your queries last more than single digits minutes or transformations in your orchestration last more than one hour, it's time to switch to Redshift/Snowflake. You can iterate faster on your development, when you don't need to wait long minutes before the next test run is finished. 

## Limits

### Time

MySQL queries are limited to 3600 seconds. Longer queries will be terminated.

### Resources

All MySQL queries are run on a shared server with 8 CPUs, SSD drives connected in RAID and 160 GB RAM. If your queries are slow, please consider using Redshift or Snowflake.

## Version

MySQL transformations use MariaDB 5.5.44, the server is fine tuned for performance.  

## Best practices

 - To get the most of MySQL, you need to take care of [column indexes](http://dev.mysql.com/doc/refman/5.7/en/optimization-indexes.html) and correct [data types](http://dev.mysql.com/doc/refman/5.7/en/data-types.html) (in input mapping). 
 - It's better to divide large queries into a series of simple queries, that makes the queries easier to optimize. 
 - Don't be afraid of creating plenty of intermediary or temporary tables.
 - Always try to materialize the query (use `CREATE TABLE ...` instead of `CREATE VIEW`).

Examples of some common scenarios and their solutions can be found on [our wiki](http://wiki.keboola.com/home/keboola-connection/user-space/transformations/mysql). 
