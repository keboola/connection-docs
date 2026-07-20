---
title: dbt Command
slug: 'cli/keboola-as-code/commands/dbt'
---


**Work with dbt inside your repository.**

The commands must be run in a directory with a dbt project (i.e. containing `dbt_project.yml`) or its subdirectory.

See the [introduction to dbt support](/cli/keboola-as-code/dbt/) for more information.

```
kbc dbt [command]
```

|---
| Command | Description
|-|-|-
| [kbc dbt init](/cli/keboola-as-code/commands/dbt/init/) | Initialize profiles, sources, and environment variables for use with dbt. |
| [kbc dbt generate](/cli/keboola-as-code/commands/dbt/generate/) | Generate profiles, sources, or environment variables for use with dbt. |
| [kbc dbt generate profile](/cli/keboola-as-code/commands/dbt/generate/profile/) | Generate profiles for use with dbt. |
| [kbc dbt generate sources](/cli/keboola-as-code/commands/dbt/generate/sources/) | Generate sources for use with dbt. |
| [kbc dbt generate env](/cli/keboola-as-code/commands/dbt/generate/env/) | Generate environment variables for use with dbt. |
