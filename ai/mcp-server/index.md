---
title: Keboola Model Context Protocol (MCP) Server
permalink: /ai/mcp-server/
---

* TOC
{:toc}

# Keboola Model Context Protocol (MCP) Server  
**Supercharge your data workflows with AI-powered automation.**

## Overview  
Keboola's MCP Server brings powerful AI agents like Claude and Cursor directly into your data workflows. Just describe what you need in plain language to:

- Search and explore your data.
- Set up and manage workflows — no code required.
- Build SQL queries and transformations using AI.
- Launch and monitor jobs in real time.
- Automatically document everything — down to the column level.


**Business Use Cases:**
- Generate accurate SQL to analyze customer orders, segment users, or monitor campaign performance — just by describing what you need.
- Instantly get data from any system (CRM, ERP, ads) without touching the UI.
- Update and run data workflows before key meetings — no technical help required.
- Automatically generate clear, human-readable descriptions down to the column level for full data transparency.


## Requirements
To connect your AI client with Keboola, you’ll need the following:

- **AI Client:** Claude Desktop, Cursor, or any MCP-compatible client.
- **Python:** Version 3.10 or higher.
- **`uv`:** A fast Python package manager. Install via [docs.astral.sh/uv](https://docs.astral.sh/uv/getting-started/installation/).

> 🔧 **Environment Variables:** The required variables will be auto-generated or easily retrievable during setup. No manual hunting required.

> ⚠️ **BigQuery Note:** Keboola projects running on BigQuery are currently **not supported** by the MCP Server.


## Connecting to Keboola's MCP Server

In most cases, your AI client (like Claude or Cursor) will automatically start the Keboola MCP Server once configured — no manual server setup needed.

### Claude Desktop Setup
1. In your Keboola project: **Project Settings → MCP Server Setup → Claude → Download config.json**.
2. In Claude Desktop: **Menu → Settings → Developer → Edit Config**.
3. Paste the `config.json` file you downloaded from Keboola Settings into:
   - **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
   - **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
4. Restart Claude — you're ready to go.


### Using with Cursor
1. In your Keboola project: **Project Settings → MCP Server Setup → Cursor → Copy the JSON schema**.
2. In Cursor: **Settings → MCP → "+ Add new global MCP Server"**.
3. Paste the JSON schema into your `mcp.json` file and save.


## Available Tools

Keboola's MCP Server comes with a rich set of tools your AI client (like Claude or Cursor) can use to interact with your data environment — just by asking in plain language.
Don't worry about remembering command names — your AI client handles that. Just describe what you want to do.

- **Components & Transformations** – Create, edit, and launch them with natural language.  
- **Storage** – Browse, edit, and document buckets, tables, and columns.  
- **SQL** – Run and manage SQL queries (BigQuery not supported).  
- **Jobs** – Start, monitor, and debug execution flows.  
- **Documentation** – Search official Keboola docs from within your AI chat.

## Advanced Setup Options
These methods are for developers or specific use cases (e.g., testing, contributing to the MCP server).
For CLI control, dev environments, or contributing to the MCP Server, check out the [MCP GitHub repo](https://github.com/keboola/mcp-server).


## Support and Feedback
Need help or want to contribute? [Open an issue on GitHub](https://github.com/keboola/mcp-server/issues/new) to report bugs, request features, or suggest improvements.
We’d love your ideas, fixes, and feedback to make MCP even better.

