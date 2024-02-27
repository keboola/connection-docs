---
title: Management
permalink: /management/
redirect_from:
  - /tutorial/management/
---

* TOC
{:toc}

Everything you do in Keboola must take place within a Keboola **Project**, its basic organizational unit.
All projects are grouped into [**Organizations**](/management/organization/).

### Data Governance
Everything that happens with your data in Keboola at any stage of your project is recorded.
It enables you to use your uploaded data for other tables, access previous versions of your tables, and
extract all your project data. Everything done in Keboola is traceable, and if possible, also recoverable.

- [**Jobs**](/management/jobs/#jobs) --- give you an overview of all your jobs,
running and finished (what tables were modified, how much data was transferred and
what events occurred during the job execution).
- [**Storage Jobs**](/management/jobs/#storage-jobs) --- track all data
which were uploaded/downloaded into your project.
- [**Table Snapshots**](/storage/tables/backups/#table-snapshots) --- allow you to revert data
to an earlier version (either revert the contents of a table or copy the table into another one).
- [**Data Takeout**](/management/project/export/) --- allows you to get your data back from us; in Keboola, you are
always the sole owner of your data. Data Takeout is especially useful for proof-of-concept projects.
- [**Trash tab**](/components/#delete-configuration) --- allows you to list and restore deleted configurations.

### User Management
There are three types of Keboola [project users](/management/project/users/):

- **Administrators** --- are all equal as most Keboola operations generally require access to most of the data and functions. These are full-
fledged trusted users that count against your project quota.
- **Guest Users** --- with full access to the project data and [limited access](/management/project/users/#user-roles) to project functions. These users 
count against your project quota.
- **Tokens/Service Users** --- with [limited access](/management/project/tokens/#limited-tokens) to project data. They can only read or write to
selected buckets, sending data directly to your Keboola project. These users have only [API tokens](/management/project/tokens/). They can't use the UI and they do not
 count against your project quota.

### Project Status
All important information on your project status can be found in the following places:

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