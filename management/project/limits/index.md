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

**Miscellaneous**

| Limit | Value | Soft/Hard |
|---|---|---|
| Users per project | 50 | soft |
| Resource name length | na |na |
| API request size | na | na |


|---|---|---|---|
