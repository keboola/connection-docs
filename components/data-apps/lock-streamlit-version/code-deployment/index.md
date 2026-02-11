---
title: Code Deployment
permalink: /data-apps/lock-streamlit-version/code-deployment/
redirect_from:
  - /components/data-apps/lock-streamlit-version/code-deployment/
---

* TOC
{:toc}

This guide explains how to lock package versions in Streamlit applications deployed from code in the Keboola platform.

Locking package versions is essential for:   

- **Stability and compatibility:** Avoid disruptions and ensure seamless app functionality by preventing issues with unexpected updates or incompatible package versions.
- **Reproducibility:** Guarantee consistent app behavior across development, testing, and production environments. 
- **Ease of debugging:** Simplify troubleshooting and streamline future updates by maintaining a predictable environment.

## Development Best Practices

The recommended approach is to develop your Streamlit app locally first, as this significantly speeds up the development process. Once your app is working as expected, you can incorporate it into the Keboola environment.

## Locking Package Versions in Keboola

### 1. Create and Upload requirements.txt

When your app is ready for deployment, you have two options to create your requirements.txt file:

- **Manual creation:** Write the requirements.txt file manually, specifying exact versions for each package
- **Using pip freeze:** Generate the file automatically using `pip freeze > requirements.txt` in your local environment

You can then upload this file directly through the Keboola UI:

{: .image-popup}
![Upload Requirements](/components/data-apps/lock-streamlit-version/code-deployment/upload-requirements.png)

You can also update requirements.txt in the UI:

{: .image-popup}
![Update Requirements](/components/data-apps/lock-streamlit-version/code-deployment/update-requirements.png)

**Important notes:**
- If a package has a specific version defined, that exact version will be installed
- If no version is specified, the latest version will be installed
- You can edit the requirements.txt content directly in the UI before uploading if needed

### 2. Enable Version Freezing

After uploading your requirements.txt:

1. Toggle the "Freeze versions" option in the UI
2. Click "Start Data App" to propagate this change

{: .image-popup}
![Freeze Version Toggle](/components/data-apps/lock-streamlit-version/code-deployment/freeze-version-toggle.png)

This action will:
- Execute a pip freeze command in the app
- Store the frozen dependencies in the Data App state
- Use these frozen versions for future redeploys and app wake-ups

{: .image-popup}
![Start Data App](/components/data-apps/lock-streamlit-version/code-deployment/start-data-app.png)

### 3. Updating Package Dependencies

To update the requirements for your app:

1. Start the Data App
2. Enable the "Update packages dependencies" toggle

{: .image-popup}
![Update Dependencies](/components/data-apps/lock-streamlit-version/code-deployment/update-dependencies.png)

When this option is enabled:
- All package dependencies will be updated to their latest versions (if no version is explicitly defined)
- The dependencies will be resolved automatically
- The new package versions will be frozen in the Data App state

## Best Practices for Package Management

- **Regular Updates:** Periodically review and update your dependencies to ensure security and performance improvements
- **Version Testing:** Always test your app with new package versions in a development environment before updating production
- **Documentation:** Keep track of why specific package versions are required to help with future maintenance
- **Minimal Dependencies:** Only include packages that are actually needed by your application  