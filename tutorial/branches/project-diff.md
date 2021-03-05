---
title: Project diff
permalink: /tutorial/branches/project-diff/
---

* TOC
{:toc}

In the previous parts you tested how [files](/tutorial/branches/files-in-branch/) and [tables](/tutorial/branches/tables-in-branch/) behave in branches. Now it's time to complete the branch lifecycle and merge the development branch back to production. 

### Show Project Diff
First, you want to check what are the things that you changed against the production. Switch to the `Sample branch`. Go to the dashboard and click the button **Show Project Diff** on the right. There you can see the things you’ve changed.

{: .image-popup}
![Screenshot - Project Diff](/tutorial/branches/figures/show-project-diff.png)

To see a detailed diff of the changes to `Sample Python transformation` transformation configuration, click the three dots on the right and then **Compare with production**.

{: .image-popup}
![Screenshot - Project Diff](/tutorial/branches/figures/project-diff.png)

You should see highlighted configuration diff. 

{: .image-popup}
![Detailed diff of configuration change](/tutorial/branches/figures/diff-config-show-changed.png)

Sometimes it might be hard to see what changed when there are many changes to the configuration. It's useful to see the changes in context. To do that uncheck the *Show changed parts only* checkbox. 

{: .image-popup}
![Detailed diff of configuration change](/tutorial/branches/figures/diff-config-show-all.png)

Back on the Project diff page note the message above the changed configurations list. It says that your production storage will not be affected by that merge. This means that tables will not be created in production unless you run the configurations that created them and no data will be transferred from branch to production. 
For example, the table `bitcoin_transactions` which you [created in branch](/tutorial/branches/tables-in-branch/#extend-the-transformation) will not be transfered to production and if the branch is deleted after merge, the branch version of the table will be discarded as well. You need to run the HTTP extractor in production after you merge it for the `bitcoin_transactions` table to be created.

Also, if you were to drop a column on a table in the branch, you need to drop that column on the production table as well after you merge the branch. 

In the next part you will finally [merge the branch back to production](/tutorial/branches/merge-to-production/)!
