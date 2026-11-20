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

1. Branched Storage is enabled per project in [Project Settings](/management/project/): click your avatar icon at the upper right corner and select **Project Settings**.

2. Look for the **Branched storage** toggle under the Features section and turn it on.

   ![Screenshot - Branched Storage Toggle](/components/branches/feature-branched-storage.png)

**Result:** once enabled, all new branches in that project will automatically use the isolated storage model. What that model does is explained in [Branched storage](/components/branches/#branched-storage).

## Create a branch

**Goal:** get a branch in which you can change and run configurations without touching production.

1. In production, in the top bar to the right of the project name, click **New Development Branch**. If the project already has a branch, the control reads **Production**: open it and click **+ New Development Branch**.

   ![Screenshot - Create Development Branch](/getting-started/branches/figures/08-create-dev-branch.png)

2. In the **Create Development Branch** dialog, fill in **Name** (and optionally **Notes**), then click **Create development branch**.

   ![Screenshot - Name Development Branch](/getting-started/branches/figures/09-name-dev-branch.png)

**Result:** the project switches into the new branch. The top bar shows the branch name with a ⌄ chevron, and the branch switcher lists the branch under **Current**.

![Screenshot - Created Development Branch](/getting-started/branches/figures/10-dev-branch-created.png)

Now you can start modifying your configurations, run them, and analyze the results.

If you want to learn more about working in a branch, follow our [tutorial](/getting-started/branches/).

<!-- Checked 2026-11-20 in the UI of project 264: with no branches the top bar has a plain New Development Branch button; with a branch it reads Production with a menu that has + New Development Branch. The dialog Create Development Branch has the fields Name and Notes and the button Create development branch; after creation the UI switches into the branch. TODO(human-review, Nikita): the three screenshots above show the older top-menu UI and need replacing. -->

## Switch between a branch and production

**Goal:** move from production into a branch, or back.

1. Open the branch switcher: in the top bar, click the control to the right of the project name. In production it reads **Production** ⌄; inside a branch it shows the branch name ⌄. If the project has no branches yet, the control is a plain **New Development Branch** button and there is nothing to switch to.
2. Under **Switch To**, select **Production** or the branch you want.

**Result:** the project opens in what you selected, and the switcher lists it under **Current**.

<!-- Checked 2026-11-20 in the UI of project 264: in production with at least one branch the control reads Production, and its menu has Current: Production, Switch To: <branch> and + New Development Branch; with no branches it is a plain New Development Branch button. -->

## Close a branch

**Goal:** end a branch, either discarding its changes or bringing them to production.

1. Before you merge your development branch back to production, check a detailed [diff of the configuration changes](/getting-started/branches/project-diff/).
2. You can end your branch's lifecycle in two ways:

   - **Deleting**: if you do not wish to use the changes you've made and want to simply discard them. The data associated with the branch is discarded when the branch is deleted.
   - [**Merging into production**](/getting-started/branches/merge-to-production/): bring the configuration changes back to production, directly or, in projects with Branches 2.0, through a [merge request](/components/branches/merge-requests/). What a merge changes, and whether the branch survives it, is in [After a merge](/components/branches/#after-a-merge).

3. To delete a branch: inside the branch, open the branch switcher, hover over the branch under **Current** and click **Delete branch** (the trash icon). In the **Delete Development Branch** dialog, click **YES, delete**. The **Branch diff** page has no delete action; it offers only **Merge to production**.

   <!-- Checked 2026-11-20 in the UI of project 264: hovering the Current row in the switcher shows Edit branch, Delete branch, Branch Diff and Pull from Prod; the Delete Development Branch dialog warns that the changes are deleted permanently and has Cancel and YES, delete. -->

**Result:** a deleted branch takes its data with it. A merged branch leaves new versions of the changed configurations in production; what else a merge leaves behind is described in [After a merge](/components/branches/#after-a-merge).

---

**Next:** [Merge requests →](/components/branches/merge-requests/)
