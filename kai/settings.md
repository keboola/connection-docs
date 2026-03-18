---
title: Kai Settings
permalink: /kai/settings/
---

* TOC
{:toc}

Kai's settings let you personalize how Kai behaves in your project. Open the Kai chat panel and click the **Settings** icon (gear) to access them. Settings are **per-user and per-project**, so each team member can configure their own preferences independently.

The settings panel has two tabs: **Tool Permissions** and **System Instructions**.

## Tool Permissions

Tool Permissions let you control which tools Kai is allowed to use. This eliminates the need to manually approve each action — you can pre-approve tools you trust and block those you don't want Kai to use.

{: .image-popup}
![Kai Settings — Tool Permissions](/kai/kai-settings-tool-permissions.png)

### Tool Categories

Tools are organized into two categories:

- **Read-only tools** — Tools that only read data from your project (e.g., listing tables, reading configurations). By default, all read-only tools are set to **Always allow**.
- **Write tools** — Tools that can create or modify resources in your project (e.g., creating configurations, updating transformations, running jobs).

### Permission Levels

For each tool, you can set one of three permission levels:

| Permission | Behavior |
|------------|----------|
| **Always allow** | The tool runs automatically without asking for confirmation. |
| **Always ask** | Kai must request your approval each time before using the tool. |
| **Block** | The tool is completely disabled and Kai cannot use it. |

### Setting Permissions

You can configure permissions in two ways:

- **From the Settings panel** — Open **Settings → Tool Permissions**, find the tool, and select the desired permission level.
- **From the approval dialog** — When Kai requests approval for a tool, click **Always allow** to automatically approve that tool for all future uses.

Your permissions persist across all conversations within the same project.

## System Instructions

System Instructions let you provide Kai with persistent context and guidelines that apply to every conversation in your project. Use them to define preferences, conventions, and project-specific rules so you don't have to repeat yourself in every chat.

### What to Include

System Instructions are ideal for:

- **Naming conventions** — e.g., "Always prefix staging tables with `stg_` and use snake_case for all column names."
- **Coding standards** — e.g., "Write SQL transformations using CTEs instead of subqueries. Always include comments explaining business logic."
- **Project context** — e.g., "Our fiscal year starts in April. Revenue calculations should exclude returns and use the `completed_at` date."
- **Preferred tools and workflows** — e.g., "Use Snowflake SQL dialect. Always create transformations in a dev branch first."
- **Response style** — e.g., "Keep explanations concise. Always show the SQL query before executing it."

### How to Set System Instructions

1. Open the Kai chat panel.
2. Click the **Settings** icon.
3. Select the **System Instructions** tab.
4. Enter your instructions in the text field.
5. Click **Save**.

Your instructions will be included as context in every new conversation with Kai in that project. They do not affect other users or other projects.

### Tips

- Keep instructions clear and specific — vague guidelines are less effective.
- Update instructions as your project evolves and conventions change.
- Focus on rules Kai can't infer from your project data alone (e.g., business logic, team preferences).
- If Kai doesn't seem to follow an instruction, try rephrasing it more directly.
