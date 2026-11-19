---
title: Storage
slug: 'storage'
description: 'What Keboola Storage is and what you can do with it: tables and buckets, files, the Snowflake and BigQuery backends, and a map of the Storage docs.'
---

Storage is where a Keboola project keeps its data: tables organized into buckets, raw files, and component configurations. This page says what Storage is, what you can do with it and which backend types exist, and maps the rest of the section. For instructions on how to use Storage, see our [Getting Started](/getting-started/load/) tutorial.

<!-- Overview-hub page. Source: the Storage page on main, text carried over and checked against it 2026-11-19. The lists of what you can do and of the section pages follow the Storage pages as they are on this branch. -->

## What Storage is

As the central [Keboola subsystem](/overview/), Storage manages everything related to **storing** data and **accessing** it.
It is implemented as a layer on top of database engines that we use as our backends
([Snowflake](https://www.snowflake.com/), [BigQuery](https://cloud.google.com/bigquery)).
By default all new [Pay As You Go projects](/management/payg-project/) use the BigQuery backend. If you are a contract customer, you can select which backend you want to use.

As with all other Keboola components, everything that can be done through the UI can be also done programmatically
via the [Storage API](https://api.keboola.com/?service=storage).
See the [Storage API guide](/storage/api/) to learn more.
Every Storage operation must be authorized via a [token](/management/project/tokens/).
It is also recorded in [Events](/management/project/tokens/#token-events) and
[Jobs](/management/jobs/).

## What you can do

- Keep data in [tables](/storage/tables/), grouped into [buckets](/storage/buckets/). A table can have aliases, a primary key and [incremental loading](/storage/tables/incremental-loading/).
- Keep column types with [native data types](/storage/tables/data-types/), and document tables and columns with [descriptions](/storage/tables/descriptions/).
- Upload any file to [Files](/storage/files/), tag it and pass it on with a link. Table imports and exports pass through Files too.
- Recreate a table as it was at an earlier time, as a new table, with [time travel restore or snapshots](/storage/tables/backups/).
- See every load into and unload from a table in [Storage jobs](/storage/jobs/).
- Receive streaming event data straight into Storage with [Data Streams](/storage/data-streams/), with no data source connector to set up.
- Share buckets with other projects through the [Data Catalog](/catalog/), or with people outside your project through [Bucket Exposure](/storage/bucket-exposure/) (beta).
- Limit which rows and columns a reader sees with [row- and column-level security](/storage/row-level-security/) (beta). It applies your policies to queries through [governed workspaces](/storage/row-level-security/#what-is-protected).
- Keep project data in your own Snowflake or BigQuery account with [Bring Your Own Database](/storage/byodb/).
- Work with Storage from code: everything that can be done through the UI can also be done through the [Storage API](/storage/api/).

## Storage data
The Storage component manages all data stored in each Keboola project: data tables (Table Storage), organized into
buckets; data files (File Storage), all raw files uploaded to your project; and [component configurations](/components/).

Different storage technologies are used for the above data:

- [Amazon S3 Storage](https://aws.amazon.com/s3/), [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/), and [Google Cloud Storage](https://cloud.google.com/storage/) are used for [File Storage](/storage/files/).
- [BigQuery](https://cloud.google.com/bigquery/) and [Snowflake](https://www.snowflake.com/product/) are used for [Table Storage](/storage/tables/).

The database system behind the Table Storage is referred to as a **backend**.
Data in Table Storage is internally stored in a **database backend** (project backend).

### How tables pass through File Storage
File Storage also contains files with data exported from tables. These are created when you request to export a table from *Table Storage*. The *File Storage* serves two main purposes:

1. Files can be used to store an arbitrary file.
2. Every data table file is stored in Files before it is processed and pushed into a table.

All tables imported to and exported from Storage go through Files.

When a table is **imported** into Storage by any means (manually, through a data source connector, or as a result of running an application),
the CSV file is first stored in *Files* and only then imported to an actual table. 
This means that the Storage Files contain a history of data uploaded to the Storage Tables. 
It is useful mainly in the two following cases:

1. [Reverting table](/storage/tables/) content to a particular imported version
2. Analyzing how something got into a table (useful mainly for incremental loads)

Every time a table is **exported** from Storage, the process is reversed: first, a file is
created in *Files* and then it is actually downloaded from there. This does not apply when exporting
Storage tables manually though.
Beware, however, that due to the nature of database exports, the exported table may be **sliced** and require
[substantial effort to reconstruct](/storage/api/import-export/#working-with-sliced-files).

To find the file behind an import, open the import job in [Storage jobs](/storage/jobs/#find-the-file-a-job-loaded) and click its **File ID**.

### Storage backend types and features
There are multiple types of storage backend configurations you can choose from, and each has its own features and limitations.

#### Multi-tenant (MT)
MT backend shares compute resources across projects, while maintaining a high degree of data isolation between those projects. Benefits of this setup are mainly cost-savings, as projects share the compute resources.

**Snowflake** projects are *not allowed* to access the Snowflake database directly through [Snowflake Workspaces](/workspace/#snowflake). This limitation exists because all databases sharing the same resources exist in the same Snowflake account, and Snowflake does not allow direct access to the same account by different business entities. Instead, users can use the in-platform SQL Editor for SQL development and analysis above the data in Table Storage. The Data Gateway component can also be used to share data in read-only mode with third-party BI and visualization tools.

**BigQuery** projects are *allowed* to access BigQuery database directly through [BigQuery Workspaces](/workspace/#bigquery), as BigQuery handles access to its environment differently.

MT backend type is used for all [Pay As You Go projects](/management/payg-project/) and most contract customers who don't need extra features coming with other backend types.

#### Keboola-Brings-Database (KBDB)
KBDB is **Snowflake** backend type where Keboola manages a dedicated account for a customer, while the customer is not an admin of the account. This setup is used for contract customers who need access to [Snowflake Workspaces](/workspace/#snowflake) and direct connection to Snowflake database (e.g. for SQL development in IDEs).

As the dedicated account does not share the resources with other customers, it has higher and more stable performance, but also higher cost.


#### Bring-Your-Own-Database (BYODB)
This backend type allows customers to use their own database for their Keboola projects and can use both BigQuery and Snowflake as the backend.

As the database backend is owned by the customer, there are no functional limitations and it's also fully managed and paid for by the customer.

To learn more about the BYODB setup, please refer to the [BigQuery](/storage/byobq/) and [Snowflake](/storage/byodb/#snowflake) BYODB documentation.

---

If you have any questions regarding the backend types or need help with the setup, contact our [support](/management/support/).

## This section

The pages are listed in the order of the navigation.

1. **[Tables](/storage/tables/)**: what a table and an alias are, and the rules every table follows. Under it:
   - [Manage tables](/storage/tables/manage/): create an alias, set a primary key, truncate a table, delete rows, change a column type.
   - [Primary keys and incremental loading](/storage/tables/incremental-loading/): deduplication, incremental loads and incremental processing.
   - [Table and column descriptions](/storage/tables/descriptions/): where descriptions come from and their limits.
   - [Native data types](/storage/tables/data-types/) and the [data types reference](/storage/tables/data-types/reference/): typed tables, base types, NULL handling and the table definition.
   - [CSV files](/storage/tables/csv-files/) and [CSV files in Excel](/storage/tables/csv-files/excel/): the format Storage accepts and produces, and how to move data to and from Excel.
   - [Back up and restore tables](/storage/tables/backups/): time travel restore and snapshots.
2. **[Buckets](/storage/buckets/)**: the in and out stages, creating a bucket and opening its detail.
3. **[Files](/storage/files/)**: upload a file, pass it on with a link, export a table as one file, and the file limits.
4. **[Storage jobs](/storage/jobs/)**: open the low-level record of table loads and unloads and find the file a job loaded.
5. **[Bucket Exposure](/storage/bucket-exposure/)** (beta): share a bucket with people outside your project, in their own BigQuery or through Snowflake grants and shares.
6. **[Data Streams](/storage/data-streams/)**: receive events over HTTP or OpenTelemetry straight into Storage.
7. **[Bring Your Own Database](/storage/byodb/)** and **[Bring Your Own BigQuery](/storage/byobq/)**: host project data in your own Snowflake or BigQuery account, and the Google Cloud setup for connecting BigQuery.
8. **[Row- and column-level security](/storage/row-level-security/)** (beta): policies that limit which rows and columns a reader sees.
9. **[Storage API](/storage/api/)**: tables, files, buckets and component configurations through the API, with the importer service and the API clients.

**Next:** [Tables in Storage →](/storage/tables/)
