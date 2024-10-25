---
title: Flows
permalink: /flows/
---

* TOC
{:toc}

*If you already know how flows work in general and want to create your first flow, go to our [Getting Started tutorial](/tutorial/automate/).*

Flows integrate all your project's segments (extractors, writer, transformations, etc.) by creating custom automated processes, chaining components to be run in a specific order, and defining the execution schedule to bring in the newest data available. 

In this section, we'll show you how to organize tasks into steps, set up notifications, and schedule the execution of your flow.

## How Flows Work
First you need to decide what exactly you want you flow to do. What steps it will be composed of and in what order you want them to run.
Then you will determine when you want the entire flow to be executed and how often.

## Using the Flow Builder
The Flow Builder is a feature that allows you to visually build end-to-end data pipelines from a single drag-and-drop user interface.

- Step 1: Access the new Flow Builder feature
- Step 2: Select one or multiple ready-made components
- Step 3: Build out the entire flow
- Step 4: Schedule and automate your flow
- Step 5: Check how your flow is running

### Step 1: Access the new Flow Builder feature
Select from the top menu **Flows -> Flows**. Then click the **Create Flow** button.
   
Give your new flow a name and an easy to understand description. Then click **Create Flow** again. 

This will open up the **Flow Builder** view, where you can view and build your data flow.

### Step 2: Select one or multiple ready-made components 
Start by selecting the components to collect your data from your data sources. The general process is simple:

Select the right component to extract/transform/load data from/to your specified data source.
Authorize Keboola to access data in that component.
Extract/transform/load data.
We will show you an end-to-end example of setting up ready-made components by walking you through reading data files from Google Drive.

We start by clicking on Select Components > Google Drive to collect a file from our Google Drive folder.

We proceed by clicking on the Google Drive component> show details cog > Select or Create Configuration to add new configuration. The configuration grants access to Keboola so it can read the data files on your Google Drive:

Name the configuration (e.g.,  “Google Drive Config”) and click on Create (shown below) and the Configure (not shown):

The wizard guides you through Google’s authorization to give Keboola access to our Google Drive (not shown here, but super easy to follow). 

### Step 3: Build out the entire flow
Continue adding other ready-made components and organize them in a logical flow  or select the ones you want to run in parallel using drag & drop function. 

For each flow:

Select one or multiple ready-made components.
Organize them into a logical flow using the drag and drop functionality.
Configure each component by providing the credentials and instructions for what or where to extract or write or for what code to execute in a transformation.
Save the changes 
Once you’ve built your flow end-to-end simply click on Run flow, to set the data pipeline into action.

### Step 4: Schedule and automate your flow
Within the Flow Builder, click on Set schedule under Automate to set up the orchestration that will automatically run your job at your preferred recurring time. 

That’s the power of automation for you - set it and automate it.

### Step 5: Check how your flow is running
In the tab “All runs” you can check the run history of your flow with its detailed breakdown to each task. 


******************************************************

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

## What’s Next
Having mastered the automation process, you may proceed to the [Development Branches](/tutorial/branches/) part of the tutorial.

## If You Need Help
Feel free to reach out to our [support team](/management/support/) if there’s anything we can help with.



### Optimize with Parallelization 
To improve your pipeline's runtime, consider using parallelization to run multiple configurations at the same time. Keep in mind that parallelization aims 
to speed up execution rather than save costs, as each job uses credits independently.

**Parallelization opportunities:**

