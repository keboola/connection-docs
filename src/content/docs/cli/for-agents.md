---
title: kbagent for AI agents
slug: 'cli/for-agents'
description: 'Give an AI coding agent safe control of Keboola with kbagent — the Claude Code plugin and /keboola subagent, read-only sandboxing, the conversation ID, and the kbagent context reference.'
---



[kbagent](/cli/) is built to be driven by AI coding agents (Claude Code, Cursor, Copilot), not just humans. It gives an agent a stable command surface, a machine-readable reference, and safety rails so it can operate Keboola without you handing over unrestricted access.

<!-- Source: keboola/cli README ("For AI agents") + `kbagent context` + `kbagent doctor`, verified 2026-07-13. -->

## Claude Code plugin

Install the plugin from the CLI's own marketplace:

```
/plugin marketplace add keboola/cli
/plugin install kbagent@keboola-agent-cli
```

This adds a **`/keboola`** slash command that spawns a `keboola-expert` subagent with fresh context and hard rules (fetch the current reference, dry-run first, prefer the CLI over raw REST/MCP, gate on version), plus a structured verification payload. `kbagent doctor` tells you whether the plugin is installed.

## The `context` reference

Any agent — plugin or not — should start by loading the full command reference:

```bash
kbagent context
```

It prints usage instructions and the complete, version-matched command list as Markdown, so the agent works from what your installed version actually supports rather than guessing.

## Sandbox the agent

Don't give an agent write access it doesn't need. kbagent's [permission firewall](/cli/workflows/#permissions-and-sandboxing) lets you scope a session or a workspace:

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
- **[Kai](/kai/)** — the in-product assistant; reachable from the CLI via `kbagent kai` *(beta)*.

<!-- VERIFY(owner): confirm the plugin install string `kbagent@keboola-agent-cli` and the /keboola subagent description against the current repo. -->

---

**Next:** [Command reference →](/cli/commands/)
