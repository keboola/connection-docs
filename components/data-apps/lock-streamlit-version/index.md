---
title: How to Fix Package Versions in Streamlit Applications in Keboola When Deploying from Git Repository
permalink: /components/data-apps/lock-streamlit-version/
---

* TOC
{:toc}

This guide explains how to fix package versions in Streamlit applications deployed from a GIT repository in the Keboola Data Platform. Fixing package versions ensures your app remains stable in production by preventing dependency conflicts, especially since Keboola automatically uses the latest package versions when building your app’s environment.

## Why Fix Package Versions?
Here are the key reasons to lock package versions in your application:

1. **Avoid Compatibility Issues:** The latest versions of packages might not always be compatible with Streamlit or other dependencies in your app.

2. **Ensure Reproducibility:** Locked versions ensure that your app runs consistently across different environments, from local development to production.

3. **Stable Production Environment:** Avoid unexpected issues caused by automatic updates or conflicts between package versions.

## How to Lock Package Versions
### 1. Set Up Your Virtual Environment
Create and activate a Python virtual environment to isolate your app’s dependencies:

`python3 -m venv venv`

`source venv/bin/activate  # On Linux/Mac`

`venv\Scripts\activate     # On Windows`

### 2. Install Required Packages
Install the packages your Streamlit app depends on:

`pip install streamlit pandas numpy`

### 3. Generate requirements.txt
To lock the versions of all installed packages, use the following command:

`pip freeze > requirements.txt`

This creates a requirements.txt file that lists all installed packages along with their specific versions. This file ensures the same package versions are used across development and production environments.

## Example requirements.txt for a Streamlit App
Here’s an example requirements.txt file optimized for a typical Streamlit application running in Keboola:

`streamlit==1.24.0`

`pandas==1.3.5`

`numpy==1.21.6`

`plotly==5.20.0`

`matplotlib==3.7.2`

`requests==2.31.0`

`protobuf==3.19.6`

`validators==0.20.1`

`pydeck==0.8.1b0`

`watchdog==3.0.0`

## Best Practices for Managing Dependencies
1. Keep the File Clean: Only include packages your app explicitly depends on. Avoid unnecessary libraries to keep the environment lightweight.

2. Update Regularly: Periodically update and test your dependencies in a development environment before generating a new requirements.txt file.

3. Always Test Locally: Before deploying in Keboola, verify that your app works locally with the locked package versions.

4. Match Environments: Ensure the Python version in your local setup matches the one used in Keboola (Python 3.10) to avoid version mismatches. 

## Key Takeaways

- Stability Over Time: Fixing package versions protects your app from potential issues caused by updates.
- Reproducibility: All team members and environments will use the exact same versions, minimizing discrepancies.
- Ease of Debugging: Locked versions make it easier to troubleshoot problems since the environment remains consistent.

By locking your package versions, you ensure your Streamlit app runs smoothly in production within Keboola, avoiding disruptions and making future updates easier to manage.
