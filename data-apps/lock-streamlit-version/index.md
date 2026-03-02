---
title: Locking Package Versions
permalink: /data-apps/lock-streamlit-version/
redirect_from:
  - /components/data-apps/lock-streamlit-version/
---

* TOC
{:toc}

This guide explains how to lock package versions in Streamlit applications in Keboola, covering both deployment methods: from code and from Git repository.

## Why Lock Package Versions?

Locking package versions is crucial for:
- **Stability and compatibility:** Prevent issues from unexpected updates
- **Reproducibility:** Ensure consistent behavior across environments
- **Ease of debugging:** Maintain a predictable environment for troubleshooting

## Deployment Methods

1. **For Code Deployment:**
   - Upload or create requirements.txt in Keboola UI
   - Enable "Freeze versions" toggle
   - Start the Data App to apply changes

2. **For Git Repository:**
   - Set up virtual environment
   - Install required packages
   - Generate requirements.txt using pip freeze
   - Include file in your repository

Choose the appropriate guide above for detailed step-by-step instructions based on your deployment method.
