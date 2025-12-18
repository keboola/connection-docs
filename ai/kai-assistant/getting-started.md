---
title: Getting Started with Kai
permalink: /ai/kai-assistant/getting-started/
---

* TOC
{:toc}

This guide will help you get started with Kai, Keboola's embedded AI assistant. From requesting access to your first successful interactions, we'll walk you through everything you need to know.

## Access Requirements

Kai is currently in **Private Beta** and is controlled by the `agent-chat` feature flag.

### Requesting Access

1. Contact [Keboola Support](mailto:support@keboola.com) to request Private Beta access
2. Your request will be reviewed based on current capacity
3. The feature flag will be enabled for your organization
4. All users in your organization will then have access to Kai

### Supported Regions

**Fully Available:**
- ✅ GCP US-East4 (US Stack)
- ✅ GCP Europe-West3 (EU Stack)

**Coming Soon:**
- 🚧 Azure/AWS stacks (deployment in progress)

---

## Finding Kai in Your Project

Once access is enabled, Kai appears directly in your Keboola project interface:

1. Look for the **chat icon** (💬) in your project navigation
2. Click to open the Kai assistant panel
3. Start typing your first question or request

---

## Your First Interactions

Start with these examples to see what Kai can do. Copy and paste them directly into the chat:

### Explore Your Project

Get familiar with your data and configurations:
```
"What tables do we have in this project?"
```

**What to expect:** Kai will list all buckets and tables with row counts and last update times.
```
"Show me all the transformations in this project"
```

**What to expect:** A list of transformations with their names, types (SQL/Python), and descriptions.

---

### Examine Data Structure

Understand your table schemas:
```
"Show me the schema for the orders table"
```

**What to expect:** Column names, data types, and any primary keys or nullable fields.
```
"What columns are in the customers table and what do they contain?"
```

**What to expect:** Not just column names, but also sample values to understand the data.

---

### Analyze Your Data

Try some basic analysis:
```
"How many rows are in the orders table?"
```

**What to expect:** Exact row count, plus when the table was last updated.
```
"What's the date range of data in the transactions table?"
```

**What to expect:** MIN and MAX dates, helping you understand data freshness.

---

### Get Help with Components

Explore existing configurations:
```
"What extractors are configured in this project?"
```

**What to expect:** List of all data sources (Shopify, Google Sheets, APIs, etc.) with their status.
```
"Show me the latest job runs and their status"
```

**What to expect:** Recent jobs with success/failure status and runtime duration.

---

## Understanding Kai's Responses

Now that you've tried some prompts, here's what to expect from Kai:

### Tool Approval Process

When Kai wants to perform actions that **modify** your project, you'll see a **Tool Approval** prompt:

- ⚠️ **Review carefully** what Kai wants to do
- ✅ **Approve** to proceed with the action
- ❌ **Deny** if you're not comfortable
- 📝 All actions are logged in your project's audit trail

**Example:** If you ask Kai to "Create a Snowflake writer," it will show you the exact configuration before creating anything.

---

### Response Types

Kai provides different types of responses:

**Information Responses**  
Direct answers to questions about your data or configurations.  
*Example: "The orders table has 45,382 rows and was last updated 2 hours ago"*

**Code Suggestions**  
SQL queries, Python scripts, or configuration examples you can use.  
*Example: SQL query to calculate monthly revenue*

**Action Proposals**  
Requests to create, modify, or run components (requires your approval).  
*Example: "Should I create this transformation for you?"*

**Error Analysis**  
Detailed diagnosis of job failures with suggested fixes.  
*Example: "Job failed because column 'email_address' was renamed to 'email'"*

---

## How Kai Works

Understanding Kai's capabilities helps you work with it more effectively:

### What Kai Knows

Kai has direct access to:
- All tables, buckets, and their schemas in your project
- All component configurations (extractors, transformations, writers)
- Job execution history and logs
- Data lineage and dependencies
- Your project's metadata and documentation

### What Kai Can Do

**Read-only operations** (instant, no approval needed):
- Query your data using SQL
- Examine configurations and schemas
- Analyze job logs and errors
- Explain how components work

**Modifying operations** (require your approval):
- Create new components (extractors, transformations, writers)
- Update existing configurations
- Run jobs and transformations
- Generate and update documentation

### Response Times

- **Simple queries:** 2-5 seconds
- **Complex analysis:** 10-30 seconds
- **Creating components:** 15-45 seconds

If Kai takes longer, it's likely analyzing large datasets or complex configurations.

---

## Working Effectively with Kai

### Start Simple

Begin with **read-only operations** to build familiarity:
- Explore your data and configurations
- Ask questions about how things work
- Request explanations before making changes

### Be Specific

**✅ Good examples:**
- "Show me the schema for the customers table in bucket in.c-main"
- "Analyze why job #45678 failed yesterday"
- "List all transformations that use the orders table"

**❌ Too vague:**
- "Show me customer data"
- "Something went wrong"
- "Check my transformations"

### Use Development Branches

Test changes safely before affecting production:
```
"Create a development branch called 'kai-testing'"
```

Work in this branch when experimenting with Kai's suggestions.

### Ask for Explanations

Kai can explain its reasoning:
```
"Explain this SQL query step by step"
"Why did you suggest this configuration?"
"What would happen if I approve this change?"
```

---

## Rate Limits and Usage

During Private Beta:

- **100 messages per user per day**
- **Resets:** Daily at midnight UTC
- **What counts:** Each question or request you send (not Kai's responses)
- **Free of charge** while in beta
- **No restrictions** on complexity of requests

**What happens at the limit:**  
You'll see a message: *"You've reached your daily message limit. Your limit will reset at midnight UTC."*

**Pro tip:** Be specific in your initial requests to minimize back-and-forth exchanges.

---

## Getting Help

### In-Platform Support
- **👍 👎 Feedback:** Rate Kai's responses directly in the chat
- **Error Explanations:** Kai automatically explains what went wrong

### External Support
- **Keboola Support:** [support@keboola.com](mailto:support@keboola.com) for access or technical issues
- **Documentation:** Browse guides throughout this documentation
- **Community:** Join `#feature-kai-in-platform-assistant` on Slack (access provided with beta approval)

---

## Next Steps

Now that you understand how to interact with Kai:

**Learn by Example:**
- **[Use Cases →](/ai/kai-assistant/use-cases/)** - Detailed workflows for common tasks like debugging, building pipelines, and writing transformations

**Master Advanced Techniques:**
- **[Best Practices →](/ai/kai-assistant/best-practices/)** - Prompting patterns and advanced workflows

**Reference Information:**
- **[Troubleshooting →](/ai/kai-assistant/troubleshooting/)** - Solutions to common problems
- **[Security & Privacy →](/ai/kai-assistant/security-and-privacy/)** - Data handling and compliance

---

**Ready to start?** Open Kai in your project and try your first question!
