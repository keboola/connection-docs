---
title: Pay-As-You-Go Project
permalink: /management/payg-project/
---

* TOC
{:toc}

As an alternative to a [standard Keboola Connection project](/management/project/), Keboola added the option to create a pay-as-you-go project (PAYG).

##Platform Limits

Pay-as-you-go projects have the following limits, which are different from the limits of standard projects:

- **Single project:** 
Anyone can sign up for a PAYG project. 
The project is part of an Organization, where client has no admin access. 
If the client signs up for another project, a new Organization is created.
Anyone can sign up for any number of projects, but those projects are not connected in any way (no sharing, no data catalog, etc.).

- **Performance:** 
A Keboola project in PAYG is limited to xsmall DWH (twice slower than standard projects).

- **Support:** 
Except for the trial period, PAYG projects are not Zendesk supported. 
If you need help, you must pay for professional services or rely on community support. 

##DWH Backend

Users can choose between a Keboola-managed and their own Snowflake backend.

## Pricing & Credits

For a pay-as-you-go project, you need to buy credits with a credit card.
You can run any number of jobs, but for each hour of job execution, one credit is used. 
A job is started only if there is remaining credit balance.
Once it starts, it is allowed to finish even if it consumes more credits than available. 
When that happens, you will receive a notification reminding you to top up the balance. 
