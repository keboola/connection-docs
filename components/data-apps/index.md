---
title: Data Apps
permalink: /components/data-apps/
---

{% include warning.html content="This feature is in public beta. All data apps are terminated at midnight." %}

* TOC
{:toc}

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
![Code - main menu](/components/data-apps/data_apps-main_menu.png)

### Code
For simple use cases, where your Streamlit code fits into one page, paste the code directly into a text area. 
This deployment type is ideal for very simple apps or for testing. Check out our [Titanic Demo App](https://demo.keboola.com/app/data-apps/45663441) or [this example from Streamlit docs](https://docs.streamlit.io/library/get-started/create-an-app#lets-put-it-all-together).

{: .image-popup}
![Code - code](/components/data-apps/data_apps-hello_world-code.png)

#### Packages
To use additional packages that are not already in our [Streamlit Base Image](#base-image), enter them into the field Packages.

{: .image-popup}
![Packages](/components/data-apps/data_apps-packages.png)

### Git Repository
{% include warning.html content="In BETA, we only support GitHub repositories. Also, we only support MAIN as the main branch, not MASTER." %}

To provide feedback, use the feedback button in your project.
If you have a complex application, push your app sources into GitHub and link the repository in this section.
Provide the Project URL, choose the right branch, and finally, select your main entrypoint file.

{: .image-popup}
![Git repository](/components/data-apps/data_apps-git_repository.png)

## Secrets
To provide your app with environment variables or sensitive information like credentials, API keys etc., enter them as key value pairs in the section Secrets.
These secrets will be injected into the secrets.toml file upon deployment of the app. 
[Read more about the Streamlit secrets](https://docs.streamlit.io/streamlit-community-cloud/get-started/deploy-an-app/connect-to-data-sources/secrets-management).

{: .image-popup}
![Secrets](/components/data-apps/data_apps-secrets.png)

## Loading Data from Storage
To load data from the storage of a Keboola Connection project into the app, use the [input mapping](https://help.keboola.com/transformations/mappings/#input-mapping) section.
Just select your table in the input mapping section and navigate to that by /data/in/table/your_data.csv or /data/in/files/fileID_FileName.* in your code.
Note that, while in BETA, the app needs to be redeployed to fetch up-to-date data.
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
