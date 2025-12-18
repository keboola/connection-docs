---
title: Kai Use Cases & Examples
permalink: /ai/kai-assistant/use-cases/
---

* TOC
{:toc}

This page provides detailed examples of how to use Kai for common data engineering tasks. Each section includes practical prompts, expected workflows, and tips to help you get the most out of your AI assistant.

---

## What Kai Can Do

Kai excels at a wide range of data engineering tasks:

### Data Analytics & Exploration
- Execute SQL queries against your Snowflake/BigQuery databases
- Explore table schemas and data structures
- Calculate metrics, KPIs, and statistical analyses
- Create reports and dashboards
- Analyze trends and identify anomalies

### Integration Setup
- Configure data extractors (Shopify, Google Sheets, APIs, CSV)
- Set up writers and data destinations
- Create custom Python components for specialized integrations
- Manage API tokens and authentication
- Add packages to transformation environments

### Coding & Development
- Write SQL transformations
- Create Python transformations
- Convert between Python and SQL
- Optimize queries and transformation logic
- Build custom data processing components

### Troubleshooting
- Debug job failures with automated diagnosis
- Resolve configuration errors
- Fix transformation bugs
- Investigate data quality issues
- Handle API token and authentication issues

### Documentation
- Generate comprehensive project documentation
- Update table and column descriptions
- Document transformations and data flows
- Create project overviews for new team members

### Data Modeling
- Build complex analytical frameworks
- Create hierarchical data structures
- Design dimensional models
- Advanced clustering and taxonomy creation

---

## How to Use This Page

