---
title: Manage development branches
slug: 'components/branches/manage'
sidebar:
  label: Manage Branches
description: 'Enable branched storage, create a development branch, switch between a branch and production, and close a branch by deleting or merging it.'
---

This page has the steps for the life of a [development branch](/components/branches/): turning on branched storage, creating a branch, moving between it and production, and closing it. How a branch isolates your changes is explained on [Development Branches](/components/branches/). Reviewing and merging the changes is on [Merge requests](/components/branches/merge-requests/).

<!-- How-to-type page. Source: the Development Branches page as it was before the 2026-11-19 split; the switch steps are read from the branch switcher screenshot on the Merge Requests page. Facts not re-checked against the product. -->

## Enable branched storage

**Goal:** give every new branch in the project its own isolated storage.

1. Branched Storage is enabled per project in **Project Settings**. Open them.
2. Look for the **Branched storage** toggle under the Features section and turn it on.

   ![Screenshot - Branched Storage Toggle](/components/branches/feature-branched-storage.png)

**Result:** once enabled, all new branches in that project will automatically use the isolated storage model. What that model does is explained in [Branched storage](/components/branches/#branched-storage).

## Create a branch

**Goal:** get a branch in which you can change and run configurations without touching production.

1. If you have your configurations ready in production and want to create a branch to test some changes, click on your project's name
   at the top of the screen. Then click on the green icon **New** displayed next to your project's name.

   ![Screenshot - Create Development Branch](/getting-started/branches/figures/08-create-dev-branch.png)

2. Name your new branch and click **Create Development Branch** to open it.

   ![Screenshot - Name Development Branch](/getting-started/branches/figures/09-name-dev-branch.png)

**Result:** the branch will appear right below the name of your production project.

![Screenshot - Created Development Branch](/getting-started/branches/figures/10-dev-branch-created.png)

Now you can start modifying your configurations, run them, and analyze the results.

If you want to learn more about working in a branch, follow our [tutorial](/getting-started/branches/).

<!-- VERIFY(Nikita): the create steps and their three screenshots show an older project menu. The branch switcher screenshot on the Merge Requests page has a New Development Branch item instead. Confirm which path is current. -->

## Switch between a branch and production

**Goal:** move from production into a branch, or back.

1. Open the branch switcher at the top of the screen.
2. Under **Switch To**, select **Production** or the branch you want.

**Result:** the project opens in what you selected, and the switcher lists it under **Current**.

<!-- VERIFY(Nikita): these steps are read from the branch switcher screenshot on the Merge Requests page (Current, Switch To). No earlier page described switching. Confirm the labels. -->

## Close a branch

**Goal:** end a branch, either discarding its changes or bringing them to production.

1. Before you merge your development branch back to production, check a detailed [diff of the configuration changes](/getting-started/branches/project-diff/).
2. You can end your branch's lifecycle in two ways:

   - **Deleting** — if you do not wish to use the changes you've made and want to simply discard them. The data associated with the branch is discarded when the branch is deleted.
   - [**Merging into production**](/getting-started/branches/merge-to-production/) — all changes in the configurations are brought back to the respective production configurations. All the changes are applied at once (after you approve them) and produce new [versions](/components/configurations/#see-the-version-history) of the respective configurations. In the merge dialog, you choose whether to delete the branch or keep it for further reference after merging. Projects with [**Branches 2.0**](/components/branches/merge-requests/) enabled merge through a [merge request](/components/branches/merge-requests/), which lets you review the configuration diff and, if the project requires it, collect approvals before the changes reach production; a merged request always deletes the branch.

**Result:** a deleted branch takes its data with it. A merged branch leaves new versions of the changed configurations in production; what else a merge leaves behind is described in [After a merge](/components/branches/#after-a-merge).

---

**Next:** [Merge requests →](/components/branches/merge-requests/)
