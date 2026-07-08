---
title: MCP Server reference
slug: 'ai/mcp-server/reference'
description: Reference for the Keboola MCP Server — available tools, restricting tool access with HTTP headers, and advanced setup options.
keywords:
  - MCP server tools
  - MCP tool access
  - X-Read-Only-Mode
  - MCP advanced setup
type: reference
---

Reference for the [Keboola MCP Server](/ai/mcp-server/). To connect a client, see the [how-to](/ai/mcp-server/connect/).

## Available tools

Keboola's MCP Server comes with a rich set of tools your AI client (like Claude or Cursor) can use to interact with your data environment — just by asking in plain language. Don't worry about remembering command names — your AI client handles that. Just describe what you want to do.

- **Components & Transformations** – Create, edit, and launch them with natural language.
- **Storage** – Browse, edit, and document buckets, tables, and columns.
- **SQL** – Run and manage SQL queries.
- **Jobs** – Start, monitor, and debug execution flows.
- **Documentation** – Search official Keboola docs from within your AI chat.

<!-- VERIFY(Jordan): confirm the current tool count / full tool list against the MCP server (audit noted a bump from 15 to 20). Keep the source of truth in the dev docs and link, rather than hard-coding a number that drifts. -->

## Restricting tool access

When using the remote MCP server, you may want to limit which tools are available to AI agents. This is useful for:

- **AI agent restrictions**: Limiting what actions an AI agent (like Devin or Cursor) can perform in your project
- **Compliance and security**: Enforcing data governance policies by restricting write operations
- **Customer-specific access**: Creating tailored access profiles for different use cases

The MCP server supports three HTTP headers for tool authorization:

| Header | Purpose |
|--------|---------|
| `X-Allowed-Tools` | Only allow specific tools (comma-separated list) |
| `X-Disallowed-Tools` | Block specific tools (comma-separated list) |
| `X-Read-Only-Mode` | Restrict to read-only tools only (`true`/`1`/`yes`) |

These headers are set by the client (e.g., your AI agent integration or custom MCP client) when making HTTP requests to the MCP server. Refer to your MCP client's documentation for how to configure custom HTTP headers.

For example, setting `X-Read-Only-Mode: true` allows agents to query and explore data but prevents them from creating or modifying configurations.

For detailed technical documentation including the full list of read-only tools and header combination behavior, see the [Developer Documentation](https://developers.keboola.com/integrate/mcp/#tool-authorization-and-access-control).

## Advanced setup options

These methods are for developers or specific use cases (e.g., testing, contributing to the MCP server). For CLI control, dev environments, or contributing to the MCP Server, check out the [MCP GitHub repo](https://github.com/keboola/mcp-server).
