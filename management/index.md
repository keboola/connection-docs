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

- [**Jobs**](/management/jobs/#jobs) --- give you an overview of all your jobs,
running and finished (what tables were modified, how much data was transferred and
what events occurred during the job execution).
- [**Storage Jobs**](/management/jobs/#storage-jobs) --- track all data
which were uploaded/downloaded into your project.
- [**Table Snapshots**](/storage/tables/backups/#table-snapshots) --- allow you to revert data
to an earlier version (either revert the contents of a table or copy the table into another one).
- [**Data Takeout**](/management/project/export/) --- allows you to get your data back from us; in KBC, you are
always the sole owner of your data. Data Takeout is especially useful for proof-of-concept projects.
- [**Trash tab**](/storage/configurations/#delete-configuration) --- allows you to list and restore deleted configurations.

### User Management
There are two types of [KBC project users](/management/project/users/):

- **Standard users/Administrators** --- are all equal as most KBC operations generally require access to most of the data and functions. These are full-fledged trusted users that also count against your project quota.
- **Users with [limited access](/management/project/tokens/#limited-tokens)** --- can only read or write to
selected buckets, sending data directly to your KBC project. The access can be revoked.

### Project Status
All important information on your project status can be found in the following places:

- [**Notifications**](/management/account/#notifications) --- click the bell at the right of the top menu for
notifications and highly important messages, such as expiring projects and component migration. The channel is user specific and as such shows each user all notifications for all their projects.
- **Overview** --- check this section for basic status information about your project.
- [**Limits tab**](/management/project/limits/) in *Users & Settings* --- check all your measured billable
metrics, your current limits, as well as the monthly trend. This enables you to control your usage in order to
stay within your limits. To increase the limits, contact our sales.

{: .image-popup}
![Screenshot - Project Overview](/management/project-overview.png)

### Project Deletion
It is possible to entirely [delete your project](/management/project/delete/).

### Keboola Support
There are multiple [ways to obtain support](/management/support/) from our technical staff.
To solve your problem or to gain context, they may join your project when requested.