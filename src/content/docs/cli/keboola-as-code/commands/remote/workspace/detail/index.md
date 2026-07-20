---
title: Workspace Detail
slug: 'cli/keboola-as-code/commands/remote/workspace/detail'
---


**Print the credentials and details of a [workspace](/transformations/workspace/)**

```
kbc remote workspace detail [flags]
```

### Options

`-W, --workspace-id string`
: ID of the workspace to be detailed. You can find it using the [List Workspaces](/cli/keboola-as-code/commands/remote/workspace/list/) command.

`-H, --storage-api-host <string>` 
: Keboola instance URL, e.g., "connection.keboola.com"

[Global Options](/cli/keboola-as-code/commands/#global-options)

### Examples

```
➜ kbc remote workspace detail -W <id>

Workspace "foo"
ID: <id>
Type: snowflake
Credentials:
  Host: <host>
  User: <user>
  Password: <password>
  Database: <database>
  Schema: <schema>
  Warehouse: <warehouse>
```

## Next Steps

- [All Commands](/cli/keboola-as-code/commands/)
- [Learn more about Workspaces](/transformations/workspace/)
