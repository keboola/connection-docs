---
title: How to Lock Package Versions in Streamlit Applications in Keboola (Deploying from Git Repository)
permalink: /components/data-apps/lock-streamlit-version/
---

* TOC
{:toc}

This guide explains how to lock package versions in Streamlit applications deployed from a GIT repository in the Keboola platform. 

Locking package versions is essential for:   

- **Stability and compatibility:** Prevent disruptions and ensure your app works seamlessly by avoiding issues with unexpected updates or incompatible package versions.
- **Reproducibility:** Guarantee consistent app behavior across development, testing, and production environments. 
- **Ease of Debugging:** Simplify troubleshooting and streamline future updates by maintaining a predictable environment.
  
## How to Lock Package Versions
To ensure your Streamlit app runs reliably in Keboola, follow these steps to lock package versions:

- [Set up a virtual environment](#set-up-a-virtual-environment)
- [Install required packages](#install-required-packages)
- [Generate a requirements.txt file](#generate-requirementstxt)
  
### Set Up a Virtual Environment
Create and activate a Python virtual environment to isolate your app’s dependencies:

`python3 -m venv venv`

`source venv/bin/activate  # On Linux/Mac`

`venv\Scripts\activate     # On Windows`

### Install Required Packages
Install the necessary packages for your Streamlit app:

`pip install streamlit pandas numpy`

### Generate requirements.txt
Generate a `requirements.txt` file to lock the versions of all installed packages:

`pip freeze > requirements.txt`

This file lists all installed packages along with their specific versions. It ensures consistent package versions across environments (development and production) and prevents dependency conflicts.

***Note:** After updating or installing a new dependency, remember to run `pip freeze` again to update your `requirements.txt` file.*

## Example requirements.txt for a Streamlit App
Below is an example optimized for a typical Streamlit app running in Keboola:

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
Following these best practices will help you maintain a stable, efficient, and consistent environment for your Streamlit applications in Keboola.

- **Keep it Clean:** Include only the necessary packages to keep the environment lightweight.
- **Update Regularly:** Periodically update and test dependencies in a development environment before generating a new `requirements.txt` file.
- **Test Locally:** Verify that your app works correctly with the locked package versions in a local environmnet before deploying it in Keboola.
- **Match Environments:** Use the same Python version in your local setup with Keboola's version (Python 3.10) to prevent version mismatches.
