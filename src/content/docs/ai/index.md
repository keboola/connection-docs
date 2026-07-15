---
title: AI Features
slug: 'ai'
---



Keboola's AI-powered capabilities help you build, optimize, and automate your data pipelines with intelligent assistance. From automated flow creation to smart component recommendations, our AI features are designed to accelerate your data operations and reduce manual effort.

Keboola integrates artificial intelligence throughout the platform to enhance productivity, simplify complex tasks, and provide intelligent insights. Whether you're a beginner looking to create your first data pipeline or an experienced data engineer optimizing existing workflows, our AI features adapt to your needs and skill level. Following AI features are currently available on Keboola platform:

### Kai - AI Assistant

Keboola's embedded AI assistant that serves as a comprehensive data engineering co-pilot within the platform. Kai is context-aware of your specific project and can both explore and modify your Keboola environment through natural conversation.
[Learn more about Kai →](/kai/)

A [Python client library](https://github.com/keboola/kai-client) is also available for programmatic access to the Kai API, enabling scripting, automation, and integration into custom workflows.
[Learn more about the Python Client →](/kai/python-client/)

### AI Kit

A plugin marketplace for AI coding assistants that provides specialized agents, commands, and workflows for Keboola development. It includes plugins for code quality and security analysis, building Keboola Python components, and creating Streamlit data apps.
[Learn more about AI Kit →](/ai/ai-kit/)

### MCP Server

Model Context Protocol server integration for seamless communication between AI agents and your data infrastructure on Keboola.
[Learn more about MCP Server →](/ai/mcp-server/)

### Machine-Readable API Index

Every Keboola stack publishes a machine-readable index of its APIs at `https://api.<stack>/apis.json` (for example, [`https://api.keboola.com/apis.json`](https://api.keboola.com/apis.json)). The index lists each service with its base `apiUrl` and a link to its OpenAPI specification (`openApiSpecUrl`) — a convenient overview for agentic usage: AI agents, MCP servers, and other tooling that discovers Keboola's APIs programmatically.
[View the API index →](https://api.keboola.com/apis.json)

### AI Component Suggestions

Allows users to get AI suggestions when searching for a component. To activate the feature, go to Project Settings → Features → AI Component Suggestions.

### AI Rules

The AI Rules section allows users to define specific instructions for AI functionality within Keboola platform.
[Learn more about AI Rules →](/management/project/ai-rules/#main-header)

### AI-Generated Descriptions
Automatically generates a description using AI.
[Learn more about AI-Generated Descriptions →](/overview/#ai-assistance)

### Explaining Errors

AI-powered explanations for job failures that help you understand and resolve errors more quickly.
[Learn more about Explaining Errors →](/overview/#ai-assistance)
