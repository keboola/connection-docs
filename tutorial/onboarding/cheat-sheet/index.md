---
title: "Cheat Sheet: Best Practices"
permalink: /tutorial/onboarding/cheat-sheet/
---

In the diverse landscape of Keboola, the nature and design of your use-case may vary widely. Whether you are orchestrating the automation of your data pipeline 
processing through Flows or configuring components like data sources, data destinations, applications, or transformations, this document serves as a guide to 
essential best practices. Regardless of the intricacies of your project, these recommendations aim to optimize your workflow and ensure a smooth experience with 
the core building blocks of a standard use case in Keboola.

* TOC
{:toc}

## Extracting Data from Sources
### User Credentials
When working with data source components in Keboola, proper authorization is crucial. This involves providing credentials and connection details for source 
databases or relevant tokens and API keys for extracting data from services. It is advisable to use technical user credentials created specifically for Keboola 
integrations, as using the credentials of a real person may present challenges related to permissions, potential changes or terminations, and password resets.

### Accessibility of Data Sources
Ensure that the data sources you intend to integrate are accessible from the Keboola platform. Internal databases running on on-premise servers or private clouds 
may not be accessible by default. In such cases, consider whitelisting Keboola's IP addresses, establishing an SSH tunnel (if supported by the Keboola component), 
or requesting Keboola to set up a VPN server. Collaboration with administrators or owners of the data source on your side, coupled with support from the Keboola 
team, will help address any accessibility issues.

### What You're Extracting
When integrating typical data sources such as MS SQL Server, PostgreSQL, MySQL, or services like Google Analytics and Facebook Ads, resist the temptation to 
extract everything without evaluating necessity. This approach can lead to unnecessary credit spending. It is recommended to initially extract a limited batch of 
data to verify its relevance before proceeding with a full replication of the entire data history from the source.

### Incremental Fetching and Loading
**Incremental fetching:** Keboola's ability to read data from the source in increments, either through specific parameters or Keboola's incremental fetching 
options in database connectors, is beneficial for larger datasets. This setup is particularly useful when the full extraction time exceeds that of extracting 
increments only.

**Incremental loading:** Concurrently, incremental loading involves incrementally loading the extracted data into Keboola Storage. Setting a primary key for the 
Keboola Storage table allows for efficient incremental loading, as it processes upsert operations—appending new records and updating existing ones based on 
matching primary key values. Incremental load without a primary key set would always perform an append operation.

It's important to note that certain connectors may automatically implement both incremental fetching and loading without requiring manual setup by users. 
This information is usually highlighted in the configuration UI, providing users with transparency about the implemented behaviour.

### Optimize with Parallelization 
To optimize the overall runtime of your pipeline, consider employing parallelization to execute multiple configurations simultaneously. It's essential to recognize that while parallelization can significantly reduce the total runtime, each individual job consumes credits independently. Therefore, parallelization is a tool for optimizing the execution timeline rather than cost.

**Where to apply parallelization:**

1. **Flow level:** Within a flow, tasks can be organized into phases for parallel execution.
2. **Components:** For [row-based components](/components/#configuration-rows), you can set parallelization. Examples include database e extractors (data
sources), where multiple tables share the same credentials. Configuration rows allow for parallel execution, and this can be configured in the 
component UI.

