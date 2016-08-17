---
title: Storage
permalink: /storage/
---

*See our [Getting Started](/overview/tutorial/load/) tutorial for instructions on how to use Storage.*

As the central [KBC subsystem](/overview/), *Storage* manages everything related to **storing** data and **accessing** it.
It is implemented as a layer on top of various database engines that we use as our *backends*
([MySQL/MariaDB](https://mariadb.org/),
[Redshift](https://aws.amazon.com/redshift/), and [Snowflake](http://www.snowflake.net/)).

As with all other KBC components, everything that can be done through the UI can be also done programatically via
the [Storage API](http://docs.keboola.apiary.io/). See our [developers' guide](https://developers.keboola.com/integrate/storage/) to learn more.
Every operation done in Storage must be authorized via a [token](/storage/tokens/).

The Storage component manages all data stored in each KBC project:

- [Data tables](/storage/tables/) - organized into buckets which are further organized into in and out stages 
- [Data files](/storage/file-uploads/) - all raw files uploaded to your project
- [Component configurations](/storage/configurations/)

Data in Storage are internally stored in a **database backend**. Specific properties of each backend 
are compared in the following table:

Feature | MySQL | Redshift | Snowflake
---------- | ----------- | ---------- | -------------
Partial Import (Deprecated) | ✓ | x | x
Export formats | `RFC`, `ESCAPED*`, `RAW*` | `RFC`, `ESCAPED*`, `RAW*`  | `RFC`
Simple Aliases | ✓ | x | ✓
Custom SQL Aliases | x | ✓ | ✓
Maximum number of columns in single table | Max. row size of 65,535 bytes | 1200 | 1200 |
Maximum table cell size | 64kB | 64kB | 1MB |
Sync export (Data Preview) columns limit | x | x | 110 |

* `ESCAPED` and `RAW` formats are different for `Redshift` and `Mysql`


{%comment %}
Backendy
- vypsat a strucne uvest jake jsou mezi nimi rozdily, odkaz na billing a na sales

Jobs/Events ze je to k nicemu a lepsi jsou events u Jobu

kopirovani/sdileni dat mezi projekty
{% endcomment %}