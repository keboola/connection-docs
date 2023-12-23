---
title: "Part 3: Writing Data"
permalink: /tutorial/write/
---

* TOC
{:toc}

This section of our tutorial will walk you through the process of writing data from Keboola to a destination. This step is commonly referred to as reverse ETL. 
Having already learned how to [manipulate data](/tutorial/manipulate/) in Keboola using SQL, you now have a denormalized table called `opportunity_denorm` 
ready in Storage.

In this tutorial, we will push this table to a **Google Sheets** destination. It's important to note that other typical destinations can include BI tools, databases, or even applications/APIs, such as CRM systems, and more.

1. Navigate to **Components**, click the **Add Component** button and use the search bar to find *Sheets*.

   {: .image-popup}
   ![Add Component](/tutorial/write/writing1.png)

2. Click **Add Component** and then click **Connect To My Data**.

   {: .image-popup}
   ![Connecto to Data](/tutorial/write/writing2.png)

3. Enter a *Name* and *Description* and click **Create Configuration**.

   {: .image-popup}
   ![Name Component](/tutorial/write/writing3.png)

4. Now, we need to authorize the Google account to which we want to write the data.
This process is similar to what we’ve done in the [Loading data from Google Sheets data source](/tutorial/load/googlesheets/) step of this tutorial.

   {: .image-popup}
   ![Authorize Google Account](/tutorial/write/writing4.png)

5. Enter a name for your connection and click **Sign in with Google**. You can also utilize *external authorization* if you need your colleagues
to authorize their accounts. Please note that this authorization will only allow you to write data into a Google Spreadsheet.

   {: .image-popup}
   ![Authorize –Sign in with Google](/tutorial/write/writing5.png)

6. Click **Allow**.

   {: .image-popup}
   ![Allow Access](/tutorial/write/writing6.png)

7. Click **New Table** now to select the `opportunity_denorm` table from your Storage. 

   {: .image-popup}
   ![Select New Table](/tutorial/write/writing7.png)

8. Select the table and click **Next**.

   {: .image-popup}
   ![Select New Table](/tutorial/write/writing8.png)

9. You can either create a **new spreadsheet** or load data to an **existing spreadsheet**. Click **New spreadsheet** now and then click **Next**.

   {: .image-popup}
   ![Create a New Spreadsheet](/tutorial/write/writing9.png)
 
10. Enter a name of your sheet, select **Update rows** and click **Save Sheet**. This will create a new empty spreadsheet under the authorized account. 

    {: .image-popup}
    ![Name and Save a Spreadsheet](/tutorial/write/writing10.png)

11. To load the data into the created spreadsheet, click the **Run Component** button.

12. After the job is executed, you can click the spreadsheet name to open the Google Drive spreadsheet (assuming you have access to the spreadsheet).

    {: .image-popup}
    ![Open the Spreadsheet](/tutorial/write/writing11.png)

## What’s Next
Proceed to [Flow Automation](/tutorial/automate/) for the next step in the tutorial. 

## If You Need Help
Feel free to reach out to our [support team](/management/support/) if there’s anything we can help with.
