---
title: Kai Use Cases & Examples
permalink: /ai/kai-assistant/use-cases/
---

* TOC
{:toc}

This page provides detailed examples of how to use Kai for common data engineering tasks. Each section includes practical prompts and expected workflows to help you get the most out of your AI assistant.

## Error Debugging & Troubleshooting

### Analyzing Job Failures

When jobs fail, Kai can read the error message and provide specific diagnosis:

**Example Prompt:**
```
"Job 789012 failed. Read the error message, identify the root cause, 
and check if the transformation has a syntax error or schema mismatch."
```

**What Kai Does:**
1. Retrieves the specific job log
2. Analyzes error messages and stack traces
3. Checks related component configurations
4. Identifies the root cause (syntax error, missing column, timeout, etc.)
5. Proposes specific fixes

**Common Issues Kai Can Resolve:**
- SQL syntax errors in transformations
- Schema mismatches between components
- Missing or renamed columns
- API authentication failures
- Timeout issues with large datasets
- Configuration validation errors

### Debugging Data Quality Issues

**Example Prompt:**
```
"I'm seeing unexpected nulls in the customer_revenue table. 
Help me investigate where they're coming from."
```

**Kai's Approach:**
1. Examines the table schema and recent data
2. Traces the data lineage back through transformations
3. Identifies potential sources of null values
4. Suggests data quality checks and fixes

## SQL Transformation & Data Modeling

### Creating New Transformations

**Example Prompt:**
```
"Create a customer lifetime value model using data from our CRM. 
First outline the approach, then build the transformation."
```

**Kai's Process:**
1. **Planning Phase**: Outlines the approach, identifies required tables, explains the calculation methodology
2. **Schema Review**: Examines available tables and columns
3. **SQL Generation**: Creates the transformation with proper joins and calculations
4. **Optimization**: Suggests performance improvements and best practices

### Converting Between Languages

**Example Prompt:**
```
"Convert this Python transformation to SQL for better performance:
[paste Python code]"
```

**Benefits:**
- Automatic dialect adjustment (Snowflake vs. BigQuery)
- Performance optimization suggestions
- Maintains business logic while improving efficiency

### Complex Analytics

**Example Prompt:**
```
"Build a cohort analysis showing monthly customer retention rates 
over the past year from our subscription data."
```

**What You Get:**
- Complete SQL transformation with cohort logic
- Proper date handling and window functions
- Clear column naming and documentation
- Suggestions for visualization

## Integration Setup

### Configuring Data Extractors

**Example Prompt:**
```
"Set up a Shopify extractor to pull orders, customers, and products. 
I'll provide the API credentials when you're ready."
```

**Kai's Workflow:**
1. Creates the Shopify extractor configuration
2. Sets up appropriate endpoints and incremental loading
3. Configures output table structure
4. Prompts securely for API credentials
5. Tests the connection and runs initial extraction

### Custom Python Components

**Example Prompt:**
```
"Create a generic extractor for the TikTok Ads API with pagination 
and OAuth authentication."
```

**Deliverables:**
- Complete Python configuration with API handling
- Proper pagination logic
- OAuth flow implementation
- Error handling and retry logic
- Output table mapping

### Adding Packages

**Example Prompt:**
```
"Add the pandas package to my Python transformation environment."
```

**Simple but Essential:**
This is one of the most common requests and Kai handles it seamlessly.

## Data Apps Development

### Creating Dashboards

**Example Prompt:**
```
"Create a sales dashboard with a date picker and bar chart showing 
monthly revenue by product category."
```

**Kai Builds:**
1. **Data Query**: SQL to aggregate sales data by month and category
2. **Streamlit App**: Complete Python application with interactive components
3. **Visualization**: Properly formatted charts with filtering capabilities
4. **Deployment**: Configuration for hosting within Keboola

### Advanced Analytics Apps

**Example Prompt:**
```
"Build a customer segmentation app that lets users adjust RFM parameters 
and see the segments update in real-time."
```

**Features Included:**
- Interactive parameter controls
- Real-time data processing
- Multiple visualization types
- Export capabilities

## Documentation & Metadata

### Automated Documentation Generation

**Example Prompt:**
```
"Generate comprehensive documentation for the customer analytics flow, 
including all transformations and their business purpose."
```