**Jump to your need:**
- 🚨 **[Debugging & Troubleshooting](#error-debugging--troubleshooting)** - Fix broken jobs and data issues
- 🔧 **[Transformations & Analytics](#sql-transformation--data-modeling)** - Build SQL/Python data processing
- 🔌 **[Integration Setup](#integration-setup)** - Connect data sources and destinations
- 📱 **[Data Apps](#data-apps-development)** - Create dashboards and analytics applications
- 📝 **[Documentation](#documentation--metadata)** - Auto-generate project documentation
- 🏢 **[Industry Examples](#industry-specific-examples)** - E-commerce, finance, marketing use cases

**New to Kai?** Start with [Data Exploration](#data-exploration--analytics) examples below.

---

## Tips for Success

Before diving into examples, here are key tips that apply to all use cases:

### Start Specific, Then Iterate

**❌ Too vague:** "Build a data warehouse"

**✅ Better approach:**
1. "First, help me design the dimensional model"
2. "Now create the staging transformations"
3. "Set up the fact and dimension tables"
4. "Finally, build the reporting layer"

### Provide Business Context

**❌ Generic:** "Calculate churn rate"

**✅ With context:** "Calculate monthly churn rate where a churned customer is one whose subscription ended and they haven't renewed within 30 days"

### Expect Conversation, Not Magic

Kai will ask clarifying questions. This is normal and leads to better results:
```
You: "Create a Shopify extractor"
Kai: "Which endpoints do you need? Orders, customers, products, or all three?"
You: "Orders and customers only"
Kai: "Should I use incremental loading based on updated_at?"
You: "Yes, good idea"
Kai: [Creates configuration]
```

---

## Error Debugging & Troubleshooting

🟢 **Difficulty: Beginner** | ⏱️ **Time: 5-10 minutes**

### Analyzing Job Failures

When jobs fail, Kai can read the actual logs and provide specific diagnosis.

**Example Conversation:**
```
You: "Job 789012 failed. What went wrong?"

Kai: I've analyzed job #789012. The transformation failed with this error:

"Column 'email_address' not found in table customers_raw"

Root cause: Your upstream Shopify extractor updated its output schema yesterday.
The column 'email_address' was renamed to 'email'.

The transformation 'customer-cleanup' line 23 still references 'email_address'.

Would you like me to fix this?

You: "Yes please"

Kai: I've updated transformation 'customer-cleanup':
- Line 23: Changed 'email_address' to 'email'
- Validated SQL syntax
- Ready to run

Would you like me to run the transformation now to verify it works?

You: "Yes"

Kai: ✓ Transformation ran successfully
✓ Processed 45,382 rows
✓ Output table updated: out.c-main.customers_clean
```

**Common issues Kai can resolve:**
- SQL syntax errors in transformations
- Schema mismatches between components
- Missing or renamed columns
- API authentication failures
- Timeout issues with large datasets
- Configuration validation errors

---

### Debugging Data Quality Issues

🟡 **Difficulty: Intermediate** | ⏱️ **Time: 15-20 minutes**

**Example Conversation:**
```
You: "I'm seeing unexpected nulls in the customer_revenue table. 
Help me investigate."

Kai: I'll trace the data lineage. One moment...

The customer_revenue table is created by transformation 'revenue-calc'.
I found 1,247 null values in the 'revenue' column (2.8% of rows).

Investigating upstream...

Root cause identified:
- The 'revenue' column comes from LEFT JOIN with orders table
- 1,247 customers in your CRM have no matching orders
- This is expected for newly registered customers who haven't purchased

Options:
1. Filter out customers with no orders: WHERE revenue IS NOT NULL
2. Replace nulls with 0: COALESCE(revenue, 0)
3. Keep nulls but add a flag: has_purchased (TRUE/FALSE)

Which approach fits your business logic?

You: "Option 3 - add the has_purchased flag"

Kai: I've updated the transformation:
- Added column: has_purchased BOOLEAN
- Logic: CASE WHEN revenue IS NOT NULL THEN TRUE ELSE FALSE END
- Kept revenue nulls intact for reporting

Should I run this to update your table?
```

---

## SQL Transformation & Data Modeling

### Creating New Transformations

🟡 **Difficulty: Intermediate** | ⏱️ **Time: 10-15 minutes**

**Example Conversation:**
```
You: "Create a customer lifetime value model using data from our CRM. 
First outline the approach, then build it."

Kai: Here's my proposed approach for Customer Lifetime Value (CLV):

**Data Requirements:**
- customers table (registration dates, demographics)
- orders table (order dates, amounts)
- Time period: All historical data

**Calculation Method:**
1. Sum total revenue per customer
2. Calculate average order value
3. Calculate purchase frequency
4. Estimate customer lifespan
5. CLV = (Average Order Value × Purchase Frequency × Customer Lifespan)

**Tables I'll use:**
- in.c-crm.customers
- in.c-sales.orders

Does this approach match your business definition of CLV?

You: "Yes, but also segment by customer acquisition channel"

Kai: Perfect. I'll add acquisition_channel from customers table to the output.

Let me examine your table schemas... Done.

I notice your orders table has both 'amount' and 'amount_refunded' columns.
Should I exclude refunds from the CLV calculation?

You: "Yes, subtract refunds"

Kai: Creating transformation with these features:
✓ Total revenue per customer (orders - refunds)
✓ Average order value
✓ Purchase frequency
✓ Customer lifespan estimation
✓ Segmentation by acquisition channel
✓ Output table: out.c-analytics.customer_ltv

[Shows SQL preview]

Should I create this transformation?

You: "Yes"

Kai: ✓ Transformation 'customer-ltv' created
✓ SQL validated
✓ Dependencies mapped

Would you like me to run it now or add it to a flow?
```

---

### Converting Between Languages

🟢 **Difficulty: Beginner** | ⏱️ **Time: 5 minutes**

**Example Prompt:**
```
"Convert this Python transformation to SQL for better performance:

import pandas as pd

df = pd.read_csv('customers.csv')
df['revenue_category'] = df['total_revenue'].apply(
    lambda x: 'High' if x > 10000 else 'Medium' if x > 1000 else 'Low'
)
df.to_csv('customers_categorized.csv')
"
```

**What Kai Delivers:**
```sql
-- Optimized SQL version (Snowflake dialect)
CREATE TABLE out.c-main.customers_categorized AS
SELECT 
    *,
    CASE 
        WHEN total_revenue > 10000 THEN 'High'
        WHEN total_revenue > 1000 THEN 'Medium'
        ELSE 'Low'
    END AS revenue_category
FROM in.c-main.customers;
```

**Benefits:**
- Automatic dialect adjustment (Snowflake vs. BigQuery)
- ~50x performance improvement for large datasets
- Maintains business logic while improving efficiency
- No external dependencies (pandas, etc.)

---

### Complex Analytics

🔴 **Difficulty: Advanced** | ⏱️ **Time: 20-30 minutes**

**Example Prompt:**
```
"Build a cohort analysis showing monthly customer retention rates 
over the past year from our subscription data."
```

**What You Get:**
```sql
-- Monthly cohort retention analysis
WITH cohorts AS (
    SELECT 
        user_id,
        DATE_TRUNC('month', first_subscription_date) AS cohort_month
    FROM in.c-crm.users
),
monthly_activity AS (
    SELECT 
        user_id,
        DATE_TRUNC('month', activity_date) AS activity_month
    FROM in.c-events.user_activity
    WHERE activity_date >= DATEADD('year', -1, CURRENT_DATE)
)
SELECT 
    c.cohort_month,
    DATEDIFF('month', c.cohort_month, ma.activity_month) AS months_since_signup,
    COUNT(DISTINCT ma.user_id) AS active_users,
    COUNT(DISTINCT ma.user_id) * 100.0 / 
        COUNT(DISTINCT c.user_id) AS retention_rate
FROM cohorts c
LEFT JOIN monthly_activity ma ON c.user_id = ma.user_id
GROUP BY c.cohort_month, months_since_signup
ORDER BY c.cohort_month, months_since_signup;
```

**Includes:**
- Proper date handling and window functions
- Clear column naming and documentation
- Performance optimization for large datasets
- Suggestions for visualization in BI tools

---

## Integration Setup

### Configuring Data Extractors

🟢 **Difficulty: Beginner** | ⏱️ **Time: 5-10 minutes**

**Example Conversation:**
```
You: "Set up a Shopify extractor to pull orders, customers, and products."

Kai: I'll create a Shopify extractor configuration.

**Configuration details:**
- Endpoints: orders, customers, products
- Loading mode: Incremental (based on updated_at)
- Output tables:
  - in.c-shopify.orders
  - in.c-shopify.customers
  - in.c-shopify.products

I need your Shopify API credentials:
1. Shop URL (e.g., your-store.myshopify.com)
2. API Access Token

Please provide these and I'll test the connection.

You: "Shop: acme-store.myshopify.com
Token: shpat_abc123xyz..."

Kai: ✓ Connection successful
✓ Verified API permissions (read_orders, read_customers, read_products)
✓ Configuration created: shopify-main-extractor

Should I run the initial extraction now? (This will pull all historical data)

You: "Yes"

Kai: ✓ Extraction started (Job #789123)
⏱️ Estimated time: 3-5 minutes for initial load

I'll notify you when complete. Future runs will be incremental.
```

---

### Custom Python Components

🔴 **Difficulty: Advanced** | ⏱️ **Time: 30-45 minutes**

**Example Prompt:**
```
"Create a generic extractor for the TikTok Ads API with pagination 
and OAuth authentication."
```

**Deliverables:**

Complete Python configuration including:
- OAuth 2.0 authentication flow
- Pagination logic for large result sets
- Rate limiting and retry logic
- Error handling for API failures
- Output table mapping with proper data types
- Incremental loading based on last_modified timestamps

**Code structure:**
```python
# Authentication
# Pagination handling  
# Data extraction
# Error handling
# Output mapping
```

---

### Adding Packages

🟢 **Difficulty: Beginner** | ⏱️ **Time: 1 minute**

**Example Prompt:**
```
"Add the pandas and requests packages to my Python transformation environment."
```

**Response:**
```
✓ Added pandas==2.1.0
✓ Added requests==2.31.0  
✓ Transformation environment updated

These packages are now available in all your Python transformations in this project.
```

**Simple but essential:** This is one of the most common requests and Kai handles it seamlessly.

---

## Data Apps Development

### Creating Dashboards

🟡 **Difficulty: Intermediate** | ⏱️ **Time: 15-20 minutes**

**Example Prompt:**
```
"Create a sales dashboard with a date picker and bar chart showing 
monthly revenue by product category."
```

**Kai Builds:**

**1. Data Query (SQL):**
```sql
SELECT 
    DATE_TRUNC('month', order_date) AS month,
    product_category,
    SUM(revenue) AS total_revenue
FROM in.c-sales.orders
WHERE order_date BETWEEN :start_date AND :end_date
GROUP BY month, product_category
ORDER BY month, total_revenue DESC;
```

**2. Streamlit App (Python):**
```python
import streamlit as st
import pandas as pd
import plotly.express as px

st.title("Sales Dashboard")

# Date picker
start_date = st.date_input("Start Date")
end_date = st.date_input("End Date")

# Fetch data
df = query_data(sql, start_date=start_date, end_date=end_date)

# Bar chart
fig = px.bar(df, x='month', y='total_revenue', color='product_category')
st.plotly_chart(fig)
```

**3. Deployment Configuration:**
- Auto-refresh: Every hour
- Authentication: Required
- Data caching: 15 minutes

**Result:** Fully functional dashboard deployed within Keboola, accessible to your team.

---

### Advanced Analytics Apps

🔴 **Difficulty: Advanced** | ⏱️ **Time: 45-60 minutes**

**Example Prompt:**
```
"Build a customer segmentation app that lets users adjust RFM parameters 
and see the segments update in real-time."
```

**Features Included:**

**Interactive Controls:**
- Recency threshold slider (days)
- Frequency threshold slider (purchases)
- Monetary value threshold slider ($)

**Real-Time Processing:**
- Queries run on parameter change
- Results update instantly
- Segment sizes displayed

**Visualizations:**
- 3D RFM scatter plot
- Segment distribution pie chart
- Customer list by segment (exportable)

**Export Capabilities:**
- Download segment lists as CSV
- Save segments to output tables
- Schedule automated updates

---

## Documentation & Metadata

### Automated Documentation Generation

🟡 **Difficulty: Intermediate** | ⏱️ **Time: 10-15 minutes**

**Example Prompt:**
```
"Generate comprehensive documentation for the customer analytics flow, 
including all transformations and their business purpose."
```

**Output Includes:**

**Flow Overview:**
```
Customer Analytics Flow
Purpose: Generate daily customer insights for marketing team
Schedule: Daily at 6 AM UTC
Dependencies: Shopify extractor, CRM sync
Output: Customer segments, LTV scores, churn predictions
```

**Transformation Details:**
```
1. customer-data-prep
   Purpose: Clean and standardize customer data from multiple sources
   Input: in.c-shopify.customers, in.c-crm.users
   Output: out.c-staging.customers_clean
   Business Logic:
   - Deduplicates customers by email
   - Standardizes phone number formats
   - Fills missing demographic data
   
2. customer-ltv-calculation
   Purpose: Calculate lifetime value for each customer
   Input: out.c-staging.customers_clean, in.c-sales.orders
   Output: out.c-analytics.customer_ltv
   Business Logic:
   - Sums total revenue per customer
   - Calculates purchase frequency
   - Estimates future value based on cohort analysis
```

**Data Lineage:**
```
Shopify API → in.c-shopify.* → customer-data-prep → customer-ltv-calculation → out.c-analytics.customer_ltv
```

---

### Table and Column Descriptions

🟢 **Difficulty: Beginner** | ⏱️ **Time: 5 minutes**

**Example Prompt:**
```
"Generate business-friendly descriptions for all tables in the 
customer_data bucket."
```

**Kai Analyzes:**
- Table schemas and data types
- Usage patterns in transformations  
- Relationships between tables
- Sample data to understand content

**Example Output:**
```
in.c-customer-data.customers
Description: Master customer table containing demographic and contact information 
for all registered users. Updated daily from Shopify and CRM systems.

Columns:
- customer_id (VARCHAR): Unique identifier for each customer
- email (VARCHAR): Primary email address for communications
- first_purchase_date (DATE): Date of customer's first order
- total_lifetime_revenue (DECIMAL): Sum of all order revenues excluding refunds
- customer_segment (VARCHAR): RFM-based segment (High Value, Medium, Low, At Risk)
```

---

## Data Exploration & Analytics

### Schema Discovery

🟢 **Difficulty: Beginner** | ⏱️ **Time: 5 minutes**

**Example Prompt:**
```
"I'm new to this project. Give me an overview of the data structure."
```

**Comprehensive Overview:**
```
Project: E-commerce Analytics

Buckets (4):
1. in.c-shopify (Source Data)
   - orders (125K rows, updated hourly)
   - customers (45K rows, updated daily)  
   - products (1.2K rows, updated weekly)

2. in.c-marketing (Marketing Data)
   - campaigns (89 rows, updated daily)
   - ad_spend (2.3K rows, updated daily)

3. out.c-staging (Cleaned Data)
   - customers_clean (45K rows)
   - orders_enriched (125K rows)

4. out.c-analytics (Business Metrics)
   - customer_ltv (45K rows)
   - product_performance (1.2K rows)
   - monthly_revenue_summary (36 rows)

Key Relationships:
- orders.customer_id → customers.customer_id
- orders.product_id → products.product_id
- campaigns.campaign_id → ad_spend.campaign_id

Data Freshness:
- Most recent order: 2 hours ago
- Most recent customer update: 6 hours ago

Suggested Starting Points:
- Explore: out.c-analytics.monthly_revenue_summary
- Popular query: "Show me top products by revenue this month"
```

---

### Business Intelligence Queries

🟡 **Difficulty: Intermediate** | ⏱️ **Time: 5-10 minutes**

**Example Prompt:**
```
"Calculate our top 10 customers by revenue for Q3, excluding refunds, 
and show their year-over-year growth."
```

**Kai Provides:**
```sql
WITH q3_revenue AS (
    SELECT 
        customer_id,
        YEAR(order_date) AS year,
        SUM(order_amount - COALESCE(refund_amount, 0)) AS net_revenue
    FROM in.c-sales.orders
    WHERE QUARTER(order_date) = 3
        AND YEAR(order_date) IN (2023, 2024)
    GROUP BY customer_id, year
),
yoy_comparison AS (
    SELECT 
        c.customer_id,
        c.email,
        c.company_name,
        curr.net_revenue AS revenue_2024,
        prev.net_revenue AS revenue_2023,
        ((curr.net_revenue - prev.net_revenue) / prev.net_revenue * 100) AS yoy_growth_pct
    FROM in.c-crm.customers c
    LEFT JOIN q3_revenue curr ON c.customer_id = curr.customer_id AND curr.year = 2024
    LEFT JOIN q3_revenue prev ON c.customer_id = prev.customer_id AND prev.year = 2023
    WHERE curr.net_revenue IS NOT NULL
)
SELECT 
    customer_id,
    company_name,
    email,
    revenue_2024,
    revenue_2023,
    yoy_growth_pct
FROM yoy_comparison
ORDER BY revenue_2024 DESC
LIMIT 10;
```

**Features:**
- Properly handles date ranges and exclusions
- Includes growth calculations
- Formats results for easy interpretation
- Optimized for performance

---

### Trend Analysis

🔴 **Difficulty: Advanced** | ⏱️ **Time: 20 minutes**

**Example Prompt:**
```
"Analyze monthly user acquisition trends and identify any seasonal patterns 
or anomalies in the data."
```

**Analysis Includes:**

**Time Series Query:**
```sql
-- Monthly user acquisition with moving average
SELECT 
    DATE_TRUNC('month', registration_date) AS month,
    COUNT(*) AS new_users,
    AVG(COUNT(*)) OVER (
        ORDER BY DATE_TRUNC('month', registration_date)
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS three_month_avg
FROM in.c-users.registrations
WHERE registration_date >= DATEADD('year', -2, CURRENT_DATE)
GROUP BY month
ORDER BY month;
```

**Statistical Insights:**
- Average monthly acquisitions: 1,247 users
- Standard deviation: 312 users
- Seasonal pattern: 35% increase in November-December (holiday season)
- Anomaly detected: February 2024 (-45% vs. trend) - investigate marketing campaign pause

**Visualization Suggestions:**
- Line chart with trend line
- Seasonal decomposition chart
- Anomaly markers for outliers

---

## Advanced Workflows

### Multi-Step Pipeline Creation

🔴 **Difficulty: Advanced** | ⏱️ **Time: 45-60 minutes**

**Example Prompt:**
```
"Build a complete pipeline from Shopify to Snowflake that includes 
data quality checks and customer segmentation."
```

**Kai Orchestrates:**

**Step 1: Extraction**
```
✓ Shopify extractor configured
  - Endpoints: orders, customers, products
  - Schedule: Hourly incremental
```

**Step 2: Data Quality Checks**
```
✓ Validation transformation created
  - Check for null emails
  - Validate order amounts > 0
  - Flag duplicate customer records
  - Output: data_quality_report table
```

**Step 3: Customer Segmentation**
```
✓ RFM segmentation transformation
  - Recency, Frequency, Monetary analysis
  - 5 segments: Champions, Loyal, At Risk, Lost, New
  - Output: customer_segments table
```

**Step 4: Snowflake Loading**
```
✓ Snowflake writer configured
  - Target: ANALYTICS.CUSTOMERS schema
  - Mode: Incremental (merge on customer_id)
  - Tables: customers_clean, customer_segments
```

**Step 5: Flow Orchestration**
```
✓ Flow created: "shopify-to-snowflake-pipeline"
  Dependencies configured:
  1. Shopify extraction
  2. Data quality checks (depends on #1)
  3. Customer segmentation (depends on #2)
  4. Snowflake load (depends on #3)
  
  Schedule: Hourly
  Notifications: Email on failure
```

---

### Data Migration Projects

🔴 **Difficulty: Advanced** | ⏱️ **Time: 2-4 hours**

**Example Prompt:**
```
"Help me migrate our legacy MySQL analytics to Keboola, 
preserving all existing business logic."
```

**Migration Process:**

**Phase 1: Assessment (15 minutes)**
```
Kai: I'll need access to your MySQL schema. Can you provide:
1. Database connection details (host, database name)
2. Read-only credentials
3. List of tables to migrate

You: [Provides details]

Kai: Analysis complete:
- 23 tables identified
- 47 stored procedures
- 12 scheduled jobs
- Total data volume: 145 GB
- Estimated migration time: 3-4 hours
```

**Phase 2: Architecture Mapping (30 minutes)**
```
Kai: Here's my proposed Keboola architecture:

MySQL Tables → Keboola Buckets:
- analytics_* tables → in.c-mysql-analytics
- customer_* tables → in.c-mysql-customers  
- sales_* tables → in.c-mysql-sales

MySQL Stored Procedures → Keboola Transformations:
- sp_calculate_metrics → transformation: metrics-calculation
- sp_customer_segments → transformation: customer-segmentation
- [etc.]

MySQL Scheduled Jobs → Keboola Flows:
- daily_reports_job → flow: daily-reporting
- hourly_sync_job → flow: hourly-data-sync

Does this structure match your needs?
```

**Phase 3: Code Translation (1-2 hours)**
```
Kai: Converting MySQL stored procedures to Keboola transformations...

✓ sp_calculate_metrics → SQL transformation (Snowflake dialect)
  - Converted MySQL-specific functions
  - Optimized for columnar storage
  - Added proper error handling

✓ sp_customer_segments → SQL transformation
  - Preserved business logic exactly
  - Added documentation
  - Performance improvements estimated: 3x faster
```

**Phase 4: Testing & Validation (30 minutes)**
```
Kai: Running validation tests...

✓ Row count matching: 23/23 tables verified
✓ Data sampling: 1,000 random rows match source
✓ Metric validation: All calculated fields match MySQL output
✓ Performance testing: Average query time reduced by 45%

Migration ready for production cutover.
```

---

## Industry-Specific Examples

### E-commerce Analytics

**Common Requests:**

🟡 **Customer Lifetime Value by Acquisition Channel**
```
"Calculate customer lifetime value segmented by acquisition channel 
(Organic, Paid Search, Social, Email)"
```

🟡 **Inventory Turnover Analysis**
```
"Build an inventory turnover dashboard showing days of supply 
by product category with reorder alerts"
```

🔴 **Product Recommendation Engine**
```
"Create a collaborative filtering model to generate product recommendations 
based on customer purchase history"
```

---

### Financial Services

**Typical Use Cases:**

🔴 **Fraud Detection Scoring**
```
"Implement a fraud detection model using transaction patterns, 
velocity checks, and anomaly detection"
```

🔴 **Risk-Adjusted Returns**
```
"Calculate Sharpe ratios and risk-adjusted returns for our 
investment portfolio with daily rebalancing"
```

🟡 **Regulatory Reporting**
```
"Build automated Basel III capital adequacy reports 
with proper audit trails and versioning"
```

---

### Marketing Analytics

**Popular Applications:**

🔴 **Multi-Touch Attribution Modeling**
```
"Create a time-decay attribution model across channels 
(email, social, paid search, organic) with customizable decay rates"
```

🟡 **Campaign Performance Dashboard**
```
"Build a real-time dashboard showing ROAS, CPA, and conversion rates 
by campaign with budget pacing alerts"
```

🟡 **Customer Journey Analysis**
```
"Map customer journeys from first touch to conversion, 
identifying drop-off points and optimization opportunities"
```

---

## Getting the Most Value from Kai

### Combine Kai's Strengths

**Context Awareness**  
Leverage Kai's deep knowledge of YOUR specific project:
```
"Which transformations use the orders table?"
"What's the data lineage for the customer_revenue metric?"
```

**Code Generation**  
Use for both SQL and Python development:
```
"Convert this business logic to SQL"
"Optimize this slow-running query"
```

**Integration Knowledge**  
Let Kai handle complex API configurations:
```
"Set up OAuth for Google Analytics"
"Configure incremental loading for this REST API"
```

**Documentation Automation**  
Automate tedious documentation tasks:
```
"Document all transformations in this flow"
"Generate a data dictionary for the sales bucket"
```

---

### When to Use Kai vs. Manual Work

**Use Kai for:**
- ✅ Initial code generation and configuration
- ✅ Debugging and troubleshooting
- ✅ Documentation and metadata management
- ✅ Learning new Keboola features and best practices
- ✅ Repetitive tasks (adding packages, updating descriptions)

**Manual work best for:**
- 🔧 Final review and testing before production
- 🔧 Business-specific customizations requiring domain expertise
- 🔧 Performance fine-tuning for mission-critical workloads
- 🔧 Strategic architectural decisions
- 🔧 Complex security and compliance requirements

---

## Next Steps

**Master the Basics:**
- Review [Best Practices](/ai/kai-assistant/best-practices/) for advanced prompting techniques
- Learn about [Security & Privacy](/ai/kai-assistant/security-and-privacy/) considerations

**Get Help:**
- Check [Troubleshooting](/ai/kai-assistant/troubleshooting/) if you encounter issues
- Join the community in Slack: `#feature-kai-in-platform-assistant`

---

**Ready to try these examples?** Start with simpler use cases and gradually work up to more complex scenarios as you become comfortable with Kai's capabilities.
