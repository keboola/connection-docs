---
title: Part 4 - Automation - Setting up Orchestrator
permalink: /tutorial/automate/
---

So far, you have learned to use Keboola Connection to

- load tables [manually](/tutorial/load/) or [using an extractor](/tutorial/load/database/), 
- [manipulate data in SQL](/tutorial/manipulate/), and
- write data [into Tableau BI](/tutorial/write/) or [into GoodData BI](/tutorial/write/gooddata/).
 
Connecting various systems together alone makes Keboola Connection a powerful and easy-to-use tool. 
However, the above steps must be done repeatedly to bring in the newest data available. 

Use **Orchestrator**  

- to specify what tasks should be executed in what order (orchestrate tasks) and
- to configure the automatic execution (schedule orchestrated tasks).

Go to the **Orchestrations** section of Keboola Connection, and

{: .image-popup}
![Screenshot - Orchestrations Introduction](/tutorial/automate/orchestrator-intro.png)

click on **New Orchestration** to create a new orchestration. Assign it the name *Opportunities*:

{: .image-popup}
![Screenshot - Create new Orchestration](/tutorial/automate/orchestrator-create-new.png)

To configure the orchestration, first add some tasks to it:

{: .image-popup}
![Screenshot - Orchestration Detail](/tutorial/automate/orchestration-detail-1.png)

Click **New Task**:

{: .image-popup}
![Screenshot - Orchestration Tasks Introduction](/tutorial/automate/orchestration-tasks-1.png)

The automation tasks are displayed based on what steps of the tutorial you have taken.
It is not possible to automate the [manual upload](/tutorial/load/). If you haven't gone through all parts of the tutorial,
these are the available steps:

- [load data using GoogleDrive Extractor](/tutorial/load/googledrive/)
- [load data using Database Extractor](/tutorial/load/database/)
- [manipulate data using Transformations](/tutorial/manipulate/)
- [write data into Tableau BI](/tutorial/write/)
- [write data into GoodData BI](/tutorial/write/gooddata/)

First, select GoogleDrive and then click on the configuration *User levels*.

{: .image-popup}
![Screenshot - Orchestration Tasks Editing](/tutorial/automate/orchestration-tasks-2.png)

Continue adding all the tasks you want. The following configuration will extract data from the database 
and from the Google Drive sheet. After being transformed for Tableau, the data will be written to Tableau.

{: .image-popup}
![Screenshot - Orchestration Tasks Setup for Tableau](/tutorial/automate/orchestration-tasks-setup-1.png)

Or, use the next configuration to extract data from the database and the Google Drive sheet,
transform it for GoodData, and write it to a GoodData project.

{: .image-popup}
![Screenshot - Orchestration Tasks Setup for GoodData](/tutorial/automate/orchestration-tasks-setup-2.png)

The order of certain [tasks](/orchestrator/tasks/) is important; some must run sequentially and others can run 
in [parallel](/orchestrator/running/#parallel-jobs). 
That is what **orchestration phases** are for. Tasks in a single phase are executed in parallel, 
phases execute sequentially. 

To order the phases, grab the triple bar icon on their left. 
To move a task to a different phase, tick the checkbox on the left. Then go to **Actions**, select 
**Move selected tasks between phases** and assign the desired phase.

In the above configuration, each task is in its own phase.
Therefore, this is a very defensive configuration which executes all tasks sequentially.

It can be better arranged by using the action *Group tasks into phases by component type*:

{: .image-popup}
![Screenshot - Orchestration Phases](/tutorial/automate/orchestration-tasks-setup-3.png)

This will group each of the extractors, transformations and writers into their own phase to follow the common
ETL scheme. Then **Save** the orchestration. If you do not have all the tasks set up at the moment, 
it does not matter. You can safely continue with the next steps.
When done configuring the tasks, go back to the orchestration setting.

{: .image-popup}
![Screenshot - Orchestration Tasks Setup End](/tutorial/automate/orchestration-tasks-setup-4.png)

In the orchestration detail, you can now see some tasks configured. Run the orchestration manually to test 
if everything works smoothly; click on the **Run Orchestration** button in the top right corner and select the tasks you want to run.
This creates a background [job](/orchestrator/running/) which executes all the tasks specified in the orchestration. 
Continue setting up the orchestration in the meantime.

{: .image-popup}
![Screenshot - Orchestration Detail](/tutorial/automate/orchestration-detail-2.png)

By clicking on the edit icon next to **Schedule**, set the orchestration to run 
[automatically](/orchestrator/running/#automation) at a given time. 

{: .image-popup}
![Screenshot - Orchestration Schedule](/tutorial/automate/orchestration-schedule.png)

It is recommended to also set up notifications. 
Click on the **Notifications** edit button:

{: .image-popup}
![Screenshot - Orchestration Detail](/tutorial/automate/orchestration-detail-3.png)

Notifications are sent to selected email addresses. Set at least the error notification: enter your email address and 
click on the plus sign next to it. Repeat if you want to add another email address. Then click **Save**.

When an orchestration is run manually, notifications will be sent only to the Keboola Connection user who
runs the orchestration, not to those specified in Notifications.

{: .image-popup}
![Screenshot - Orchestration Notifications](/tutorial/automate/orchestration-notifications.png)

Your orchestration job should be finished by now. From data extraction to data writing, you have set up the full pipeline. 
Any change in your [GoogleDrive sheet](/tutorial/load/googledrive/) will automatically propagate up 
to your Tableau or GoodData project. Or both if you set it that way.   

{: .image-popup}
![Screenshot - Orchestration Jobs](/tutorial/automate/orchestration-detail-4.png)

Having mastered the automation process, you may proceed to the [ad-hoc data analysis](/tutorial/ad-hoc/) part of the Keboola Connection tutorial. 
