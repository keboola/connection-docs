---
title: Keboola Model Context Protocol (MCP) Server
slug: 'ai/mcp-server'
redirect_from:
    - /external-integrations/mcp-server/
    - /integrate/mcp/
---



Connect your MCP clients and AI assistants to your **Keboola Project** and give them the powers of a Keboola Expert user:

- **[Cursor](#using-with-cursor)** - Direct deeplink installation
- **[Claude](#using-with-claude-desktop)** - Organization-level integration
- **[ChatGPT](#using-with-chatgpt)** - Custom connector for Plus/Pro users
- **[Windsurf](#using-with-windsurf)** - Manual configuration
- **[VS Code](#using-with-vs-code)** - Agent mode with MCP servers
- **[Make](#using-with-make)** - Agent mode with MCP servers
- **[Other clients](#remote-server-setup)** - Remote server connection

Query data, create transformations, write SQL queries, and build your pipelines — **all with no clicks required.**


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


![Claude debug error flow in MCP Server](/ai/mcp-server/mcp-claude-debug-error.gif)
## Connecting to Keboola's MCP Server

Keboola MCP Server is hosted on every multi-tenant stack and supports OAuth authentication. You can use the remote server in any AI Assistant that supports remote Streamable HTTP connection and OAuth authentication. Streamable HTTP is the recommended transport method, providing bidirectional streaming for improved performance and reliability.

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

:::note
When using the remote server with OAuth, you get the permissions that match your role in Keboola. If you wish to control permissions more granularly, run the server locally and specify your own **Storage Token** and **Workspace Schema** — see [Running the MCP Server Locally](#running-the-mcp-server-locally).
:::


### Using with Claude Desktop

:::caution
These steps must be done by a Claude organization owner or primary owner, or on either a Claude Pro or Claude Max plan. The added integration will be available to all users in the Claude organization, but each user will still be required to authenticate themselves separately.
:::

- Go to [Settings > Integrations](https://claude.ai/settings/integrations)
- Click the **"Add more"** button
- Give the integration a name (Keboola) and paste in your Integration URL
  - `https://mcp.<YOUR_REGION>.keboola.com/mcp`
- Click **"Add"**
- You'll be prompted to authenticate with your Keboola account and select the project you want to connect to.

#### Via mcp-remote adapter

If you don't have a paid version you can still use the [`mcp-remote`](https://github.com/geelen/mcp-remote) adapter to connect Claude Desktop to Keboola's MCP Server.

> NOTE: This method requires you to have Node.js installed on your computer.

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

:::note
This feature is available for ChatGPT Plus and Pro users only. Custom connectors are currently in beta.
:::

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

Windsurf supports MCP through its native integration with Cascade. Add Keboola's MCP Server with a manual configuration:

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
- The available Keboola tools will appear in the tools list for the agent

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
- **Flows** – Create and manage flows that orchestrate your components.  
- **Data Apps** – Browse and inspect your data apps.  
- **Documentation** – Search official Keboola docs from within your AI chat.

## Restricting Tool Access

When using the remote MCP server, you may want to limit which tools are available to AI agents. This is useful for:

- **AI Agent Restrictions**: Limiting what actions an AI agent (like Devin or Cursor) can perform in your project
- **Compliance and Security**: Enforcing data governance policies by restricting write operations
- **Customer-Specific Access**: Creating tailored access profiles for different use cases

When connecting via the Streamable HTTP transport, you control which tools are available to clients using HTTP headers.

:::note
Tool authorization headers only apply to HTTP-based transports. They are not available when using the `stdio` transport for local execution.
:::

### Authorization Headers

The following HTTP headers control tool access:

| Header | Description | Example Value |
|--------|-------------|---------------|
| `X-Allowed-Tools` | Comma-separated list of tool names to allow. Only these tools will be available. | `get_configs,get_buckets,query_data` |
| `X-Disallowed-Tools` | Comma-separated list of tool names to exclude. These tools will be removed from the available set. | `create_config,run_job` |
| `X-Read-Only-Mode` | When set to `true`, `1`, or `yes`, restricts access to read-only tools only. | `true` |

These headers are set by the client (e.g., your AI agent integration or custom MCP client) when making HTTP requests to the MCP server. Refer to your MCP client's documentation for how to configure custom HTTP headers.

### Filter Behavior

When multiple headers are present, filters are applied in the following order:

1. **Allowed tools filter**: If `X-Allowed-Tools` is specified, only those tools are initially available.
2. **Read-only intersection**: If `X-Read-Only-Mode` is enabled, the available tools are intersected with the read-only tools set.
3. **Disallowed exclusion**: Tools listed in `X-Disallowed-Tools` are removed from the final set.

Empty headers are treated as no restriction/exclusion (backward compatible behavior).

### Read-Only Tools

The following tools are classified as read-only (they do not modify data). The live set may grow over time — see [`TOOLS.md`](https://github.com/keboola/mcp-server/blob/main/TOOLS.md) in the server repo for the current annotations:

| Category | Tools |
|----------|-------|
| Components | `get_configs`, `get_components`, `get_config_examples`, `run_sync_action` |
| Flows | `get_flows`, `get_flow_examples`, `get_flow_schema` |
| Storage | `get_buckets`, `get_tables` |
| SQL | `query_data` |
| Data Apps | `get_data_apps` |
| Jobs | `get_jobs` |
| Search | `search`, `find_component_id` |
| Project | `get_project_info` |
| Documentation | `docs_query` |

### Examples

**AI Agent Restrictions**: When integrating AI agents (like Devin, Cursor, or custom agents) with your Keboola project, you may want to limit their capabilities. For example, allowing an agent to query and explore data but preventing it from creating or modifying configurations:

```
X-Read-Only-Mode: true
```

**Compliance and Security**: For environments with strict data governance requirements, you can create customer-specific access profiles. For example, allowing only specific tools while explicitly blocking others:

```
X-Allowed-Tools: get_buckets,get_tables,query_data,search
X-Disallowed-Tools: run_job
```

**Combined Restrictions**: You can combine all three headers for fine-grained control. For example, to allow only a subset of read-only tools:

```
X-Allowed-Tools: get_configs,get_buckets,get_tables,query_data,create_config
X-Read-Only-Mode: true
X-Disallowed-Tools: query_data
```

This configuration would result in only `get_configs`, `get_buckets`, and `get_tables` being available (the intersection of allowed and read-only, minus the disallowed).

:::note[The rest of this page is for developers]
The sections below cover running the server locally and integrating it programmatically. If you just want to connect an AI client, you're already done above — skip ahead, or hand these to your AI agent to set up for you.
:::

## Running the MCP Server Locally

While MCP clients like Cursor or Claude typically manage the MCP server automatically, you might want to run the Keboola MCP Server locally for development, testing, or when using a custom client. You can run it via Docker or via the `uv`/`uvx` command.

### Using Docker (recommended)

For a consistent and isolated environment, running the Keboola MCP Server via [Docker](https://docker.com/get-started/) is often the recommended approach for local execution, especially if you don't want to manage Python environments directly or are integrating with clients that can manage Docker containers.

Before proceeding, ensure you have Docker installed on your system. You can find installation guides on the [official Docker website](https://docs.docker.com/engine/install/).

1.  **Pull the latest image:**
    ```bash
    docker pull keboola/mcp-server:latest
    ```
2.  **Run the Docker container:**

    *   **For Snowflake users:**
        ```bash
        docker run -it --rm \
          -e KBC_STORAGE_TOKEN="YOUR_KEBOOLA_STORAGE_TOKEN" \
          -e KBC_WORKSPACE_SCHEMA="YOUR_WORKSPACE_SCHEMA" \
          keboola/mcp-server:latest \
          --api-url https://connection.YOUR_REGION.keboola.com
        ```
        Replace `YOUR_KEBOOLA_STORAGE_TOKEN`, `YOUR_WORKSPACE_SCHEMA`, and `https://connection.YOUR_REGION.keboola.com` with your actual values.

    *   **For BigQuery users (requires volume mount for credentials):**
        ```bash
        # Ensure your Google Cloud credentials JSON file is accessible
        docker run -it --rm \
          -e KBC_STORAGE_TOKEN="YOUR_KEBOOLA_STORAGE_TOKEN" \
          -e KBC_WORKSPACE_SCHEMA="YOUR_WORKSPACE_SCHEMA" \
          -e GOOGLE_APPLICATION_CREDENTIALS="/creds/credentials.json" \
          -v /local/path/to/your/credentials.json:/creds/credentials.json \
          keboola/mcp-server:latest \
          --api-url https://connection.YOUR_REGION.keboola.com
        ```
        Replace placeholders and ensure `/local/path/to/your/credentials.json` points to your actual credentials file on your host machine.

    The `--rm` flag ensures the container is removed when it stops. The server inside Docker will typically listen on `stdio` by default, which is suitable for clients that can invoke and manage Docker commands.

**Example: Configuring Cursor IDE to use Docker for Keboola MCP Server:**

If your MCP client (like Cursor) supports defining a Docker command for an MCP server, the configuration might look like this:

```json
{
  "mcpServers": {
    "keboola": {
      "command": "docker",
      "args": [
        "run",
        "-it",
        "--rm",
        "-e", "KBC_STORAGE_TOKEN",
        "-e", "KBC_WORKSPACE_SCHEMA",
        "keboola/mcp-server:latest",
        "--api-url", "https://connection.YOUR_REGION.keboola.com"
      ],
      "env": {
        "KBC_STORAGE_TOKEN": "YOUR_KEBOOLA_STORAGE_TOKEN",
        "KBC_WORKSPACE_SCHEMA": "YOUR_WORKSPACE_SCHEMA"
      }
    }
  }
}
```

**Note:**
* Ensure Docker is running on your system.
* Replace placeholders like `YOUR_KEBOOLA_STORAGE_TOKEN`, `YOUR_WORKSPACE_SCHEMA`, and the Keboola API URL.
* The client (Cursor) passes the `KBC_STORAGE_TOKEN` and `KBC_WORKSPACE_SCHEMA` from its `env` block to the `docker run` command through the `-e` flags. The `--api-url` is passed directly as an argument to the `keboola/mcp-server` entrypoint.

### Using the uv command

The primary way to run the server locally without Docker is by using `uv` or `uvx` to execute the `keboola_mcp_server` package. More information about the server is available in its [Keboola MCP Server GitHub repository](https://github.com/keboola/mcp-server). Make sure you have Python 3.10+ and `uv` installed.

1. **Set up environment variables:**  
   Before running the server, you need to configure the following environment variables:
   * `KBC_STORAGE_TOKEN`: Your Keboola Storage API token.
   * `KBC_WORKSPACE_SCHEMA`: Your Keboola project's workspace schema (for SQL queries).
   * `KBC_STORAGE_API_URL`: Your Keboola instance API URL (e.g., `https://connection.keboola.com` or `https://connection.YOUR_REGION.keboola.com`).

   Refer to the [Keboola Tokens](/management/project/tokens/) and [Keboola workspace manipulation](/tutorial/manipulate/workspace/) for detailed instructions on obtaining these values.

   **1.1. Additional Setup for BigQuery Users**  
   If your Keboola project uses BigQuery as its backend, you will also need to set up the `GOOGLE_APPLICATION_CREDENTIALS` environment variable. This variable should point to the JSON file containing your Google Cloud service account key that has the necessary permissions to access your BigQuery data.

   Example:  
   `GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/credentials.json"`

2. **Run the server:**

```bash
uvx keboola_mcp_server --api-url $KBC_STORAGE_API_URL
```

The `KBC_STORAGE_API_URL` was set as an environment variable but can also be provided manually via the `--api-url` flag. The command starts the server communicating via `stdio`. To run the server in `Streamable HTTP` mode (listening on a network host/port such as `localhost:8000`), pass the appropriate flags to `keboola_mcp_server`. For day-to-day use with clients like Claude or Cursor you usually do not need to run this command manually, as they handle the server lifecycle.

### Connecting a client to a localhost instance

When you run the Keboola MCP Server manually, it will typically listen on `stdio` or on a specific HTTP port if configured for `Streamable HTTP`.

* **`stdio`-based clients:** Configure the client application to launch the local `keboola_mcp_server` executable and communicate over standard input/output.
* **`Streamable HTTP`-based clients:** If you start the server in HTTP mode, your client should connect to the specified host and port (e.g., `http://localhost:8000/mcp?storage_token=XXX&workspace_schema=YYY`).

**Example: connecting Cursor IDE to a local `uvx` instance**

If you are running the Keboola MCP Server locally using `uvx`, you can configure Cursor IDE to connect to this local instance. This is useful for development or testing with a custom server build.

1. Open Cursor settings.
2. Navigate to the MCP section within settings.
3. Add or configure your Keboola project. Provide your `KBC_STORAGE_TOKEN`, `KBC_WORKSPACE_SCHEMA` and the API URL.

Example `mcp_servers.json` snippet:

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
        "KBC_STORAGE_TOKEN": "your_keboola_storage_token",
        "KBC_WORKSPACE_SCHEMA": "your_workspace_schema"
      }
    }
  }
}
```

> You can use this link to get the above configuration template into your Cursor: [![Install MCP Server using uvx](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=keboola&config=eyJjb21tYW5kIjoidXZ4IGtlYm9vbGFfbWNwX3NlcnZlciAtLWFwaS11cmwgaHR0cHM6Ly9jb25uZWN0aW9uLllPVVJfUkVHSU9OLmtlYm9vbGEuY29tIiwiZW52Ijp7IktCQ19TVE9SQUdFX1RPS0VOIjoieW91cl9rZWJvb2xhX3N0b3JhZ2VfdG9rZW4iLCJLQkNfV09SS1NQQUNFX1NDSEVNQSI6InlvdXJfd29ya3NwYWNlX3NjaGVtYSJ9fQ%3D%3D)

## Programmatic Integration

Beyond ready-made clients, you can integrate the Keboola MCP Server directly into your own code and AI agent frameworks. This unlocks fully automated data workflows driven by natural-language instructions.

### Claude Messages API with MCP Connector (Beta)

Anthropic offers a beta feature, the [MCP connector](https://platform.claude.com/docs/en/docs/agents-and-tools/mcp-connector), which enables you to connect to remote MCP servers (such as the Keboola MCP Server) directly through Claude's Messages API. This method bypasses the need for a separate, standalone MCP client if you are already using the Claude Messages API.

**Key features of this integration:**

*   **Direct API Calls**: You configure connections to MCP servers by including the `mcp_servers` parameter in your API requests to Claude.
*   **Tool Calling**: The primary MCP functionality currently supported through this connector is tool usage.
*   **Accessibility**: The target MCP server needs to be publicly accessible over HTTP.

This approach can simplify your architecture if you're building applications that programmatically interact with Claude and need to leverage MCP-enabled tools without managing an additional client layer.

For complete details, API examples, and configuration options, please consult the [official Anthropic MCP connector documentation](https://platform.claude.com/docs/en/docs/agents-and-tools/mcp-connector).

### OpenAI Agents SDK (Python)

The [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/mcp/) ships with first-class MCP support. Simply start the Keboola MCP Server (locally via `uvx` or remotely over Streamable HTTP) and register it with the SDK:

```python
from agents import Agent, Runner
from agents.mcp import MCPServerStdio

async with MCPServerStdio(
    params={"command": "uvx", "args": ["keboola_mcp_server"]}
) as mcp:
    agent = Agent(
        name="Assistant",
        instructions="Use the Keboola tools to achieve the task",
        mcp_servers=[mcp],
    )
    result = await Runner.run(agent, "Load yesterday's CSV into Snowflake")
```

The SDK automatically calls `list_tools()` on the server, making every Keboola operation available to the model.

### LangChain

[LangChain](https://python.langchain.com/docs/) does not yet include a built-in MCP connector, but you can integrate by:

1. Running the Keboola MCP Server, or attaching to our deployed instance `https://mcp.<YOUR_REGION>.keboola.com/mcp`.
2. Mapping each entry from `list_tools()` to a `Tool` in LangChain.
3. Adding those tools to an `AgentExecutor`.

Because the server returns standard JSON schemas, the mapping is straightforward and can be handled with a lightweight wrapper. Native MCP support is already under discussion in the LangChain community.

### Other frameworks

* **[Crew AI](https://crewai.com)** – Provide crew members with Keboola tool definitions and route tool invocations through the MCP server.

### Building your own MCP client

If you are developing your own MCP client or integrating MCP capabilities into a custom application, you can connect to the Keboola MCP Server. The server supports standard MCP communication protocols.

For detailed instructions and SDKs for building your own MCP client, refer to the official [Model Context Protocol documentation for client developers](https://modelcontextprotocol.io/quickstart/client). Supported transports are `stdio` and `Streamable HTTP`. For more details on the Keboola MCP server, including how it can be run and configured for custom client integration, refer to its [GitHub repository](https://github.com/keboola/mcp-server).

## Advanced Setup Options
These methods are for developers or specific use cases (e.g., testing, contributing to the MCP server).
For CLI control, dev environments, or contributing to the MCP Server, check out the [MCP GitHub repo](https://github.com/keboola/mcp-server).


## Support and Feedback
Need help or want to contribute? [Open an issue on GitHub](https://github.com/keboola/mcp-server/issues/new) to report bugs, request features, or suggest improvements.
We’d love your ideas, fixes, and feedback to make MCP even better.

:::caution
Don't forget to give us a [star on GitHub!](https://github.com/keboola/mcp-server)
:::
