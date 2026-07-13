---
title: CLI
slug: 'cli'
description: 'kbagent, the Keboola command-line interface — an AI-friendly CLI to manage projects, configs, jobs, storage, flows, and dev branches across your whole organization, driven by you or your coding agent.'
---



**kbagent** is Keboola's command-line interface: one tool to manage all your Keboola projects from the terminal — browse and edit configurations, run and monitor jobs, work with Storage, build flows, sync configs as local files, and drive development branches — across many projects and stacks at once. It's built to be equally comfortable in your hands and in an **AI coding agent's**, with structured JSON output and built-in safety controls.

<!-- Source: keboola/cli README + docs. Mirrored into help docs; TODO: repo→docs sync mechanism (Jordan). -->

## In one minute

```bash
# install
curl -LsSf https://raw.githubusercontent.com/keboola/cli/main/install.sh | sh
# connect a project
kbagent project add --project prod --url https://connection.keboola.com --token YOUR_TOKEN
# explore
kbagent doctor
kbagent job list --limit 5
kbagent search "customer_id"
```

Everything the UI does — and a lot the UI doesn't — is a command away, scriptable, and safe to hand to an agent.

## This section

The pages read in order, from first run to deep reference:

1. **[Get started](/cli/getting-started/)** — install, connect a project, run your first commands (a guided walkthrough).
2. **[Concepts](/cli/concepts/)** — how kbagent works: the connection model, multi-project, dev branches, GitOps sync, and the safety firewall.
3. **[How-to guides](/cli/workflows/)** — task recipes: onboard an org, dev-branch workflow, GitOps sync, audits, CI/CD tokens, encryption.
4. **[Use with AI agents](/cli/for-agents/)** — the Claude Code plugin, `kbagent context`, and sandboxing an agent.
5. **[Command reference](/cli/commands/)** — every command group, global flags, JSON output, and error codes.
6. **[Web UI](/cli/web-ui/)** — the optional local browser dashboard.

## How it relates to the other tools

| Tool | Use it for |
|------|-----------|
| **kbagent CLI** | Scripting and multi-project operations from your terminal; giving an agent safe, sandboxed control. |
| **[MCP server](/ai/mcp-server/)** | Letting an AI client call Keboola tools directly over MCP. |
| **[AI Kit](/ai/ai-kit/)** | Coding-assistant plugins for building Keboola components and apps. |
| **[Kai](/kai/)** | The in-product AI assistant. |

:::note
kbagent is a different tool from the legacy **Keboola as Code** CLI (`kbc`) documented on [developers.keboola.com/cli](https://developers.keboola.com/cli/). That tool is still supported for now; new command-line work should use kbagent.
<!-- TODO(human-review, Jordan): confirm the legacy Keboola-as-Code CLI deprecation timeline and where to state it. -->
:::

---

**Next:** [Get started with kbagent →](/cli/getting-started/)
