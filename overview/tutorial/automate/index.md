---
title: Part 4 - Automation - Setting up Orchestrator
permalink: /overview/tutorial/automate/
---

So far, you have learned to use KBC to

- load tables [manually](/overview/tutorial/load/) or [using an extractor](/overview/tutorial/load/database/), 
- [manipulate data in SQL](/overview/tutorial/manipulate/), and
- write data [into Tableu BI](/overview/tutorial/write/) or [into GoodData BI](/overview/tutorial/write/gooddata/).
 
Connecting various systems together alone makes Keboola Connection a powerful and easy-to-use tool. 
However, the above steps must be done repeatedly to bring in the newest data available. 

Use KBC **Orchestrator**  

- to specify what tasks should be executed in what order, for example orchestrate tasks, and
- to configure the automatic execution, for instance schedule orchestrated tasks.

Go to the **Orchestrations** section of KBC, and

{: .image-popup}
![Screenshot - Orchestrations Introduction](/overview/tutorial/automate/orchestrator-intro.png)

click on **Get Started Now** to create a new orchestration. Assign it a name:

{: .image-popup}
![Screenshot - Create new Orchestration](/overview/tutorial/automate/orchestrator-create-new.png)

To configure the orchestration, first add some tasks to it:

{: .image-popup}
![Screenshot - Orchestration Detail](/overview/tutorial/automate/orchestration-detail-1.png)

Continue with **Add Task**:

{: .image-popup}
![Screenshot - Orchestration Tasks Introduction](/overview/tutorial/automate/orchestration-tasks-1.png)

The automation tasks are displayed based on what steps of the tutorial you have taken.
It is not possible to automate the [manual upload](/overview/tutorial/load/). Gone through all parts of the tutorial?
Then these are the available steps:

- [load data using GoogleDrive Extractor](/overview/tutorial/load/googledrive/)
- [load data using Database Extractor](/overview/tutorial/load/database/)
- [manipulate data using Transformations](/overview/tutorial/manipulate/)
- [write data into Tableau BI](/overview/tutorial/write/)
- [write data into GoodData BI](/overview/tutorial/write/gooddata/)

First, select GoogleDrive and then click on the User levels table.

{: .image-popup}
![Screenshot - Orchestration Tasks Editing](/overview/tutorial/automate/orchestration-tasks-2.png)

Continue adding all the tasks you want. The following configuration will extract data from the database 
and Google Drive sheet. After being transformed for Tableau, the data will be written to Tableau Server.

{: .image-popup}
![Screenshot - Orchestration Tasks Setup for Tableau](/overview/tutorial/automate/orchestration-tasks-setup-1.png)

Or, use the next configuration to extract data from the database and Google Drive sheet,
transform it for GoodData, and write it to a GoodData project.

{: .image-popup}
![Screenshot - Orchestration Tasks Setup for GoodData](/overview/tutorial/automate/orchestration-tasks-setup-2.png)

The order of certain tasks is important; some must run sequentialy and others can run in paralell. 
That is what **orchestration phases** are for. Tasks in a single phase are executed in parallel, 
phases execute sequentially. To properly order the phases, you can drag them around. 

In the above configuration, each task is in its own phase.
Therefore this is a very defensive configuration which executes all tasks sequentially.

It can be better arranged by using the *Group tasks into phases by component type* action:

{: .image-popup}
![Screenshot - Orchestration Phases](/overview/tutorial/automate/orchestration-tasks-setup-3.png)

This will group each of the extractors, transformations and writers into their own phase to follow the common
ETL scheme. Then **Save** the orchestration. If you do not have all the tasks set up at the moment, 
it does not matter. You can safely continue with the next steps.
When you are done configuring the tasks, go back to the orchestration setting.

{: .image-popup}
![Screenshot - Orchestration Tasks Setup End](/overview/tutorial/automate/orchestration-tasks-setup-4.png)

In the orchestration detail, you can now see some tasks configured. Run the orchestration manually 
to test everything works smoothly by clicking on the **Play** button in top right corner.
This creates a background job which executes all the tasks specified in the orchestration. 
Continue setting up the orchestration in the mean time.

{: .image-popup}
![Screenshot - Orchestration Detail](/overview/tutorial/automate/orchestration-detail-2.png)

Additionally, you can also schedule the orchestration to be run automatically at a given time by clicking on
**Edit schedule**. 

{: .image-popup}
![Screenshot - Orchestration Schedule](/overview/tutorial/automate/orchestration-schedule.png)

When setting up a schedule, it is recommended to also set up notifications. 
Click on **Configure Notifications**:

{: .image-popup}
![Screenshot - Orchestration Detail](/overview/tutorial/automate/orchestration-detail-3.png)

Notifications are set to specified emails. Set at least the notification on error conditions.
When an orchestration is run manually, the notifications will be sent only to the KBC user who
runs the orchestration, not to those specified in Notifications.

{: .image-popup}
![Screenshot - Orchestration Notifications](/overview/tutorial/automate/orchestration-notifications.png)

If everything goes well, you should see your orchestration job finished by now and the notifications set. 
Now set up the full pipeline from data extraction to data writing. 
This means that whatever you change in your Google Drive sheet, 
if you [created one](/overview/tutorial/load/googledrive/), will automatically propagate
up to your Tableau or GoodData project. Or both, if you set it that way.   

That is all for dealing with automation. Proceed to the [management part](/overview/tutorial/management/) of KBC. 
