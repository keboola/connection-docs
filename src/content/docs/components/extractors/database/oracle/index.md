---
title: Oracle
slug: 'components/extractors/database/oracle'
description: 'The Oracle connector syncs data from an Oracle database into Keboola with queries, supports timestamp-based CDC and is set up like other database connectors.'
---



Use the Oracle connector to sync data from an Oracle database into Keboola by running queries against it. Its setup matches the other [database connectors](/components/extractors/database/); the shared steps are in [Initial setup](/components/extractors/database/sqldb/#initial-setup).

## Query-Based connector

This is a [standard connector](https://components.keboola.com/components/keboola.ex-db-oracle) that performs queries against the source database to sync data. 
It is the simplest approach suitable for most use cases and allows for  [time-stamp based](/components/extractors/database/#incremental-fetching) CDC replication.

They are all [configured](/components/extractors/database/sqldb/#initial-setup) in the same way and 
have an [advanced mode](/components/extractors/database/sqldb/#advanced-mode). 

Their basic configuration is also part of the [Tutorial - Loading Data with Database Extractor](/tutorial/load/database/). 


