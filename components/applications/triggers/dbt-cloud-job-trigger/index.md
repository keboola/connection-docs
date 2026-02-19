---
title: dbt Cloud Job Trigger
permalink: /components/applications/triggers/dbt-cloud-job-trigger/
---

* TOC
{:toc}
  
The dbt Cloud Job Trigger is used for triggering [dbt Cloud](https://www.getdbt.com/product/what-is-dbt) jobs.

## Create New Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **dbt Cloud Job Trigger** application.
Then fill in your Account ID, Job ID and API key. You also have the option to choose a custom Cause message to identify the trigger.
It saves the response from [triggerRun](https://docs.getdbt.com/dbt-cloud/api-v2#tag/Jobs/operation/triggerRun) into the table dbt_cloud_trigger.
If you check the **Wait for result** option, the component will wait for the job to finish for the maximum time set via the parameter **max_wait_time** after it has been triggered. Then it will store the result of [getRunById](https://docs.getdbt.com/dbt-cloud/api-v2#tag/Runs/operation/getRunById) into the table dbt_cloud_run. It will also store all available artifacts.


{: .image-popup}
![dbt Cloud Job Trigger - Configuration](/components/applications/triggers/dbt-cloud-job-trigger/dbt_trigger_config.png)
* Fill in **Account ID**
* Fill in **Job ID**
* Fill in **API key**
* You can use the Cause field to enter the custom Cause message to be sent every time the Cloud job is triggered.
* If you want the component to wait until the job finishes and store the results of [getRunById](https://docs.getdbt.com/dbt-cloud/api-v2#tag/Runs/operation/getRunById) along with all available artifacts into the artifacts storage, select the **Wait for result** option.
* Select the maximum time the component waits for results using the **Max wait time** field.

## Getting a Service Account Token
You can find out how to get a service account token in the [dbt Cloud documentation](https://docs.getdbt.com/docs/dbt-cloud-apis/service-tokens).

## Notes on Artifacts Usage 
In order to be able to use Keboola artifacts, the project must have the ```artifact``` feature enabled. You can find more information about this in [Keboola's docs](https://developers.keboola.com/integrate/artifacts/).


