---
title: List Workspaces
slug: 'cli/keboola-as-code/commands/remote/workspace/list'
---


**Print a list of [workspaces](/transformations/workspace/).**

```
kbc remote workspace list [flags]
```

### Options

`-H, --storage-api-host <string>`
: Keboola instance URL, e.g., "connection.keboola.com"

[Global Options](/cli/keboola-as-code/commands/#global-options)

### Examples

```
➜ kbc remote workspace list

Loading workspaces, please wait.
Found workspaces:
  foo (ID: <id>, Type: snowflake)
  bar (ID: <id>, Type: snowflake)
  baz (ID: <id>, Type: python, Size: small)
```

## Next Steps

- [All Commands](/cli/keboola-as-code/commands/)
- [Learn more about Workspaces](/transformations/workspace/)
