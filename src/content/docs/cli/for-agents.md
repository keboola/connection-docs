---
title: kbagent with AI agents
slug: 'cli/for-agents'
sidebar:
  label: Use with AI Agents
description: 'Give an AI coding agent safe control of Keboola with kbagent: the plugin and /keboola subagent, per-client setup for Claude Code, Claude Desktop, Cursor, VS Code and the ChatGPT app, read-only sandboxing, the conversation ID, and the kbagent context reference.'
---



[kbagent](/cli/) is built to be driven by AI coding agents (Claude Code, Claude Desktop, Cursor, VS Code, the ChatGPT app) as well as humans. It gives an agent a stable command surface, a machine-readable reference, and safety rails so it can operate Keboola without you handing over unrestricted access.

<!-- Source: keboola/cli README ("For AI agents") + `kbagent context` + `kbagent doctor`. The `/keboola` subagent and `context` sections verified 2026-07-13; the plugin, marketplace and per-client sections below carry their own 2026-08-26 dates. -->

## The kbagent plugin

The plugin teaches an AI client the CLI. It adds a **`/keboola`** slash command that spawns a `keboola-expert` subagent with fresh context and hard rules (fetch the current reference, dry-run first, prefer the CLI over raw REST/MCP, gate on version), plus a structured verification payload. It also ships a skill, so where the plugin is installed you can just ask for what you want in plain language ("set up kbagent for my Keboola project", "log me out of Keboola") instead of copying commands.

