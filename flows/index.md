---
title: Flows
permalink: /flows/
---

* TOC
{:toc}

*If you already know how flows work in general and want to create your first flow, go to our Getting Started tutorial.*

Flows allow you to bring all the pieces of your project together. This is where you can build your custom automated processes, chain all the components to be run in a specific order, 
and define when the process should be executed. In this section, we'll show you how to organize tasks into steps, set up notifications, and schedule the execution of your flow.


## How Flows Work

## Creating a Flow

We will go into the Flows section and create a new one, which we will call "Daily Run."
[“3 SEC PAUSE”]
Now we can start by chaining the individual steps. The first task we want to run is the Snowflake source connector. Here, you will see a list of components such as extractors, applications, and writers. Next to that is a list of transformations, flows and finally, you'll find the Data Apps. We'll select the Snowflake writer, which you can think of as your own internal database, like Postgres or MySQL.
[“3 SEC PAUSE”]
Next, we want to transform the data. Click on the Transformations button and select the Snowflake transformation.
[“5 SEC PAUSE”]

Finally, we will select the Snowflake writer and configure it accordingly.

3

Typically, the process begins by extracting data from a database, followed by the transformation phase, and then the output is written to a database or BI tool. 

[“3 SEC PAUSE”]

Steps are executed sequentially, but tasks within a single step run in parallel. This means that if we had multiple sources we extract the data from, we can include them all in a single step, and they would run simultaneously. 

The same goes for data writers, and there were transformations independent of the connectors, we could group them within the same step as well. This is why we can add the Google Drive extractor into the first step.


4

Now that we’ve specified what we want the process to do, we need to specify when it should be executed. Click on “SAVE” and then “Set schedule.” By default, it’s set to run once a day. However, there are some frequently used presets available—every 15 minutes, every hour, or every week. If we want to set a custom schedule, we can click on "Custom." Here, we can define specific times. For instance, if we want the flow to run four times a day, we can set it to run at midnight, 6:00 AM, 12:00 PM, and 6:00 PM, at the 35th minute of each hour. Please note that the time zone is by default set to UTC.

[“3 SEC PAUSE”]
We recommend adjusting it to your local time zone. Doing so is useful because daylight saving time changes on different days around the world. Ensuring that your data is refreshed at the right time is especially important for reports that need to be ready by, say, 9:00 AM for your executives to review in the morning. Now that we’ve set up the schedule, we can hit "Save" and move on.
[“3 SEC PAUSE”]
Next, we'll show you how to set up notifications. Once your pipeline or workflow is complete, you may not need to manage it actively every day. Keboola allows you to receive notifications about the status of these tasks. You can set up an email notification for four different states: when the flow finishes successfully, when it finishes with warnings, when it fails with an error message, and when the job process takes longer than usual. The drop-down list will show all the users in the project, or you can set another email address.
5
Regarding warnings, such a situation might occur when you set a task to continue running even if there’s an error. Let’s go back to the tasks and edit them. 
6.

The "continue on failure" flag determines whether a task should keep running even if there’s an error. It’s common for a flow with multiple extractors to have one fail occasionally. However, you don’t want the entire flow to stop because of this. For example, if the Snowflake extractor encounters an error for any reason, the entire flow will not stop— instead, the jobs will continue running. We have set up an email notification for the warning, so we will be notified if this one fails.
At that point, we can investigate what caused the error in that specific task. This feature is particularly helpful when dealing with APIs that are inconsistent or prone to day-to-day errors. Now that everything is configured, the flow will automatically run at the scheduled time. Alternatively, you can run the entire flow manually by clicking on "Run Flow."
If we go to the "Jobs" now, we will see how the Flow runs and how it triggers each individual component sequentially. 
The status is updated in real-time, so you can see that first it’s running the Snowflake and Google Drive connectors simultaneously. Once the last of these finishes, the transformations will be triggered. After they complete, the destination connector will run, and the flow will be finalized. In the end, you’ll see either a "Success" message or an error notification if something went wrong.
