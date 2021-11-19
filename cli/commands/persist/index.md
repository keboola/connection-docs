---
title: Persist
permalink: /cli/commands/persist/
---

* TOC
{:toc}

```
kbc persist [flags]
```

Propagate changes in the local directory to the manifest. When you manually create a configuration or a row (e.g. by 
copy & paste of another existing configuration) the command will add its record to the manifest and generate a new ID. 
When you delete a configuration/row directory the command will remove its record from the manifest. If you want 
to propagate the changes to the project call the [push](/cli/commands/push/) command afterward.

## Options

`--dry-run`
: Preview all changes

[Global Options](/cli/commands/#global-options)

## Examples

When you copy & paste directory of a MySQL extractor configuration the command will look like:

```
➜ kbc persist --dry-run
Plan for "persist" operation:
  + C main/extractor/keboola.ex-db-mysql/invoices 2
  + R main/extractor/keboola.ex-db-mysql/invoices 2/rows/customer
Dry run, nothing changed.
Persist done.
```

## Next Steps

- [Pull](/cli/commands/pull/)
