---
title: Data Apps
permalink: /components/data-apps/
---

{% include warning.html content="This feature is in public beta." %}

* TOC
{:toc}

## Overview
Data apps are simple, interactive web applications that use data to deliver insight or automatically take action.
They are usually custom-tailored to tackle a specific problem and enable a dynamic, purpose-built user experience.

Examples of data apps include recommendation engines, interactive segmentation, AI integration, data visualization, 
customized internal reporting tools for business teams, financial apps to get insights on your spend patterns, etc.

Data apps may be written in any language. However, for now Keboola only supports apps written in [Streamlit](https://streamlit.io/), 
which is a Python framework for rapid development of such applications.

As mentioned above, a data app is a simple web application, which can be deployed inside a Keboola project 
and also publicly accessed from outside the project. 
It means that the users that will access your data app don't need access to a Keboola project.

## Create a Data App
There are two ways to create a data app in Keboola. Select a deployment type that will suit your needs:
- **Code** – Just paste a Streamlit code to create a simple data app. 
- **Git repository** – Specify a git repository with Streamlit app sources. This is more suitable for complex applications. You will need to provide your GitHub username and private access token for repository authentication.

{: .image-popup}
![Code - main menu](/components/data-apps/data_apps-main_menu.png)

### Code
For simple use cases, where your Streamlit code fits into one page, paste the code directly into a text area. 
This deployment type is ideal for very simple apps or for testing. Check out our [Titanic Demo App](https://demo.keboola.com/app/data-apps/45663441) or [this example from Streamlit docs](https://docs.streamlit.io/library/get-started/create-an-app#lets-put-it-all-together).

{: .image-popup}
![Code - code](/components/data-apps/data_apps-hello_world-code.png)

#### Packages
To use additional Python packages that are not already in our [Streamlit Base Image](#base-image), enter them into the field Packages.

{: .image-popup}
![Packages](/components/data-apps/data_apps-packages.png)

### Git Repository
{% include warning.html content="In BETA, we only support GitHub repositories." %}

To provide feedback, use the feedback button in your project.
If you have a complex application, push your app sources into GitHub and link the repository in this section.
Provide the Project URL, choose the right branch, and finally, select your main entrypoint file.

{: .image-popup}
![Git repository](/components/data-apps/data_apps-git_repository_public.png)

If you are using a private repository, you will need to authenticate with your GitHub username and private access token. Follow these steps to authenticate:

1. Generate a personal access token on GitHub. You can do this by going to your GitHub account settings, selecting "Developer settings", then "Personal access tokens", and clicking on "Generate new token". Make sure to give the token appropriate permissions for accessing the repository.

2. In the Keboola, navigate to the `Data App Repository` in your Data App Configuration, check the `Private` and enter your GitHub username and the personal access token you generated in step 1.

3. Click on "Save" to authenticate with the private repository.

Now you can deploy your data app from the private repository and access it within your Keboola project.


{: .image-popup}
![Git repository](/components/data-apps/data_apps-git_repository_private.png)

## Secrets
To provide your app with environment variables or sensitive information like credentials, API keys etc., enter them as key value pairs in the section Secrets.
These secrets will be injected into the secrets.toml file upon deployment of the app. 
[Read more about the Streamlit secrets](https://docs.streamlit.io/streamlit-community-cloud/get-started/deploy-an-app/connect-to-data-sources/secrets-management).

### Default Secrets
By default, the Keboola Streamlit Docker image provides two secrets without the need for explicit specification:

- `kbc_url`: Represents the URL of the current Keboola project.
- `kbc_token`: Represents the storage token with full read-write access to Keboola Storage.

These secrets can be accessed within your Streamlit data app code using the following example, which is used for initializing the Keboola storage token:
```
token = st.secrets["kbc_storage_token"]
url = st.secrets["kbc_url"]
client = Client(url, token)
```

![Secrets](/components/data-apps/data_apps-secrets.png)

## Loading Data from Storage
To load data from the storage of a Keboola project into the app, use the [input mapping](https://help.keboola.com/transformations/mappings/#input-mapping) section.
Just select your table in the input mapping section and navigate to that by /data/in/table/your_data.csv or /data/in/files/fileID_FileName.* in your code.
Note that, while in BETA, the app needs to be redeployed to fetch up-to-date data.
Or you can use [Keboola Storage Python Client](https://github.com/keboola/sapi-python-client) in the app to load the data as needed.
See the [examples](#Examples) below for usage of the Keboola Storage Python Client.

## Writing Back to Storage
For writing data back to Keboola Project Storage, use our [Keboola Storage Python Client](https://github.com/keboola/sapi-python-client).
See the [examples](#Examples) below for usage of the Keboola Storage Python Client.

## Deployment and App Management
{% include warning.html content="Once the data app is deployed, its URL will be publicly available! Keboola does provide two authorization methods." %}

### Authorization
We recommend to use authorization methods provided by Keboola.

1. **Simple Authorization**: This method allows you to authenticate one user using a username and password. 

2. **SSO (Single Sign-On) Authorization**: This method enables users to log in to your app using your SSO without the need of having their own existing Keboola accounts. 

Alternatively, you can use Streamlit authenticator. Check out the [Streamlit authenticator tutorial](https://blog.streamlit.io/streamlit-authenticator-part-1-adding-an-authentication-component-to-your-app/) or take a look at [our example](https://github.com/KB-PS/mkt-bi-ocr/blob/master/Select_Invoices.py).

Choose the authorization method that best suits your app's requirements and security needs.

#### Simple Authorization
TBD

#### SSO (Single Sign-On) Authorization
TBD

## Sleep and resume
TBD

### Base Image
When the app is deployed, the code specified in one of the deployment methods will be injected into our base Streamlit docker image. 
This image already has Streamlit and a few other basic packages pre-installed:

```
# Dockerfile

FROM python:3.8-slim

RUN groupadd --gid 1000 appuser \
    && useradd --uid 1000 --gid 1000 -ms /bin/bash appuser
    
RUN pip3 install --no-cache-dir --upgrade \
    pip \
    virtualenv
    
RUN apt-get update && apt-get install -y \
    build-essential \
    software-properties-common \
    git \
    jq \
    vim

RUN mkdir -m 777 /data
USER appuser
WORKDIR /home/appuser

ENV VIRTUAL_ENV=/home/appuser/venv
RUN virtualenv ${VIRTUAL_ENV}

ENV STREAMLIT_SERVER_PORT=8888
EXPOSE 8888

COPY run.sh /home/appuser
ENTRYPOINT ["./run.sh"]
```

```
# pip list

Package                   Version
------------------------- -----------
altair                    5.0.1
attrs                     23.1.0
backports.zoneinfo        0.2.1
blinker                   1.6.2
cachetools                5.3.1
certifi                   2023.7.22
charset-normalizer        3.2.0
click                     8.1.6
decorator                 5.1.1
gitdb                     4.0.10
GitPython                 3.1.32
idna                      3.4
importlib-metadata        6.8.0
importlib-resources       6.0.0
Jinja2                    3.1.2
jsonschema                4.18.4
jsonschema-specifications 2023.7.1
markdown-it-py            3.0.0
MarkupSafe                2.1.3
mdurl                     0.1.2
numpy                     1.24.4
packaging                 23.1
pandas                    2.0.3
Pillow                    9.5.0
pip                       23.1.2
pkgutil_resolve_name      1.3.10
protobuf                  4.23.4
pyarrow                   12.0.1
pydeck                    0.8.0
Pygments                  2.15.1
Pympler                   1.0.1
python-dateutil           2.8.2
pytz                      2023.3
pytz-deprecation-shim     0.1.0.post0
referencing               0.30.0
requests                  2.31.0
rich                      13.4.2
rpds-py                   0.9.2
setuptools                67.7.2
six                       1.16.0
smmap                     5.0.0
streamlit                 1.25.0
tenacity                  8.2.2
toml                      0.10.2
toolz                     0.12.0
tornado                   6.3.2
typing_extensions         4.7.1
tzdata                    2023.3
tzlocal                   4.3.1
urllib3                   2.0.4
validators                0.20.0
watchdog                  3.0.0
wheel                     0.40.0
zipp                      3.16.2
```

Please note that the versions of these packages might change as the newest version of the Streamlit package is used upon deployed if not specified explicitly in Packages field.

### Actions Menu
{: .image-popup}
![Secrets](/components/data-apps/data_apps-manage-redeploy.png)

- **Deploy Data App** – starts the data app. Once the deployment job is finished, you can go to the data app public URL by clicking **Open Data App**.
- **Open Data App** – opens a new window with your data app.
- **Redeploy** – if you made changes in the data app configuration, you have to redeploy it for the changes to take effect.
- **Terminate Data App** – stops the data app. The container in which the application is running will be stopped, and the app's URL will no longer be available. The configuration of the app will remain intact.
- **Delete Data App** – stops the data app deployment and deletes its configuration.

### Debugging App Deployment
If the data app's deployment job fails, you can see the logs from its container in the events log of the deployment job.  
For example, a conflict of the specified packages:

{: .image-popup}
![Secrets](/components/data-apps/data_apps-job_error_log.png)

## Example Data Apps

### Titanic Demo App
Author: Monika Feigler

Our demo data app shows how to create a data app with Streamlit Python code and how to incorporate data and files from an input mapping into your code. This data app allows users to explore and analyze the Titanic dataset using interactive visualizations and filters.

#### Deployed from code

- [Configuration](https://demo.keboola.com/app/data-apps/45663441)
- [Live App](https://sandbox.north-europe.azure.keboola.com/45663474/)
  
#### Deployed from a GitHub repository

- [Configuration](https://demo.keboola.com/app/data-apps/49752130)
- [Source](https://github.com/keboola/titanic-data-app)

### AI SMS Campaign
Author: Petr Huňka

Our demo app offers a cutting-edge solution that leverages Shopify data to supercharge your campaigns. By harnessing the power of artificial intelligence (AI), we create tailor-made SMS messages and deliver them through Twilio's platform. The result? A seamlessly personalized approach that captivates your audience, ensuring your marketing efforts are not only effective but also driven by AI precision.

- [Configuration](https://demo.keboola.com/app/data-apps/51362322)
- [Documentation](https://help.keboola.com/templates/ai-campaign-executer/)
- [Source](https://github.com/keboola/ai_campaign_executer)
  
This data app, along with the complete workflow, can be implemented using the AI SMS Campaign template.

### Interactive Keboola Sheets
Author: Petr Huňka

Simplify data editing and management within your company. The data app eliminates the need to export data to external tools, allowing business users to directly access and edit tables stored in Keboola Storage.
- [Live app](https://sandbox.north-europe.azure.keboola.com/51814820/)
- [Configuration](https://demo.keboola.com/app/data-apps/51359967)
- [Documentation](https://help.keboola.com/templates/interactive-keboola-sheets/)
- [Source](https://github.com/keboola/planning-sheets-data-app/)

This data app, along with the complete workflow, can be implemented using the Interactive Keboola Sheets template.

### eCommerce KPI Dashboard
Author: Ondřej Svoboda

This data app provides an interactive display of several business metrics with integrated Slack notifications.
- [Live app](https://sandbox.north-europe.azure.keboola.com/51814781/)
- [Configuration](https://demo.keboola.com/app/data-apps/51361334)
- [Documentation](https://help.keboola.com/templates/interactive-kpi-reporting/)
- [Source](https://github.com/keboola/interactive-kpi-reporting)

This app, along with the complete workflow, can be implemented using the eCommerce KPI Dashboard template.

### Online Marketing Dashboard
Author: Monika Feigler

Our demo app provides an overview of the costs for all campaigns across marketing channels. 
- [Live app](https://sandbox.north-europe.azure.keboola.com/49569899/)
- [Configuration](https://demo.keboola.com/app/data-apps/49567241)
- [Documentation](https://help.keboola.com/templates/marketing-platforms/)
- [Source](https://github.com/keboola/marketing-dashboard-data-app)

This data app, along with the complete workflow, can be implemented using the Advertising Platform template.

### UA and GA4 Data Comparison
Author: Marketing BI and Keboola

This data app is designed to provide a quick and comprehensive overview of the differences between data gathered by Google’s Universal Analytics (UA) and Google Analytics 4 (GA4).
- [Configuration](https://demo.keboola.com/app/data-apps/51525772)
- [Documentation](https://help.keboola.com/templates/ua-and-ga4-comparison/)
- [Source](https://github.com/keboola/ua-ga4-comparison)

This app, along with the complete workflow, can be implemented using the UA and GA4 Comparison template.

### Kai PromptLab
Author: Jordan Burger and Pavel Chocholouš

Streamline your AI prompting process! Use this Streamlit app to refine, test, and compare multiple prompts, ensuring optimal results. Dive into AI with enhanced efficiency!
- [Documentation](https://help.keboola.com/templates/kai-promptlab/)
- [Source](https://github.com/keboola/kai-promptlab)

This data app, along with the complete workflow, can be implemented using the Kai PromptLab template.

### Kai SQL Bot
Author: Jordan Burger and Pavel Chocholouš

The SQL Bot data app is a dialogue-based AI interface tailored for Snowflake database queries. It allows you to engage in natural conversations and translates your requests into precise SQL commands.
- [Documentation](https://help.keboola.com/templates/kai-sql-bot/)
- [Source](https://github.com/keboola/Kai-SQL-bot)

This app, along with the complete workflow, can be implemented using the Kai SQL Bot template.
