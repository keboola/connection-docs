---
title: Storage Jobs
permalink: /storage/jobs/
---

* TOC
{:toc}

Storage Jobs are not to be confused with [Component Jobs](/management/jobs/). Storage jobs represents a low level view of
all data loaded to and unloaded from the [Table Storage](/storage/tables). Working with the Storage Jobs is rarely necessary
for end-users. We provide this view mainly to maintain complete transparency of what is happening in your project.

{: .image-popup}
![Screenshot - Create alias](/storage/jobs/storage-jobs-1.png)

The view of Storage Jobs can be interesting in very busy projects. Or in cases where you see a component [job](/management/jobs/) 
being stuck on the message `Waiting for X Storage jobs to finish.`. There is a core limitation of Storage Tables --- only one job may 
write to a table at a time. So when you see jobs taking longer than usual or waiting for Storage Jobs to finish, you might want to 
check the Storage Jobs to help you understand what is happening. You can see how many jobs are processing if they are writing to same 
tables, and then for example adjust orchestration triggers to avoid concurrency issues.
