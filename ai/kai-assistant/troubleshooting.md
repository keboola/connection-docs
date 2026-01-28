---
title: Troubleshooting Kai
permalink: /ai/kai-assistant/troubleshooting/
---

* TOC
{:toc}

This page helps you resolve common issues when working with Kai. Use the table of contents to jump to your specific problem.

---

## Kai Doesn't Respond or Seems Stuck

### Symptom
- Kai shows "Processing..." for more than 60 seconds
- Chat interface becomes unresponsive
- No response appears after sending a message

### Solutions

**1. Check for complex operations**
- Large data queries (>1M rows) can take 30-60 seconds
- Creating multiple components simultaneously takes time
- Look for progress indicators in the chat

**2. Refresh the page**
- If Kai is stuck for >2 minutes, refresh your browser
- Your conversation history is preserved
- Resume from your last message

**3. Simplify your request**
- Break complex requests into smaller steps
- Instead of: "Build a complete pipeline from Shopify to Snowflake"
- Try: "First, help me configure the Shopify extractor"

**4. Check your network connection**
- Kai requires a stable internet connection
- If on VPN, verify it's not blocking websocket connections

---

## Kai Says "I Don't Have Access" or "Cannot Find"

### Symptom
- "I don't have access to that table"
- "I cannot find component [name]"
- "That bucket doesn't exist in this project"

### Solutions

**1. Verify you're in the correct project**
- Check the project name in the top navigation
- Kai only sees the current project you're in

**2. Use exact names and IDs**
- ❌ Vague: "the customer table"
- ✅ Specific: "table in.c-main.customers"
- Get exact IDs: "What tables do we have in bucket in.c-main?"

**3. Check component status**
- Component might be disabled
- Ask: "List all extractors in this project and show their status"

**4. Verify permissions**
- You need read permissions to query data
- You need write permissions for Kai to create/modify components
- Contact your project administrator if permission denied

---

## Kai's Response Doesn't Match My Data

### Symptom
- Query results seem incorrect
- Row counts don't match expectations
- Data appears outdated

### Solutions

**1. Check data freshness**
```
"When was table in.c-main.orders last updated?"
```
Tables might not have recent data if extractors haven't run.

**2. Verify the query logic**
```
"Show me the exact SQL query you used to calculate this"
```
Review filters, joins, and date ranges in Kai's query.

**3. Check for test/development data**
```
"Are you querying production tables or development tables?"
```

**4. Specify exclusions explicitly**
- If results include test data: "Exclude rows where email contains 'test'"
- If results include refunds: "Exclude refunds from revenue calculation"

---

## Actions Fail After Approval

### Symptom
- You approve an action
- Kai shows an error: "Failed to create component" or "Configuration invalid"
- Changes don't appear in your project

### Solutions

**1. Check error details**
- Kai usually explains what went wrong
- Read the full error message before retrying

**2. Common causes:**

**Missing required fields:**
```
Error: "API token required"
Solution: Provide credentials when Kai prompts for them
```

**Invalid configuration:**
```
Error: "Invalid SQL syntax"
Solution: Ask Kai to "validate the SQL before creating the transformation"
```

**Permission denied:**
```
Error: "Insufficient permissions"
Solution: Verify you have write access to the project
```

**Resource already exists:**
```
Error: "Component name already exists"
Solution: Use a different name or ask Kai to update the existing component
```

**3. Retry with corrections**
```
"Try again, but use configuration name 'shopify-extractor-v2' instead"
```

**4. Use development branch**
- Test complex changes in dev branch first
- Merge to production once verified

---

## Kai Keeps Asking the Same Questions

### Symptom
- Kai repeatedly asks for information you already provided
- Conversation goes in circles
- Kai doesn't remember context from earlier in the conversation

### Solutions

**1. Consolidate information in one message**
- Instead of: Multiple short messages with partial information
- Try: One comprehensive message with all details upfront

**Example:**
```
"Create a Snowflake writer with these details:
- Target database: ANALYTICS
- Target schema: SALES
- Tables: orders, customers
- Load mode: Incremental (merge on id)
- I'll provide credentials when prompted"
```

