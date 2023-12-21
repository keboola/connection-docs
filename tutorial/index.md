---
title: Keboola Getting Started Tutorial
permalink: /tutorial/
redirect_from:
  - /getting-started/
---

Discover how to leverage the Keboola platform to effortlessly extract data from various sources,  transform it, and securely store it within the Keboola platform. 
Uncover the capabilities to not only store the transformed data but also to efficiently write it to a desired destination. Additionally, master the art of 
automating the entire data pipeline for enhanced efficiency and consistency. This tutorial will guide you through basic usage of Keboola platform.

* TOC
{:toc}

## Prerequisites 

If you are new to Keboola, we recommend exploring our comprehensive [platform overview](/overviews/). 
This resource will help you become acquainted with commonly used terms and gain a solid understanding of the Keboola ecosystem.

To get started, ensure you have access to a Keboola project. If you haven’t got one yet, reach out to us at {sales@keboola.com](sales@keboola.com), 
or create a free project [here](https://connection.north-europe.azure.keboola.com/wizard) instantly.

If you are a developer looking to contribute new components to the Keboola platform, your [development project](https://developers.keboola.com/#development-project) 
will be automatically set up upon registering as a developer. 

Please be aware that for a comprehensive understanding of the tutorial and to unlock the full capabilities of Keboola, it is recommended to have at least a basic understanding of the [SQL](https://en.wikipedia.org/wiki/SQL) language. SQL is commonly used for data transformation, often with Python or R alongside.

## Getting Started
Upon completing this tutorial, you will gain confidence in:
1. Integrating data seamlessly into Keboola
2. Effectively manipulating data through Keboola transformation
3. Automating the entire data pipeline
4. Leveraging Keboola for advanced analytics and transformation development

To expedite your onboarding, we've organized the tutorial into basic and advanced steps.

### Basic Steps
1. [**Loading Data Manually**](/tutorial/load/): Load four CSV files into Keboola Storage tables.
2. [**Data Manipulation**](/tutorial/manipulate/): Utilize transformations to create a denormalized table from the input tables and make minor modifications.
3. [**Writing Data into Tableau**](/tutorial/write/): Write the transformed data to Tableau Analytics.

### Advanced Steps
For a deeper exploration of Keboola features, aligning with real-world usage, consider the following advanced steps:
1. **Loading Data Using Data Source Connectors**
   - [Google Sheets Data Source](): Load data from an external spreadsheet using the Google Sheets data source connector.
   - [Database Data Source](): Load data from an external database utilizing the [Snowflake Database data source connector](/tutorial/load/database/) (applicable to all Keboola-supported [database data sources](/components/extractors/database/)).
2. [**Data Manipulation: Creating and Using a Workspace**]() [LINK]
   - Create and utilize a workspace, a secure development and analytical environment. It enables you to interact with data and develop transformation code on a copy of your production data.
3. [**Automation: Setting up a Flow** [LINK]
   - Specify task sequences and configure their automatic execution through the setup of a flow.
4. [**Ad-hoc Data Analysis**]()
   - Explore how to perform ad-hoc data analysis, allowing flexibility in interacting with arbitrary data.

Development Branches [LINK]:

Learn how to safely modify a running project using development branches.

Command-Line Interface (CLI) [LINK]:

Operate a project efficiently using the Keboola command-line tool.

These advanced steps will provide you with a comprehensive understanding of Keboola's capabilities and their practical application in real-world scenarios.
******************************************************************************************
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
- [Writing into GoodData](/tutorial/write/gooddata/) --- write data from KBC into GoodData.
- [Automation: Setting up Orchestrator](/tutorial/automate/) --- specify what tasks should be executed
in what order, and configure their automatic execution.
- [Ad-hoc data analysis](/tutorial/ad-hoc/) --- see how you can play with arbitrary data.
- [Development Branches](/tutorial/branches/) --- see how you can safely modify a running project.
- [CLI](https://developers.keboola.com/cli/) --- see how you can operate a project using our command-line tool.
