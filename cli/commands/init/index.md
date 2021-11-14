---
title: Init
permalink: /cli/commands/init/
---

* TOC
{:toc}

```
kbc init [flags]
```

Initialize local directory of your project and run first [pull](/cli/commands/pull/) from Keboola Connection.

If the command is run without options it will start interactive dialog asking for URL of the Keboola Connection instance 
you want to use, [Master token](/management/project/tokens/#master-tokens) to your project, allowed branches to work 
with, and will offer you to create GitHub Actions workflows in the directory.

## Options

`-b, --allowed-branches <string>`
: Comma-separated list of branch IDs or name globs (use "*" for all) for branches you want to work with locally (default "main"), other branches in the project will be ignored

`--ci-main-branch <string>`
: Name of the main branch for push/pull workflows (default "main")

`--ci-pull <bool>`
: Create workflow to sync main branch from the project every 5 minutes (default true)

`--ci-push <bool>`
: Create workflow to push changes in main branch to the project (default true)

`--ci-validate <bool>`
: Create workflow to validate all branches on change (default true)

`-H, --storage-api-host <string>` 
: Keboola Connection instance url, eg. "connection.keboola.com"

[Global Options](/cli/commands/#global-options)

## Examples

```
➜ kbc init

Please enter Keboola Storage API host, eg. "connection.keboola.com".
? API host connection.north-europe.azure.keboola.com

Please enter Keboola Storage API token. The value will be hidden.
? API token ***************************************************

Please select which project's branches you want to use with this CLI.
The other branches will still exist, but they will be invisible in the CLI.
? Allowed project's branches: only main branch
Set allowed branches: "__main__"
Created metadata directory ".keboola".
Created manifest file ".keboola/manifest.json".
Created file ".env.local" - it contains the API token, keep it local and secret.
Created file ".env.dist" - an ".env.local" template.
Created file ".gitignore" - to keep ".env.local" local.

? Generate workflows files for GitHub Actions? No

Init done. Running pull.
Plan for "pull" operation:
+ B main
+ C main/extractor/ex-generic-v2/7122721-empty
+ C main/extractor/keboola.ex-aws-s3/7241111-my-aws-s-3-data-source
+ R main/extractor/keboola.ex-aws-s3/7241111-my-aws-s-3-data-source/rows/7241227-share-cities
+ C main/extractor/keboola.ex-google-drive/7241051-my-google-drive-data-source
+ C main/extractor/keboola.ex-google-drive/7241051-my-google-drive-data-source/schedules/7277240-scheduler-for-7243915
+ C main/other/keboola.orchestrator/7243915-daily
+ C main/other/keboola.orchestrator/7243915-daily/schedules/7243938-scheduler-for-7243915
+ C main/other/keboola.sandboxes/7241673-address
+ C main/transformation/keboola.snowflake-transformation/7241628-address
+ C main/transformation/keboola.snowflake-transformation/7241628-address/variables
+ R main/transformation/keboola.snowflake-transformation/7241628-address/variables/values/default
Pull done.
```

## Next Steps

- [Persist](/cli/commands/persist/)
