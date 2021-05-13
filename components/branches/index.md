---
title: Development Branches
permalink: /components/branches/
---

* TOC
{:toc}

Development Branches allow you to modify [component configurations](/components/) without interfering with running 
configurations or entire [orchestrated pipelines](/orchestrator/). They are ideal to use when making bigger changes 
to a project or when you need to be extra careful about performing your changes safely. 

To give an example, let's say that you have an ordinary orchestration that extracts, transforms and writes data 
to a target system, and you need to remove a column from the source. To do that, you must modify several configurations, 
and ideally, also perform a dry run to check that the data in the target system is correct. However, modifying a pipeline 
that runs, e.g., every ten minutes, is difficult without an outage of the pipeline. Development Branches are designed 
to help in such situations.

## How Branches Work
When you create a development branch in your project, you obtain an exact copy of the project and all its current 
configurations. You can then modify these configurations without ever touching the original ones in production, 
and these will keep running in orchestrations. 

When you run a configuration in a branch, it is able to **read** the [tables](/storage/tables/) and [files](/storage/files/) 
from the Storage as if it were a normal configuration. However, when your branch configuration attempts to **write** data
(tables or files) to Storage, it is stored separately and does not overwrite the original production data and interfere
with the running configurations. There is no need to duplicate your project's data when creating a new branch. 

## Configurations Chains
To be able to run chains of configurations in a branch, e.g., an extractor followed by a transformation, the following rules
apply: 

If you run a branch configuration and branch data is available, it is used. Only if the branch data is not present, 
the production data is used. Therefore, when you run a branch transformation, it will read the production data and write 
branch output data. When you run an extractor on which the transformation depends in the branch, it too will create branch 
output data. When you run the transformation again, it will use the output of the branch extractor and write branch output 
data.

## Closing a Branch
You can end your branch's lifecycle in two ways:

- **Deletion** -- if you do not wish to use the changes you've made and want to simply discard them. The data associated with the branch is discarded when the branch is deleted.
- **Merging into production** -- all changes in the configurations are brought back to the respective production configurations. All the changes are applied at once (after you approve them) and produce new [versions](/components/#configuration-versions) of the respective configurations. The branch can be either deleted or kept for further reference after merging. 

**Important:** All this happens in a same project, allowing you to collaborate on the modifications with other members 
of the project.

## Private Beta Warning
This feature is currently in private beta. It may not always work as expected. Please bear with us as we continue to fix any 
bugs. Any feedback is welcome at [https://ideas.keboola.com](https://ideas.keboola.com).

To enable the feature, please ask via the [support button](/management/support/) in your project.

## Tutorial
To see how you can take advantage of branches, please follow the [tutorial](/tutorial/branches/).
