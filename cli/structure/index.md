---
title: Directory Structure
permalink: /cli/structure/
---

* TOC
{:toc}

Initial configuration of your local directory can be done using [init command](/cli/commands/init/). It initiates 
the directory and pulls configurations from the project.

Storage token to your project is stored in the file `.env.local` under `KBC_STORAGE_API_TOKEN` directive. Currently, 
it is necessary to use [Master tokens](/management/project/tokens/#master-tokens).

```
├─ .gitignore
├─ .env.local                        - contains API token
├─ .env.dist                         - template for .env.local
├─ .keboola                          - metadata
   └─ manifest.json
└─ [branch-name]                     - e.g. test
   ├─ description.md
   ├─ meta.json                 
   └─ [component-type]               - e.g. extractor
      └─ [component-id]              - e.g. keboola.ex-db-oracle
         └─ [config-name]            - e.g. oauth-test
            ├─ config.json           
            ├─ description.md
            ├─ meta.json        
            └─ rows
               └─ [row-name]         - e.g. prod-fact-table
                  ├─ config.json     
                  ├─ description.md
                  └─ meta.json
            └─ schedules
               └─ [schedule-name]
                  ├─ config.json     
                  ├─ description.md
                  └─ meta.json
            └─ variables
               └─ values
                  └─ default
                     ├─ config.json     - variables default values
                     ├─ description.md       
                     └─ meta.json
               ├─ config.json           - variables configuration
               ├─ description.md
               └─ meta.json
   └─ _shared
      └─ [component-id]
         └─ codes
            └─ [code-name]
               ├─ code.[ext]            - e.g. code.sql
               ├─ config.json
               ├─ description.md
               └─ meta.json
```

## Branches

The tool works with [dev branches](/components/branches/) by default. You can choose the branches from the project 
you want to work with locally in [init](/cli/commands/init/) command. You can ignore dev branches concept and work with 
the main branch only of course but note that all its configurations will be stored in the directory `main`.

The directory of the main branch is called simply `main` and does not contain the branch id so that it is easily 
recognizable from the other branches.

The directory contains `description.md` where you can write description formatted in [Markdown](https://www.markdownguide.org/) 
and `meta.json` containing the name of the branch and flag if it is default or not.

Example of `meta.json`:
```json
{
  "name": "Main",
  "isDefault": true
}
```

Then there are directories thematically grouping components: `extractor`, `other`, `transformation`, `writer`.

Example of a branch folder with components configurations:

{: .image-popup}
![Screenshot -- A configuration directory example](/cli/structure/directory-example.jpg)


## Configurations

Directory of each configuration contains `config.json` with parameters specific for each component, `description.md` 
where you can write description formatted in [Markdown](https://www.markdownguide.org/) and `meta.json` containing name 
of the configuration.

Example of `config.json` for Generic Extractor:
```json
{
  "api": {
      "baseUrl": "https://wikipedia.org"
  }
}
```

Example of `meta.json`:
```json
{
  "name": "Wikipedia"
}
```

Configuration directories can be copied freely inside the project and between other projects. Their IDs are stored 
in the [manifest](/cli/structure/#manifest). So after the copy & paste make sure to run 
the [persist command](/cli/commands/persist/) which generates a new ID for the configuration and saves it in the manifest.

## Configuration Rows

The directory structure of configuration rows is the same as the configuration itself. The component configuration
contains directory `rows` that includes a directory for each row. That directory contains `config.json`, 
`description.md` and `meta.json`.

Example of `meta.json`:
```json
{
  "name": "share/cities2",
  "isDisabled": false
}
```

Example of a Google Drive Extractor configuration:

{: .image-popup}
![Screenshot -- A configuration rows directory example](/cli/structure/directory-rows-example.jpg)

## Transformations

In addition to other configurations, the transformations directories contain `blocks` directory and in it a list of codes.
Codes are stored in native files according to the type of transformation. I.e. Snowflake transformations store the codes
in `.sql` files.

Example of a Snowflake Transformation configuration:

{: .image-popup}
![Screenshot -- A transformation directory example](/cli/structure/directory-transformation-example.jpg)

## Variables

[Variables](/transformations/variables/#variables) directory in addition to standard configuration layout contains
directory `values`.

Let's say you have these two variables in your transformation:

{: .image-popup}
![Screenshot -- Variables in the UI](/cli/structure/variables-ui.jpg)

When you [pull](/cli/commands/pull/) them to the local directory it will look like this:

{: .image-popup}
![Screenshot -- Configuration directory with the variables](/cli/structure/variables-directory.jpg)

Variables configuration in `variables/config.json`:

```json
{
  "variables": [
    {
      "name": "state",
      "type": "string"
    },
    {
      "name": "city",
      "type": "string"
    }
  ]
}
```

Default values configuration in `variables/values/default/config.json`:

```json
{
  "values": [
    {
      "name": "state",
      "value": "NY"
    },
    {
      "name": "city",
      "value": "Boston"
    }
  ]
}
```

## Shared Codes

[Shared code](/transformations/variables/#shared-code) blocks are stored in the branch directory under `_shared` 
subdirectory so that they can be reused between different configurations.

If you create a shared code from your block:

{: .image-popup}
![Screenshot -- Shared code directory](/cli/structure/shared-code-ui.jpg)

It will move to the `_shared` directory:

{: .image-popup}
![Screenshot -- Shared code directory](/cli/structure/shared-code-directory.jpg)

And the code in the transformation file `blocks/block-1/join/code.sql` is changed to:

{: .image-popup}
![Screenshot -- Shared code code](/cli/structure/shared-code-code.jpg)


## Schedules

[Orchestrator](/orchestrator/running) or any other component can have a schedule to be run automatically and 
periodically. The schedule resides in a configuration directory.

{: .image-popup}
![Screenshot -- Scheduler directory](/cli/structure/scheduler-directory.jpg)

The schedule's `config.json` contains [crontab](https://crontab.guru/) format of the schedule, timezone, and flag 
if it should be enabled or not. 

This example shows a schedule to be run at minute 40 past every hour:

```json
{
  "schedule": {
    "cronTab": "40 */1 * * *",
    "timezone": "UTC",
    "state": "enabled"
  },
  "target": {
    "mode": "run"
  }
}
```

## Orchestrations

The Orchestrator directories contain `phases` directory and in it a list of tasks.

Example:

{: .image-popup}
![Screenshot -- An orchestration directory](/cli/structure/directory-orchestration-example.jpg)

A `phase.json` example:

```json
{
  "name": "Transformation",
  "dependsOn": [
    "001-extraction"
  ]
}
```

A `task.json` example:

```json
{
  "name": "keboola.snowflake-transformation-7241628",
  "task": {
    "mode": "run",
    "configPath": "transformation/keboola.snowflake-transformation/address-completion"
  },
  "continueOnFailure": false,
  "enabled": true
}
```

## Manifest

The local state of the project is stored in the manifest file `.keboola/manifest.json`. It is not recommended to modifying
this file manually.

This is its basic structure:

- `version` - current supported version is `2`
- `project` - information about the project
  - `id` - ID of the project
  - `apiHost` - url of the Keboola Connection instance (e.g. `connection.keboola.com`)
- `sortBy` - name of the configuration property used for sorting (default `id`)
- `naming` - rules for directory names, [see the details](/cli/structure/#naming)
- `allowedBranches` - array of branches to work with
- `ignoredComponents` - array of components to not work with
- `branches` - array of used branches
  - `id` - ID of the branch
  - `path` - name of the directory containing the branch configuration (e.g. `main`)
- `configurations` - array of component configurations
  - `branchId` - ID of the branch the configuration belongs to
  - `componentId` - ID of the component (e.g. `keboola.ex-aws-s3`)
  - `id` - ID of the configuration
  - `path` - path to the configuration in the local directory (e.g. `extractor/keboola.ex-aws-s3/7241111/my-aws-s3-data-source`)
  - `rows` - array of configuration rows (if the component supports rows)
    - `id` - ID of the row
    - `path` - path to the row from the configuration directory (e.g. `rows/cities`)

### Naming

Names of the directories of different configuration types are subject to rules defined in 
the [manifest](/cli/structure/#manifest) under `naming` section. These are the default values:

```json
{
    "branch": "{branch_name}",
    "config": "{component_type}/{component_id}/{config_name}",
    "configRow": "rows/{config_row_name}",
    "schedulerConfig": "schedules/{config_name}",
    "sharedCodeConfig": "_shared/{target_component_id}",
    "sharedCodeConfigRow": "codes/{config_row_name}",
    "variablesConfig": "variables",
    "variablesValuesRow": "values/{config_row_name}"
  }
```

And in case you let the object IDs be included in directory names (see [init](/cli/commands/init/) command for more details):

```json
{
    "branch": "{branch_id}-{branch_name}",
    "config": "{component_type}/{component_id}/{config_id}-{config_name}",
    "configRow": "rows/{config_row_id}-{config_row_name}"
    "schedulerConfig": "schedules/{config_name}",
    "sharedCodeConfig": "_shared/{target_component_id}",
    "sharedCodeConfigRow": "codes/{config_row_name}",
    "variablesConfig": "variables",
    "variablesValuesRow": "values/{config_row_name}"
  }
```

You can change them according to your wish and let the project directory be rebuilt using 
[fix-paths](/cli/commands/fix-paths) command.

## Next Steps

- [Commands](/cli/commands/)
