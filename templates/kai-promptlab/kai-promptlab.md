---
title: Kai PromptLab
permalink: /templates/kai-promptlab/
---

* TOC
{:toc}

PromptLab is a one-stop solution for enhancing AI interactions. Designed with Streamlit, this application empowers you to **refine prompts automatically** 
for optimal clarity and precision. 

Beyond mere improvements, you can also **test and compare** the outcomes of multiple prompts side by side. By leveraging PromptLab's intuitive interface, 
users can quickly identify which prompts yield the best results, streamlining their workflows.

**The flow, in a nutshell:**

The template contains one flow only. It consists of a single component, a data app that serves as an interface for the user. The app is connected to 
a specific bucket/table within Keboola via an API and provides the option for query tuning.

## How to Use Template
The process is simple. We will guide you through it. 

First, select the corresponding template (Kay PromptLab) from the **Templates** tab in your Keboola project. When you are done, click **+ Use Template.**

{: .image-popup}
![Add New Template](/templates/kai-promptlab/add-new-template.png)

This page contains information about the template. Click **+ Use Template** again.

{: .image-popup}
![Kai PromptLab Template](/templates/kai-promptlab/kai-promptlab-template.png)

You’ll be asked to write a name for the template configuration you are about to create. 
You can use the template as many times as you want and still keep everything organized.

{: .image-popup}
![Name Kai PromptLab Template](/templates/kai-promptlab/name-template.png)

As mentioned above, the flow contains only one component, which is a data app. The app is already pre-defined for you, 
and you do not need to change any further settings.

{: .image-popup}
![New Data App](/templates/kai-promptlab/new-data-app.png)

When you are finished, click **Save** in the top right corner. The template builder will create your new configuration, and when it is done, 
you will see the newly created flow.

Click **Run Template** and start building your visualizations a few minutes later.

## How to Use PromptLab Data App
Once the flow is set up and running, you can view the data app under **Components > Data App**. Here, you can simply search for your data app and then open it by clicking on its name. On the page of the data app configuration you will first need to click on **Deploy Data App** button on the right side of the page. Once the app is deployed, another button will appear just below the one you clicked: **Open Data App**. 

{: .image-popup}
![Add Data App](/templates/kai-promptlab/add-data-app.png)

Upon launching the data app, you will be prompted to enter the OpenAI API Key, which you can generate in your OpenAI account. 
To authenticate, you will also need to enter your Keboola API token, which can be found in your **Account Settings** in the Keboola platform. 

For more information about Keboola API tokens, please refer to the [documentation](https://help.keboola.com/management/project/tokens/). 
Once you have entered both required API tokens, click **Connect**. 

The metadata for the account will be loaded, and you can either select from the drop-down menu or search within the bucket you wish to work with. 
Then click **Select Bucket**.

