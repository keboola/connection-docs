---
title: Development branches
permalink: /tutorial/branches/
---

* TOC
{:toc}
  
The Development branches feature allows you to modify [component configurations](/components/) 
without interfering with the running configurations or entire [orchestrated pipelines](/orchestrator/).

{% include branches-beta-warning.html %}

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

There are two ways how to end the Branch lifecycle. If you do not wish to use the changes, the branch can be simply deleted.
Or it can be **Merged**. Merging the branch means that changes in the configurations are applied 
to the respective production configurations. The applied changes produce new 
[versions](/components/#configuration-versions) of the respective configurations in production. The branch can be either deleted or kept for further reference after merging. The data associated with the branch are discarded when the branch is deleted.

It is important to note that all of this happens in a same project. Allowing you to collaborate on the modifications 
with other members of the project.

## Tutorial
To see how you can take advantage of branches, you can go through the following tutorial. You will configure various components that demonstrate the different aspects of branches.

* Part 1 -- Preparing the production configurations
  * [Preparing table manipulating configurations](/tutorial/branches/prepare-tables/)
  * [Preparing file manipulating configurations](/tutorial/branches/prepare-files/)
* Part 2 -- Working in a branch 
  * [Working with tables in branch](/tutorial/branches/tables-in-branch)
  * [Working with files in branch](/tutorial/branches/files-in-branch)
* Part 3 -- Merging branches
  * [Project diff](/tutorial/branches/project-diff/)
  * [Merge to production](/tutorial/branches/merge-to-production/)
