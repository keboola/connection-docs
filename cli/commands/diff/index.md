---
title: Diff
permalink: /cli/commands/diff/
---

* TOC
{:toc}

```
kbc diff [flags]
```

Show differences between local and remote state of the project.

## Options

`--details`
: Show changed fields

[Global Options](/cli/commands/#global-options)

## Examples

When you change a configuration option of one component (e.g. output table for a sheet 
in [Google Drive Extractor](/components/extractors/storage/google-drive/)) the output will look like:

```
➜ kbc diff
* changed
- remote state
+ local state

Diff:
* R main/extractor/keboola.ex-aws-s3/7241111-my-aws-s-3-data-source/rows/7241227-share-cities-2 | changed: configuration
+ C main/extractor/keboola.ex-db-mysql/7475544-invoices
+ R main/extractor/keboola.ex-db-mysql/7475544-invoices/rows/7475594-customer

Use --details flag to list the changed fields.
```

If you want more details:

```
➜ kbc diff --details
* changed
- remote state
+ local state

Diff:
* R main/extractor/keboola.ex-aws-s3/7241111-my-aws-s-3-data-source/rows/7241227-jakubm-share-cities-2
  configuration:
    parameters.key:
      - cities2.csv
      + cities.csv
+ C main/extractor/keboola.ex-db-mysql/7475544-invoices
+ R main/extractor/keboola.ex-db-mysql/7475544-invoices/rows/7475594-customer
```

## Next Steps

- [Encrypt](/cli/commands/encrypt/)
