---
title: Shared Buckets
permalink: /storage/buckets/sharing/
---

* TOC
{:toc}

Bucket sharing allows you to share data between projects within an [organization](/management/organization/),
giving you far greater organizational control over your data. 
You can now decide which projects, and therefore which users, have access to which data. 
This also helps speed up your data workflow and reduce your project usage totals because the data size 
and rows are counted only in the source project.

- **Shared bucket** --- source project bucket with **Sharing** enabled; it contains data to be available in other projects.
- **Linked bucket** --- reference to a shared bucket in any of the destination projects.

All changes and events in a shared bucket are propagated to its linked buckets; 
any tables you create in the shared bucket become immediately available in the destination projects.

## Sharing Type
You can specify who can link the bucket to a project:

- **Organization Member** --- Only organization members are able to link the shared bucket to a project.
- **Project Member** --- Every project member is able to link the shared bucket to a project.

## Limitations

There are some limitations to how shared buckets can be used:

- Source and destination projects must belong to the same organization.
- To manage shared buckets, your user account must be an [**organization member**](/management/organization/) --- i.e. it is not enough to
be a project member.
- Table and bucket attributes are **not shared**.
- Table aliases are **not shared**.
- Tables in linked buckets work like aliases --- i.e. all tables are **read-only** in the destination project.

If your bucket is already linked in other projects, you cannot drop it. 
Nor can you drop any of its children, tables or columns.

## Working with Shared Buckets

If you want to share project data, first [share a bucket](/storage/buckets/sharing/#enable-sharing) 
and then [link it](/storage/buckets/sharing/#link-bucket) into the project.

### Enable Sharing

Go to Storage and [navigate to the detail](/storage/buckets/) of the bucket you want to share.
Then click `Enable sharing` and confirm your action.

{: .image-popup}
![Screenshot -- Enable sharing](/storage/buckets/sharing/sharing-enable-1.png)

{: .image-popup}
![Screenshot -- Confirm action](/storage/buckets/sharing/sharing-enable-2-v3.png)

The bucket is now marked as `Shared to organization` and is available for other projects. 
Remember to add (link) it to each project manually.

### Link Bucket

Once your organization has shared buckets, the **link button** will become available in the Storage section. 
Click on it to link the bucket to the project.

{: .image-popup}
![Screenshot -- Link button](/storage/buckets/sharing/link-bucket-1.png)

Select `shared bucket` and specify the new bucket `name` and `stage`. 
The buckets list is grouped by the project name, and buckets are identified by their id and description.

{: .image-popup}
![Screenshot -- Select shared bucket](/storage/buckets/sharing/link-bucket-2.png)

This is all you need to do. The bucket is now linked into the project, and users can use its tables and data.

{: .image-popup}
![Screenshot -- Linked bucket detail](/storage/buckets/sharing/link-bucket-3-v2.png)

### Disable Sharing / Unlink Bucket

Removing a linked bucket from a project is as easy as deleting a standard bucket. Only
the linked bucket gets deleted (including all tables in it) without affecting the shared bucket in any way. 

Please keep in mind that before you can **disable sharing** or **delete a shared bucket**, 
you first have to unlink the bucket from **all projects**.
