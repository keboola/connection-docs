---
title: Microsoft PowerApps Integration
permalink: /powerapps/
---

* TOC
{:toc}

Microsoft PowerApps users can connect to Keboola's MCP Server using Custom Connectors. This integration allows you to leverage Keboola's data and tools directly within your PowerApps applications.

### Prerequisites

- Active Microsoft PowerApps account
- Access to Custom Connectors (available in PowerApps Premium)
- Keboola project with appropriate permissions

### Setup Instructions

#### Step 1: Create a Custom Connector

1. Log in to your PowerApps account at [make.powerapps.com](https://make.powerapps.com)
2. Navigate to **Data** > **Custom Connectors** in the left sidebar
3. Click **+ New custom connector** in the top menu
4. Select **Create from blank**

#### Step 2: Configure General Settings

1. **Connector name**: Enter a name for your connector (e.g., "Keboola MCP")
2. **Description**: Provide a brief description (optional)
3. **Host**: Enter your Keboola MCP Server host
   * Find your specific host in your Keboola [project settings](/management/project/) under `Users & Settings` > `MCP Server`
   * Example: `mcp.us-east4.gcp.keboola.com`
4. **Base URL**: Enter `/mcp`



#### Step 3: Configure Authentication

1. In the **Security** tab, select **OAuth 2.0** as the authentication type
2. Configure OAuth or other authorization settings according to your organization's authentication policy
3. Click **Create connector**

#### Step 4: Authorize the Connection

1. After creating the connector, you'll need to create a connection
2. Go to **Data** > **Connections** and click **+ New connection**
3. Find your newly created Keboola MCP connector
4. Click on it to initiate the OAuth flow
5. You'll be redirected to Keboola to authenticate
6. Sign in to your Keboola account if prompted
7. Select the specific Keboola project you want to connect to
8. After authorization, you'll be redirected back to PowerApps

#### Step 5: Use the Connector in Your App

1. Open your PowerApp or create a new one
2. Add a data source by clicking **Data** in the left panel
3. Select **Add data** and search for your Keboola MCP connector
4. The connector is now available for use in your app
5. You can now query data, create transformations, and interact with your Keboola project directly from PowerApps

### Troubleshooting

* **Cannot find Custom Connectors**: Ensure you have a PowerApps Premium license
* **Authentication fails**: Verify that you're using the correct host for your Keboola stack
* **Connection timeout**: Check that your network allows access to the MCP Server URL