**2. Check conversation length**
- Very long conversations (50+ messages) can lose context
- Start a fresh conversation and provide complete context

**3. Reference earlier messages**
```
"Use the same credentials I provided earlier in this conversation"
```

**4. Save context in project documentation**
- Document common configurations
- Kai can reference project documentation automatically

---

## Context Gets Confused or Irrelevant

### Symptom
- Kai references the wrong table or component
- Responses seem off-topic
- Kai mixes up information from different parts of the conversation

### Solutions

**1. One topic per conversation**
- ❌ Don't mix: Debugging + creating new components + data analysis
- ✅ Separate chats for unrelated tasks

**2. Start fresh when switching contexts**
- Click "New chat" in the interface
- Provide focused context for the new topic

**3. Be explicit about what you're working on**
```
"I'm working on transformation 'customer-metrics' (ID: 12345).
Ignore other transformations for now."
```

**4. Reset when confused**
- If Kai is clearly confused after 2-3 clarifications, start over
- Copy any useful code/configs it generated
- Start new chat with clearer, more specific context

---

## Rate Limit Reached

### Symptom
- "You've reached your daily message limit"
- Cannot send new messages
- Counter shows 100/100 messages used

### Solutions

**1. Understand what counts**
- Each message YOU send counts toward the limit
- Kai's responses don't count
- Complex requests that require multiple tool calls still count as one message

**2. Check reset time**
- Limit resets daily at midnight UTC
- Calculate your local time: [Use timezone converter]

**3. Optimize message usage**
- Be specific in your initial request to avoid back-and-forth
- Plan your work: tackle high-priority tasks first
- Use [Best Practices](/ai/kai-assistant/best-practices/) for efficient prompting

**4. During Private Beta**
- Current limit: 100 messages/user/day
- Contact [support@keboola.com](mailto:support@keboola.com) if this is blocking critical work
- Limits may change at General Availability

---

## SQL or Code Errors After Kai Creates Component

### Symptom
- Component created successfully
- Job fails when you run it
- Error: SQL syntax error, runtime error, or data type mismatch

### Solutions

**1. Ask Kai to debug**
```
"Job [ID] failed after you created it. Read the logs and fix the issue."
```
Kai can analyze its own code and correct errors.

**2. Common issues:**

**Schema mismatches:**
- Kai used a column that doesn't exist
- Solution: "Check the actual schema and update the query"

**Dialect-specific syntax:**
- Code written for Snowflake but you're on BigQuery
- Solution: "We're on BigQuery - adjust the SQL dialect"

**Missing edge case handling:**
- Null values, division by zero, empty strings
- Solution: "Add error handling for null values in revenue column"

**3. Test incrementally**
```
"Run just the first part of the transformation to verify it works"
```

**4. Review before running**
- Always review generated SQL/Python before first run
- Check for hardcoded values that should be parameters
- Verify business logic matches requirements

---

## Kai Doesn't Understand My Request

### Symptom
- Kai asks clarifying questions that seem obvious
- Response is completely off-topic
- Kai says "I'm not sure what you mean"

### Solutions

**1. Be more specific**
- ❌ Vague: "Check my transformations"
- ✅ Specific: "Analyze why transformation 'customer-metrics' (ID: 12345) is running slowly"

**2. Provide examples**
```
"Create a transformation like 'revenue-calc' but for customer segments instead"
```

**3. Break into smaller steps**
- Instead of: "Build a complete customer analytics pipeline"
- Try: "First, list what tables we have related to customers"

**4. Use Keboola terminology**
- Kai understands: "extractor", "writer", "transformation", "flow", "bucket", "component"
- Avoid generic terms: "connector", "job", "script" (be specific)

**5. Reference existing examples**
- Point to similar work: "Like we did in flow 'daily-sync', but for Shopify"

---

## Authentication or Permission Errors

### Symptom
- "Authentication failed"
- "Invalid API token"
- "Insufficient permissions to perform this action"

### Solutions

**1. For external API authentication (Shopify, Google, etc.):**

**Token expired:**
```
Solution: "Update the API token for extractor [name]"
Provide new token when Kai prompts
```

