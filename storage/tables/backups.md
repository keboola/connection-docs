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
