---
title: Part 5 - Management
permalink: /overview/tutorial/management/
---

* TOC
{:toc}

After you have loaded your tables, either [manually](/overview/tutorial/load/) or 
[using an extractor](/overview/tutorial/load/database/), [manipulated the data](/overview/tutorial/manipulate/) in SQL, 
written it [into Tableau BI](/overview/tutorial/write/) or [into GoodData BI](/overview/tutorial/write/gooddata/), and 
set everything to run [automatically](/overview/tutorial/automate/), let's take a look at some additional KBC features
related to Data and User management. We take great care to ensure that everything done in KBC is traceable,
and, if possible, also recoverable. 

## Data Governance

### Jobs
Most of the things done in KBC run as background, asynchronous, jobs. 
For an overview of all jobs, running and finished, go to the **Jobs** section: 

{: .image-popup}
![Screenshot - Jobs](/overview/tutorial/management/jobs.png)

Clicking a job will give you its details, such as what tables were modified, how much data was transferred and 
what events occurred during the job execution. The job history is virtually unlimited.

{: .image-popup}
![Screenshot - Jobs Detail](/overview/tutorial/management/jobs-detail.png)

### Storage Jobs
Not only we record all jobs which were executed in your KBC project, we also record all data which were uploaded
into your project. Go to **Storage** and click the **Jobs** tab:

{: .image-popup}
![Screenshot - Storage Jobs](/overview/tutorial/management/storage-jobs.png)

When you click an **importTable** job, you'll see a Storage job detail:

{: .image-popup}
![Screenshot - Storage Job Detail](/overview/tutorial/management/storage-jobs-detail.png)

Clicking **File ID** will take you to the **File Uploads** tab in **Storage**, 
where all data pushed into your KBC project are stored. 
You can download the data and import it into other tables, or you can revert to an older table version. 

{: .image-popup}
![Screenshot - File uploads](/overview/tutorial/management/storage-file-uploads.png)

### Table Snapshots
Another, more sophisticated option for reverting data to an earlier version is using 
**Table Snapshots** in **Storage**: 

{: .image-popup}
![Screenshot - Storage Snapshots](/overview/tutorial/management/storage-snapshots.png)

A table snapshot can be either used to revert the contents of that table, or to copy the table into another one. 

{: .image-popup}
![Screenshot - Storage Snapshots List](/overview/tutorial/management/storage-snapshots-list.png)

### Data Takeout
If, for any reason, you want to terminate your project, use the **Data Takeout** feature in **Users&Settings** to extract all
your project data. Even though it can be used at any time, do not confuse it with the project backup. 
The takeout data cannot be automatically imported into KBC; make sure to protect it accordingly.  

{: .image-popup}
![Screenshot - Data Takeout](/overview/tutorial/management/data-takeout.png)

This feature is especially useful for Proof-of-Concept projects. They are supposed to end after a certain time period, but
you still want to keep them for reference for some time. This feature can also be used in case you decide to leave us. 
We won't be happy about it, but we are never going to prevent you from doing so. 

## User Management
Apart from Data Takeout, the **Users & Settings** link in the bottom left corner of your screen allows you to add 
other **Administrators** to your project. These are full-fledged trusted users that also count to your project quota. 
Invite a user by entering their email address. If they already have an account in KBC, they will receive an email message. 
If they don't, an invitation will be sent to them. They can log into KBC with the help of a wizard.

{: .image-popup}
![Screenshot - Project Administrators](/overview/tutorial/management/administrators.png)

Standard users are all equal as most KBC operations generally require access to most of the data and functions. 
To add users with access limited to only some of your data, create a new, temporary, access token:

{: .image-popup}
![Screenshot - Access Tokens](/overview/tutorial/management/access-tokens.png)

Limit access of that token to a single Storage bucket, for instance, 'out.c-tutorial'. 
You can also limit the token validity.

{: .image-popup}
![Screenshot - Access Tokens](/overview/tutorial/management/access-token-detail.png)

Once the token is created, display its details and send it to an arbitrary email address by clicking the **Send token** button.

{: .image-popup}
![Screenshot - Access Tokens](/overview/tutorial/management/access-token-detail-2.png)

An additional message can be sent along with the token.

{: .image-popup}
![Screenshot - Send Token](/overview/tutorial/management/send-token.png)

The recipient will obtain an email with an invitation link leading to the following screen:

{: .image-popup}
![Screenshot - Token Welcome Screen](/overview/tutorial/management/token-welcome.png)

Via the *Storage Console*, the added user can log into your project.

{: .image-popup}
![Screenshot - Storage Console](/overview/tutorial/management/storage-console.png)

Only the buckets you made accessible will be seen.

{: .image-popup}
![Screenshot - Storage Console View](/overview/tutorial/management/storage-console-view.png)
 
In addition to sharing sections of your data with selected users, the buckets can be also used for writing; 
people can send data directly to your KBC project instead of struggling with FTP or e-mail attachments. 
To revoke the access, simply delete the token.


## Project Status
KBC is an open system and, as such, we want you to have all important information on your project at your disposal. 
There are two main channels for project status information available: **Notifications**, 
and the Limits tab in **Users & Settings**. 

{: .image-popup}
![Screenshot - Project Overview](/overview/tutorial/management/project-overview.png)

Click the top of the side bar bell for **Notifications** and highly important messages, such as expiring projects, 
component migration, and other things to pay attention to. The channel is user specific, and as such shows
each user all notifications for all their projects. Another place where important status info can be found
is the **Overview** section.   

{: .image-popup}
![Screenshot - Notifications](/overview/tutorial/management/notifications.png)

The second project status channel contains project quotas and can be accessed via the **Users & Settings** link.
The **Limits** tab gives you an overview of all your measured billable metrics, your current limits, 
as well as the monthly trend. This enables you to control your usage in order to fit into your limits. 
To increase the limits, contact our sales.

{: .image-popup}
![Screenshot - Project Limits](/overview/tutorial/management/project-limits.png)

The limits displayed here are *soft limits*; you won't be charged for exceeding them, 
nor will the access to your project be limited. We don't do such things.

## Final Note
This is the end of our stroll around Keboola Connection. On our walk, we missed quite a few things --
Applications, Python and R transformations, Redshift and Snowflake features, to name a few. 
However, teaching you everything was not really the point of this tutorial. 
We wanted to show you how Keboola Connection can help in connecting different systems together. 

[Return to the beginning](/overview/tutorial/) or [contact us](/).
