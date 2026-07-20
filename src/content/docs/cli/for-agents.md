---
title: kbagent for AI agents
slug: 'cli/for-agents'
sidebar:
  label: Use with AI Agents
description: 'Give an AI coding agent safe control of Keboola with kbagent — the Claude Code plugin and /keboola subagent, read-only sandboxing, the conversation ID, and the kbagent context reference.'
---



[kbagent](/cli/) is built to be driven by AI coding agents (Claude Code, Cursor, Copilot), not just humans. It gives an agent a stable command surface, a machine-readable reference, and safety rails so it can operate Keboola without you handing over unrestricted access.

<!-- Source: keboola/cli README ("For AI agents") + `kbagent context` + `kbagent doctor`, verified 2026-07-13. -->

## Claude Code plugin

:::tip[Add kbagent to Claude Code]
Run these two commands **inside Claude Code** to install the plugin from the CLI's own marketplace (use the copy button on the block):

```
/plugin marketplace add keboola/cli
/plugin install kbagent@keboola-agent-cli
```
:::

The plugin installs via Claude Code's marketplace, not as a downloaded file — so it's a command you run in the assistant, not a button. It adds a **`/keboola`** slash command that spawns a `keboola-expert` subagent with fresh context and hard rules (fetch the current reference, dry-run first, prefer the CLI over raw REST/MCP, gate on version), plus a structured verification payload. `kbagent doctor` tells you whether the plugin is installed.

## The `context` reference

Any agent — plugin or not — should start by loading the full command reference:

```bash
kbagent context
```

It prints usage instructions and the complete, version-matched command list as Markdown, so the agent works from what your installed version actually supports rather than guessing.

## Sandbox the agent

Don't give an agent write access it doesn't need. kbagent's [permission firewall](/cli/workflows/#run-kbagent-safely-unattended-or-via-an-agent) lets you scope a session or a workspace:

```bash
# Read-only local workspace for an agent
kbagent init --from-global --read-only

# Or block writes for a single session
kbagent --deny-writes config list
```

Combined with per-project scoped tokens (`kbagent token …`), you can let an agent explore and propose changes while you keep approval of anything destructive.

## Set a conversation ID

Set a conversation ID before the agent runs commands, so platform observability can correlate the whole session (every request carries an `X-Conversation-ID` header):

```bash
export KBAGENT_CONVERSATION_ID="<unique-id>"
```

## How it fits with the other AI tools

- **kbagent** — the agent's hands on your projects from the terminal, with sandboxing.
- **[MCP server](/ai/mcp-server/)** — direct tool calls over MCP; kbagent can also call MCP tools via `kbagent tool`.
- **[AI Kit](/ai/ai-kit/)** — coding-assistant plugins for building Keboola components and apps.
- **[Kai](/kai/)** — the in-product assistant; `kbagent kai ask -m "why did last night's load fail?"` puts the same assistant in your shell *(beta)*.

<!-- Plugin install string (marketplace `keboola-agent-cli`, plugin `kbagent`) and the /keboola → keboola-expert subagent description confirmed by Padak against source (review, v0.66.1). -->

---

**Next:** [Command reference →](/cli/commands/)
