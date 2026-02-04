---
title: Kai Best Practices
permalink: /kai/best-practices/
---

* TOC
{:toc}

## Effective Prompting

### Provide Business Context

Kai knows your schema but not your business rules. Include domain context for better results.

| Weak | Strong |
|------|--------|
| "Calculate Q3 revenue" | "Calculate Q3 revenue from `orders` where `status = 'completed'`, excluding VAT in `tax_amount`" |
| "Show customer churn" | "Calculate monthly churn from `subscriptions` where `end_date` is not null and `churn_reason` != 'upgrade'" |

**Pro tip:** Have Kai update your table metadata with business definitions—future queries benefit automatically.

### Plan Before Building

For complex tasks, ask Kai to outline its approach first:

```
"I need to build a customer lifetime value model. First outline which tables you'll use and how you'll join them. Don't execute anything yet."
```

### Iterate

Don't expect production-ready code on the first try:
1. Request initial approach
2. Review output
3. Refine: "Now optimize the join, add null handling, and include comments"

### Be Specific

| Vague | Specific |
|-------|----------|
| "Fix the extractor" | "Analyze job failure for config `keboola.ex-shopify` (ID: 12345)—why is the refunds endpoint timing out?" |
| "Document this" | "Document transformation `tr-customer-metrics` for new team members, focusing on business logic" |

## Development Workflow

### Use Dev Branches

Test changes safely by creating a development branch in the Keboola UI, then working with Kai in that branch. Review changes before merging to production.

### Manage Context

- **One topic per chat** — don't mix unrelated tasks
- **Reset when stuck** — if Kai gets confused after 2-3 tries, start fresh with clearer context
- **Let Kai read logs** — instead of pasting, use `"Read the latest job log for ex-google-analytics"`

## Security

**Do:**
- Let Kai handle credentials through secure configuration forms—never type secrets directly in chat
- Say "I'll provide the API key when you prompt me" and Kai will use the secure configuration interface
- Review every tool approval before confirming
- Use dev branches for testing

**Don't:**
- Paste credentials, API keys, or passwords in plain text chat messages
- Blindly approve actions
- Assume Kai knows about other projects (it only sees your current project)

## What to Avoid

- **Don't argue with a confused Kai** — reset the conversation instead
- **Don't skip verification** — always review business logic, data quality rules, and production deployments
- **Don't expect cross-project knowledge** — Kai only sees your current project

## Team Tips

- Save and share successful prompts with teammates
- Use Kai to onboard new team members: `"Give a new engineer an overview of this project's architecture"`
- Keep project documentation updated so Kai has better context for everyone
- Use thumbs up/down buttons to provide feedback
