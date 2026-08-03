---
title: 'Automate It with a Flow'
slug: 'getting-started/automate'
description: 'Wire your connectors and transformation into a single flow, run its tasks in parallel where possible, give it a schedule, and get notified when it fails.'
redirect_from:
  - /tutorial/automate/
---

So far, you have learned to use Keboola to

- load tables [manually](/getting-started/load/) or [using a data source connector](/getting-started/load/database/), 
- [manipulate data in SQL](/getting-started/transform/), and
- write data [into a Google Spreadsheet using a data destination connector](/getting-started/write/).
 
While connecting various systems together alone makes Keboola a powerful and easy-to-use tool, 
the above steps must be done repeatedly to bring in the newest data available.

This is where our flows come in:
- Specify what tasks should be executed in what order (orchestrate tasks) and
- Configure the automatic execution (schedule flow tasks).

1. Navigate to the **Flows** section of Keboola.

![Go to Flows](/getting-started/automate/automate1.png)

2. Click **Create Flow**.

3. Enter a *Name* and *Description* for your flow. Similar to creating a transformation, you can organize flows into folders.
You can specify the folder name when creating a flow or assign it under a folder later. Click **Create Flow**.

![Name the Flow](/getting-started/automate/automate2.png)

4. Click **Select First Step**.

![Select First Step](/getting-started/automate/automate3.png)

5. Click the **Google Sheets Data Source** component. We extracted the *Levels* table from this data source and we’ll want to extract this data automatically in our flow.

![Select Google Sheets Data Source](/getting-started/automate/automate4.png)

6. Use the drop down menu to select a particular configuration of this component.

![Select Configuration](/getting-started/automate/automate5.png)

7. Now use the plus icon to add additional steps. Select the **Snowflake data source** component we used to extract the *User, Opportunity*, and *Account* tables.
Then select the configuration we created.

![Additional Steps](/getting-started/automate/automate6.png)

8. Extractions of the data are not dependent tasks and, thus, can be executed in parallel.
You can accomplish this by simply dragging and dropping the second task into the Step 1 box.

![Extraction 1](/getting-started/automate/automate7.png)

![Extraction 2](/getting-started/automate/automate8.png)

![Extraction 3](/getting-started/automate/automate9.png)

9. Continue to add the **SQL Transformation** step and the **Google Sheets Data Destination** steps. You should now have a flow looking like this

![Add SQL Transformation](/getting-started/automate/automate10.png)


When configuring the **transformation** in the [Data Manipulation](/getting-started/transform/) step of this tutorial, 
we used the input tables we loaded manually into Keboola. Now, we need to adjust the **input mapping** of our transformation to use the tables extracted 
from **Google Sheets** and **Snowflake data sources**.

You can get to the configuration by selecting the step and clicking **Edit Configuration**.

![Edit Configuration](/getting-started/automate/automate11.png)

Remove the current **input mapping** tables and add the ones from the Google Sheet and Snowflake data sources. 
Make sure you edit the *Table name* parameter because those are the names we use in our query to reference those tables.

![Replace Input Mapping](/getting-started/automate/automate12.png)

## Set a Schedule
1. Click **Set Schedule**.

![Set Schedule](/getting-started/automate/automate13.png)

2. Set the schedule to 6:15am UTC daily execution and click **Set Up Schedule**.

![Set Schedule 1](/getting-started/automate/automate14.png)

## Notifications
To ensure that responsible persons are notified when the flow fails or runs into warnings, it’s always a good idea to set up **notifications**.

Navigate to the **Notifications** tab and enter/select email addresses of those that should be notified on success/warning/error or processing.

![Set Up Notifications](/getting-started/automate/automate15.png)

## What’s Next
Having mastered the automation process, you may proceed to the [Development Branches](/getting-started/branches/) part of the tutorial.

## If You Need Help
Feel free to reach out to our [support team](/management/support/) if there’s anything we can help with.
