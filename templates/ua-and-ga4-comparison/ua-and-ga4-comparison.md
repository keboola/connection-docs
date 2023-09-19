---
title: UA and GA4 Comparison
permalink: /templates/ua-and-ga4-comparison/
---

* TOC
{:toc}

The Google Analytics comparison template is designed to give a quick and comprehensive overview of the differences 
between data gathered by the Universal Analytics (UA) tool by Google compared to the new Google Analytics 4 (GA4). 

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

[
{: .image-popup}
![Flow 1](/templates/ua-and-ga4-comparison/required-configurations.png)
]: #

{: .image-popup}
![Flow 2](/templates/ua-and-ga4-comparison/required-configurations2.png)

1. **Data extractions** – First, you will authorize the Universal Analytics data source (extractor) and one of the or both following sources: GA4 API and/or GA4 from the Big Query database. They will provide all available data. For more details, see the section [Data Sources](/templates/ua-and-ga4-comparison/#authorizing-data-sources) below.

2. **Snowflake SQL** – Then the data will be prepared so it can be sent to the data app.

3. **Data app deployment** – The data app will download data from Universal Analytics and one or two additional data sources, and it will integrate it.

Once you authorize the Universal Analytics data source and at least one GA4 data source, click **Configure** in the data app. Then tick the checkbox 
**Let’s do it** to run the app.

{: .image-popup}
![Configure Data App](/templates/ua-and-ga4-comparison/save-config.png)

## Data Sources
The following data sources are available:

- [Universal Analytics]()
- [Google Analytics 4]()
- [Google BigQuery]()

## Authorizing Data Sources
You must authorize at least two data sources. 

**Important:** We use the Google Analytics component for both Universal Analytics (formerly GA3) and Google Analytics 4. 
Therefore, it's essential to be cautious about which component you are authorizing.

### Universal Analytics

### Google Analytics 4

### Google BigQuery
