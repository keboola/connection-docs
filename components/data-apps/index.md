---
title: Data Apps
permalink: /components/data-apps/
---

* TOC
{:toc}

{% include warning.html content="This feature is in public beta. All data apps are terminated at midnight." %}

## Overview
Data apps are simple, interactive web applications that use data to deliver insight or automatically take action.
They are usually custom-tailored to tackle a specific problem and enable a dynamic, purpose-built user experience.

Examples of data apps include recommendation engines, interactive segmentation, AI integration, data visualization, 
customized internal reporting tools for business teams, financial apps to get insights on your spend patterns, etc.

Data apps may be written in any language. However, for now Keboola only supports apps written in [Streamlit](https://streamlit.io/), 
which is a Python framework for rapid development of such applications.

As mentioned above, a data app is a simple web application, which can be deployed inside a Keboola Connection project 
and also publicly accessed from outside the project. 
It means that the users that will access your data app don't need access to a Keboola Connection project.

## Create a Data App
There are two ways to create a data app in Keboola Connection. Select a deployment type that will suit your needs:
- **Code** – Just paste a Streamlit code to create a simple data app. 
- **Git repository** – Specify a git repository with Streamlit app sources. This is more suitable for complex applications.

{: .image-popup}
![Code - main menu](/components/data-apps/data apps - main menu.png)

### Code
For simple use cases, where your Streamlit code fits into one page, paste the code directly into a text area. 
This deployment type is ideal for very simple apps or for testing. Check out our [Titanic Demo App](https://demo.keboola.com/app/data-apps/45663441) or [this example from Streamlit docs](https://docs.streamlit.io/library/get-started/create-an-app#lets-put-it-all-together).

{: .image-popup}
![Code - code](/components/data-apps/data apps - hello world - code.png)

#### Packages
To use additional packages that are not already in our [Streamlit Base Image](#Base Image), enter them into the field Packages.

{: .image-popup}
![Packages](/components/data-apps/data apps - packages.png)

### Git Repository
{% include warning.html content="In BETA, we only support GitHub repositories. <br />Also, we only support MAIN as the main branch, not MASTER." %}

To provide feedback, use the feedback button in your project.
If you have a complex application, push your app sources into GitHub and link the repository in this section.
Provide the Project URL, choose the right branch, and finally, select your main entrypoint file.

{: .image-popup}
![Git repository](/components/data-apps/data apps - git repository.png)

## Secrets
To provide your app with environment variables or sensitive information like credentials, API keys etc., enter them as key value pairs in the section Secrets.
These secrets will be injected into the secrets.toml file upon deployment of the app. 
[Read more about the Streamlit secrets](https://docs.streamlit.io/streamlit-community-cloud/get-started/deploy-an-app/connect-to-data-sources/secrets-management).

{: .image-popup}
![Secrets](/components/data-apps/data apps - secrets.png)

## Loading Data from Storage
To load data from the storage of a Keboola Connection project into the app, use the [input mapping](https://help.keboola.com/transformations/mappings/#input-mapping) section.
Just select your table in the input mapping section and navigate to that by /data/in/table/your_data.csv or /data/in/files/fileID_FileName.* in your code.
(Note that, while in BETA, the app needs to be redeployed to fetch up-to-date data.)
<br />
Or you can use [Keboola Connection Storage Python Client](https://github.com/keboola/sapi-python-client) in the app to load the data as needed.
See the [examples](#Examples) below for usage of the Keboola Storage Python Client.

## Writing Back to Storage
For writing data back to Keboola Connection Project Storage, use our [Keboola Connection Storage Python Client](https://github.com/keboola/sapi-python-client).
See [Examples](#Examples) below for usage of the Keboola Storage Python Client.

## Deployment and App Management

{% include warning.html content="Once the data app is deployed, its URL will be publicly available! Keboola does not provide authorization to data apps out of the box yet." %}

### Authorization
We recommend incorporating some sort of authorization into your app—for example, the Streamlit authenticator. Check out the [Streamlit authenticator tutorial](https://blog.streamlit.io/streamlit-authenticator-part-1-adding-an-authentication-component-to-your-app/) or take a look at [our example](https://github.com/KB-PS/mkt-bi-ocr/blob/master/Select_Invoices.py).

### Base Image
When the app is deployed, the code specified in one of the deployment methods will be injected into our [base Streamlit docker image](https://github.com/keboola/sandbox-streamlit/blob/main/Dockerfile). 
This image already has Streamlit and a few other basic packages pre-installed.

### Actions Menu

- **Deploy Data App** – starts the data app. Once the deployment job is finished, you can go to the data app public URL by clicking **Open Data App**.
- **Open Data App** – opens a new window with your data app.
- **Redeploy** – if you made changes in the data app configuration, you have to redeploy it for the changes to take effect.
- **Terminate Data App** – stops the data app. The container in which the application is running will be stopped, and the app's URL will no longer be available. The configuration of the app will remain intact.
- **Delete Data App** – stops the data app deployment and deletes its configuration.

### Debugging App Deployment
If the data app's deployment job fails, you can see the logs from its container in the events log of the deployment job.  
For example, a conflict of the specified packages:

{: .image-popup}
![Secrets](/components/data-apps/data apps - job error log.png)

## Example Data Apps

### Titanic Demo App
Author: Monika Feigler

Our demo data app shows how to create a data app with Streamlit Python code and how to incorporate data and files from an input mapping into your code. This data app allows users to explore and analyze the Titanic dataset using interactive visualizations and filters.
- [Configuration](https://demo.keboola.com/app/data-apps/45663441)

### Customer Segmentation
Author: Kritiga Ravishankar

This app allows users to assess the current segments, edit the segments, and also create new customer segments.
- [Live](https://customer-segmentator.streamlit.app/) 
- [Source](https://github.com/kritiga9/mktbi_customer_segmentation)

### CEO KPIs
Author: Ondřej Svoboda

This app provides an interactive display of several business metrics with integrated Slack and Jira notifications.
- [Live](https://kb-ps-ceo-kpis-streamlit-app-6tv06z.streamlit.app/)
- [Source](https://github.com/KB-PS/CEO-KPIs)

### Bottom-Up Modelling
Author: Kritiga Ravishankar

This app allows users to forecast the earning potential by bottom-up modelling.
- [Live](https://empower-bottom-up-modelling.streamlit.app/)
- [Source](https://github.com/kritiga9/bottom_up_modelling)
