---
title: Development/Production Mode Tutorial
permalink: /transformations/dev-prod-mode/
---

* TOC
{:toc}

The feature Development/Production Mode enables you to develop code above your production data without affecting
or endangering the data in any way. It works as a version system where you create a new branch, make changes 
in it, and run your configurations as needed. Output data is stored separately and does not overwrite your
production data. 

In this tutorial, we will show you how Development/Production Mode works, what the process of developing in 
a branch looks like, and what you need to do before you can start.

## Private Beta Warning
Development/Production Mode is currently in private beta. Some features may not work as expected. Please bear 
with us while we polish all necessities. Any feedback is welcome at [https://ideas.keboola.com](https://ideas.keboola.com).

## Before You Start
To request to be a beta tester for this feature, please ask via the support button in your project.

In the next steps, we will create and configure a transformation to demonstrate the modes on.

###  Create Transformation
In your testing project, create a new **Python** transformation and name it, for instance, *Testing dev/prod mode*. 

{: .image-popup}
![Screenshot - Create Transformation](/transformations/dev-prod-mode/01-new-transformation.png)

### Create Shared Code
Then go back to **Transformations** and prepare the following [shared code](/transformations/variables/#shared-code) 
in Python for the transformation. Name it *Create a file*. 

*Name:* `Create a file`
<br> *Type:* `Python`
<br> *Shared code:*
{% highlight sql %}
f = open("out/files/{{outFile}}", "a")
f.write("{{outFileContent}}")
f.close ()
{% endhighlight %}

Finally, enter two out variables `outFile`, `outFileContent`, and click **Create Share Code**. 

{: .image-popup}
![Screenshot - New Shared Code](/transformations/dev-prod-mode/02-new-shared-code.png)

### Add Shared Code to Transformation
To add the new shared code to your transformation, go to your new transformation, scroll down to 
**Scripts -- Block 1**. Click **Select Shared Code** and select the code you have just created. 
Click **Use as Shared Code**.

{: .image-popup}
![Screenshot - Add Shared Code](/transformations/dev-prod-mode/03-add-shared-code.png)

Now move up to the section **Variables** and prepare the variables for your shared code. 
Click to **initialize the variables** with empty values.
<br> `outFile`: `demoFile.txt` 
<br> `outFileContent`: `Hello world!`

{: .image-popup}
![Screenshot - Initialize Variables](/transformations/dev-prod-mode/04-initialize-variables.png)

### Set Output Mapping
Now go to the section **File Output Mapping** and click **New File Output**. And because the output of the 
transformation will be the file `demoFile.txt`, let’s set it as *Source* and `demoOutput` as *Tags*. This means 
that the output will be stored in Storage as `demoFile.txt` with the tag `demoOutput`. Click **Add File Output**.

{: .image-popup}
![Screenshot - Set Output Mapping](/transformations/dev-prod-mode/05-output-mapping.png)

### Run Transformation
Let’s run the component. 

{: .image-popup}
![Screenshot - Run Transformation](/transformations/dev-prod-mode/06-run-component.png)

After the job is finished, go to **Storage -- Files**, where you can see the file `demoFile.txt` generated.

{: .image-popup}
![Screenshot - Generated File ](/transformations/dev-prod-mode/07-generated-file.png)

Now you have everything ready to start testing the Development/Production Mode.

## Create Development Branch
Imagine you're tasked with changing the name of the output file and adding a bit of logging to the transformation. 
You're hesitant to do this on a live and business critical transformation in production. This is where 
Development/Production Mode comes in, giving you the option to test the changes safely before merging them to 
production. 

To create a new branch, click on your project’s name at the top of the screen (for the purposes of this tutorial, 
the production project is called *Dev branches demo*). Then click on the green icon **New** displayed next to 
your project’s name. 

{: .image-popup}
![Screenshot - Create Development Branch](/transformations/dev-prod-mode/08-create-dev-branch.png)

Name your new development branch, for example, *My dev branch*, and click **Create Development Branch**  to open it.

{: .image-popup}
![Screenshot - Name Development Branch](/transformations/dev-prod-mode/09-name-dev-branch.png)

Your new branch will appear right below the name of your production project.

{: .image-popup}
![Screenshot - Created Development Branch](/transformations/dev-prod-mode/10-dev-branch-created.png)

Once inside the new development branch, let’s run the same transformation you ran in the production branch. 
Go to **Transformations**, select the transformation *Testing dev/prod mode* and run it. 

{: .image-popup}
![Screenshot - Run Transformation in Development Branch](/transformations/dev-prod-mode/11-option-edit-vars.png)

Notice that there is an option to edit the variables in the *Variables* dropdown box before you run 
the configuration. But we don’t need this now.

### File Tags
When the job finishes, go to **Storage -- Files**. You can see that the `demoFile.txt` was created but is was not 
assigned the tag **demoOutput**. It was assigned the tag **1189-demoOutput** instead. The prefix **1189** is the ID of 
this branch. You can also see the ID in the URL. This is how the development branch files are distinguished from 
the files that were created in the production environment.

{: .image-popup}
![Screenshot - Development Branch Output](/transformations/dev-prod-mode/12-dev-branch-output.png)

### Change Configuration
Now it’s time to make the changes to the transformation and test them. Let’s add a bit of code first. Go to 
**Transformations** and in **Shared Codes**, select *Create a file*. Then click **Edit Code** and **Let’s Change
the Shared Code**.

{% highlight sql %}
f = open("out/files/{{ outFile }}", "a")
f.write("{{ outFileContent }}")
f.close()

print("Output written to {{ outFile }}")
{% endhighlight %}

{: .image-popup}
![Screenshot - Edit Shared Code](/transformations/dev-prod-mode/13-edit-shared-code-in-dev.png)

The transformation will do exactly the same as before, but it will add `Output written to demoFile.txt` to 
the output. Save the shared code. Go back to **Transformations**, select the transformation *Testing dev/prod 
mode*, and run the component again.

You can see in the job log that you used this new block.

{: .image-popup}
![Screenshot - Job Log](/transformations/dev-prod-mode/14-jobs-log.png)

The file was uploaded to Storage again. 

Now change the name of the output file. To do that, go to your transformation and change the value of the variable 
`outFile` from `demoFile.txt` to `demoBranchFile.txt`. Then click the little check mark icon on the right.

{: .image-popup}
![Screenshot - Edit Variable in Development Branch](/transformations/dev-prod-mode/15-edit-var-in-dev.png)

### Show Project Diff
Go to the dashboard and click the button **Show Project Diff** on the right. There you can see the things you’ve 
changed (the shared code and the definition of one variable for the Python transformation). 

{: .image-popup}
![Screenshot - Project Diff](/transformations/dev-prod-mode/16-project-diff.png)

To see a detailed diff of the changes, click the three dots on the right and then **Compare with production**.

{: .image-popup}
![Screenshot - Config Changes - Shared Code](/transformations/dev-prod-mode/17-diff-config-changes-shared-code.png)

{: .image-popup}
![Screenshot - Config Changes - Variable](/transformations/dev-prod-mode/18-diff-config-changes-var.png)

## Switch Back to Production
Let’s go back to production to see that by changing the transformation in the development branch, we did not 
affect the production transformation in any way. 

Go to **Transformations** and check **Shared Codes** to see that there is still the original version of 
`Create a file` that we created at the beginning. It was not overwritten by the changes we made in the development 
branch.

{: .image-popup}
![Screenshot - Check Shared Code In Production](/transformations/dev-prod-mode/19-check-shared-code.png)

Then go to your production transformation and check **Block 1** to see that there, too, is the original short 
version of the shared code. 

{: .image-popup}
![Screenshot - Check Variable In Production](/transformations/dev-prod-mode/20-check-block1.png)

To make sure nothing has changed, run the transformation in production again. When it finishes, go to **Storage -- 
Files**. You can see that `demoFile.txt` was created. Because it ran in production mode, it was assigned the 
tag `demoOutput` without any prefix.

{: .image-popup}
![Screenshot - Storage File in Production](/transformations/dev-prod-mode/21-storage-files-prod.png)

##  Simultaneous Changes
Before we proceed to merging the development branch to the production project, there is one more scenario we need 
to mention here. While you are working in your development branch, someone else might be doing changes to your 
production project at the same time.

Let’s see what this might look like. Go to your production branch, to your transformation, and edit the variable 
`outFileContent`. Instead of `Hello world!` write `Hello tester!`, and then click on the blue check icon. 

{: .image-popup}
![Screenshot - Edit Variable in Production](/transformations/dev-prod-mode/22-edit-var-in-prod.png)

Now we’ve made configuration changes in both branches. Switch back to the development branch and look at the 
project diff. You’ll see a **warning message** saying that there is a conflict between the two configurations. 

{: .image-popup}
![Screenshot - Conflict Warning](/transformations/dev-prod-mode/23-conflict-warning.png)

Click **Compare with production** to see the differences.

{: .image-popup}
![Screenshot - Configuration Changes Differences](/transformations/dev-prod-mode/24-config-changes-diff.png)

The conflict here means that the production project changed while we were working in the development branch. 
`Hello world!` was changed to `Hello tester!`. If you merged the development project to production now, 
the development project would overwrite any changes made in production. In our case, `Hello tester!` would become
`Hello world!` again.

### Resolve Conflicts
To resolve the conflict and merge the development branch to production safely without overwriting anything new, 
you need to manually replicate the production change in the development branch and turn `Hello world!` to `Hello 
tester!` too.

{: .image-popup}
![Screenshot - Match Change from Production](/transformations/dev-prod-mode/25-match-change-in-prod.png)

Don’t forget to click the blue check icon on the right. When done, go back to the dashboard and look 
at the project diff again. 

{: .image-popup}
![Screenshot - Remaining Changes Diff](/transformations/dev-prod-mode/26-config-remaining-changes-diff.png)

You will still see the configuration as in conflict because it was edited both in production as well 
as in the development branch. However, we had the option to edit the changes and make sure the remaining 
differences are only those that we really want. In this case, we only want the two following changes.

{: .image-popup}
![Screenshot - Config Changes - Variable](/transformations/dev-prod-mode/18-diff-config-changes-var.png)

and

{: .image-popup}
![Screenshot - Config Changes - Shared Code](/transformations/dev-prod-mode/17-diff-config-changes-shared-code.png)

## Merge to Production
Now click **MERGE TO PRODUCTION** and confirm. If the merge is successful, you will be taken to your production 
project. The development branch is deleted when merged. 

Go to your transformation in your production project and let’s see what did or did not change:

In `outFile`, there is still the `Hello tester!` as we changed it in production earlier; it was not overwritten by 
`Hello world!` that was originally in the development branch. The file `demoBranchFile.txt` was successfully 
copied from the development branch.

{: .image-popup}
![Screenshot - Check Production Changes](/transformations/dev-prod-mode/27-check-changes-in-prod-var.png)

The new part of the shared code that you added in the development branch was copied from the development branch as 
well.

{: .image-popup}
![Screenshot - Check Production Changes](/transformations/dev-prod-mode/28-check-changes-in-prod-code.png)

*Note: All events in the development branch are separated from the events in production. They are only displayed 
in the branch where they took place.* 


Now let’s do the same thing with tables to see how table storage behaves in Development/Production Mode. 

*To be continued.*



