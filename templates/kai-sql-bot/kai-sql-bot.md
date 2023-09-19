---
title: Kai SQL Bot
permalink: /templates/kai-sql-bot/
---

* TOC
{:toc}

The SQL Bot data app is a **dialogue-based AI interface tailored for Snowflake database queries**. It allows you to engage in natural conversations 
and translates your requests into precise SQL commands. 

Ideal for both SQL novices and experts, this app revolutionizes the way you interact with your data and replaces traditional querying methods with **real-time, 
AI-assisted data insights**. You can now dive into your Snowflake data with ease and efficiency like never before.

We will guide you through the process of building the UA and GA4 Comparison app using a predefined template. 

To learn more about how templates work, please refer to [this page](https://help.keboola.com/templates/). 
For more information on how data apps work and how to set them up, please visit [this page](https://help.keboola.com/components/data-apps/).

## How to Use Template
To begin, click on **Templates** in the top menu, and then select **Add Template**.

{: .image-popup}
![Add New Template](/templates/kai-sql-bot/add-template.png)

This will take you to the list of all available templates. Check the box for data app templates and view the list that appears. 
From this list, select **UA and GA4 Comparison** and click on **Use Template**.

{: .image-popup}
![New Template – Data Apps](/templates/kai-sql-bot/new-template-data-apps.png)

You will then be directed to the main **Template** page, where all the components used are listed. Here, you can also find a general description of the template. 

Click **Use Template** to begin. Name the template, and click **Next Step**.

{: .image-popup}
![Name Template](/templates/kai-sql-bot/name-template.png)

Then you will configure the template:

{: .image-popup}
![Flow 2](/templates/kai-sql-bot/required-config.png)

Click **Configure** and provide all the necessary information. Refer to the screenshot below for more details.

{: .image-popup}
![Configure Kai SQL Bot](/templates/kai-sql-bot/configure-bot.png)

Once you have entered all required credentials, click **Save** to run the data app.

## Setting Up Data App
{: .image-popup}
![Setting Up Data App](/templates/kai-sql-bot/configuring-app.png)

**Deployment Type** – A Git repository is used for this data app.

**Data App Repository** – To run the app from the template, use the Git repository. You can either use the one provided as an example 
or utilize your own Git repository. In order to run the app successfully, you need to fill in all necessary fields: Project URL, Username, Access Token, 
Branch, and Main File Path. 

**Secrets** – To provide your app with environment variables or sensitive information like credentials, API keys etc., enter them as key-value pairs 
in the section **Secrets**. These secrets will be injected into the `secrets.toml` file upon deployment of the app.

**Table/File Input Mapping** – Select a table or files in the input mapping section.

**(Re)deploy Data App** – Once everything is set up, simply click **Deploy Data App** (or **Redeploy Data App**).

To **modify or view the data app**, you can find it under **Components > Data App**. 

## Using Data App

{: .image-popup}
![Using Data App](/templates/kai-sql-bot/using-app.png)

Simply ask questions in natural language, and watch as the bot translates them into precise SQL commands. 
Whether you're a beginner or an expert, this app streamlines data access, enabling real-time insights.

