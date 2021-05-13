---
title: Prepare File Manipulating Configurations
permalink: /tutorial/branches/prepare-files/
---

* TOC
{:toc}

In the [previous part](/tutorial/branches/prepare-tables/) of our tutorial on using development branches, you prepared 
production configurations that manipulate tables. Now you will create the production configurations that work 
with [files](/storage/files/). 

## Create Transformation
Let's create a production Python transformation with a simple code first. In your testing project, 
create a new **Python** transformation and name it `Sample Python transformation`.

{: .image-popup}
![Screenshot - Create Transformation](/tutorial/branches/figures/01-new-transformation.png)

Add a new code in `Block 1` named `Hello world`, insert the following code, and save it. 

{% highlight python %}
{% raw %}
f = open("out/files/demoFile.txt", "a")
f.write("Hello World!")
f.close ()
{% endraw %}
{% endhighlight %}

{: .image-popup}
![Screenshot - New codeblock](/tutorial/branches/figures/python-new-codeblock.png)

## Set Output Mapping
Now go to the section **File Output Mapping** and click **New File Output**. Because the output of the
transformation will be the file `demoFile.txt`, let’s set it as *Source* and `demoOutput` as *Tags*. This means
that the output will be stored in Storage as `demoFile.txt` with the tag `demoOutput`. Click **Add File Output**.

{: .image-popup}
![Screenshot - Set Output Mapping](/tutorial/branches/figures/05-output-mapping.png)

Here is the finished transformation.

{: .image-popup}
![Screenshot - Python transformation overview](/tutorial/branches/figures/python-prod-overview.png)

## Run Transformation
Now run the component. After the job is finished, go to **Storage -- Files**, where you can see 
the file `demoFile.txt` generated.

{: .image-popup}
![Screenshot - Generated File](/tutorial/branches/figures/07-generated-file.png)

At this point, you have everything ready. You created production configurations for both tables and files. 
It is time to take the next step:

- Learn how [tables](/tutorial/branches/tables-in-branch/) work in branches.
- Learn how [files](/tutorial/branches/files-in-branch/) work in branches.    
