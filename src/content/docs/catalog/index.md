---
title: Data Catalog
description: 'How Keboola projects share Storage buckets through the Data Catalog: shared and linked buckets, datashare owners, sharing types and constraints.'
slug: 'catalog'
redirect_from:
  - /storage/buckets/sharing/
---



The Data Catalog gives an overview of the data shared to and from your project: the buckets you share with other projects in your organization, and the buckets they share with you. To share or link a bucket, follow [Share and link buckets](/catalog/share-and-link/); for the pattern of splitting work across several projects, read [Multi-project architecture](/catalog/multi-project/).

<!-- Explanation-type page. Source: the former single Data Catalog page (keboola/connection-docs history), checked 2026-11-19. Facts are carried over from that page and not re-checked against the product. -->

There are generally numerous options
to share data (ranging from CSV exports to writing to a dedicated database). The data catalog
allows you to share data in a very _efficient_, _controlled_ and _auditable_ way.

_Note: The original feature called Shared Buckets is now integrated into our Data Catalog._

## When to share through the catalog

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
- You might want to use [**Multi-project architecture**](/catalog/multi-project/).

To share a bucket with people outside Keboola, in BigQuery or Snowflake, use [Bucket Exposure](/storage/bucket-exposure/).

## Terms

The following terminology is used:

- **Shared bucket** — source project bucket with Sharing enabled; it contains data to be available in other projects.
- **Linked bucket** — reference to a shared bucket in any of the destination projects.
- **Datashare Owner** — person responsible for the shared bucket; this helps with governance and accountability.

All changes and events in a shared bucket are propagated to its linked buckets; any tables you create in the shared bucket become immediately available in the destination projects. Data size and rows are counted only in the source project. Metadata changes, such as bucket color and description, are also propagated to linked buckets.

## What the catalog shows

The Data Catalog shows shared buckets in a list view, a table that you can sort and filter. The **All**, **Linked** and **Mine** buttons filter the list, and **Mine** shows the buckets you own. Click a column header to sort by Name, Datashare Owner, Size, etc., and use the search box to find specific buckets by name or description. You can also edit descriptions and customize bucket colors directly from the catalog, and assign a Datashare Owner to a bucket to show who is responsible for the shared data. The steps are in [Edit a shared bucket's metadata](/catalog/share-and-link/#edit-a-shared-buckets-metadata).

<!-- VERIFY(Nikita): this paragraph merges two passages that announced a new list view "instead of the previous grid view". Confirm that the catalog still opens as a list, that the filter buttons read All, Linked and Mine, and that Name, Datashare Owner and Size are sortable columns. -->

## Constraints

There are some constraints to how shared buckets can be used:

- Source and destination projects must belong to the same organization (and region).
- To manage shared buckets, your user account must be an [organization member](/management/organization/) or a project administrator with the [share role](/management/project/users/#user-roles) assigned.
- [Table aliases](/storage/tables/#aliases) filtered by a condition are shared as database VIEWs with the filter enforced as a `WHERE` clause.
- [Table aliases](/storage/tables/#aliases) without automatically synchronized columns are not shared.
- Tables in linked buckets work like [aliases](/storage/tables/#aliases) — i.e., all tables are read-only in the destination project.
- If your bucket is already linked in other projects, you cannot drop it. Nor can you drop any of its children, tables or columns.
- You cannot delete a shared bucket that has been linked, all the links need to be removed first.

## Sharing types

There are several options how you can share data:

- **Project Members** -- To the **entire [organization](/management/organization/)**. Any user of any project **in the organization** can link the data bucket. <!-- VERIFY(Nikita): confirm that the Project Members type shares to the entire organization, as written here, and that the four type names match the sharing dialog. -->
- **Organization Members** -- To **administrators of the organization**. Any user of any project **in the organization** can link the data bucket provided that they are also an administrator of the organization.
- **Selected Projects** -- To **specified projects**. Any user of the listed projects **in the organization** can link the data bucket.
- **Selected Users** -- To **specified users**. Any listed users **in the organization** can link the data bucket.

## This section

- [Share and link buckets](/catalog/share-and-link/): share an existing bucket or selected tables, add tables to a shared bucket, link a bucket that another project shares, edit a shared bucket's metadata, and stop sharing.
- [Multi-project architecture](/catalog/multi-project/): a usage pattern that puts receiving, analyzing and writing data into separate projects and connects them through the catalog, with a worked example.

---

**Next:** [Share and link buckets →](/catalog/share-and-link/)
