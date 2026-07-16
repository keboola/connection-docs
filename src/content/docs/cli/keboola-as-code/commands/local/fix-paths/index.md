---
title: Fix Paths Command
slug: 'cli/keboola-as-code/commands/local/fix-paths'
---


**Ensure that all local paths match [configured naming](/cli/keboola-as-code/structure/#naming).**

```
kbc local fix-paths [flags]
```

The command unifies names of configurations, rows, and other directories based on [configured naming](/cli/keboola-as-code/structure/#naming).
For example, if the configuration name in `meta.json` changes, this command renames the directory by that name.
It is run automatically after [pull](/cli/keboola-as-code/commands/sync/pull/). 

## Options

`--dry-run`
: Preview all paths that would be affected

[Global Options](/cli/keboola-as-code/commands/#global-options)

## Examples

When you have a config and rename it in its `meta.json`, run the command afterwards. It will rename the directory:

```
➜ kbc fix-paths --dry-run
Plan for "rename" operation:
  - main/extractor/ex-generic-v2/{wiki-001 -> wiki-2}
Dry run, nothing changed.
Fix paths done.
```

## Next Steps

- [All Commands](/cli/keboola-as-code/commands/)
- [Persist](/cli/keboola-as-code/commands/local/persist)
