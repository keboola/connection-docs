---
title: Part 5 - Project Management
permalink: /tutorial/management/
---

* TOC
{:toc}

After you have loaded your tables, either [manually](/tutorial/load/) or
[using an extractor](/tutorial/load/database/), [manipulated the data](/tutorial/manipulate/) in SQL,
written it [into Tableau BI](/tutorial/write/) or [into GoodData BI](/tutorial/write/gooddata/), and
set everything to run [automatically](/tutorial/automate/), let's take a look at some additional KBC features
related to Data and User management. We take great care to ensure that everything done in KBC is traceable,
and, if possible, also recoverable.

## Data Governance
It enables you to use your uploaded data for other tables, access previous versions of your tables, and 
extract all your project data.

### Jobs
Most of the things done in KBC run as background, asynchronous, jobs.
For an overview of all jobs, running and finished, go to the **Jobs** section:

{: .image-popup}
![Screenshot - Jobs](/tutorial/management/jobs.png)

Clicking a job will give you its details, such as what tables were modified, how much data was transferred and
what events occurred during the job execution. The job history is virtually unlimited.

{: .image-popup}
![Screenshot - Jobs Detail](/tutorial/management/jobs-detail.png)

### Storage Jobs
Not only we record all jobs which were executed in your KBC project, we also record all data which were uploaded
into your project. Go to **Storage** and click the **Jobs** tab:

{: .image-popup}
![Screenshot - Storage Jobs](/tutorial/management/storage-jobs.png)

When you click an **importTable** job, you'll see a Storage job detail:

{: .image-popup}
![Screenshot - Storage Job Detail](/tutorial/management/storage-jobs-detail.png)

Clicking **File ID** will take you to the **File Uploads** tab in **Storage**,
where all data pushed into your KBC project are stored.
You can download the data and import it into other tables, or you can revert to an older table version.

{: .image-popup}
![Screenshot - File uploads](/tutorial/management/storage-file-uploads.png)

### Table Snapshots
Another, more sophisticated option for reverting data to an earlier version is using
**Table Snapshots** in **Storage**:

{: .image-popup}
![Screenshot - Storage Snapshots](/tutorial/management/storage-snapshots.png)

A table snapshot can be either used to revert the contents of that table, or to copy the table into another one.

{: .image-popup}
![Screenshot - Storage Snapshots List](/tutorial/management/storage-snapshots-list.png)

### Data Takeout
If, for any reason, you want to terminate your project, use the
[**Data Takeout**](/management/project-export/) feature in **Users&Settings** to extract all
your project data. Even though it can be used at any time, do not confuse it with the project backup.
The takeout data cannot be automatically imported into KBC; make sure to protect it accordingly.

{: .image-popup}
![Screenshot - Data Takeout](/tutorial/management/data-takeout.png)

This feature is especially useful for Proof-of-Concept projects. They are supposed to end after a certain time period, but
you still want to keep them for reference for some time. This feature can also be used in case you decide to leave us.
We won't be happy about it, but we are never going to prevent you from doing so.

## User Management
Apart from Data Takeout, the **Users & Settings** link in the bottom left corner of your screen allows you to add
other **Administrators** to your project. These are full-fledged trusted users that also count to your project quota.
You can [invite a user](/management/users/) by entering their email address.

{: .image-popup}
![Screenshot - Project Administrators](/tutorial/management/administrators.png)

Standard users are all equal as most KBC operations generally require access to most of the data and functions.
You can also create users with [limited access](/storage/tokens/#limited-tokens), which can only read or write to some buckets:

{: .image-popup}
![Screenshot - Storage Console View](/tutorial/management/access-token-detail.png)

In addition to sharing sections of your data with selected users, the buckets can be also used for writing;
people can send data directly to your KBC project instead of struggling with FTP or e-mail attachments.
To revoke the access, simply delete the token.

To learn more about inviting or removing a user, about manual registration, authentication and authorization,
see [User Management](/management/users/).

## Project Status
KBC is an open system and, as such, we want you to have all important information on your project at your disposal.
There are two main channels for project status information available: **Notifications**,
and the Limits tab in **Users & Settings**.

{: .image-popup}
![Screenshot - Project Overview](/tutorial/management/project-overview.png)

Click the top of the side bar bell for **Notifications** and highly important messages, such as expiring projects,
component migration, and other things to pay attention to. The channel is user specific, and as such shows
each user all notifications for all their projects. Another place where important status info can be found
is the **Overview** section.

{: .image-popup}
![Screenshot - Notifications](/tutorial/management/notifications.png)

The second project status channel contains project quotas and can be accessed via the **Users & Settings** link.
The **Limits** tab gives you an overview of all your measured billable metrics, your current limits,
as well as the monthly trend. This enables you to control your usage in order to fit into your limits.
To increase the limits, contact our sales.

{: .image-popup}
![Screenshot - Project Limits](/tutorial/management/project-limits.png)

The limits displayed here are *soft limits*; you won't be charged for exceeding them,
nor will the access to your project be limited. We don't do such things.

## Final Note
This is the end of our stroll around Keboola Connection. On our walk, we missed quite a few things:
Applications, Python and R transformations, Redshift and Snowflake features, to name a few.
However, teaching you everything was not really the point of this tutorial.
We wanted to show you how Keboola Connection can help in connecting different systems together.

[Return to the beginning](/tutorial/) or [contact us](/).
