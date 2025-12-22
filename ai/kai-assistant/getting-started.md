---
title: Getting Started with Kai
permalink: /ai/kai-assistant/getting-started/
---

* TOC
{:toc}

This guide will help you get started with Kai, Keboola's embedded AI assistant. From requesting access to your first successful interactions, we'll walk you through everything you need to know.

## Access Requirements

Kai is currently in **Private Beta** (as of December 2025) and is controlled by the `agent-chat` feature flag.

### Requesting Access

1. **Contact Keboola Support** to request Private Beta access
2. Your request will be reviewed and approved based on current capacity
3. The feature flag will be enabled for your organization
4. All users in your organization will then have access to Kai

### Supported Regions

Kai is available on the following stacks:
- **US Stacks**: GCP US-East4 (fully deployed)
- **EU Stacks**: GCP Europe-West3 (fully deployed)
- **Azure/AWS**: Deployment in progress

## Finding Kai in Your Project

Once access is enabled, you'll find Kai integrated directly into your Keboola project interface:

1. **Look for the chat icon** in your project navigation
2. **Click to open** the Kai assistant panel
3. **Start typing** your first question or request

## Your First Interactions

### 1. Explore Your Project

Start by getting familiar with your data:

```
"What tables do we have in this project?"
```

```
"Show me the buckets and their contents"
```

```
"List all the transformations in this project"
```

### 2. Examine Data Structure

Understand your data schemas:

```
"Show me the schema for the orders table"
```

```
"What columns are in the customers table and what do they contain?"
```

```
"Describe the data types in the sales_data bucket"
```

### 3. Simple Analysis

Try some basic data analysis:

```
"How many rows are in the orders table?"
```

```
"Show me a sample of data from the customers table"
```

```
"What's the date range of data in the transactions table?"
```

### 4. Get Help with Components

Explore your existing configurations:

```
"What extractors are configured in this project?"
```

```
"Show me the latest job runs and their status"
```

```
"Explain what this transformation does" (when viewing a specific transformation)
```

## Understanding Kai's Responses

### Tool Approval Process

When Kai wants to perform actions that modify your project, you'll see a **Tool Approval** prompt:

- **Review carefully** what Kai wants to do
- **Approve or deny** the action
- **All actions are logged** in your project's audit trail

### Response Types

Kai provides different types of responses:

**Information Responses**: Direct answers to questions about your data or configurations

**Code Suggestions**: SQL queries, Python scripts, or configuration examples

**Action Proposals**: Requests to create, modify, or run components with your approval

**Error Analysis**: Detailed diagnosis of job failures with suggested fixes

## Common First Tasks

### Debugging a Failed Job

If you have a recent job failure:

```
"Analyze the latest failed job and tell me what went wrong"
```

### Creating Your First Component

Try setting up a simple extractor:

```
"Help me create a CSV extractor to import data from a file"
```

### Writing a Simple Transformation

Start with basic data manipulation:

```
"Create a SQL transformation that calculates monthly totals from my sales data"
```

### Generating Documentation

Improve your project documentation:

```
"Generate descriptions for all tables in the customer_data bucket"
```

## Best Practices for New Users

### Start Simple

- Begin with read-only operations (exploring data, viewing configurations)
- Ask for explanations before making changes
- Use development branches for testing

### Be Specific

- Reference exact table names, component IDs, and configuration names
- Provide context about your business logic and data meaning
- Specify the output format you want

### Use Development Branches

Always test changes safely:

```
"Create a development branch called 'kai-testing' for experimenting"
```

### Ask for Explanations

Don't hesitate to ask Kai to explain its suggestions:

```
"Explain this SQL query step by step"
```

```
"Why did you suggest this configuration?"
```

## Rate Limits and Usage

During the Private Beta:

- **100 messages per user per day**
- **Free of charge** while in beta
- **No restrictions** on complexity of requests

## Getting Help

### In-Platform Support

- **Thumbs up/down**: Rate Kai's responses directly in the chat
- **Error messages**: Kai will explain what went wrong and suggest fixes

### External Support

- **Keboola Support**: For access issues or technical problems
- **Documentation**: Refer to [Use Cases](/ai/kai-assistant/use-cases/) and [Best Practices](/ai/kai-assistant/best-practices/)
- **Community**: Join the Slack channel `#feature-kai-in-platform-assistant`

## Troubleshooting Common Issues

### Kai Seems Slow

- Complex operations may take time
- Look for "Processing..." indicators
- Large projects require more analysis time

### Kai Doesn't Understand

- Be more specific with component names and IDs
- Provide more context about your business requirements
- Break complex requests into smaller steps

### Actions Fail

- Check that you have proper permissions
- Verify that referenced components exist
- Ask Kai to "retry the last action"

### Context Gets Confused

- Start a fresh conversation for unrelated topics
- Reference specific component IDs instead of generic names
- Keep conversations focused on one main task

## Next Steps

Once you're comfortable with basic interactions:

1. **Explore Use Cases**: Check out [detailed examples](/ai/kai-assistant/use-cases/) for your specific needs
2. **Learn Best Practices**: Read our [comprehensive guide](/ai/kai-assistant/best-practices/) for advanced techniques
3. **Understand the Technology**: Learn about [technical architecture](/ai/kai-assistant/technical/) and security

## Security and Privacy

- **All actions require approval** before execution
- **Complete audit trail** available to organization administrators
- **PII and secrets are automatically redacted** from logs
- **Regional data processing** respects data residency requirements

Ready to start? Open Kai in your project and try your first question!
