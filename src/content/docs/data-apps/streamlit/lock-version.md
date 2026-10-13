---
title: Lock package versions
slug: 'data-apps/streamlit/lock-version'
description: Lock Streamlit package versions in Keboola for both deployment methods - from code and from a Git repository.
redirect_from:
  - /components/data-apps/lock-streamlit-version/
  - /components/data-apps/lock-streamlit-version/code-deployment/
  - /components/data-apps/lock-streamlit-version/git-deployment/
  - /data-apps/lock-streamlit-version/
  - /data-apps/lock-streamlit-version/code-deployment/
  - /data-apps/lock-streamlit-version/git-deployment/
---

:::note[Streamlit apps only]
This page applies to [Streamlit](/data-apps/streamlit/) apps only. New apps run on [Python/JS](/data-apps/build-locally/).
:::

This guide explains how to lock package versions in Streamlit applications in Keboola, covering both deployment methods: from code and from a Git repository.

## Why lock package versions?

Locking package versions is essential for:

- **Stability and compatibility:** Avoid disruptions and ensure seamless app functionality by preventing issues with unexpected updates or incompatible package versions.
- **Reproducibility:** Guarantee consistent app behavior across development, testing, and production environments.
- **Ease of debugging:** Simplify troubleshooting and streamline future updates by maintaining a predictable environment.

Choose the deployment method that matches how you deploy your app:

