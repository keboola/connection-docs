---
title: Schedule a configuration via the API
slug: 'flows/schedule-api'
description: "Attach one or more cron schedules to any configuration, or to a single configuration row, through the Scheduler API: create a keboola.scheduler configuration, then activate it."
redirect_from:
    - /automate/set-schedule/
---

<!-- How-to page. Merged from developers.keboola.com /automate/set-schedule/ (PRDCT-582). Configuration keys and the activate call verified against scheduler.keboola.com/docs/swagger.yaml and the scheduler's SchedulerConfigurationValidator (2026-06-22 audit), re-checked 2026-09-09. The UI way is /flows/#schedule-and-automate. -->

The UI lets you [schedule a flow](/flows/#schedule-and-automate). The API lets you schedule any
[configuration](/components/), including a single configuration row, and attach several schedules
to one configuration. A schedule is a configuration of the `keboola.scheduler` component that you
create in Storage and then activate through the Scheduler API.

## 1. Find what to run

Run the configuration once by hand and open the successful job. Its detail lists the target the
schedule needs:

![Job detail with mode, component and config parameters](/flows/schedule-api/job-parameters.png)

```
mode: run
component: keboola.ex-db-snowflake
config: 493493
```

## 2. Create the schedule configuration

Create a configuration of `keboola.scheduler` with
[POST /v2/storage/components/keboola.scheduler/configs](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/components/-componentId-/configs).
`schedule.cronTab` is a [cron expression](https://crontab.guru/#0_*_*_*_*), `schedule.timezone` a
time zone name, `schedule.state` either `enabled` or `disabled`. `target` names the configuration to
run and the mode.

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

Use the connection endpoint of your [stack](/overview/#apis-and-service-endpoints); a wrong endpoint
or token answers with `Invalid access token`. The response is the new configuration; you need its
`id` (`10850624` in this example) for the next step.

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

The Scheduler runs at `scheduler.<your stack's domain>`, for example
`https://scheduler.eu-central-1.keboola.com` on EU Frankfurt AWS. The
[service index](/overview/#apis-and-service-endpoints) of your stack lists the exact URL.

<!-- VERIFY(owner): the source page said this call needs a Master Token. The scheduler code checks a CanModifySchedules permission (2026-06-22 audit, PRDCT-369); whether that equals master-token-only is unconfirmed, so the claim is not repeated here. -->

## Several schedules on one configuration

Repeat steps 2 and 3 with another scheduler configuration. Activating both examples above runs
configuration `493493` at the start of every hour and its row `48094` every ten minutes on top of
that. [GET /schedules](https://api.keboola.com/?service=scheduler#scheduler/tag/schedules/GET/schedules)
lists what is active; each item shows its `schedule`, its `target` and the `configurationId` it
was activated from.
