---
title: Project Diff
permalink: /tutorial/branches/project-diff/
---

* TOC
{:toc}

You have already learned how [files](/tutorial/branches/files-in-branch/) and [tables](/tutorial/branches/tables-in-branch/) 
behave in branches. Now it is time to complete the branch lifecycle and merge the development branch back to production. 

## Show Project Diff
First, let's see what the things that you changed against the production are. To do that, switch to the `Sample branch`, 
go to the dashboard, and click the button **Show Project Diff** on the right. 

{: .image-popup}
![Screenshot - Project Diff](/tutorial/branches/figures/show-project-diff.png)

To see a detailed diff of the configuration changes in `Sample Python transformation`, click the three dots on the right 
and then **Compare with production**.

{: .image-popup}
![Screenshot - Project Diff](/tutorial/branches/figures/project-diff.png)

You should see a highlighted configuration diff. 

{: .image-popup}
![Detailed diff of configuration change](/tutorial/branches/figures/diff-config-show-changed.png)

With many changes to the configuration, it might be difficult to find what has changed. It helps to see the changes 
in context. To do that, uncheck the checkbox **Show changed parts only**. 

{: .image-popup}
![Detailed diff of configuration change](/tutorial/branches/figures/diff-config-show-all.png)

Back on the project diff page, note the message above the list of changed configurations. It says that your 
production storage will not be affected by the merge. This means that no tables will be created in production 
unless you run the configurations that created them, and no data will be transferred from the branch to production. 

For example, the table `bitcoin_transactions` which you 
[created in branch](/tutorial/branches/tables-in-branch/#extend-the-transformation) will not be transferred to production, 
and if the branch is deleted after the merge, the branch version of the table will be discarded as well. The table 
`bitcoin_transactions` will be created by running the HTTP data source connector in production after you merge it.

Also, if you want to drop a column from a table in the branch, you need to drop that column from the production table as well after you merge the branch. 

Continue to the last part of our tutorial where we will show you how to [merge the branch back to production](/tutorial/branches/merge-to-production/).