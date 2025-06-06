---
title: Keboola Model Context Protocol (MCP) Server
permalink: /ai/mcp-server/
---


* TOC
{:toc}

Connect your MCP clients (**Cursor**, **Claude**, **Windsurf**, **VS Code**) and AI assistants to your **Keboola Project** and give them the powers of Keboola Expert user. 

Query data, create transformations, write SQL queries, and build your pipelines — **all with no clicks required.**


## Overview  
Keboola's MCP Server brings powerful AI agents like Claude and Cursor directly into your data workflows. Just describe what you need in plain language to:

- Search and explore your data.
- Set up and manage workflows — no code required.
- Build SQL queries and transformations using AI.
- Launch and monitor jobs in real time.
- Automatically document everything — down to the column level.


**Business Use Cases:**
- Analyze customer orders, segment users, or monitor campaign performance — just by describing what you need, your assistant will query the data in your project directly.
- Instantly get data from any system (CRM, ERP, ads) without touching the UI.
- Update and run data pipelines before key meetings — no technical help required.
- Automatically generate clear, human-readable descriptions down to the column level for full data transparency.


![mcp_debug](/ai/mcp-server/MCP_Claude-Debug_Error.gif)
## Connecting to Keboola's MCP Server

Keboola MCP Server is hosted on every multi-tenant stack and supports oAuth authentication. You can use the remote server in any AI Assistant that supports remote sse connection and oAuth authentication.

### Remote Server Setup

In case your AI assistant supports remote connection, you can connect to Keboola's MCP Server by following these steps:

1. Obtain the remote server URL of the stack `https://mcp.<YOUR_REGION>.keboola.com/sse`.
   - You can find the url in your Keboola [project settings](/management/project/), e.g. navigate to `Users & Settings` > `MCP Server`
     - In there you can also find specific instructions for various clients.
2. Copy the server URL and paste it into your AI assistant's settings.
3. Once you save the settings and refresh your AI assistant, you will be prompted to authenticate with your Keboola account and select the project you want to connect to.

### Local Server Setup

Some of the AI Assistants or MCP Clients do not support the remote oauth connection yet. In that case you may use a local deployment.

#### Using mcp-remote adapter

1. **Make sure you have [Node.js](https://nodejs.org/) installed.**
   - **macOS**
   ```bash
   brew install node
   ```
   - **Windows**
     -  Go to: [https://nodejs.org](https://nodejs.org)
     - Download the **LTS** version (recommended)
     - Run the Installer, ensure "npm package manager" is selected

2. **Configure your client using mcp.json:**

    ```json
    {
      "mcpServers": {
        "keboola": {
          "command": "npx",
          "args": [
            "mcp-remote",
            "https://mcp.<YOUR_REGION>.keboola.com/sse"
          ]
        }
      }
    }
    ```
3. **Login**

Once you save the settings and refresh your AI assistant, you will be prompted to authenticate with your Keboola account and select the project you want to connect to.

#### Using local deployment

1. **Make sure you have Python 3.10+ installed**
2. **Make sure you have uv installed**
   - **macOS**
   ```bash
   brew install uv
   ```
   - **Windows**
     -  Go to: [https://pypi.org/project/uv/](https://pypi.org/project/uv/)
     - Download the latest version and install it
3. **Obtain Storage token from your project**
   - Go to your Keboola project: **Project Settings → Users & Settings → API Tokens**.
   - Obtain your [Master token](management/project/tokens/#master-tokens).
4. **Configure your client using mcp.json:**

    ```json
    {
      "mcpServers": {
        "keboola": {
          "command": "uvx",
          "args": [
            "keboola_mcp_server",
            "--api-url", "https://connection.YOUR_REGION.keboola.com"
          ],
          "env": {
            "KBC_STORAGE_TOKEN": "your_keboola_storage_token"
          }
        }
      }
    }
    ```



### Using with Claude Desktop

<div class="alert alert-warning">
<p>These steps must be done by a Claude organization owner or primary owner, or on a Claude Max plan. The added integration will be available to all users in the Claude organization, but each user will still be required to authenticate themselves separately.</p>
</div>

- Go to [Settings > Integrations](https://claude.ai/settings/integrations)
- Click the **"Add more"** button
- Give the integration a name (Keboola) and paste in your Integration URL
  - `https://mcp.<YOUR_REGION>.keboola.com/sse`
- Click **"Add"**
- You'll be prompted to authenticate with your Keboola account and select the project you want to connect to.

#### Via mcp-remote adapter

If you don't have paid version you can still use the mcp-remote adapter to connect Claude Desktop to Keboola's MCP Server.

1. Open the Claude menu on your computer and select **"Settings…"**
2. Click on **"Developer"** in the left-hand bar of the Settings pane, and then click on **"Edit Config"**
3. Paste the following JSON into the config file and save.
```json
{
  "mcpServers": {
    "keboola": {
      "command": "uvx",
      "args": [
        "keboola_mcp_server",
        "--api-url", "https://connection.YOUR_REGION.keboola.com"
      ],
      "env": {
        "KBC_STORAGE_TOKEN": "your_keboola_storage_token"
      }
    }
  }
}
```
4. Restart Claude Desktop, you'll be prompted to authenticate with your Keboola account and select the project you want to connect to.

### Using with Cursor

1. Navigate to Keboola [project settings](/management/project/), click `Users & Settings` > `MCP Server`
2. CLick the Cursor tab
3. CLick the **"Install In Cursor"** button

**Alternatively**, add this configuration to your `mcp.json` file:

```json
{
  "mcpServers": {
    "keboola": {
      "url": "https://mcp.<YOUR_REGION>.keboola.com/sse"
    }
  }
}
```

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

<div class="alert alert-warning">
<p>Don't forget to give us a <a href="https://github.com/keboola/mcp-server">star on GitHub!</a> </p>
</div>
