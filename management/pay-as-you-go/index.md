---
title: Pay-As-You-Go  (Free Plan)
permalink: /management/payg-project/
---

* TOC
{:toc}

You can now start working with Keboola for free. Simply [Sign up](https://connection.north-europe.azure.keboola.com/wizard) on the website and create a free project.

## Free Plan Limits
Free Plan projects have the following limits:

- **Single project:** each account is limited to one project, so it is not feasible for [multi-project architecture](/catalog/multi-project/)
- **Data Catalog:** sharing & grouping data using [data catalog](/catalog/) is not available 
- **Transformations:** are limited to [SQL](/transformations/snowflake-plain/) and [Python](/transformations/python-plain/)
- **DataScience:** training and deploying [ML models](transformations/ml-model-deployment/) is not available
- **Dynamic backend scaling:** possibility to choose [backend size] (/transformations/snowflake-plain/) for each transformation is not available 
- **Performance:** is limited to an xsmall data warehouse (DWH) (half the speed of standard projects) and doesn’t allow for Python workspace sizing.
- **Storage:** is limited to 250 GB of data storage.
- **Support:** while we strive to provide great support even under Free Plan, there is no service-level agreement (SLA) and we will deal with the tickets on a best-effort basis. 

## DWH Backend
Users can choose between a Keboola-managed backend or their own Snowflake backend.

## Pricing & Purchasing aditional minutes
Each Free Plan project receives 300 minutes of free runtime per month. Minutes are used for running of any process (a component job, an active Python workspace, SQL queries 
in Keboola-managed DWH, etc.). The only exception are orchestration jobs, which are not consuming any minutes. 

Additional minutes can be purchased within the platform by using a credit card to prevent your jobs being blocked after you have used all your free minutes. There is no contract apart from the Free Plan Terms of Services. 

Unused free minutes don’t roll over from one month to the next. Purchased minutes don’t expire during the life of the project.

To purchase additional minutes for your project:
- On the top bar menu, select **Your profile icon > Billing**.
- Select **Top Up** additional minutes.
- Enter your billing and credit card details and click **Pay**.

After we process your payment, the extra minutes are synced to your project.

## Troubleshooting

If your credit card is declined when purchasing more minutes, possible reasons include:
- The credit card details provided are incorrect.
- The credit card account has insufficient funds.
- You are using a virtual credit card and it has insufficient funds, or has expired.
- The transaction exceeds the credit limit.
- The transaction exceeds the credit card’s maximum transaction amount.

## Free plan project upgrade
Any Free Plan project can be upgraded to a [standard Keboola Connection project](/management/project/) upon the execution of our standard order form under the Master Software Subscription Agreement (MSSA).
