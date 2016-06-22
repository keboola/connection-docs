---
title: Storage
permalink: /storage/
---

*See how to start working with Storage in our [Getting Started tutorial](/overview/tutorial/load/).*

*Storage* is the central KBC [subsystem](/overview/) managing everything related to storing data and accessing it.
It is implemented as a layer on top of various database engines that we use as our *backends*
([Mysql/MariaDB](https://mariadb.org/),
[Redshift](https://aws.amazon.com/redshift/), and [Snowflake](http://www.snowflake.net/)).

As with every other component, everything what can be done through the UI can be done programatically via
the [Storage API](http://docs.keboola.apiary.io/), see the [developer guide](https://developers.keboola.com/integrate/storage/) if you are interested.
Every operation done in the Storage must be authorized via a [token](/storage/tokens/).

Storage component manages all data stored in each KBC project. These are:
- [data tables](/storage/tables/)
- [data files](/storage/file-uploads/)
- [component configurations](/storage/configurations/)

Data in storage are internally stored in a database backend. Each backend has some specific properties, which
are compared in the below table:

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