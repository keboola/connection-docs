---
title: Delete Workspace
slug: 'cli/keboola-as-code/commands/remote/workspace/delete'
---


**Delete a [workspace](/transformations/workspace/).**

```
kbc remote workspace delete [flags]
```

### Options

`-W, --workspace-id string`
: ID of the workspace to be deleted. You can find it using the [List Workspaces](/cli/keboola-as-code/commands/remote/workspace/list/) command.

`-H, --storage-api-host <string>` 
: Keboola instance URL, e.g., "connection.keboola.com"

[Global Options](/cli/keboola-as-code/commands/#global-options)

### Examples

```
➜ kbc remote workspace delete -W <id>

Deleting the workspace "foo" (<id>), please wait.
Delete done.
```

## Next Steps

- [All Commands](/cli/keboola-as-code/commands/)
- [Learn more about Workspaces](/transformations/workspace/)
