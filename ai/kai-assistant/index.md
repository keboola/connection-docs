---
title: KAI - AI Assistant
permalink: /ai/KAI-assistant/
---

* TOC
{:toc}

KAI is Keboola's embedded AI assistant—a data engineering co-pilot that understands your project inside and out. Unlike ChatGPT or Claude, KAI has direct access to your configurations, schemas, job logs, and data lineage, providing specific, actionable answers instead of generic advice.

## See KAI in Action

Animated video displaying something like this:

- Customer: Why did my flow 'customer-etl' fail this morning?
- KAI: I analyzed job #45678 which failed at 3:42 AM.
-- Error: Column 'email_address' not found in table customers_raw
-- Root cause: The upstream extractor changed its output schema. 
-- The column was renamed to 'email'.
-- Suggested fix: Update transformation 'customer-cleanup' line 23.
- KAI: Should I fix this for you?
- Customer: Yes
- KAI: ✓ Fixed in 30 seconds

## Who Should Use KAI?

**Perfect for:**
- ✅ **Data engineers** building and maintaining data pipelines
- ✅ **Analytics engineers** creating SQL and Python transformations
- ✅ **Project managers** monitoring jobs and debugging issues
- ✅ **New team members** learning Keboola best practices
- ✅ **Anyone working with data** who wants to be more productive

## What You Can Do With KAI

**Analyze & Explore**  
Execute SQL queries, explore schemas, calculate metrics, analyze trends
→ *"Show me total revenue by month from the transactions table"*

**Build & Configure**  
Set up extractors, writers, transformations, and custom components
→ *"Create a Snowflake writer for the customer_summary table"*

**Debug & Fix**  
Diagnose failures, resolve errors, fix bugs, investigate data issues
→ *"Why did flow 'daily-etl' fail last night?"*

**Document & Model**  
Generate documentation, describe tables, design data models
→ *"Document what transformation 'revenue-calc' does"*

[See detailed examples for each capability →](use-cases/)

## How KAI Differs from Other AI Tools

| Feature | ChatGPT / Claude | KAI |
|---------|------------------|-----|
| **Context** | No access to your project | Full access to configs, schemas, job logs |
| **Actions** | Can only suggest code | Creates, modifies, and runs components |
| **Authentication** | Manual setup required | Already authenticated in platform |
| **Knowledge** | Generic data advice | Deep Keboola expertise built-in |
| **Debugging** | Guesses based on syntax | Reads actual logs and error messages |

### Why This Matters

**With ChatGPT or Claude:**
- You: "My transformation failed"  
- AI: "Check for SQL syntax errors or schema mismatches"
- You: *[30 minutes of reading logs and manual debugging]*

**With KAI:**
- You: "Why did transformation 'customer-cleanup' fail?"
- KAI: *[Reads logs]* "Line 23: Column 'email_address' not found. Schema changed. Should I fix it?"
- You: "Yes"
- KAI: *[Fixed in 30 seconds]*

## KAI vs. MCP Server

While KAI and the [MCP Server](/ai/mcp-server/) share underlying technology, they serve different use cases:

| Feature | KAI (In-Platform) | MCP Server (External) |
|---------|-------------------|----------------------|
| **Installation** | None required | Requires setup with external tools |
| **Best for** | Browser-based workflows, team collaboration | Local development, IDE integration |
| **Authentication** | Automatic | Manual OAuth setup |
| **Audit Trail** | Complete organizational visibility | Local only |
| **Context** | Deep platform awareness | Tool-dependent |

Many users leverage both tools depending on their specific needs and workflow preferences.


## Getting Started

KAI is currently in **Private Beta** and requires approval for access. Contact [support@keboola.com](mailto:support@keboola.com) if you'd like to use KAI in your project.

[Get Started with KAI →](/ai/KAI-assistant/getting-started/)


## Learn More

- [Use Cases & Examples](/ai/KAI-assistant/use-cases/) - Detailed examples and practical applications
- [Best Practices](/ai/KAI-assistant/best-practices/) - Tips for effective prompting and workflows  


## Support

## Support

- **In-Chat Feedback**: Use thumbs up/down buttons directly in the interface
- **Keboola Support**: Contact support for access requests or technical issues
- **Community**: Join discussions in Slack channel `#feature-KAI-in-platform-assistant`
