---
title: Management
permalink: /management/
---

* TOC
{:toc}

Everything you do in Keboola Connection (KBC) must take place within a KBC **Project**, its basic organizational unit.
All projects are grouped into [**Organizations**](/management/organization/).

*Some KBC project management features related to data and users are also covered in our [**tutorial**](/tutorial/management/).*

{% comment %}
notifikace
limity projektu
{% endcomment %}

### Data Governance 
Everything done in KBC is traceable, and, if possible, also recoverable.

- [**Jobs**](https://help.keboola.com/tutorial/management/#jobs) --- Gives you an overview of all your jobs,
running and finished (what tables were modified, how much data was transferred and 
what events occurred during the job execution).
- [**Storage Jobs**](https://help.keboola.com/tutorial/management/#storage-jobs) --- Tracks all data 
which were uploaded/downloaded into your project. 
- [**Table Snapshots**](https://help.keboola.com/tutorial/management/#table-snapshots) --- Allows reverting data
to an earlier version (either reverts the contents of a table, or copies the table into another one).
- [**Data Takeout**](/management/project-export/) --- Extracts all your project data. Note that it is not the project backup. 
Data Takeout is especially useful for Proof-of-Concept projects, and in case you decide to leave us.

### User Management
There are two types of [KBC project users](/management/users/):

- **Standard users/Administrators** --- All are equal as most KBC operations generally require access to most of the data and functions. These are full-fledged trusted users that also count against your project quota.
- **Users with [limited access](/storage/tokens/#limited-tokens)** --- Can only read or write to some buckets, 
sending data directly to your KBC project. The access can be revoked.

### Project Status
All important information on your [project status](/tutorial/management/#project-status) can be found in the following places:

- **Overview** --- Quick access to the basic project status.
- **Notifications** --- Highly important messages (expiring projects,component migration, etc.); 
the channel is user specific (shows each user all notifications for all their projects). 
- **Limits tab** in *Users & Settings* --- Project quotas, an overview of all your measured billable metrics, 
your current limits, and the monthly trend. It helps you control your usage.

### Project Deletion
It is possible to entirely [delete your project](/management/project-delete/).

### Keboola Support
There are multiple [ways to obtain support](/management/support/) from our technical staff. 
To solve your problem or to gain context, they may join your project when requested.