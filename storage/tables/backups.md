---
title: Backups and Restorations
permalink: /storage/tables/backups/
---

* TOC
{:toc}

There are two methods available for backing up and restoring data: 

1. Time travel restore -- available only for the Snowflake backend
2. Snapshots

{: .image-popup}
![Screenshot - Storage Backups](/storage/tables/snap-restore.png)

## Time Travel Restore
Every project with a Snowflake backend has the ability to create an exact replica of a table
at any point in time up to the [limit set](/management/project/) for the project.
To create a replica, use the calendar to select the time from which you want to replicate your table,
select which bucket to use for the newly created table, and give it a name.

{: .image-popup}
![Screenshot - Time Travel Restore](/storage/tables/time-travel-restore.png)

The time input is interpreted as wall clock in your current local timezone.

There are some edge cases. When the daylight saving time (DST) changes between the restore time and the current time the restore time is still interpreted as if in the current timezone.

**Example:**
You live in Prague (timezone Europe/Prague). You want to restore a table from `midnight of 2023-03-23` (that is `2023-03-23 00:00 +0100` - because DST was not observed at that time) and the current local time is `2023-03-27 00:00 +0200` (because the DST is observed), your input of the restore time `03/23/2023 00:00` is interpreted in current timezone as `2023-03-23 00:00 +0200` - an hour earlier than you probably intended. To fix this, you need to take account of the change and add an hour to the restore time: `03/23/2023 01:00`. That will be interpreted as `2023-03-23 01:00 +0200`, which is equivalent to `2023-03-23 00:00 +0100` - the correct time.

## Table Snapshots
If you want to physically copy a table, use the **Create snapshot** feature. A copy of the table
contents at the time of creating the snapshot will be made. It can be used immediately to make
a physical copy of the table, or later, to revert the table into its previous state.

Table snapshots are useful when **experimenting** with extractors or transformations, or
when **refactoring** your project: you can create a copy of your output table, experiment a
little, and then compare the new output table with the original one to make sure your output
remained the same. They can also be used as a workaround to renaming tables because this
feature is not available yet.

{: .image-popup}
![Screenshot - Create Snapshot](/storage/tables/snapshot-create.png)

New tables can be created from any snapshot.

{: .image-popup}
![Screenshot - Storage Snapshots List](/storage/tables/snapshot-restore.png)
