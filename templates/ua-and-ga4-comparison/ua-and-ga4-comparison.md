---
title: UA and GA4 Comparison
permalink: /templates/ua-and-ga4-comparison/
---

* TOC
{:toc}

The Google Analytics comparison template is designed to provide a quick and comprehensive overview of the differences between data gathered 
by Google's Universal Analytics (UA) and Google Analytics 4 (GA4). 

We will guide you through the process of building the UA and GA4 Comparison app using a predefined template. 
To learn more about how templates work, please refer to [this page](https://help.keboola.com/templates/). 
For more information on how data apps work and how to set them up, please visit [this page](https://help.keboola.com/components/data-apps/).

## How to Use Template
To begin, click on **Templates** in the top menu, and then select **Add Template**.

{: .image-popup}
![Add New Template](/templates/ua-and-ga4-comparison/add-template.png)

This will take you to the list of all available templates. Among the various categories available, we will focus on the data app templates for our case. 
To do so, check the box for data app templates and view the list that appears. From this list, select **UA and GA4 Comparison** and click on **Use Template**.

{: .image-popup}
![New Template – Data Apps](/templates/ua-and-ga4-comparison/new-template-data-apps.png)

You will then be directed to the main **Template** page, where all the components used are listed. Here, you can also find a general description of the Template. 
Click **Use Template** to begin. Name the template, and click **Next Step**.

{: .image-popup}
![Name Template](/templates/ua-and-ga4-comparison/name-template.png)

Then you will configure the template:

{: .image-popup}
![Flow 2](/templates/ua-and-ga4-comparison/required-configurations2.png)

1. **Data extractions** – First, you will authorize the Universal Analytics data source (extractor) and at least one of the following two sources: GA4 API and/or GA4 from the BigQuery database. They will provide all available data. For more details, see the [Data Sources](/templates/ua-and-ga4-comparison/#authorizing-data-sources) section below.

2. **Snowflake SQL** – Then, the data will be prepared so that it can be sent to the data app.

3. **Data app deployment** – The data app will download data from Universal Analytics and one or two additional sources, integrating them thereafter.

Once you have authorized the Universal Analytics data source and at least one GA4 data source, click **Configure** in the data app. Then, tick the checkbox 
**Let’s Do It** to run the app.

{: .image-popup}
![Configure Data App](/templates/ua-and-ga4-comparison/save-config.png)

## Authorizing Data Sources
The following data sources are available:

- [Universal Analytics](https://support.google.com/analytics/answer/2790010?hl=en)
- [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4)
- [Google BigQuery](https://cloud.google.com/bigquery/)

Apart from Universal Analytics, you must authorize at least more data source.

**Important:** We use the Google Analytics component for both Universal Analytics (formerly GA3) and Google Analytics 4. 
Therefore, it's essential to exercise caution when determining which component you are authorizing.

### Universal Analytics
Please authorize your Universal Analytics account (formerly known as GA3), and select the period for data extraction.

{: .image-popup}
![Authorize Data Source](/templates/ua-and-ga4-comparison/universal-analytics.png)

### Google Analytics 4
Please authorize your Google Analytics 4 account.

{: .image-popup}
![Authorize Data Source GA4](/templates/ua-and-ga4-comparison/ga4.png)

### Google BigQuery
Please authorize your Google BigQuery account. To create a new JSON key, follow this [guide](https://help.keboola.com/components/writers/database/bigquery/).

{: .image-popup}
![Authorize Data Source BigQuery](/templates/ua-and-ga4-comparison/bigquery.png)

## Setting Up Data App
{: .image-popup}
![Setting Up Data App](/templates/ua-and-ga4-comparison/configuring-app.png)

**Deployment Type** – A Git repository is used for this data app.

**Data App Repository** – To run the app from the template, use the Git repository. You can either use the one provided as an example 
or utilize your own Git repository. In order to run the app successfully, you need to fill in all necessary fields: Project URL, Username, Access Token, 
Branch, and Main File Path. 

**Secrets** – To provide your app with environment variables or sensitive information like credentials, API keys etc., enter them as key-value pairs 
in the section **Secrets**. These secrets will be injected into the `secrets.toml` file upon deployment of the app.

**Table/File Input Mapping** – Select a table or files in the input mapping section

**(Re)deploy Data App** – Once everything is set up, simply click **Deploy Data App** (or **Redeploy Data App**).

To **modify or view the data app**, you can find it under **Components > Data App**. 

## Using Data App

{: .image-popup}
![Using Data App](/templates/ua-and-ga4-comparison/using-app.png)

This data application enables business users to compare the performance of Google Universal Analytics (GA UA) and Google Analytics 4 (GA4). 

You can filter analytics data by date range, traffic source, medium, and campaign. The application then generates interactive line charts, 
offering a visual comparison of key metrics like Users, Sessions, and Transactions between GA UA and GA4. Additionally, it presents a grouped bar chart 
that recalculates specific GA4 metrics to align with the GA UA methodology.

## Most Common Errors
Before turning to the Keboola support team for help, make sure your error is not a common problem that can be solved without our help.

### Authorizing AU instead of GA4
**Important:** As mentioned above, we currently use the Google Analytics component for both Universal Analytics (formerly known as GA 3) and Google Analytics 4. 
Therefore, it's essential to exercise caution when determining which component you are authorizing.

If you accidentally authorize Google Analytics 4 with a Universal Analytics (formerly GA 3) account by mistake, you will see the following error message:

{: .image-popup}
![Error Message](/templates/ua-and-ga4-comparison/job-error.png)

To fix the error, authorize Google Analytics 4 with the corresponding account.
