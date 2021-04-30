---
title: Prepare file manipulating configurations
permalink: /tutorial/branches/prepare-files/
---

* TOC
{:toc}

In the [previous section](/tutorial/branches/prepare-tables/) you prepared production configurations that manipulate tables. In this section you'll create the production configurations that work with [files](/storage/files/). 

## Prepare the production configurations
You'll create a production Python transformation with a code that works with files. 

You'll create a production Python transformation with a simple code first. 

##  Create Transformation
In your testing project, create a new **Python** transformation and name it `Sample Python transformation`.

{: .image-popup}
![Screenshot - Create Transformation](/tutorial/branches/figures/01-new-transformation.png)

Add a new code in `Block 1` named `Hello world`, insert the following code and save it. 

{% highlight python %}
{% raw %}
f = open("out/files/demoFile.txt", "a")
f.write("Hello World!")
f.close ()
{% endraw %}
{% endhighlight %}

{: .image-popup}
![Screenshot - New codeblock](/tutorial/branches/figures/python-new-codeblock.png)

### Set Output Mapping
Now go to the section **File Output Mapping** and click **New File Output**. And because the output of the
transformation will be the file `demoFile.txt`, let’s set it as *Source* and `demoOutput` as *Tags*. This means
that the output will be stored in Storage as `demoFile.txt` with the tag `demoOutput`. Click **Add File Output**.

{: .image-popup}
![Screenshot - Set Output Mapping](/tutorial/branches/figures/05-output-mapping.png)

Here is the finished transformation.

{: .image-popup}
![Screenshot - Python transformation overview](/tutorial/branches/figures/python-prod-overview.png)

## Run Transformation
Let’s run the component.

After the job is finished, go to **Storage -- Files**, where you can see the file `demoFile.txt` generated.

{: .image-popup}
![Screenshot - Generated File](/tutorial/branches/figures/07-generated-file.png)

Now you have everything ready, you created production configurations for both tables and files. You can proceed to the next step - [working with tables in a branch](/tutorial/branches/tables-in-branch/) where you first learn how tables work in branches. Then in the following section you'll learn [how files work in branch](/tutorial/branches/files-in-branch/).   
