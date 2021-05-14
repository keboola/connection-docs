---
title: Merge to Production
permalink: /tutorial/branches/merge-to-production/
---

* TOC
{:toc}

After you have [checked your changes in the branch](/tutorial/branches/project-diff/), you can merge the branch 
back to production. 

There are two ways to merge your changes to production, depending on whether you want to merge them all or just their subset: 

- **Full merge** -- merge all changes at once. You tested all of them together and know they work. 
- **Partial merge** -- merge just a subset of the changes and keep working on the rest. Keep in mind that while useful, this should not be used as your standard workflow. You cannot be sure that the subset of changes actually works without the rest. It is safer to prepare and test the changes in full, merge them, and then start a new branch for the next part of the changes. 

Because you have made two isolated changes (the bitcoin Snowflake transformation, and the Python file manipulating
transformation), you now have a good opportunity to test both approaches.  

## Partial Merge

First, let's merge only the subset of configurations related to the `Sample Python transformation`. Examine the project 
diff further. 

{: .image-popup}
![Screenshot - Project diff](/tutorial/branches/figures/merge-python-checkbox.png)

You can see that there are checkboxes to the left of each configuration in the list. The configurations that have 
the checkbox checked will be merged. Uncheck all the checkboxes except the one near the `Sample Python transformation`.

Click **Merge to production**. In the following dialog, you can change the merge message. Put in `Merge Python 
transformation from sample branch` as the merge message. Also make sure that the checkbox *Delete current development branch 
after merge.* is not checked. Only then click the **Merge** button.

***Note:** If you merged the branch with the checkbox checked, you will need to recreate the whole branch in the next step.*  

{: .image-popup}
![Screenshot - Merge dialog](/tutorial/branches/figures/merge-python-dialog.png)

When you start the merge, a progress bar will show up informing you of the progress of the merge. After the merge is 
finished, you will see only two changed configurations in your branch. The Python transformation configuration no longer 
differs.

{: .image-popup}
![Screenshot - Match Change from Production](/tutorial/branches/figures/partially-merged-branch.png)

Switch to production, and examine the Python transformation configuration. Notice that a new version has been created 
with the merge message as the description of the change. 

{: .image-popup}
![Screenshot - Merged change](/tutorial/branches/figures/merge-python-in-prod.png)

If you examine the code block, you will see that the change from the branch is there. 

{: .image-popup}
![Screenshot - Merged change](/tutorial/branches/figures/merge-python-in-prod-2.png)

If you go to the **Storage** section, you will see that the branch buckets are still available if you toggle the switch 
to show development branch buckets. However, they cannot be used by the production configurations.

{: .image-popup}
![Screenshot - Production storage](/tutorial/branches/figures/merge-python-prod-storage.png)

## Full Merge

Switch back to `Sample branch`. Go to **Project diff**. Make sure that all the remaining configurations have their
respective checkboxes checked. Then click **Merge to production**. Make sure that the checkbox *Delete current development 
branch after merge.* is checked. Fill in the merge message: `Merge Bitcoin transformation and HTTP extractor`. Then click 
**Merge**. 

{: .image-popup}
![Screenshot - Merge dialog](/tutorial/branches/figures/merge-snflk-dialog.png)

The merge will take slightly longer as the whole branch is being deleted. Afterwards, you will be redirected back to 
production.

{: .image-popup}
![Screenshot - Branch deleted](/tutorial/branches/figures/branch-deleted.png)

If you go to **Storage**, you will see that the bucket `out.c-bitcoin` still only has the `top_prices` table. 
The table `dollar_btc_transactions` is missing even though you had it in your branch and you merged the configuration. 

{: .image-popup}
![Screenshot - Production storage after branch is deleted](/tutorial/branches/figures/branch-deleted-storage.png)

This is expected. Branch storage is completely isolated and no data are merged back to production, only configurations. 
You need to run the extractor in production to get the data into production **Storage**. Also, notice that the branch 
bucket switch is disabled as there are no more branch buckets. They were deleted along with the branch. 

Examine the merged configurations. Run the HTTP extractor to get the source tables first, then run the Snowflake 
transformation. Examine the results. 

## You Did It! 🎉 

This concludes the tutorial. You learned how to create branches and how tables and files work in them. You also learned 
about different scenarios when merging a branch. 
