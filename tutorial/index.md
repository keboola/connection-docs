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

If you are new to Keboola, we recommend exploring our comprehensive [platform overview](/overview/). 
This resource will help you become acquainted with commonly used terms and gain a solid understanding of the Keboola ecosystem.

To get started, ensure you have access to a Keboola project. If you haven’t got one yet, reach out to us at sales@keboola.com, 
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
1. [**Loading data manually**](/tutorial/load/): Load four CSV files into Keboola Storage tables.
2. [**Data manipulation**](/tutorial/manipulate/): Utilize transformations to create a denormalized table from the input tables and make minor modifications.
3. [**Writing data into Google Sheets**](/tutorial/write/): Write the transformed data to Google Sheets.

### Advanced Steps
For a deeper exploration of Keboola features, aligning with real-world usage, consider the following advanced steps:
1. **Loading data using data source connectors**
   - [Google Sheets data source](/tutorial/load/googlesheets/): Load data from an external spreadsheet using the Google Sheets data source connector.
   - [Database data source](/tutorial/load/database/): Load data from an external database utilizing the [Snowflake Database data source connector](/tutorial/load/database/) (applicable to all Keboola-supported [database data sources](/components/extractors/database/)).
2. [**Data manipulation: creating and using a workspace**](/tutorial/manipulate/workspace/)
   - Create and utilize a workspace, a secure development and analytical environment. It enables you to interact with data and develop transformation code on a copy of your production data.
3. [**Automation: setting up a flow**](/tutorial/automate/)
   - Specify task sequences and configure their automatic execution through the setup of a flow.
4. [**Ad-hoc data analysis**](/tutorial/ad-hoc/)
   - Explore how to perform ad-hoc data analysis, allowing flexibility in interacting with arbitrary data.
5. [**Development branches**](/tutorial/branches/)
   - Learn how to safely modify a running project using development branches.
6. [**Command-line interface (CLI)**](https://developers.keboola.com/cli/)
   - Operate a project efficiently using the Keboola command-line tool.

These advanced steps will provide you with a comprehensive understanding of Keboola's capabilities and their practical application in real-world scenarios.
