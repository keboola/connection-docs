---
title: How to Connect BigQuery
permalink: /storage/byobq/
---

* TOC
{:toc}


{: .image-popup}
![How to connect BigQuery](/storage/byobq/schema.png)

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

