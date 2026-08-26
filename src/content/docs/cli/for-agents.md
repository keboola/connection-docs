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

Where the plugin is installed you can also **just ask** for what you want in plain language ("set up kbagent for my Keboola project", "log me out of Keboola") instead of copying commands. The plugin ships a skill that knows those verbs and runs the right commands for you.

### The `/kbagent:setup` shortcut

The plugin adds a **`/kbagent:setup`** command that gets you most of the way in one step. Pass a stack URL or a project name as its argument. It installs the CLI if it is missing, checks whether a project is already connected and skips ahead if one is, and it is safe to run twice.

What it does **not** do today is finish. When it reaches the sign-in it hands you a command to run in a terminal yourself:

<!-- kbagent-check: skip-next. `auth` shipped in kbagent 0.80.0; the synced command reference is still v0.76.1, so the gate cannot see it yet. -->
```bash
kbagent auth login --stack https://connection.keboola.com --register-projects
```

So treat `/kbagent:setup` as a shortcut, and the manual sequence below as the path that actually completes. Known limitation, tracked in [keboola/cli#704](https://github.com/keboola/cli/issues/704): once the sign-in can happen in chat, the short flow becomes the real one.

<!-- `/kbagent:setup` behaviour from keboola/cli#625; the login hand-off back to a terminal was reproduced in Claude Code, Cursor and Claude Desktop on 2026-08-26 (keboola/cli#704). Marketplace `keboola-claude-kit` from keboola/ai-kit#102. -->

## Set up your client

:::tip[You sign in once per machine]
Every client reads the same local kbagent config, so a sign-in or a connected project from one tool is already there in the next one. Set it up in your terminal or in Claude Code, and Cursor and Claude Desktop see it with no further work.
:::

### Claude Code

Plugin support: marketplace by command, slash commands work.

1. Start Claude Code: `claude`
2. Add the marketplace: `/plugin marketplace add keboola/ai-kit`
3. Install the plugin: `/plugin install kbagent@keboola-claude-kit`
4. Optionally run `/kbagent:setup https://connection.keboola.com` to install the CLI and check what is already connected.
5. In a terminal, sign in:
   <!-- kbagent-check: skip-next -->
   `kbagent auth login --stack https://connection.keboola.com --register-projects`
6. Verify: `kbagent doctor`

### Cursor

Plugin support: marketplace through the UI, slash commands work. The plugin is optional here, the flow completes without it.

1. Open **Add Marketplace → Import from Github** and paste the **full URL**: `https://github.com/keboola/ai-kit`
2. Install the `kbagent` plugin from the marketplace.
3. In a terminal, sign in:
   <!-- kbagent-check: skip-next -->
   `kbagent auth login --stack https://connection.keboola.com --register-projects`
4. Verify: `kbagent doctor`

:::caution[Cursor needs the full URL]
The `keboola/ai-kit` short form that works in Claude Code and Claude Desktop is **rejected** by Cursor with `[invalid_argument] Error`, which says nothing about the cause. Paste `https://github.com/keboola/ai-kit` instead.
:::

### Claude Desktop

Plugin support: marketplace through the UI, but **no slash commands at all**. `/kbagent:setup` answers "Unknown command" and `/plugin` answers "/plugin isn't available in this environment", so Claude Desktop can never run the setup command however the plugin got installed. Set up by hand.

1. [Install the CLI](/cli/getting-started/) for your operating system.
2. In a terminal, sign in:
   <!-- kbagent-check: skip-next -->
   `kbagent auth login --stack https://connection.keboola.com --register-projects`
3. Verify: `kbagent doctor`

To add the plugin anyway (it gives the chat the `keboola-expert` subagent and the skill), open **Customise → Plugins → Add → Add from marketplace**, enter `keboola/ai-kit` (the short form works here), then install the card titled **Kbagent** with its **plus button**. Don't pick `keboola-cli` in that same directory: that is the unrelated legacy `kbc` CLI.

### VS Code, Codex, Devin Desktop

No kbagent plugin exists for these clients yet, so there is no `/kbagent:setup` to run.

1. Open the client.
2. [Install the CLI](/cli/getting-started/) for your operating system.
3. Run `kbagent context` so the agent learns the command surface.
4. In a terminal, sign in:
   <!-- kbagent-check: skip-next -->
   `kbagent auth login --stack https://connection.keboola.com --register-projects`
5. Verify: `kbagent doctor`

### Plain terminal

No AI client involved: [install the CLI](/cli/getting-started/), [connect your project](/cli/getting-started/), and verify with `kbagent doctor`.

<!-- Per-client behaviour (marketplace form accepted, slash-command availability, `/kbagent:setup` outcome, Claude Desktop's Customise → Plugins path, plus button, "Kbagent" card title, Cursor's Import from Github full-URL requirement and its [invalid_argument] Error) tested against live clients on 2026-08-26. -->

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
