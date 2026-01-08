---
title: Kai - AI Assistant
permalink: /ai/kai-assistant/
---

* TOC
{:toc}

Kai is Keboola's embedded AI assistant that serves as a comprehensive data engineering co-pilot within the Keboola platform. Unlike generic AI tools, Kai is deeply context-aware of your specific Keboola project, understanding your transformations, flows, table schemas, and jobs to provide intelligent, actionable assistance.

## What is Kai?

Kai functions as a full-featured "Data Engineer" agent that can both explore and modify your Keboola projects through natural conversation. The assistant is embedded directly within the Keboola platform. 

### Key Capabilities

Kai excels at a wide range of data engineering tasks:

**Data Analytics & Exploration**
- Execute SQL queries against your Snowflake/BigQuery databases
- Explore table schemas and data structures
- Calculate metrics, KPIs, and statistical analyses
- Create reports and dashboards with Data Apps
- Analyze trends and identify anomalies

**Integration Setup**
- Configure data extractors (Shopify, Google Sheets, APIs, CSV)
- Set up data destinations
- Create custom Python components for specialized integrations
- Manage API tokens and authentication
- Add packages to transformation environments

**Coding & Development**
- Write SQL transformations
- Create Python transformations
- Convert between Python and SQL
- Optimize queries and transformation logic
- Build custom data processing components

**Troubleshooting**
- Debug job failures with automated diagnosis
- Resolve configuration errors
- Fix transformation bugs
- Investigate data quality issues
- Handle API token and authentication issues

**Documentation**
- Generate comprehensive project documentation
- Update table and column descriptions
- Document transformations and data flows
- Create project overviews for new team members

**Data Modeling**
- Build complex analytical frameworks
- Create hierarchical data structures
- Design dimensional models
- Advanced clustering and taxonomy creation

## How Kai Differs from Other AI Tools

### Context Awareness
Unlike ChatGPT or Claude, Kai has direct access to your Keboola project. When you ask about an error, it doesn't guess based on syntax—it reads the actual job logs, configurations, and data structures to provide specific, actionable solutions.

### Embedded Experience
Kai is built into the Keboola platform with no installation required. It's already authenticated and understands your current location within the platform, making it seamless to use.

### Data Engineering Focus
Kai is specifically designed for data engineering workflows, with deep knowledge of Keboola components, transformations, and best practices.

## Kai vs. MCP Server

While Kai and the [MCP Server](/ai/mcp-server/) share underlying technology, they serve different use cases:

| Feature | Kai (In-Platform) | MCP Server (External) |
|---------|-------------------|----------------------|
| **Installation** | None required | Requires setup with external tools |
| **Best for** | Browser-based workflows, team collaboration | Local development, IDE integration |
| **Authentication** | Automatic | Manual OAuth setup |
| **Audit Trail** | Complete organizational visibility | Local only |
| **Context** | Deep platform awareness | Tool-dependent |

Many users leverage both tools depending on their specific needs and workflow preferences.

## Getting Started

Kai is currently in **Private Beta** and requires approval for access.

[Get Started with Kai →](/ai/kai-assistant/getting-started/)

## Learn More

- [Use Cases & Examples](/ai/kai-assistant/use-cases/) - Detailed examples and practical applications
- [Best Practices](/ai/kai-assistant/best-practices/) - Tips for effective prompting and workflows  
- [Technical Details](/ai/kai-assistant/technical/) - Architecture, security, and deployment information

## Support

- **In-Chat Feedback**: Use thumbs up/down buttons directly in the interface
- **Keboola Support**: Contact support for access requests or technical issues
