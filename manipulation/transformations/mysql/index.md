---
title: MySQL Transformation
permalink: /manipulation/transformations/mysql/
---

MySQL is very simple, yet powerful. However, it has its limitations:

- **Time** --- MySQL queries are limited to 3,600 seconds. Longer queries will be terminated.

- **Resources** --- All MySQL queries are run on a shared server with 8 CPUs, SSD drives connected in RAID and 160 GB RAM. 

If your queries last more than 10 minutes, or transformations in your orchestration take more than an hour, please consider using Redshift or Snowflake. You can iterate faster on your development without having to wait too long for the next test run to finish. 

- **Query Length** --- Queries containing comments longer than 8192 characters will segfault.

The version used by MySQL transformations is **MariaDB 5.55.34.** The server is fine-tuned for performance.  

To get the most out of MySQL, 

 - take care of [column indexes](http://dev.mysql.com/doc/refman/5.7/en/optimization-indexes.html) and correct [data types](http://dev.mysql.com/doc/refman/5.7/en/data-types.html) in the input mapping. 
 - divide large queries into a series of simple queries. It makes the queries easier to optimize. 
 - create plenty of intermediary or temporary tables, and
 - always try to materialize the query (use `CREATE TABLE ...` instead of `CREATE VIEW`).

Examples of some common scenarios and their solutions can be found on [our wiki](http://wiki.keboola.com/home/keboola-connection/user-space/transformations/mysql). 
