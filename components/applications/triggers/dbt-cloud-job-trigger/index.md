---
title: dbt Cloud Job Trigger
permalink: /components/applications/triggers/dbt-cloud-job-trigger/
---

* TOC
{:toc}
  
The dbt Cloud Job Trigger is used for triggering [dbt Cloud](https://www.getdbt.com/product/what-is-dbt/) jobs.

## Create New Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **dbt Cloud Job Trigger** Application.
Then fill in your Account ID, Job ID and API key. You also have an option to chose a custom Cause message to identify the trigger.
saves response from [triggerRun](https://docs.getdbt.com/dbt-cloud/api-v2#tag/Jobs/operation/triggerRun) into table dbt_cloud_trigger.
If you check the **Wait for result** option, the component waits for the job to finish for the maximum time set via parameter **max_wait_time** after triggering it, then stores the result of [getRunById](https://docs.getdbt.com/dbt-cloud/api-v2#tag/Runs/operation/getRunById) into table dbt_cloud_run and stores all available artifacts.


{: .image-popup}
![dbt Cloud Job Trigger - Configuration](/components/applications/triggers/dbt-cloud-job-trigger/dbt_trigger_config.png)
* Fill in **Account ID**
* Fill in **Job ID**
* Fill in **API key**
* You can use the Cause field to enter custom Cause message to be sent when triggering Cloud job.
* If you want the component to wait until the job finishes and store results of [getRunById](https://docs.getdbt.com/dbt-cloud/api-v2#tag/Runs/operation/getRunById) along with all available artifacts into the artifacts storage, select the **Wait for result** option.
* Select the maximum time the component waits for results using **Max wait time** field.

## Getting a Service account token
You can find out how to get a service account token in [dbt Cloud documentation](https://docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/service-tokens).

## Notes on Artifacts usage 
In order to be able to use Keboola artifacts, the project must have an ```artifact``` feature enabled. You can find more information about this in [Keboola docs](https://developers.keboola.com/integrate/artifacts/).


