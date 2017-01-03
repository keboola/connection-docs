---
title: Shared buckets
permalink: /storage/buckets/sharing/
---

* TOC
{:toc}

Buckets sharing allows data sharing between projects.

It is helpful for speedup data workflow and it also save your project limits, because data size and rows are counted only in source project.

- **shared bucket** --- bucket with `sharing enabled`, containing data for be available in projects
- **linked bucket** --- shared bucket linked into other project

All changes and events are propagated to linked buckets.

## Limits

Linked buckets are very similar to table aliases, but there are some limitations for shared buckets:

- Source and destination project must belong to same organization
- Your user account must be **organization member**, for manage shared buckets

- Table and bucket attributes **are not shared**
- Table aliases **are not shared**
- Tables in linked bucket works like aliases, ie., tables are **read-only** in destination project

If your bucket is already linked into other projects you will not be able to drop bucket, table or column.

## Working with Shared Buckets

If you want to share project data, you will do these two steps. [Share bucket](/storage/buckets/sharing/#enable-sharing) and [link it](/storage/buckets/sharing/#link-bucket) into project.

### Enable sharing

Open the Storage component and navigate to the detail of bucket you want to share.

Then click on `Enable sharing` button and confirm your action.

{: .image-popup}
![Screenshot -- Enable sharing](/storage/buckets/sharing/sharing-enable-1.png)

{: .image-popup}
![Screenshot -- Confirm action](/storage/buckets/sharing/sharing-enable-2.png)

Bucket is now marked as `Shared to organization`. It is available for other projects now, but you will have to add (link) it to each project manualy.

### Link bucket

If your organization has shared buckets, **link button** will be available in the Storage component. Click on it to link bucket to project

{: .image-popup}
![Screenshot -- Link button](/storage/buckets/sharing/link-bucket-1.png)

Select `shared bucket` and specify new bucket `name` and `stage`. Buckets list is grouped by project name and buckets are identified with its id and description.

{: .image-popup}
![Screenshot -- Select shared bucket](/storage/buckets/sharing/link-bucket-2.png)

This is all you need to do. Bucket is now linked into project and users can its tables data.

{: .image-popup}
![Screenshot -- Linked bucket detail](/storage/buckets/sharing/link-bucket-3.png)

### Disable sharing / Unlink bucket

Removing linked bucket from project is easy like delete of standard bucket.

Before **disable sharing** or **delete shared bucket**, you will have to unlink bucket from all projects first.
