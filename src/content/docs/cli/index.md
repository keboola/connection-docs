---
title: CLI
slug: 'cli'
description: 'kbagent, the Keboola command-line interface — an AI-friendly CLI to manage projects, configs, jobs, storage, flows, and dev branches across your whole organization, driven by you or your coding agent.'
---



**kbagent** is Keboola's command-line interface: one tool to manage all your Keboola projects — browse and edit configurations, run and monitor jobs, work with Storage, build flows, sync configs as local files, and drive dev branches — across multiple projects and stacks at once. It's designed to be equally comfortable in your hands and in an **AI coding agent's**, with structured JSON output and built-in safety controls.

<!-- Source: keboola/cli README + docs/guide.md. Mirrored into help docs; TODO: repo→docs sync mechanism (Jordan). -->

## Why kbagent

- **Workflow-oriented, not endpoint-oriented.** Commands map to what you actually do — "run this job and wait", "create a dev branch and target it", "sync these configs to disk" — instead of raw API calls.
- **Multi-project and multi-stack.** Connect many projects (or a whole organization) and run operations across them, in parallel.
- **Dev branches propagate automatically.** Point a command at a branch and related operations follow it.
- **GitOps sync.** Pull configurations to YAML on disk, diff them, and push changes back — version-control your project.
- **Agent-safe by design.** A session firewall (`--deny-writes` / `--deny-destructive`) and read-only sandboxing let you hand the CLI to an AI agent without handing over the keys.

## Who it's for

- **Data engineers** who want to script and version Keboola instead of clicking through the UI.
- **AI coding agents** (Claude Code, Cursor, Copilot) — kbagent ships a Claude Code plugin and a machine-readable command reference so an agent can operate Keboola safely. See [kbagent for AI agents](/cli/for-agents/).

## Start here

- **[Getting started](/cli/getting-started/)** — install, connect a project, run your first commands.
- **[Commands](/cli/commands/)** — the command groups and what each does.
- **[Workflows](/cli/workflows/)** — dev branches, GitOps sync, permissions, and real end-to-end use cases.
- **[For AI agents](/cli/for-agents/)** — the Claude Code plugin, sandboxing, and `kbagent context`.

## How it relates to the other tools

| Tool | Use it for |
|------|-----------|
| **kbagent CLI** | Scripting and multi-project operations from your terminal; giving an agent safe, sandboxed control. |
| **[MCP server](/ai/mcp-server/)** | Letting an AI client call Keboola tools directly over MCP. |
| **[AI Kit](/ai/ai-kit/)** | Coding-assistant plugins (skills/agents) for building Keboola components and apps. |
| **[Kai](/kai/)** | The in-product AI assistant. |

:::note
kbagent is a different tool from the legacy **Keboola as Code** CLI (`kbc`) documented on [developers.keboola.com/cli](https://developers.keboola.com/cli/). That tool is still supported for now; new command-line work should use kbagent.
<!-- TODO(human-review, Jordan): confirm the legacy Keboola-as-Code CLI deprecation timeline (~March 2027 mentioned) and whether to state it here or only in the developer docs. -->
:::
