---
title: Merge to production
permalink: /tutorial/branches/merge-to-production/
---

* TOC
{:toc}

In the previous section you learned how to [check what is changed in the branch](/tutorial/branches/project-diff/). Now you're finally at the point where you merge the branch to production. 


When merging changes back to production, you sometimes want to merge all the changes at once -- because you tested all of them together and know they work. That's what we call a **Full merge**. 

At other times, you want to merge just a subset of the changes, which allows you to push the part that's finished to production and keep working on the rest. We call that a **Partial merge**. While this is certainly useful, you probably should not use this as your standard workflow. You can't be sure if the subset of changes actually works without the rest. It's safer to prepare and test the changes in full, merge them and then start a new branch for the next part of the changes. 

Because you have two isolated changes - the bitcoin Snowflake transformation and then the Python file manipulating transformation - it's a good oportunity to test both approaches though.  

## Partial merge

We'll first try Partial merge of only the subset of configurations related to the `Sample Python transformation` Let's examine the project diff further. 

{: .image-popup}
![Screenshot - Project diff](/tutorial/branches/figures/merge-python-checkbox.png)

You can see there are checkboxes to the left of each configuration in the list. Configurations that have that checkbox checked will be merged. Uncheck all the checkboxes except the one near the `Sample Python transformation`.

Click **Merge to production**. On the following dialog, you can change the merge message. Put in `Merge Python transformation from sample branch` as merge message. Also make sure that the *Delete current development branch after merge.* checkbox is not checked. Only then click the **Merge** button.

*Note: If you merged the branch with the checkbox checked you'll need to recreate the whole branch in the next step.*  

{: .image-popup}
![Screenshot - Merge dialog](/tutorial/branches/figures/merge-python-dialog.png)

When you start the merge a progress bar will show up informing you of the progress of the merge. After the merge is finished, you will see only 2 changed configurations in your branch. The Python transformation configuration no longer differs.

{: .image-popup}
![Screenshot - Match Change from Production](/tutorial/branches/figures/partially-merged-branch.png)

Switch to production and examine the Python transformation configuration. Notice that a new version has been created with the merge message as change description. 

{: .image-popup}
![Screenshot - Merged change](/tutorial/branches/figures/merge-python-in-prod.png)

If you examine the code block you'll see that the change from the branch is there. 

{: .image-popup}
![Screenshot - Merged change](/tutorial/branches/figures/merge-python-in-prod-2.png)

If you go to the **Storage** section, you'll see that the branch buckets are still available if you toggle the switch to show development branch buckets. However, they cannot be used by the production configurations.

{: .image-popup}
![Screenshot - Production storage](/tutorial/branches/figures/merge-python-prod-storage.png)

## Full merge

Switch back to `Sample branch`. Go to **Project diff**. Make sure that all the remaining configurations have their respective checkboxes checked. Then click **Merge to production**. Make sure that the *Delete current development branch after merge.* checkbox is checked. Fill in the merge message `Merge Bitcoin transformation and HTTP extractor`. Then click **Merge** 

{: .image-popup}
![Screenshot - Merge dialog](/tutorial/branches/figures/merge-snflk-dialog.png)

The merge will take slightly longer as the whole branch is being deleted. Afterwards you'll be redirected back to production.

{: .image-popup}
![Screenshot - Branch deleted](/tutorial/branches/figures/branch-deleted.png)

If you go to **Storage**, you'll see that the bucket `out.c-bitcoin` still only has the `top_prices` table. The `dollar_btc_transactions` table is missing, even though you had it in your branch and you merged the config. 

{: .image-popup}
![Screenshot - Production storage after branch is deleted](/tutorial/branches/figures/branch-deleted-storage.png)

This is expected. Branch storage is completely isolated and no data are merged back to production, only configurations. You need to run the extractor in production to get the data in production **Storage**. Also notice that branch buckets switch is disabled as there are no more branch buckets. They were deleted along with the branch. 

Examine the merged configurations. First run the HTTP extractor to get the source tables, then the Snowflake transformation. Examine the results. 

## You did it! 🎉 

This concludes the tutorial. You learned how to create branches and how tables and files work in branches. You also learned about different scenarios when merging a branch. 
