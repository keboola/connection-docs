---
title: Migration between stacks
permalink: /management/project/migration/
---

* TOC
{:toc}

Keboola Connection is available in multiple [stacks](/overview/#stacks). Each stack instance 
is completely independent set of Keboola Connection services. Each project is fully contained within one of these stacks. 
In case you need to migrate a project between stacks for whatever reason, you can accomplish that in cooperation 
with [Keboola Support](/management/support/).

## Migration Steps

The project migration process is as follows:

- First you must obtain a new empty project in the destination stack.
- Then contact Keboola Support using the support link in your source project and provide the name and ID of your 
destination project.
- Keboola Support will then run a pre-migration validation to check if your project can be safely migrated.
  - If there are any issues, the support team will help you resolve them before performing the migration.
- Keboola Support will then migrate the source project into the destination project.
  - A snapshot of the source project is created and the new project is restored from that snapshot.
  - The source project remains unchanged and available.
- The new project is then available but it will still require the following:
  - Re-authorization of all OAuth component configurations.
  - All encrypted values for components configurations (like passwords and API keys) must be re-entered.
  - Alter the whitelist using the appropriate new [IP addresses](/components/ip-addresses/).
  - Set up any SSH tunnels for extractors and writers.
  - Invite users to the project.
  - Enable orchestrations.
- When everything is done, the old project can be safely deleted.

## What Will Be Migrated

- All project data and metadata for buckets, tables, and columns
- Configurations for all extractors, writers, and applications
- All transformations
- All orchestrations
- Keboola Provisioned Snowflake writers will be moved to the new stack's Snowflake account.
- GoodData projects will be moved to the new stack's GoodData account.

### Important
- The internal timestamp for all data rows will be set to the date of the migration. So, if you are using incremental loads 
based on [Changed in last](/transformations/mappings/#input-mapping) in 
transformations or writers, it will fetch all data on the first run.
- Creation dates and authors of all configurations will be modified.
- Orchestration IDs will be changed.
- Each Keboola Connection stack has a different set of assigned [IP addresses](/components/ip-addresses/).

## What Won't Be Migrated
- Encrypted values
  - Passwords, API keys, etc., stored in the extractor, writer and application configurations
  - OAuth authorizations
  - Extractor and writer SSH Tunnel private keys
- [Files](/storage/files/)
- Job execution history
- Events and logs
- Configuration versions
- Trash
- Project users
- Project API tokens

There may be some deprecated components in the source stack that are not available in the destination stack. 
These have to be removed from projects or migrated to new versions before migration. Also, the project backends 
must match (e.g., both projects must have a Snowflake backend).

Following your project validation, Keboola Support will inform you if they find any of the above issues in your 
project.