The plugin lives in the CLI repo at [`plugins/kbagent`](https://github.com/keboola/cli/tree/main/plugins/kbagent) and ships from Keboola's [AI Kit](/ai/ai-kit/) marketplace, which is named `keboola-claude-kit`.

Five clients can install it: Claude Code, Claude Desktop, Cursor, VS Code and the ChatGPT app. Each has its own route, and all five are below. The plugin does not connect your project. That is a separate step, so you need both.

In every client's plugin list, **`keboola-cli`** sits next to `kbagent`. It is a separate project-review toolkit built on the older `kbc` sync CLI. For the agent interface described here, pick `kbagent`.

:::caution[Added the marketplace from keboola/cli before?]
Earlier versions of this page pointed at `keboola/cli`. Nothing moves you off it. Run `/plugin marketplace remove keboola-agent-cli` first, then add `keboola/ai-kit` and install the plugin again. `kbagent doctor` names the marketplace you are on.
:::

### The `/kbagent:setup` shortcut

Claude Code is the only client that can run **`/kbagent:setup`**. Pass it a stack URL. It installs the CLI if it is missing, starts the browser sign-in, registers every project you can reach on that stack, and verifies the result. You finish the sign-in in your terminal. Anything already done is skipped, so re-running it is safe.

The other four clients cannot run it. Install the CLI and connect your project in a terminal first, then add the plugin from your client's UI.

<!-- `/kbagent:setup` behaviour from keboola/cli#625. Marketplace `keboola-claude-kit` from keboola/ai-kit#102. -->

## Set up your client

:::tip[You sign in once per machine]
Every tool reads the same local config, so a project you connected from one client is already there in the others. Run `kbagent project list` first. If your project is already listed, the terminal steps below are done, and step 1 of your client's section is too.
:::

### First, in a terminal

Every client except Claude Code starts here.

1. [Install the CLI](/cli/getting-started/) for your operating system.
2. [Connect your project](/cli/getting-started/#step-2--connect-your-project). Sign in with `kbagent auth login`, or register it with a Storage API token.
3. Check what you have: `kbagent doctor`

Use a real terminal for all three. `auth login` opens a browser you have to finish at, and a tokenless `project add` prompts with hidden input, which needs a TTY an agent's tool-run shell does not have.

`kbagent doctor` sits here, with the steps it checks. It looks for a plugin under `~/.claude/plugins/cache`, so it cannot see a Cursor, VS Code or ChatGPT app install, and it cannot confirm the plugin half of your setup.

Then follow your client below.

### Claude Code

Claude Code is already a terminal, so it can do the whole setup itself.

1. Start it: `claude`
2. Add the marketplace: `/plugin marketplace add keboola/ai-kit`
3. Install the plugin: `/plugin install kbagent@keboola-claude-kit`
4. Run the setup: `/kbagent:setup https://connection.keboola.com`
   <!-- kbagent-check: skip-next. This is a chat prompt for the agent to read. -->
5. Ask it: `kbagent list my projects`

### Claude Desktop

Claude Desktop has no slash commands in its chat. `/plugin` answers "/plugin isn't available in this environment", and both `/kbagent:setup` and `/kbagent` answer "Unknown command". The plugin goes in through the UI instead.

1. Do the terminal steps above.
2. Open **Customise → Plugins → Add → Add from marketplace** and paste `keboola/ai-kit`. The short form works here.
3. Find the card titled **kbagent** and click its plus.
   <!-- kbagent-check: skip-next. This is a chat prompt for the agent to read. -->
4. Ask in the chat: `kbagent list my projects`

Type that last one without a leading slash. `/kbagent …` fails here.

### Cursor

1. Do the terminal steps above.
2. Open **Customise → Browse Marketplace → Add Marketplace → Import from GitHub**.
3. Paste the full URL as the repository: `https://github.com/keboola/ai-kit`
4. Find the `kbagent` row under **Keboola Ai Kit** and press **Add**.
   <!-- kbagent-check: skip-next. This is a chat prompt for the agent to read. -->
5. Ask in the chat: `kbagent list my projects`

:::caution[Cursor needs the full URL]
The short `keboola/ai-kit` form that works in Claude Code and Claude Desktop is rejected here with `[invalid_argument] Error`. Paste `https://github.com/keboola/ai-kit`.
:::

### VS Code

VS Code's Copilot reads the Claude plugin format (`.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`), so AI Kit works there unchanged.

1. Do the terminal steps above.
2. Open the Command Palette (`⇧⌘P`, or `Ctrl+Shift+P` on Windows) and run **Chat: Install Plugin from Source**. Several palette entries start with "Install", so match the whole name.
3. Paste `https://github.com/keboola/ai-kit` as the source, then confirm the Trust prompt. VS Code asks because a plugin can run code.
4. Pick `kbagent` from the picker.
   <!-- kbagent-check: skip-next. This is a chat prompt for the agent to read. -->
5. Open the Chat panel (`⌃⌘I`, or `Ctrl+Alt+I` on Windows) and ask: `kbagent list my projects`

### ChatGPT app

The ChatGPT app, formerly Codex, accepts `.claude-plugin/marketplace.json` and `git-subdir` sources, which is how AI Kit publishes the plugin. Nothing Codex-specific is needed.

1. Do the terminal steps above.
2. In **Settings**, turn on **Developer mode**. Without it the app has nowhere to add a marketplace from. Its warning mentions unverified connectors and permanent data loss. Here that means the plugin runs the CLI under your own login, so it can do whatever your token can.
3. In the plugins view, open **Add → Add a marketplace** and paste `https://github.com/keboola/ai-kit` as the source. Leave **Git ref** and **Sparse paths** empty. The grey text in them is placeholder, and `plugins/codex` in particular reads like a value you should keep.
4. Switch to the **Personal** tab, where an added marketplace is listed, and install `kbagent`.
   <!-- kbagent-check: skip-next. This is a chat prompt for the agent to read. -->
5. Ask in the chat: `kbagent list my projects`

The same two steps work from a shell:

```bash
codex plugin marketplace add https://github.com/keboola/ai-kit
codex plugin add kbagent@keboola-claude-kit
```

### Plain terminal

No AI client involved: [install the CLI](/cli/getting-started/), [connect your project](/cli/getting-started/), verify with `kbagent doctor`, and list what you can reach with `kbagent project list`.

<!-- Per-client routes (marketplace form accepted, slash-command availability, `/kbagent:setup` outcome, Claude Desktop's Customise → Plugins path and "kbagent" card, Cursor's Import from GitHub full-URL requirement and its [invalid_argument] Error, VS Code's "Chat: Install Plugin from Source" palette entry, the ChatGPT app's Developer mode and Personal tab) tested against live clients on 2026-08-26; the same routes are what the Keboola UI shows on Settings → Developer settings → Agentic CLI. Devin is hidden from that surface, so it gets no per-client route here. -->

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
- **[MCP server](/ai/mcp-server/)** — direct tool calls over MCP.
- **[AI Kit](/ai/ai-kit/)** — coding-assistant plugins for building Keboola components and apps.
- **[Kai](/kai/)** — the in-product assistant; `kbagent kai ask -m "why did last night's load fail?"` puts the same assistant in your shell *(beta)*.

<!-- The /keboola → keboola-expert subagent description was confirmed by Padak against source (review, v0.66.1), when the marketplace was still `keboola-agent-cli`. The `keboola-claude-kit` install string is not covered by that review; it comes from keboola/ai-kit's .claude-plugin/marketplace.json, read 2026-08-26. -->

---

**Next:** [Command reference →](/cli/commands/)
