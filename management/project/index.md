---
title: Project Settings
permalink: /management/project/
---

* TOC
{:toc}

The Project Settings page provides general information about your project.
To access it, click your avatar icon at the upper right corner on any page in Keboola platform and select **Project Settings** from the dropdown menu.

The Project Settings page shows important properties of your project, such as:

### 1 Project Details
- Expiration
- Type of project
- Storage type and data retention setting
- Data retention for [time travel](/storage/tables/backups/)
- Region -- physical location of the project data; it corresponds to an
[Amazon Region identifier](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-available-regions).
<br> Available regions: **us-east-1** (USA -- North Virginia), **eu-central-1** (EU -- Frankfurt)

You can also

- rename your project.
- [export all project data](/management/project/export/).
- [migrate project to another region](/management/project/migration/)
- [delete the project](/management/project/delete/).

### 2 Users
The User Settings page in the Keboola platform serves as a centralized location where you can review users that have been invited into the project, their authentication method and rights. From this page you can also invite new users or remove the current ones. For more detailed information go to [Users](/management/project/users).

### 3 API Tokens
The API Tokens section in the Keboola platform is used to manage programmatic access to a project via the Keboola Storage API. For more detailed information go to [Tokens](/management/project/tokens).

### 4 CLI Sync
The CLI Sync section is used to set up and manage synchronization between the Keboola platform and your local development environment using the Keboola CLI (KBC CLI). It allows you to securely connect CLI-based tools to a specific project, enabling actions like pulling configurations, pushing changes, or running jobs programmatically. 

If you need to setup your Keboola CLI, simply follow the instructions displayed on this page. For more detailed information go to the [Developer documentation](https://developers.keboola.com/cli/).

### 5 Features
The Features section in the Keboola UI is used to toggle project-specific feature flags. It allows project admins to enable or disable experimental, beta, or advanced platform capabilities that are not generally available by default. 

### 6 AI Rules
The AI Rules section allows users to define specific instructions for AI functionality within Keboola platform. For more details go to [AI Rules](/management/project/ai-rules).

### 7 MCP Server
MCP Server section contains step-by-step instructions that will help you easily set up a connection between your AI Agent and Keboola platform to operate your data using just prompts. For more details go to [MCP Server](/ai/mcp-server).
