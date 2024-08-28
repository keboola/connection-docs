---
title: Oracle
permalink: /components/extractors/database/oracle/
---

* TOC
{:toc}

## Query-Based connector

This is a [standard connector](https://components.keboola.com/components/keboola.ex-db-mysql) that performs queries against the source database to sync data. 
It is the simplest approach suitable for most use cases and allows for  [time-stamp based](/components/extractors/database/#incremental-fetching) CDC replication.

They are all [configured](/components/extractors/database/sqldb/#create-new-configuration) in the same way and 
have an [advanced mode](/components/extractors/database/sqldb/). 

Their basic configuration is also part of the [Tutorial - Loading Data with Database Extractor](/tutorial/load/database/). 

## Oracle Log-Based CDC

{% include private-beta-warning.html %}

