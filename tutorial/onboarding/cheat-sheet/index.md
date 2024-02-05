---
title: "Cheat Sheet: Best Practices"
permalink: /tutorial/onboarding/cheat-sheet/
---

How you use Keboola can differ significantly. From setting up automated data pipelines with Flows to managing components such as data sources, destinations, 
apps, or transformations, this guide outlines key best practices to improve your workflow and enhance your experience, no matter the complexity of your project.

* TOC
{:toc}

## Data Source Extraction
### Using the Right Credentials
When using Keboola's source connectors, correct authorization is important: credentials and connection details for source databases, or tokens and API keys for 
services. It's best to use technical user credentials made just for Keboola integrations to provent problems with permission, account changes, or password resets 
that personal credentials might cause.

### Making Data Sources Available
Make sure Keboola can reach the data sources you want to use. Databases on internal servers or in private clouds might not be accessible by default. In such 
cases, whitelist Keboola's IP addresses, establish an SSH tunnel (if supported by the Keboola component), or request Keboola to set up a VPN server. Your data 
source's administrators or owners along with Keboola's support team can solve any access problems.

### Choosing What to Extract
Before pulling data from sources like MS SQL Server, PostgreSQL, MySQL, Google Analytics, or Facebook Ads, think carefully about what you really need. Don't waste 
credits. Start with a small batch to check its usefulness before fully replicating your data source's history.

### Incremental Fetching and Loading
**Incremental fetching:** Keboola allows data to be fetched in increments, which is useful for large datasets to save time compared to full extractions. This can 
be done through specific parameters or Keboola’s database connectors.

**Incremental loading:** This involves adding the fetched data to Keboola Storage bit by bit. Using a primary key helps efficiently update existing records and 
add new ones. Without a primary key, data is simply appended.

***Note:** Some connectors handle incremental fetching and loading automatically; it is typically indicated in their configuration UI.*

### Optimizing with Parallelization 
To improve your pipeline's runtime, consider using parallelization to run multiple configurations at the same time. Keep in mind that parallelization aims 
to speed up execution rather than save costs, as each job uses credits independently.

**Parallelization opportunities:**

