---
title: SQL Editor
permalink: /workspace/sql-editor/
redirect_from:
  - /transformations/sql-editor/
---

* TOC
{:toc}

The Keboola SQL Editor allows users without specialized tools to directly interact with their Snowflake data warehouse within Keboola Connection. It offers a smooth, fully integrated experience, replacing previous solutions like Snowsight. The editor is tightly connected with Keboola Storage, so you can easily access and use your buckets, tables, shared codes and variables in one place.

Currently, the SQL Editor supports **Snowflake** workspaces.

## Creating a Snowflake SQL Workspace

The SQL Editor is accessed via a dedicated Snowflake Workspace. To get started, you must first create this workspace.

1.  Navigate to **Workspaces** from the main navigation menu.
2.  Click **+ Create Workspace**.
3.  Select **Snowflake SQL Workspace**.
4.  In the configuration dialog, provide a **Name** for your workspace (e.g., "Demo"). You can optionally add a description and select the **Backend Size**.

5.  Click **CREATE WORKSPACE**.

{: .image-popup}
![SQL Editor - Create workspace action](/workspace/sql-editor/02-create-workspace-action.jpg)

The workspace will be scheduled and created. Once active, you can access the SQL Editor.

6.  Click on the newly created workspace to view its details.
7.  Click **OPEN SQL EDITOR**.

{: .image-popup}
![SQL Editor - Workspace details open editor button](/workspace/sql-editor/03-workspace-details-open-editor.jpg)

## SQL Editor Interface Overview

The SQL Editor interface is divided into key sections that make it easy to explore data, write queries, and create transformations directly within Keboola.

### Left Pane: Table Explorer

The left pane, known as the Table Explorer, is divided into two sections:

1.  **Working Tables**: Displays temporary tables created during your current session (initially empty).
2.  **Storage Explorer**: Allows you to browse all tables and buckets available in your Keboola project.

*   **Buckets and Tables**: The explorer shows buckets (folders) and the tables they contain. You can expand buckets to see tables (e.g., `account`, `user`).

{: .image-popup}
![SQL Editor - Editor storage explorer showing buckets and tables](/workspace/sql-editor/04-editor-storage-explorer.jpg)

*   **Linked Tables**: Linked buckets and tables (shared with you from other projects) are also visible, indicated by a small chain icon.

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
![SQL Editor - Context menu showing Data preview option](/workspace/sql-editor/05-data-preview-menu.jpg)

This executes a `SELECT * FROM table_name LIMIT 100` query, showing the first rows and metadata in the results pane below. 

{: .image-popup}
![SQL Editor - Query result preview of a table](/workspace/sql-editor/06-query-result-preview.jpg)

### Inserting Table Names

Instead of manually typing full table names, you can insert the fully qualified name directly into the editor:

1.  Click the three dots next to the table name.
2.  Select **Place name in editor**.

{: .image-popup}
![SQL Editor - Context menu showing Place name in editor option](/workspace/sql-editor/07-place-name-in-editor-menu.jpg)

The editor automatically populates the code block with the table's fully qualified Snowflake identifier.

```sql
SELECT * FROM "SAPI_10495"."in.c-keboola-ex-http-01k749e8rrzzs9s7f9p7gbrg"."account";
```

### Running Queries

You can run a query either by clicking the green run icon next to the code block or using the keyboard shortcut **Ctrl + Enter**.

{: .image-popup}
![SQL Editor - Run query button with Ctrl+Enter shortcut hint](/workspace/sql-editor/08-run-query-button.jpg)

### Sessions in SQL Editor

A session allows multiple queries to share context and state, so you can work step by step instead of everything being completely independent.
Think of a session as a temporary working environment that exists while you’re actively working in the editor.

#### How long does a session last?

A session in the SQL Editor lasts for 24 hours when there is no user activity (e.g. running a query) or when SQL Editor is closed.

#### What happens when a session expires?
*   Temporary tables are removed
*   Session variables are cleared
*   Other session-specific state is lost

Your SQL queries themselves are not lost, but anything that depended on the previous session state will no longer work until it is recreated.
If your browser window stays open past the 24-hour limit, you’ll see a message informing you that the session has expired. 

#### SQL features that depend on sessions
*   Temporary tables (e.g. CREATE TEMP TABLE)
*   Temporary views
*   SQL variables
*   Session parameters
*   Multi-step workflows that assume shared state between queries

### Working with Multiple Queries

You can add multiple code blocks using the **+ New Query** button below the existing block, or **+ New Code Block** below the main editor section.

{: .image-popup}
![SQL Editor - New query block added to the editor](/workspace/sql-editor/09-new-query-block.jpg)

### Export Query result

To download your query results as a CSV-formatted file, select Export Query result.

**Download limit:** Exported CSV files are limited to **100 MB**. If your query result exceeds this size, consider adding a `LIMIT` clause to reduce the row count, filtering the data before export, or using Keboola Storage to access the full dataset.

