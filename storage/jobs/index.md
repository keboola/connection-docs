---
title: Storage Jobs
permalink: /storage/jobs/
---

* TOC
{:toc}

Storage jobs are not to be confused with [component jobs](/management/jobs/). Storage jobs represent a low level view of
all data loaded to and unloaded from the [Table Storage](/storage/tables). Working with the Storage jobs is rarely necessary
for end-users. We provide this view mainly to maintain complete transparency of what is happening in your project.

{: .image-popup}
![Screenshot - Create alias](/storage/jobs/storage-jobs-1.png)

The view of Storage jobs can be useful in very busy projects, or in cases where you see a component [job](/management/jobs/) 
being stuck on the message `Waiting for X Storage jobs to finish.`. There is a core limitation of Storage Tables --- only one job may 
write to a table at a time. So when you see jobs taking longer than usual or waiting for Storage Jobs to finish, you might want to 
check the Storage Jobs to understand what is happening. You can see how many jobs are processing if they are writing to same 
tables, and then, for example, adjust orchestration triggers to avoid concurrency issues.
