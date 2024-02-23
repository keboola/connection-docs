---
title: Interactive Keboola Sheets
permalink: /templates/interactive-keboola-sheets/
---

* TOC
{:toc}

This template will help you simplify data editing and management within your company. 
The data app eliminates the need to export data to external tools, allowing business users to **directly access and edit tables stored in Keboola Storage**.

By centralizing data editing, the app enhances collaboration, reduces errors, and streamlines your data management processes. 
Replace manual data manipulation with a seamless data editing solution. Utilizing this template will provide you with a **more efficient** and **user-friendly** 
approach to editing and managing data. 

The flow consists of only one component – the data app itself; no complex flow configuration is needed.

{: .image-popup}
![The Flow](/templates/interactive-keboola-sheets/flow.png)

## Setting Up the Data App

{: .image-popup}
![Data Editor](/templates/interactive-keboola-sheets/data-editor.png)

In the **Secrets** section, insert the token(s) of the bucket(s) you want to make accessible to the users 
(all tables within the bucket will then be accessible within the app). You can ignore the input and output mappings, as the app will not utilize them.

- Specify the field/column limitations within the Python code of the app.
- Deploy the app. 
- Within the data app, business users can select a table for editing.
- After completing the edits, click **Save Changes**, and the changes will instantly be saved back into the table in Keboola Storage.

## How to Use the Template
The process is simple. We will guide you through it, and, when needed, ask you to provide your credentials and authorize the destination component.

First decide which data source and which data destination you want to use. Then select the corresponding template from the **Templates** tab 
in your Keboola project. When you are done, click **+ Use Template**.

{: .image-popup}
![Add New Template](/templates/interactive-keboola-sheets/add-new-template.png)

This page contains information about the template. Click **+ Use Template** again.

{: .image-popup}
![New Template](/templates/interactive-keboola-sheets/int-keb-sheets.png)

You will be asked to write a name for the template instance you are about to create. 
You can use the template as many times as you want and still keep everything organized.

{: .image-popup}
![Template Name](/templates/interactive-keboola-sheets/template-name.png)

After clicking **Next Step**, you will see the template builder. Fill in all required fields and start using the template and the data app.

## How the Data App Works
This web application is designed to help you easily edit and manage your tabular data stored in a Keboola environment. 
Whether you are a data analyst, scientist, or anyone working with data, this tool simplifies the process of making changes to your datasets.

- **Open the editor:** After logging in, you will see a menu on the left. Click on **Data Editor** to begin. The app will then fetch the list of tables available in your Keboola bucket.
- **Choose a table:** From the list of tables, select the one you want to work with. The app will then load the data from your selected table.
- **Edit your data:** Once your table is loaded, you will see it displayed in an editable table format. You can easily make changes, add new data, or remove rows.
- **Save your changes:** When you are satisfied with your edits, simply click the **Send to Keboola** button. Your changes will then be saved, and the updated data will be sent back to your Keboola Storage.

It is that simple! This app streamlines the process of editing and managing your data in Keboola. Whether you need to clean, transform, or update your datasets, this tool helps you do it efficiently. Happy data editing!

