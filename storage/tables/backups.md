---
title: Backups and Restorations
permalink: /storage/tables/backups/
---

* TOC
{:toc}

There are two methods available for backing up and restoring data: 

1. Time travel restore – available only for the Snowflake backend
2. Snapshots – available for all backends

{: .image-popup}
![Screenshot - Storage Backups](/storage/tables/snap-restore.png)

## Time Travel Restore
Every project with a Snowflake backend can create an exact replica of a table at any point in time up to the [limit set](/management/project/) for the project.
To create a replica, first, use the calendar to select a time point. The table will be replicated as it was at that time point.
Then, select the bucket to use for the newly created table, and give it a name.

{: .image-popup}
![Screenshot - Time Travel Restore](/storage/tables/time-travel-restore.png)

The time input is interpreted as the wall clock in your current local timezone.

There are some edge cases. When daylight saving time (DST) starts or finishes between the restore time and the current time, then the restore time is based on the current time for your timezone.

**Example:**

You live in Prague (timezone Europe/Prague). You want to restore a table from `midnight of 2023-03-23` (that is `2023-03-23 00:00 +0100` because you were not using DST on that date), and 
the current local time is `2023-03-27 00:00 +0200` (because you are now using DST). If you input the restore time as `03/23/2023 00:00`, that will be interpreted in the current timezone 
as `2023-03-23 00:00 +0200`, which is an hour earlier than you intended. To fix this, you need to take account of the change to DST and add an hour to the restore time to give `03/23/2023 01:00`. 
That will be correctly interpreted as `2023-03-23 01:00 +0200`, which is equivalent to `2023-03-23 00:00 +0100`, the time you want to restore from.

## Table Snapshots
To physically copy a table, utilize the **Create Snapshot** feature. This feature creates a copy of the table contents at the time the snapshot is created, 
which can be used immediately to produce a physical copy of the table or later, to revert the table to its previous state.

Table snapshots are useful when **experimenting** with extractors and transformations, or when **refactoring** your project. You can create a copy of your output table, conduct experiments, 
and then compare the new output table with the original to ensure your output remains consistent. They can also be used as a workaround to renaming tables because this feature is not available yet.

{: .image-popup}
![Screenshot - Create Snapshot](/storage/tables/snapshot-create.png)

New tables can be created from any snapshot.

{: .image-popup}
![Screenshot - Storage Snapshots List](/storage/tables/snapshot-restore.png)
