---
title: Getting Started
permalink: /cli/getting-started/
---

* TOC
{:toc}

## Init the Directory

To manage a project using KBC CLI you need to initialize a directory. Create an empty directory, hop into it and run
the init command.

```
mkdir my-kbc-project
cd my-kbc-project
kbc init
```

The command runs interactively by default and asks for URL of the Keboola instance you want to use and
a [Master token](/management/project/tokens/#master-tokens) to your project. It pulls all configurations 
from the project to the local directory.

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

You could want to version your project in a git repository. Feel free to call `git init` and make an initial commit.
The init command can prepare workflows for GitHub Actions to keep your directory and the project in sync. 

## Push Changes to the Project

When you update your local directory you can compare the changes with the project:

```
➜ kbc diff --details
* changed
- remote state
+ local state

Diff:
* C main/extractor/keboola.ex-google-drive/7241051-my-google-drive-data-source | changed: configuration
```

Before pushing the changes to the project you are able to preview them first:

```
➜ kbc push --dry-run
Plan for "push" operation:
  * C main/extractor/keboola.ex-google-drive/7241051-my-google-drive-data-source | changed: configuration
Dry run, nothing changed.
Push done.
```

And finally perform the actual changes to the project:

```
➜ kbc push
Plan for "push" operation:
  * C main/extractor/keboola.ex-google-drive/7241051-my-google-drive-data-source | changed: configuration
Push done.
```

## Create New Configurations

Let's say you want to download some data from Wikipedia:

```
➜ kbc create config -b main -c ex-generic-v2 -n wiki
Created new config "main/extractor/ex-generic-v2/7528264/wiki"
```

Edit file `main/extractor/ex-generic-v2/7528264/wiki/config.json` as 
a [Generic Extractor](https://developers.keboola.com/extend/generic-extractor/) configuration. A super basic 
configuration could look like:

```json
{
  "api": {
    "baseUrl": "https://wikipedia.org"
  }
}
```

Now we can push it to the project:

```
➜ kbc push
Plan for "push" operation:
  + C main/extractor/ex-generic-v2/7528264/wiki
Push done.
```

## Pull Changes from the Project

When you create or change configurations in the project you can pull them to the local directory.

Show the changes between the project and the local directory:

```
➜ kbc diff --details
* changed
- remote state
+ local state

Diff:
* C main/extractor/ex-generic-v2/7528264/wiki
  configuration:
    api.baseUrl:
      - https://en.wikipedia.org/wiki/Git
      + https://wikipedia.org
```

Preview the pull command without changing anything first:

```
➜ kbc pull --dry-run
Plan for "pull" operation:
  * C main/extractor/ex-generic-v2/7528264/wiki | changed: configuration
Dry run, nothing changed.
Pull done.
```

And finally pull the changes to the local directory. Note that it will override any changes to your local directory:

```
➜ kbc pull
Plan for "pull" operation:
  * C main/extractor/ex-generic-v2/7528264/wiki | changed: configuration
Pull done.
```

## Next Steps

- [Configuration](/cli/configuration/)
- [Commands](/cli/commands/)
