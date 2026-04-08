---
title: Custom Python
permalink: /components/applications/custom-python/
---

* TOC
{:toc}

This component lets you run custom Python code directly in Keboola. Use it to call external APIs,
process files, push data to third-party systems, or build any integration that isn't covered by an existing connector —
all without leaving Keboola.

{: .image-popup}
![Screenshot - Custom Python Component Overview](/components/applications/custom-python/custom-python-0.png)

## When to Use Custom Python

| Scenario | Use |
|---|---|
| Transform or aggregate data already in Keboola Storage | [Python Transformation](/transformations/python-plain/) |
| Connect to an external API or service, download or push data | **Custom Python** |
| Store and use sensitive credentials (API keys, passwords, tokens) | **Custom Python** |
| Share logic across multiple Keboola projects | **Custom Python** |

## Key Features

- **Secure parameters** — Encrypt API keys, tokens, and passwords directly in the Keboola UI using the `#` prefix.
- **Flexible code source** — Write code in the Keboola UI, or load it from a Git repository.
- **Clean environment** — Each run uses an isolated container. Install only the packages you need.
- **Multiple Python versions** — Choose Python 3.12, 3.13, or 3.14.

## Configuration

[Create a new configuration](/components/#creating-component-configuration) of the **Custom Python** application.

### Python Version

{: .image-popup}
![Screenshot - Python Version Selection](/components/applications/custom-python/custom-python-1.png)

Select the Python version for your code:

- **3.13** *(recommended)* — Isolated environment with only the packages you install.
- **3.14** — Isolated environment (release candidate).
- **3.12** — Isolated environment.
- **base** — Shared environment (Python 3.10) with many pre-installed packages in legacy versions. Not recommended; will be deprecated in the future.

{% include tip.html content="Use an isolated environment (Python 3.12 or newer) to avoid package version conflicts and keep your code maintainable." %}

### Source Code & Dependencies

Choose where your Python code comes from:

**Enter manually into text areas below** *(default)*

{: .image-popup}
![Screenshot - Inline Code Source](/components/applications/custom-python/custom-python-3-code.png)

Write or paste your code directly in the Keboola UI. Use the **Python Packages** field to list any extra packages to install.

**Get from Git repository**

Load code from a public or private Git repository. See [Git Configuration](#git-configuration) below.

### User Parameters

{: .image-popup}
![Screenshot - User Parameters](/components/applications/custom-python/custom-python-2.png)

Use **User Parameters** to pass configuration values to your code — for example an API base URL,
a target table name, or debug flags. Enter them as a JSON object.

Any key starting with `#` (e.g., `#api_key`) will be **encrypted** when you save the configuration.
The decrypted value is available to your code at runtime via `CommonInterface`.

## Git Configuration

When using **Get from Git repository** as your code source, fill in the repository settings:

{: .image-popup}
![Screenshot - Git Repository Configuration](/components/applications/custom-python/custom-python-3-git.png)

- **Repository URL** — Supports both HTTPS and SSH formats.
- **Repository Visibility & Authentication** — Choose one of:
  - **Public – None** — Public repository, no credentials needed.
  - **Private – Personal Access Token** — The token is encrypted in Keboola Storage.
  - **Private – SSH Key** — The private key is encrypted in Keboola Storage.
- **Branch Name** — The branch to check out. Defaults to `main`. Use **List Branches** to pick from the repository.
- **Script Filename** — The Python file to run. Defaults to `main.py`. Use **List Files** to pick from the repository.

### Dependencies

Place your dependency file in the repository root:

- `pyproject.toml` + `uv.lock` *(recommended)* — Modern approach using [uv](https://docs.astral.sh/uv/).
- `requirements.txt` — Legacy approach.

If both are present, `pyproject.toml` + `uv.lock` takes precedence.

## Writing Your Code

Your code communicates with Keboola Storage and configuration via the
[`keboola-component`](https://pypi.org/project/keboola-component/) Python library and `CommonInterface`.

The following snippet is pre-filled in every new configuration and shows the basic pattern:

```python
from keboola.component import CommonInterface

ci = CommonInterface()
# Access user parameters defined in the configuration
print(ci.configuration.parameters)
```

For the full `CommonInterface` reference — including reading input tables, writing output tables,
working with files, state files, error handling, and logging — see the
[Developer Documentation](https://developers.keboola.com/extend/component/tutorial/).

## Example Repository

We have prepared a [simple example project](https://github.com/keboola/component-custom-python-example-repo-1)
to help you get started with running code from a Git repository. It can also serve as a template for your own projects.
