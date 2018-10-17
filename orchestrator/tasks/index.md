---
title: Tasks
permalink: /orchestrator/tasks/
---

* TOC
{:toc}

Before configuring the Orchestrator component, you need to already have configured the components
(extractors, transformations, writers) you wish to work with.
To configure the Orchestrator component, create a new *orchestration*:

{: .image-popup}
![Screenshot - Orchestration Create](/orchestrator/tasks/configuration-create.png)

## Add Tasks
The first step is to add orchestration **tasks** --- the configurations of components you wish to run --- by clicking on **Configure Tasks**:

{: .image-popup}
![Screenshot - Orchestration Main Page](/orchestrator/tasks/orchestration-main-1.png)

Continue with **New Task**:

{: .image-popup}
![Screenshot - Orchestration Tasks](/orchestrator/tasks/tasks-1.png)

A list of configured components is shown:

{: .image-popup}
![Screenshot - Orchestration Tasks](/orchestrator/tasks/tasks-list-1.png)

After selecting a component a list of its configurations is shown, clicking the plus button adds the configuration to the orchestration:

{: .image-popup}
![Screenshot - Orchestration Tasks Configurations](/orchestrator/tasks/tasks-list-2.png)

## Organize Tasks
Let's assume that you have the following configurations, you wish to orchestrate into a data pipeline:

- Adform extractor with the `Campaigns` configuration,
- Snowflake extractor with the `Email recipient index` configuration,
- Transformations with configurations `Campaign Performance` and `Campaign Recipient` and
- Mailchimp writer with the `New recipients` configuration.

When you randomly add the configurations as orchestration tasks, chances are that you'll end up with something similar to this:

{: .image-popup}
![Screenshot - Orchestration Tasks Added](/orchestrator/tasks/tasks-2.png)

Here comes an important rule: **Phases execute sequentially, tasks within phases execute in parallel**.
This means that the order of phases is important and maintained and that a second phase will start only when the first phase is completely finished.
On the other hand, the order of tasks within the phase is not important, they may execute in any order or in parallel. For more in-depth explanation
see the notes about [Job execution](todo).

When this rule is applied to the above task configuration, it leads to the following sequence of execution:

{: .image-popup}
![Orchestration Tasks Sequence](/orchestrator/tasks/orchestration-sequence-1.png)

That means both transformations and the Mailchimp writer will run in parallel and when they finish, the Adform extractor will be run and
when that is finished, the Snowflake extractor will run.
*Surely, this is not right.* The extractors must run before the transformations and they must run before the writer. Because this is a typical
scenario, there is a feature to do just this --- **Group tasks by component type**:

{: .image-popup}
![Screenshot - Orchestration Tasks Order](/orchestrator/tasks/tasks-3.png)

The tasks are now reordered:

{: .image-popup}
![Screenshot - Orchestration Tasks Ordered](/orchestrator/tasks/tasks-4.png)

The above will lead to the following execution sequence:

{: .image-popup}
![Orchestration Tasks Sequence Organized](/orchestrator/tasks/orchestration-sequence-2.png)

First, the two extractors are run in parallel, then both transformations are run in parallel and last the writer sends the results to the consumer
(Mailchimp service in this case). The configurations will be executed in the order in which they depend on each other.

## Handling Dependencies
What if the two transformations are also dependent? Let's say that `Campaign Recipient` depends on `Campaign Performance`, therefore it must be
executed after it. This can done by moving it to a new phase. Select the `Campaign Recipients` task, click **Actions**
and **Move selected tasks between phases**:

{: .image-popup}
![Screenshot - Move Task](/orchestrator/tasks/tasks-5.png)

Type `Second Transformation Phase` to create a new orchestration phase:

{: .image-popup}
![Screenshot - Add Phase](/orchestrator/tasks/phase-name.png)

The phase is created and it contains the `Campaign Recipients` transformation. Now move the phase so that it executed after phase
containing `Campaign Performance` and before the phase containing the `New recipients` writer

{: .image-popup}
![Screenshot - Move Phase](/orchestrator/tasks/tasks-6.png)

The result should be this:

{: .image-popup}
![Screenshot - Phase Moved](/orchestrator/tasks/tasks-7.png)

Which corresponds to the following execution sequence:

{: .image-popup}
![Orchestration Tasks Sequence Serialized](/orchestrator/tasks/orchestration-sequence-3.png)

That means that the `Campaigns` and `Email Recipient Index` configurations will execute first, when they finish
the transformation `Campaign Performance` will run and when it finishes, the transformation `Campaign Recipient`
will run. Lastly, the `New recipients` writer will be executed.

Another way of handling dependencies is using [nested orchestrations](/orchestrator/tasks/nested/).
