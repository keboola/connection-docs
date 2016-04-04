---
title: Part 4 - Automation - Setting up Orchestrator
permalink: /overview/tutorial/automate/
---

In the previous steps you learned how to quickly
[load tables into KBC manually](/overview/tutorial/load/) 
(or [using extractor](/overview/tutorial/load/database/)), 
[manipulate data using SQL](/overview/tutorial/manipulate/) and then  
write data into [Tableu BI](/overview/tutorial/write/) (or [GoodData BI](/overview/tutorial/write/gooddata/)).
 
This alone is should show you that Keboola Connection is a powerful and easy to use tool when 
connecting various systems together. However for normal course of operations, it is important to keep your
data current and do all the above steps repeatedly. KBC helps you with this task with a tool named
**Orchestrator**. Orchestrator does two things actually:

- it lets you specify what tasks should execute in what order (i.e. orchestrate tasks)
- and configure when the orechstartion should execute automatically (i.e. schedule orchestrated tasks)

To create your first orchestration, go to **Orchestrations** section of KBC:

{: .image-popup}
![Screenshot - Orchestrations Introduction](/overview/tutorial/automate/orchestrator-intro.png)

Click on **Get Started** to create a new orchestration and assign it a name:

{: .image-popup}
![Screenshot - Create new Orchestration](/overview/tutorial/automate/orchestrator-create-new.png)

To configure orchestration, you should first add some tasks to it:

{: .image-popup}
![Screenshot - Orchestration Detail](/overview/tutorial/automate/orchestration-detail-1.png)

Continue with **Add Task**:

{: .image-popup}
![Screenshot - Orchestration Tasks Introduction](/overview/tutorial/automate/orchestration-tasks-1.png)

Depedning on what steps of the tutorial, you have taken, you will see available tasks for automation. There 
is no possibility to automate [manual upload](/overview/tutorial/load/). If you took all parts of the tutorial,
then available steps are:

- [load data using GoogleDrive Extactor](/overview/tutorial/load/googledrive/)
- [load data using Datababse Extractor](/overview/tutorial/load/database/)
- [manipulate data using transformations](/overview/tutorial/manipulate/)
- [write data into Tableu BI](/overview/tutorial/write/)
- [write data into GoodData BI](/overview/tutorial/write/gooddata/)

{: .image-popup}
![Screenshot - Orchestration Tasks Editing](/overview/tutorial/automate/orchestration-tasks-2.png)

You can now select all the tasks you want: 

{: .image-popup}
![Screenshot - Orchestration Tasks Setup for Tableau](/overview/tutorial/automate/orchestration-tasks-setup-1.png)

The above configuration will extract data from database and Google Drive sheet then it will transform
the data for Tablau, and write them to Tableu Server. Or you can use:

{: .image-popup}
![Screenshot - Orchestration Tasks Setup for GoodData](/overview/tutorial/automate/orchestration-tasks-setup-2.png)

The above configuration will extract data from database and Google Drive sheet then it will transform
the data for GoodData, and write them to GoodData project.

Obviously the order of the tasks is important,
so you can drag them around to the correct order. If you do not have all the tasks set up at the moment, 
it does not matter, you can safely continue with the next steps.

When you are done configuring the tasks, go back to the orchestration setting:

{: .image-popup}
![Screenshot - Orchestration Tasks Setup End](/overview/tutorial/automate/orchestration-tasks-setup-3.png)

In the orchestration detail, you can now see that there are some tasks configured. You can now run the 
orchestration manually to test that everything works smoothly by clicking on the play button in top right corner.
This will create a background job, which executes all the tasks specified in the orchestration, you can 
continue setting up the orchestration in the mean time.

{: .image-popup}
![Screenshot - Orchestration Detail](/overview/tutorial/automate/orchestration-detail-2.png)

Additionally you can also schedule the orchestration to be run automatically at given time by clicking on
**Edit schedule**. 

{: .image-popup}
![Screenshot - Orchestration Schedule](/overview/tutorial/automate/orchestration-schedule.png)

When you set up a schedule, it is recommended to also set up notifications. You can do so, by clicking
on **Configure Notifications**:

{: .image-popup}
![Screenshot - Orchestration Detail](/overview/tutorial/automate/orchestration-detail-3.png)

Notifications are set to specified emails. You should set at least the notification on error conditions.
Note that when an orchestration is run manually, the notifications will be sent only to the KBC user who
run the orchestration, not those specified in Notifications.

{: .image-popup}
![Screenshot - Orchestration Notifications](/overview/tutorial/automate/orchestration-notifications.png)

If everything went well, you should see your orchestration job finished by now and notifications set. You now
have set up full pipeline from data extraction to data writing. This means that whatever you change in your 
Google drive sheet (if you [created one](/overview/tutorial/load/googledrive/)) will automatically propagate
up to your Tableau or GoodData project (or both, if you set it so).   

This is the end of this part of the tutorial dealing with automation. You can now proceed to the 
[management part](/overview/tutorial/management/) part of KBC. 
