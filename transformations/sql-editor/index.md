---
title: SQL Editor
permalink: /transformations/sql-editor/
---

* TOC
{:toc}

The Keboola SQL Editor allows users without specialized tools (like BI or ODBC customers) to directly interact with their Snowflake data warehouse within Keboola Connection. It provides a fluid, seamless, and integrated experience, replacing previous solutions like Snowsight. The editor supports better integration with Keboola Connection Storage features, including linked buckets, tables, shared code, and variables.

Currently, the SQL Editor supports **Snowflake** workspaces.

## Creating a Snowflake SQL Workspace

The SQL Editor is accessed via a dedicated Snowflake Workspace. To get started, you must first create this workspace.

1.  Navigate to **Workspaces** from the main navigation menu.
2.  Click **+ Create Workspace**.
3.  Select **Snowflake SQL Workspace**.

{: .image-popup}
![SQL Editor - Create workspace modal](/transformations/sql-editor/01-create-workspace-modal.jpg)

4.  In the configuration dialog, provide a **Name** for your workspace (e.g., "Demo"). You can optionally add a description and select the **Backend Size**.

5.  Click **CREATE WORKSPACE**.

{: .image-popup}
![SQL Editor - Create workspace action](/transformations/sql-editor/02-create-workspace-action.jpg)

The workspace will be scheduled and created. Once active, you can access the SQL Editor.

6.  Click on the newly created workspace to view its details.
7.  Click **OPEN SQL EDITOR**.

{: .image-popup}
![SQL Editor - Workspace details open editor button](/transformations/sql-editor/03-workspace-details-open-editor.jpg)

## SQL Editor Interface Overview

The SQL Editor interface consists of several key areas designed to facilitate SQL querying and transformation creation.

![](1:45)

### Left Pane: Table Explorer

The left pane, known as the Table Explorer, is divided into two sections:

1.  **Working Tables**: Displays temporary tables created during your current session (initially empty).
2.  **Storage Explorer**: Allows you to browse all tables and buckets available in your Keboola project.

*   **Buckets and Tables**: The explorer shows buckets (folders) and the tables they contain. You can expand buckets to see tables (e.g., `account`, `user`).

{: .image-popup}
![SQL Editor - Editor storage explorer showing buckets and tables](/transformations/sql-editor/04-editor-storage-explorer.jpg)

*   **Linked Tables**: Linked buckets and tables (shared with you from other projects) are also visible, typically indicated by a small chain icon.

### Right Pane: Code Blocks and Results

The main central area is where you write and execute your SQL code.

*   **Code Block**: This is where you write your SQL queries. The editor supports syntax highlighting and autocompletion for Snowflake SQL keywords and functions. 
*   **Query Result Pane**: Located below the code block, this area displays the results of executed queries and query details.

## Basic Usage and Querying

The SQL Editor provides various functionalities to streamline data exploration.

### Previewing Data

To quickly inspect the contents of a table in the Storage Explorer:

1.  Click the three dots next to the desired table (e.g., `account`).
2.  Select **Data preview**.

{: .image-popup}
![SQL Editor - Context menu showing Data preview option](/transformations/sql-editor/05-data-preview-menu.jpg)

This executes a `SELECT * FROM table_name LIMIT 100` query, showing the first rows and metadata in the results pane below. 

{: .image-popup}
![SQL Editor - Query result preview of a table](/transformations/sql-editor/06-query-result-preview.jpg)

### Inserting Table Names

Instead of manually typing full table names, you can insert the fully qualified name directly into the editor:

1.  Click the three dots next to the table name.
2.  Select **Place name in editor**.

{: .image-popup}
![SQL Editor - Context menu showing Place name in editor option](/transformations/sql-editor/07-place-name-in-editor-menu.jpg)

The editor automatically populates the code block with the table's fully qualified Snowflake identifier.

```sql
SELECT * FROM "SAPI_10495"."in.c-keboola-ex-http-01k749e8rrzzs9s7f9p7gbrg"."account";
```

### Running Queries

You can run a query either by clicking the green run icon next to the code block or using the keyboard shortcut **Ctrl + Enter**.

{: .image-popup}
![SQL Editor - Run query button with Ctrl+Enter shortcut hint](/transformations/sql-editor/08-run-query-button.jpg)

### Working with Multiple Queries

You can add multiple code blocks using the **+ New Query** button below the existing block, or **+ New Code Block** below the main editor section.

{: .image-popup}
![SQL Editor - New query block added to the editor](/transformations/sql-editor/09-new-query-block.jpg)

### Viewing Query Details

After executing a query, you can access detailed information about the execution in the results pane by clicking **QUERY DETAILS**.

{: .image-popup}
![SQL Editor - Query details panel open in the results pane](/transformations/sql-editor/10-query-details-panel.jpg)

## Creating Transformations and Output Mapping

The SQL Editor supports creating persistent tables (transformations) that are saved back into Keboola Storage.

### Creating Output Tables

To create a persistent table, you must convert your `SELECT` statements into `CREATE TABLE AS SELECT` statements, specifying a temporary output table name. These tables are automatically created in the workspace schema upon successful execution.

1.  Define a new table using `CREATE TABLE "out" AS SELECT ...`

{: .image-popup}
![SQL Editor - SQL code block showing CREATE TABLE AS SELECT syntax](/transformations/sql-editor/11-create-table-select.jpg)

2.  Run the query block.

If successful, the new tables (e.g., `out` and `out2`) will appear in the **Working Tables** section.

{: .image-popup}
![SQL Editor - Working Tables section showing QR (Query Result) tables](/transformations/sql-editor/12-working-tables-qr.jpg)

### Mapping Output Tables to Storage

Once temporary working tables are created, you must map them to a destination in Keboola Storage if you want to create a transformation that saves data permanently.

1.  In the Working Tables section, click the three dots next to the temporary table (e.g., `out`).
2.  Select **Add table to Output Mapping**.

{: .image-popup}
![SQL Editor - Context menu showing Add table to Output Mapping option](/transformations/sql-editor/13-add-to-output-mapping-menu.jpg)

3.  In the Output Mapping dialog, configure the destination bucket and table name in Storage. You can also define the primary key and set incremental loading options.
4.  Click **ADD OUTPUT**.

![](6:30)

Once mapped, the table icon in the Working Tables section changes to **OM** (Output Mapping), confirming it is ready to be saved as a transformation.

{: .image-popup}
![SQL Editor - Working Tables section showing OM (Output Mapping) table](/transformations/sql-editor/14-working-tables-om.jpg)

### Saving Queries as a Transformation

To persist the SQL logic and output mapping into a formal Keboola Transformation:

1.  Click **SAVE QUERIES** in the top right corner.

{: .image-popup}
![SQL Editor - Save Queries button menu](/transformations/sql-editor/15-save-queries-button.jpg)

2.  Select **Save with description** (or **Save** if no new queries were added).

This action saves the SQL code and the output mapping configuration, creating a new Transformation component in your project.
