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
and directory names. It is run automatically after [pull](/cli/commands/pull/). 

## Options

`--dry-run`
: Preview all paths that would be affected

[Global Options](/cli/commands/#global-options)

## Examples

When you have a config and rename it in its `meta.json` run the command afterwards. It will rename the directory name:

```
➜ kbc fix-paths --dry-run
Plan for "rename" operation:
  - main/extractor/ex-generic-v2/{wiki-001 -> wiki-2}
Dry run, nothing changed.
Fix paths done.
```

## Next Steps

- [Help](/cli/commands/help/)
