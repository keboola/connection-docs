---
title: Media Cashflow
permalink: /templates/media-cashflow/
---

* TOC
{:toc}

This template combines data from various platforms (ECB currency rates, Meta, Google Ads, LinkedIn, TikTok, Sklik, etc.), transforms and joins them 
into a single data model for further deployment into a Data App where users can see and filter expenses by clients, identify upcoming payments or 
change budgets for campaigns.

In this section, we will provide you with instructions on how to build the Media Cashflow app using a pre-defined template. To learn more about how templates work, 
please refer to [this page](https://help.keboola.com/templates/). For more information on how data apps function and how to set them up, 
please refer to [this page](https://help.keboola.com/components/data-apps/).

To begin, click on **Templates** in the top menu and then select **Add Template**.

{: .image-popup}
![Add New Template](/templates/dedia-cashflow/add-template.png)

This will take you to the list of all available templates. Among the various categories available, we will focus on the Data App templates for our case. 
To do this, check the category for data app templates and obtain the list. From this list, select `**Marketing Cashflow** and click on **Use Template**.

{: .image-popup}
![Add New Template – Data Apps](/templates/media-cashflow/new-template-data-apps.png)

You will then be directed to the main Template page, where all components used are listed, and you can find a general description of the Template itself. Click “Use Template” to actually start using it - just name the template as you like and click Next step.



You will arrive at the page where you can configure the template itself.



Data extractions - in the first section, you will select one or multiple data sources (extractors) that will provide all available data. See more details in the section “Data Sources” below.
Snowflake SQL - prepares all data to be sent to the Data App.
Data App Deployment - This Data App (third section) visualizes the campaign spending across various advertising platforms. It displays both the total budget and the budget spend per client on different advertising platforms. Additionally, the app provides users with the capability to input or modify budgets for specific clients and choose the advertising platforms for which the specific budget will be applied. These changes are promptly saved to storage and become accessible for subsequent data refreshes from advertising campaigns

Once you authorise at least one data source, click “Configure” in the Data App box to run it. You will need to provide your Keboola Token to do so. Once you enter it, you can save the configuration which will allow you to use the app itself.


Data Sources
Below, you can find more details on the data sources used and also on how to authorize them.

ECB Currency Rates
Facebook Ads
Google Ads
LinkedIn Ads
Sklik
TikTok Ads

Authorizing Data Sources
To use a selected data source component, you must first authorize the data source. You need to use at least one of the following marketing data sources.
Facebook Ads

Log into Facebook with redirection from this step and allow Keboola Connection to access the data.
From the list of accounts select the accounts from which you want to download data.
Google Ads

Authorize your Google account and select the period for extracting the data.


LinkedIn Ads

Authorize your LinkedIn account and then fill in the start and end dates following the example.
Sklik

Authorize the Sklik account using the Sklik Api token and define a list of account IDs to download. Find more details in the documentation. 

TikTok Ads

To access data from your TikTok account, authorize your account and define rows you want to use. Find more details in the documentation. 

How to use the Data App
Setting up the Data App



Deployment Type - Git repository is used for this Data App
Data App Repository - To run the App from the Template, just use the Git repository - you can use the one which is used as an example or you can use your own Git repository. In order to run the App successfully you need to fill in all necessary fields (Project URL, Username, Access Token, Branch, Main File Path). 
Secrets - To provide your app with environment variables or sensitive information like credentials, API keys etc., enter them as key value pairs in the section Secrets. These secrets will be injected into the secrets.toml file upon deployment of the app.
Table/File Input Mapping - Just select table or files in the input mapping section
(Re)Deploy Data App - once everything is set up, just click

When you need to go back to modify or view the Data App, you can find it under Components > Data App. Simply search for your Data App.

Using the Data App

The Data App combines budget plans and actual expenditures from various campaigns across different platforms using interactive Data App. This app allows you to monitor campaign spending effortlessly and filter expenses by clients. Moreover, you can conveniently adjust the budget allocated for each campaign, ensuring optimal resource allocation and enhanced campaign performance.
