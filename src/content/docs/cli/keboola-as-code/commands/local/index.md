---
title: Local Command
slug: 'cli/keboola-as-code/commands/local'
---


**Operations in the [local directory](/cli/keboola-as-code/structure/) don't affect the project.**

```
kbc local [command]
```

|---
| Command | Description
|-|-|-
| **[kbc local create](/cli/keboola-as-code/commands/local/create/)** | **Create an object in the local directory.** |
| [kbc local create config](/cli/keboola-as-code/commands/local/create/config/) | Create an empty [configuration](/components/). |
| [kbc local create row](/cli/keboola-as-code/commands/local/create/row/) | Create an empty [configuration row](/components/#configuration-rows). |
| | |
| [kbc local persist](/cli/keboola-as-code/commands/local/persist/) | Detect new directories with a [configuration](/components/) or a [configuration row](/components/#configuration-rows). |
| [kbc local encrypt](/cli/keboola-as-code/commands/local/encrypt/) | Encrypt all [unencrypted secrets](/overview/). |
| [kbc local validate](/cli/keboola-as-code/commands/local/validate/) | Validate the local directory. |
| [kbc local fix-paths](/cli/keboola-as-code/commands/local/fix-paths/) | Ensure that all local paths match [configured naming](/cli/keboola-as-code/structure/#naming). |
