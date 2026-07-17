---
title: Automation/Common Tasks
slug: 'automate'
---

## Automation

Use the Keboola Orchestrator component to specify what tasks should be executed in what order and 
configure their automatic execution (specified intervals, specified times of the day, etc.).

The set of [Keboola APIs](/overview/api/) provides full automation of the data warehouse cycle. 
The end-to-end serverless solution automatically enables you to connect data sources, automatically store data 
in the correct format, check for format inconsistencies, and choose different metadata providers based on the
operation you wish to perform on the data. The platform scales the needed resources automatically across various 
types of data (structured, semi-structured, and non-structured) and processes.

The whole environment tracks all the [operational metadata](https://api.keboola.com/?service=storage#tag--Events) 
and can be accessed without needing a server via APIs. This is useful when automating development, testing and 
production run of data jobs with automatic controls of [pipelines](https://api.keboola.com/?service=storage#get-/v2/storage/dev-branches/-id-).

As Storage API is part of the wider Keboola platform, it is an essential element in providing coherent data 
fabric across clouds, users, services, and on premise.

## CI/CD

No matter whether you use Jenkins, CircleCI, AWS CodeBuilder, or Azure DevOps, you can utilise 
the Keboola API within your existing CI/CD pipeline to deploy and manage new versions of your data 
pipeline and data process automation tasks.

## Documentation

You can learn about how to set up our Orchestrator on [help.keboola.com/tutorial/automate/](/tutorial/automate/).

<!-- 
  - Load data from your system
  - Trigger orchestrations
  - Send data
  - Copy buckets from different projects

Orchestrator

spusteni jobu
API pro konfiguraci, nepouzivat normalni api
custom joby
-->
