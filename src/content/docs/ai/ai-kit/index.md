---
title: AI Kit
slug: 'ai/ai-kit'
---



AI Kit is a plugin marketplace for AI coding assistants that provides specialized agents, commands, and workflows for Keboola development. It helps developers build Keboola components, data apps, and maintain code quality using AI-powered tools.

AI Kit is designed for developers who use AI coding assistants like Claude Code to work with Keboola projects. It provides seven plugins that cover different aspects of Keboola development, from building production-ready components and data applications to driving your projects from the terminal and modelling your semantic layer.

The toolkit includes specialized AI agents that understand Keboola's architecture, best practices, and development patterns. These agents can help you create new components from scratch, implement configuration schemas, build data apps, review a project for SQL and security problems, and automate common development workflows.

## Installation

To install AI Kit, run the following command in your AI coding assistant:

```bash
/plugin marketplace add keboola/ai-kit
```

After installation, enable the plugins you need:

```bash
/plugin install component-developer@keboola-claude-kit
/plugin install dataapp-developer@keboola-claude-kit
/plugin install kbagent@keboola-claude-kit
/plugin install keboola-cli@keboola-claude-kit
/plugin install keboola-git@keboola-claude-kit
/plugin install powerbi-to-sl@keboola-claude-kit
/plugin install sl-toolkit@keboola-claude-kit
```

`keboola-claude-kit` is the marketplace name this repository publishes, and the one to install Keboola plugins from.

<!-- Plugin list, names and versions read from keboola/ai-kit .claude-plugin/marketplace.json on 2026-08-26: component-developer 3.3.2, dataapp-developer 1.5.1, kbagent 0.91.0, keboola-cli 1.1.1, keboola-git 1.0.1, powerbi-to-sl 1.0.0, sl-toolkit 3.0.0. There is no `developer` plugin. -->

## Available Plugins

### kbagent Plugin

The kbagent Plugin teaches an AI client the [kbagent CLI](/cli/), so the assistant can run jobs, read configurations and search across your Keboola projects. It adds a `/keboola` command backed by a `keboola-expert` subagent, a skill that understands plain-language asks like "set up kbagent for my Keboola project", and in Claude Code a `/kbagent:setup` command that installs and connects the CLI in one step.

The plugin's source lives in the CLI repo at [`plugins/kbagent`](https://github.com/keboola/cli/tree/main/plugins/kbagent); this marketplace publishes it from there through a `git-subdir` source. Claude Code, Claude Desktop, Cursor, VS Code and the ChatGPT app can all install it, each by its own route. See [kbagent with AI agents](/cli/for-agents/) for the steps per client.

### Component Developer Plugin

The Component Developer Plugin is a specialized toolkit for building production-ready Keboola Python components. It helps you follow best practices and architectural patterns throughout the development process.

**Agents:**

The **Component Builder** (`@component-builder`) is an expert agent for building Keboola Python components with comprehensive knowledge of the Keboola Common Interface, component architecture patterns, configuration schemas, CSV processing, state management, and CI/CD deployment workflows.

The **UI Developer** (`@ui-developer`) specializes in Keboola configuration schemas and UI development, including conditional fields, sync actions for dynamic dropdowns, and schema testing.

**Key Features:**

The plugin integrates with the official Keboola cookiecutter template for generating proper project structure. It guides you through implementing the CommonInterface class, validating configurations, processing CSV files efficiently, and managing state for incremental data loads.

The Component Builder understands Keboola's error handling conventions, Developer Portal registration process, and CI/CD deployment workflows. It enforces best practices like using generators for memory-efficient CSV processing, proper exit codes, and explicit output table schemas.

**Example Usage:**

```
@component-builder

I need to create a new extractor component that pulls data from a REST API.
The API requires OAuth2 authentication and supports pagination.
The component should support incremental loads based on a timestamp field.
```

