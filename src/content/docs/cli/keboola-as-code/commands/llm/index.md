---
title: LLM Commands (BETA)
slug: 'cli/keboola-as-code/commands/llm'
---


<div class="alert alert-info" role="alert">
<strong>BETA:</strong> The LLM commands are currently in beta. Features and output format may change.
</div>

**Export project data to AI-optimized format for use with AI assistants and LLMs.**

The `kbc llm` commands create a "twin format" representation of your Keboola project,
designed for AI assistants to understand and work with your data pipelines.

```
kbc llm [command]
```

## Workflow

1. **Initialize** - Run `kbc llm init` to set up the local directory
2. **Export** - Run `kbc llm export` to generate AI-optimized project data

## Available Commands

|---
| Command | Description
|-|-|-
| [kbc llm init](/cli/keboola-as-code/commands/llm/init/) | Initialize a new local directory for LLM export. |
| [kbc llm export](/cli/keboola-as-code/commands/llm/export/) | Export project data to AI-optimized twin format. |

## Next Steps

- [LLM Init](/cli/keboola-as-code/commands/llm/init/)
- [LLM Export](/cli/keboola-as-code/commands/llm/export/)
- [All Commands](/cli/keboola-as-code/commands/)
