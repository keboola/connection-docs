---
title: Commands
permalink: /cli/commands/
---

* TOC
{:toc}

[create branch](/cli/commands/create-branch/)
: Create branch

[create config](/cli/commands/create-config/)
: Create configuration

[create row](/cli/commands/create-row/)
: Create configuration row

[diff](/cli/commands/diff/)
: Show differences between local directory and the project

[encrypt](/cli/commands/encrypt/)
: Encrypt unencrypted values in your local directory

[fix-paths](/cli/commands/fix-paths/)
: Ensure that all local paths match configured naming

[help](/cli/commands/help/)
: Show help about any command

[init](/cli/commands/init/)
: Initialize local directory of your project and run pull

[persist](/cli/commands/persist/)
: Propagate changes in the local directory to the manifest

[pull](/cli/commands/pull/)        
: Pull configurations from the project to the local directory

[push](/cli/commands/push/)
: Push configurations from the local directory to the Keboola Connection project

[status](/cli/commands/status/)
: Show information about the local directory

[validate](/cli/commands/validate/)
: Validate the local directory

[workflows](/cli/commands/workflows/)   
: Generate GitHub Actions workflows

## Options 

Options can be passed to each command from environment variables. In that case, the starting `--` becomes `KBC_`,
all letters are changed to uppercase and dashes to underscores, e.g. option `--log-file` becomes `KBC_LOG_FILE`.

You can also put the environment variables to [.env files](https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use).

Reading of the options by commands takes this priority:
1. Command-line flags
2. Environment variables from the OS environment
3. Environment variables from .env files in the working directory
4. Environment variables from .env files in the project directory

## Global Options

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
: Show version

`-d, --working-dir <string>`
: Use another working directory

## Next Steps

- [Create Branch](/cli/commands/create-branch/)
