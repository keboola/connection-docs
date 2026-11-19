---
title: Components
slug: 'components'
description: 'What Keboola components are, how configurations, rows, versions and jobs fit together, what the release stages mean, and where each task is documented.'
redirect_from:
    - /storage/configurations/
---

In the Keboola platform, most of the data processing functions are implemented in **components**. This page explains how components, configurations and jobs fit together. To start working with one, go to [Create and manage configurations](/components/configurations/).

<!-- Explanation-type page. Source: the Components page as it was before the 2026-11-19 split. Text carried over; facts not re-checked against the product. -->

Components are divided into the following categories:

- [**Data source connectors** (formerly known as extractors)](/components/extractors/) – bring data into a Keboola project.
- [**Data destination connectors** (formerly known as writers)](/components/writers/) – send processed data into a target system.
- [**Applications**](/components/applications/) – process complex data.

All components, regardless of their category, behave the same way. To use a component, you have to create a **configuration** first. A configuration sets the necessary parameters for each 
component (e.g., credentials and other specifications of what to do). Then, it can be run — a **job** is created and does the actual work.

## Finding a component

To see the components available to you and add one to your project, follow [Create a configuration](/components/configurations/#create-a-configuration). To browse the catalog outside your project, see the [Keboola Developer Portal](https://components.keboola.com/components). You do not need the portal to use components.

If no component connects to the system you need, you have several options:

- Write your own Python code in the [Custom Python](/components/applications/custom-python/) component to call external APIs or push data to third-party systems.
- Connect to a REST API without code using the [Generic Extractor](/components/extractors/generic-extractor/).
- Ask [Kai](/kai/), the AI assistant in your project, to help you set up the integration or use your own AI assistant through the [Keboola MCP Server](/ai/mcp-server/).
- Build your own component and register it in the [Developer Portal](https://components.keboola.com/); see the [developer guide](/extend/component/).

To adjust a component's input or output files without changing its code, use [processors](/extend/component/processors/).

## Component release stages
Our components are released at different stages and labeled to indicate the quality and production readiness level. We strive to deliver the highest-quality components. 
Our goal is to unlock as many interesting integrations as possible, benefiting all our customers. The component release grades allow us to manage the release process effectively 
and align expectations accurately.

|   | Experimental | Beta | Production (GA) |
|---|---|---|---|
| **Availability** | Available either in the UI or per request | Listed in the official component list and available to all customers | Listed in the  official component list and available to all customers |
| **Support & SLA** | No or limited SLA | Officially supported by Keboola's Standard SLA – in active development | Officially supported by Keboola's Standard SLA |
| **Production-ready** | Functional, but only for limited use cases<br/><br>Experimental component, not advisable for business-critical processes<br/><br>May not ever move to Beta/GA | Yes – with limitations<br/><br>Will eventually move to GA<br>(e.g., still in the process of fine-tuning, tested on fewer production use cases, may contain less robust documentation) | Yes<br/><br>Stable version, tested on many production use cases<br/><br>Fully documented |
| **Updates & Maintenance** | Breaking changes may be introduced (It is still possible to fix certain versions to avoid BC issues)<br/><br>Maintenance may end at any time → may be deprecated | Monitored via standard processes<br/><br>Always backward-compatible changes<br/><br>In active development | Monitored via standard processes<br/><br>Always backward-compatible changes, announced via standard channels |

### Production (GA)
This version is stable and has been well-tested by numerous customers in many production scenarios. GA (General Availability) versions feature comprehensive documentation 
and components with a low error rate, making them suitable for mission-critical production use cases. 

All potential updates to the component are guaranteed to be backward compatible.

### Beta
Components are available to all customers. These components are usually early additions and may still be in rapid development.

All changes are backward compatible. 

**Limitations:**

- Because in the early stages, these components are used in fewer projects. Minor bugs, though promptly fixed within the standard SLA, may appear more frequently.
- The range of features might not be exhaustive and will likely expand through backward-compatible updates.
- Documentation may be less comprehensive than in the GA version, often given as README.md files.
- These components may pose limitations, like pending Google verification, verification status-related rate limits, etc.

### Experimental
Developed for specific use cases but not tested in various scenarios, these highly experimental components are functional. When used in untested scenarios, 
they may contain undiscovered bugs and impose other limitations, such as rate limiting, reliance on less stable proprietary libraries, dependency on the source website structure (scraping),
and others. 

Experimental components may not progress to the Beta and GA stages.

Nevertheless, these components can address obscure use cases and deliver unique integrations. Their code is public so they can serve as a foundation for custom forks, 
including Generic Extractor configurations.

Many of these components also serve our internal purposes, and we decided to share them publicly to benefit our community.

### Private / Unlisted
Some components are still unlisted for various reasons. Each stack's full list of components is accessible via the public [Storage API index call](https://api.keboola.com/?service=storage#get-/v2/storage). 
Many of these are 3rd-party components. Users can add these components via their ID, but we cannot guarantee their functionality. 

We may share our pre-release versions that exist in private Beta with our test user groups. In such a case, you will receive a component ID, which you can use to create the configuration. 
These components will eventually transition to a public Beta.

## Creating component configuration

A configuration holds what a component needs to do its work: the credentials and the specification of what to read or write. A project can keep several configurations of the same component, for example with different credentials. For the steps, see [Create a configuration](/components/configurations/#create-a-configuration) and [Run a configuration](/components/configurations/#run-a-configuration).

## Configuration versions

Every change to a configuration is recorded as a new version, whether you make it in the UI or through the API. You can compare adjacent versions, copy any version, and roll back to an older one, as described in [See the version history](/components/configurations/#see-the-version-history).

## Configuration rows
Some components support the concept of multiple configurations sharing some of their parameters. A typical
example is database data source connectors, where multiple tables are extracted and share the same credentials.
In such components, the configuration contains only the credentials and tables stored in **configuration rows**.
The *configuration* acts as an envelope for the *configuration rows*.

The following example shows a configuration of the [AWS S3 data source connector](/components/extractors/storage/aws-s3/)
with three configuration rows:

![Screenshot - Configuration Rows](/components/configuration-14.png)

Each row can individually be modified or deleted. You can also disable a row, which means that if the entire 
configuration is run, the row will be skipped. You can also run a single row explicitly. Jobs that run only
a single row have the label **partial**. Therefore, you can, for example, create a configuration 
that, on a scheduled run, extracts all the enabled tables and also contains tables that
share the same credentials but are updated manually (or in a different flow).

You can add as many rows as you like; the list of configuration rows is fully searchable. You can also change the order of the
rows. The order is maintained during processing, so you can use this to extract the large tables first, for example. The
order of rows does not affect your project because a Job is only finished after each row is processed.

Components that support configuration rows also let you set job parallelism at the configuration level, so you can control the speed of an extraction or writing process. For a full explanation of how parallelism interacts with system limits, billing, and when it actually helps, see [Running Jobs in Parallel](/components/running-jobs-in-parallel/).

### Configuration rows versions
Changes to configuration rows are part of the [configuration versioning](#configuration-versions). The following image shows that
the versions in the configuration page list changes to the configuration rows – both that a table was added and that it was modified.

![Screenshot - Configuration Rows All Versions](/components/configuration-15.png)

That means that each configuration version contains a complete set of its rows. This is important when copying or rolling back a 
version – you can do these operations safely without worrying about rows.

When you edit a configuration row, a list of **row versions** appears. Row versions show changes only to the single
row. You can roll back a row to a previous version without interacting with the other rows.

![Screenshot - Rows Versions](/components/configuration-16.png)

***Note:** You cannot copy a configuration row to a new configuration. You always have to copy the entire
configuration.*

## Authorization

Many services support OAuth. Instead of entering the service's credentials in Keboola, you are redirected to the service and authorize the component there. If the account is not yours, you can send its owner a link. Both ways are on [Authorize a component](/components/authorization/).

## This section

The pages read in order, from your first configuration to the connector catalogues:

- [Create and manage configurations](/components/configurations/): create a configuration, run it, describe it, compare and roll back its versions, copy it, and delete or restore it.
- [Authorize a component](/components/authorization/): sign in to an external service with OAuth, with your own account or through a link for the account owner.
- [Debug mode](/components/debug-mode/): edit the raw JSON of a configuration and run a component under a custom tag.
- [Running jobs in parallel](/components/running-jobs-in-parallel/): what the parallelism setting of configuration rows does, and when it helps.
- [Variables](/components/variables/): placeholders in a configuration and variables in a flow. You can [use them in the UI](/components/variables/use/) or [through the API](/components/variables/api/).
- [Development branches](/components/branches/): change configurations without touching production, then [create and close a branch](/components/branches/manage/) and bring the changes back, with a [merge request](/components/branches/merge-requests/) where the project uses them.
- [IP addresses](/components/ip-addresses/): the addresses Keboola connects from, for your firewall rules.
- [Data source connectors](/components/extractors/): the catalogue of connectors that bring data into a project.
- [Data destination connectors](/components/writers/): the catalogue of connectors that send data to a target system.
- [Applications](/components/applications/): components that process data, such as Custom Python, Data Gateway and the trigger applications.

---

**Next:** [Create and manage configurations →](/components/configurations/)
