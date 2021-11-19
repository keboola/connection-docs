---
title: Pull
permalink: /cli/commands/pull/
---

* TOC 
{:toc}

```
kbc pull [flags]
```

Pull configurations from the project to the local directory. Local changes will be overwritten to match the state 
of the project. 

If your local state is invalid the command will fail unless you use `--force` flag.

## Options

`--dry-run`
: Preview all changes

`--force`
: Ignore invalid local state

[Global Options](/cli/commands/#global-options)

## Examples

```
➜ kbc pull --dry-run
Pulling objects to the local directory.
Plan for "pull" operation:
  × C main/extractor/keboola.ex-db-mysql/7511990/invoices
  × R main/extractor/keboola.ex-db-mysql/7511990/invoices/rows/customer
Pull done.
```

## Next Steps

- [Push](/cli/commands/push/)
