---
title: Backend Versions
permalink: /components/data-apps/backend-versions/
---

* TOC
{:toc}

When deploying a data app, you can select a **backend version** from a dropdown in the deployment wizard.
Each backend version defines the runtime environment your app runs in, including the Python version, Streamlit version,
and a set of pre-installed packages.

## Version Format

Each backend version is displayed in the following format:

```
<backend_version> - Python <python_version> + Streamlit <streamlit_version>
```

For example: `1.15.2 - Python 3.13 + Streamlit 1.51`

This means:

- **Backend version** (`1.15.2`): The release version of the base Docker image that powers your data app. Newer backend versions may include updated pre-installed packages, bug fixes, and infrastructure improvements.
- **Python version** (`3.13`): The version of the Python interpreter. Different Python versions offer different language features and performance characteristics.
- **Streamlit version** (`1.51`): The version of the [Streamlit](https://streamlit.io/) framework used to run your app.

## Choosing a Version

Starting with backend version **1.15.0**, each release is available in multiple Python variants. Currently, the following Python versions are offered:

| Python Version | Notes |
|---|---|
| **3.10** | Default. Most widely compatible with third-party packages. Recommended if you are unsure. |
| **3.11** | Faster execution in many workloads (10–60% speedup over 3.10). Good balance of compatibility and performance. |
| **3.13** | Latest stable Python release. Best performance and newest language features, but some packages may not yet support it. |

**Recommendations:**

- **Stick with the default (Python 3.10)** if your app relies on packages that may not yet support newer Python versions, or if you want maximum compatibility.
- **Choose Python 3.11 or 3.13** if you need better performance or want to use newer Python language features, and you have verified that your dependencies support the chosen version.
- **Use an older backend version** only if you need to match a previously tested environment for stability. Older versions remain available in the dropdown.

## Pre-installed Packages

All backend versions ship with the same set of pre-installed packages regardless of the Python variant.
These packages are available immediately without adding them to the `Packages` field or `requirements.txt`:

- `streamlit`
- `pandas`
- `numpy`
- `matplotlib`
- `plotly`
- `scikit-learn`
- `seaborn`
- `graphviz`
- `deepmerge`
- `python-dotenv`
- `keboola.component`
- `streamlit-aggrid`
- `streamlit-keboola-api`
- `streamlit_authenticator` (pinned to 0.3.1)
- `toml`

To add packages beyond this list, specify them in the **Packages** field (for code deployment) or in a `requirements.txt` file (for Git repository deployment). Custom packages are installed on top of the pre-installed set and will not conflict with it.

{% include tip.html content="If you need to pin a specific version of a pre-installed package, you can override it by specifying the desired version in the Packages field or in your requirements.txt." %}

## Release Changelog

Below is a summary of changes in each backend version. This information is published here because the source
repository is private.

### 1.15.2
*Released: February 9, 2026*

- Improved AgGrid Enterprise License integration (license key is now extracted automatically from configuration).

### 1.15.1
*Released: February 4, 2026*

- CI/CD improvements for multi-image build pipeline.

### 1.15.0
*Released: February 4, 2026*

- **Python version selection**: Backend images are now available in multiple Python variants (3.10, 3.11, 3.13). Previously, only Python 3.10 was available.
- All dependencies are locked per Python variant for reproducible builds.

### 1.14.1
*Released: January 6, 2026*

- Fixed an issue with public IP address auto-detection that could cause startup problems in certain network configurations.

### 1.14.0
*Released: December 18, 2025*

- Added support for custom PIP repositories in the app configuration, allowing installation of packages from private or alternative package indexes.

### 1.13.3
*Released: December 16, 2025*

- Improved package installation reliability using `uv` package manager.

### 1.13.2
*Released: December 10, 2025*

- Fixed environment file formatting issue that could cause configuration parsing errors.

### 1.13.1
*Released: November 28, 2025*

- Fixed an issue where Python commands were not properly routed through the `uv` package manager.

### 1.13.0
*Released: November 26, 2025*

- `KBC_URL` and `KBC_TOKEN` are now automatically injected into `secrets.toml`, making them accessible via `st.secrets["kbc_url"]` and `st.secrets["kbc_token"]`.
- Improved configuration and secrets handling from `config.json`.

### 1.12.1
*Released: November 2025*

- Switched CI/CD pipeline to GitHub Actions.
- Added automatic semantic version releases.

### 1.12.0
*Released: November 2025*

- Replaced `pip` with [`uv`](https://docs.astral.sh/uv/) for significantly faster package installation and dependency resolution.
- Performance optimizations for container startup.
