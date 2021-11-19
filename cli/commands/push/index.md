---
title: Push
permalink: /cli/commands/push/
---

* TOC
{:toc}

```
kbc push [flags]
```

Push configurations from the local directory to the project in Keboola Connection. Its state will be overwritten 
to match the local state.

## Options

`--dry-run`
: Preview all changes

`--encrypt`
: Encrypt unencrypted values before the push

`--force`
: Delete configurations missing in the local directory

[Global Options](/cli/commands/#global-options)

## Example

When you [create a configuration](/cli/commands/create-config/) of MySQL extractor the command will look like:

```
➜ kbc push --dry-run

Plan for "push" operation:
  + C main/extractor/keboola.ex-db-mysql/7511990/invoices
  + R main/extractor/keboola.ex-db-mysql/7511990/invoices/rows/customer
Dry run, nothing changed.
Push done.
```

## Next Steps

- [Status](/cli/commands/status/)