[View Component Developer Plugin Documentation on GitHub](https://github.com/keboola/ai-kit/tree/main/plugins/component-developer)

### Keboola CLI Plugin

The Keboola CLI Plugin is a project management and review toolkit built on the older `kbc` sync CLI. It ships a ten-agent review team that analyses a project for SQL quality, security, performance, financial logic, and template readiness. It is a separate tool from the kbagent plugin above. If you want the agent interface to your projects, install `kbagent`.

[View Keboola CLI Plugin Documentation on GitHub](https://github.com/keboola/ai-kit/tree/main/plugins/keboola-cli)

### Keboola Git Plugin

The Keboola Git Plugin works with Keboola-managed Git (Forgejo) repositories for Python/JS data apps, which can host their source in Keboola rather than GitHub. It provisions repositories, mints push credentials, and copies source between GitHub and Keboola git through the kbagent CLI. It also carries the 15 MB push cap and the build-at-deploy workaround it forces.

[View Keboola Git Plugin Documentation on GitHub](https://github.com/keboola/ai-kit/tree/main/plugins/keboola-git)

### Semantic Layer Toolkit

The `sl-toolkit` plugin inspects, validates, and builds semantic layer models through the metastore API. `/sl-show` lists a model's datasets, metrics, and relationships, `/sl-validate` checks it for phantom fields and dangling references, and `/sl-build` walks a greenfield model from schema discovery to push. Adding and editing model objects works conversationally, with no slash command.

[View Semantic Layer Toolkit Documentation on GitHub](https://github.com/keboola/ai-kit/tree/main/plugins/sl-toolkit)

### Power BI to Semantic Layer

The `powerbi-to-sl` plugin migrates an existing Microsoft Power BI semantic model into a Keboola semantic layer model, translating tables, columns, measures, and relationships. It is the brownfield companion to `sl-toolkit`, which generates a new model instead.

[View Power BI to Semantic Layer Documentation on GitHub](https://github.com/keboola/ai-kit/tree/main/plugins/powerbi-to-sl)

### Data App Developer Plugin

The Data App Developer Plugin is a specialized toolkit for building production-ready Streamlit data apps for Keboola deployment. It features a systematic validate, build, and verify workflow that ensures features work correctly the first time.

**Workflow:**

The plugin enforces a three-phase development workflow. In the **Validate** phase, it checks table schemas and queries sample data using the Keboola MCP Server to verify assumptions before writing code. In the **Build** phase, it implements features following SQL-first architecture patterns that push computation to the database. In the **Verify** phase, it tests the app in a browser and captures screenshots using Playwright MCP to prove everything works.

**Key Features:**

The plugin provides automatic data validation that checks table schemas, verifies column names and data types, and tests SQL filter conditions before embedding them in code. It enforces SQL-first architecture where aggregation happens in the database rather than loading large datasets into Python.

Visual verification with Playwright MCP allows the agent to open the app in a browser, interact with filters and controls, navigate through pages, and capture screenshots as proof that features work correctly.

**Example Usage:**

```
Add a global filter for user type (external vs internal users)
to my Streamlit dashboard. Default to showing external users only.
```

The agent will automatically validate the schema, query distinct values, create filter functions, add UI controls, update all page modules, and verify the filter works in the browser.

[View Data App Developer Plugin Documentation on GitHub](https://github.com/keboola/ai-kit/tree/main/plugins/dataapp-developer)

## Best Practices

When using AI Kit, start with the appropriate plugin for your task. Use the Component Developer Plugin when building new Keboola components or adding features to existing ones, the Data App Developer Plugin when creating or modifying data apps, the kbagent Plugin to drive your projects from the terminal, and the Semantic Layer Toolkit when modelling metrics.

For component development, always follow the two-PR workflow strategy: create a base PR with the cookiecutter-generated structure, then a separate implementation PR with your custom logic. This prevents premature CI/CD triggers.

For data app development, always validate your data assumptions before writing code. The validate-build-verify workflow eliminates debugging cycles by catching issues early.

## Resources

For detailed documentation on each plugin, including complete agent specifications, workflow guides, and code examples, visit the [AI Kit GitHub repository](https://github.com/keboola/ai-kit).

Additional resources:

- [kbagent CLI](/cli/) — the command-line interface for driving Keboola projects, agent-friendly and sandboxable
- [Keboola Developer Documentation](https://developers.keboola.com/)
- [Python Component Library](https://github.com/keboola/python-component)
- [Cookiecutter Python Component Template](https://github.com/keboola/cookiecutter-python-component)
- [Streamlit Documentation](https://docs.streamlit.io)
