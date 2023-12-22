---
title: Flow Automation
permalink: /tutorial/automate/
---

So far, you have learned to use Keboola to

- load tables [manually](/tutorial/load/) or [using a data source connector](/tutorial/load/database/), 
- [manipulate data in SQL](/tutorial/manipulate/), and
- write data [into a Google Spreadsheet using a data destination connector](/tutorial/write/).
 
While connecting various systems together alone makes Keboola a powerful and easy-to-use tool, 
the above steps must be done repeatedly to bring in the newest data available.

This is where our flows come in:
- Specify what tasks should be executed in what order (orchestrate tasks) and
- Configure the automatic execution (schedule flow tasks).

1. Navigate to the **Flows** section of Keboola.

{: .image-popup}
![Go to Flows](/tutorial/automate/automate1.png)

2. Click **Create Flow**.

3. Enter a *Name* and *Description* for your flow. Similar to creating a transformation, you can organize flows into folders.
You can specify the folder name when creating a flow or assign it under a folder later. Click **Create Flow**.

{: .image-popup}
![Name the Flow](/tutorial/automate/automate2.png)

4. Click **Select First Step**.

{: .image-popup}
![Select First Step](/tutorial/automate/automate3.png)

5. Click the **Google Sheets Data Source** component. We extracted the *Levels* table from this data source and we’ll want to extract this data automatically in our flow.

{: .image-popup}
![Select Google Sheets Data Source](/tutorial/automate/automate4.png)

6. Use the drop down menu to select a particular configuration of this component.

{: .image-popup}
![Select Configuration](/tutorial/automate/automate5.png)

7. Now use the plus icon to add additional steps. Select the **Snowflake data source** component we used to extract the *User, Opportunity*, and *Account* tables.
Then select the configuration we created.

{: .image-popup}
![Additional Steps](/tutorial/automate/automate6.png)

8. Extractions of the data are not dependent tasks and, thus, can be executed in parallel.
You can accomplish this by simply dragging and dropping the second task into the Step 1 box.

{: .image-popup}
![Extraction 1](/tutorial/automate/automate7.png)

{: .image-popup}
![Extraction 2](/tutorial/automate/automate8.png)

{: .image-popup}
![Extraction 3](/tutorial/automate/automate9.png)

9. Continue to add the **SQL Transformation** step and the **Google Sheets Data Destination** steps. You should now have a Flow looking like this

{: .image-popup}
![Add SQL Transformation](/tutorial/automate/automate10.png)

When configuring the **transformation** in the [Data Manipulation](/tutorial/manipulate/) step of this tutorial, 
we used the input tables we loaded manually into Keboola. Now, we need to adjust the **input mapping** of our transformation to use the tables extracted 
from **Google Sheets** and **Snowflake data sources**.

You can get to the configuration by selecting the step and clicking **Edit Configuration**.

{: .image-popup}
![Edit Configuration](/tutorial/automate/automate11.png)

Remove the current **input mapping** tables and add the ones from the Google Sheet and Snowflake data sources. 
Make sure you edit the *Table name* parameter because those are the names we use in our query to reference those tables.

{: .image-popup}
![Replace Input Mapping](/tutorial/automate/automate12.png)

## Set a Schedule
1. Click **Set Schedule**.

{: .image-popup}
![Set Schedule](/tutorial/automate/automate13.png)

2. Set the schedule to 6:15am UTC daily execution and click **Set Up Schedule**.

{: .image-popup}
![Set Schedule 1](/tutorial/automate/automate14.png)

## Notifications
To ensure that responsible persons are notified when the flow fails or runs into warnings, it’s always a good idea to set up **notifications**.

Navigate to the **Notifications** tab and enter/select email addresses of those that should be notified on success/warning/error or processing.

{: .image-popup}
![Set Up Notifications](/tutorial/automate/automate15.png)

## What’s Next
Having mastered the automation process, you may proceed to the [Development Branches](/tutorial/branches/) part of the tutorial.

## If You Need Help
Feel free to reach out to our [support team](/management/support/) if there’s anything we can help with.
