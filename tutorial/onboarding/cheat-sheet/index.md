---
title: "Cheat Sheet: Best Practices"
permalink: /tutorial/onboarding/cheat-sheet/
---

How you use Keboola can differ significantly. From setting up automated data pipelines with Flows to managing components such as data sources, destinations, 
apps, or transformations, this guide outlines key best practices to improve your workflow and enhance your experience, no matter the complexity of your project.

* TOC
{:toc}

## Extracting from Data Sources
### Use the Right Credentials
When using Keboola's source connectors, correct authorization is important: credentials and connection details for source databases or tokens and API keys for 
services. It's best to use technical user credentials made just for Keboola integrations to prevent problems with permission, account changes, or password resets 
that personal credentials might cause.

### Access Data Sources
Make sure Keboola can reach the data sources you want to use. Databases on internal servers or in private clouds might not be accessible by default. In such 
cases, whitelist Keboola's IP addresses, establish an SSH tunnel (if supported by the Keboola component), or request that Keboola set up a VPN server. Your data 
source's administrators, owners, and Keboola's support team can solve any access problems.

### Choose What to Extract
Before pulling data from sources like MS SQL Server, PostgreSQL, MySQL, Google Analytics, or Facebook Ads, think carefully about what you really need. Don't waste 
credits. Start with a small batch to check its usefulness before fully replicating your data source's history.

### Fetch and Load Incrementally
**Incremental fetching:** Keboola allows data to be fetched in increments, which is useful for large datasets to save time compared to full extractions. This can 
be done through specific parameters or Keboola’s database connectors.

**Incremental loading:** This involves adding the fetched data to Keboola Storage bit by bit. Using a primary key helps efficiently update existing records and 
add new ones. Without a primary key, data is simply appended.

***Note:** Some connectors handle incremental fetching and loading automatically; it is typically indicated in their configuration UI.*

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

## Writing to Data Destinations
Writing data to a destination shares some common practices with data extraction, such as [using the right credentials](#use-the-right-credentials), 
ensuring [data source accessibility](#access-data-sources), and [using parallelization](#optimize-with-parallelization).
However, additional factors are crucial in this context.

### Ensure Proper Permissions
Similar to [extracting data](#extracting-from-data-sources), writing data requires having the right [permissions](#use-the-right-credentials). 
Often, specific rights are needed, which may not be widely available to all organization members. Errors during data write operations usually 
indicate permission issues. The Keboola support team is ready to help identify the needed permissions.

### Manage Data Access
When data is written to a destination, you're extending access to users with rights to that destination. It's vital to carefully manage who gets access to ensure 
data isn't shared with unintended parties.

### Process Incrementally
Incremental processing, which writes only the changed data since the last execution, is key to efficient data writing. This method is especially useful in Keboola 
for maintaining performance and resource efficiency. Some database components offer an **Automatic Incremental Load** feature, using an internal state file to 
track changes and perform upsert operations intelligently.

### Write Data Cautiously
Understand the impact of writing data to a destination. While Keboola can easily restore data in case of issues, the same may not be true for the destination. 
Restoring data at the destination can be difficult or impossible, so proceed with caution to avoid irreversible data loss.

## Job Logs and Error Troubleshooting
Errors are a common part of development, whether you're experienced or new. Here are some tips for effectively troubleshooting errors.

### Understand Job Logs
Job logs offer crucial details on job executions, such as who ran the job, when it was run, and how long it took.

**Mapping section:** 
This part shows the tables involved in the job. For extractions, it lists the tables taken from the source to Keboola Storage. For transformations, it shows both 
input and output tables, clarifying what was loaded and produced. Data writing jobs will list input tables but have no output tables listed, as the writing 
operation doesn't generate new tables in Keboola.

**Log details:** 
This section breaks down each action in the job, helping pinpoint where failures occurred for easier debugging.

### Let AI Explain Errors
Enable **AI Error Explanation** in project settings to understand errors better. It uses AI to simplify error messages, offering direct insights 
on what to fix.

### Internal and Application Errors
If you see the "Internal Error" or "Application Error" messages, contact the Keboola support team. These errors mean deeper issues; our support team 
will dig into platform logs to help solve them.

### Debug Keboola Jobs
Keboola jobs, from data extraction to transformations, often involve moving data to and from Keboola Storage, usually through files like CSVs. To help pinpoint 
errors, you can turn on Debug Mode in your user settings. This adds an option in component settings for running a debug job, which goes through the job's steps 
but stops before loading data into Keboola Storage, preventing data mishaps.

The debug job creates a zip file of all files generated during the job, stored in **Keboola File Storage**, for detailed inspection. This is handy for uncovering 
issues like incorrect data encoding or formatting errors that cause extraction problems, making it easier to diagnose and fix errors.

{% include tip.html title="Unlock the /raw mode" content="
Discover a powerful Keboola feature: access and editing of any configuration's raw JSON, including components and transformations, via Debug Mode. For direct 
access, simply add /raw to the URL. This advanced option is great for detailed settings, like using processors, providing a versatile way to tailor configurations 
to your specific needs. Explore /raw mode to unlock enhanced control over your Keboola projects.
" %}
