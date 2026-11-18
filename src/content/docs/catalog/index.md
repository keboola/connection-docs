---
title: Data Catalog
description: 'Catalog gives an overview of the data shared to and from your project.'
slug: 'catalog'
redirect_from:
  - /storage/buckets/sharing/
---



_Note: The original feature called Shared Buckets is now integrated into our Data Catalog._

The data catalog represents an overview of data shared to and from the project. There are generally numerous options
to share data (ranging from CSV exports to writing to a dedicated database). The data catalog
allows you to share data in a very _efficient_, _controlled_ and _auditable_ way.

## List View and Enhanced Features

The Data Catalog now offers a list view instead of the previous grid view, providing better organization and visibility of shared data:

- **List View**: Easily sort and filter shared buckets with a table-based interface
- **Metadata Editing**: Edit descriptions and customize bucket colors directly from the catalog
- **Datashare Owner**: Assign ownership to buckets, indicating who is responsible for the shared data
- **Filtering Options**: Filter buckets by "All", "Linked", or "Mine" (buckets you own)

These enhancements make it easier to manage shared data and provide better governance capabilities, especially for organizations with extensive data sharing needs.

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
- You might want to use [**Multi-project architecture**](/catalog/multi-project/).

The following terminology is used:

- **Shared bucket** — source project bucket with Sharing enabled; it contains data to be available in other projects.
- **Linked bucket** — reference to a shared bucket in any of the destination projects.
- **Datashare Owner** — person responsible for the shared bucket; this helps with governance and accountability.

All changes and events in a shared bucket are propagated to its linked buckets; any tables you create in the shared bucket become immediately available in the destination projects. Data size and rows are counted only in the source project. Metadata changes, such as bucket color and description, are also propagated to linked buckets.

There are some constraints to how shared buckets can be used:

- Source and destination projects must belong to the same organization (and region).
- To manage shared buckets, your user account must be an [organization member](/management/organization/) or a project administrator with the [share role](/management/project/users/#user-roles) assigned.
- [Table aliases](/storage/tables/#aliases) filtered by a condition are shared as database VIEWs with the filter enforced as a `WHERE` clause.
- [Table aliases](/storage/tables/#aliases) without automatically synchronized columns are not shared.
- Tables in linked buckets work like [aliases](/storage/tables/#aliases) — i.e., all tables are read-only in the destination project.
- If your bucket is already linked in other projects, you cannot drop it. Nor can you drop any of its children, tables or columns.
- You cannot delete a shared bucket that has been linked, all the links need to be removed first.

### Sharing Types

There are several options how you can share data:

- **Project Members** -- To the **entire [organization](/management/organization/)**. Any user of any project **in the organization** can link the data bucket.
- **Organization Members** -- To **administrators of the organization**. Any user of any project **in the organization** can link the data bucket provided that they are also an administrator of the organization.
- **Selected Projects** -- To **specified projects**. Any user of the listed projects **in the organization** can link the data bucket.
- **Selected Users** -- To **specified users**. Any listed users **in the organization** can link the data bucket.

## Filtering and Sorting Buckets

The new list view in the Data Catalog provides enhanced filtering and sorting capabilities:

- **Filter buttons**: Use the "ALL", "LINKED", or "MINE" buttons to filter buckets
- **Column sorting**: Click on column headers to sort by Name, Datashare Owner, Size, etc.
- **Search**: Use the search box to find specific buckets by name or description

These features help you quickly locate and manage your shared data, especially in environments with many shared buckets.
