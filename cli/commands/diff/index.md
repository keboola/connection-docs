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
* R main/extractor/keboola.ex-aws-s3/my-aws-s-3-data-source/rows/share-cities-2 | changed: configuration
+ C main/extractor/keboola.ex-db-mysql/invoices
+ R main/extractor/keboola.ex-db-mysql/invoices/rows/customer

Use --details flag to list the changed fields.
```

If you want more details:

```
➜ kbc diff --details
* changed
- remote state
+ local state

Diff:
* R main/extractor/keboola.ex-aws-s3/my-aws-s-3-data-source/rows/jakubm-share-cities-2
  configuration:
    parameters.key:
      - cities2.csv
      + cities.csv
+ C main/extractor/keboola.ex-db-mysql/invoices
+ R main/extractor/keboola.ex-db-mysql/invoices/rows/customer
```

## Next Steps

- [Encrypt](/cli/commands/encrypt/)
