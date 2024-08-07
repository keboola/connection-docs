---
title: Project Limits
permalink: /management/project/limits/
redirect_from:
  - /management/limits/
---

* TOC
{:toc}

Each Keboola standard project has two kinds of limits:  

1. **Business limits** are set in your contract and define the business usage of our platform. 
This can be seen as the **size** of your project. Exceeding them will earn you a call from us 
and a possible contract update conversation. 

2. **Platform limits** represent what our platform is **technically capable of**. Reaching or exceeding 
these limits is either technically impossible, or it carries a risk of degraded performance.

***Note:** These limits apply to standard Keboola projects. The limits for [pay-as-you-go projects](/management/payg-project/) 
might differ.*

## Business Limits
Business limits are set for each project upon entering into the subscription. 

All business limits are **soft limits**. Exceeding them will not cause the project to be restricted. 
However, if you substantially and constantly exceed the limits, you will be contacted by us with a **project 
upgrade** suggestion because you are using more than you have paid for. 
You can also request an upgrade by clicking the **Request Increase** button creating a support ticket. 

Business limits vary based on your contract (refer to it to see which ones apply in your case):

- **Projects** --- the number of Keboola projects (workspaces dedicated for data use cases)
- **Users** --- the number of [project users](/management/project/users).
[Keboola support users](/management/support/#keboola-support-users) do not count towards this number, 
and neither do [tokens](/management/project/tokens). 
- **Project Power** --- measured in [Time Credits/Units](#project-power---time-credits)
- **Storage Size** --- the sum of the sizes of the tables in your [Table Storage](/storage)

### Project Power -- Time Credits

**PPUs** (project power units, also known as credits) are proportional to the sum of the elapsed time of all jobs executed in Keboola. 
Measured in milliseconds, presented in hours (1 hour = 3,600 seconds). Every job consumes different amount of Project Power Units,
based on 

- elapsed time of the job (in seconds), 
- types of jobs (workspace, SQL, Python, and R transformations), and 
- backend performance: XSmall, Small, Medium, Large.

Types:
- **KBC** - Generic type of PPU used in the projects.
- **SQL** - PPU used for SQL transformation jobs, in case the customer is using [BYODB](/storage/byodb) and has a separate product for SQL jobs.
- **CDC** - PPU used for CDC extractor jobs, in case the customer is using [CDC](/components/extractors/database/#change-data-capture-cdc) and has a separate product for CDC jobs.

Below you will find an overview of time credits consumed by individual Keboola job types. 
If you need more information, please contact your CSM.

| Types of jobs in Keboola | Base job | Time credits |
|---|---|---|
| **Data source job**                   | 1 hour                  | **2**                 |
| **Data destination job**              | 1 GB out                | **0.2**               |  
| **SQL job / workspace**               |                         |                       |
| Small                                 | 1 hour                  | **6**                 |
| Medium                                | 1 hour                  | **12**                |
| Large                                 | 1 hour                  | **26**                |
| **Data Science job / workspace**      |                         |                       |
| XSmall                                | 1 hour                  | **0.5**               |
| Small                                 | 1 hour                  | **1**                 |
| Medium                                | 1 hour                  | **2**                 |
| Large                                 | 1 hour                  | **6**                 |
| Deployed & running ML model (BETA)    | 1 hour                  | **0.1**               |
| **dbt job**                           |                         |                       |
| Small                                 | 1 hour                  | **6**                 |
| Remote                                | 1 hour                  | **2**                 |
| **DWH Direct query**                  |                         |                       |
| Small                                 | 1 hour                  | **8**                 |
| Medium                                | 1 hour                  | **16**                |
| Large                                 | 1 hour                  | **32**                |
| **AppStore Apps**                     | 1 hour                  | **1**                 |
| **DataApps (BETA)**                   |                         |                       |
| Small                                 | 1 hour                  | **1**                 |

| Types of backend sizes used for jobs | |
|---|---|
| SMALL (SQL)                           | Snowflake SMALL DWH or equivalent               |
| MEDIUM (SQL)                          | Snowflake MEDIUM DWH                            |
| LARGE (SQL)                           | Snowflake LARGE DWH                             |
| XSMALL (Python,R, Components)         | 8 GB RAM, 1 CPU cores, 150GB SSD, shared        |
| SMALL (Python,R, Components, DataApp) | 16 GB RAM, 2 CPU cores, 150GB SSD, shared       |
| MEDIUM (Python,R, Components)         | 32 GB RAM, 4 CPU cores, 150GB SSD, shared       |
| LARGE (Python,R, Components)          | 114 GB RAM, 14 CPU cores, 1TB SSD, dedicated    |
| SMALL (dbt)                           | Snowflake SMALL DWH or equivalent               |
| REMOTE (dbt)                          | Using user's remote DWH                         |

### Storage Size
The storage size is the sum of the sizes of the tables in your [table Storage](/storage/). 
[Aliases](/storage/tables/#aliases) and [linked buckets](/catalog/) do 
not count towards this number, and neither do [files](/storage/files/).

The table storage size is measured as it is reported by the underlying [backend](/storage/#backend-properties). 
This means that the reported size is substantially smaller than the size of imported raw CSV files, thanks to 
compression used by the database backend. This also means that reported sizes of the same data may differ slightly 
across projects with different [backends](/storage/#backend-properties) (or between buckets in a project
with mixed backends).

## Platform Limits
Apart from the business limits, there are limitations to **what the Keboola platform can take**. These limits 
are either defined by the underlying technologies or by what we believe is the correct use of the platform. 
The technical platform limits are **non-negotiable** and **cannot be upgraded** by updating the contract. 
Nonetheless, we certainly would like to hear if you hit them. 

The platform limits may be **soft** limits or **hard** limits. They are also likely to change (improve) over time as the 
development continues and often can be mitigated by a good project design. Contact us for advice if you are 
concerned about any of them!

For example, the [Redshift backend](/storage/#backend-properties) allows the maximum table cell size of 64kB. This
is a hard limit and nothing can be done about it as long as Redshift is a hard requirement (the Snowflake backend 
can take larger cells). 

As another example, you should not have more than 200 tables in a single bucket. This is a soft limit related to
how we believe the Storage component should be used. Nothing prevents you from exceeding that limit but the 
component performance may degrade. 

The following sections list all Keboola platform's limits [Organization Limits](/management/project/limits/#organization-limits), and
[Project Limits](/management/project/limits/#project-limits).

### Organization Limits

| Limit | Value | Soft/Hard |
|---|---|---|
| Maintainers per customer | max 1 | soft |
| Members per maintainer | max 10,000  | soft |
| Organizations per maintainer | max 500 | soft |
| Members per organization | max 1,000 | soft |
| Projects per organization | max 100 | soft |

### Project Limits

#### Storage limits

| Limit | Value | Unit | Soft/Hard |  
|---|---|---|---|
| Storage total size | 30 | TB | soft |
| Number of buckets | 100 | # | soft |
| Number of tables in a bucket |200 | # | soft |
| Total number of tables in a Snowflake storage |  20,000 | # | soft |
| Total number of tables in a Redshift storage | 9,000 | # | soft |
| Number of rows in a Snowflake table | 100,000,000,000 | # | soft |
| Number of rows in a Redshift table | 100,000,000,000 | # | soft |
| Number of columns in a Redshift table | 500 | # | soft |
| Number of columns in a Snowflake table | 500 | # | soft |
| Number of columns in a MySQL table | 100 | # | soft |
| Number of indexes on a Redshift table | 1 | # | soft |
| Number of indexes on a Snowflake table | N/A | # | soft |
| Number of indexes on a MySQL table | 10 | # | soft |
| Number of columns in a Redshift index | 400  | # | soft |
| Number of columns in a Snowflake index | N/A  | # | soft |
| Number of columns in a MySQL index | 4  | # | soft |
| Number of attributes in a table | 100  | # | soft |
| Snowflake column name length | 64 | bytes | hard |
| Redshift column name length | 64 | bytes | hard |
| MySQL column name length | 64 | bytes | hard |
| Snowflake table name length | 100 | bytes | soft |
| Redshift table name length | 80 | bytes | soft |
| MySQL table name length | 80 | bytes | soft
| Snowflake column name length | 64 | bytes | hard |
| Redshift column name length | 64 | bytes | hard |
| Bucket name length | 30 | bytes | hard |
| Value length in a Snowflake table | 1 | MB | hard |
| Value length in a Redshift table | 64 | kB | hard |
| Value length in a MySQL table | 64 | kB | hard |
| Snowflake table size | 30 | TB | hard |
| Redshift table size | 100 | GB | hard |
| MySQL table size | 50 | GB | hard |
| Number of files | | | |
| File size | | | | 
| File chunk size | | | |
| Number of file chunks | 300,000 | # | soft |
| Number of tokens | | # | | 
| Number of workspaces | | # | | 
| Number of Redshift schemas (workspace + buckets combined) | 9,999 | # | hard | 
| Snowflake workspace for a Snowflake data destination (writer) | 15 | # | soft |

#### Configuration limits

| Limit | Value | Unit | Soft/Hard |  
|---|---|---|---|
| Number of configured components | 100 | # | soft |
| Number of configurations in a project | 1,500 | # | soft |
| Number of configuration rows in a configuration | 200 | # | soft |
| Configuration size | 4 | MB | soft |
| Configuration state size | 4 | MB | soft |
| Configuration row size | 16 | kB | soft |
| Number of configurations per component | 200 | # | soft |
| Number of configuration versions | 999 | # | soft |
| Number of configuration row versions | | # | |
| Number of input mappings in a configuration | 100 | # | soft |
| Number of output mappings in a configuration | 30 | # | soft |
| Number of columns in input/output mapping | 20 | # | soft |
| Number of filters in input/output mapping | 5 | # | soft |
| Number of filter values in input/output mapping | 30 | # | soft |
| Configuration name length | 50 | bytes | soft |
| Configuration description length | 4 | MB | hard |

#### Job limits

| Limit | Value | Unit | Soft/Hard |  
|---|---|---|---|
| Number of configuration job runs | | # | |
| Number of concurrent configuration job runs | 1 | # | hard |
| Number of events in a job run | 100,000 | # | soft |
| Event size in a job run | 16 | kB | soft |
| Total number of jobs in history | 1,500,000 | # | soft |
| Job list retention period | 3 | months | hard |

#### Transformation limits

| Limit | Value | Unit | Soft/Hard |  
|---|---|---|---|
| Number of buckets | 30| # | soft |
| Number of transformations in a bucket | 50 | # | soft |
| Number of queries in an SQL transformation | 20 | # | soft |
| Query size in an SQL transformation | 1 | kB | soft |
| Number of scripts in a R/Python/OpenRefine transformation | 1 | # | soft |
| Script size in an R transformation | 50 | kB | soft | 
| Script size in a Python transformation | 50 | kB | soft |
| Script size in an Open Refine transformation | 1 | MB | soft |
| Storage size in an R transformation | 50 | GB | hard |
| Storage size in a Python transformation | 50 | GB | hard |
| Storage size in an OpenRefane transformation | 50 | GB | hard |
| Transformation name length | 50 | bytes | soft | 
| Transformation description length | 4 | MB | hard |
| R transformation script: used memory | 8 | GB | hard |
| Python transformation script: used memory | 8 | GB | hard |
| OpenRefine transformation script: used memory | 8 | GB | hard |
| Timeout of a Snowflake tranformation job | 3 | hours | hard |
| Timeout of a Snowflake SQL query | 15 | minutes | hard |
| Size of entire Snowflake input mapping | N/A | GB | |
| Size of entire Snowflake output mapping | N/A | GB | |
| Redshift SQL query timeout | 60 | minutes | hard |
| Timeout of a Redshift transformation job | 3 | hours | hard |
| Size of entire Redshift input mapping | N/A | GB | |
| Size of entire Redshift output mapping | N/A | GB | | 
| MySQL SQL query timeout | 20 | minutes | soft |
| Timeout of a MySQL transformation job | 3 | hours | hard |
| Size of entire MySQL input mapping | 5 | GB | soft |
| Size of entire MySQL output mapping | 5 | GB | soft |

#### Orchestration limits

| Limit | Value | Unit | Soft/Hard |  
|---|---|---|---|
| Number of orchestrations | 30 | # | soft |
| Number of tasks per orchestration | 30 | # | soft |
| Number of phases per orchestration | 30 | # | soft |
| Number of tasks per phase | 30 | # | soft |
| Number of notification emails per orchestration | 5 | # | soft |

#### Component limits

| Limit | Value | Unit | Soft/Hard |  
|---|---|---|---|
| Number of queries in any DB data source connector (extractor) | 50 | # | soft |
| Query sixe in any DB data source connector | 1 | kB | soft |
| Number of tables in a GoodData data destination connector (writer) | 40 | # | soft |
| Number of tables in a Tableau data destination connector | 50 | # | soft |
| Number of tables in a Google Drive/Dropbox data destination connector | 50 | # | soft |
| Number of tables in a Google Drive/Dropbox data source connector | 50 | # | soft |
| Number of queries in a MySQL/Oracle/MSSQL DB data destination connector | 50 | # | soft |
| Number of queries in a Redshift/Snowflake DB data destination connector | 50 | # | soft |
| File size in a CSV importer | 2 | GB | hard |

#### Timing limits

| Limit | Value | Unit |  
|---|---|---|
| Jobs per 3,600 seconds | 100 | # |
| Events in a job per second | 10 | # |
| Configuration runs per 3,600 seconds | 100 | # | 
| Configuration versions per 3,600 seconds | 100 | # |
| Configuration row versions per 3,600 seconds | 100 | # |
| New configurations per 3,600 seconds | 100 | # |
| Table imports per 3,600 seconds | 400 | # |
| Table exports per 3,600 seconds | 400 | # |
| Orchestration runs per 3,600 seconds | 120 | # |
| API requests per 10 seconds per token | 3 | # |
| Snowflake transformation query execution time | 900 | seconds |
| Redshift transformation query execution time | 3,600 | seconds |
| MySQL transformation query execution time | 1,200 | seconds |
| R transformation script execution time | 10,800 | seconds |
| Python transformation script execution time | 10,800 | seconds |
| OpenRefine transformation script execution time | 10,800 | seconds |
| Job execution time | 10,800 | seconds |
| Table import time | | seconds |
| Table export time | | seconds |
| Sychronous API call execution time | | seconds |
| Orchestration execution time | 36,000 | seconds |
| Orchestration phase execution time | | seconds |
| Total transformation execution time | | seconds |
| DB data source connector (extractor) query execution time | | seconds |
| DB data source connector exetuion time | 10,800 | seconds |
| File uploads per second | | # |
| File chunks per second | | # |

#### User interface limits

| Limit | Value | Unit | Soft/Hard |  
|---|---|---|---|
| Nesting level in a graph | 7 | # | soft |

#### Miscellaneous limits

| Limit | Value | Soft/Hard |
|---|---|---|
| Users per project | 50 | soft |
| Resource name length | N/A | N/A |
| API request size | N/A | N/A |
