---
title: Storage
permalink: /storage/
---

* TOC
{:toc}

*See our [Getting Started](/tutorial/load/) tutorial for instructions on how to use Storage.*

As the central [Keboola subsystem](/overview/), Storage manages everything related to **storing** data and **accessing** it.
It is implemented as a layer on top of database engines that we use as our backends
([Snowflake](https://www.snowflake.com/), [BigQuery](https://cloud.google.com/bigquery)).
By default all new [Pay As You Go projects](/management/payg-project/) use the BigQuery backend. If you are a contract customer, you can select which backend you want to use.

As with all other Keboola components, everything that can be done through the UI can be also done programmatically
via the [Storage API](https://keboola.docs.apiary.io/).
See our [developers guide](https://developers.keboola.com/integrate/storage/) to learn more.
Every Storage operation must be authorized via a [token](/management/project/tokens/).
It is also recorded in [Events](/management/project/tokens/#token-events) and
[Jobs](/management/jobs/).

## Storage Data
The Storage component manages all data stored in each Keboola project:

- [Data tables](/storage/tables/) (Table Storage) --- organized into [buckets](/storage/buckets/)
- [Data files](/storage/files/) (File Storage) --- all raw files uploaded to your project
- [Component configurations](/components/)

Different storage technologies are used for the above data:

- [Amazon S3 Storage](https://aws.amazon.com/s3/), [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/), and [Google Cloud Storage](https://cloud.google.com/storage/) are used for [File Storage](/storage/files/).
- [BigQuery](https://cloud.google.com/bigquery/) and [Snowflake](https://www.snowflake.com/product/) are used for [Table Storage](/storage/tables/).

The database system behind the Table Storage is referred to as a **backend**.
Data in Table Storage is internally stored in a **database backend** (project backend).

### Storage Backend Types and Features
There are multiple types of storage backend configurations you can choose from, and each has its own features and limitations.

#### Multi-tenant (MT)
MT backend shares compute resources across projects, while maintaining a high degree of data isolation between those projects. Benefits of this setup are mainly cost-savings, as projects share the compute resources.

**Snowflake** projects are *not allowed* to access the Snowflake database directly through [Snowflake Workspaces](/transformations/workspace/#snowflake). This limitation exists because all databases sharing the same resources exist in the same Snowflake account, and Snowflake does not allow direct access to the same account by different business entities. Instead, users can use the in-platform SQL Editor for SQL development and analysis above the data in Table Storage. The Data Gateway component can also be used to share data in read-only mode with third-party BI and visualization tools.

**BigQuery** projects are *allowed* to access BigQuery database directly through [BigQuery Workspaces](/transformations/workspace/#bigquery), as BigQuery handles access to its environment differently.

MT backend type is used for all [Pay As You Go projects](/management/payg-project/) and most contract customers who don't need extra features coming with other backend types.

#### Keboola-Brings-Database (KBDB)
KBDB is **Snowflake** backend type where Keboola manages a dedicated account for a customer, while the customer is not an admin of the account. This setup is used for contract customers who need access to [Snowflake Workspaces](/transformations/workspace/#snowflake) and direct connection to Snowflake database (e.g. for SQL development in IDEs).

As the dedicated account does not share the resources with other customers, it has higher and more stable performance, but also higher cost.


#### Bring-Your-Own-Database (BYODB)
This backend type allows customers to use their own database for their Keboola projects and can use both BigQuery and Snowflake as the backend.

As the database backend is owned by the customer, there are no functional limitations and it's also fully managed and paid for by the customer.

To learn more about the BYODB setup, please refer to the [BigQuery](/storage/byobq/) and [Snowflake](/storage/byodb/#snowflake) BYODB documentation.

---

If you have any questions regarding the backend types or need help with the setup, please contact our [support](/management/support/).