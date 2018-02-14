---
title: Jobs
permalink: /management/jobs/
---

* TOC
{:toc}

Most of the things done in KBC run as background, asynchronous jobs.
For an overview of all jobs, running and finished, go to the **Jobs** section:

{: .image-popup}
![Screenshot - Jobs](/management/jobs/jobs.png)

The job history is virtually unlimited. Click on a job to see details on 

- what tables were imported (created by the job and imported into your Storage).
- what tables were exported (read from your Storage by the job).
- how many [credits](/management/project/limits/#project-power) were used by running the job.
- what events occurred during the job execution.
- what exact parameters were used for the job (this might be useful when working with the [API](https://developers.keboola.com/integrate/jobs/#apis-for-working-with-jobs)).

{: .image-popup}
![Screenshot - Jobs Detail](/management/jobs/jobs-detail.png)

For more technical information about background jobs, see our 
[Developers documentation](https://developers.keboola.com/integrate/jobs/).

## Running Jobs
Jobs are either run [manually from any configuration](/tutorial/) or automatically by the 
[Orchestrator](/orchestrator/) at a scheduled time. In either case, the typical life time of a job has the 
following states:

**waiting** --> **processing** --> **success**/**error**

When a job is not finished (is waiting or processing), it can be terminated:

{: .image-popup}
![Screenshot - Terminate Job](/management/jobs/terminate-job.png)

Note that a job is not terminated immediately when you click the **Terminate** button. It usually takes a few
seconds before it is terminated.

In some cases, a job can have child jobs. They are identified by having their `RunId` delimited with
a dot --- e.g., `347371952.3473719650`. This means that the job `3473719650` run is in fact a child
job to `347371952`. Terminating the parent job will automatically terminate the child job too. 
Terminating the child job will probably cause the parent to terminate or fail.

## Waiting Jobs
A job is always put in the waiting state when it is run. A job may be in the waiting state for two 
reasons. Either it is waiting for our infrastructure to start executing it, or it is waiting on
project parallelism limits. In the former case, the job is waiting until a 
[worker](https://developers.keboola.com/integrate/jobs/) starts executing it.
This usually takes several seconds, at most a couple of minutes. 

When a job is waiting on a project parallelism limit, it boils down to two situations. Either the 
same configuration of the same component is already being executed, or the overall limit
of concurrently running jobs within a project was exceeded. That means that a job will be in 
the waiting state under the following conditions:

- If the total number of running jobs in the project is greater or equal to **10**.
- If there is already a running job of the **same configuration**.
    - Unless it is a transformation job, in which case the same configuration is allowed to run, provided that it is executed by different [tokens](/management/project/tokens/).

## Storage Jobs
Not only we record all jobs which were executed in your KBC project, we also record all data which were uploaded
into your project. Go to **Storage** and click the **Jobs** tab:

{: .image-popup}
![Screenshot - Storage Jobs](/management/jobs/storage-jobs.png)

When you click an **importTable** job, you'll see a Storage job detail:

{: .image-popup}
![Screenshot - Storage Job Detail](/management/jobs/storage-jobs-detail.png)

Clicking **File ID** will take you to the **File Uploads** tab in **Storage**,
where all data pushed into your KBC project are stored.
You can download the data and import it into other tables, or you can revert to an older table version.

{: .image-popup}
![Screenshot - File uploads](/management/jobs/storage-file-uploads.png)
