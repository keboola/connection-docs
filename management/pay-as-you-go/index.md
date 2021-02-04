---
title: Free Plan (Pay As You Go)
permalink: /management/payg-project/
---

* TOC
{:toc}

You can now start working with Keboola Connection for free and without a contract. 
Simply signing up on the website starts a project under the Free Plan.

## Platform Limits
Pay-as-you-go (PAYG) projects have the following limits, which differ from the [limits for standard projects](/management/project/limits/):

- **Single project:** each Free Plan account is limited to one project, so it is not feasible for [multi-project architecture](/catalog/multi-project/) and there is no [data catalog](/catalog/).
- **Features:** apart from the absent data catalog, and transformations being limited to [SQL](/transformations/snowflake-plain/) and [Python](/transformations/python-plain/), all features are available to Free Plan account holders. There is no limit to the number of sources, orchestrations, etc.
- **Performance:** a Keboola Connection project in PAYG is limited to an xsmall data warehouse (DWH) (half the speed of standard projects) and doesn’t allow for Python workspace sizing.
- **Storage:** a Free Plan project is limited to 250 GB of data storage.
- **Support:** while we strive to provide great support even under the Free Plan, there is no service-level agreement (SLA) and we will deal with the tickets on a best-effort basis. 

## DWH Backend
Users can choose between a Keboola-managed backend or their own Snowflake backend.

## Pricing & Credits
Each Free Plan project receives up to 300 minutes of free runtime per month in the form of credits (one credit
equals 60 minutes of running of any process - for example, a component job, an active Python workspace, 
or SQL queries in Keboola-managed DWH). Additional credits can be purchased within the platform by using 
a credit card. There is no contract apart from the Free Plan Terms of Services. If a project runs out of credits, 
the jobs cease executing until more credits are purchased or free credits are topped up.

Unused free credits don’t roll over from one month to the next. Purchased credits don’t expire during the life of the project.

Any Free Plan project can be migrated to a [standard Keboola Connection project](/management/project/) 
upon the execution of our standard order form under the Master Software Subscription Agreement (MSSA).
