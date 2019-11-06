---
title: Keboola Connection Storage
permalink: /components/extractors/storage/storage-api/
redirect_from:
    - /extractors/storage/storage-api/
---

* TOC
{:toc}

This extractor loads single or multiple tables from a Keboola Connection project and stores them in a bucket in your
current project. The component can be used in situations where [Shared Buckets](/storage/buckets/sharing/)
cannot, e.g. when moving data between two different [organizations](/management/organization) or regions.

## Prepare API Token
The extractor requires an [API Token](/management/project/tokens/) with **read-only** access to a **single bucket**. 
This limits the potential risks of token misuse.

To create such a token, go to **Users & Settings** in the *source project* and create a new token. Use a name that will
help you identify the token later, and set the **read** access to the desired bucket.

{: .image-popup}
![Screenshot - Create API Token](/components/extractors/storage/storage-api/storage-api-1.png)

After creating the token, copy it somewhere safe as you won't be able to see it again. If you lose the token,
you can refresh it -- the current token will be deactivated and a new token will be issued.

If you want to extract from multiple buckets, you'll have to create multiple tokens and multiple configurations.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Keboola Connection Storage** extractor.
Select the region of the *source project*, and paste the token you generated in the *source project*.

{: .image-popup}
![Screenshot - Source Project](/components/extractors/storage/storage-api/storage-api-2.png)

## Add Tables

{: .image-popup}
![Screenshot - Create table](/components/extractors/storage/storage-api/storage-api-3.png)

To copy a table from the source project to the current project, click **Add Table**. 
Then assign the table a name that will be used in your project. If the table name is not same in the source and in the destination 
project, you can change the source table name on the next page.

{: .image-popup}
![Screenshot - Set up table](/components/extractors/storage/storage-api/storage-api-4.png)

Configured tables are stored as [configuration rows](/components/#configuration-rows).
Each table has different settings but they are all extracted from the **same project and bucket**.

## Modify Table Extraction Settings

{: .image-popup}
![Screenshot - Save Settings](/components/extractors/storage/storage-api/storage-api-5.png)

### Source

- **Table Name** specifies the table name in the *source project* within the bucket to which the token has access.
As the token has access to a single bucket only, you do not need to specify the bucket.
- **Changed In Last** allows you to extract only the recent part of the data.

### Save Settings

- **Incremental** -- enables [incremental loading](/storage/tables/#incremental-loading) in the current project. If the **Primary Key** is not set, the data is appended. 
Otherwise the rows with an existing primary key are updated.
- **Primary Key** -- sets the primary key of the table in the current project. The primary key does not have to be the same
as in the *source project*.