- **[Code deployment](#code-deployment)** — upload or create `requirements.txt` in the Keboola UI, then enable the "Freeze Version" toggle.
- **[Git repository deployment](#git-repository-deployment)** — set up a virtual environment, install packages, and generate `requirements.txt` with `pip freeze`.

## Code deployment

This path explains how to lock package versions in Streamlit applications deployed from code in the Keboola platform.

### Development best practices

The recommended approach is to develop your Streamlit app locally first, as this significantly speeds up the development process. Once your app is working as expected, you can incorporate it into the Keboola environment.

### Locking package versions in Keboola

#### 1. Create and upload requirements.txt

When your app is ready for deployment, you have two options to create your requirements.txt file:

- **Manual creation:** Write the requirements.txt file manually, specifying exact versions for each package
- **Using pip freeze:** Generate the file automatically using `pip freeze > requirements.txt` in your local environment

You can then upload this file through the Keboola UI. On the app's "Overview" tab, click "Upload File" in the "Packages" card (the card shows while "Code" is selected in "Code Source"), then drag the file into the dialog or click "Select File". The dialog takes a `.txt` file of up to 1 MB:

![The Upload requirements.txt File dialog: a drop zone with Select File and a 1 MB limit, and a Save Packages button that stays disabled until you pick a file](/data-apps/streamlit/lock-upload-requirements.png)

Once you pick the file, the dialog shows its content under "Uploaded Packages", where you can still edit it, and asks how to combine it with the packages the app already has:

- "Replace", the default, makes the file's packages the app's only packages.
- "Update" adds the file's packages and keeps the app's other packages. For a package in both, the file's line wins.

![The same dialog after picking requirements.txt: Merge Strategy with Replace selected, the file's three pinned packages under Uploaded Packages, and Save Packages](/data-apps/streamlit/lock-update-requirements.png)

Click "Save Packages" to put them in the "Packages" card.

**Important notes:**
- If a package has a specific version defined, that exact version will be installed
- If no version is specified, the latest version will be installed
- "Save Packages" skips comments, option lines such as `-r requirements.in`, and `name @ url` references
- It also drops every line that starts with `http` or `git+`, which includes packages such as `httpx`
- With "Update", it drops such packages from the app's current list as well; add them back in the "Packages" card

#### 2. Enable version freezing

After uploading your requirements.txt:

1. Turn on the "Freeze Version" toggle in the "Packages" card
2. Click "Deploy", "Redeploy" or "Start", whichever the app's header shows, to propagate this change. "Start" starts a stopped or sleeping app right away with its saved settings. "Deploy" and "Redeploy" open a wizard; click its button of the same name.

   ![The Redeploy wizard of a running Streamlit app, with Deploy settings collapsed to 1.18.0 · XSmall · Sleeps after 15 minutes](/data-apps/redeploy-wizard.png)

This action will:
- Execute a pip freeze command in the app
- Store the frozen dependencies in the app state
- Use these frozen versions for future redeploys and app wake-ups

Once the app has started with frozen versions, the "Packages" card links to them:

![The Packages card after the first start with Freeze Version on: the toggle is on, and a Click Here link opens the packages and versions from the app's requirements.txt](/data-apps/streamlit/lock-freeze-version-toggle.png)

#### 3. Updating package dependencies

To update the requirements for your app:

1. Click "Redeploy" in the app's header (if it shows "Start" instead, the app isn't running: click "Start" and wait until it runs)
2. In the wizard, expand "Deploy settings" and enable the "Update packages dependencies" toggle

   ![The Redeploy wizard with Deploy settings expanded: Backend version, Backend size, Inactivity timeout and the Update packages dependencies switch (off)](/data-apps/streamlit/lock-update-dependencies.png)

3. Click the wizard's "Redeploy" button

"Start" opens no wizard, so the toggle is only in the "Redeploy" wizard. If the toggle isn't there, "Freeze Version" is off or the app hasn't started with it yet. Turn it on in the "Packages" card, click "Deploy", "Redeploy" or "Start" once as in [Enable version freezing](#2-enable-version-freezing). When the app is running, reload the page and click "Redeploy" again.

When this option is enabled:
- All package dependencies will be updated to their latest versions (if no version is explicitly defined)
- The dependencies will be resolved automatically
- The new package versions will be frozen in the app state

## Git repository deployment

This path explains how to lock package versions in Streamlit applications deployed from a Git repository in the Keboola platform.

Follow this [tutorial](https://packaging.python.org/en/latest/tutorials/packaging-projects/) to package a simple Python project, set up the required files and structure, build the package, and upload it to the Python Package Index. For information on installing dependencies, refer to the [Streamlit documentation](https://docs.streamlit.io/knowledge-base/dependencies).

### How to lock package versions
To ensure your Streamlit app runs reliably in Keboola, follow these steps to lock package versions:

- [Set up a virtual environment](#set-up-a-virtual-environment)
- [Install required packages](#install-required-packages)
- [Generate a requirements.txt file](#generate-requirementstxt)

#### Set up a virtual environment
Create and activate a Python virtual environment to isolate your app's dependencies:

```bash
python3 -m venv venv
source venv/bin/activate   # Linux/macOS
venv\Scripts\activate      # Windows
```

#### Install required packages
Install the necessary packages for your Streamlit app:

```bash
pip install streamlit pandas numpy
```

#### Generate requirements.txt
Generate a `requirements.txt` file to lock the versions of all installed packages:

```bash
pip freeze > requirements.txt
```

This file lists all installed packages along with their specific versions. It ensures consistent package versions across environments (development and production) and prevents dependency conflicts.

***Note:** After updating or installing a new dependency, remember to run `pip freeze` again to update your `requirements.txt` file.*

### Example requirements.txt for a Streamlit app
Below is an example of the *shape* of a locked `requirements.txt` for a Streamlit app in Keboola. The versions shown are illustrative — pin the current versions your app actually uses (see the [backend versions](/data-apps/streamlit/#backend-versions) for what ships pre-installed):

```text
streamlit==1.24.0
pandas==1.3.5
numpy==1.21.6
plotly==5.20.0
matplotlib==3.7.2
requests==2.31.0
protobuf==3.19.6
validators==0.20.1
pydeck==0.8.1b0
watchdog==3.0.0
```

## Best practices

These apply to both deployment methods:

- **Minimal dependencies:** include only the packages your app actually needs.
- **Update regularly:** periodically review and update dependencies, testing in a development environment before updating production.
- **Test locally:** verify the app works with the locked versions locally before deploying to Keboola.
- **Match environments:** use the same Python version locally as Keboola to prevent version mismatches.
- **Document:** keep track of why specific versions are pinned to help future maintenance.
