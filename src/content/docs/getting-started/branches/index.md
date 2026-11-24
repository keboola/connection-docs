---
title: 'Development branches'
lastUpdated: 2026-10-02
slug: 'getting-started/branches'
description: "Change a running project safely: work in a development branch, see the project diff, and merge your changes back into production."
redirect_from:
  - /tutorial/branches/
---



Development branches let you modify [component configurations](/components/) without
interfering with the running configurations or entire [automated pipelines](/flows/).

## Tutorial
First, learn how development branches [work in general](/components/branches/).

In this tutorial, we will guide you through the process of creating and using a development branch. You will configure 
various components that demonstrate the different aspects of branches.

* Part 1, preparing production configurations:
  * [Prepare the table configurations](/getting-started/branches/prepare-tables/)
  * [Prepare the file configurations](/getting-started/branches/prepare-files/)
* Part 2, working in a branch: 
  * [Work with tables in a branch](/getting-started/branches/tables-in-branch)
  * [Work with files in a branch](/getting-started/branches/files-in-branch)
* Part 3, merging branches:
  * [Review the project diff](/getting-started/branches/project-diff/)
  * [Merge to production](/getting-started/branches/merge-to-production/)

## From a terminal

[kbagent](/cli/) drives a branch from the shell; the merge on the pages below stays in the UI. The examples name
the project by the alias `kbagent project add` stored for it, `docs-demo` here. Substitute yours:

```bash
kbagent branch create --project docs-demo --name "Try the new transformation"
```

Creating a branch also activates it, so the commands that follow act inside it rather than in
production. `kbagent branch list` shows what exists, `kbagent branch use --branch <branch-id>`
switches to another one, and `kbagent branch reset` puts you back in production. Storage reads
are the exception: `storage tables` and `storage buckets` report production unless you pass
`--branch` explicitly, so they don't quietly answer about a branch you forgot you were in.
`config list` follows the active branch.

The merge on the pages below, with its diff and partial-merge choices, happens in the Keboola UI;
`kbagent branch delete --branch <branch-id>` removes a branch you kept afterwards. On a project
with [merge requests](/components/branches/merge-requests/) (Branches 2.0), kbagent can also run the
review: `kbagent merge-request create --project docs-demo --title "<title>"` from the active
branch, then, once it has the approvals the project requires,
`kbagent merge-request merge --project docs-demo --branch <branch-id> --yes`. That merges the whole
branch into production, deletes it and puts you back in production; partial merges stay in the UI.
Without Branches 2.0, the `merge-request` commands fail with `FEATURE_NOT_ENABLED`.

:::caution[Public Beta]
This feature is currently in public beta. Please provide feedback using the feedback button in your project.
:::

**Next:** [Prepare the table configurations →](/getting-started/branches/prepare-tables/)
