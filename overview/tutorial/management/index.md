---
title: Part 5 - Management
permalink: /overview/tutorial/management/
---

* TOC
{:toc}

In the previous steps you learned how to quickly
[load tables into KBC manually](/overview/tutorial/load/) 
(or [using extractor](/overview/tutorial/load/database/)), 
[manipulate data using SQL](/overview/tutorial/manipulate/) and then  
write data into [Tableu BI](/overview/tutorial/write/) (or [GoodData BI](/overview/tutorial/write/gooddata/)) 
and how to set so that [all these things run automatically](/overview/tutorial/automate/). In this part,
we'll show you around some additional features of KBC related to Data and User management. We would like to 
show you, that we take great care to ensure that everything done in KBC is traceable (and if possible recoverable). 

## Data Governance

### Jobs
As you have probably noticed during this tutorial, most of the things done in KBC are background (asynchronous)
jobs. You can get an overview of the all running and terminated jobs in the **Jobs** section: 

{: .image-popup}
![Screenshot - Jobs](/overview/tutorial/management/jobs.png)

Clicking on a job will give you its details, such as what tables were modified, how much data was transfered and 
what events occured during job execution. The job history is virtually unlimited.

{: .image-popup}
![Screenshot - Jobs Detail](/overview/tutorial/management/jobs-detail.png)

### Storage Jobs
Not only we record all Jobs which were executed in your KBC project, we also record all data which were uploaded
into your project. When you go to **Storage** section and **Jobs** tab:

{: .image-popup}
![Screenshot - Storage Jobs](/overview/tutorial/management/storage-jobs.png)

In the event list you can surely find an **importTable** job, when you click it, you'll see a Storage Job detail:

{: .image-popup}
![Screenshot - Storage Job Detail](/overview/tutorial/management/storage-jobs-detail.png)

There, among other information is also listed **File ID**, when you click it, you will be taken to 
**File Uploads** tab of the **Storage**, where all data pushed into your KBC project are stored. You 
can download the data and import them into other tables or revert to an older table version. 

{: .image-popup}
![Screenshot - File uploads](/overview/tutorial/management/storage-file-uploads.png)

### Table Snapshots
Another (and more sophisticated) option to reverting data to an earlier verison is using
**Table Snapshots**, you can access table snapshots in **Storage** section in table 
details: 

{: .image-popup}
![Screenshot - Storage Snapshots](/overview/tutorial/management/storage-snapshots.png)

When a Snapshot does exist for the table, it can be either used to revert the contents of that
table or to copy that table into another table: 

{: .image-popup}
![Screenshot - Storage Snapshots List](/overview/tutorial/management/storage-snapshots-list.png)

### Data Takeout
If for any reason you want to terminate your project, you can use **Data Takeout** feature to extract all
your project data. Though you can use it at any time, please do not confuse it with project backup. 
The data from takeout cannot be automatically imported into KBC, also make sure to protect your takeout data 
accordingly.  

{: .image-popup}
![Screenshot - Data Takeout](/overview/tutorial/management/data-takeout.png)

This feature is especially usefull for project POCs, which are suppose to end after a certain time period, but
you still want to keep them for reference for some time. Of course, this feature can also be used 
if get fed up and want to leave us, which we certainly don't like, but we are never blocking you from doing so. 

## User Management
You probably also noticed the link to **Users & Settings** in the bottom left corner. This link allows you to
add other **Administrators** to your project. These are full fledged trusted users (which also count to
your project quota). You invite an user just by entering email, the user will receive an invitation and 
a wizard will guide him through logging into KBC.

{: .image-popup}
![Screenshot - Project Administrators](/overview/tutorial/management/administrators.png)

The standard users are all equal because most operations in KBC generally require access to 
most of the data and functions. You might want to create users with limited access to only 
some of your data. You should create a (temporary) access token. Create a new access token:

{: .image-popup}
![Screenshot - Access Tokens](/overview/tutorial/management/access-tokens.png)

You can now limit access of that token to a single Storage bucket - e.g. 'out.c-tutorial'. You can
also limit the validity of that token.

{: .image-popup}
![Screenshot - Access Tokens](/overview/tutorial/management/access-tokens.png)

Once the token is created, you can display its details and send that token to an
arbitrary email using the **Send token** button.

{: .image-popup}
![Screenshot - Access Tokens](/overview/tutorial/management/access-token-detail-2.png)

When you send the token, you can add additional message:

{: .image-popup}
![Screenshot - Send Token](/overview/tutorial/management/send-token.png)

The recipient will obtain an email with an invitation link, which will lead the user to the
following screen:

{: .image-popup}
![Screenshot - Token Welcome Screen](/overview/tutorial/management/token-welcome.png)

The user can then log on to your project using the *Storage Console*:

{: .image-popup}
![Screenshot - Storage Console](/overview/tutorial/management/storage-console.png)

And the user will see only the buckets you allowed him to access:

{: .image-popup}
![Screenshot - Storage Console View](/overview/tutorial/management/storage-console-view.png)
 
This way you can share limited portions of your data with the users you specify. The buckets can be 
also used for writing, so you may use this way for someone to easily send you some data (instead of fighting 
with FTP or e-mail attachments) directly to your KBC project. You can always revoke the access simply
by deleting the token.


## Project status
In agreement with our openess, we attempt to show you everything important regarding your project. There
are two main channels for project status information. 

{: .image-popup}
![Screenshot - Project Overview](/overview/tutorial/management/project-overview.png)

First are notifications, which you can access by
clicking the bell on the top left of the side bar. These show highly important messages - such as expiring
project, component migration, or other things needing your attention. The notifications are your user channel, so
each user sees all notifications for all projects there. Additionaly important messages regarding project
are displayed on the project **Overview** section.   

{: .image-popup}
![Screenshot - Notifications](/overview/tutorial/management/notifications.png)

Second project status channel contains project quotas and can be accessed via **Users & Settings** link.
In the limits tab, you can see all billable metrics measured on your project. You also see your current
limits that you have signed up to and also a monthly trend. This way you can control your usage to fit into 
the limits or contact our sales to increase the limits as you need.

{: .image-popup}
![Screenshot - Project Limits](/overview/tutorial/management/project-limits.png)

Keep in mind that the limits displayed here are *soft limits*, which means that you won't be charged 
for exceeding them, nor will the acces to your project be limited. We don't do such things.

## Final note
This is the end of our stroll aroun Keboola Connection. On our walk we missed quite a few things (
Applications, Python or R transformations, Redshift and Snowflake features, to name a few), but we tried to
show you how Keboola Connection can help you in connecting different systems together. You can 
[return to the begining](/overview/tutorial/) or [contact us](/)
