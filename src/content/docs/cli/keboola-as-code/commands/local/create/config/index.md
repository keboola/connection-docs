---
title: Create Configuration
slug: 'cli/keboola-as-code/commands/local/create/config'
---


**Create an empty [configuration](/components/).**

```
kbc local create config [flags]
```

Or shorter:

```
kbc create config [flags]
```

```
kbc c config [flags]
```

Create an empty configuration in your [local directory](/cli/keboola-as-code/structure/) and assign it a unique ID (i.e., the [persist](/cli/keboola-as-code/commands/local/persist/) 
command is called automatically). To save it to the project, run the [kbc sync push](/cli/keboola-as-code/commands/sync/push/) command afterwards. You will 
be prompted for a name, a branch, and a component ID.

Some components have a default content that will be used (if specified by the component author). 
For others, `config.json` will only contain an empty JSON document `{}`.

*Tip: You can create a new configuration by copying an existing one and running the [persist](/cli/keboola-as-code/commands/local/persist/) 
command.*

### Options

`-b, --branch string <string>`
: Id or name of the branch

`-c, --component-id <string>`
: Id of the component

`-n, --name <string>`
: Name of the new configuration

[Global Options](/cli/keboola-as-code/commands/#global-options)

### Examples

```
➜ kbc create config

? Enter a name for the new config invoices

? Select the target branch Main (4908)

? Select the target component MySQL extractor (keboola.ex-db-mysql)
Created new config "main/extractor/keboola.ex-db-mysql/invoices"
```

```
➜ kbc create config -n invoices -b main -c keboola.ex-db-mysql
Created new config "main/extractor/keboola.ex-db-mysql/invoices"
```

## Next Steps

- [All Commands](/cli/keboola-as-code/commands/)
- [Create Configuration Row](/cli/keboola-as-code/commands/local/create/row/)
- [Create Branch](/cli/keboola-as-code/commands/remote/create/branch/)
