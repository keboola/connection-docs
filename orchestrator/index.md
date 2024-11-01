---
title: Orchestrator
permalink: /orchestrator/
---

<div class="clearfix"></div>
<div class="alert alert-warning" role="alert">
    <i class="fas fa-exclamation-circle"></i>
    <strong>Important:</strong> The Orchestrator feature is available in legacy components only. In newer components, this feature has been replaced by
<strong>Flows</strong>.
</div>

Bringing systems for data loading, manipulation and writing together is what makes
[Keboola](/overview/) so powerful and easy to use. With [source connectors](/components/extractors/), you can fetch
data from data sources into [Storage](/storage/). With [transformations](/transformations/) and
[applications](/components/applications/), you can modify the data. With [destination connectors](/components/writers/), you can
send it to destination systems.

The Orchestrator component has two important features:

- Organizing the configured components into logical **building blocks** or full **data pipelines**.
- Scheduling **automated** and **repeated** execution of those blocks or pipelines.

The former feature of the Orchestrator allows you to define **dependencies** between different configured
components. For example, it allows you to specify that a transformation must be run after an extraction
which provides the source data for it. You can also specify that two extractions may run in parallel
because they are independent of each other. This way it is possible to organize **large and complex projects** 
and ensure you always work with the latest data available.

The latter feature of the Orchestrator allows you to fully automate the entire data pipeline. That
guaranties that the destination systems (e.g. Tableau Business Analytics) always contain the latest
available data, without any user intervention. Every change to your entry data
will **automatically propagate up** to your dashboard or visualisation project.

See the corresponding part of our [tutorial](/tutorial/automate/) to quickly set up an example Orchestration.

## Single Task Orchestrations
In case you want to automate a single configuration, the quickest option is to use the **Automate** button 
at the configuration page:

{: .image-popup}
![Automate modal](/orchestrator/automate.png)

Specify the orchestration name and schedule:

{: .image-popup}
![Automate modal](/orchestrator/automate-modal.png)

If any of the predefined scheduled options do not fit your needs, select **Custom schedule** to set up an individual schedule.

{: .image-popup}
![Automate custom schedule](/orchestrator/automate-modal-custom.png)

When done, click the **Automate** button to create a new Orchestration containing the configuration as its only task.
The orchestration has no special properties, so you can further modify it as any other orchestration.
