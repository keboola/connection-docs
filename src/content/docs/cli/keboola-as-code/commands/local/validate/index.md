---
title: Validate Local Project Command
slug: 'cli/keboola-as-code/commands/local/validate'
---


**Validate the [local project directory](/cli/keboola-as-code/structure/).**

```
kbc local validate [flags]
```

Or shorter:
```
kbc v [flags]
```

Validate the directory structure and file contents of the local directory. Configurations of components having a JSON schema
will be validated against the schema.

## Options

[Global Options](/cli/keboola-as-code/commands/#global-options)

## Example

```
➜ kbc validate
Everything is good.
```

## Sub Commands

|---
| Command | Description
|-|-|-
| [kbc local validate config](/cli/keboola-as-code/commands/local/validate/config/) | Validate a configuration JSON file. |
| [kbc local validate row](/cli/keboola-as-code/commands/local/validate/row/) | Validate a configuration row JSON file. |
| [kbc local validate schema](/cli/keboola-as-code/commands/local/validate/schema/) | Validate a configuration/row JSON file by a JSON schema file. |

## Next Steps

- [All Commands](/cli/keboola-as-code/commands/)
- [Diff](/cli/keboola-as-code/commands/sync/diff/)
- [Push](/cli/keboola-as-code/commands/sync/push/)
- [Fix Paths](/cli/keboola-as-code/commands/local/fix-paths/)
