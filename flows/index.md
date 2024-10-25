---
title: Flows
permalink: /flows/
---

* TOC
{:toc}

*If you already know how flows work in general and want to create your first flow, go to our [Getting Started tutorial](/tutorial/automate/) or 
check out our cheat sheet with [best practices](/tutorial/onboarding/cheat-sheet/#automating-your-flow).*

Flows integrate all your project's segments (extractors, writer, transformations, etc.) by creating custom automated processes, chaining components to be run in a specific order, and defining the execution schedule to bring in the newest data available. 

In this section, we'll show you how to organize tasks into steps, set up notifications, and schedule the execution of your flow.

## How Flows Work
First you need to decide what exactly you want you flow to do. What steps it will be composed of and in what order you want them to run.
Then you will determine when you want the entire flow to be executed and how often.

To create a flow, use the **Flow Builder** feature, a tool for visually building end-to-end data pipelines from a single **drag-and-drop** user interface. 

### Flow Builder
It enables you to

- view your multi-step data pipeline in a single browser window. This is especially helpful when your data pipeline is complex. 
- use the tool with no data engineering skills.
- view and work on the same data flows together, set up the data pipeline as a team and continue working on various components individually. The in-built version control lets your team to see the changes others made.
- build multiple data flows in a single view. Each flow is its own data pipeline.
- copy-and-paste an existing data flow to a new flow to reuse the work done across different data pipelines.

Take the following steps to start building your first flow:

- [Step 1: Access the new Flow Builder feature](#access-the-flow-builder)
- [Step 2: Select one or multiple ready-made components](#select-ready-made-components)
- [Step 3: Build the entire flow](#build-the-flow)
- [Step 4: Schedule and automate your flow](#schedule-and-automate-the-flow)
- [Step 5: Check how your flow is running](#check-run-history)

### Access the Flow Builder
Select from the top menu **Flows -> Flows** and click the **Create Flow** button.
   
 {: .image-popup}
   ![Go to Flows](/tutorial/automate/automate1.png)

Name your new flow and add an easy to understand description. Then click **Create Flow** again. 

This will open up the **Flow Builder** view, where you can create your data flow.

### Select Ready-Made Components 
Click **Select First Step** and start selecting the components to collect your data from your data sources. 

   {: .image-popup}
   ![Select First Step](/tutorial/automate/automate3.png)

The general process is simple:

- Select the components you want to extract your data from selected data sources, transform the data, and load it to your selected data destination.
- Authorize Keboola to access data in those components.
- Extract, transform, and load the data.

### Step 3: Build the Flow
Continue adding other ready-made components and organize them in a logical flow  or select the ones you want to run in parallel using drag & drop function. 

For each flow:

- Select one or multiple ready-made components.
- Organize them into a logical flow using the drag and drop functionality.
- Configure each component by providing the credentials and instructions for what or where to extract or write or for what code to execute in a transformation.
- Save the changes .

Once you’ve built your flow end-to-end simply click on Run flow, to set the data pipeline into action.

### Schedule and Automate the Flow
Within the Flow Builder, click on Set schedule under Automate to set up the orchestration that will automatically run your job at your preferred recurring time. 

That’s the power of automation for you - set it and automate it.

### Check Run History
In the tab “All runs” you can check how your flow is running with its detailed breakdown to each task. 


******************************************************

   {: .image-popup}
   ![Name the Flow](/tutorial/automate/automate2.png)

4. Click **Select First Step**.

   {: .image-popup}
   ![Select First Step](/tutorial/automate/automate3.png)

5. Click the **Google Sheets Extractor**. We extracted the *Levels* table from this data source and we’ll want to extract this data automatically in our flow.

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

9. Continue to add the **SQL Transformation** step and the **Google Sheets Data Destination** steps. You should now have a flow looking like this

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


### Parallelization 
To speed up the execution, consider using parallelization to run multiple configurations at the same time. Remember it does not save costs because each job uses credits independently.

**Parallelization opportunities:**

1. **At the Flow Level:** Organize tasks into phases within a flow for simultaneous execution.
2. **Among Components:** Set up parallelization directly in the component's UI for [row-based components](/components/#configuration-rows) like database extractors using the same credentials to run multiple tables concurrently.

{% include tip.html title="Execute Individual Configurations" content="
Run configurations individually in Keboola Flows for more efficient workflow management. You can fine-tune which rows to run in advanced settings for greater 
control.

Use the menu next to each configuration row in the UI to execute specific configurations as needed, optimizing time and resources.
" %}

**Storage vs. component jobs:** 

While component jobs often interact with Keboola Storage, it's important to note the difference in parallel limits. Component jobs don't have a strict parallel 
limit, but [Storage jobs](/storage/jobs/) do, typically capped at 10 parallel jobs but adjustable through Keboola Support. In environments with many users, 
component jobs may queue for Storage job availability, affecting runtime.

## Automating Your Flow
### Execute Tasks in Parallel
In your Flows, you can streamline processing by grouping multiple tasks within one step, also known as a phase. These tasks then run independently in parallel, 
enhancing overall efficiency. Each subsequent phase starts only after the previous one completes all its tasks.

Steps execute sequentially, while tasks within a single step run in parallel. This means that if you have multiple data sources, you can include them all in a single step, allowing them to run simultaneously. 
The same applies to data writers. Additionally, if you have transformations that are independent of the connectors, you can group them within the same step. This is why we can add the Google Drive extractor in the first step.

***Important note for multi-tenant environment users:**
Please be aware of the interaction between Storage and component jobs mentioned [here](https://help.keboola.com/tutorial/onboarding/cheat-sheet/#optimize-with-parallelization). 
If too many tasks are scheduled in a single phase, you may exceed the available Storage job slots, causing delays in your flow’s execution. Limiting the number of concurrent component jobs to 10 
is recommended to avoid reaching Storage capacity limits. You can, of course, configure your flows to execute more jobs in parallel. Keboola will then concurrently execute the jobs to the maximum 
extent possible based on available resources.*

### Continue Despite Failures
Tasks have a **Continue on Failure** option, which is off by default. Turning it on allows the flow to continue even if a task fails, useful for non-critical 
tasks or those expected to succeed later. Keep an eye on task statuses to quickly fix any issues.

### Set Up Notifications
Once your pipeline or workflow is complete, you may not need to manage it actively every day. Stay on top of your flow's performance by setting up notifications for errors or long run times. From the drop-down 
list of the project users, you can select those who will receive the notification, or you can enter another email address. However, consider using a group email to keep the whole team informed and responsive to 
any issues.

You can set up an email notification for four different states: 

- The flow finishes successfully.
- The flow finishes with warnings; the **Continue on Failure** flag determines whether a task should keep running even if there’s an error. This option is off by default. It is particularly helpful when dealing with APIs that are inconsistent or prone to day-to-day errors. 
- The flow fails with an error message.
- The job process takes longer than usual. 

### Automate Execution
**Scheduling:** Commonly, flows are set to run at specific times. To avoid busy periods in a shared environment, consider scheduling slightly off-peak, 
like at 0:15 am, for smoother execution.

**Triggers:** Set flows to automatically start when certain Storage tables are updated, which is ideal for managing dependencies across projects. This ensures 
your projects stay in sync and run efficiently.

Once everything is configured, the flow will automatically run at the scheduled time. Alternatively, you can run the entire flow manually by clicking **Run Flow**.
In **Jobs** you’ll see how the Flow runs and triggers each individual component sequentially. 
The status updates in real-time. Once the last of your extractors finishes, the transformations will be triggered. After they complete, the writer(-s) will run, and the flow will be finalized. 
In the end, you’ll see either a **Success** message or an error notification if something went wrong.
