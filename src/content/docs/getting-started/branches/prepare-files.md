---
title: 'Prepare File-Manipulating Configurations'
slug: 'getting-started/branches/prepare-files'
description: "Set up the file-manipulating configurations used by the development branches walkthrough: a Python transformation that writes files to Storage."
redirect_from:
  - /tutorial/branches/prepare-files/
---



In the [previous part](/getting-started/branches/prepare-tables/) of our tutorial on using development branches, you prepared 
production configurations that manipulate tables. Now you will create the production configurations that work 
with [files](/storage/files/). 

## Create Transformation
Let's create a production Python transformation with a simple code first. In your testing project, 
create a new **Python** transformation and name it `Sample Python transformation`.

![Screenshot - Create Transformation](/getting-started/branches/figures/01-new-transformation.png)

Add a new code in `Block 1` named `Hello world`, insert the following code, and save it. 

```python

f = open("out/files/demoFile.txt", "a")
f.write("Hello World!")
f.close ()

```

![Screenshot - New codeblock](/getting-started/branches/figures/python-new-codeblock.png)

## Set Output Mapping
Now go to the section **File Output Mapping** and click **New File Output**. Because the output of the
transformation will be the file `demoFile.txt`, let’s set it as *Source* and `demoOutput` as *Tags*. This means
that the output will be stored in Storage as `demoFile.txt` with the tag `demoOutput`. Click **Add File Output**.

![Screenshot - Set Output Mapping](/getting-started/branches/figures/05-output-mapping.png)

Here is the finished transformation.

![Screenshot - Python transformation overview](/getting-started/branches/figures/python-prod-overview.png)

## Run Transformation
Now run the component. After the job is finished, go to **Storage -- Files**, where you can see 
the file `demoFile.txt` generated.

![Screenshot - Generated File](/getting-started/branches/figures/07-generated-file.png)

At this point, you have everything ready. You created production configurations for both tables and files. 
It is time to take the next step:

- Learn how [tables](/getting-started/branches/tables-in-branch/) work in branches.
- Learn how [files](/getting-started/branches/files-in-branch/) work in branches.    
