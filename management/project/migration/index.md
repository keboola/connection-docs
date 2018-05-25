---
title: Migration between regions
permalink: /management/project/migration/
---

* TOC
{:toc}

Keboola Connection is available in multiple [regions](https://developers.keboola.com/overview/api/#regions-and-endpoints) — currently in the US (connection.keboola.com) and EU (connection.eu-central-1.keboola.com). Each region instance is a completely independent full stack of Keboola Connection services.
Each project is fully contained within one of these stacks (regions). In case you need to migrate a project between 
regions for whatever reason, you can accomplish that in cooperation with [Keboola Support](/management/support/).

## Migration steps

The project migration process is as follows:

- First you must obtain a new empty project in the destination region.
- Then contact Keboola support using the support link in your source project and provide the name and ID of your 
destination project
- Keboola Support will then run a pre-migration validation to check if your project can be safely migrated.
  - If there are any issues, the support team will help you resolve them before performing the migration.
- Keboola Support will then migrate the source project into the destination project.
  - A snapshot of source project is created and the new project is restored from that snapshot.
  - The source project remains unchanged and available.
- The new project is then available but it will still require the following:
  - Re-authorization of all OAuth component configurations.
  - All encrypted values for components configurations (like passwords and API keys) must be re-entered.
  - Alter the whitelist the appropriate new [IP addresses](/extractors/ip-addresses/).
  - Setup any SSH tunnels for extractors and writers.
  - Invite users to the project.
  - And enable orchestrations.
- When everything is done, the old project can be safely deleted.

## What will be migrated

- All project data and metadata for buckets, tables and columns
- Configurations for all extractors, writers and applications
- All transformations
- All orchestrations
- Keboola Provisioned Snowflake writers will be moved to the new region Snowflake account.
- GoodData projects will be moved to the new region GoodData account.

### Important

- The internal timestamp for all data rows will be set to date of migration. So if you are using incremental loads 
based on [Changed in last](https://help.keboola.com/manipulation/transformations/mappings/#input-mapping) in 
transformations or writers it will fetch all data on the first run.
- Creation dates and authors of all configurations will be modified.
- Orchestration IDs will be changed.
- Each KBC stack has a different set of assigned [IP addresses](/extractors/ip-addresses/)

## What won't be migrated

- Encrypted values
  - Passwords, API keys, etc. stored in extractor, writers and applications configurations
  - OAuth authorizations
  - Extractors and writers SSH Tunnel private keys
- [Files](/storage/file-uploads/)
- Job execution history
- Events and logs
- Configuration versions
- Trash
- Project users
- Project API tokens

## Migration from US to EU

There are some legacy and deprecated components in the US region which are not available in the EU region. 
These have to be removed from projects or migrated to new versions before migration. 

Except components marked as deprecated this also covers:
- Rest Box extractor
- Anomaly detection application
- Basket analysis application
- Correlations application
- Data Type Assistant application
- Grouped histogram application
- Linear dependency finder application
- Next event application
- Segmentation application
- Table Content Overview application

Also projects with a Redshift backend should be first migrated to Snowflake.

Keboola support will inform you after completing the project validation if there are any of these issues with your 
project.
