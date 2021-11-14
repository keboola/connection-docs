---
title: Fix Paths
permalink: /cli/commands/fix-paths/
---

* TOC
{:toc}

```
kbc fix-paths [flags]
```

Ensure that all local paths match configured naming according to the manifest file (located in `.keboola/manifest.json).

The command unifies names of configurations, rows, and code blocks in transformations in the manifest, `config.json` 
and directory names. It would be useful also after [change of naming](/cli/configuration/#naming). 

## Options

`--dry-run`
: Preview all paths that would be affected

[Global Options](/cli/commands/#global-options)

## Examples

When you change the `config` [naming](/cli/configuration/#naming) to not include ids
(`"{component_type}/{component_id}/{config_name}"`) the command would rename all directories to match the new naming 
like:

```
➜ kbc fix-paths --dry-run
Plan for "rename" operation:
  - main/extractor/ex-generic-v2/{7122721-empty -> empty}
  - main/extractor/keboola.ex-aws-s3/{7241111-my-aws-s-3-data-source -> my-aws-s-3-data-source}
  - main/extractor/keboola.ex-db-mysql/{7475544-invoices -> invoices}
  - main/extractor/keboola.ex-google-drive/{7241051-my-google-drive-data-source -> my-google-drive-data-source}
  - main/other/keboola.orchestrator/{7243915-daily -> daily}
  - main/other/keboola.orchestrator/{7244146-daily-2 -> daily-2}
  - main/other/keboola.sandboxes/{7241673-address -> address}
  - main/transformation/keboola.snowflake-transformation/{7241628-address -> address}
Dry run, nothing changed.
Fix paths done.
```

## Next Steps

- [Help](/cli/commands/help/)
