---
title: SQL Editor
permalink: /transformations/sql-editor/
---

* TOC
{:toc}

The Keboola SQL Editor allows users without specialized tools (like BI or ODBC customers) to directly interact with their Snowflake data warehouse within Keboola Connection. It offers a smooth, fully integrated experience, replacing previous solutions like Snowsight. The editor is tightly connected with Keboola Storage, so you can easily access and use your buckets, tables, shared codes and variables in one place.

Currently, the SQL Editor supports **Snowflake** workspaces.

{% include public-beta-warning.html %}

* TOC
{:toc}

## Creating a Snowflake SQL Workspace

The SQL Editor is accessed via a dedicated Snowflake Workspace. To get started, you must first create this workspace.

1.  Navigate to **Workspaces** from the main navigation menu.
2.  Click **+ Create Workspace**.
3.  Select **Snowflake SQL Workspace**.

{: .image-popup}
![SQL Editor - Create workspace modal](/transformations/sql-editor/01-create-snowflake-workspace-modal.png)

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

The SQL Editor interface is divided into key sections that make it easy to explore data, write queries, and create transformations directly within Keboola.

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

### Viewing Query History

After executing a query, you can view detailed information about previously run queries in the results pane by clicking **QUERY HISTORY**.

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

## Advanced SQL Editor Concepts

This section describes advanced concepts available in the SQL Editor.

### Input Mapping

While the SQL Editor automatically provides read-only access to all tables within the project's Storage (visible in the **Storage Explorer** below the Working Tables section), Input Mapping (IM) is necessary when you need to apply filters, specify specific columns, or set time-based filters before the data is loaded into the workspace database.

Input Mapping is also commonly used when migrating older transformations that relied on predefined input configurations.

#### Setting up Input Mapping

To set up Input Mapping for a table:

1. Locate the desired table in the **Storage Explorer** (e.g., the `account` table under `basic-customer`).
2. Click the three dots next to the table name.
3. Select **Add table to Input Mapping**.

{: .image-popup}
![Context menu showing Add table to Input Mapping](/transformations/sql-editor/21-input-mapping-context-menu.jpg)

4. The Input Mapping configuration dialog opens:

{: .image-popup}
![Input Mapping dialog](/transformations/sql-editor/22-input-mapping-dialog.jpg)

Here you can define:

*   **Source:** The source bucket and table (pre-filled).
*   **Table Name:** The alias used for this table in your SQL queries within the workspace (e.g., `account`).
*   **Columns (optional):** Specify which columns to import, or leave empty to import all.
*   **Changed in Last (optional):** Filter the data based on when it was last changed in Storage. This is useful for incremental loads.

{: .image-popup}
![Changed in Last filter selection](/transformations/sql-editor/23-input-mapping-changed-in-last.jpg)

*   **Data Filter (optional):** Apply column-based filtering using specific values.
*   **Data Types:** Define column data types (optional).

5. Click **Add Input** to finalize the configuration. The table now appears in the **Working Tables** section marked with **IM** (Input Mapping).

#### Loading Input Mapped Data

When a table is configured with Input Mapping, it is *not* immediately loaded into the workspace. The configuration merely tells the transformation what to load when it runs.

To query and work with the filtered/mapped data interactively in the editor, you must manually load it:

1. In the **Working Tables** section, locate the Input Mapped table (e.g., `account`).
2. Click the **Load Data** option that appears near the table.

{: .image-popup}
![Load Data prompt](/transformations/sql-editor/24-load-data-confirmation.jpg)

3. Confirm the loading by clicking **Load Latest Data**.

If a table is configured for Input Mapping but not yet loaded, hovering over the table icon will show a warning indicating limited functionality.

{: .image-popup}
![Unloaded Input Mapped table warning](/transformations/sql-editor/25-unloaded-table-tooltip.jpg)

### Shared Code

Shared Code allows you to reuse predefined SQL queries across multiple transformations or query blocks. This promotes consistency and simplifies maintenance. 

#### Importing Shared Code Blocks

To import shared code into a transformation block:

1. In the SQL code editor block, click the **Select Shared Code** link.

{: .image-popup}
![Select Shared Code button](/transformations/sql-editor/26-select-shared-code.jpg)

2. In the "Add Shared Code" dialog, select the desired code from the dropdown (e.g., `Aggregate`).

{: .image-popup}
![Shared Code dialog showing Aggregate selection](/transformations/sql-editor/27-add-shared-code-dialog.jpg)

#### Shared Code Options

You have two options for using shared code:

1.  **Use Inline:** The SQL text of the shared code is copied directly into your transformation block. You can then freely edit and modify the code locally. This is equivalent to copy-pasting the code.
2.  **Use as Shared Code (Linking):** The code block is linked to the original shared code template.

When linking shared code:

*   The code block appears labeled **SHARED CODE**.
*   Any updates made to the original shared code template will automatically propagate to this transformation block.
*   The code within the block is read-only (uneditable), ensuring integrity with the shared template.

If you need to make modifications to the code for a specific transformation, you must use the **Use Inline** option.

## Limitations

*   The option to share a Snowflake workspace is currently unavailable.
*   Download Query result table into CSV, TSV or excel is currently in development.

