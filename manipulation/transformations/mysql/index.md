---
title: MySQL
permalink: /manipulation/transformations/mysql/
---

* TOC
{:toc}

MySQL is simple yet powerful. 

 - To get the most of it, you need to take care of indexing columns and correct data types (in input mapping). 
 - It's better to divide large queries into a series of simple queries, that makes the queries easier to optimize. 
 - Don't be afraid of creating plenty of intermediary or temporary tables.
 - Always try to materialize the query (use `CREATE TABLE ...` instead of `CREATE VIEW`).
 - Tooling around MySQL is plenty. 

As a rule of thumb, if your queries last more than single digits minutes or transformations in your orchestration last more than one hour, it's time to switch to Redshift/Snowflake. You can iterate faster on your development, when you don't need to wait long minutes before the next test run is finished. 

## Limits

### Time

MySQL queries are limited to 3600 seconds. Longer queries will be terminated.

### Resources

All MySQL queries are run on a shared server with 8 CPUs, SSD drives connected in RAID and 160 GB RAM. If your queries are slow, please consider using Redshift or Snowflake.

## Version

MySQL transformations use MariaDB 5.5.44, the server is fine tuned for performance.  