**Wrong credentials:**
```
Solution: Verify credentials are correct
Test in the service's dashboard first
```

**2. For Keboola permissions:**

**Read-only access:**
- You can query data but not create components
- Contact project administrator to grant write access

**Wrong project role:**
- Some features require Admin or Developer role
- Check your role: User menu → Project settings

**3. OAuth flows:**
```
"Help me re-authenticate the Google Analytics extractor"
```
Kai will guide you through OAuth reconnection.

---

## Components Created in Wrong Location

### Symptom
- Extractor created in wrong bucket
- Output table has unexpected name
- Component visible in wrong project section

### Solutions

**1. Specify location upfront**
```
"Create a Shopify extractor with output tables in bucket in.c-ecommerce"
```

**2. Fix after creation**
```
"Move the output tables from in.c-main to in.c-shopify"
```
Or delete and recreate with correct configuration.

**3. Use naming conventions**
- Mention your team's naming standards in the request
- "Follow our naming convention: [prefix]-[source]-[entity]"

---

## Slow Response Times

### Symptom
- Kai takes 30+ seconds to respond
- Much slower than usual
- Timeout errors

### Solutions

**1. Normal for certain operations:**
- Querying large tables (>1M rows): 15-30 seconds
- Creating multiple components: 20-40 seconds
- Complex SQL generation: 10-20 seconds
- Reading large job logs: 15-25 seconds

**2. If consistently slow:**
- Check your internet connection
- Try during off-peak hours (if in a shared organization)
- Simplify requests to reduce processing time

**3. For data queries:**
```
"Limit results to 1000 rows for testing"
"Sample 10% of the data instead of full table scan"
```

**4. Break up complex requests:**
- Instead of one massive request, split into 3-4 smaller ones

---

## Output Different Than Expected

### Symptom
- Kai creates something different from what you asked
- Configuration has wrong settings
- Code doesn't match requirements

### Solutions

**1. Provide more specific requirements**
```
❌ "Create a sales report"
✅ "Create a SQL transformation that:
   - Sums revenue by product_category and month
   - Excludes refunds (status != 'refunded')
   - Outputs to: out.c-reports.monthly_sales
   - Includes columns: month, category, revenue, order_count"
```

**2. Review before approval**
- Kai shows configuration before creating
- Check all settings match requirements
- Decline and clarify if wrong

**3. Iterate after creation**
```
"Good start, but change the output bucket to out.c-analytics"
"Add a column for year-over-year growth percentage"
```

**4. Provide business context**
- Explain WHY you need something, not just WHAT
- Kai can suggest better approaches with context

---

## Can't Find Conversation History

### Symptom
- Previous chat disappeared
- Can't find earlier conversation with Kai
- Lost code/config from previous session

### Solutions

**1. Check conversation list**
- Click chat history icon
- Conversations are auto-saved
- Search by keywords or date

**2. Export important code immediately**
- Copy code snippets to your notes
- Save configurations as you go
- Don't rely solely on chat history

**3. Conversations persist per project**
- Switching projects shows different chat history
- Verify you're in the correct project

---

## Still Having Issues?

### Additional Resources

**Check other documentation:**
- [Getting Started](/ai/kai-assistant/getting-started/) - Basic usage and concepts
- [Use Cases](/ai/kai-assistant/use-cases/) - Detailed examples for common tasks  
- [Best Practices](/ai/kai-assistant/best-practices/) - Effective prompting strategies

**Get help:**
- **In-platform feedback:** Use 👍 👎 buttons on Kai's responses
- **Keboola Support:** [support@keboola.com](mailto:support@keboola.com)
- **Community:** Slack channel `#feature-kai-in-platform-assistant`

**Report bugs:**
- Describe what you were trying to do
- Share the conversation (if possible)
- Include error messages and job IDs
- Note the timestamp when the issue occurred

---

**Remember:** Most issues can be resolved by:
1. Being more specific in your request
2. Providing business context and requirements upfront
3. Breaking complex tasks into smaller steps
4. Starting a fresh conversation when context gets confused

Return to [Kai Documentation](/ai/kai-assistant/) for more resources.
