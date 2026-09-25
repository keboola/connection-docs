---
title: 'Development Branches'
slug: 'getting-started/branches'
description: "Change a running project safely: work in a development branch, see the project diff, and merge your changes back into production."
redirect_from:
  - /tutorial/branches/
---



The feature Development Branches allows you to modify [component configurations](/components/) 
without interfering with the running configurations or entire [automated pipelines](/flows/).

## Tutorial
First, learn how development branches [work in general](/components/branches/).

In this tutorial, we will guide you through the process of creating and using a development branch. You will configure 
various components that demonstrate the different aspects of branches.

* Part 1, preparing production configurations:
  * [Preparing table manipulating configurations](/getting-started/branches/prepare-tables/)
  * [Preparing file manipulating configurations](/getting-started/branches/prepare-files/)
* Part 2, working in a branch: 
  * [Working with tables in a branch](/getting-started/branches/tables-in-branch)
  * [Working with files in a branch](/getting-started/branches/files-in-branch)
* Part 3, merging branches:
  * [Project diff](/getting-started/branches/project-diff/)
  * [Merge to production](/getting-started/branches/merge-to-production/)

## From a terminal

[kbagent](/cli/) drives a branch from the shell, with one gap in the middle. The examples name
the project by the alias `kbagent project add` stored for it, `docs-demo` here. Substitute yours:

```bash
kbagent branch create --project docs-demo --name "Try the new transformation"
```

Creating a branch also activates it, so the commands that follow act inside it rather than in
production. `kbagent branch list` shows what exists, `kbagent branch use --branch <branch-id>`
switches to another one, and `kbagent branch reset` puts you back in production. Read-only
commands are the exception: they report production unless you pass `--branch` explicitly, which
keeps `storage tables` from quietly answering about a branch you forgot you were in.

The merge is the gap. `kbagent branch merge` hands you the URL of the merge screen rather than
merging anything, because the diff and the partial-merge choices on the pages below are where the
decision is made. `kbagent branch delete --branch <branch-id>` removes a branch afterwards.

:::caution[Public Beta]
This feature is currently in public beta. Please provide feedback using the feedback button in your project.
:::
