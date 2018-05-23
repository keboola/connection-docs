---
title: Migration between regions
permalink: /management/project/migration/
---

* TOC
{:toc}

Keboola Connection is available in multiple [regions](https://developers.keboola.com/overview/api/#regions-and-endpoints) — currently in the US (connection.keboola.com) and EU (connection.eu-central-1.keboola.com). Each region instance is a completely independent full stack of Keboola Connection services.
Project is always located in one of KBC stacks (regions). In case you need to migrate project for whatever reason between regions you can achieve that in cooperation with [Keboola Support](/management/support/).

## Migration steps

You can proceed a migration in following steps:

- Obtain a new empty project in destination region.
- Contact Keboola support from source project and provide a destination project.
- Keboola Support will run pre-migration validation to check if project can be safely migrated.
  - If there are any issues our support will help you resolve them before migrations.
- Keboola Support will migrate a source project into destination project.
  - Snapshot of source project is created and new project is restored from the snapshot.
  - Source project is unchanged and still available.
- New project is now available but it will require.
  - Reauthorize all OAuth component configurations.
  - Provide again encrypted value for components configurations like passwords and API keys.
  - Invite users into project.
  - Enable orchestrations.
- When everything is done old project can be deleted.

## What will be migrated

- All project's data and metadata which covers buckets, tables and columns
- Configurations of all extractors, writers and applications
- All transformations
- All orchestrations
- Keboola Provisioned Snowflake writers will be moved to a new region Snowflake account.
- GoodData projects will be moved to a new region GoodData account.

### Important

- Internal timestamp of all data rows will be set to date of migration. So if you are using incremental loads based on [Changed in last](https://help.keboola.com/manipulation/transformations/mappings/#input-mapping) in transformations or writers it will fetch all data on first run.
- Creation dates and authors of all configurations will be changed.
- Ids of orchestrations will be changed.

## What won't be migrated

- Encrypted values
  - Passwords, API keys, etc. stored in extractor, writers and applications configurations
  - OAuth authorizations
- [Files](/storage/file-uploads/)
- Jobs execution history
- Events and logs
- Configurations versions
- Trash
- Project users
- Project API tokens

## Migration from US to EU

There are some legacy and deprecated components in US region which are not available in EU region. 
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

Also projects with Redshift backend should be first migrated to Snowflake.

Keboola support will inform you after project validation it there are any of these issues.
