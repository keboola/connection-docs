---
title: Handling simultaneous changes and conflicts
permalink: /tutorial/branches/simultaneous-changes/
---

In the [previous section](/tutorial/branches/project-diff/) you examined the project diff to see what has been changed in the branch. You now know what changes will be applied when the branch is merged. But before you proceed to merging the development branch to production, there is one more scenario that needs to be mentioned. While you were working in your development branch, someone else might have made changes to your production branch in the meantime.

*Note: If you skipped the [file manipulation part](/tutorial/branches/prepare-files) of the tutorial, you'll need to change your Snowflake transformation instead of the Python transformation.*

Let’s see what this might look like. Go to your production branch, to your transformation, and edit the variable
`outFileContent`. Instead of `Hello world!` write `Hello tester!`, and then click on the blue check icon.

{: .image-popup}
![Screenshot - Edit Variable in Production](/tutorial/branches/figures/22-edit-var-in-prod.png)

Now we’ve made configuration changes in both branches. Switch back to the development branch and look at the
project diff. You’ll see a **warning message** saying that there is a conflict between the two configurations.

{: .image-popup}
![Screenshot - Conflict Warning](/tutorial/branches/figures/23-conflict-warning.png)

Click **Compare with production** to see the differences.

{: .image-popup}
![Screenshot - Configuration Changes Differences](/tutorial/branches/figures/24-config-changes-diff.png)

The conflict here means that the production project changed while we were working in the development branch.
`Hello world!` was changed to `Hello tester!`. If you merged the development project to production now,
the development project would overwrite any changes made in production. In our case, `Hello tester!` would become
`Hello world!` again.

## Resolve Conflicts
To resolve the conflict and merge the development branch to production safely without overwriting anything new, you have two options. Either you can just change the branch configuration to have an expected diff against the production. Or you can reset the branch configuration to production version and apply you changes again - this is the better and safer option. 

### Changing the config manually to match production

Let's try the unsafe option - changing your branch config to match changes in production. It has the advantage that you don't lose your changes and don't need to reapply them. The disadvantage is that the configuration will remain marked as conflict and therefore you won't know if there is another conflict unless you check the diff. 

Examine the following diff. 

{: .image-popup}
![Screenshot - Configuration Changes Differences](/tutorial/branches/figures/24-config-changes-diff.png)

The production changes are marked red, and your local are marked green. The change to `outFile` is expected - that's our change in the branch. The change to `outFileContent` is the one that is unexpected. You can see that red (production) says `Hello tester!` and green (branch) shows `Hello world!`. To align the configurations, navigate to the transformation in branch and change the variable from `Hello world!` to `Hello tester!`.

{: .image-popup}
![Screenshot - Match Change from Production](/tutorial/branches/figures/25-match-change-in-prod.png)

Navigate to the dashboard and look at the project diff again.

{: .image-popup}
![Screenshot - Remaining Changes Diff](/tutorial/branches/figures/26-config-remaining-changes-diff.png)

As you can see the configuration is still in conflict (because it's changed both in branch and in production). If you compare the configuration with production you'll see that there is only the expected change. 

{: .image-popup}
![Screenshot - Match Change from Production](/tutorial/branches/figures/conflict-diff-after-reconciliation.png)

Unfortunately you'll need to manually examine the diff before merging to make sure that the conflict is still only the expected diff and that no one changed the configuration in production in the meantime. To work around this, you can use the second way of handling the conflicts.  

### Reset the configuration to production version and reapply changes

This option is safer because it will not mark your configuration as conflict anymore and therefore if it later turns into a conflict, you'll know that someone changed the production again. The downside is that you'll lose whatever changes you made to the configuration in the branch, and you'll need to do them again. We understand this is not ideal and will work to improve it in the future versions. 

To reset, you first need to somehow store the changes you made to the configuration (copypasting the diff into an editor or taking a screenshot is the simplest solution). Then you select **Reset changes**. 

{: .image-popup}
![Screenshot - Match Change from Production](/tutorial/branches/figures/reset-changes.png)

By this the conflict and also the diff will completely disappear, and your configuration will be the same as production. Now you need to navigate to the transformation and do the conflicting change again. That means, change the `outFile` variable to `branchDemoFile.txt`.

If you now examine the project diff, you'll see that you again have 4 changes and no conflict. 

{: .image-popup}
![Screenshot - Match Change from Production](/tutorial/branches/figures/project-diff-after-reset.png)

If you examine the configuration diff, you'll see that you're back to the original diff where you only have a change in the `outFile` variable definition. 

{: .image-popup}
![Screenshot - Match Change from Production](/tutorial/branches/figures/diff-after-reset.png)

In this section you learned how to get out of a conflict with production branch and learned two different ways to do that. You understand the pros and cons of both ways. Now you can proceed to [merge the branch to production](/tutorial/branches/merge-to-production/). 
