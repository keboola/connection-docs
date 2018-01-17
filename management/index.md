---
title: Management
permalink: /management/
redirect_from:
  - /tutorial/management/
---

* TOC
{:toc}

Everything you do in Keboola Connection (KBC) must take place within a KBC **Project**, its basic organizational unit.
All projects are grouped into [**Organizations**](/management/organization/).

### Data Governance 
Everything that happens with your data in KBC at any stage of your project is recorded. 
It enables you to use your uploaded data for other tables, access previous versions of your tables, and 
extract all your project data. Everything done in KBC is traceable, and, if possible, also recoverable.

- [**Jobs**](/management/jobs/#jobs) --- Gives you an overview of all your jobs,
running and finished (what tables were modified, how much data was transferred and 
what events occurred during the job execution).
- [**Storage Jobs**](/management/jobs/#storage-jobs) --- Tracks all data 
which were uploaded/downloaded into your project. 
- [**Table Snapshots**](/storage/tables/#copying-tables--table-snapshots) --- Allows reverting data
to an earlier version (either reverts the contents of a table, or copies the table into another one).
- [**Data Takeout**](/management/project/export/) --- In KBC, you are always the owner of your data, you can always get them from us. Data Takeout is especially useful for Proof-of-Concept projects.
- [**Trash tab**](/storage/configurations/#delete-configuration) allows you to list and restore deleted configurations.

### User Management
There are two types of [KBC project users](/management/project/users/):

- **Standard users/Administrators** --- All are equal as most KBC operations generally require access to most of the data and functions. These are full-fledged trusted users that also count against your project quota.
- **Users with [limited access](/management/project/tokens/#limited-tokens)** --- Can only read or write to some buckets, 
sending data directly to your KBC project. The access can be revoked.

### Project Status
Click the top of the side bar bell for **Notifications** and highly important messages, such as expiring projects, component migration, and other things to pay attention to. The channel is user specific, 
and as such shows each user all notifications for all their projects. Another place where important
status info can be found is the **Overview** section.

{: .image-popup}
![Screenshot - Project Overview](/management/project-overview.png)

All important information on your [project status](/management/#project-status) can be found in the following places:

- **Overview** --- Quick access to the basic project status.
- [**Notifications**](/management/account/#notifications) --- Highly important messages (expiring projects,component migration, etc.); 
the channel is user specific (shows each user all notifications for all their projects). 
- [**Limits tab**](/management/project/limits/) in *Users & Settings* --- 
Overview of all your measured billable metrics, your current limits,
as well as the monthly trend. This enables you to control your usage in order to fit into your limits.
To increase the limits, contact our sales.


### Project Deletion
It is possible to entirely [delete your project](/management/project/delete/).

### Keboola Support
There are multiple [ways to obtain support](/management/support/) from our technical staff. 
To solve your problem or to gain context, they may join your project when requested.