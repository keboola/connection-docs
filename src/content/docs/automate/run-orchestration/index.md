---
title: Run Orchestration
slug: 'automate/run-orchestration'
---

Running an [Orchestration](/orchestrator/) or Flow is in principle same as running 
a [job](/automate/run-job/). 
You can create (run) an orchestration job from the UI. A job can also be created manually via the API. 
The easiest way to get started is to create a configuration of orchestration or flow and run it manually in the UI. 
Once you're satisfied with the result, look at the successful job:

![Screenshot -- Orchestration Parameters](/automate/orchestration-parameters.png)

In the job detail, you can see the parameters required to run the configuration, in this case:

```
mode: run
component: keboola.orchestrator
config: 1496488
```

The difference between running an arbitrary [component job](/automate/run-job/) and an orchestrator job is only in
that the `component` value is always `keboola.orchestrator`. The same component is used for both Orchestrator 
and Flow jobs.

Create a [Storage API token](/management/project/tokens/) which you will use to 
run the API requests (if you don't have one already). We recommend to create a token with **Full Access** to
components. Though you can list the components used in the orchestration, this leads to a fragile setup when
modifying the orchestration may need the modification of the the token too.

Then use the [Create Job API call](https://api.keboola.com/?service=job-queue#job-queue/tag/jobs/POST/jobs) to 
create a job with the same parameters 
(see [example](https://documenter.getpostman.com/view/3086797/77h845D#3e71b131-afd4-44be-9831-6534e581f2e0)):

```bash
curl --location --request POST 'https://queue.keboola.com/jobs' \
--header 'X-StorageApi-Token: YOUR_TOKEN' \
--header 'Content-Type: application/json' \
--data-raw '{
    "mode": "run",
    "component": "keboola.orchestrator",
    "config": "1496488"
}'
```

Take care to use the right endpoint depending on which [Stack](/overview/#stacks) are you using. 
You'll see `Invalid access token` error message if you are using the wrong endpoint or token. Read more about 
the concept of [Jobs](/integrate/jobs/).
