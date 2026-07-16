---
title: Set Schedule
slug: 'automate/set-schedule'
---

In the UI, you can set a time schedule for [orchestration](/orchestrator/running/#automation).
Via the API you can set a time schedule for any [configuration](/components/) or even multiple 
schedules for a single configuration.

Assuming, you have already setup of any [configuration](/components/)
(including Orchestrator and Flow) and you can successfully run it through the UI or through the 
[API](/automate/run-job/). Look at the successful job:

![Screenshot -- Job Parameters](/automate/job-parameters.png)

In the job detail, you can see the parameters required to run the configuration, in this case:

```
mode: run
component: keboola.ex-db-snowflake
config: 493493
```

To create a schedule, you have to create the schedule configuration first using the 
[Create Configuration API call](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/components/-componentId-/configs).
With the contents similar to this:

```json
{
    "schedule": {
        "cronTab": "0 * * * *",
        "timezone": "UTC",
        "state": "enabled"
    },
    "target": {
        "componentId": "keboola.ex-db-snowflake",
        "configurationId": "493493",
        "mode": "run"
    }
}
```

The `cronTab` field defines the schedule in [cronTab expression](https://crontab.guru/#0_*_*_*_*) format. The 
`target` defines which configuration should be run. In the above example we use the same configuration from the
job. To create the configuration itself, use the `keboola.scheduler` component 
(see an [example](https://documenter.getpostman.com/view/3086797/77h845D#b721ecd8-159c-4895-9d0b-8b735880b714)):

```bash
curl --location --request POST 'https://connection.keboola.com/v2/storage/components/keboola.scheduler/configs/' \
--header 'X-StorageApi-Token: YOUR_TOKEN' \
--form 'name="Example Schedule"' \
--form 'configuration="{
    \"schedule\": {
        \"cronTab\": \"0 * * * *\",
        \"timezone\": \"UTC\",
        \"state\": \"enabled\"
    },
    \"target\": {
        \"componentId\": \"keboola.ex-db-snowflake\",
        \"configurationId\": \"493493\",
        \"mode\": \"run\"
    }
}"'
```

Take care to use the right endpoint depending on which [Stack](/overview/) are you using. 
You'll see `Invalid access token` error message if you are using the wrong endpoint or token.
An example request response will contain:

```json
{
    "id": "10850624",
    "name": "Example Schedule",
    "description": "",
    "created": "2022-01-31T00:00:59+0100",
    "creatorToken": {
        "id": 25144,
        "description": "Run Job"
    },
    "version": 1,
    "changeDescription": "Configuration created",
    "isDisabled": false,
    "isDeleted": false,
    "configuration": {
        "schedule": {
            "cronTab": "0 * * * *",
            "timezone": "UTC",
            "state": "enabled"
        },
        "target": {
            "componentId": "keboola.ex-db-snowflake",
            "configurationId": "493493",
            "mode": "run"
        }
    },
    "state": {},
    "currentVersion": {
        "created": "2022-01-31T00:00:59+0100",
        "creatorToken": {
            "id": 25144,
            "description": "Run Job"
        },
        "changeDescription": "Configuration created"
    }
}
```

The important field is `id` (with value `10850624` in the above example). In the second step, you need to activate 
the schedule via the [Activate Schedule API call](https://api.keboola.com/?service=scheduler#scheduler/tag/schedules/POST/schedules)
with he following body:

```json
{
    "configurationId": "10850624"
}
```

See an [example](https://documenter.getpostman.com/view/3086797/77h845D#130cbfc4-4dd5-4f6d-99c0-2444c48ee551)):

```bash
curl --location --request POST 'https://scheduler.azure.keboola.com/schedules' \
--header 'X-StorageApi-Token: YOUR_TOKEN' \
--header 'Content-Type: application/json' \
--data-raw '{
    "configurationId": "10850624"
}
'
```

Note: You have to use a [Master Token](/management/project/tokens/#master-tokens) to execute the above API call.

## Configure Schedule for Row
If the configuration you're scheduling uses [Configuration rows](/components/#configuration-rows), you can
also schedule individual rows. Assuming you have a job running a single row:

![Screenshot -- Row Parameters](/automate/job-row-parameters.png)

You will see the the following in job parameters:

```
mode: run
component: keboola.ex-db-snowflake
config: 493493
row: 48094
```

Create a new scheduler configuration with the following configuration contents:

```json
{
    "schedule": {
        "cronTab": "10,20,30,40,50 * * * *",
        "timezone": "UTC",
        "state": "enabled"
    },
    "target": {
        "componentId": "keboola.ex-db-snowflake",
        "configurationId": "493493",
        "configurationRowIds": ["48094"],
        "mode": "run"
    }
}
```

See [example](https://documenter.getpostman.com/view/3086797/77h845D#0fadefb7-9352-45b0-8c4e-6f3742feea2a):

```bash
curl --location --request POST 'https://connection.keboola.com/v2/storage/components/keboola.scheduler/configs/' \
--header 'X-StorageApi-Token: YOUR_TOKEN' \
--form 'name="Example Row Schedule"' \
--form 'configuration="{
    \"schedule\": {
        \"cronTab\": \"10,20,30,40,50 * * * *\",
        \"timezone\": \"UTC\",
        \"state\": \"enabled\"
    },
    \"target\": {
        \"componentId\": \"keboola.ex-db-snowflake\",
        \"configurationId\": \"493493\",
        \"configurationRowIds\": [\"48094\"],
        \"mode\": \"run\"
    }
}"'
```

You'll obtain the following example:

```json
{
    "id": "10852379",
    "name": "Example Row Schedule",
    "description": "",
    "created": "2022-01-31T00:42:15+0100",
    "creatorToken": {
        "id": 322,
        "description": "ondrej.popelka@keboola.com"
    },
    "version": 1,
    "changeDescription": "Configuration created",
    "isDisabled": false,
    "isDeleted": false,
    "configuration": {
        "schedule": {
            "cronTab": "10,20,30,40,50 * * * *",
            "timezone": "UTC",
            "state": "enabled"
        },
        "target": {
            "componentId": "keboola.ex-db-snowflake",
            "configurationId": "493493",
            "configurationRowIds": [
                "48094"
            ],
            "mode": "run"
        }
    },
    "state": {},
    "currentVersion": {
        "created": "2022-01-31T00:42:15+0100",
        "creatorToken": {
            "id": 322,
            "description": "ondrej.popelka@keboola.com"
        },
        "changeDescription": "Configuration created"
    }
}
```

The created configuration has id `10852379`. You can now [Activate the Schedule](https://api.keboola.com/?service=scheduler#scheduler/tag/schedules/POST/schedules)
with he following body:

```json
{
    "configurationId": "10852379"
}
```

See an [example](https://documenter.getpostman.com/view/3086797/77h845D#130cbfc4-4dd5-4f6d-99c0-2444c48ee551)):

```bash
curl --location --request POST 'https://scheduler.keboola.com/schedules' \
--header 'X-StorageApi-Token: YOUR_TOKEN' \
--header 'Content-Type: application/json' \
--data-raw '{
    "configurationId": "10852379"
}
'
```

This also demonstrates that you can set multiple schedules for a single configuration. In this case, the configuration 
`10852379` of the `keboola.ex-db-snowflake` will be executed at the beginning of every hour. Then the row `48094` of 
this configuration will also be executed every 10 minutes. To list the schedules use the 
[Get Schedules API call](https://api.keboola.com/?service=scheduler#scheduler/tag/schedules/GET/schedules) --
(see [example](https://documenter.getpostman.com/view/3086797/77h845D#6e0f31b1-9d50-4b51-9570-5334936d569c)). You'll get
a response similar to this:

```json
[
    {
        "id": "743",
        "tokenId": "25147",
        "configurationId": "10850624",
        "configurationVersionId": "1",
        "schedule": {
            "cronTab": "0 * * * *",
            "timezone": "UTC",
            "state": "enabled"
        },
        "target": {
            "componentId": "keboola.ex-db-snowflake",
            "configurationId": "493493",
            "configurationRowIds": [],
            "mode": "run",
            "tag": ""
        },
        "executions": []
    },
    {
        "id": "744",
        "tokenId": "25148",
        "configurationId": "10852379",
        "configurationVersionId": "1",
        "schedule": {
            "cronTab": "10,20,30,40,50 * * * *",
            "timezone": "UTC",
            "state": "enabled"
        },
        "target": {
            "componentId": "keboola.ex-db-snowflake",
            "configurationId": "493493",
            "configurationRowIds": [
                "48094"
            ],
            "mode": "run",
            "tag": ""
        },
        "executions": []
    }
]
```
