---
title: 'Branches Tutorial'
slug: 'components/branches/tutorial'
description: "Change a running project safely: work in a development branch, see the project diff, and merge your changes back into production."
redirect_from:
  - /tutorial/branches/
  - /getting-started/branches/
---


Development branches let you modify [component configurations](/components/) without interfering
with the running configurations or entire [automated pipelines](/flows/). This tutorial walks the
whole cycle end to end — you build production configurations, change them inside a branch, review
the diff, and merge back.

[Development Branches](/components/branches/) explains how they work first; come back here to try
it. Projects with **Branches 2.0** enabled merge through a
[merge request](/components/branches/merge-requests/) instead of the direct merge shown in part 3.

* Part 1 -- Preparing production configurations:
  * [Preparing table manipulating configurations](/components/branches/tutorial/prepare-tables/)
  * [Preparing file manipulating configurations](/components/branches/tutorial/prepare-files/)
* Part 2 -- Working in a branch: 
  * [Working with tables in a branch](/components/branches/tutorial/tables-in-branch)
  * [Working with files in a branch](/components/branches/tutorial/files-in-branch)
* Part 3 -- Merging branches:
  * [Project diff](/components/branches/tutorial/project-diff/)
  * [Merge to production](/components/branches/tutorial/merge-to-production/)

:::caution[Public Beta]
This feature is currently in public beta. Please provide feedback using the feedback button in your project.
:::
