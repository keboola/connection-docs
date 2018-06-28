---
title: Keboola Connection Storage API
permalink: /extractors/other/storage/
---

* TOC
{:toc}

This extractor loads a single or multiple tables from a Keboola Connection project stores them in a bucket in the 
current project. This component is an addition to the situation where [Shared Buckets](/storage/buckets/sharing/) 
cannot apply, eg. moving data between two different [organizations](/management/organization) or regions.

## Create New Configuration
Find the Storage extractor in the list of extractors and create a new configuration. Name it.

{: .image-popup}
![Screenshot - Create configuration](/extractors/other/storage/create-configuration.png)

## Prepare API Token

The extractor requires an API Token with **read-only** access to a **single bucket** only. This limits the potential 
risks of token misuse. 

To create such token, go to **Users & Settings** in the *source project* and create a new token. Use a name that will 
help you identify the token later and set the **read** access to the desired bucket. 

{: .image-popup}
![Screenshot - Create API Token](/extractors/other/storage/create-token.png)

After creating the token, copy it somewhere safe, as you won't be able to see it again. If you lose the token,
you can refresh it - the current token will be deactivated and a new token will be issued.

If you want to extract from multiple buckets, you'll have to create multiple tokens and multiple configurations.

## Specify Source Project 

Select the region of the *source project* and paste the token you generated in the *source project*. 

{: .image-popup}
![Screenshot - Source Project](/extractors/other/storage/source-project.png)

## Add Tables

{: .image-popup}
![Screenshot - Create table](/extractors/other/storage/add-tables.png)

To create a new table, click the **New Table** button and assign a name. 
It will be used to create the source table name in Storage and can be modified.
 
## List Tables

{: .image-popup}
![Screenshot - List tables](/extractors/other/storage/list-tables.png)

The configuration can extract as many tables as you wish. 
The list is fully searchable, and you can delete or disable each table. In addition, you can explicitly run extraction 
of only one table. 
The extraction order of the tables can be changed.  

## Modify Table

Each table has different settings but they are all extracted from the **same project and bucket**. 

{: .image-popup}
![Screenshot - List tables](/extractors/other/storage/configuration.png)


### Source

- **Table Name** specifies the table name in the *source project* within the bucket the token has access to. 
As the token has access to a single bucket only, you do not need to specify the bucket.
- **Changes Since** allows you to extract only a recent part of the data. 

### Save Settings

- **Incremental** changes the import in the current project. If the **Primary Key** is not set, the data is appended, 
otherwise rows with existing primary key are updated.
- **Primary Key** sets the primary key of the table in the current project. The primary key does not have to be the same 
as in the *source project*. 
