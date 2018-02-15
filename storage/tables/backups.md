---
title: Backups and Restorations
permalink: /storage/tables/backups/
---

* TOC
{:toc}

There are two methods available for backing up and restoring data, time travel restore
(available only for snowflake backend) and snapshots.

{: .image-popup}
![Screenshot - Storage Backups](/storage/tables/snap-restore.png)

## Time Travel Restore
Every project with a Snowflake backend has the ability to create an exact replica of a table
at any point in time up to the [limit set](/management/project/) for the project.
To create a replica, use the calendar to select the time from which to replicate your table,
select which bucket to use for the new newly created table and give it a name.

{: .image-popup}
![Screenshot - Time Travel Restore](/storage/tables/time-travel-restore.png)


## Table Snapshots
If you want to physically copy a table, use the *table snapshot* feature. A copy of the table
contents at the time of creating the snapshot will be made. It can be used immediately to make
 a physical copy of the table, or later, to revert the table into its previous state.

Table Snapshots are useful when **experimenting** with extractors or transformations, or
when **refactoring** your project: you can create a copy of your output table, experiment a
little, and then compare the new output table with the original one to make sure your output
remained the same. They can also be used as a workaround to renaming tables because this
feature is not available yet.

New tables can be created from any snapshot.

{: .image-popup}
![Screenshot - Storage Snapshots List](/storage/tables/snapshot-restore.png)
