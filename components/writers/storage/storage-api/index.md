---
title: Keboola Connection Storage
permalink: /components/writers/storage/storage-api/
redirect_from:
    - /writers/storage/storage-api/
---

* TOC
{:toc}

This writer loads single or multiple tables from your current project into a different Keboola Connection (KBC) project.
The component can be used in situations where [Shared Buckets](/storage-api/buckets/sharing/)
cannot, e.g., moving data between two different [organizations](/management/organization) or regions.

## Create New Configuration
Find the Keboola Connection Storage writer in the list of writers and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/components/writers/storage/storage-api/create-configuration.png)

## Prepare API Token
The writer requires an [API Token](/management/project/tokens/) with **write** access to a **single bucket** only. 
This limits the potential risks of token misuse.

To create such a token, go to **Users & Settings** in the *target project* and create a new token. Use a name that will
help you identify the token later, and set the **write** access to the desired bucket.

{: .image-popup}
![Screenshot - Create API Token](/components/writers/storage/storage-api/create-token.png)

After creating the token, copy it somewhere safe as you won't be able to see it again. If you lose the token,
you can refresh it -- the current token will be deactivated and a new token will be issued.

If you want to write to multiple buckets, you'll have to create multiple tokens (each with access to a single bucket only)
and multiple configurations.

## Specify Target Project
Select the region of the *target project* and paste the token you generated in the *target project*.

{: .image-popup}
![Screenshot - Target Project](/components/writers/storage/storage-api/target-project-1.png)

You can review the name of the target project and bucket in the *Target project* configuration section.

{: .image-popup}
![Screenshot - Target Project](/components/writers/storage/storage-api/target-project-2.png)

## Add Tables

{: .image-popup}
![Screenshot - Create table](/components/writers/storage/storage-api/add-tables.png)

To create a new table, click the **New Table** button and select a table you want to write to the *target project*.

## List Tables

{: .image-popup}
![Screenshot - List tables](/components/writers/storage/storage-api/list-tables.png)

The configuration can write as many tables as you wish.
The list is fully searchable, and you can delete or disable each table. In addition, you can explicitly write one table
only. The write order of the tables can be changed.

## Modify Table

Each table has different settings but they are all written to the **same project and bucket**.

{: .image-popup}
![Screenshot - List tables](/components/writers/storage/storage-api/configuration.png)

### Source
- **Table** specifies the table in the *source project*. This value cannot be changed. If you want to write another table,
create a new item in the configuration.
- **Changed In Last** allows you to use [incremental processing](/storage/tables/#incremental-processing) to write only the recent part of the data.

### Destination
- **Table Name** -- table name in the *target project* and bucket.
- **Incremental** -- enables [incremental loading](/storage/tables/#incremental-loading) in the *target project*.
The **primary key** setting will be used from the table in the current project.
