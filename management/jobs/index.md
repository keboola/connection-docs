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

### Searching the jobs log

Using the search box and advanced patterns you can easily find job based on various parameters. 

#### Search attributes

* **Job status**  
`status:success`
* **User who created the job**  
`token.description:john.doe@company.com`
* **Component name**  
`params.component:keboola.ex-http`
* **Config ID**  
`params.config:351711187`
* **Duration**  
`durationSeconds:>120`
* **Time started**  
`startTime:[2018-06-21 TO 2018-07-01]`
* **Time finished**  
`endTime:[2018-06-21 TO 2018-07-01]`
* **Component type**  
`component:transformation`  
Possible values are `docker` (Keboola component), `transformation`, `orchestrator`

#### Modifiers 

* **Exclude some results:**  
`-status:success`  
Note the _minus sign_ before the query
* **Open ended time query**  
`endTime:[2018-06-21 TO *]`
Will show jobs after 21st June 2018.

#### Combining queries
  
* **Combine queries**  
`+params.component:keboola.ex-http +status:error`  
This will show only failed jobs from ex-http
* **Combine queries with more possible values**  
`+params.component:(keboola.ex-http OR keboola.wr-google-sheets)`  
This will show jobs from either HTTP or Google Sheets writer. 
* **Query combination with modifiers**  
`+params.component:(keboola.ex-http OR keboola.wr-google-sheets) AND -status:success`  
This will show all non-successful jobs from either HTTP or Google Sheets writer.

#### Specific attributes for different component types

##### Orchestrator

* **Name**  
`params.orchestration.name:MyOrchestrator`   
* **Who started it**  
`params.initiator.userAgent:"orchestrator Scheduler"`  
This will show only orchestrations run by scheduler, not those manually launched from UI or via API. 
* **Complex query**  
`-params.initiator.userAgent:"orchestrator Scheduler" component:orchestrator -status:success`  
All orchestrator jobs, that failed after they were launched manually

For more technical information about background jobs, see our 
[Developers documentation](https://developers.keboola.com/integrate/jobs/).

## Running Jobs
Jobs are either run [manually from any configuration](/tutorial/) or automatically by the 
[Orchestrator](/orchestrator/) at a scheduled time. In either case, the typical life time of a job has the 
following states:

**waiting** --> **processing** --> **success**/**error**

Until a job is finished (i.e., it is waiting or processing), it can be terminated:

{: .image-popup}
![Screenshot - Terminate Job](/management/jobs/terminate-job.png)

*Note that a job is not terminated immediately upon clicking the **Terminate** button. Its termination usually takes 
a few seconds.*

In some cases, a job can have **child jobs**. They are identified by having their `RunId` delimited with
a dot --- e.g., `347371952.3473719650`. In this case, the job `3473719650` run is in fact a child
job to `347371952`. Terminating the parent job will automatically terminate the child job too. 
Terminating the child job will probably cause the parent to terminate or fail.

## Waiting Jobs
When a job is run, it is always put in the waiting state to wait for our **infrastructure** --- 
[worker](https://developers.keboola.com/integrate/jobs/) to start executing it.
This usually takes anywhere from several seconds to a couple of minutes at most. 

There is one more reason for a job to be in the waiting state: **project parallelism limits**. 
Either the same configuration of the same component is already being executed, or the overall limit
of concurrently running jobs within a project was exceeded. That means that a job will be in 
the waiting state under the following conditions:

- If the total number of running jobs in the project is greater or equal to **10**.
- If there is already a running job of the **same configuration**.
    - Unless it is a transformation job, in which case the same configuration is allowed to run, provided that it is executed by different [tokens](/management/project/tokens/).

## Storage Jobs
Not only we record all jobs executed in your KBC project, we also record all data that was uploaded
into it. Go to **Storage** and click the **Jobs** tab:

{: .image-popup}
![Screenshot - Storage Jobs](/management/jobs/storage-jobs.png)

When you click an **importTable** job, you'll see a Storage job detail:

{: .image-popup}
![Screenshot - Storage Job Detail](/management/jobs/storage-jobs-detail.png)

Clicking **File ID** will take you to the **File Uploads** tab in **Storage**,
where all data pushed into your KBC project is stored.
You can download the data and import it into other tables, or you can revert to an older table version.

{: .image-popup}
![Screenshot - File uploads](/management/jobs/storage-file-uploads.png)
