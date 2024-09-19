---
title: Global Search
permalink: /management/global-search/
---

* TOC
{:toc}

<div class="clearfix"></div>
<div class="alert alert-warning" role="alert">
    <i class="fas fa-exclamation-circle"></i>
    <strong>Important:</strong> This feature is currently available in <strong>BETA</strong>.
</div>

## What Is Global Search?
Global Search is an enhancement of the existing search functionality within Keboola.
It allows you to search for entities by name across all projects within an organization, even those you don't have direct access to.
The search is conducted only through entity names to ensure confidentiality. If a user searches for an entity within a project they don't have access to,
they will be notified that access must be requested.

## Searching
You can perform a search across the entire organization using the global search interface:

{: .image-popup}
![Screenshot - Interface](/management/global-search/global-search-1.png)

The functionality supports filtering by entity type and environment. The search results will display both the total number of matches and
aggregated results by entity type.

{: .image-popup}
![Screenshot - Search Results](/management/global-search/global-search-2.png)

## Supported Entity Types
You can search various entities across your organization. Results are sorted by relevance and creation date,
with the most relevant and newest results appearing first.

The currently supported types:

- **Flow**
- **Bucket** (under Storage)
- **Table** (under Storage)
- **Transformation**
- **Configuration** (under Components)
- **Workspace**
- **Shared Code**

## Using Global Search
Once a search is performed, the system will return a list of entities that match the query. The results will include detailed information about the entities found,
such as entity type, name, and source project.

***Note:** Folders are not displayed in search results because they do not support detailed searches and rely on metadata.*

## Sharing and Accessing Results
If a user attempts to search for an entity within a project they don’t have access to, they will be notified that they need to request access to that project.
This ensures that no sensitive or restricted information is exposed.

{: .image-popup}
![Screenshot - No Access](/management/global-search/global-search-3.png)

## Limitations
The Global Search feature has the following limitations:

- The search functionality is limited to name-based searches and does not support searching through sensitive data.
- It is not possible to migrate projects with Global Search enabled between organizations.
- Renaming projects temporarily is not supported if Global Search is enabled.
- Some entities you create may not appear in the global search immediately; it might take a short while before they become searchable.
