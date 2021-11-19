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

You can choose if the directories will contain object IDs or not. Example:
- path with IDs:    83065-dev-branch/writer/keboola.wr-db-snowflake/734333057-power-bi/rows/734333064-orders
- path without IDs: dev-branch/writer/keboola.wr-db-snowflake/power-bi/rows/orders

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

The directory structure can optionally contain object IDs. Example:
- path with IDs:    83065-dev-branch/writer/keboola.wr-db-snowflake/power-bi/rows/orders
- path without IDs: dev-branch/writer/keboola.wr-db-snowflake/power-bi/rows/orders
? Do you want to include object IDs in directory structure? No
Created metadata directory ".keboola".
Created manifest file ".keboola/manifest.json".
Created file ".env.local" - it contains the API token, keep it local and secret.
Created file ".env.dist" - an ".env.local" template.
Created file ".gitignore" - to keep ".env.local" local.

The directory structure can optionally contain object IDs. Example:
- path with IDs:    83065-dev-branch/writer/keboola.wr-db-snowflake/734333057-power-bi/rows/734333064-orders
- path without IDs: dev-branch/writer/keboola.wr-db-snowflake/power-bi/rows/orders
? Do you want to include object IDs in directory structure? No
? Generate workflows files for GitHub Actions? No

Init done. Running pull.
Plan for "pull" operation:
+ B main
+ C main/extractor/ex-generic-v2/empty
+ C main/extractor/keboola.ex-aws-s3/my-aws-s-3-data-source
+ R main/extractor/keboola.ex-aws-s3/my-aws-s-3-data-source/rows/share-cities
+ C main/extractor/keboola.ex-google-drive/my-google-drive-data-source
+ C main/extractor/keboola.ex-google-drive/my-google-drive-data-source/schedules/scheduler-for-7243915
+ C main/other/keboola.orchestrator/daily
+ C main/other/keboola.orchestrator/daily/schedules/scheduler-for-7243915
+ C main/other/keboola.sandboxes/address
+ C main/transformation/keboola.snowflake-transformation/address
+ C main/transformation/keboola.snowflake-transformation/address/variables
+ R main/transformation/keboola.snowflake-transformation/address/variables/values/default
Pull done.
```

## Next Steps

- [Persist](/cli/commands/persist/)
