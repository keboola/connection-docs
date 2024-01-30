---
title: How to Connect BigQuery
permalink: /storage/byobq/
---

* TOC
{:toc}


{: .image-popup}
![How to connect BigQuery](/storage/byobq/pic.png)

## Create a Folder 
[Learn more](https://cloud.google.com/resource-manager/docs/creating-managing-folders)

1.	Go to **IAM & Admin -> [Manage Resources](https://console.cloud.google.com/cloud-resource-manager)** and click on the **Create Folder** button.
2.	In the **Folder name** box, enter the new folder’s name: “Keboola”.
3.	Under **Organization** and **Location**, select the organization resource or folder under which you want to create your new folder. If you have any difficulties creating a folder, learn more [here](https://cloud.google.com/resource-manager/docs/creating-managing-folders#folder-permissions). Click **Create**.
4.	On the **Resource Manager** page, uncollapse the organization, locate your created folder, and copy its ID to the Keboola BigQuery registration form.

## Create a Project 
[Learn more](https://cloud.google.com/resource-manager/docs/creating-managing-folders)

1.	In the Resource Manager, click **Create Project**.
2.	Set the **Project name** to “Keboola Main”.
3.	In **Location**, choose the previously created folder. Click **Create**.
4.	Once the project is created, select it by clicking **Select Project** in the notification or find the project using the selector in the top left corner of the Google console.
5.	Ensure that **billing is enabled** for your Google Cloud project ([Verify billing enabled[(https://cloud.google.com/billing/docs/how-to/verify-billing-enabled#console)).

## Enable API Services 
[Learn more](https://cloud.google.com/endpoints/docs/openapi/enable-api#enabling_an_api)

1.	Open **APIs & Services** in the navigation menu of your project. Click **Enable APIs and Services**.
2.	Search and enable each service from the following list by clicking the **Enable** button on its detail page:
    - Cloud resource manager API (cloudresourcemanager.googleapis.com)
    - Service usage API (serviceusage.googleapis.com)
    - Identity and access management (IAM) API (iam.googleapis.com)
    - Cloud billing API (cloudbilling.googleapis.com)
    - Analytics hub API (analyticshub.googleapis.com)
    - BigQuery API (bigquery.googleapis.com)

## Create a Service Account 
[Learn more](https://cloud.google.com/iam/docs/service-accounts-create#creating)

1.	Go to **IAM & Admin -> Service Accounts** in your project. Click **Create Service Account**. 
2.	Name the service account “Keboola Main Service Account”, and provide a description. Click **Create** and continue.
3.	Go back to the **Service accounts** page and click on the newly created service account.
    - In the **Keys** tab, click **Add Key** and select **Create New Key**.
    - Choose JSON as the key type and click **Create**. The key file will be downloaded to your system. This file is needed for the Keboola BigQuery registration form.
4.	Assign roles to the service account:
  a.	Assign **Project Roles** to the service account.
    - Go to **IAM & Admin -> IAM** in the project.
    - Click **Grant Access** and copy the service account’s email address into the **New principal** field.
    - Select the role **Basic -> Owner**.
    - Click **Save**.
  b.	Assign **Folder Roles** to the service account:
    - Paste your folder name or ID into the search bar and select it.
    - In the **IAM & Admin** section, go to **IAM**.
    - Click **Grant Access** and enter the service account’s email address.
    - Select the role **Basic -> Browser**.
    - Click **Add Another Role**.
    - Select the role **Resource manager -> Project Creator**.
    - Click **Save**.
c.	Assign **Billing Roles** to the service account:
•	Open the **Billing** section from the navigation menu in your project.
•	In the **Overview** section, find the card with the **Billing account** with your billing account name and its ID.
•	Click on the **Manage** link.
•	Click **Add Principal**.
•	Paste the principal email address of the service account created earlier.
•	Select the role **Billing → Billing Account User**.
•	Click **Save**.

