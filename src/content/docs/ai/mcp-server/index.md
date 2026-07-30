---
title: Keboola Model Context Protocol (MCP) Server
slug: 'ai/mcp-server'
description: Connect MCP clients and AI assistants to your Keboola project — what the MCP Server does, how to connect each client, and the available tools.
keywords:
  - Keboola MCP Server
  - Model Context Protocol
  - connect AI assistant Keboola
  - MCP client
redirect_from:
    - /external-integrations/mcp-server/
    - /management/project/mcp-server/
---

:::caution
**SSE Transport Deprecation:** The SSE transport for MCP Server will be deprecated on 01.04.2026. Please migrate to Streamable HTTP transport using `/mcp` endpoints instead of `/sse`. Streamable HTTP provides bidirectional streaming for improved performance and reliability.
:::



Connect your MCP clients and AI assistants to your **Keboola Project** and give them the powers of a Keboola Expert user. Query data, create transformations, write SQL queries, and build your pipelines — **all with no clicks required.**

Keboola's MCP Server brings powerful AI agents like Claude and Cursor directly into your data workflows. Just describe what you need in plain language to:

- Search and explore your data.
- Set up and manage workflows — no code required.
- Build SQL queries and transformations using AI.
- Launch and monitor jobs in real time.
- Automatically document everything — down to the column level.

**Business use cases:**
- Analyze customer orders, segment users, or monitor campaign performance — just by describing what you need, your assistant will query the data in your project directly.
- Instantly get data from any system (CRM, ERP, ads) without touching the UI.
- Update and run data pipelines before key meetings — no technical help required.
- Automatically generate clear, human-readable descriptions down to the column level for full data transparency.

![Claude debug error flow in MCP Server](/ai/mcp-server/mcp-claude-debug-error.gif)

## In this section

- **[Connect a client](/ai/mcp-server/connect/)** — set up the MCP Server in Cursor, Claude, ChatGPT, Windsurf, VS Code, or Make.
- **[Reference](/ai/mcp-server/reference/)** — available tools, restricting tool access, and advanced setup.

Supported clients: [Cursor](/ai/mcp-server/connect/#using-with-cursor), [Claude](/ai/mcp-server/connect/#using-with-claude-desktop), [ChatGPT](/ai/mcp-server/connect/#using-with-chatgpt), [Windsurf](/ai/mcp-server/connect/#using-with-windsurf), [VS Code](/ai/mcp-server/connect/#using-with-vs-code), [Make](/ai/mcp-server/connect/#using-with-make), and any client that supports a [remote Streamable HTTP connection](/ai/mcp-server/connect/#remote-server-setup).

## Support and feedback

Need help or want to contribute? [Open an issue on GitHub](https://github.com/keboola/mcp-server/issues/new) to report bugs, request features, or suggest improvements. We'd love your ideas, fixes, and feedback to make MCP even better.

:::caution
Don't forget to give us a [star on GitHub!](https://github.com/keboola/mcp-server)
:::