{% include tip.html title="Execute Individual Configurations" content="
Enhance your workflow efficiency by executing individual configurations separately in Keboola Flow automation. In advanced settings, edit parameters to
selectively run specific rows, providing nuanced control over your data processing.

Additionally, in the user interface, utilize the three-dotted menu next to each configuration row for a quick and convenient way to execute only the needed
configurations. This feature streamlines your workflow, saving time and resources while maintaining precision in your data operations.
" %}

**Storage jobs vs. component jobs:** 

Most Keboola components interact with Keboola Storage during execution. Data source components first extract data from the source and then trigger 
a [Storage job](/storage/jobs/) to import the data into Keboola Storage. It's crucial to understand that there is no strict limit on parallel component jobs, 
but there is a limit on the maximum parallel Storage jobs in a project. In multi-tenant deployments, multiple component jobs might wait for available Storage job 
slots, potentially extending the overall runtime. The default limit for parallel Storage jobs is 10, but it can be increased through Keboola Support.

## Developing a Transformation
### Using a Workspace
It's common for users to directly dive into the Transformations section of the UI to set up and test scripts. However, this approach may not be optimal. Executing a transformation component, whether it involves Python, R, or SQL transformations, always incurs some overhead from the component execution layered on top of the script execution. This can result in unnecessary credit consumption during code debugging.

Our recommendation is to start by creating a Workspace for development purposes. Develop and test your code within the Workspace environment. Once your script is functioning correctly, you can then transfer it to a Transformation configuration and execute it, ensuring more efficient credit usage.

### Input and Output Mapping
Every transformation operates within its designated, temporary transformation workspace. When a Transformation is executed, it establishes this distinct 
workspace, which is isolated from the primary Keboola Storage. Consequently, within your code, you cannot directly access all Storage Objects; instead, you must 
load selected Storage objects into your transformation using an input mapping.

Upon execution, a transformation initially processes the configured input mapping, loading the specified datasets into the transformation workspace. 
Subsequently, your script is executed. Towards the end of the transformation, it processes the configured output mapping. Only objects specified in the output 
mapping section will be loaded back into Storage upon completion of the transformation execution.

Let’s consider a hypothetical scenario where your transformation script, developed in your workspace, looks like this:

```
SELECT 
  "Id" AS ORDER_ID,
  "Date" AS DATE,
  "Amount" AS AMOUNT
FROM "MyInputTable";
```

To successfully execute this code in a Transformation, you would need to make three essential edits:

1. **Adding** `MyInputTable` **to an input mapping:** Ensure that `MyInputTable` is included in the input mapping of your transformation.
2. **Creating an object within your script for output mapping:** Include the following statement in your script to create an object that can be processed by output mapping:
```
CREATE TABLE MY_NEW_TABLE AS
SELECT 
  "Id" AS ORDER_ID,
  "Date" AS DATE,
  "Amount" AS AMOUNT
FROM "MyInputTable";
```
3. **Adding** `MY_NEW_TABLE` **to the output mapping:** Include `MY_NEW_TABLE` in the output mapping so that it is loaded into Storage after the transformation is executed.

### Snowflake is Case Sensitive
This is a frequent challenge for new users and is specific to projects utilizing a Snowflake Storage backend. When incorporating a table named “MyInputTable” 
into your input mapping, it is imperative to employ double quotes when referencing that table in your code.

For instance, using `FROM MyInputTable` would be interpreted by Snowflake as `FROM MYINPUTTABLE`, resulting in a non-existent object and causing the script to 
fail. Therefore, it is essential to use `FROM "MyInputTable"` to ensure proper referencing in a Snowflake environment.

### Incremental Processing
Similar to leveraging incremental fetching and loading with data source components, you can optimize your transformation through incremental processing.

**Increments in the input mapping:** You can configure your transformation to process increments of data each time it runs. This requires the input tables 
to be generated by a component (data source connector or another transformation) using incremental loading. This setup generates a concealed technical column 
named `_timestamp` in Keboola Storage, which is then utilized by the input mapping. Here, you can configure the `Data Changed in the Last` filter, automatically 
detecting records added/changed within the selected timeframe. Consequently, your Transformation Workspace operates solely on that increment, eliminating the need 
to address it in your script.

Alternatively, if you need to identify your increment based on multiple conditions, you can allow the Transformation to clone the entire input table.
Subsequently, you can define the processed increment using a WHERE condition in your SQL script or an equivalent logic in Python or R.

**Increments in the output mapping:** This is analogous to the incremental loading setup of data source components. You can choose to implement incremental 
loading with or without a primary key, resulting in either upserting or appending data, respectively.

### Using Variables
Keboola transformations offer the convenience of Variables. A Variable is an element designed to store a value that can be repeatedly utilized in your 
transformation script. This becomes particularly handy when employing a filtering condition in various sections of your script. By setting it as a variable, you 
simplify the process of updating the value. If a change is needed, you can modify it in one place rather than across multiple instances. For more information on 
variables, refer to [this](/transformations/variables/).

It's important to highlight that in more advanced setups, Variables can also be dynamically provided via API calls during the execution of components.

### Shared Codes for Repeated Tasks
Frequently, there are coding patterns or functions that need to be replicated across multiple Transformations. These could be recurring script segments that serve 
a specific purpose. To streamline this process, you can create what is known as [shared code](/transformations/variables/?ref=changelog.keboola.com#shared-code). 
Shared codes allow you to define and maintain these common script segments in one centralized location. Any modifications made to the shared code are 
automatically reflected in all transformations utilizing it. This ensures consistency and simplifies maintenance across your projects.

### Optimizing Performance with Dynamic Backends
For **Snowflake SQL transformations**, users have the flexibility to choose between Small (default), Medium, or Large Snowflake Warehouses. While larger warehouses 
generally offer improved performance, they also incur higher costs. The detailed impact on costs is available [here](https://help.keboola.com/management/project/limits/#project-power--time-credits).

In Snowflake, the performance of larger warehouses tends to exhibit a linear increase, with a Transformation executed on Medium potentially being twice as fast as 
on Small. However, the actual impact depends on the specific queries. There is no universal rule for determining whether a larger warehouse will optimize time and 
costs, so the best approach is to experiment and measure the results.

It's worth noting that executing on a larger backend can sometimes be significantly faster, resulting in a lower cost for the Transformation compared to running 
it on a Small backend.

For **Python and R transformations**, the backend size primarily influences available memory, enabling the processing of larger datasets in your scripts. Users 
commonly opt for a larger backend when their Transformation fails due to memory constraints, rather than exploring larger backends to assess potential performance 
improvements.

### Avoiding Using SELECT *
Resist the temptation to use `SELECT *` in your queries. Opt for a more precise approach by explicitly listing all the columns you intend to select. When you 
employ `SELECT *`, you risk potential issues if new columns are added, existing ones are removed, or if there are any changes in column names. 

This practice not only enhances the safety of your queries but also improves readability. By specifying each column explicitly, you maintain clarity in your code, 
making it evident which columns you are selecting from the table. Even if you end up including all columns, the verbatim list ensures transparency and avoids 
unnecessary complications in your output data.

{% include tip.html title="Leverage Development Branches" content="
For all development tasks, whether adding new components, editing existing configurations, or refining transformations, maximize safety by making use of
Development branches. This strategic approach ensures a secure and controlled environment for your development efforts. For detailed guidance on utilizing
Development branches effectively, refer to the documentation [here](https://help.keboola.com/tutorial/branches/).
This practice not only enhances the safety of your development processes but also provides a structured and organized approach to managing changes in your
Keboola environment.
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

### Debug Job Feature
Nearly every Keboola job involves interactions with Keboola Storage tables, whether it's loading data during extraction or reading (and producing) data during 
a transformation. Many components utilize the Keboola Storage API to exchange data in the form of files. For example, when extracting data using a data source 
component, the component builds a CSV file, providing it to Keboola Storage along with loading instructions.

To aid in troubleshooting errors, users can activate the **Debug Mode** feature in their user settings (the User Features section). This unlocks a new UI element 
in component configurations, allowing the execution of a debug job. This feature is particularly useful when extracting data into Keboola and encountering errors. 
The **debug job** replicates standard processing steps but halts before loading data into Keboola Storage. This allows users to review each step without the risk 
of data corruption. The debug job generates a zip file containing all files produced during each processing step, accessible in **Keboola File Storage**. This 
enables users to delve into the files for further debugging. For instance, unexpected data encoding on the source or formatting issues leading to extraction 
failure can be identified by exploring these files, facilitating a more precise understanding of the problem and its resolution.

{% include tip.html title="Unlock the /raw mode" content="
Discover a powerful feature in Keboola: the ability to access and edit the raw JSON of every configuration, be it a component or transformation, using
the Debug Mode. If you prefer a direct route, simply add /raw to the end of the URL address. This advanced capability proves invaluable for performing intricate
settings, such as utilizing processors, offering a flexible and efficient way to tailor configurations to your specific needs. Explore the /raw mode to unlock a
deeper level of control in your Keboola projects.
" %}
