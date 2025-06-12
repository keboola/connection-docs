---
title: Keboola Model Context Protocol (MCP) Server
permalink: /ai/mcp-server/
---


* TOC
{:toc}

Connect your MCP clients (**Cursor**, **Claude**, **Windsurf**, **VS Code**) and AI assistants to your **Keboola Project** and give them the powers of a Keboola Expert user. 

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


![Claude debug error flow in MCP Server](/ai/mcp-server/MCP_Claude-Debug_Error.gif)
## Connecting to Keboola's MCP Server

Keboola MCP Server is hosted on every multi-tenant stack and supports OAuth authentication. You can use the remote server in any AI Assistant that supports remote SSE connection and OAuth authentication.

### Remote Server Setup

In case your AI assistant supports remote connection, you can connect to Keboola's MCP Server by following these steps:

1. Obtain the remote server URL of the stack `https://mcp.<YOUR_REGION>.keboola.com/sse`.
   - You can find the url in your Keboola [Project Settings](/management/project/) under the tab `MCP Server`
     - In there you can also find specific instructions for various clients.
2. Copy the server URL and paste it into your AI assistant's settings.
3. Once you save the settings and refresh your AI assistant, you will be prompted to authenticate with your Keboola account and select the project you want to connect to.

For other options of local deployments see the [Developers Documentation](https://developers.keboola.com/integrate/mcp/#running-keboola-mcp-server-locally-using-uv-command).


### Using with Claude Desktop

<div class="alert alert-warning">
<p>These steps must be done by a Claude organization owner or primary owner, or on either a Claude Pro or Claude Max plan. The added integration will be available to all users in the Claude organization, but each user will still be required to authenticate themselves separately.</p>
</div>

- Go to [Settings > Integrations](https://claude.ai/settings/integrations)
- Click the **"Add more"** button
- Give the integration a name (Keboola) and paste in your Integration URL
  - `https://mcp.<YOUR_REGION>.keboola.com/sse`
- Click **"Add"**
- You'll be prompted to authenticate with your Keboola account and select the project you want to connect to.

#### Via mcp-remote adapter

If you don't have a paid version you can still use the [`mcp-remote`](https://github.com/geelen/mcp-remote) adapter to connect Claude Desktop to Keboola's MCP Server.

> NOTE: This method requires you to have Node.js installed on your computer. For more information refer to the [Developers Documentation](https://developers.keboola.com/integrate/mcp)

1. Open the Claude menu on your computer and select **"Settings…"**
2. Click on **"Developer"** in the left-hand bar of the Settings pane, and then click on **"Edit Config"**
3. Paste the following JSON into the config file and save.
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
4. Restart Claude Desktop, you'll be prompted to authenticate with your Keboola account and select the project you want to connect to.

### Using with Cursor

1. Navigate to Keboola [project settings](/management/project/), click `Users & Settings` > `MCP Server`
2. Click the Cursor tab
3. Click the **"Install In Cursor"** button
4. You'll be prompted to login into your Keboola account and select the project you want to connect to.

**Alternatively**, click the button related to your region below:

| Stack (Region)                  | Cursor Deeplink                                                                                                                                                                                         |
|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| US Virginia AWS (default)       | [![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=keboola&config=eyJ1cmwiOiJodHRwczovL21jcC5rZWJvb2xhLmNvbS9zc2UifQ%3D%3D)                       |
| US Virginia GCP (us-east4)      | [![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=keboola&config=eyJ1cmwiOiJodHRwczovL21jcC51cy1lYXN0NC5nY3Aua2Vib29sYS5jb20vc3NlIn0%3D)         |
| EU Frankfurt AWS (eu-central-1) | [![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=keboola&config=eyJ1cmwiOiJodHRwczovL21jcC5ldS1jZW50cmFsLTEua2Vib29sYS5jb20vc3NlIn0%3D)         |
| EU Ireland Azure (north-europe) | [![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=keboola&config=eyJ1cmwiOiJodHRwczovL21jcC5ub3J0aC1ldXJvcGUuYXp1cmUua2Vib29sYS5jb20vc3NlIn0%3D) |
| EU Frankfurt GCP (europe-west3) | [![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=keboola&config=eyJ1cmwiOiJodHRwczovL21jcC5ldXJvcGUtd2VzdDMuZ2NwLmtlYm9vbGEuY29tL3NzZSJ9)       |


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

Feel free to reach out to us on our [Discord](https://discord.gg/keboola) anytime — we're here to help!

<div class="alert alert-warning">
<p>Don't forget to give us a <a href="https://github.com/keboola/mcp-server">star on GitHub!</a> </p>
</div>
