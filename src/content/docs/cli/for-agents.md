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
Run these two commands **inside Claude Code** to install the plugin from Keboola's [AI Kit](/ai/ai-kit/) marketplace (use the copy button on the block):

```
/plugin marketplace add keboola/ai-kit
/plugin install kbagent@keboola-claude-kit
```
:::

The plugin installs via Claude Code's marketplace, not as a downloaded file — so it's a command you run in the assistant, not a button. It adds a **`/keboola`** slash command that spawns a `keboola-expert` subagent with fresh context and hard rules (fetch the current reference, dry-run first, prefer the CLI over raw REST/MCP, gate on version), plus a structured verification payload. `kbagent doctor` tells you whether the plugin is installed.

The plugin also adds **`/kbagent:setup`**, which does the whole first run in one go: it installs the CLI if it is missing, checks whether a project is already connected and skips ahead if so, otherwise signs you in through the browser and registers every project the session can reach, then runs `kbagent doctor` and suggests what to try first. It is safe to run twice. Pass a stack URL or a project name as its argument to aim it.

`/kbagent:setup` is a **plugin slash command**, which has two consequences worth knowing before you follow the steps below. It exists only after the plugin is installed, so the two `/plugin` lines are never optional. And it runs only inside Claude Code or Claude Desktop chat, never in a shell.

## Set up your client

### Claude Code

1. Start Claude Code: `claude`
2. Add the marketplace: `/plugin marketplace add keboola/ai-kit`
3. Install the plugin: `/plugin install kbagent@keboola-claude-kit`
4. Run the setup command with your stack URL: `/kbagent:setup https://connection.keboola.com`

Four steps, and step 4 covers the rest: it installs the CLI, signs you in through the browser, registers your projects and verifies the result. There is no token to generate or paste.

### Claude Desktop

Same shape, but the marketplace and plugin steps go through Claude Desktop's own plugin UI rather than slash commands.

1. Open **Settings → Plugins → Add → Add marketplace**, paste `keboola/ai-kit`, and click **Sync**.
2. In the plugin list, enable the plugin named exactly **`kbagent`**. Don't pick `keboola-cli` in that same list: that is the unrelated legacy `kbc` CLI.
3. In the chat, run `/kbagent:setup https://connection.keboola.com`.

<!-- VERIFY(owner): `/kbagent:setup` working in Claude Desktop's chat has NOT been verified against a live build. An older build answered slash commands with "Some commands only work in the Claude Code terminal"; that string is gone as of 1.32352, but nobody has actually run the command there. Confirm on a live build before stating it works in the prose. -->

### Cursor, VS Code, Codex, Devin Desktop

No kbagent plugin exists for these clients yet, so `/kbagent:setup` is unavailable to them: it is a Claude Code plugin command. Set up by hand instead.

1. Open the client.
2. Install the CLI, following the tab for your operating system in [Get started](/cli/getting-started/).
3. Run `kbagent context` so the agent learns the command surface.
4. [Connect your project](/cli/getting-started/).
5. Verify with `kbagent doctor`.

### Plain terminal

No AI client involved: [install the CLI](/cli/getting-started/), connect your project, and verify with `kbagent doctor`.

<!-- Per-tool steps mirror the in-product "Connect your agent" guide. `/kbagent:setup` behaviour (idempotent; install, then `project list` short-circuit, then `auth login --register-projects`, then `doctor`, then suggestions; optional stack-URL or project-name argument) from keboola/cli#625. Marketplace `keboola-claude-kit` from keboola/ai-kit#102. -->

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

<!-- Plugin install string (marketplace `keboola-claude-kit`, plugin `kbagent`) and the /keboola → keboola-expert subagent description confirmed by Padak against source (review, v0.66.1). -->

---

**Next:** [Command reference →](/cli/commands/)
