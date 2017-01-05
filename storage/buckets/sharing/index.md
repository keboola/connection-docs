---
title: Shared buckets
permalink: /storage/buckets/sharing/
---

* TOC
{:toc}

Buckets sharing allows you to share data between projects within an [organization](/management/organization/).
This feature allows you to share data between projects giving you far greater organizational control over your data. 
You can now decide which projects, and therefore which users, have access to which data. This also helps speedup your 
data workflow and reduce your project usage totals because the data size and rows are counted only in the source project.

- **shared bucket** --- bucket in source project with enabled **Sharing**, containing data to be available in other projects
- **linked bucket** --- a reference to a shared bucket in any of destination projects

All changes and events in the shared bucket are propagated to its linked buckets. That means that any tables you 
create in the shared bucket will become immediately available in the destination projects.

## Limitations

Linked buckets behave very similarly to table aliases, but there are some limitations:

- Source and destination project must belong to same organization.
- To manage shared buckets, your user account must be an [**organization member**](/management/organization/) -- i.e. it is not sufficient to
be a member of the projects.
- Table and bucket attributes **are not shared**.
- Table aliases **are not shared**.
- Tables in linked buckets works like aliases -- i.e. all tables are **read-only** in the destination project.

If your bucket is already linked in other projects you will not be able to drop it or any of its children, tables or columns.

## Working with Shared Buckets

If you want to share project data, you will need to follow these two steps. [Share bucket](/storage/buckets/sharing/#enable-sharing) and [link it](/storage/buckets/sharing/#link-bucket) into the project.

### Enable sharing

Go to Storage and [navigate to the detail](/storage/buckets/) of bucket you want to share.

Then click on `Enable sharing` and confirm your action.

{: .image-popup}
![Screenshot -- Enable sharing](/storage/buckets/sharing/sharing-enable-1.png)

{: .image-popup}
![Screenshot -- Confirm action](/storage/buckets/sharing/sharing-enable-2.png)

The bucket is now marked as `Shared to organization`. It is now available for other projects, but you will have to add (link) it to each project manually.

### Link bucket

If your organization has shared buckets, a **link button** will be available in the Storage section. Click on it to link a bucket to the project

{: .image-popup}
![Screenshot -- Link button](/storage/buckets/sharing/link-bucket-1.png)

Select `shared bucket` and specify the new bucket `name` and `stage`. The buckets list is grouped by project name and buckets are identified by their id and description.

{: .image-popup}
![Screenshot -- Select shared bucket](/storage/buckets/sharing/link-bucket-2.png)

This is all you need to do. The bucket is now linked into the project and users can use its tables and data.

{: .image-popup}
![Screenshot -- Linked bucket detail](/storage/buckets/sharing/link-bucket-3.png)

### Disable sharing / Unlink bucket

Removing a linked bucket from project is as easy as deleting a standard bucket. This only
deletes the link and does not affect the shared bucket anyhow.

Note however that before you can **disable sharing** or **delete shared bucket**, you will first have to unlink 
the bucket from **all projects**.
