---
title: Project Limits
permalink: /management/project/limits/
redirect_from:
  - /management/limits/
---

* TOC
{:toc}

Each Keboola Connection standard project has two kinds of limits:  

1. **Business limits** are set in your contract and define the business usage of our platform. 
This can be seen as the **size** of your project. Exceeding them will earn you a call from us 
and a possible contract update conversation. 

2. **Platform limits** represent what our platform is **technically capable of**. Reaching or exceeding 
these limits is either technically impossible, or it carries a risk of degraded performance.

**Note:** These limits apply to standard Keboola Connection projects. The limits for [pay-as-you-go projects](/management/payg-project/) might differ.

## Business Limits

Business limits are set for each project upon entering into the subscription. 

All business limits are **soft limits**. Exceeding them will not cause the project to be restricted. 
However, if you substantially and constantly exceed the limits, you will be contacted by us with a **project 
upgrade** suggestion because you are using more than you have paid for. 
You can also request an upgrade by clicking the **Request Increase** button creating a support ticket. 

Business limits vary based on your contract (refer to it to see which ones apply in your case):

- **Storage rows** --- the sum of all rows in all tables in [Storage](/storage/); 
[Aliases](/storage/tables/#aliases) and [Linked Buckets](/catalog/) do 
not count towards this number.
- **Users count** --- the number of [project users](/management/project/users).
[Keboola Support Users](/management/support/#keboola-support-users) do not count towards this number, 
and neither do [Tokens](/management/project/tokens). Effectively this is the number of project administrators.
- **Orchestrations count** --- the number of orchestrations (scheduled or not)
- **Project Power** --- [Volume Credits](#project-power---volume-credits) and [Time Credits](#project-power---time-credits)
- **Storage size** --- [details below](#storage-size)

### Project Power - Volume Credits

Project Power is proportional to the sum of the amount of data **consumed** (exported from Storage) and **produced** 
(imported to Storage) by each component. This means that it does not matter how much data an extractor downloads from 
the source system. What is important is how much data it **produces** (imports) into your storage (i.e., 
when an extractor downloads 1GB of raw data and imports only 200MB of data into a Storage table, 
the 200MB is counted in Project Power). 
Therefore we are counting only the data that matters to you.

Although proportional to the amount of data, Project Power is measured in **units**. This is because it is
difficult to define a universally valid size of a piece of data. Roughly 1 PPU (Project Power Unit) is equivalent 
to 0.5--1GB of data. 

Most of the transfers are efficiently compressed and most of the data **can be** efficiently compressed, which
makes the ratio more favourable. It is important to say that the same data on the same component will always consume
the same number of PPUs. 

*Note: Volume Credits are going to be replaced by the [time credit measurement](#project-power---time-credits).*

### Project Power - Time Credits

Keboola has introduced a new way to measure your consumption. Time Credits will gradually replace the 
metrics of [Volume Credits](#project-power---volume-credits). If you are not sure which consumption measurement 
your subscription is running on, please reach out to your CSM for more information.

Project Power is measured in units. A Project Power Unit is proportional to the sum of the elapsed time of all jobs 
executed in Keboola Connection. It's measured in seconds and presented in hours (1 hour = 3,600 seconds). 
Every job consumes a different amount of Project Power Units based on the job's **duration** (length in seconds), 
**type** (Sandbox, SQL transformation, Python transformation, etc.), and **backend performance** (small, medium, and large).

**Important:** Keboola Connection doesn’t count time on extractors and writers, they are excluded. 
Writer jobs are measured based on data volume.

Below you will find an overview of time credits consumed by individual Keboola Connection job types. 
If you need more information, please contact your CSM.

| Types of jobs in Keboola Connection   | Base job                | Time credits          |
|---------------------------------------|-------------------------|-----------------------|
| Extractor                             | 1 GB in                 | 0                     |
| Writer                                | 1 GB out                | 0.2                   |  
| SQL Sandbox small performance         | 1 hour                  | 6                     |
| SQL Sandbox medium performance        | 1 hour                  | 12                    |
| SQL Sandbox large performance         | 1 hour                  | 26                    |
| SQL Transformation small performance  | 1 hour                  | 6                     |
| SQL Transformation medium performance | 1 hour                  | 12                    |
| SQL Transformation large performance  | 1 hour                  | 26                    |
| DS Sandbox small performance          | 1 hour                  | 1                     |
| DS Sandbox medium performance         | 1 hour                  | 2                     |
| DS Sandbox large performance          | 1 hour                  | 6                     |
| DS Sandbox GPU                        | 1 hour                  | 30                    |
| DS Transformation small               | 1 hour                  | 1                     |
| DS Transformation medium              | 1 hour                  | 2                     |
| DS Transformation large               | 1 hour                  | 6                     |
| DS Transformation GPU                 | 1 hour                  | 30                    |
| DWH Direct query small                | 1 hour                  | 8                     |
| DWH Direct query medium               | 1 hour                  | 16                    |
| DWH Direct query large                | 1 hour                  | 32                    |
| AppStore Apps                         | 1 hour                  | 1                     |



**Types of backends used for jobs**

| SMALL SQL                             | Snowflake SMALL DWH or equivalent               |
| MEDIUM SQL                            | Snowflake MEDIUM DWH                            |
| LARGE SQL                             | Snowflake LARGE DWH                             |
| SMALL DS                              | 16 GB RAM, 2 CPU cores, 1TB GB SSD shared   |
| MEDIUM DS                             | 32 GB RAM, 4 CPU cores, 1TB GB SSD shared |
| LARGE DS                              | 120 GB RAM, 14 CPU cores, 1TB dedicated |
| DS GPU (On request)                   | 244 GB RAM, 64 GB GPI-J memory, 4x TeslaV1OO 32 CPU cores, 2x500 GB SSD|

### Storage Size
The storage size is the sum of the sizes of the tables in your [Table Storage](/storage/). 
[Aliases](/storage/tables/#aliases) and [Linked Buckets](/catalog/) do 
not count towards this number, and neither do [Files](/storage/files/).

The table storage size is measured as it is reported by the underlying [backend](/storage/#backend-properties). 
This means that the reported size is substantially smaller than the size of imported raw CSV files, thanks to 
compression used by the database backend. This also means that reported sizes of the same data may differ slightly 
across projects with different [backends](/storage/#backend-properties) (or between buckets in a project
with mixed backends).

### GoodData
If you use [GoodData BI](https://www.gooddata.com/) provisioned by Keboola, the **Limits** page will also show
whether you are using a [demo or a production project](/components/writers/bi-tools/gooddata/). The demo project is provided free of charge. 

## Platform Limits
Apart from the business limits, there are limitations to **what the Keboola Connection platform can take**. These limits 
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

The **full list of the platform limits** is available as a 
[separate document](https://docs.google.com/a/keboola.com/spreadsheets/d/1SqUE6vS5Nq0MmB6Kdw5DyuPjlbyXJ0zMDoGDU5cOfSI/edit?usp=sharing).
