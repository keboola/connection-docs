---
title: AI Kit
permalink: /ai/ai-kit/
---

* TOC
{:toc}

AI Kit is a plugin marketplace for AI coding assistants that provides specialized agents, commands, and workflows for Keboola development. It helps developers build Keboola components, data apps, and maintain code quality using AI-powered tools.

## Overview

AI Kit is designed for developers who use AI coding assistants like Claude Code to work with Keboola projects. It provides three specialized plugins that cover different aspects of Keboola development, from general code quality to building production-ready components and data applications.

The toolkit includes specialized AI agents that understand Keboola's architecture, best practices, and development patterns. These agents can help you create new components from scratch, implement configuration schemas, build Streamlit data apps, review code for security issues, and automate common development workflows.

## Installation

To install AI Kit, run the following command in your AI coding assistant:

```bash
/plugin marketplace add keboola/ai-kit
```

After installation, enable the plugins you need:

```bash
/plugin install developer
/plugin install component-developer
/plugin install dataapp-developer
```

## Available Plugins

### Developer Plugin

The Developer Plugin provides a comprehensive toolkit for code quality, security analysis, and workflow automation. It includes four specialized agents and a PR creation command.

**Agents:**

The **Code Reviewer** (`@code-reviewer`) is an expert code reviewer that checks for bugs, logic errors, security vulnerabilities, and project guidelines compliance. It uses confidence-based filtering to report only high-priority issues.

The **Security Agent** (`@code-security`) performs cross-language security analysis for Python, Go, PHP, JavaScript, and other languages. It integrates with automated security scanners and identifies CWE/CVE vulnerabilities with actionable fixes.

The **Code Mess Detector** (`@code-mess-detector`) analyzes code written during rapid prototyping for common quality issues like inconsistent naming, missing error handling, code duplication, and dead code. It generates detailed reports for systematic cleanup.

The **Code Mess Fixer** (`@code-mess-fixer`) systematically applies fixes based on Code Mess Detector reports, working through issues by priority and tracking progress.

**Commands:**

The `/create-pr` command analyzes your changes and creates a pull request with an AI-generated title and description, following conventional commit format.

**Integrations:**

The plugin includes Linear MCP integration for issue tracking and project management, and auto-installs team-wide permission settings for safe git operations.

[View Developer Plugin Documentation on GitHub](https://github.com/keboola/ai-kit/tree/main/plugins/developer)

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

When using AI Kit, start with the appropriate plugin for your task. Use the Developer Plugin for general code quality and security reviews, the Component Developer Plugin when building new Keboola components or adding features to existing ones, and the Data App Developer Plugin when creating or modifying Streamlit data apps.

For component development, always follow the two-PR workflow strategy: create a base PR with the cookiecutter-generated structure, then a separate implementation PR with your custom logic. This prevents premature CI/CD triggers.

For data app development, always validate your data assumptions before writing code. The validate-build-verify workflow eliminates debugging cycles by catching issues early.

## Resources

For detailed documentation on each plugin, including complete agent specifications, workflow guides, and code examples, visit the [AI Kit GitHub repository](https://github.com/keboola/ai-kit).

Additional resources:

- [Keboola Developer Documentation](https://developers.keboola.com/)
- [Python Component Library](https://github.com/keboola/python-component)
- [Cookiecutter Python Component Template](https://github.com/keboola/cookiecutter-python-component)
- [Streamlit Documentation](https://docs.streamlit.io)