### Viewing Query Details

After executing a query, you can access detailed information about the execution in the results pane by clicking **QUERY DETAILS**.

{: .image-popup}
![SQL Editor - Query details panel open in the results pane](/workspace/sql-editor/10-query-details-panel.jpg)

### Viewing Query History

After executing a query, you can view detailed information about previously run queries in the results pane by clicking **QUERY HISTORY**.

## Creating Transformations and Output Mapping

The SQL Editor supports creating persistent tables that are saved back into Keboola Storage.

### Creating Output Tables

To create a persistent table, you must convert your `SELECT` statements into `CREATE TABLE AS SELECT` statements, specifying a temporary output table name. These tables are automatically created in the workspace schema upon successful execution.

1.  Define a new table using `CREATE TABLE "out" AS SELECT ...`

{: .image-popup}
![SQL Editor - SQL code block showing CREATE TABLE AS SELECT syntax](/workspace/sql-editor/11-create-table-select.jpg)

2.  Run the query block.

If successful, the new tables (e.g., `out` and `out2`) will appear in the **Working Tables** section.

{: .image-popup}
![SQL Editor - Working Tables section showing QR (Query Result) tables](/workspace/sql-editor/12-working-tables-qr.jpg)

### Mapping Output Tables to Storage

Once temporary working tables are created, you must map them to a destination in Keboola Storage if you want to create a transformation that saves data permanently.

1.  In the Working Tables section, click the three dots next to the temporary table (e.g., `out`).
2.  Select **Add table to Output Mapping**.

{: .image-popup}
![SQL Editor - Context menu showing Add table to Output Mapping option](/workspace/sql-editor/13-add-to-output-mapping-menu.jpg)

3.  In the Output Mapping dialog, configure the destination bucket and table name in Storage. You can also define the primary key and set incremental loading options.
4.  Click **ADD OUTPUT**.

Once mapped, the table icon in the Working Tables section changes to **OM** (Output Mapping), confirming it is ready to be saved as a transformation.

{: .image-popup}
![SQL Editor - Working Tables section showing OM (Output Mapping) table](/workspace/sql-editor/14-working-tables-om.jpg)

### Saving Queries as a Transformation

To persist the SQL logic and output mapping into a formal Keboola Transformation:

1.  Click **SAVE QUERIES** in the top right corner.

{: .image-popup}
![SQL Editor - Save Queries button menu](/workspace/sql-editor/15-save-queries-button.jpg)

2.  Select **Save with description** (or **Save** if no new queries were added).

This action saves the SQL code and the output mapping configuration, creating a new Transformation component in your project.

## Advanced SQL Editor Concepts

This section describes advanced concepts available in the SQL Editor.

### Input Mapping

While the SQL Editor automatically provides read-only access to all tables within the project's Storage (visible in the **Storage Explorer** below the Working Tables section), Input Mapping (IM) is necessary when you need to apply filters, specify specific columns, or set time-based filters before the data is loaded into the workspace database.

Input Mapping is also commonly used when migrating older transformations that rely on input mapping configuration.

#### Setting up Input Mapping

To set up Input Mapping for a table:

1. Locate the desired table in the **Storage Explorer** (e.g., the `account` table under `basic-customer`).
2. Click the three dots next to the table name.
3. Select **Add table to Input Mapping**.

{: .image-popup}
![Context menu showing Add table to Input Mapping](/workspace/sql-editor/21-input-mapping-context-menu.jpg)

4. The Input Mapping configuration dialog opens:

{: .image-popup}
![Input Mapping dialog](/workspace/sql-editor/22-input-mapping-dialog.jpg)

Here you can define:

*   **Source:** The source bucket and table (pre-filled).
*   **Table Name:** The alias used for this table in your SQL queries within the workspace (e.g., `account`).
*   **Columns (optional):** Specify which columns to import, or leave empty to import all.
*   **Changed in Last (optional):** Filter the data based on when it was last changed in Storage. This is useful for incremental loads.

{: .image-popup}
![Changed in Last filter selection](/workspace/sql-editor/23-input-mapping-changed-in-last.jpg)

*   **Data Filter (optional):** Apply column-based filtering using specific values.
*   **Data Types:** Define column data types (optional).

5. Click **Add Input** to finalize the configuration. The table now appears in the **Working Tables** section marked with **IM** (Input Mapping).

#### Loading Input Mapped Data

When a table is configured with Input Mapping, it is *not* immediately loaded into the workspace. The configuration merely tells the transformation what to load when it runs.

To query and work with the filtered/mapped data interactively in the editor, you must manually load it:

1. In the **Working Tables** section, locate the Input Mapped table (e.g., `account`).
2. Click the **Load Data** option that appears near the table.

{: .image-popup}
![Load Data prompt](/workspace/sql-editor/24-load-data-confirmation.jpg)

3. Confirm the loading by clicking **Load Latest Data**.

If a table is configured for Input Mapping but not yet loaded, hovering over the table icon will show a warning indicating limited functionality.

