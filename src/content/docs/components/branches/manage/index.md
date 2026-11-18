---
title: Manage development branches
slug: 'components/branches/manage'
description: Enable branched storage, create a development branch, and close it by deleting it or merging it into production.
---

This page shows how to create and close a [development branch](/components/branches/).

### Enabling Branched Storage

Branched Storage is enabled per project in **Project Settings**. Look for the **Branched storage** toggle under the Features section.

![Screenshot - Branched Storage Toggle](/components/branches/feature-branched-storage.png)

Once enabled, all new branches in that project will automatically use the isolated storage model.

## Creating a Branch

If you have your configurations ready in production and want to create a branch to test some changes, click on your project's name
at the top of the screen. Then click on the green icon **New** displayed next to your project's name.

![Screenshot - Create Development Branch](/getting-started/branches/figures/08-create-dev-branch.png)

Name your new branch and click **Create Development Branch** to open it.

![Screenshot - Name Development Branch](/getting-started/branches/figures/09-name-dev-branch.png)

The branch will appear right below the name of your production project.

![Screenshot - Created Development Branch](/getting-started/branches/figures/10-dev-branch-created.png)

Now you can start modifying your configurations, run them, and analyze the results.

If you want to learn more about working in a branch, follow our [tutorial](/getting-started/branches/).

## Closing a Branch

Before you merge your development branch back to production, check a detailed [diff of the configuration changes](/getting-started/branches/project-diff/).

You can end your branch's lifecycle in two ways:

- **Deleting** — if you do not wish to use the changes you've made and want to simply discard them. The data associated with the branch is discarded when the branch is deleted.
- [**Merging into production**](/getting-started/branches/merge-to-production/) — all changes in the configurations are brought back to the respective production configurations. All the changes are applied at once (after you approve them) and produce new [versions](/components/#configuration-versions) of the respective configurations. In the merge dialog, you choose whether to delete the branch or keep it for further reference after merging. Projects with [**Branches 2.0**](/components/branches/merge-requests/) enabled merge through a [merge request](/components/branches/merge-requests/), which lets you review the configuration diff and, if the project requires it, collect approvals before the changes reach production; a merged request always deletes the branch.

**Next:** [Merge requests →](/components/branches/merge-requests/)
