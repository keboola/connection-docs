---
title: Kai Best Practices
permalink: /ai/kai-assistant/best-practices/
---

* TOC
{:toc}

This guide helps you leverage Kai as a high-impact team member. Learn how to communicate effectively, structure your workflows, and get the most value from your AI assistant.

## Understanding How Kai Works

Before diving into best practices, it's important to understand what makes Kai different from generic AI tools.

### Context Awareness
Kai can "see" your Keboola project—table schemas, transformation logic, job logs, and component configurations. When you ask about an error, it doesn't guess based on syntax; it reads the actual state of your project and proposes fixes based on what's actually there.

### Agent Behavior
Kai is an agent, not just a chatbot. For complex requests, it executes multi-step reasoning: configuring extractors, writing transformations, and setting up writers—asking for your approval at key stages.

### Approval-Based Actions
Every action that changes your project requires explicit consent. You'll see exactly what Kai wants to do before it executes.

## Effective Prompting Strategies

### Lead with Business Context

Kai knows your schema but not your business rules. The most successful interactions include domain context.

| Weak Prompt | Strong Prompt |
|-------------|---------------|
| "Calculate Q3 revenue." | "Calculate Q3 revenue from `orders`. Revenue = `total_amount` for orders where `status = 'completed'`, excluding VAT (stored in `tax_amount`)." |
| "Show me customer churn." | "Calculate monthly churn rate from `subscriptions`. A churned customer is one whose `end_date` is not null and `churn_reason` is not 'upgrade'." |

**Pro tip:** Have Kai update your table and column metadata with business definitions. Future queries will benefit from this context automatically.

### Plan Before You Build

For complex tasks—pipeline construction, data modeling, multi-step transformations—ask Kai to outline its approach first. Planning upfront catches architectural errors early.

**Example:**
```
"I need to build a customer lifetime value model using data from Shopify and our CRM. 
First, outline which tables you'll use, how you'll join them, and what the output 
schema will look like. Don't execute anything yet."
```

### Iterate Like You Would with a Junior Engineer

Don't expect production-ready code on the first turn. The most effective conversations follow a pattern:

1. **Request**: Ask for the initial approach
2. **Review**: Examine the output
3. **Refine**: "Good start. Now optimize the join to avoid fan-out on `users`, add error handling for null values, and include comments explaining the business logic."

### Be Specific About What You Want

Reference component IDs, table names, and configuration names directly. Vague requests produce vague results.

| Vague | Specific |
|-------|----------|
| "Fix the extractor" | "Analyze the latest job failure for config `keboola.ex-shopify` (ID: 12345) and identify why the `refunds` endpoint is timing out." |
| "Document this" | "Generate documentation for the `tr-customer-metrics` transformation. Target audience: new team members who need to understand the business logic, not just the SQL syntax." |

## Task-Specific Guidance

### Data Analytics & Exploration

Analytics represents the most common use of Kai. These queries work best when you:

- **Specify the output format**: "Return results as a table with columns for month, revenue, and year-over-year change."
- **Set boundaries**: "Analyze the last 12 months only" prevents runaway queries.
- **Verify the source**: Before trusting results, ask: "Which tables are you querying and how are you joining them?"

**Example workflow:**
1. "What tables do we have related to customer orders?"
2. "Show me the schema for `orders` and `customers`."
3. "Calculate average order value by customer segment for Q3, excluding test accounts (where `email` contains 'test')."

### Integration Setup & Configuration

Integration tasks are the second most common use case. Tips:

- **Start with what exists**: "List all configured extractors in this project" before creating new ones.
- **Be explicit about auth**: "Configure the Shopify extractor using API key authentication. I'll provide the credentials when you're ready."
- **Request common packages**: "Add the pandas package to the Python transformation environment."

### SQL & Python Transformations

Coding tasks work best with:

- **Dialect awareness**: Kai automatically adjusts for Snowflake vs. BigQuery, but specifying your backend ("We're on Snowflake") eliminates ambiguity.
- **Incremental builds**: For complex transformations, build in stages: "First, create the staging table. Then we'll add the business logic."
- **Conversion requests**: "Convert this Python transformation to SQL" is a common, well-handled task.

### Troubleshooting Failed Jobs

Error debugging works best when you point Kai to specifics:

```
"Job 789012 failed. Read the event log, identify the root cause, 
and check if the transformation configuration has a syntax error 
or schema mismatch causing this."
```

Kai will read the actual log (more efficient than pasting thousands of lines) and trace the error to its source.

### Documentation Generation

Kai excels at documentation, but audience matters:

- **For business users**: "Describe the `monthly_kpis` table focusing on what each metric means for marketing, not the SQL types."
- **For engineers**: "Document this transformation including input/output schemas, logic summary, dependencies, and any edge cases handled."

### Data Apps & Dashboards

Creating Streamlit dashboards tends to be high-complexity work. Break it down:

