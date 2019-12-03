---
title: Data Catalog
permalink: /catalog/
redirect_from:
    - /storage/buckets/sharing/
---

* TOC
{:toc}

*Note: The original feature called Shared Buckets is now integrated into our Data Catalog.*

The data catalog represents an overview of data shared to and from the project. There are generally numerous options
to share data (ranging from CSV exports to writing to a dedicated database). The data catalog 
allows you to share data in a very *efficient*, *controlled* and *auditable* way. 

## Overview
Sharing data via the data catalog is useful in numerous ways -- for example: 

- You want to share the results of your analysis with another department. Instead of exporting it to CSV, you can simply share the 
data with their project. They will gain instant access to the selected data and can, e.g., load it into their sandbox 
immediately. The data is live, so whenever you update the results, your colleagues will see the changes.
- You want to share some data with a data-processing contractor. Instead of exporting the data to CSV, you can create a new Keboola 
Connection project for them and share the data into that project. They will get immediate access to the selected data and can 
start working instantly. They can also share the results of their work with you the same way. 
- You need to provide your company with a set of curated data in auxiliary tables. You can have changing product names and
instead of distributing updates throughout your company, you can create a project with the product table shared to
the rest of the company. Regardless of how and how often the table is updated, this ensures that everyone always looks at the 
same data.
- You might want to use [**Multi-project architecture**](#multi-project-architecture).

The following terminology is used:
- **Shared bucket** — source project bucket with Sharing enabled; it contains data to be available in other projects.
- **Linked bucket** — reference to a shared bucket in any of the destination projects.

All changes and events in a shared bucket are propagated to its linked buckets; any tables you create in the shared bucket become immediately available in the destination projects. Data size and rows are counted only in the source project.

There are some constraints to how shared buckets can be used:

- Source and destination projects must belong to the same organization (and region).
- To manage shared buckets, your user account must be an [organization member](/management/organization/) — i.e., it is not enough to be a project administrator.
- [Table aliases](/storage/tables/#aliases) filtered by a condition are not shared.
- [Table aliases](/storage/tables/#aliases) without automatically synchronized columns are not shared.
- Tables in linked buckets work like [aliases](/storage/tables/#aliases) — i.e., all tables are read-only in the destination project.
- If your bucket is already linked in other projects, you cannot drop it. Nor can you drop any of its children, tables or columns.
- You cannot delete a shared bucket that has been linked, all the links need to be removed first.

### Sharing Types
There are several options how you can share data:
- **Project Members** -- To the **entire [organization](/management/organization/)**. Any user of any project **in the organization** can use the data bucket.
- **Organization Members** -- To **administrators of the organization**. Any user of any project **in the organization** can use the data bucket provided that they are also an administrator of the organization.
- **Selected Projects** -- To **specified projects**. Any user of the listed projects **in the organization** can use the data bucket.

## Enable Sharing
To share data outside of your project, go to *Catalog* a click **Share a bucket**.

{: .image-popup}
![Screenshot -- Enable sharing](/catalog/catalog-1.png)

Next you can choose whether you want to share an existing bucket or create a new one. Both options are technically the same, the choice 
depends purely on whether you prepared the data in advance (an existing bucket) or not (create a new bucket).

### Share an Existing Bucket
Choose the **Share existing bucket** option:

{: .image-popup}
![Screenshot -- Enable sharing](/catalog/catalog-2.png)

Then, select the bucket and a [sharing type](#sharing-types):

{: .image-popup}
![Screenshot -- Finish sharing](/catalog/catalog-3.png)

The bucket is shared and instantly available to other projects in the organization depending on the [sharing type](#sharing-types) 
you have chosen. Provide a description of the bucket so others know what to expect. To enter your description, click on the bucket:

{: .image-popup}
![Screenshot -- View sharing](/catalog/catalog-4.png)

You'll be taken to [Storage](/storage/) where you can add your description to the bucket. The description supports [Markdown](https://www.markdownguide.org/cheat-sheet/) formatting.

{: .image-popup}
![Screenshot -- Set Description](/catalog/catalog-5.png)

To change a sharing type, share the existing bucket again. The newly selected sharing type will overwrite the old one.

### Share a New bucket
Choose the **Select tables** option:

{: .image-popup}
![Screenshot -- Enable Sharing Tables](/catalog/catalog-7.png)

Select the tables and/or buckets you want to share:

{: .image-popup}
![Screenshot -- Select Tables](/catalog/catalog-8.png)

Enter the bucket name and a [sharing type](#sharing-type). Optionally, enter the description:

{: .image-popup}
![Screenshot -- Select Tables](/catalog/catalog-8.png)

A new bucket will be created for you, the selected tables will be linked to it using [aliases](/storage/tables/#aliases).

{: .image-popup}
![Screenshot -- Bucket Result](/catalog/catalog-10.png)

To change a sharing type, share the newly [created bucket again](#share-an-existing-bucket). The newly selected sharing type will overwrite the old one.

## Link a Bucket
You can link a shared bucket into your project from **Shared with you page**:

{: .image-popup}
![Screenshot -- Link Bucket Start](/catalog/catalog-6.png)

Enter a name of the bucket as you'd like to see it in the current project and **Link** the bucket:

{: .image-popup}
![Screenshot -- Link Bucket](/catalog/catalog-11.png)

You'll see that the bucket is available in your project:

{: .image-popup}
![Screenshot -- Link Bucket Result](/catalog/catalog-12.png)

You can see the contents of the shared bucket in [Storage](/storage/), with a link to the source project (if you have access to it). 

{: .image-popup}
![Screenshot -- Link Bucket Tables](/catalog/catalog-13.png)

The detail of the shared bucket in Storage also shows the linked buckets:

{: .image-popup}
![Screenshot -- Shared Bucket Detail](/catalog/catalog-14.png)

You can see the history of when and how a bucket was shared in the Bucket events:

{: .image-popup}
![Screenshot -- Bucket events](/catalog/catalog-15.png)

## Stop Sharing a Bucket
To stop sharing a bucket, go to *Data Catalog* and **Disable** sharing:

{: .image-popup}
![Screenshot -- Disable Sharing](/catalog/catalog-16.png)

*Note: you can only disable sharing if the bucket is not linked to any project. To unlink a bucket, you have to go
to the destination project and unlink it from the Catalog section:*

{: .image-popup}
![Screenshot -- Unlink Bucket](/catalog/catalog-17.png)

Or, you can unlink the bucket from Storage:

{: .image-popup}
![Screenshot -- Unlink Bucket Storage](/catalog/catalog-18.png)
