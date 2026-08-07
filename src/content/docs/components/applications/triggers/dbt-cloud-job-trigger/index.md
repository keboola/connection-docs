---
title: dbt Cloud Job Trigger
slug: 'components/applications/triggers/dbt-cloud-job-trigger'
---



The dbt Cloud Job Trigger is used for triggering [dbt Cloud](https://www.getdbt.com/product/what-is-dbt) jobs.

## Create New Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **dbt Cloud Job Trigger** application.
Then fill in your Account ID, Job ID and API key. You also have the option to choose a custom Cause message to identify the trigger.
It saves the response from [triggerRun](https://docs.getdbt.com/dbt-cloud/api-v2#tag/Jobs/operation/triggerRun) into the table dbt_cloud_trigger.
If you check the **Wait for result** option, the component will wait for the job to finish for the maximum time set via the **Max wait time** field after it has been triggered. Then it will store the result of [getRunById](https://docs.getdbt.com/dbt-cloud/api-v2#tag/Runs/operation/getRunById) into the table dbt_cloud_run. It will also store all available artifacts, unless you turn that off with **Don't store artifacts**.


![dbt Cloud Job Trigger - Configuration](/components/applications/triggers/dbt-cloud-job-trigger/dbt_trigger_config.png)
* Fill in **Account ID**
* Fill in **Job ID**
* Fill in **API Key**
* You can use the **Cause** field to enter the custom Cause message to be sent every time the Cloud job is triggered. It defaults to `Triggered from Keboola`.
* If you want the component to wait until the job finishes and store the results of [getRunById](https://docs.getdbt.com/dbt-cloud/api-v2#tag/Runs/operation/getRunById) along with all available artifacts into the artifacts storage, select the **Wait for result** option.
* Select the maximum time the component waits for results using the **Max wait time** field (in seconds, default `60`).
* **Don't store artifacts** — skip writing the run's artifacts to artifacts storage. Off by default, so artifacts are stored.
* **DBT Cloud URL** — the base URL of your dbt Cloud instance. Defaults to `https://cloud.getdbt.com`; change it if your account is hosted on a different region or a single-tenant instance.

## Getting a Service Account Token
You can find out how to get a service account token in the [dbt Cloud documentation](https://docs.getdbt.com/docs/dbt-cloud-apis/service-tokens).

## Notes on Artifacts Usage 
In order to be able to use Keboola artifacts, the project must have the ```artifact``` feature enabled. You can find more information about this in [Keboola's docs](https://developers.keboola.com/integrate/artifacts/).


