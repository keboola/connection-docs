---
title: Schedule via the API
slug: 'flows/schedule-api'
description: "Attach one or more cron schedules to any configuration, or to a single configuration row, through the Scheduler API: create a keboola.scheduler configuration, then activate it."
redirect_from:
    - /automate/set-schedule/
---

<!-- How-to page. Merged from developers.keboola.com /automate/set-schedule/ (PRDCT-582). Configuration keys and the activate call verified against scheduler.keboola.com/docs/swagger.yaml; the permission rule against keboola/permission-checker src/Check/Scheduler/CanModifySchedules.php (2026-09-09 review). The UI way is /flows/#schedule-and-automate. -->

The UI lets you [schedule a flow](/flows/#schedule-and-automate). The API lets you schedule any
[configuration](/components/), including a single configuration row, and attach several schedules
to one configuration. A schedule is a configuration of the `keboola.scheduler` component that you
create in Storage and then activate through the Scheduler API.

## Before you start

- A [Storage API token](/management/project/tokens/). The activation call in step 3 needs a token
  with the admin or share role in the project: the master token of a project admin qualifies, a token
  you created by hand does not. In projects with a protected default branch it has to be a production
  manager working on the default branch. Activation creates a further Storage token that the schedule
  runs under.
- The hosts of your [stack](/overview/#apis-and-service-endpoints). The examples use the US AWS
  stack: `connection.keboola.com` for Storage and `scheduler.keboola.com` for the Scheduler. On EU
  Frankfurt AWS they are `connection.eu-central-1.keboola.com` and `scheduler.eu-central-1.keboola.com`;
  the service index lists yours. A wrong host or token answers with `Invalid access token`.

## 1. Find what to run

Run the configuration once by hand and open the successful job in [Jobs](/management/jobs/). Its
detail lists the target the schedule needs:

```
mode: run
component: keboola.ex-db-snowflake
config: 493493
```

## 2. Create the schedule configuration

Create a configuration of `keboola.scheduler` with the
[Storage API](https://api.keboola.com/?service=storage) call `POST /v2/storage/branch/default/components/keboola.scheduler/configs`.
`schedule.cronTab` is a [cron expression](https://crontab.guru/#0_*_*_*_*), `schedule.timezone` a
time zone name such as `UTC` or an offset such as `+0100`, `schedule.state` either `enabled` or
`disabled`. `target` names the configuration to run and the mode.

```bash
curl --location --request POST 'https://connection.keboola.com/v2/storage/branch/default/components/keboola.scheduler/configs' \
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

The response is the new configuration. You need its `id` for the next step:

```json
{
    "id": "10850624",
    "name": "Example Schedule",
    "version": 1,
    "configuration": {
        "schedule": { "cronTab": "0 * * * *", "timezone": "UTC", "state": "enabled" },
        "target": { "componentId": "keboola.ex-db-snowflake", "configurationId": "493493", "mode": "run" }
    }
}
```

To schedule a single row of a configuration with
[configuration rows](/components/#configuration-rows), add `configurationRowIds` to the target:

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

## 3. Activate the schedule

A stored scheduler configuration does nothing until you activate it with
[POST /schedules](https://api.keboola.com/?service=scheduler#scheduler/tag/schedules/POST/schedules)
on the Scheduler service, passing the configuration ID from step 2:

```bash
curl --location --request POST 'https://scheduler.keboola.com/schedules' \
--header 'X-StorageApi-Token: YOUR_TOKEN' \
--header 'Content-Type: application/json' \
--data-raw '{
    "configurationId": "10850624"
}'
```

A `200` response returns the activated schedule: its `id`, the `tokenId` of the Storage token it
runs under, and `schedule.nextRunAt` with the next firing time. Any other status returns an error
object with `error` and `code`.

## Several schedules on one configuration

Repeat steps 2 and 3 with another scheduler configuration. Activating both examples above runs
configuration `493493` at the start of every hour and its row `48094` every ten minutes on top of
that. [GET /schedules](https://api.keboola.com/?service=scheduler#scheduler/tag/schedules/GET/schedules)
lists what is active; each item shows its `schedule`, its `target` and the `configurationId` it
was activated from.
