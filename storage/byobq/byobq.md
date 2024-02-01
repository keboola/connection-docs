---
title: How to Connect BigQuery
permalink: /storage/byobq/
---

* TOC
{:toc}

This guide is designed to walk you through the essential processes of setting up and configuring various Google Cloud resources for connecting your BigQuery 
and related services to your Keboola project. From creating a dedicated folder in your Google organization to creating a project and a service account, 
each section is tailored to ensure a smooth and efficient setup.

{: .image-popup}
![How to connect BigQuery](/storage/byobq/pic.png)

## Create a Folder 
[**Learn more**](https://cloud.google.com/resource-manager/docs/creating-managing-folders)

1.	Go to **IAM & Admin > [Manage Resources](https://console.cloud.google.com/cloud-resource-manager)** and click on the **Create folder** button.
2.	In the **Folder name** box, enter the new folder’s name: “Keboola”.
3.	Under **Organization** and **Location**, select the organization resource or folder under which you want to create your new folder. If you have any difficulties creating a folder, learn more [here](https://cloud.google.com/resource-manager/docs/creating-managing-folders#folder-permissions). Click **Create**.
4.	On the **Resource Manager** page, uncollapse the organization, locate your created folder, and copy its ID to the Keboola BigQuery registration form.

## Create a Project 
[**Learn more**](https://cloud.google.com/resource-manager/docs/creating-managing-projects#creating_a_project)

1.	In the Resource Manager, click **Create Project**.
2.	Set the **Project name** to “Keboola Main”.
3.	In **Location**, choose the previously created folder. Click **Create**.
4.	Once the project is created, select it by clicking **Select project** in the notification or find the project using the selector in the top left corner of the Google console.
5.	Ensure that **billing is enabled** for your Google Cloud project ([verify that billing is enabled](https://cloud.google.com/billing/docs/how-to/verify-billing-enabled#console)).

## Enable API Services 
[**Learn more**](https://cloud.google.com/endpoints/docs/openapi/enable-api#enabling_an_api)

1.	Open **APIs & services** in the navigation menu of your project. Click **Enable APIs and Services**.
2.	Search and enable each service from the following list by clicking the **Enable** button on its detail page:
    - Cloud resource manager API (cloudresourcemanager.googleapis.com)
    - Service usage API (serviceusage.googleapis.com)
    - Identity and access management (IAM) API (iam.googleapis.com)
    - Cloud billing API (cloudbilling.googleapis.com)
    - Analytics hub API (analyticshub.googleapis.com)
    - BigQuery API (bigquery.googleapis.com)

## Create a Service Account 
[**Learn more**](https://cloud.google.com/iam/docs/service-accounts-create#creating)

1.	Go to **IAM & Admin > Service Accounts** in your project. Click **Create service accounts**. 
2.	Name the service account “Keboola Main Service Account” and provide a description. Click **Create and continue**.
3.	Go back to the **Service Accounts** page and click on the newly created service account.
    - In the **Keys** tab, click **Add key** and select **Create new key**.
    - Choose JSON as the key type and click **Create**. The key file will be downloaded to your system. This file is needed for the Keboola BigQuery registration form.
4.	Assign roles to the service account:    
    1. Assign **Project Roles** to the service account.
        - Go to **IAM & Admin > IAM** in the project.
        - Click **Grant access** and copy the service account’s email address into the **New principal** field.
        - Select the role **Basic > Owner**. Click **Save**.
        - Click **Add another role** and select **Cloud Storage > Storage Object Admin**.
        - Click **Save**.
    2. Assign **Folder Roles** to the service account:
        - Paste your folder name or ID into the search bar and select it.
        - In the **IAM & Admin** section, go to **IAM**.
        - Click **Grant access** and enter the service account’s email address.
        - Select the role **Basic > Browser**.
        - Click **Add another role**.
        - Select the role **Resource Manager > Project Creator**.
        - Click **Save**.
    3. Assign **Billing Roles** to the service account:
        - Open the **Billing** section from the navigation menu in your project.
        - In the **Overview** section, find the card with the **Billing account** with your billing account name and its ID.
        - Click on the **Manage** link.
        - Click **Add principal**.
        - Paste the principal email address of the service account created earlier.
        - Select the role **Billing > Billing Account User** and click **Save**.

## Create a Google Cloud Storage Bucket 
[**Learn more**](https://cloud.google.com/storage/docs/creating-buckets#create_a_new_bucket)

1.	Navigate to **Cloud Storage > Buckets**. Click **Create Bucket**.
2.	**Name the bucket**, e.g., “keboola-yourorganization-files”. The bucket name must be globally unique, so choose a custom name.
3.	**Choose the region** where your data will be stored. **Important**: The bucket must be set in the EU region; otherwise, the registration of the BigQuery backend in Keboola will be rejected.
4.	Set **other options** as desired. We recommend checking _Enforce public access prevention on this bucket_. Click **Create**.
5.	Once the bucket is created, select the **Lifecycle** tab and click **Add rule**.
    - Select the action **Delete object** and click **Continue**.
    - Under **Select object condition > Set rule scopes**, select **Object Name Matches Prefix** and set the prefix to `exp-2/`.
    - Under **Select object condition > Set conditions**, select `Age`. Set the age to `2 days`and click **Create**.
    - Repeat the previous steps for the prefix `exp-15/` with an age of `15 days`.
