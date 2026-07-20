---
title: Create Workspace
slug: 'cli/keboola-as-code/commands/remote/workspace/create'
---


**Create a new [workspace](/transformations/workspace/).**

```
kbc remote workspace create [flags]
```

### Options

`--name <string>`
: Name of the workspace to be created

`--type <string>`
: Type of the workspace to be created

`--size <string>`
: Size of the workspace to be created. It is ignored for database workspaces.

`-H, --storage-api-host <string>` 
: Keboola instance URL, e.g., "connection.keboola.com"

[Global Options](/cli/keboola-as-code/commands/#global-options)

### Examples

```
➜ kbc remote workspace create --name foo --type snowflake

Creating a new workspace, please wait.
Created the new workspace "foo" (<id>).
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
