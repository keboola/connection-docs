---
title: Working with files in branch
permalink: /tutorial/branches/files-in-branch/
---

* TOC
{:toc}

In the [previous section](/tutorial/branches/tables-in-branch/) you created a branch from configurations in production and you tested how tables behave in branches. In this section you'll learn how [files](/storage/files/) behave in development branches. 

In the `Sample branch` run the same Python transformation you prepared in the production earlier.

## Run the transformation in development branch 

In your development branch, go to **Transformations**, select the transformation `Sample Python transformation` and run it.

{: .image-popup}
![Screenshot - Run Transformation in Development Branch](/tutorial/branches/figures/python-branch-overview.png)

## File Tags
When the job finishes, go to **Storage -- Files**. You can see that the `demoFile.txt` was created but is was not
assigned the tag `demoOutput`. It was assigned the tag `1835-demoOutput` instead. The prefix `1835` is the ID of
this branch. You can also see the ID in the URL. This is how the development branch files are distinguished from
the files that were created in the production environment.

{: .image-popup}
![Screenshot - Development Branch Output](/tutorial/branches/figures/12-dev-branch-output.png)

## Change Configuration
Now it’s time to make the changes to the transformation and test them. Go to
**Transformations** find `Sample Python transformation` and change the *Hello world* code in `Block 1`. 

{% highlight python %}
{% raw %}
f = open("out/files/demoFile.txt", "a")
f.write("Hello World!")
f.close ()

print("Output written to demoFile.txt")
{% endraw %}
{% endhighlight %}

{: .image-popup}
![Screenshot - Edit Code Block](/tutorial/branches/figures/python-branch-change-code.png)

The transformation will do exactly the same as before, but it will add `Output written to demoFile.txt` to
the output log. Save the code block and run the transformation again.

You can see in the job log that it did indeed output the log message. 

{: .image-popup}
![Screenshot - Job Log](/tutorial/branches/figures/14-jobs-log.png)

The file was uploaded to Storage again.

## Switch Back to Production
Let’s go back to production to see that by changing the transformation in the development branch, we did not
affect the production transformation in any way.

Go to **Transformations**, open the `Sample Python transformation` transformation and check the code block to see that there is still the original version without the log output that we created at the beginning. It was not overwritten by the changes we made in the development
branch.

{: .image-popup}
![Screenshot - Check Variable In Production](/tutorial/branches/figures/20-check-block1.png)

To make sure nothing has changed, run the transformation in production again. When it finishes, go to **Storage --
Files**. You can see that `demoFile.txt` was created. Because it ran in production, it was assigned the
tag `demoOutput` without any prefix.

{: .image-popup}
![Screenshot - Storage File in Production](/tutorial/branches/figures/21-storage-files-prod.png)

This concludes the file manipulation part of this tutorial. You examined how files behave in branches. You can continue to the next part - [examining the changes made in branch](/tutorial/branches/project-diff). 
