---
title: Orchestration Trigger Queue V2
permalink: /components/applications/triggers/orchestration-trigger-queue-v2/
---

* TOC
{:toc}

Trigger to start a Keboola Orchestration V2 across different Keboola projects.

## Authorization

Authorization is done with a [Keboola Storage API token](https://help.keboola.com/management/project/tokens).
Generate a dedicated API token with either:

* Full access to all buckets and components.
* Limited access to the Flow component and every single component in the flow and the buckets those components interact with

If the second option is chosen, you must create a new token with further permissions everytime you add a new component or use a new bucket in the flow.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Orchestration Trigger Queue V2** Application.

{: .image-popup}
![Screenshot - Incremental fetching](/components/applications/triggers/orchestration-trigger-queue-v2/config.png)

* Fill in the Keboola Storage API token. 
* Fill in the Keboola stack based on your stack, you can find this out from the link to your keboola project
* Fill in the Orchestration ID 
* Check or uncheck the checkbox for "Wait for job finish and check jobs status". 
  If checked, the job of the trigger will only finish when 
  the Orchestration is finished. If unchecked, the job of the trigger will be finished as soon as the orchestration is started.
  
## Note on Orchestration V2

If the link to your of your orchestration contains **orchestrations-v2** : 

...keboola.com/admin/projects/{ProjectID}/orchestrations-v2/{OrchID}

Your orchestration is V2. If the link to your of your orchestration contains **orchestrations**, your orchestration is **NOT** V2, and you should use the [keboola.app-orchestrator-trigger application](https://github.com/keboola/app-orchestrator-trigger)