**Output Includes:**
- Flow overview and business objectives
- Detailed transformation descriptions
- Input/output table documentation
- Data lineage explanations
- Business logic summaries

### Table and Column Descriptions

**Example Prompt:**
```
"Generate business-friendly descriptions for all tables in the 
customer_data bucket based on their usage in transformations."
```

**Kai Analyzes:**
- Table schemas and data types
- Usage patterns in transformations
- Relationships between tables
- Business context from existing documentation

## Data Exploration & Analytics

### Schema Discovery

**Example Prompt:**
```
"I'm new to this project. Give me an overview of the data structure 
and what each bucket contains."
```

**Comprehensive Overview:**
- Bucket organization and purposes
- Key tables and their relationships
- Data freshness and update patterns
- Suggested starting points for analysis

### Business Intelligence Queries

**Example Prompt:**
```
"Calculate our top 10 customers by revenue for Q3, excluding refunds, 
and show their year-over-year growth."
```

**Kai Provides:**
- Properly structured SQL with business logic
- Handles date ranges and exclusions correctly
- Includes growth calculations
- Formats results for easy interpretation

### Trend Analysis

**Example Prompt:**
```
"Analyze monthly user acquisition trends and identify any seasonal patterns 
or anomalies in the data."
```

**Analysis Includes:**
- Time series queries with proper aggregation
- Statistical analysis for trend detection
- Anomaly identification
- Seasonal pattern recognition
- Visualization suggestions

## Advanced Workflows

### Multi-Step Pipeline Creation

**Example Prompt:**
```
"Build a complete pipeline from Shopify to Snowflake that includes 
data quality checks and customer segmentation."
```

**Kai Orchestrates:**
1. **Extraction**: Shopify connector configuration
2. **Quality Checks**: Data validation transformations
3. **Processing**: Customer segmentation logic
4. **Loading**: Snowflake writer setup
5. **Scheduling**: Flow configuration with dependencies

### Data Migration Projects

**Example Prompt:**
```
"Help me migrate our legacy MySQL analytics to Keboola, 
preserving all existing business logic."
```

**Migration Process:**
1. **Assessment**: Analyzes existing MySQL structure
2. **Mapping**: Plans Keboola component architecture
3. **Translation**: Converts MySQL queries to appropriate transformations
4. **Testing**: Validates data consistency
5. **Deployment**: Implements with proper scheduling

## Industry-Specific Examples

### E-commerce Analytics

**Common Requests:**
- "Calculate customer lifetime value by acquisition channel"
- "Build an inventory turnover analysis"
- "Create a product recommendation engine"

### Financial Services

**Typical Use Cases:**
- "Implement fraud detection scoring"
- "Calculate risk-adjusted returns"
- "Build regulatory reporting pipelines"

### Marketing Analytics

**Popular Applications:**
- "Attribution modeling across channels"
- "Campaign performance dashboards"
- "Customer journey analysis"

## Tips for Complex Requests

### Break Down Large Tasks

Instead of: "Build a complete data warehouse"

Try: 
1. "First, help me design the dimensional model"
2. "Now create the staging transformations"
3. "Set up the fact and dimension tables"
4. "Finally, build the reporting layer"

### Provide Business Context

Instead of: "Calculate churn rate"

Try: "Calculate monthly churn rate where a churned customer is one whose subscription ended and they haven't renewed within 30 days"

### Iterate and Refine

Start with a basic version, then enhance:
1. "Create a basic sales report"
2. "Add year-over-year comparisons"
3. "Include seasonal adjustments"
4. "Add forecasting capabilities"

## Getting the Most Value

### Combine Kai's Strengths

- **Context Awareness**: Leverage Kai's knowledge of your specific project
- **Code Generation**: Use for both SQL and Python development
- **Integration**: Let Kai handle complex API configurations
- **Documentation**: Automate the tedious parts of project documentation

### When to Use Kai vs. Manual Work

**Use Kai for:**
- Initial code generation and configuration
- Debugging and troubleshooting
- Documentation and metadata
- Learning new Keboola features

**Manual Work for:**
- Final review and testing
- Business-specific customizations
- Performance fine-tuning
- Strategic architectural decisions

Ready to try these examples? Start with simpler use cases and gradually work up to more complex scenarios as you become comfortable with Kai's capabilities.
