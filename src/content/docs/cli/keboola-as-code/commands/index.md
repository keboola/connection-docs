---
title: Commands
slug: 'cli/keboola-as-code/commands'
---


Run `help` to list all available commands.
```
kbc help
```

You can also get details of any command.
```
kbc help <command>
kbc help local create row
```

## Available Commands

|---
| Command | Description
|-|-|-
| [kbc help](/cli/keboola-as-code/commands/help/) | Show help for any command. |
| [kbc status](/cli/keboola-as-code/commands/status/) | Show information about a working directory. |
| | |
| **[kbc sync](/cli/keboola-as-code/commands/sync/)** | **Synchronization between a [local directory](/cli/keboola-as-code/structure/) and a [project](/cli/keboola-as-code/#subsystems).** |
| [kbc sync init](/cli/keboola-as-code/commands/sync/init/) | Initialize a new local directory and run `kbc sync pull`. |
| [kbc sync pull](/cli/keboola-as-code/commands/sync/pull/) | Sync a project to the local directory. |
| [kbc sync push](/cli/keboola-as-code/commands/sync/push/) | Sync a local directory to the project. |
| [kbc sync diff](/cli/keboola-as-code/commands/sync/diff/) | Show differences between a local directory and a project. |
| | |
| **[kbc ci](/cli/keboola-as-code/commands/ci/)** | **Manage the CI/CD pipeline.** |
| [kbc ci workflows](/cli/keboola-as-code/commands/ci/workflows/) | Generate workflows for [GitHub Actions integration](/cli/keboola-as-code/github-integration/). |
| | |
| **[kbc local](/cli/keboola-as-code/commands/local/)** | **Operations in the [local directory](/cli/keboola-as-code/structure/) don't affect the project.** |
| [kbc local create](/cli/keboola-as-code/commands/local/create/) | Create an object in the local directory. |
| [kbc local create config](/cli/keboola-as-code/commands/local/create/config/) | Create an empty [configuration](/components/). |
| [kbc local create row](/cli/keboola-as-code/commands/local/create/row/) | Create an empty [configuration row](/components/#configuration-rows). |
| [kbc local persist](/cli/keboola-as-code/commands/local/persist/) | Detect new directories with a [configuration](/components/) or a [configuration row](/components/#configuration-rows). |
| [kbc local encrypt](/cli/keboola-as-code/commands/local/encrypt/) | Encrypt all [unencrypted secrets](/overview/encryption/#encrypting-data-with-api). |
| [kbc local validate](/cli/keboola-as-code/commands/local/validate/) | Validate the local directory. |
| [kbc local validate config](/cli/keboola-as-code/commands/local/validate/config/) | Validate a configuration JSON file. |
| [kbc local validate row](/cli/keboola-as-code/commands/local/validate/row/) | Validate a configuration row JSON file. |
| [kbc local validate schema](/cli/keboola-as-code/commands/local/validate/schema/) | Validate a configuration/row JSON file by a JSON schema file. |
| [kbc local fix-paths](/cli/keboola-as-code/commands/local/fix-paths/) | Ensure that all local paths match [configured naming](/cli/keboola-as-code/structure/#naming). |
| | |
| **[kbc remote](/cli/keboola-as-code/commands/remote/)** | **Operations directly in the [project](/cli/keboola-as-code/#subsystems).** |
| [kbc remote create](/cli/keboola-as-code/commands/remote/create/) | Create an object in the project. |
| [kbc remote create branch](/cli/keboola-as-code/commands/remote/create/branch/) | Create a new [branch](/components/branches/) from the `main` branch. |
| [kbc remote create bucket](/cli/keboola-as-code/commands/remote/create/bucket/) | Create a new [bucket](/storage/buckets/). |
| [kbc remote file](/cli/keboola-as-code/commands/remote/file/) | Manage [files](/storage/files/) in Storage. |
| [kbc remote file download](/cli/keboola-as-code/commands/remote/file/download/) | Download a [file](/storage/files/) from Storage. |
| [kbc remote file upload](/cli/keboola-as-code/commands/remote/file/upload/) | Upload a [file](/storage/files/) to Storage. |
| [kbc remote job](/cli/keboola-as-code/commands/remote/job/) | Manage [jobs](/management/jobs/) in the project. |
| [kbc remote job run](/cli/keboola-as-code/commands/remote/job/run/) | Run one or more [jobs](/management/jobs/). |
| [kbc remote table](/cli/keboola-as-code/commands/remote/table/) | Manage [tables](/storage/tables/) in the project. |
| [kbc remote table create](/cli/keboola-as-code/commands/remote/table/create/) | Create a new [table](/storage/tables/). |
| [kbc remote table upload](/cli/keboola-as-code/commands/remote/table/upload/) | Upload a CSV file to a [table](/storage/tables/). |
| [kbc remote table download](/cli/keboola-as-code/commands/remote/table/download/) | Download data from a [table](/storage/tables/). |
| [kbc remote table preview](/cli/keboola-as-code/commands/remote/table/preview/) | Preview up to 1000 rows from a [table](/storage/tables/). |
| [kbc remote table detail](/cli/keboola-as-code/commands/remote/table/detail/) | Print [table](/storage/tables/) details. |
| [kbc remote table import](/cli/keboola-as-code/commands/remote/table/import/) | Import data to a [table](/storage/tables/) from a [file](/storage/files/). |
| [kbc remote table unload](/cli/keboola-as-code/commands/remote/table/unload/) | Unload a [table](/storage/tables/) into a [file](/storage/files/). |
| [kbc remote workspace](/cli/keboola-as-code/commands/remote/create/) | Manage workspaces in the project. |
| [kbc remote workspace create](/cli/keboola-as-code/commands/remote/workspace/create/) | Create a workspace in the project. |
| [kbc remote workspace delete](/cli/keboola-as-code/commands/remote/workspace/delete/) | Delete a workspace in the project. |
| [kbc remote workspace detail](/cli/keboola-as-code/commands/remote/workspace/detail/) | Print workspace details and credentials. |
| [kbc remote workspace list](/cli/keboola-as-code/commands/remote/workspace/list/) | List workspaces in the project. |
| | |
| **[kbc dbt](/cli/keboola-as-code/commands/dbt/)** | **Work with dbt inside your repository.** |
| [kbc dbt init](/cli/keboola-as-code/commands/dbt/init/) | Initialize profiles, sources, and environment variables for use with dbt. |
| [kbc dbt generate](/cli/keboola-as-code/commands/dbt/generate/) | Generate profiles, sources, and environment variables for use with dbt. |
| [kbc dbt generate profile](/cli/keboola-as-code/commands/dbt/generate/profile/) | Generate profiles for use with dbt. |
| [kbc dbt generate sources](/cli/keboola-as-code/commands/dbt/generate/sources/) | Generate sources for use with dbt. |
| [kbc dbt generate env](/cli/keboola-as-code/commands/dbt/generate/env/) | Generate environment variables for use with dbt. |
| | |
| **[kbc llm](/cli/keboola-as-code/commands/llm/) (BETA)** | **Export project data to AI-optimized format.** |
| [kbc llm init](/cli/keboola-as-code/commands/llm/init/) | Initialize a new local directory for LLM export. |
| [kbc llm export](/cli/keboola-as-code/commands/llm/export/) | Export project data to AI-optimized twin format. |

## Aliases

The most used commands have their shorter aliases.

For example, you can use `kbc c` instead of `kbc local create`.

|---
| Full Command | Aliases
|-|-|-
| `kbc sync init`      |  `kbc init`, `kbc i`
| `kbc sync diff`      |  `kbc diff`, `kbc d`
| `kbc sync pull`      |  `kbc pull`, `kbc pl` 
| `kbc sync push`      |  `kbc push`, `kbc ph`
| `kbc local validate` |  `kbc validate`, `kbc v`
| `kbc local persist`  |  `kbc persist`, `kbc pt`
| `kbc local create`   |  `kbc create`, `kbc c`
| `kbc local encrypt`  |  `kbc encrypt`, `kbc e`

## Options 

Options are a way to modify the behavior of a command, they can be:
- **[Global](#global-options)**, for all commands, see below.
- **Local**, only for a specific command, see the command help.

#### Command-line flags

- Entered as part of the CLI command.
- One-letter flags start with `-`, for example `-v`.
- Longer flags start with `--`, for example `--verbose`.
- **Flags take precedence over environment variables.**

#### Environment variables

- Each flag can be defined via an environment variable.
- Variable name is based on the flag name, and starts with `KBC_`.
- All letters are changed to uppercase and dashes to underscores.
- For example, flag `--log-file` can be defined by the `KBC_LOG_FILE` environment variable.
- Sources and priority of the environment variables:
    1. From the OS environment.
    2. From environment files in the working directory.
    3. From environment files in the project directory.

All found environment files are automatically loaded.  
Variables are merged together according to the following priority.

|---
| Environment File | Environment | Priority
|-|-|-
| `.env.development.local`  | Development | The highest |  
| `.env.test.local`         | Test |  |
| `.env.production.local`   | Production |  |
| `.env.local`              | Wherever the file is |  |
| `.env.development`        | Development|  |
| `.env.test`               | Test|  |
| `.env.production`         | Production|  |
| `.env`                    | All | The lowest  |

*Note: All `.*local` environment files should be part of the `.gitignore` file, if used.*

### Global Options

`-h, --help`
: Show help for the command

`-l, --log-file <string>`
: Path to a log file to store the details in

`-t, --storage-api-token <string>`
: Storage API token to the project

`-v, --verbose`
: Increase output verbosity

`--verbose-api`
: Log each API request and its response

`-V, --version`
: Show the version

`-d, --working-dir <string>`
: Use another working directory

## Next Steps

- [Installation](/cli/keboola-as-code/installation/)
- [Getting Started](/cli/keboola-as-code/getting-started/)
- [Directory Structure](/cli/keboola-as-code/structure/)
- [GitHub Integration](/cli/keboola-as-code/github-integration/)
