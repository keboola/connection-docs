---
title: Multi-project Architecture
permalink: /catalog/multi-project/
---

* TOC
{:toc}

Keboola Connection is a very versatile platform and can be used in many different ways. When you deal with a larger number of source 
and destination systems, or when the some of them are very complex or difficult to setup, you might consider splitting the
traditional extract-load process into isolated projects.

Let's say that you have a large source database and you want to provide them to data scientists. While it is 
very easy for data scientist to set up a database extractor and get all the data, it might not be a good 
*long-term* solution -- for example: 
- The database has some cryptic names which are hard to understand and need to be described.
- The database structure is constantly changing due to a migration process in progress.
- The database is large, and the extraction should be optimized so that it doesn't load a 1TB table every hour all 
over again. 
- The extraction should be synchronized with database updates or backups.
- The database contains some secure or semi-secure data which even the data analysts shouldn't have access to.
- etc.

The multi project architecture is a solution to these kinds of problems. It is not really any sort of architecture, it is 
only a *usage pattern* of the Keboola Connection platform. The idea is to create separate projects for receiving,
analyzing and writing data. The projects structure can follow the organization structure or technological structure or
anything else really.

## Example Scenario
Lets say that you have an existing Keboola Connection project with:

- Oracle database extractor with configurations:
    - `ora-history` -- The source database is over 2TB, the largest table is `op_history`, which can be easily loaded [incrementally](/storage/tables/#incremental-loading) as records are only added, it is updated every 10 minutes.
    - `ora-crm` -- Tables from the CRM system. Major updates are being made to the CRM so the structure of the tables changes often. Every two weeks a column is renamed or a table is split into two.
    - `ora-common` -- Auxiliary tables with addresses and product names which are updated 4 times a year from the parent company.
    - `ora-is` -- Extracts `ORA_IS_XXX` bunch of tables which represent a port of a legacy information system, where are column names had to fit into a 6 character limit.
    - `ora-clients` -- The table `app_clients` which is updated every working day at 2:30 UTC by a script which checks all connected clients.
- SQL Server extractor with configurations:
    - `sql-main` -- Contains the entire database of the information system, which can be extracted at any time without problems, but it contains a 
    `user_sessions` table which contains session cookies which can be used to steal user session. Security requires that table must not leave the SQL Server.
- Google Analytics extractor:
    - There are three Google Analytics accounts. One -- for the main site -- is managed by the IT department, the other two are managed by Marketing department. The IT department does not want to allow.
- A bunch of transformations generating reports and writers.

### Single Project
The following schema shows the configurations and data exchanged between them:

{: .image-popup}
![Schema -- Single project](/catalog/multi-project/multi-project-1.png)

The above scenario is a simplified example of various requirements one might encounter when connecting various systems together.
The important part is nothing prevents you from setting up all those components in a single project. In the long run, however, 
you don't want everyone to be responsible for everything. Multi-project architecture is just that -- a way to divide 
responsibilities, separate concerns and build interfaces.

### Multi Project
The following image illustrates the usage pattern change:

{: .image-popup}
![Schema -- Multi project](/catalog/multi-project/multi-project-2.png)

- All Oracle extractors have been isolated into a separate project `Oracle`:
    - The Oracle DBAs take care of that project and share outside the `Oracle` bucket.
    - Most tables are shared as they are extracted, with some transformations compensating for the changes in CRM tables. The `ora-is` tables are 
    processed via transformations where the useful columns are renamed from their 6 character names to meaningful names, and the more obscure 
    columns are omitted. The Oracle DBAs decided that it's actually easier then to document the legacy tables. All of the Oracle tables are 
    formally considered to be current at least every 4th hour. However, they're updated more often, which the data scientists exploit in their 
    [event triggered orchestrations](/orchestrator/running/#event-trigger).
- The SQL Server extractors are in the `MS` project. All the tables are shared as they are extracted using a `MSSSQL` bucket. There are no 
transformations or other components. The project is only accessible to SQL Server DBAs. Formally the tables must be up to date at least 
every 4th hour. In reality, they are updated every hour.
- Google Analytics extractors are all in a single project `GA` maintained by the marketing department. The extractor for the main site (managed by the IT) is there too, it was only [externally authorized](/components/#external-authorization) by the IT department. The marketing department is responsible for basic cleaning of the data -- the project contains some cleaning transformations and the `ga_clean` bucket is shared to the organization. The tables in the bucket are updated every 10 minutes, though the formal requirement is that they are updated at least every 4th hour.
- Everything else is in the project `Reporting`. It is possible to further split it to e.g. project taking care of newsletters and reporting.

While the above schema may look more complex and difficult to setup, it actually simplifies things a lot. It leads to a very simple statement: **Everyone in the company can now access the source data and these are updated every 4th hour**. When new data scientists come to the company, they can simply create a new project, use the shared data with the knowledge how often they're updated and start working immediately. If the word "everyone" in the above statement is undesired, then the access can be tied down by using different [sharing type](/catalog/#sharing-types). The multi architecture setup also creates an interface. If the Oracle DBAs need to change anything the database schema, they can do that in an unlimited number of arbitrarily sized steps, provided that the shared data remains same. For that they can use the entire power of SQL, Python, R and Julia transformations combined. This is much more flexible solution then the traditional way of creating views. Then there is of course the advantage that you can work with the Oracle data even when the server is down, but that's integral part of Keboola Connection.

On a very high level view, the following schema represents a single project setup:

{: .image-popup}
![Schema -- Single project](/catalog/multi-project/schema-1.png)

The multi-project setup as described in the above scenario is depicted in the following schema (the coloured parts represent [Data Catalog](/catalog/)):

{: .image-popup}
![Schema -- Multi-project](/catalog/multi-project/schema-2.png)

Because Multi-project architecture is a usage pattern (enabled by business contract for the organization), it is completely unconstrained. For a smaller company, 
having only the major sources (or destinations) in their own projects might be sufficient. A large corporation might a deeper separation, so the following schema 
might be more appropriate (the coloured parts represent [Data Catalog](/catalog/)): 

{: .image-popup}
![Schema -- Large Multi-project](/catalog/multi-project/schema-3.png)
