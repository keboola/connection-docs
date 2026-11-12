---
title: Manage tables
slug: 'storage/tables/manage'
description: 'Manage Storage tables in the UI: create an alias table, set or remove a primary key, truncate a table, and delete rows.'
---

Step-by-step tasks for an existing Storage table. What tables, aliases and primary keys are is explained in [Tables in Storage](/storage/tables/).

## Truncate Table
**Overview**

The Truncate Table feature removes all records from a table while preserving its schema (column structure and metadata). The feature deletes all rows but keeps the table structure intact. Primary keys or metadata remain without change. The feature is highly efficient especially when replacing an entire dataset.

**When to Use Truncate Table?**
- Replacing data completely (e.g., daily refresh of customer records).
- Ensuring clean data ingestion without duplication.
- Automating scheduled table resets (e.g., overwriting temporary datasets).

**How to Truncate a Table:**
1. Navigate to Storage → Tables.
2. Select the table you want to truncate.
3. Click the three dots on the right side of the screen. A drop-down menu will display.
4. Select "Truncate table". A warning information will display. 
5. Confirm clicking the "Truncate table" button.

## Delete Rows
**Overview**

The Delete Rows feature allows you to remove specific records from a table in Storage. Unlike Truncate Table, which clears all data, Delete Rows selectively removes only matching records, keeping the rest of the table intact.

When using the Delete Rows feature, you can apply multiple filters in a single execution, such as:
- Rows changed within a specific period.
- Rows containing a specific value in a given column.
Before deleting the rows, Keboola displays a preview of the records that will be removed based on your filters.

**When to Use Delete Rows?**
- Removing outdated records (e.g., inactive customers).
- Correcting erroneous data entries.
- Synchronizing data with external systems (e.g., deleting stale records).

**How to Delete Rows:**
1. Navigate to Storage → Tables.
2. Select the table where you want to delete rows.
3. Click the three dots on the right side of the screen to open a drop-down menu.
4. Select "Delete Rows". A pop-up will appear. 
5. Set up the filters to specify which rows should be deleted.
6. Click "Delete rows" to confirm.

**Next:** [Primary keys and incremental loading →](/storage/tables/incremental-loading/)
