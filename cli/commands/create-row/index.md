---
title: Create Configuration Row
permalink: /cli/commands/create-row/
---

* TOC
{:toc}

```
kbc create row [flags]
```

Create a new configuration row in local directory and assign it a unique ID (i.e. [persist](/cli/commands/persist/)
command is called automatically). To save it to the project, call [push](/cli/commands/push/) afterward. You will
be prompted for name, branch, and component ID.

*Tip: You can create a new configuration row by copying an existing one and running [persist](/cli/commands/persist/) command.*

### Options

`-b, --branch string <string>`
: Id or name of the branch

`-c, --config <string>`
: Id or name of the configuration

`-n, --name <string>`
: Name of the new configuration row

[Global Options](/cli/commands/#global-options)

### Examples

```
➜ kbc create row

? Enter a name for the new config row customer

? Select the target branch Main (4908)

? Select the target config invoices (7475544)
Created new config row "main/extractor/keboola.ex-db-mysql/invoices/rows/customer"
```

```
➜ kbc create config -n customer -b main -c invoices
Created new config row "main/extractor/keboola.ex-db-mysql/invoices/rows/customer"
```

## Next Steps

- [Diff](/cli/commands/diff/)