1. **At the Flow Level:** Organize tasks into phases within a flow for simultaneous execution.
2. **Among Components:** Set up parallelization for [row-based components](/components/#configuration-rows) like database data source connectors using the same credentials to run multiple tables concurrently. This setup can be done directly in the component's UI.

{% include tip.html title="Execute Individual Configurations" content="
Run configurations individually in Keboola Flows for more efficient workflow management. You can fine-tune which rows to run in advanced settings for greater 
control.

Use the menu next to each configuration row in the UI to execute specific configurations as needed, optimizing time and resources.
" %}

**Storage vs. component jobs:** 

While component jobs often interact with Keboola Storage, it's important to note the difference in parallel limits. Component jobs don't have a strict parallel 
limit, but [Storage jobs](/storage/jobs/) do, typically capped at 10 parallel jobs but adjustable through Keboola Support. In environments with many users, 
component jobs may queue for Storage job availability, affecting runtime.

## Developing a Transformation
### Set Up Workspaces
Jumping straight into coding within the transformations UI might not be the most efficient approach due to execution overhead. Instead, start with a workspace to 
develop and test your scripts, moving them to a transformation configuration only when they're ready. This strategy helps optimize credit usage.

### Handle Inputs and Outputs
Transformations are executed in isolated workspaces, requiring you to use input mappings to access Keboola Storage data. After running your script, output 
mappings determine which data returns to Storage. For instance, to run a simple SQL script like:

```
SELECT 
  "Id" AS ORDER_ID,
  "Date" AS DATE,
  "Amount" AS AMOUNT
FROM "MyInputTable";
```

You need to:

1. Add `MyInputTable` to your input mapping.
2. Modify your script to output to a new table for output mapping.
```
CREATE TABLE MY_NEW_TABLE AS
SELECT 
  "Id" AS ORDER_ID,
  "Date" AS DATE,
  "Amount" AS AMOUNT
FROM "MyInputTable";
```
3. Ensure the new table is included in your output mapping and can be loaded into Storage after the transformation runs.

### Snowflake's Case Sensitivity
Remember, Snowflake treats table names as case-sensitive. Use **double-quotes** to avoid errors, like FROM "MyInputTable" instead of FROM MyInputTable.

### Process Incrementally
Use incremental processing in both input and output mappings to handle data more efficiently, similar to how you manage data in data source connectors.

**Input mapping increments:** To have your transformation handle data in increments, you need input tables generated using incremental loading. This approach
uses a hidden `_timestamp` column in Keboola Storage and allows the input mapping's `Data Changed in the Last` filter to process only newly added or changed 
records, streamlining your transformation workspace. 

If your increments need specific conditions, you can clone the entire input table and specify the increments using a WHERE clause in SQL or similar logic in 
Python or R.

**Output mapping increments:** Similar to data source connectors, you can opt for incremental loading in the output mapping, with or without a primary key. This 
choice allows for either updating existing records (upserting) or simply adding new records (appending).

### Use Variables
Variables are placeholders for values frequently used in your transformation scripts, which is especially useful for common filter conditions.
By defining a value as a variable, you can easily update it in one spot rather than changing it everywhere it appears. Check out more details on using variables
[here](/transformations/variables/).

***Note:** For complex setups, you can even set variables dynamically through API calls when running components.*

### Reuse Code via Shared Codes
Often, you'll find certain code patterns or functions repeated in various transformations for specific tasks. To simplify this, use
[shared code](/transformations/variables/?ref=changelog.keboola.com#shared-code), a feature that lets you store and manage these common
script segments in one place. Changes to shared codes automatically update in every transformation that uses them, keeping your projects 
consistent and easier to manage.

### Choose the Backend Size
**Snowflake SQL transformations:** Users can choose between small (default), medium, or large Snowflake warehouses, balancing performance against cost. 
Performance generally scales up with size, but costs do, too. 

The impact varies by query, so testing and evaluating outcomes is advised. Sometimes, a larger warehouse might be more cost-effective if it significantly 
reduces runtime. More details on costs can be found [here](https://help.keboola.com/management/project/limits/#project-power--time-credits).

**Python and R transformations:** The choice of backend size affects the memory available for processing data. A larger backend is often necessary for handling 
larger datasets or when memory limits are reached rather than for potential speed gains.

### Select Columns Carefully
Avoid using `SELECT *` in your queries. Instead, list out the columns you need. Using SELECT * could lead to problems if columns in the database change. 
Listing columns enhances your query's safety and readability, ensuring you're clear about which data you're using and avoiding issues with your results.

{% include tip.html title="Safe Development Practices" content="
Use development branches for any changes or new additions to ensure a controlled and safe development environment. This method keeps your work organized and
secure. For more on development branches, see this [guide](https://help.keboola.com/tutorial/branches/).
" %}

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
Stay on top of your flow's performance by setting up notifications for errors or long run times. Consider using a group email to keep the whole team informed 
and responsive to any issues.

### Automate Execution
**Scheduling:** Commonly, flows are set to run at specific times. To avoid busy periods in a shared environment, consider scheduling slightly off-peak, 
like at 0:15 am, for smoother execution.

**Triggers:** Set flows to automatically start when certain Storage tables are updated, which is ideal for managing dependencies across projects. This ensures 
your projects stay in sync and run efficiently.




[“3 SEC PAUSE”]
Next, let’s look at how to set up notifications. Once your pipeline or workflow is complete, you may not need to manage it actively every day. Keboola allows you to receive notifications about the status of these tasks. You can set up an email notification for four different states: when the flow finishes successfully, when it finishes with warnings, when it fails with an error message, and when the job process takes longer than usual. The drop-down list will show all the users in the project, or you can enter another email address.
5
Regarding warnings, such a situation might occur when you set a task to continue running even if there’s an error. Let’s go back to the tasks and edit them. 
6.

The "continue on failure" flag determines whether a task should keep running even if there’s an error. It’s common for a flow with multiple extractors to have one fail occasionally. However, you don’t want the entire flow to stop because of this. For example, if the Snowflake extractor encounters an error for any reason, the entire flow will not stop; instead, the jobs will continue running. You have set up an email notification for warnings, so you’ll be notified if this task fails.
At that point, you can investigate what caused the error in that specific task. This feature is particularly helpful when dealing with APIs that are inconsistent or prone to day-to-day errors. Now that everything is configured, the flow will automatically run at the scheduled time. Alternatively, you can run the entire flow manually by clicking "Run Flow."
If you go to "Jobs" now, you’ll see how the Flow runs and triggers each individual component sequentially. 
The status updates in real-time, so you can observe that first it first runs the Snowflake and Google Drive extractors simultaneously. Once the last of these finishes, the transformations will be triggered. After they complete, the writer will run, and the flow will be finalized. In the end, you’ll see either a "Success" message or an error notification if something went wrong.
