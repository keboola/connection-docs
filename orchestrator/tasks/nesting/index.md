---
title: Configuration
permalink: /orchestrator/tasks/nesting/
---

* TOC
{:toc}

In the [basic configuration description](/orchestrator/tasks/) we used an example orchestration
with the following tasks:

- Adform extractor with the `Campaigns` configuration,
- Snowflake extractor with the `Email recipient index` configuration,
- Transformations with configurations `Campaign Performance` and `Campaign Recipient` and
- Mailchimp writer with the `New recipients` configuration.

Without digging into details on what all those things can do, let's assume the following dependencies:

{: .image-popup}
![Task Dependencies](/orchestrator/tasks/nesting/dependencies-1.png)

Let's say you have some more similar pipelines: perhaps using the campaign performance results somewhere else
or perhaps reading the base recipient list from a different source... At the end of the they you realize, that
the transformation `Campaign Performance` is pretty much locked with the `Campaigns` configuration. It expects
its specific data tables and is not useful with any other input. On the other hand, the result of the `Campaigns`
configuration is so complicated and cryptic, that it is not used at all without the `Campaign Performance`
post processing. And let's say, that the same situation occurs with the `New recipients` and `Campaign Recipient` configurations.

To make things easier for someone organizing the project --- and make it easier to understand for newcomers --- we
can change the closely related tasks to nested orchestrations. This way we're effectively creating building blocks for
other members of the project to use.

Let's create two new orchestrations, one named `Get Campaign Performance` with tasks `Campaigns` and `Campaign Performance`:

{: .image-popup}
![Screenshot - Orchestration Get Campaign Performance](/orchestrator/tasks/nesting/tasks-1.png)

and a second orchestration names `Update Campaign Recipient list` with tasks `Campaign Recipients` and `New recipients`:

{: .image-popup}
![Screenshot - Orchestration Update Campaign Recipient list](/orchestrator/tasks/nesting/tasks-2.png)

The two orchestrations are usable as any other configured component. Therefore, you can modify the main
transformation (`Sample Transformation`) to reuse those two little transformations:

{: .image-popup}
![Screenshot - Orchestration Update Campaign Recipient list](/orchestrator/tasks/nesting/tasks-3.png)

The execution of tasks can be visualized using the following sequence diagram:

{: .image-popup}
![Screenshot - Orchestration Update Campaign Recipient list](/orchestrator/tasks/nesting/orchestration-sequence-1.png)

We showed using nested orchestrations to create building blocks from extractor-transformation and transformation-writer.
Another common example is using nested orchestrations to group together transformations which must run together or in a sequence.
This way you can split a lengthy and complex transformation into more manageable pieces and still use them a single building block.