{: .image-popup}
![Unloaded Input Mapped table warning](/workspace/sql-editor/25-unloaded-table-tooltip.jpg)

### Shared Code

Shared Code allows you to reuse predefined SQL queries across multiple transformations or query blocks. This promotes consistency and simplifies maintenance. 

#### Importing Shared Code Blocks

To import shared code into a transformation block:

1. In the SQL code editor block, click the **Select Shared Code** link.

{: .image-popup}
![Select Shared Code button](/workspace/sql-editor/26-select-shared-code.jpg)

2. In the "Add Shared Code" dialog, select the desired code from the dropdown (e.g., `Aggregate`).

{: .image-popup}
![Shared Code dialog showing Aggregate selection](/workspace/sql-editor/27-add-shared-code-dialog.jpg)

#### Shared Code Options

You have two options for using shared code:

1.  **Use Inline:** The SQL text of the shared code is copied directly into your transformation block. You can then freely edit and modify the code locally. This is equivalent to copy-pasting the code.
2.  **Use as Shared Code (Linking):** The code block is linked to the original shared code template.

When linking shared code:

*   The code block appears labeled **SHARED CODE**.
*   Any updates made to the original shared code template will automatically propagate to this transformation block.
*   The code within the block is read-only (uneditable), ensuring integrity with the shared template.

If you need to make modifications to the code for a specific transformation, you must use the **Use Inline** option.


### Variables

Variables allow you to parametrize transformations. More information can be found [here](https://help.keboola.com/transformations/variables/).
Variables can be created, edited, used or removed inside of SQL Editor.

#### Using Variables in Transformations and Workspaces

Variables behave consistently across both Workspaces and Transformations:

In a Workspace, you can create variables and use them in your SQL queries. When you save the Workspace (which also saves its queries), you can then copy it to a new or existing Transformation. This action transfers the queries, input/output mapping, and all associated variables.

In a Transformation, you can also create variables and reference them in your transformation queries. You can then copy the Transformation to a Workspace, which brings over its queries, mappings, and variables.

#### Important ####

Variables are not shared automatically between Workspaces and Transformations.
If you create a variable in either a Workspace or a Transformation and do not copy the configuration to the other environment, that variable will remain local to where it was created—meaning it won’t be visible or usable elsewhere.

### Workspace Sharing

How Workspaces work now while using SQL Editor, there are two important components:
1. Workspace
   
This stores configuration - such as:
*   Input Mapping (IM)
*   Output Mapping (OM)
*   **Saved** SQL queries
2. Working Tables

This is the state of the database schema where tables are created while working in the workspace. Every user has his own.

**Previous Behavior (before SQL Editor):**
One workspace sandbox had one shared physical workspace for all users.
Multiple users worked in the same database schema, meaning:
*   They could see each other's tables.
*   They could accidentally overwrite or remove each other’s data.
Workspaces were hidden in the UI unless explicitly shared, but technically everyone still accessed the same workspace behind the scenes.

**Current Behavior (SQL Editor Workspaces):**
Each user now gets their own physical workspace (database schema) even though the sandbox configuration is shared.
This makes collaboration safer because:
*   Users share saved SQL queries, input/output mappings, and configuration.
*   But do NOT share query result tables or loaded data.
Everyone works in an isolated database state.

#### What This Means in Practice

| Scenario | What Happens | Impact |
|---|---|---|
| Two users open the same shared workspace sandbox | They see the same configuration (Input/Output mapping, saved SQL queries) | ✅ Collaboration on queries and configuration |
| User creates a table by running a query (not output-mapped) | Table is created only in that user’s personal database schema | ❌ Other users **cannot** see or access it |
| User saves a SQL query | Query is saved to the shared workspace sandbox configuration | ✅ Other users **can see and run it** |
| Two users save queries at the same time | A conflict warning appears (configuration changed by another user) | ⚠️ One user may need to reload/resolve changes |
| User unloads table from SQL Editor to Storage | Table becomes a standard KBC Storage table | ✅ Visible to others via Storage, outside the workspace |
| Sharing workspace sandbox is enabled | Users can open each other’s workspace sandbox configuration | ✅ Shared queries & mappings, ❌ not shared database state |

**Benefits of the New Setup**
*   Safer collaboration – users don’t overwrite each other’s data
*   SQL queries can be shared without entering the database (unlike before)
*   No risk of table conflicts when multiple people work in parallel
*   Query results can now be exported to Storage (previously not possible)
*   Same configuration, personal workspace state = best of both isolation and collaboration

**Limitations to Be Aware Of**
*   Users cannot directly share tables or workspace data with each other
*   Only saved SQL queries are shared, drafts or unsaved queries are not visible to others
*   When multiple users edit and save queries at the same time, a conflict alert may appear
(e.g., “You are saving a configuration that was modified by another user.”)
*   Each user sees their own version of workspace tables, even when working in the same shared sandbox
