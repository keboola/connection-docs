---
title: Data Apps
permalink: /components/data-apps/
---

{% include warning.html content="This feature is in public BETA. All Data Apps are terminated on midnight." %}

* TOC
{:toc}

## Overview
Data Apps are simple, interactive web applications that use data to deliver insight or automatically take action.
This type of application is usually custom tailored to tackle a specific problem and entails a dynamic, purpose-built user experience.

Some examples of data apps could be recommendation engines, interactive segmentation, AI integration, data visualization, 
customized internal reporting tools for business teams, financial app to get insights on your spend patterns etc.

Data Apps could be written in any language, but for now Keboola only supports apps written in [Streamlit](https://streamlit.io/), 
which is Python framework for rapid development of such applications.

As mentioned above, Data App is a simple web application, which can be deployed inside a Keboola Project 
and can publicly accessible also from outside the project. 
Meaning that the users accessing your Data App don't need access to a Keboola project.

## Create a Data App
There are two ways how to create a Data App in Keboola. Choose deployment type which suits your needs:
- **Code** - Just paste a Streamlit code to create a simple Data App. 
- **Git repository** - Specify git repository with Streamlit app sources. More suitable for complex applications.

{: .image-popup}
![Code - main menu](/components/data-apps/data apps - main menu.png)

### Code
For a simple use-cases, where your Streamlit code fits into a one page, paste the code directly into a textarea. 
Ideal for very simple apps or testing things. Check out our [Titanic Demo App](https://demo.keboola.com/app/data-apps/45663441) or [this example from Streamlit docs](https://docs.streamlit.io/library/get-started/create-an-app#lets-put-it-all-together).

{: .image-popup}
![Code - code](/components/data-apps/data apps - hello world - code.png)

#### Packages
To use additional packages, which are not already in our [Streamlit Base Image](#Base Image), enter it into the Packages field.

{: .image-popup}
![Packages](/components/data-apps/data apps - packages.png)

### Git repository
{% include warning.html content="In BETA we only support Github repositories. <br />Also, we only support MAIN as the main branch, not MASTER." %}

Please provide feedback using the feedback button in your project." %}
If you have a complex application, you can push your app sources into Github and link the repository in this section.
Provide Project URL, choose the right branch and finally select your main entrypoint file.

{: .image-popup}
![Git repository](/components/data-apps/data apps - git repository.png)

## Secrets
To provide your app with environment variables or sensitive information like credentials, api keys etc, enter them as key value pairs in the Secrets section.
These secrets will be injected into the secrets.toml file upon deployment of the app. 
[Read more about the Streamlit secrets](https://docs.streamlit.io/streamlit-community-cloud/get-started/deploy-an-app/connect-to-data-sources/secrets-management).

{: .image-popup}
![Secrets](/components/data-apps/data apps - secrets.png)

## Loading data from Storage
To load Data into the app, you can either use [Input mapping](https://help.keboola.com/transformations/mappings/#input-mapping) section, which will load data from Keboola project Storage into the app.
Just select your table into input mapping section and navigate to that by /data/in/table/your_data.csv or /data/in/files/fileID_FileName.* in your code.
(Note that, while in BETA, the app needs to be redeployed to fetch up-to-date data.)
<br />
Or you can use [Keboola Storage Python Client](https://github.com/keboola/sapi-python-client) in the app to load the data as needed.
See [Examples](#Examples) below for usage of the Keboola Storage Python Client.

## Writing back to Storage
For writing data back to Keboola Project Storage, use our [Keboola Storage Python Client](https://github.com/keboola/sapi-python-client).
See [Examples](#Examples) below for usage of the Keboola Storage Python Client.

## Deployment and App management

{% include warning.html content="Once the Data App is deployed it's url will be publicly available! Keboola does not provide authorization to Data Apps out of the box yet." %}

### Authorization
We recommend implementing some sort of authorization into your app. You can use for example Streamlit authenticator. Check out [Streamlit authenticator tutorial](https://blog.streamlit.io/streamlit-authenticator-part-1-adding-an-authentication-component-to-your-app/) or take a look at [our example](https://github.com/KB-PS/mkt-bi-ocr/blob/master/Select_Invoices.py).

### Base Image
When the app is deployed, the code specified in one of the deployment method will be injected into our [base Streamlit docker image](https://github.com/keboola/sandbox-streamlit/blob/main/Dockerfile). 
This image already has Streamlit and few other basic packages pre-installed.

### Actions menu

- **Deploy Data app** - start the Data App, once the deployment job is finished, you can go to the Data App public url by clickin "Open Data App".
- **Open Data App** - opens a new window with your Data App.
- **Redeploy** - if you made changes in the Data App configuration, you have to redeploy it for the changes to take effect.
- **Terminate Data App** - stop the Data App. The container in which the application is running will be stopped, and the apps url will no longer be available. The configuration of the app will remain intact.
- **Delete Data App** - stop the Data App deployment and delete it's configuration.

### Debugging App deployment
If the Data App's deployment job fails, you can see the logs from its container in the events log of the deployment job.  
For example a conflict of the specified packages:

{: .image-popup}
![Secrets](/components/data-apps/data apps - job error log.png)

## Example Data Apps

### Titanic Demo App
Author: Monika Feigler

Take a look at our demo data app to see how to create a data app with Streamlit Python code and how to incorporate data and files from an input mapping into your code. This data app allows users to explore and analyze the Titanic dataset using interactive visualizations and filters.
- [configuration](https://demo.keboola.com/app/data-apps/45663441)

### Customer Segmentation
Author: Kritiga Ravishankar

App that allows user to assess the current segments edit them and also create new customer segments.
- [live](https://customer-segmentator.streamlit.app/) 
- [source](https://github.com/kritiga9/mktbi_customer_segmentation)

### CEO KPIs
Author: Ondřej Svoboda

Interactive display of several business metrics with integrated slack and Jira notifications.
- [live](https://kb-ps-ceo-kpis-streamlit-app-6tv06z.streamlit.app/)
- [source](https://github.com/KB-PS/CEO-KPIs)

### Bottom-up Modelling
Author: Kritiga Ravishankar

App that allows the user to forecast the earning potential by bottom-up modelling.

- [live](https://empower-bottom-up-modelling.streamlit.app/)
- [source](https://github.com/kritiga9/bottom_up_modelling)
