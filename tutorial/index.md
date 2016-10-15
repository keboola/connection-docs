---
title: Keboola Connection Getting Started Tutorial
permalink: /tutorial/
---

This tutorial will guide you through basic usage of Keboola Connection (KBC).

Before you start, make sure you have **basic knowledge of [SQL](https://en.wikipedia.org/wiki/SQL)**, and 
**access to a KBC project** (preferably empty). To get set up, either ask one of our partners, 
or ping us on [sales@keboola.com](mailto:sales@keboola.com).

If developing KBC components is the only reason you need a project for, apply for a
[development project](https://developers.keboola.com/overview/devel-project/).

## Get Going
Follow the three basic steps of our tutorial to get going as quickly as possible.

- [Loading Data Manually](/tutorial/load/); loading four tables into KBC Storage. The fastest way to load data when starting with a project or doing any kind of POC.
- [Data Manipulation --- Transformations](/tutorial/manipulate/); manipulating data in Storage using Transformations 
by creating a denormalized table from the input tables and doing some minor modifications to it.
- [Writing Data into Tableau](/tutorial/write/); writing data from KBC to Tableau Analytics. 

## Advanced Steps
If you want to try more of KBC features, follow some of the following side steps:

- Loading data using extractors
	- [Loading data with GoogleDrive Extractor](/tutorial/load/googledrive/) --- how to load data from an external datasheet 
using the GoogleDrive extractor.
	- [Loading data with Database Extractor](/tutorial/load/database/) --- how to load data from an external database
with the help of the MySQL extractor (the procedure is same for all our database extractors.
- Data Manipulation --- [Creating and using Sandbox](/tutorial/manipulate/sandbox/), a separate database storage, 
allowing you to run arbitrary SQL scripts on the copies of your tables without affecting data in your Storage, or your transformations.
- [Writing into GoodData](/tutorial/write/gooddata/); writing data from KBC into GoodData Analytics. 
- [Automation --- Setting up Orchestrator](/tutorial/automate/); specifying what tasks should be executed in what order, 
	configuring their automatic execution.
- [Management](/tutorial/management/); additional KBC features related to Data and User management. 
Everything done in KBC is traceable, and, if possible, also recoverable.

