---
title: Persist Command
slug: 'cli/keboola-as-code/commands/local/persist'
---


**Detect new directories with a [configuration](/components/) or a [configuration row](/components/#configuration-rows) in the [local directory](/cli/keboola-as-code/structure/).**

```
kbc local persist [flags]
```

Or shorter:
```
kbc p [flags]
```

Propagate changes in the [local directory](/cli/keboola-as-code/structure/) to the manifest. When you manually create a configuration or a row (e.g., by 
copy & paste of another existing configuration), the command will add its record to the [manifest](/cli/keboola-as-code/structure/#manifest) and generate a new ID. 
When you delete a configuration/row directory, the command will remove its record from the [manifest](/cli/keboola-as-code/structure/#manifest). If you want 
to propagate the changes to the project, call the [push](/cli/keboola-as-code/commands/sync/push/) command afterwards.

## Options

`--dry-run`
: Preview all changes

[Global Options](/cli/keboola-as-code/commands/#global-options)

## Examples

When you copy & paste a directory of a MySQL extractor configuration, the command will look like this:

```
➜ kbc persist --dry-run
Plan for "persist" operation:
  + C main/extractor/keboola.ex-db-mysql/invoices 2
  + R main/extractor/keboola.ex-db-mysql/invoices 2/rows/customer
Dry run, nothing changed.
Persist done.
```

## Next Steps

- [All Commands](/cli/keboola-as-code/commands/)
- [Diff](/cli/keboola-as-code/commands/sync/diff/)
- [Push](/cli/keboola-as-code/commands/sync/push/)
- [Fix Paths](/cli/keboola-as-code/commands/local/fix-paths/)
