---
title: Project Limits
permalink: /management/limits/
---

* TOC
{:toc}

Each Keboola Connection Project has two kinds of limits --- **business limits** and **platform limits**. 
Business limits constitute your business usage of our platform. You can see them as the *size of your project*.
Platform limits represent what our platform is technically capable of.

## Business Limits
Project Business limits are defined by your contract. They do scale with your business and accommodate 
to your needs. Business limits are shown under **Users & Settings** and the **Limits** tab:

{: .image-popup}
![Screenshot - Limits](/management/limits/limits.png)

The **Request Increase** button lets you create a support ticket for your Maintainer to request
a project upgrade. All business limits are **soft limits**. Exceeding them will not cause the project to
be restricted anyhow. If you substantially and constantly exceed the project limits, you will be contacted
by our Maintainer with a project upgrade. 

Business limits are:

- **Project Power**
- **Storage size**
- Storage rows
- Users count
- Orchestrations count

**Storage rows** represent the sum of all rows in all tables in [Storage](/storage/). 
[Aliases](/storage/tables/#aliases) and [Linked Buckets](/storage/buckets/sharing/#link-bucket) do 
not count towards this number. 

**Users count** is the number of [project Users](/management/users). 
[Keboola Support Users](/management/support/#keboola-support-users) do not count towards this number.
Also [Tokens](/storage/tokens) do not count towards this number. Effectively this is the number of 
project administrators.

**Orchestrations count** is simply the number of orchestrations (regardless of whether they are scheduled or not).

### Project Power
Project power is proportional to the sum of amount of data *consumed* and *produced* by each component. 
Consumed data are those exported from Storage. Produced data are those imported to Storage. This means that
it does not matter how much data an extractor downloads from the source system. It is important how much
data it **produces** (imports) into your storage. Therefore we are counting only the data that matters to you.

Although proportional to the amount of data, project power is measured in **credits**. This is because it is
difficult to define a universally valid size of a piece of data. Roughly 1 credit is equivalent to 0.5--1GB of data. 
Most of the transfers are efficiently compressed and most of the data *can be* efficiently compressed which
makes the ratio more favorable. It is important to say that the same data on a same component will always consume
the same amount of credits.

The **Project Power** tab in **Users & Settings** shows detailed credit consumption by days and components:

{: .image-popup}
![Screenshot - Project Power](/management/limits/project-power.png)

### Storage Size
Storage size is the sum of sizes of tables in your [Table Storage](/storage/). 
[Aliases](/storage/tables/#aliases) and [Linked Buckets](/storage/buckets/sharing/#link-bucket) do 
not count towards this number. Also [Files](/storage/file-uploads) do not count towards the Storage Size.

The table storage size is measured as it is reported by the underlying [backend](/storage/#backend-properties). 
This means that the 
reported size is substantially smaller than the size of imported raw CSV file, thanks to compression 
used by the database backend. This also means that reported sizes of the same data may differ slightly 
across projects with different [backends](/storage/#backend-properties) (or between buckets in a project
with mixed backends).

### GoodData
If you use [GoodData BI](https://www.gooddata.com/) provisioned by Keboola, the *Limits* page will also show
limits to your GoodData project. These limits are again soft limits.
The production project switch shows whether you are using a [*demo* or 
*production* project](/writers/gooddata). Demo project is provided free of charge. 

{: .image-popup}
![Screenshot - GoodData Limits](/management/limits/limits-2.png)

## Platform Limits
Apart from the Business limits, there are limitations of what Keboola Connection platform can take. These 
limits are either defined by the underlying technologies or by what we believe is the correct use of the platform.
Technical platform limits are non-negotiable and cannot be upgraded by upgrading the project. Nonetheless, we 
certainly like [to hear if you hit them](mailto:support@keboola.com). Platform limits may be soft limits or 
hard limits.

For example the [Redshift backend](/storage/#backend-properties) allows maximum table cell size of 64kB. This
is a hard limit and nothing can be done about it (except for using Snowflake backend). As another example,
you should not have more than 200 tables in a single bucket. This is a soft limit related to
how we believe the Storage component should be used. Nothing prevents you exceeding that limit, but the component
performance may degrade. The full list of platform limit is available as a [separate document](https://docs.google.com/a/keboola.com/spreadsheets/d/1SqUE6vS5Nq0MmB6Kdw5DyuPjlbyXJ0zMDoGDU5cOfSI/edit?usp=sharing).
