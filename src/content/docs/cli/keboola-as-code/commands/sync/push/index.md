---
title: Push Command
slug: 'cli/keboola-as-code/commands/sync/push'
---


**Sync a [local directory](/cli/keboola-as-code/structure/) to the [project](/cli/keboola-as-code/#subsystems).**

```
kbc sync push [flags]
```

Or shorter:
```
kbc push [flags]
kbc ph [flags]
```

The project state will be overwritten to match the local state.

## Options

`--dry-run`
: Preview all changes

`--encrypt`
: Encrypt unencrypted values before the push

`--force`
: Delete configurations missing in the local directory

[Global Options](/cli/keboola-as-code/commands/#global-options)

## Example

When you [create a configuration](/cli/keboola-as-code/commands/local/create/config/) of the MySQL extractor, the command will look like this:

```
➜ kbc push --dry-run

Plan for "push" operation:
  + C main/extractor/keboola.ex-db-mysql/7511990/invoices
  + R main/extractor/keboola.ex-db-mysql/7511990/invoices/rows/customer
Dry run, nothing changed.
Push done.
```

## Next Steps

- [All Commands](/cli/keboola-as-code/commands/)
- [Init](/cli/keboola-as-code/commands/sync/init/)
- [Pull](/cli/keboola-as-code/commands/sync/pull/)
- [Diff](/cli/keboola-as-code/commands/sync/diff/)
