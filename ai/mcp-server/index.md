---
title: Keboola Model Context Protocol (MCP) Server
permalink: /ai/mcp-server/
---

<div class="alert alert-warning" role="alert">
    <i class="fas fa-exclamation-triangle"></i>
    <strong>SSE Transport Deprecation:</strong> The SSE transport for MCP Server will be deprecated on 01.04.2026. Please migrate to Streamable HTTP transport using <code>/mcp</code> endpoints instead of <code>/sse</code>. Streamable HTTP provides bidirectional streaming for improved performance and reliability.
</div>

* TOC
{:toc}

Connect your MCP clients and AI assistants to your **Keboola Project** and give them the powers of a Keboola Expert user:

- **[Cursor](#using-with-cursor)** - Direct deeplink installation
- **[Claude](#using-with-claude-desktop)** - Organization-level integration
- **[ChatGPT](#using-with-chatgpt)** - Custom connector for Plus/Pro users
- **[Windsurf](#using-with-windsurf)** - Plugin store or manual configuration
- **[VS Code](#using-with-vs-code)** - Agent mode with MCP servers
- **[Make](#using-with-make)** - Agent mode with MCP servers
- **[Other clients](#remote-server-setup)** - Remote server connection

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

Keboola MCP Server is hosted on every multi-tenant stack and supports OAuth authentication. You can use the remote server in any AI Assistant that supports remote Streamable HTTP connection and OAuth authentication. Streamable HTTP is the recommended transport method, providing bidirectional streaming for improved performance compared to the deprecated SSE transport.

### Remote Server Setup

In case your AI assistant supports remote connection, you can connect to Keboola's MCP Server by following these steps:

1. Obtain the remote server URL of the stack `https://mcp.<YOUR_REGION>.keboola.com/mcp`.
   - Available stack URLs:
     - `https://mcp.keboola.com/mcp` 
     - `https://mcp.us-east4.gcp.keboola.com/mcp` 
     - `https://mcp.eu-central-1.keboola.com/mcp` 
     - `https://mcp.north-europe.azure.keboola.com/mcp`
     - `https://mcp.europe-west3.gcp.keboola.com/mcp`
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
  - `https://mcp.<YOUR_REGION>.keboola.com/mcp`
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
        "https://mcp.<YOUR_REGION>.keboola.com/mcp"
      ]
    }
  }
}
```
4. Restart Claude Desktop, you'll be prompted to authenticate with your Keboola account and select the project you want to connect to.

### Using with ChatGPT

<div class="alert alert-info">
<p>This feature is available for ChatGPT Plus and Pro users only. Custom connectors are currently in beta.</p>
</div>

ChatGPT Plus and Pro users can connect to Keboola's MCP Server using custom connectors. Follow these steps to set up the integration:

#### Step 1: Access ChatGPT Settings

1. Log in to your ChatGPT Plus or Pro account
2. Click on your profile icon in the bottom-left corner of the screen
3. From the menu that appears, select **Settings**

#### Step 2: Navigate to Connectors

1. In the settings window, select the **Connectors** tab from the left-hand sidebar
2. Look for the **"Developer mode"** option and toggle it on
3. Read and acknowledge the warning that appears - this mode allows you to create custom connectors
4. In the top-right corner of the Connectors page, click **Create**

#### Step 3: Configure the New Connector

1. A new window will open for the "New Connector" settings
2. **Name**: Give your connector a name, such as "Keboola"
3. **Description**: Provide a brief description (optional)
4. **MCP Server URL**: This is the most important part. You need the specific URL for your Keboola MCP Server:
   - Open a new tab and go to your Keboola [project settings](/management/project/)
   - Navigate to `Users & Settings` > `MCP Server`
   - Copy the MCP Server URL provided there (e.g., `https://mcp.us-east4.gcp.keboola.com/mcp`)
   - Paste this URL into the **MCP Server URL** field in ChatGPT
5. **Authentication**: The authentication method will be set to OAuth automatically
6. Check the box to confirm you understand the "beta" nature of custom connectors
7. Click **Create**

#### Step 4: Authorize the Connection

1. After clicking "Create," you will be redirected to the Keboola platform to authorize the connection
2. Sign in to your Keboola account if prompted
3. Select the specific Keboola project you want to connect to
4. Once authorized, you will be redirected back to ChatGPT
5. A confirmation message "Keboola is now connected" will appear at the top of the screen

#### Step 5: Use the Connector in a Chat

To use the custom connector you've created, you must explicitly enable Developer Mode in the chat interface:

1. Start a new chat
2. Click on the **"Add photos & files"** icon
3. Hover over the **"More"** option
4. From the expanded menu, select **"Developer Mode"**
5. This will change the prompt box to indicate that developer mode is active
6. You will see an option to select your custom connector (e.g., a button labeled "Keboola")
7. Click on the **"Keboola"** button to enable it for this specific conversation

You can now ask questions related to your Keboola data, and ChatGPT will use the connector to access the information. For example: "What data tables are in my project?" or "Show me the latest job runs."

### Using with Cursor

Click the button related to your region below:

| Stack (Region)                  | Cursor Deeplink                                                                                                                                                                                                         |
|---------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| US Virginia AWS (default)       | [![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=keboola&config=eyJ1cmwiOiJodHRwczovL21jcC5rZWJvb2xhLmNvbS9tY3AifQ%3D%3D)                       |
| US Virginia GCP (us-east4)      | [![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=keboola&config=eyJ1cmwiOiJodHRwczovL21jcC51cy1lYXN0NC5nY3Aua2Vib29sYS5jb20vbWNwIn0%3D)         |
| EU Frankfurt AWS (eu-central-1) | [![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=keboola&config=eyJ1cmwiOiJodHRwczovL21jcC5ldS1jZW50cmFsLTEua2Vib29sYS5jb20vbWNwIn0%3D)         |
| EU Ireland Azure (north-europe) | [![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=keboola&config=eyJ1cmwiOiJodHRwczovL21jcC5ub3J0aC1ldXJvcGUuYXp1cmUua2Vib29sYS5jb20vbWNwIn0%3D) |
| EU Frankfurt GCP (europe-west3) | [![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=keboola&config=eyJ1cmwiOiJodHRwczovL21jcC5ldXJvcGUtd2VzdDMuZ2NwLmtlYm9vbGEuY29tL21jcCJ9)       |

**Alternatively**, you can:

1. Navigate to Keboola [project settings](/management/project/), click `Users & Settings` > `MCP Server`.
2. Click the Cursor tab.
3. Click the **"Install In Cursor"** button.
4. You'll be prompted to login into your Keboola account and select the project you want to connect to.

### Using with Windsurf

Windsurf supports MCP through its native integration with Cascade. You can add Keboola's MCP Server in two ways:

#### Option 1: Manual Configuration (Recommended)

1. Open the Windsurf settings and navigate to `Cascade` > `Plugins`
2. Click on "Add MCP Plugin" or edit the `mcp_config.json` file directly
3. Add the Keboola MCP Server configuration:

```json
{
  "mcpServers": {
    "keboola": {
      "serverUrl": "https://mcp.<YOUR_REGION>.keboola.com/mcp"
    }
  }
}
```

4. Replace `<YOUR_REGION>` with your specific stack URL from the [available stack URLs](#remote-server-setup)
5. Press the refresh button after adding the configuration
6. You'll be prompted to authenticate with your Keboola account and select the project

For detailed instructions and troubleshooting, see the [Windsurf MCP documentation](https://docs.windsurf.com/windsurf/cascade/mcp#adding-a-new-mcp-plugin).

### Using with VS Code

VS Code supports MCP servers through GitHub Copilot's agent mode. Follow these steps to set up Keboola's MCP Server:

#### Prerequisites
- VS Code with GitHub Copilot extension installed
- GitHub Copilot subscription (Pro, Business, or Enterprise)

#### Setup Instructions

1. Open VS Code and ensure you have the latest version of the GitHub Copilot extension
2. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and run **"MCP: Configure Servers"**
3. This will create or open your MCP configuration file (`mcp.json`)
4. Add the Keboola MCP Server configuration:

```json
{
  "servers": {
    "keboola": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp.<YOUR_REGION>.keboola.com/mcp"
      ]
    }
  }
}
```

5. Replace `<YOUR_REGION>` with your specific stack URL from the [available stack URLs](#remote-server-setup)
6. Save the configuration file
7. Restart VS Code or run **"MCP: Restart Servers"** from the Command Palette
8. You'll be prompted to authenticate with your Keboola account and select the project

#### Using MCP Tools in VS Code

- Open the Chat view and enable agent mode
- Select the **Tools** button to see available Keboola tools
- Use `#` in your chat to reference specific tools or resources
- The tools will be available with up to 128 tools per request

For detailed setup and troubleshooting, see the [VS Code MCP documentation](https://code.visualstudio.com/docs/copilot/chat/mcp-servers).

### Using with MAKE

1. Create your scenario in MAKE.
2. Use the MCP Client component within the scenario.
3. In the dropdown of the MCP Client, select Keboola.
4. Navigate to Keboola [project settings](/management/project/), click `Users & Settings` > `MCP Server`.
5. Click the MAKE tab.
6. Copy the integration URL displayed there into the MCP Client configuration in MAKE.

## Available Tools

Keboola's MCP Server comes with a rich set of tools your AI client (like Claude or Cursor) can use to interact with your data environment — just by asking in plain language.
Don't worry about remembering command names — your AI client handles that. Just describe what you want to do.

- **Components & Transformations** – Create, edit, and launch them with natural language.  
- **Storage** – Browse, edit, and document buckets, tables, and columns.  
- **SQL** – Run and manage SQL queries.  
- **Jobs** – Start, monitor, and debug execution flows.  
- **Documentation** – Search official Keboola docs from within your AI chat.

## Restricting Tool Access

When using the remote MCP server, you may want to limit which tools are available to AI agents. This is useful for:

- **AI Agent Restrictions**: Limiting what actions an AI agent (like Devin or Cursor) can perform in your project
- **Compliance and Security**: Enforcing data governance policies by restricting write operations
- **Customer-Specific Access**: Creating tailored access profiles for different use cases

The MCP server supports three HTTP headers for tool authorization:

| Header | Purpose |
|--------|---------|
| `X-Allowed-Tools` | Only allow specific tools (comma-separated list) |
| `X-Disallowed-Tools` | Block specific tools (comma-separated list) |
| `X-Read-Only-Mode` | Restrict to read-only tools only (`true`/`1`/`yes`) |

These headers are set by the client (e.g., your AI agent integration or custom MCP client) when making HTTP requests to the MCP server. Refer to your MCP client's documentation for how to configure custom HTTP headers.

For example, setting `X-Read-Only-Mode: true` allows agents to query and explore data but prevents them from creating or modifying configurations.

For detailed technical documentation including the full list of read-only tools and header combination behavior, see the [Developer Documentation](https://developers.keboola.com/integrate/mcp/#tool-authorization-and-access-control).

## Advanced Setup Options
These methods are for developers or specific use cases (e.g., testing, contributing to the MCP server).
For CLI control, dev environments, or contributing to the MCP Server, check out the [MCP GitHub repo](https://github.com/keboola/mcp-server).


## Support and Feedback
Need help or want to contribute? [Open an issue on GitHub](https://github.com/keboola/mcp-server/issues/new) to report bugs, request features, or suggest improvements.
We’d love your ideas, fixes, and feedback to make MCP even better.

<div class="alert alert-warning">
<p>Don't forget to give us a <a href="https://github.com/keboola/mcp-server">star on GitHub!</a> </p>
</div>
