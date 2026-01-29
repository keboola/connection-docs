---
title: Kai Use Cases & Examples
permalink: /ai/kai-assistant/use-cases/
---

* TOC
{:toc}

Practical examples of what you can ask Kai to do.

![Kai Capabilities](/ai/kai-assistant/Capabilities.gif)

## Troubleshooting

**Debug a failed job:**
```
"Job 789012 failed. Read the error message and identify the root cause."
```

**Investigate data quality:**
```
"I'm seeing unexpected nulls in the customer_revenue table. Help me trace where they're coming from."
```

Kai reads actual job logs, checks configurations, and traces data lineage to provide specific solutions.

## SQL Transformations

**Create a transformation:**
```
"Create a customer lifetime value model using data from our CRM. First outline the approach, then build it."
```

**Convert Python to SQL:**
```
"Convert this Python transformation to SQL for better performance: [paste code]"
```

**Complex analytics:**
```
"Build a cohort analysis showing monthly customer retention rates over the past year."
```

## Integration Setup

**Configure an extractor:**
```
"Set up a Shopify extractor to pull orders, customers, and products."
```

**Custom API integration:**
```
"Create a generic extractor for the TikTok Ads API with pagination and OAuth authentication."
```

**Add packages:**
```
"Add the pandas package to my Python transformation environment."
```

## Data Apps

**Create a dashboard:**
```
"Create a sales dashboard with a date picker and bar chart showing monthly revenue by product category."
```

**Interactive analytics:**
```
"Build a customer segmentation app that lets users adjust RFM parameters and see segments update in real-time."
```

## Documentation

**Generate project docs:**
```
"Generate documentation for the customer analytics flow, including all transformations and their business purpose."
```

**Update metadata:**
```
"Generate descriptions for all tables in the customer_data bucket."
```

## Data Exploration

**Project overview:**
```
"I'm new to this project. Give me an overview of the data structure and what each bucket contains."
```

**Business queries:**
```
"Calculate our top 10 customers by revenue for Q3, excluding refunds, and show year-over-year growth."
```

## Complex Workflows

**Build a pipeline:**
```
"Build a complete pipeline from Shopify to Snowflake with data quality checks and customer segmentation."
```

**Data migration:**
```
"Help me migrate our legacy MySQL analytics to Keboola, preserving all existing business logic."
```

## Tips for Better Results

| Instead of | Try |
|------------|-----|
| "Build a data warehouse" | Break into steps: "First design the dimensional model", then "Create staging transformations" |
| "Calculate churn rate" | "Calculate monthly churn rate where churned = subscription ended and no renewal within 30 days" |
| One complex request | Iterate: basic version first, then add features incrementally |

For more tips, see [Best Practices](/ai/kai-assistant/best-practices/).
