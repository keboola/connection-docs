---
title: Run a Job
slug: 'automate/run-job'
---

A [job](/management/jobs/) represents a work being done in Keboola. 
You can create (run) a job from the UI or via scheduled [Orchestrations](/orchestrator/) or Flows. 
A job can also be created manually via the API. The easiest way to get started is to create
a [configuration](/components/) of the component you want to run and run it manually in the UI. 
Once you're satisfied with the result, look at the successful job:

![Screenshot -- Job Parameters](/automate/job-parameters.png)

In the job detail, you can see the parameters required to run the configuration, in this case:

```
mode: run
component: keboola.ex-db-snowflake
config: 493493
```

Then create a [Storage API token](/management/project/tokens/) which you will use to 
run the API requests (if you don't have one already). We recommend to create
as restricted token as possible -- in this case limit it to to the component with ID `keboola.ex-db-snowflake`:

![Screenshot -- Token Settings](/automate/token-settings.png)

Then use the [Create Job API call](https://api.keboola.com/?service=job-queue#job-queue/tag/jobs/POST/jobs) to 
create a job with the same parameters 
(see [example](https://documenter.getpostman.com/view/3086797/77h845D#fd60aa15-485c-4922-8536-c2ba2f27e8ea)):

```bash
curl --location --request POST 'https://queue.keboola.com/jobs' \
--header 'X-StorageApi-Token: YOUR_TOKEN' \
--header 'Content-Type: application/json' \
--data-raw '{
    "mode": "run",
    "component": "keboola.ex-db-snowflake",
    "config": "493493"
}'
```

Take care to use the right endpoint depending on which [Stack](/overview/#stacks) are you using. 
You'll see `Invalid access token` error message if you are using the wrong endpoint or token. Read more about 
the concept of [Jobs](/integrate/jobs/).
