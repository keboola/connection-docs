---
title: Storage Jobs
slug: 'storage/jobs'
description: Storage jobs — the low-level view of data loads and unloads in Table Storage, and how to use it to diagnose jobs waiting on table writes.
---



Storage jobs are not to be confused with [component jobs](/management/jobs/). Storage jobs represent a low level view of
all data loaded to and unloaded from the [Table Storage](/storage/tables/). They are listed in the **Storage Jobs** tab of the Storage section. Working with the Storage jobs is rarely necessary
for end-users. We provide this view mainly to maintain complete transparency of what is happening in your project.

![Screenshot - Create alias](/storage/jobs/storage-jobs-1.png)

The view of Storage jobs can be useful in very busy projects, or in cases where you see a component [job](/management/jobs/) 
being stuck on the message `Waiting for X Storage jobs to finish.`. There is a core limitation of Storage Tables --- only one job may 
write to a table at a time. <!-- TODO(human-review): confirm the one-writer-per-table limitation still holds on both backends. --> So when you see jobs taking longer than usual or waiting for Storage Jobs to finish, you might want to 
check the Storage Jobs to understand what is happening. You can see how many jobs are processing if they are writing to same 
tables, and then, for example, adjust flow triggers to avoid concurrency issues.