1. "I want a sales dashboard. What data would you need?"
2. "Create the data query that powers the dashboard—monthly revenue by product category, filterable by region."
3. "Now build the Streamlit app with a date picker and bar chart visualization."

## Development Workflow Best Practices

### The Dev Branch Workflow

Kai has write access to your project. Use development branches to test changes safely.

**Step 1: Isolate**
```
"Create a development branch named 'kai-shopify-refunds-update'."
```

**Step 2: Build & Test**
```
"In this dev branch, modify the Shopify extractor to include the 'refunds' endpoint."
```

Run the job in the dev branch. Verify the data looks correct.

**Step 3: Review & Merge**

Before merging to production:
- Check for hardcoded values that should be variables
- Verify naming conventions match your project standards
- Confirm the logic handles edge cases

Only merge once you're satisfied with the results.

### Managing Context & Performance

Kai has a context window. Long conversations (50+ messages with complex operations) can degrade performance.

#### One Topic, One Chat

Don't mix unrelated tasks in a single thread. Debugging a Python transformation and analyzing sales trends should be separate conversations.

#### Know When to Reset

If Kai starts circling around an error or getting confused:

1. Copy any useful code it generated
2. Start a fresh chat
3. Provide focused context: "I'm working on [specific task]. Here's the current code: [paste]. Help me fix this specific error: [error message]."

#### Let Kai Read Logs Directly

Instead of pasting massive error logs, ask Kai to read them:

```
"Read the latest job log for `ex-google-analytics` and identify the error."
```

This uses Kai's tools to access logs directly—far more efficient than pasting text.

#### For Very Complex Projects

The most sophisticated conversations can span 15-20 turns and use 10+ tools. For these:

- Break work into discrete phases
- Confirm completion of each phase before proceeding
- Consider creating a brief "project brief" document that Kai can reference

## Security & Governance Best Practices

### Safe Secrets Management

**Do:**
- Use: "I'll provide the API key when you prompt me for configuration"
- Let Kai handle secrets securely through the configuration interface

**Don't:**
- Paste credentials in plain text in chat messages

### Tool Approval Process

**Always:**
- Read what Kai wants to do before confirming
- The tool approval prompt shows exactly what will change
- Use development branches for testing changes

**Never:**
- Blindly approve actions without understanding them
- Skip the approval step for "simple" changes

### Audit and Compliance

**Remember:**
- All actions are logged in a complete audit trail
- Organization administrators can see all agent actions
- Use this transparency to democratize knowledge while maintaining oversight

## What to Avoid

### Don't Assume Cross-Project Knowledge
Kai sees your current project. It doesn't know about data in other Keboola projects or external warehouses not connected to your flows.

### Don't Argue with a Confused Kai
If it's not understanding after 2-3 clarifications, reset the conversation with clearer context.

### Don't Skip Verification
Always verify Kai's suggestions, especially for:
- Business logic implementation
- Data quality rules
- Security configurations
- Production deployments

## Advanced Techniques

### Prompt Chaining for Complex Tasks

Break large requests into a sequence:

1. "Analyze our customer data structure and identify key metrics we should track"
2. "Based on that analysis, design a customer health score calculation"
3. "Now implement that as a SQL transformation"
4. "Create a dashboard to visualize the health scores"

### Using Kai for Learning

Leverage Kai's explanatory capabilities:

```
"Explain this SQL query step by step and suggest any optimizations"
```

```
"What are the best practices for this type of transformation in Keboola?"
```

### Collaborative Documentation

Use Kai to maintain living documentation:

```
"Update the project README to reflect the new customer segmentation logic we just implemented"
```

## Team Collaboration

### Sharing Kai Insights

- **Document key solutions**: Save important code snippets and configurations Kai generates
- **Share successful prompts**: Help teammates learn effective communication patterns
- **Maintain context**: Keep project documentation updated so Kai has better context for everyone

### Training New Team Members

Use Kai to help onboard new team members:

```
"Give a new data engineer an overview of this project's architecture and key components"
```

## Measuring Success

### Track Your Efficiency Gains

- **Time to solution**: How quickly can you resolve issues with Kai's help?
- **Code quality**: Are Kai's suggestions improving your implementations?
- **Learning velocity**: How much faster are you picking up new Keboola features?

### Continuous Improvement

- **Use feedback buttons**: Rate Kai's responses to help improve the system
- **Share challenging cases**: Help the development team understand edge cases
- **Suggest improvements**: Your usage patterns help shape future capabilities

## Getting Help

When you need assistance with Kai itself:

- **In-chat feedback**: Use thumbs up/down buttons for immediate feedback
- **Keboola Support**: For access issues or technical problems
- **Community**: Join discussions in `#feature-kai-in-platform-assistant`
- **Documentation**: Refer back to [Use Cases](/ai/kai-assistant/use-cases/) for specific examples

Remember: Kai is designed to be your data engineering partner. The more context you provide and the clearer you communicate, the more valuable it becomes to your workflow.
