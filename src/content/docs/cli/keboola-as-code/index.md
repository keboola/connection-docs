---
title: CLI
slug: 'cli/keboola-as-code'
---

:::caution[Deprecated in the future]
The **Keboola as Code CLI** will be deprecated in favor of the new agent-first
**[kbagent CLI](https://github.com/keboola/cli)**. Use kbagent for new automation;
this reference stays for existing Keboola-as-Code workflows.
:::

Keboola CLI (Command Line Interface), known also as "Keboola as Code", is a set of commands for operating your cloud data 
pipeline. It is available to install in the Windows, macOS, and Linux environments.

The whole Keboola project is represented by a local [directory structure](/cli/keboola-as-code/structure/#directory-structure). 
[Component configurations](/components) are represented by [JSON files](/cli/keboola-as-code/structure/#configurations).

## Use Cases

Keboola CLI can be used, for example, to:
- Pull your entire project to a local directory in seconds. See the [init](/cli/keboola-as-code/commands/sync/init/) and [pull](/cli/keboola-as-code/commands/sync/pull/) commands.
- Bulk edit [component configurations](/components) in your IDE.
- Compare the local version with the current project state. See the [diff](/cli/keboola-as-code/commands/sync/diff/) command.
- Copy a [configuration](/components) as a directory in the project and between projects. See the [persist](/cli/keboola-as-code/commands/local/persist/) command.
- Apply all changes back to the project in a moment. See the [push](/cli/keboola-as-code/commands/sync/push/) command.
- Manage project history in a git repository.
- Automate the whole process in a CI/CD pipeline. See [GitHub Integration](/cli/keboola-as-code/github-integration/). Use the `--skip-workflows` flag during initialization to avoid interactive prompts in automated environments.
- Merge and rebase Keboola Branches via Git. Learn more in the [Example Use Cases]() section.
- Distribute a single project definition into multiple projects. See the [Example Use Cases]() section.
- Multi-stage (and multi-project) environment management via Git. See the [Example Use Cases]() section. 
- Locally develop and test your dbt transformation code.

## Subsystems

A brief overview of supported subsystems of the project.

### Configurations

- [Component configurations](/components) and [configuration rows](/components/#configuration-rows) are fully supported.
- This includes all special types of components, such as:
  - [Transformations](/cli/keboola-as-code/structure/#transformations), [Variables](/cli/keboola-as-code/structure/#variables), [Shared Codes](/cli/keboola-as-code/structure/#shared-code), [Schedules](/cli/keboola-as-code/structure/#schedules) and [Orchestrations](/cli/keboola-as-code/structure/#orchestrations).   

### Development Branches

- A [branch](/components/branches/)  can be [pulled](/cli/keboola-as-code/commands/sync/pull/) and then edited or deleted locally. 
- Changes can be [pushed](/cli/keboola-as-code/commands/sync/push/) back to the project.
- There is one limitation, **a branch cannot be created locally**. 
  - A branch must be created directly in the project, from the `main` branch.
  - See the [Create Branch](/cli/keboola-as-code/commands/remote/create/branch/) command.

### Storage

At the moment, all [Storage](/storage/) related operations are sub-commands of the [kbc remote](/cli/keboola-as-code/commands/remote/) command. They operate directly on a project. This means that any changes you make using the CLI are immediately applied to your project. We have plans to add support for managing buckets and tables locally using definition files just like component configurations.

#### Files

- To upload a file, use the [file upload](/cli/keboola-as-code/commands/remote/file/upload/) command.
- To download a file, use the [file download](/cli/keboola-as-code/commands/remote/file/download/) command.

#### Buckets and tables

These commands can be used to manage the [buckets](/storage/buckets/) and [tables](/storage/tables/) in your project:
- To create a new bucket, use the [create bucket](/cli/keboola-as-code/commands/remote/create/bucket/) command. 
- To create a new table, use the [create table](/cli/keboola-as-code/commands/remote/table/create) command.

The resulting [tables](/storage/tables/) will be empty, so you may want to use:
- The [table import](/cli/keboola-as-code/commands/remote/table/import/) command to import data. 
- The [table unload](/cli/keboola-as-code/commands/remote/table/unload/) command can be used to take data out of a table and store it in a file.

For convenience, you can use combined commands:
- The [table upload](/cli/keboola-as-code/commands/remote/table/upload/) command combines the [file upload](/cli/keboola-as-code/commands/remote/file/upload/) + [table import](/cli/keboola-as-code/commands/remote/table/import/) operations.
- The [table download](/cli/keboola-as-code/commands/remote/table/download/) command combines the [table unload](/cli/keboola-as-code/commands/remote/table/unload/) + [file download](/cli/keboola-as-code/commands/remote/file/download/) operations.

These commands may be a little heavy if you are dealing with a lot of data.
- If you just want a quick sample, use the [table preview](/cli/keboola-as-code/commands/remote/table/preview/) command.

## Next Steps

- [Installation](/cli/keboola-as-code/installation/)
- [Getting Started](/cli/keboola-as-code/getting-started/)
- [Directory Structure](/cli/keboola-as-code/structure/)
- [Commands](/cli/keboola-as-code/commands/)
