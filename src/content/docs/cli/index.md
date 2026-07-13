---
title: CLI
slug: 'cli'
description: 'kbagent, the Keboola command-line interface — an AI-friendly CLI to manage projects, configs, jobs, storage, flows, and dev branches across your whole organization, driven by you or your coding agent.'
---



**kbagent** is Keboola's command-line interface: one tool to manage all your Keboola projects from the terminal. It's built to be equally comfortable in your hands and in an **AI coding agent's** — every command has structured JSON output and the whole thing sits behind a safety firewall you can tighten before handing it over.

<!-- Source: keboola/cli README + docs. Mirrored into help docs; TODO: repo→docs sync mechanism (Jordan). -->

## What you can do with it

- **Manage projects across your whole org** — connect one project, several, or an entire organization, across US/EU and AWS/Azure/GCP stacks, and operate on them together.
- **Browse and edit** configurations, components, buckets, tables, and files — the same objects as the UI, scriptable.
- **Run and monitor jobs** — trigger a component, wait for it, list failures across every project, terminate a stuck one.
- **Build and schedule flows**, create SQL workspaces to debug transformations, and manage development branches.
- **Version your project with GitOps** — pull configurations to local files, diff them, and push changes back.
- **Search everything** — find a config, table, or flow by name or content across all connected projects.
- **Hand work to an AI agent safely** — a read-only sandbox and a permission firewall let an agent operate Keboola without risk.

## In one minute

```bash
# install (macOS/Linux; see Get started for Windows)
curl -LsSf https://raw.githubusercontent.com/keboola/cli/main/install.sh | sh
# connect a project
kbagent project add --project prod --url https://connection.keboola.com --token YOUR_TOKEN
# explore
kbagent doctor
kbagent job list --limit 5
kbagent search "customer_id"
```

Everything the UI does — and a lot it doesn't — is a command away, scriptable, and safe to hand to an agent.

## Why a CLI (and not just the UI)?

The UI is great for one project, one change at a time. kbagent is for the things the UI makes hard: doing the same thing across **many projects at once**, putting your configuration **under version control**, wiring Keboola into **CI/CD**, and letting an **AI agent** do the work while you keep approval of anything destructive. It talks only to your Keboola stacks, stores its connections locally, and never needs a browser.

## This section

The pages read in order, from first run to deep reference:

1. **[Get started](/cli/getting-started/)** — install (macOS / Linux / Windows), connect a project, run your first commands.
2. **[How it works](/cli/concepts/)** — the connection model, multi-project, dev branches, GitOps sync, and the safety firewall.
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
