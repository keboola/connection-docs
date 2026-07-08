---
title: dbt Cloud
slug: 'transformations/dbt/cloud'
description: Use dbt Cloud from Keboola — trigger dbt Cloud jobs and extract dbt Cloud API data with the dedicated components, and find the resulting tables and artifacts in Storage.
keywords:
  - dbt Cloud
  - dbt Cloud job trigger
  - dbt Cloud API extractor
  - dbt Cloud Keboola
  - dbt Cloud artifacts
type: how-to
---

dbt Cloud is supported via dedicated components. You can find them in the **Components** menu:

*   `kds-team.ex-dbt-cloud-api` for extracting data from dbt Cloud API

*   `kds-team.app-dbt-cloud-job-trigger` for triggering a dbt Cloud job remotely, and optionally, wait for the job results. In that case, the component stores artifacts as well.


## dbt Cloud Trigger

![The dbt Cloud Trigger configuration — Account ID 949, Job ID 121341, an API Key field, Cause "Triggered from Keboola", Wait for result checked, and Max wait time 60](imgs/2776563988.png)

The component configuration is pretty straightforward. You must authorize the component by providing your `Account ID`, `Job ID`, and `API key`.

The component generates a status table called `dbt_cloud_trigger` storing the job trigger API response.

<!-- TODO(human-review: dbt_cloud_trigger status-table columns) The dropped
     screenshot showed this generated table; its column schema can't be
     reconstructed from the page. Document the columns here. -->


When **Wait for result** is selected, the component polls the status until the job ends. The component has a default wait time limit that can be optionally set to a different time. When the option **Wait for result** is used, the component extracts artifacts, stores them in the file storage, and additionally, produces a job result API call table. Both tables can be found in Storage, or accessed directly from the job result.

Artifacts can be found in Storage → **Files**, searched by tag (component type or configuration ID):

`tags:"componentId-kds-team.app-dbt-cloud-job-trigger"`

**Tip:**: Those files can be also easily [retrieved externally via the API](https://api.keboola.com/?service=storage#get-/v2/storage/branch/-branchId-/files) or from an integrated Jupyter workspace for further analysis.

*Note: Please keep in mind that the base URL of the API call depends on the stack you are using: US vs. Azure EU vs. EU central.*

## dbt Cloud API Source Component

The purpose of this data source connector is to extract and store the [dbt Cloud API](https://docs.getdbt.com/dbt-cloud/api-v2) information (data is stored incrementally) for the following endpoints:

*   accounts

*   projects

*   jobs

*   runs

*   run\_artifacts


To configure the source connector, enter the API token and select a default configuration:

![The dbt Cloud API data source connector — the dbt Cloud project URL, a Token field, and the Configuration Template set to dbt Cloud API](imgs/2777448752.png)

You can access the data from Storage, or directly from the job detail screen.

***Note:** The data source connector utilizes our powerful Generic Extractor. In case you want to customize the extraction, select just some endpoints, etc. You can switch to the JSON schema and edit the configuration manually.*
