---
title: MySQL
permalink: /manipulation/transformations/mysql/
---

* TOC
{:toc}

MySQL transformation is the easiest option.  

## Limits

### Time

MySQL queries are limited to 3600 seconds. Longer queries will be terminated.

### Resources

All MySQL queries are run on a shared server with 8 CPUs, SSD drives connected in RAID and 160 GB RAM. If your queries are slow, please consider using Redshift or Snowflake.

## Version

MySQL transformations use MariaDB 5.5.44, the server is fine tuned for performance.  
