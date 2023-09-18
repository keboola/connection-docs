---
title: Interactive KPI Reporting
permalink: /templates/interactive-kpi-reporting/
---

* TOC
{:toc}

Utilizing the Interactive KPI Reports powered by Shopify data provides a comprehensive overview of critical financial metrics, including turnover, 
orders, and customer data. These insights are presented through a pre-defined data app dashboard equipped with a date filter for your convenience. 

The dashboards show a comparison of planned numbers and actual situation. Moreover, the data app facilitates effortless parameter sharing, enabling seamless
integration with Slack for quick communication. 

With all your data centralized in a single table and location, the need for manual data collection across multiple systems is eliminated, 
thanks to the automated capabilities of Keboola Connection. Simplify your data management with ease.

{: .image-popup}
![Required Configuration](/templates/interactive-kpi-reporting/required-config.png)

**The flow in a nutshell:**
Be aware, the template consists of two separate flows. First flow serves for building the interactive dashboards based on data extracted and transformed from Shopify. The second flow is triggered once the user wants to send any of the data from the interactive dashboard into the Slack. Then the second flow takes over.
First you will authorize the component to extract data from your Shopify account. 
To prepare the data, an SQL transformation is ready to take over and create a table needed for the Data App
The data is then sent into the Data App, where it will be available to the users for viewing and date filtering.
Last but not least you will need to authorize the Data Destination component that will be sending the outputs to Slack once the user decides to send any data from the dashboards.
Flow 1:

{: .image-popup}
![Flow 1](/templates/interactive-kpi-reporting/flow1.png)

Flow 2:

{: .image-popup}
![Flow 2](/templates/interactive-kpi-reporting/flow2.png)

## Entity Relationship Diagram
An entity-relationship diagram is a specialized graphic that illustrates the relationships between entities in a data destination.

{: .image-popup}
![Entity Relationship Diagram](/templates/interactive-kpi-reporting/entity-rel-diagram.png)

## Table Description
Name / Description
ORDER - contains data about the orders, such as the last update, current price of the order and a financial status of the given order (paid/refunded etc.).
CUSTOMER - contains data of the last id of the last order (last_order_id) and a date stamp of the last update (updated_at).

## Data Sources
This data source is available:

[Shopify](https://components.keboola.com/components/kds-team.ex-shopify)

## Data Destinations
The following data destination is available:

[Slack](https://slack.com/)

## How to Use Template
The process is simple. We will guide you through it, and, when needed, ask you to provide your credentials and authorize the destination component.
First decide which data source and which data destination you want to use. Then select the corresponding template from the Templates tab in your Keboola Connection project. When you are done, click + Use Template.

{: .image-popup}
![Add New Template](/templates/interactive-kpi-reporting/add-new-template.png)

This page contains information about the template. Click + Use Template again.

{: .image-popup}
![Interactive KPI Report Template](/templates/interactive-kpi-reporting/int-kpi-report.png)

You’ll be asked to write a name for the template instance you are about to create. You can use the template as many times as you want and still keep everything organized.

{: .image-popup}
![Name Template Instance](/templates/interactive-kpi-reporting/name-template.png)

After clicking **Next Step**, you will see the template builder. Fill in all needed credentials and perform the required OAuth authorizations.

**Important:** Make sure to follow all the steps very carefully to prevent the newly created flow from failing because of any user authorization problems. 
If you are struggling with this part, go to the section [Authorizing Data Destinations](/templates/interactive-kpi-reporting/#authorizing-data-destinations) below.

When you are finished, click **Save** in the top right corner. The template builder will create your new configuration, and when it is done, 
you will see the newly created flow. Click **Run Template** and start building your visualizations a few minutes later.

{: .image-popup}
![Flow 1 Interactive KPI Report](/templates/interactive-kpi-reporting/flow1-report.png)

## Use Data App with Interactive KPI Reporting
To utilize this template fully, you’ll want to set up also the data app, which visualizes the data. The app is already pre-defined. 

In order to start, simply select this template from the list, and then click **Use Template**. This will guide you to a page where all the details 
related to this template are described. From here, click **Use Template** once more, give it a name, and click **Next Step**.

{: .image-popup}
![Name Interactive KPI Report](/templates/interactive-kpi-reporting/name-int-kpi-report.png)

This will take you to the page where you can set up the template containing the data app configuration. Here, you will need to provide credentials for the data sources and data destinations you want to use. Once you have completed this step, you can launch your data app using this template.

{: .image-popup}
![Interactive KPI Report PS](/templates/interactive-kpi-reporting/int-kpi-report-ps.png)

A data app has been created. You can also find its details in the section **Components – Data Apps**, where you can always edit the data apps you have created.

Below, you can see a screenshot of the data app created from the Interactive KPI Report template. Don’t worry, when configuring the app 
for the Interactive KPI Report, you only need to insert the Keboola Token in the dialog box displayed on the screenshot below and save the configuration.

{: .image-popup}
![Interactive KPI Report – Keboola Token](/templates/interactive-kpi-reporting/keboola-token.png)

{: .image-popup}
![Performance Indicators](/templates/interactive-kpi-reporting/performance-indicators.png)

Now you are ready to go. The template is up and running and the interactive dashboards are ready for the users. 
The URL of the data app can be found in the section **Components > Data Apps** where you can look up the app according to the name you have named it. 

After opening the data app, you can see the link to its UI on the right side of the screen. 

{: .image-popup}
![Opening Data App](/templates/interactive-kpi-reporting/opening-app.png)

## Authorizing Data Sources
To use a selected data source component, you must first authorize the data source. 

### Shopify

{: .image-popup}
![Shopify Data Source](/templates/interactive-kpi-reporting/shopify-source.png)

You will be asked to fill a few details from your Shopify account in order to authorize the connection between Keboola and Shopify. 

First, you will need the Admin API access token. 
You can generate it easily using 
the [Shopify documentation](https://www.shopify.com/partners/blog/17056443-how-to-generate-a-shopify-api-token). 
The shop name can be found in the Account Settings after signing up to your Shopify account. 

You can also customize the date coverage you wish to extract into Keboola. For more details related to setting up the Shopify account, 
please refer to the [component documentation](https://components.keboola.com/components/kds-team.ex-shopify).

## Authorizing Data Destinations
Make sure to authorize the data destination.

### Slack
In order to set up the connector to Slack, you will only need to insert your [Slack Token](https://api.slack.com/authentication/token-types) 
and click **Save Configuration**.

{: .image-popup}
![Slack Data Destination](/templates/interactive-kpi-reporting/slack-destination.png)

