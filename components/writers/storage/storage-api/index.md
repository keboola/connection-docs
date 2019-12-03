---
title: Keboola Connection Storage
permalink: /components/writers/storage/storage-api/
redirect_from:
    - /writers/storage/storage-api/
---

* TOC
{:toc}

This writer loads single or multiple tables from your current project into a different Keboola Connection project.
The component can be used in situations where [Data Catalog](/catalog/)
cannot, e.g., moving data between two different [organizations](/management/organization) or regions.

## Prepare API Token
The writer requires an [API Token](/management/project/tokens/) with **write** access to a **single bucket** only. 
This limits the potential risks of token misuse.

To create such a token, go to **Users & Settings** in the *target project* and create a new token. Use a name that will
help you identify the token later, and set the **write** access to the desired bucket.

{: .image-popup}
![Screenshot - Create API Token](/components/writers/storage/storage-api/storage-api-1.png)

After creating the token, copy it somewhere safe as you won't be able to see it again. If you lose the token,
you can refresh it -- the current token will be deactivated and a new token will be issued.

If you want to write to multiple buckets, you'll have to create multiple tokens (each with access to a single bucket only)
and multiple configurations.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Keboola Connection Storage** writer.

## Specify Target Project
Select the region of the *target project* and paste the token [you generated](#prepare-api-token) in the *target project*.

{: .image-popup}
![Screenshot - Target Project](/components/writers/storage/storage-api/storage-api-2.png)

You can review the name of the target project and bucket in the *Target project* configuration section.

{: .image-popup}
![Screenshot - Target Project](/components/writers/storage/storage-api/storage-api-3.png)

## Add Tables
To create a new table, click the **New Table** button and select the table you want to write to the *target project*.

{: .image-popup}
![Screenshot - Create table](/components/writers/storage/storage-api/storage-api-4.png)

Configured tables are stored as [configuration rows](/components/#configuration-rows).
Each table has different settings but they are all written to the **same project and bucket**.

### Source
- **Table** specifies the table in the *source project*. This value cannot be changed. If you want to write another table,
create a new item in the configuration.
- **Changed In Last** allows you to use [incremental processing](/storage/tables/#incremental-processing) to write only the recent part of the data.

### Destination
- **Table Name** -- table name in the *target project* and bucket.
- **Mode** -- One of `Update`, `Replace` or `Recreate`. The update mode enables [incremental loading](/storage/tables/#incremental-loading) 
in the *target project*. The **primary key** setting will be used from the table in the current project. The replace mode replaces all data
in the target table, but keeps the table structure. The Recreate mode drops and creates the target table. Note that the
Recreate mode creates a brief moments where the target table does not exist. This can create problems for example when an orchestration
reading the table runs very often -- it may fail occasionally.

{: .image-popup}
![Screenshot - Table detail](/components/writers/storage/storage-api/storage-api-5.png)
