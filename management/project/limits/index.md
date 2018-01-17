---
title: Project Limits
permalink: /management/project/limits/
redirect_from:
  - /management/limits/
---

* TOC
{:toc}

Each Keboola Connection Project has two kinds of limits:  

1. **Business limits** are set in your contract and define the business usage of our platform. 
This can be seen as the **size** of your project. Exceeding them will earn you a call from us, 
and a possible contract update conversation. 

2. **Platform limits** represent what our platform is **technically capable of**. Reaching or exceeding 
these limits is either technically impossible, or it carries a risk of degraded performance.

## Business Limits
Business Limits are set for each project upon entering into the subscription. 
You can find them under **Users & Settings** in the **Limits** tab:

{: .image-popup}
![Screenshot - Limits](/management/project/limits/limits.png)

All business limits are **soft limits**. Exceeding them will not cause the project to be restricted. 
However, if you substantially and constantly exceed the limits, you will be contacted by us with a **project 
upgrade** suggestion because you are using more than you have paid for. 
You can also request an upgrade by clicking the **Request Increase** button creating a support ticket. 

Business limits vary based on your contract (refer to it to see which ones apply in your case):

- Storage rows
- Users count
- Orchestrations count
- [**Project Power**](#project-power)
- **Storage size**

**Storage rows** represent the sum of all rows in all tables in [Storage](/storage/). 
[Aliases](/storage/tables/#aliases) and [Linked Buckets](/storage/buckets/sharing/#link-bucket) do 
not count towards this number. 

**Users count** is the number of [project Users](/management/project/users). 
[Keboola Support Users](/management/support/#keboola-support-users) do not count towards this number, 
and neither do [Tokens](/management/project/tokens). Effectively this is the number of project administrators.

**Orchestrations count** is simply the number of orchestrations (regardless of whether they are scheduled or not).

### Project Power
Project Power is proportional to the sum of the amount of data **consumed** (exported from Storage) and **produced** 
(imported to Storage) by each component. This means that it does not matter how much data an extractor downloads from 
the source system. What is important is how much data it **produces** (imports) into your storage. Therefore 
we are counting only the data that matters to you.

Although proportional to the amount of data, Project Power is measured in **units**. This is because it is
difficult to define a universally valid size of a piece of data. Roughly 1 PPU (Project Power Unit) is equivalent 
to 0.5--1GB of data. 
Most of the transfers are efficiently compressed and most of the data *can be* efficiently compressed, which
makes the ratio more favourable. It is important to say that the same data on the same component will always consume
the same number of PPUs.

The **Project Power** tab in **Users & Settings** shows detailed credit consumption by days and components:

{: .image-popup}
![Screenshot - Project Power](/management/project/limits/project-power.png)

### Storage Size
The storage size is the sum of the sizes of the tables in your [Table Storage](/storage/). 
[Aliases](/storage/tables/#aliases) and [Linked Buckets](/storage/buckets/sharing/#link-bucket) do 
not count towards this number, and neither do [Files](/storage/file-uploads).

The table storage size is measured as it is reported by the underlying [backend](/storage/#backend-properties). 
This means that the reported size is substantially smaller than the size of imported raw CSV files, thanks to 
compression used by the database backend. This also means that reported sizes of the same data may differ slightly 
across projects with different [backends](/storage/#backend-properties) (or between buckets in a project
with mixed backends).

### GoodData
If you use [GoodData BI](https://www.gooddata.com/) provisioned by Keboola, the **Limits** page will also show
limits to your GoodData project. These limits are again soft limits. The production project switch shows 
whether you are using a [demo or production project](/writers/gooddata). The demo project is provided free of charge. 

{: .image-popup}
![Screenshot - GoodData Limits](/management/project/limits/limits-2.png)

## Platform Limits
Apart from the business limits, there are limitations of **what Keboola Connection platform can take**. These limits 
are either defined by the underlying technologies, or by what we believe is the correct use of the platform. 
The technical platform limits are **non-negotiable** and **cannot be upgraded** by updating the contract. 
Nonetheless, we certainly would like to hear if you hit them. 

The platform limits may be **soft** limits or **hard** limits. They are also likely to change (improve) over time as the 
development continues, and often can be mitigated by a good project design. Contact us for advice if you are 
concerned about any of them!

For example, the [Redshift backend](/storage/#backend-properties) allows the maximum table cell size of 64kB. This
is a hard limit and nothing can be done about it as long as Redshift is a hard requirement (the Snowflake backend 
can take larger cells). 

As another example, you should not have more than 200 tables in a single bucket. This is a soft limit related to
how we believe the Storage component should be used. Nothing prevents you from exceeding that limit but the 
component performance may degrade. 

The **full list of the platform limits** is available as a 
[separate document](https://docs.google.com/a/keboola.com/spreadsheets/d/1SqUE6vS5Nq0MmB6Kdw5DyuPjlbyXJ0zMDoGDU5cOfSI/edit?usp=sharing).
