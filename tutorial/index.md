---
title: Keboola Connection Getting Started Tutorial
permalink: /tutorial/
redirect_from:
  - /getting-started/
---

This tutorial will guide you through basic usage of Keboola Connection (KBC).

Before you start, make sure you have **basic knowledge of** [SQL](https://en.wikipedia.org/wiki/SQL) and
**access to a KBC project** (preferably empty). To get set up, either ask one of our partners,
or ping us at [sales@keboola.com](mailto:sales@keboola.com). If you aim to develop new components for
KBC, you will get a [development project](https://developers.keboola.com/#development-project) automatically
when you [register as a developer](https://developers.keboola.com/extend/component/tutorial/)

If developing KBC components is the only reason you need a project for, apply for a
[development project](/#development-project).

## Get Going
Follow these three basic steps of our tutorial to get going as quickly as possible:

- [Loading Data Manually](/tutorial/load/) --- load four tables into KBC Storage;
the fastest way to load data when starting with a project or doing any kind of POC.
- [Data Manipulation: Transformations](/tutorial/manipulate/) --- manipulate data in Storage
using Transformations, create a denormalized table from the input tables, and
do some minor modifications to it.
- [Writing Data into Tableau](/tutorial/write/) --- write data from KBC to Tableau Analytics.

## Advanced Steps
If you want to try more of KBC features, follow some of the following side steps:

- Loading data using extractors:
	- [Loading data: GoogleDrive Extractor](/tutorial/load/googledrive/) --- load data from an external
	data sheet using the GoogleDrive extractor.
	- [Loading data: Database Extractor](/tutorial/load/database/) --- load data from an external database
using the [Snowflake Database](https://www.snowflake.com/) extractor (the procedure is the same for [all our database extractors](/components/extractors/database/)).
- Data Manipulation: [Creating and using Sandbox](/tutorial/manipulate/sandbox/) --- create a separate database
storage to run arbitrary SQL scripts on the copies of your tables without affecting data in your Storage, or your transformations.
- [Writing into GoodData](/tutorial/write/gooddata/) --- write data from KBC into GoodData Analytics.
- [Automation: Setting up Orchestrator](/tutorial/automate/) --- specify what tasks should be executed
in what order, and configure their automatic execution.
- [Ad-hoc data analysis](/tutorial/ad-hoc/) --- see how you can play with arbitrary data.
- [Development Branches](/tutorial/branches/) --- see how you can safely modify a running project
