---
title: Development Branches
permalink: /components/branches/
---

* TOC
{:toc}

**The Branches feature is currently in private beta. Some features may not work as expected. Please bear
with us while we polish all necessities. Any feedback is welcome at [https://ideas.keboola.com](https://ideas.keboola.com).**

The Development Branches feature allows you to modify [component configurations](/components/) 
without interfering with the running configurations or entire [orchestrated pipelines](/orchestrator/).

Typically, you would use branches when making bigger changes to a project or when you need to perform the changes safely. Imagine 
that you have an ordinary orchestration extracting, transforming and writing the data to a target system. Then you need to remove a 
column from the source. Such a change involves modification of several configurations. Ideally you'd also like to perform a dry 
run to check that the data in the target system are correct. When you are modifying a pipeline that runs e.g. every ten minutes, 
it is difficult to do such modifications without an outage of the pipeline. The Branches feature is designed to 
help in these situations.

## How Branches work
When you create a (*development*) Branch in your project, you obtain a *shallow copy* of the project. *Shallow copy* means that
you'll get a copy of all the current configurations in the project. You can then modify these configurations without 
touching the original (*production*) ones, and these will keep running in orchestrations. 

When you run a configuration in a Branch, it is able to **read** the [tables](/storage/tables/) and [files](/storage/files/) from the Storage as if it
were a normal configuration. However, when a configuration in Branch attempts to **write** data (be it tables or files) to Storage,
they are stored separately so as they do not overwrite the original (production) data and interfere with the running 
configurations. Thanks to this there is no need to duplicate your project's the data when creating new branch, making the branch creation a rather 
quick process. 

To be able to run chains of configurations -- e.g. an extractor followed by a transformation -- one more rule is applied.
If you run a branch configuration and branch data is available, it is used. Only if the branch data is not present, the 
production data is used. Therefore, when you run a branch transformation, it will read the production data and write branch output data.
When you run an extractor on which the transformation depends in the branch, it too will create branch output data.
When you run the transformation again, it will use the output of the branch extractor and write branch output data.

There are two ways how to end the Branch lifecycle. If you do not wish to use the changes and simply discard them it can be simply deleted.
Or it can be **Merged**. Merging the branch means that all changes in the configurations are brought back 
to the respective production configurations. All the changes are applied at once (after you approve them) and produce new 
[versions](https://help.keboola.com/components/#configuration-versions) of the respective configurations. The branch can be either deleted or kept for further reference after merging. The data associated with the branch are discarded when the branch is deleted.

It is important to note that all of this happens in a same project. Allowing you to collaborate on the modifications 
with other members of the project.

## Before You Start
The Branches feature is currently available in private beta. To enable it, please ask via the [support button](/management/support/) in your project.

## Tutorial
To see how you can take advantage of branches, please follow the [tutorial](/tutorial/branches/).