1. **At the Flow Level:** Organize tasks into phases within a flow for simultaneous execution.
2. **Among Components:** Set up parallelization for [row-based components](/components/#configuration-rows) like database data sources (extractors) using the same credentials to run multiple tables concurrently. This setup can be done directly in the component's UI.

{% include tip.html title="Execute Individual Configurations" content="
Run configurations individually in Keboola Flows for more efficient workflow management. You can fine-tune which rows to run in advanced settings for greater 
control.

Use the menu next to each configuration row in the UI for executing specific configurations as needed, optimizing time and resources.
" %}

**Storage vs. component jobs:** 

While component jobs often interact with Keboola Storage, it's important to note the difference in parallel limits. Component jobs don't have a strict parallel 
limit, but [Storage jobs](/storage/jobs/) do, typically capped at 10 parallel jobs but adjustable through Keboola Support. In environments with many users, 
component jobs may queue for Storage job availability, affecting runtime.

## Developing a Transformation
### Setting up Workspaces
Jumping straight into coding within the transformations UI might not be the most efficient approach due to execution overhead. Instead, start with a workspace to 
develop and test your scripts, moving them to a transformation configuration only when they're ready. This strategy helps optimize credit usage.

### Handling Inputs and Outputs
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

### Case Sensitivity in Snowflake
Remember, Snowflake treats table names as case-sensitive. Use **double quotes** to avoid errors, like FROM "MyInputTable" instead of FROM MyInputTable.

### Incremental Processing
Use incremental processing in both input and output mappings to handle data more efficiently, similar to how you manage data in source components.

**Input mapping increments:** To have your transformation handle data in increments, you need input tables generated using incremental loading. This approach
uses a hidden `_timestamp` column in Keboola Storage and allows the input mapping's the `Data Changed in the Last` filter to process only newly added or changed 
records, streamlining your transformation workspace. 

If your increments need specific conditions, you can clone the entire input table and specify the increments using a WHERE clause in SQL or similar logic in 
Python or R.

**Output mapping increments:** Similar to data source components, you can opt for incremental loading in the output mapping, with or without a primary key. This 
choice allows for either updating existing records (upserting) or simply adding new records (appending).

### Using Variables
Variables are placeholders for values you frequently use in your transformation scripts, especially useful for common filter conditions.
By defining a value as a variable, you can easily update it in one spot, rather than changing it everywhere it appears. Check out more details on using variables 
[here](/transformations/variables/).

***Note:** For complex setups, you can even set variables dynamically through API calls when running components.*

### Reusing Code with Shared Codes
Often, you'll find certain code patterns or functions repeated in various transformations for specific tasks. To simplify this, use
[shared code](/transformations/variables/?ref=changelog.keboola.com#shared-code), a feature that lets you store and manage these common
script segments in one place. Changes to shared codes automatically update in every transformation that uses them, keeping your projects 
consistent and easier to manage.

### Choosing the Right Backend Size
**Snowflake SQL transformations:** Users can choose between small (default), medium, or large Snowflake warehouses, balancing performance against cost. 
Performance generally scales up with size, but costs do too. 

The impact varies by query, so testing and evaluating outcomes is advised. Sometimes, a larger warehouse might be more cost-effective if it significantly 
reduces runtime. More details on costs can be found [here](https://help.keboola.com/management/project/limits/#project-power--time-credits).

**Python and R transformations:** The choice of backend size affects the memory available for processing data. A larger backend is often necessary for handling larger datasets or when memory limits are reached, rather than for potential speed gains.

### Selecting Columns Carefully
Avoid using `SELECT *` in your queries. Instead, list out the columns you need. Using SELECT * could lead to problems if columns in the database change. Listing columns enhances your query's safety and readability, ensuring you're clear about which data you're using and avoiding issues with your results.

{% include tip.html title="Safe Development Practices" content="
Use Development branches for any changes or new additions to ensure a controlled and safe development environment. This method keeps your work organized and secure. For more on Development branches, see this [guide](https://help.keboola.com/tutorial/branches/).
" %}

## Automating Your Flow
### Workflow with Parallel Execution
In your Flows, you can streamline processing by grouping multiple tasks within one step, also known as a phase. These tasks then run independently in parallel, 
enhancing overall efficiency. Subsequent steps (phases) will commence only after the completion of all tasks within the preceding step.

### Continue on Failure
Every individual task within your flow features a **Continue on Failure** setting. By default, this setting is *disabled*, meaning an error in any single task 
will halt the entire flow execution, resulting in an error status. Enabling **Continue on Failure** permits the flow to persist even if a single task encounters 
an issue. 

This is beneficial for tasks that may regularly fail due to specific conditions, with the expectation that they will be executed successfully in subsequent runs. 
Alternatively, it is suitable for independent tasks whose failure does not impact the rest of the flow. However, monitoring execution statuses becomes crucial to 
promptly address potential errors and implement necessary fixes.

### Notifications for Monitoring
For a seamless execution of your use-cases, staying informed about errors or unusual execution times in your flows is crucial. Configure **notifications** 
within your flow to receive timely updates. Teams often opt to configure a group mailbox for specific user groups, ensuring that all team members receive 
notifications regarding errors, warnings, or instances where the flow runs longer than the expected duration. This proactive approach enhances awareness and 
facilitates prompt responses to any issues that may arise. 

### Automating Flows
**Date & Time Schedule:** The most common setup for automating flows involves scheduling them to run at specific time slots. In a multi-tenant stack, it's 
advisable to avoid peak time slots, such as midnight, to optimize resource availability. A simple adjustment, like scheduling your flow for 0:15 am, can 
positively impact execution, minimizing competition for resources within the multi-tenant environment.

**Triggered Execution:** A triggered flow is configured to monitor specific tables in the Storage. Once there are updates in the selected Storage table, the flow 
is automatically executed. This setup is particularly useful in multi-project scenarios where one project's flow relies on processes in another project. By 
linking tables through a data catalog and scheduling a flow on trigger, dependencies between projects are efficiently managed.

## Writing Data to a Destination
While some practices overlap with those for extracting data from sources — specifically, [Proper User Credentials](#proper-user-credentials), 
[Accessibility of Your Data Sources](#accessibility-of-your-data-sources), and 
[Optimizing with Parallelization](#optimizing-with-parallelization) — additional considerations come into play when writing data from Keboola to a destination.

### Verifying Adequate Permissions
This builds upon the importance emphasized in the [Proper User Credentials](#proper-user-credentials) aspect discussed in the 
[Extracting Data from Sources](extracting-data-from-sources) chapter. It underscores the necessity of ensuring you possess the requisite permissions when 
attempting to write data to a destination. Frequently, specific privileges are essential for this task, and they may not be automatically granted to a broad 
spectrum of users within an organization. Insufficient permissions often manifest as errors when writing data to a destination. In such cases, Keboola Support is 
available to assist in identifying the specific permissions required for a particular component.

### Who Gets Access to Data
In the Keboola project, you have a precise understanding of who can access the integrated data. However, when writing data to a destination, whether it's a 
database, object storage, or an API/service, you are essentially extending access to those data to users who have privileges for that specific destination. It is 
crucial to be vigilant and ensure that you do not inadvertently share your data with unintended recipients.

### Incremental Processing
To optimize the efficiency of your data writing operations, consider incorporating incremental processing, a strategy analogous to that used in data extraction or 
transformation processes described earlier. This optimization is particularly beneficial in Keboola, where it enables the selective writing of data that has 
changed in Keboola Storage since the last successful execution, ensuring a more streamlined and resource-efficient process.

For certain components, especially those designed for database data destinations, an additional advantage is the presence of an **Automatic Incremental Load**
feature. This feature involves the component maintaining an internal state file within its configuration, recording the timestamp of its last successful 
execution. Keboola utilizes this information to identify and capture only the data that has been added or modified in Keboola Storage since the last execution. On 
the destination side, the component facilitates an upsert operation, intelligently inserting new data and updating existing records, rather than opting for a 
complete rewrite or simple append-only approach.

In scenarios where certain APIs or services lack built-in mechanisms for efficient data updates, leveraging the incremental feature of the respective component 
becomes even more critical. Many data destination components share the input mapping logic with transformations, allowing the application of similar principles. 
Some components go a step further by incorporating sophisticated mechanisms, as mentioned earlier, to enhance the incremental processing capabilities.

By adopting incremental processing, you not only optimize the performance of data writing operations but also ensure a more resource-efficient and intelligent 
handling of data updates, tailored to the specific requirements of the destination.

### Caution Before Data Writing
To be straightforward, it's crucial to thoroughly understand the implications of your actions. While Keboola offers a straightforward process for restoring data in case of accidental corruption, this may not hold true for the destination where you intend to write your data. The restoration of data in such destinations can be challenging, and in certain instances, it might even be impossible. Therefore, exercising heightened caution is strongly advised. Make sure you are well-informed and deliberate in your decisions when it comes to writing data, recognizing that the ease of recovery in Keboola may not necessarily extend to all destinations.

## Job Log and Troubleshooting
Whether you're a seasoned data engineer or just starting out, encountering errors during development is inevitable. 
Here are some tips for effectively troubleshooting errors.

### Job Log
The job log is a valuable resource providing insights into the execution of a job, including the entity or process that executed it, the timestamp 
of its execution, and the duration it took.

**Mapping section:** The log incorporates a mapping section that delineates the tables involved in the process. In extraction operations, the output section 
enumerates all tables extracted from the source and loaded into Keboola Storage, essentially representing the job's output. In the context of transformations, 
both input and output sections are typically present, revealing the tables used in the Input and Output mappings of that transformation—clarifying the tables 
loaded and produced.

When writing data to a destination using a data destination component, the input section lists the tables used for the writing operation. However, as the writing 
operation doesn't generate new tables in Keboola, the output section remains empty.

**Log:** The job log further includes a detailed account of individual actions taken during the job execution. This initial section is particularly valuable for 
debugging, providing a chronological overview of actions performed. Identifying the step at which the processing failed can offer crucial insights into what to 
investigate during the debugging process.

By delving into the job log, you gain a comprehensive understanding of the job's execution, aiding in the identification and resolution of errors encountered 
during development.

### AI Error Explanation
In your project settings, take advantage of the **AI Error Explanation** feature to enhance your error troubleshooting capabilities. This feature utilizes 
artificial intelligence to translate potentially complex error messages into a more user-friendly format. By enabling this feature, Keboola aims to provide 
helpful suggestions on what specific aspects to investigate as a user.

### Internal or Application Errors
If you encounter an error message indicating "Internal" or "Application Error," you should reach out to the Keboola support team. These errors typically signify 
unexpected issues occurring beneath the surface, and our support engineers will thoroughly examine detailed platform logs to assist you in resolving the problem.

### Debugging Keboola Jobs
Keboola jobs, from data extraction to transformations, often involve moving data to and from Keboola Storage, usually through files like CSVs. To help pinpoint 
errors, you can turn on Debug Mode in your user settings. This adds an option in component settings for running a debug job, which goes through the job's steps 
but stops before loading data into Keboola Storage, preventing data mishaps.

The debug job creates a zip file of all generated files during the job, stored in **Keboola File Storage**, for detailed inspection. This is handy for uncovering 
issues like incorrect data encoding or formatting errors that cause extraction problems, making it easier to diagnose and fix errors.

{% include tip.html title="Unlock the /raw mode" content="
Discover a powerful Keboola feature: access and editing of any configuration's raw JSON, including components and transformations, via Debug Mode. For direct 
access, simply add /raw to the URL. This advanced option is great for detailed settings, like using processors, providing a versatile way to tailor configurations 
to your specific needs. Explore /raw mode to unlock enhanced control over your Keboola projects.
" %}
