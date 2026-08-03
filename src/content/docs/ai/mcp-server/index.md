---
title: Keboola MCP Server
slug: 'ai/mcp-server'
description: 'What the Keboola MCP Server is — a Model Context Protocol server that lets Claude, Cursor, ChatGPT, VS Code, Windsurf, and Make work inside your Keboola project with your own permissions: query data, build transformations, run and debug jobs.'
redirect_from:
    - /external-integrations/mcp-server/
    - /integrate/mcp/
    - /management/project/mcp-server/
---

The **Keboola MCP Server** gives an AI assistant the powers of a Keboola expert user. Connect Claude, Cursor, ChatGPT, VS Code, Windsurf, or Make to your project and describe what you need in plain language — the assistant queries your data, builds transformations, runs jobs, and documents what it finds, **with no clicks required**.

<!-- Explanation-type page. Source: the pre-split ai/mcp-server single page (through #1061) + keboola/mcp-server README. Split into explanation/how-to/reference on 2026-08-04. -->

![Claude debug error flow in MCP Server](/ai/mcp-server/mcp-claude-debug-error.gif)

## What your assistant can do

Model Context Protocol (MCP) is the open standard AI clients use to call external tools. Keboola's MCP Server exposes your project through it, so an assistant can:

- **Search and explore your data** — buckets, tables, and columns.
- **Set up and manage workflows** — no code required.
- **Build SQL queries and transformations** using natural language.
- **Launch and monitor jobs** in real time, and debug the ones that fail.
- **Document everything automatically** — down to the column level.

The full catalogue, and how to restrict it, is in the [tools reference](/ai/mcp-server/tools/).

## What people use it for

- Analyze customer orders, segment users, or monitor campaign performance — describe what you need and the assistant queries the project directly.
- Pull data from any connected system (CRM, ERP, ads) without touching the UI.
- Update and run data pipelines before a key meeting, without technical help.
- Generate clear, human-readable descriptions down to the column level, for full data transparency.

## How it works

The MCP Server is **hosted on every multi-tenant stack** and supports OAuth authentication, so any AI assistant that speaks remote **Streamable HTTP** with OAuth can connect to it — nothing to install. Streamable HTTP is the recommended transport: it streams bidirectionally, which makes long tool calls faster and more reliable.

**Permissions follow you.** When you connect over OAuth, the assistant gets exactly the permissions your Keboola role has — no more. If you need finer-grained control than your role gives, [run the server yourself](/ai/mcp-server/self-hosted/) with a specific **Storage token** and **workspace schema**, or restrict the tool set with [authorization headers](/ai/mcp-server/tools/#restricting-tool-access).

## Keeping an agent off production

You can scope the server to a [development branch](/components/branches/), so an agent's changes never land in production:

- **Remote server:** send the `X-Branch-Id` HTTP header with your branch ID (set by the client, like the tool-authorization headers).
- **Local server:** set the `KBC_BRANCH_ID` environment variable.

Without either, the server operates on the production branch.

## This section

- **[Connect an AI client](/ai/mcp-server/connect/)** — step-by-step for Claude, ChatGPT, Cursor, Windsurf, VS Code, and Make, plus connecting from your own code.
- **[Tools reference](/ai/mcp-server/tools/)** — what the assistant can call, and how to restrict it with `X-Allowed-Tools`, `X-Disallowed-Tools`, and `X-Read-Only-Mode`.
- **[Run the server yourself](/ai/mcp-server/self-hosted/)** — Docker or `uv`, for custom permissions, testing, or a custom client.

## How it relates to Keboola's other tools

| Use | Reach for |
|---|---|
| Let an AI client work inside one project through your own permissions | **MCP Server** (this section) |
| Drive Keboola from the terminal, or give an agent sandboxed control across your whole organization | **[kbagent CLI](/cli/)** — it can also call MCP tools via `kbagent tool` |
| Ask questions and build inside the Keboola UI | **[Kai](/kai/)** |
| Set up your coding agent with Keboola skills | **[AI Kit](/ai/ai-kit/)** |

## Support and feedback

Need help or want to contribute? [Open an issue on GitHub](https://github.com/keboola/mcp-server/issues/new) to report bugs, request features, or suggest improvements. For dev environments or contributing to the server itself, see the [MCP Server repository](https://github.com/keboola/mcp-server).

:::caution
Don't forget to give us a [star on GitHub!](https://github.com/keboola/mcp-server)
:::

**Next:** [Connect an AI client →](/ai/mcp-server/connect/)
