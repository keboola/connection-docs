---
title: Streamlit apps
slug: 'data-apps/streamlit'
description: Build and manage Streamlit apps in Keboola — a Python-only framework for quick data tools.
redirect_from:
  - /components/data-apps/streamlit/
  - /components/data-apps/backend-versions/
---



Streamlit is a Python-only framework for building data tools quickly. It remains supported for existing apps and simple internal tools.

:::note[Streamlit apps only]
Everything in this section applies to **Streamlit** apps only. New apps — including everything Kai builds — run on [Python/JS](/data-apps/build-locally/); see [What are Keboola apps](/data-apps/what-are-apps/#the-stack-pythonjs).
:::

<!-- TODO(human-review, Miro): confirm the positioning. Streamlit is supported but on a deprecation path internally; do NOT state it is retired. Keep this subtree clearly scoped as "Streamlit-specific". -->
Ready to move an app to the current stack? See [Migrate a Streamlit app to Python/JS](/data-apps/streamlit/migrate-to-python-js/).

## In this section

- **[Design guide](/data-apps/streamlit/design-guide/)** — layout and styling patterns for Streamlit apps.
- **[Lock the Streamlit version](/data-apps/streamlit/lock-version/)** — pin your app to a specific Streamlit version.
- **[Migrate to Python/JS](/data-apps/streamlit/migrate-to-python-js/)** — move an existing Streamlit app to the current stack with Kai.

<!-- TODO(human-review, Miro): design-guide.md and lock-version.md were created from the moved/merged source (former top-level general-design-guide + the three lock-streamlit-version pages). Verify the content. -->

## Build a Streamlit app

### Prerequisites

* Basic Python programming knowledge
* Familiarity with data manipulation (pandas, numpy)
* Understanding of data visualization concepts

### Create your first Streamlit app

1. **Navigate to Apps** in your Keboola project.
2. Click the **+** button to create a new app.
3. Enter a **custom prefix** for your app's URL.
4. Select **Streamlit** as the technology stack.
5. Choose a deployment method (Code or Git repository).

![Custom URL prefix](/data-apps/streamlit/custom-data-app-url.png)

### Deployment methods

There are two ways to deploy a Streamlit app: Code and Git repository.

#### Code

For simple use cases where your Streamlit code fits on one page, paste the code directly into a text area. This deployment type is ideal for simple apps or for testing.

![Code deployment](/data-apps/streamlit/development-type-code.png)

For example, paste [Streamlit's "Uber pickups in NYC" tutorial app](https://docs.streamlit.io/library/get-started/create-an-app#lets-put-it-all-together):

```python
import streamlit as st
import pandas as pd
import numpy as np

st.title('Uber pickups in NYC')

DATE_COLUMN = 'date/time'
DATA_URL = ('https://s3-us-west-2.amazonaws.com/'
            'streamlit-demo-data/uber-raw-data-sep14.csv.gz')

@st.cache_data
def load_data(nrows):
    data = pd.read_csv(DATA_URL, nrows=nrows)
    lowercase = lambda x: str(x).lower()
    data.rename(lowercase, axis='columns', inplace=True)
    data[DATE_COLUMN] = pd.to_datetime(data[DATE_COLUMN])
    return data

data = load_data(10000)

st.subheader('Number of pickups by hour')
hist_values = np.histogram(data[DATE_COLUMN].dt.hour, bins=24, range=(0, 24))[0]
st.bar_chart(hist_values)

st.subheader('Map of all pickups')
st.map(data)
```

You can also override Streamlit defaults like file upload size or browser settings without committing a `.streamlit/config.toml` file - see [Streamlit configuration](#streamlit-configuration) below.

To use additional Python packages that are not already included in the [base image](#base-image), enter them into the `Packages` field.

![Packages](/data-apps/streamlit/packages.png)

#### Git repository

If you have a complex application, push your app sources into GitHub and link the repository in this section. Provide the Project URL, choose the right branch, and finally, select your main entrypoint file.

![Git repository](/data-apps/streamlit/git-repository-public.png)

If you are using a private repository, you have two options to authenticate:
- With your GitHub username and personal access token
- With an SSH private key

Follow these steps to authenticate using your GitHub username and personal access token:

1. Generate a personal access token on GitHub by going to your GitHub account settings, selecting **Developer settings > Personal access tokens**, and clicking **Generate new token**. Ensure the token has the necessary permissions to access the repository.
2. In Keboola, navigate to the **App Repository** in your app configuration, check the `Private` option, and enter your GitHub username and the personal access token you generated in step 1.
3. Click **Save** to authenticate with the private repository.

To authenticate using your SSH private key, follow the instructions in the [GitHub manual](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent). After generating your key, enter your SSH private key into the appropriate configuration field and click **Save**.

![Private repository SSH](/data-apps/streamlit/git-repository-private-ssh.png)

## Secrets

To provide your app with environment variables or sensitive information like credentials, API keys, etc., use the Secrets section. These secrets will be injected into the `secrets.toml` file upon deployment of the app.

When you upload `secrets.toml` using the direct secrets upload UI, Keboola imports secrets as flat, top-level keys. Sections (TOML groups) are not preserved as nested structures. This means keys in the file become `st.secrets["your_key"]` after upload - you cannot access them as `st.secrets["group"]["key"]`. If your app expects nested secrets, use repo-based secrets.

[Read more about the Streamlit secrets](https://docs.streamlit.io/streamlit-community-cloud/get-started/deploy-an-app/connect-to-data-sources/secrets-management).

### Direct secrets upload
You can upload a `secrets.toml` file directly through the UI when developing an app from code. The upload process:
- Overwrites existing secrets with matching names.
- Preserves existing secrets that don't match the uploaded ones.
- Creates new secrets if they don't exist.
- Does not delete any existing secrets.

Example `secrets.toml` structure:
```toml
aws_key = "YOUR_AWS_KEY"
aws_secret = "YOUR_AWS_SECRET"
openai = "YOUR_OPENAI_KEY"
```

### Best practices
1. Always use descriptive secret names to improve clarity.
2. Back up your secrets configuration regularly.
3. Review existing secrets before uploading new ones to avoid unintentional overwrites.
4. If you need nested/groups, use repo-based secrets. Direct upload does not support nested access.

## Access Storage from app

Your app reads and writes Keboola Storage the same way any app does — via Input Mapping, the Storage API at runtime, or real-time Storage Access. Keboola injects `KBC_URL` and `KBC_TOKEN` (the Storage token) into the app automatically. For the patterns and code, see [Data access](/data-apps/reference/#data-access) and [Environment variables](/data-apps/reference/#environment-variables) in the reference.

The `keboola-streamlit` package wraps these for Streamlit with helpers like `keboola.read_table` and `keboola.write_table` — see the [Streamlit design guide](/data-apps/streamlit/design-guide/#keboola-storage-communication).

## Runtime and language support

Backend versions since **1.15.0** are available in multiple Python variants:

| Python Version | Notes |
|---|---|
| **3.10** | Default. Most widely compatible with third-party packages. Recommended if you are unsure. |
| **3.11** | Faster execution in many workloads (10–60% speedup over 3.10). Good balance of compatibility and performance. |
| **3.13** | Latest stable Python release. Best performance and newest language features, but some packages may not yet support it. |

<!-- VERIFY(Adam Vyborny): the current page says Python 3.10 only. Confirmed stale — supported versions are 3.10, 3.11, and 3.13. -->

## Backend versions

When deploying an app, you can select a **backend version** from a dropdown in the deployment wizard. Each backend version defines the runtime environment, including the Python version, Streamlit version, and a set of pre-installed packages.

Each backend version is displayed in the following format:

```
<backend_version> - Python <python_version> + Streamlit <streamlit_version>
```

For example: `1.15.2 - Python 3.13 + Streamlit 1.51`.

- **Backend version** (`1.15.2`): The release version of the base Docker image that powers your app.
- **Python version** (`3.13`): The version of the Python interpreter.
- **Streamlit version** (`1.51`): The version of the [Streamlit](https://streamlit.io/) framework used to run your app.

### Pre-installed packages

All backend versions ship with the same set of pre-installed packages regardless of the Python variant. These are available immediately without adding them to the `Packages` field or `requirements.txt`:

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

To add packages beyond this list, specify them in the **Packages** field (for code deployment) or in a `requirements.txt` file (for Git repository deployment).

<!-- TODO(human-review, Michal Jerabek): NO-SOURCE in Loop A — the backend-versions changelog could not be verified against a reachable source. Confirm current backend versions and the hosting model (Operator today; E2B pending sign-off) before publishing. -->

## Theming
To configure theming in your app, you can select from predefined themes or create a custom theme. Predefined themes include `Keboola`, `Light Red`, `Light Purple`, `Light Blue`, `Dark Green`, `Dark Amber`, and `Dark Orange`. Each theme has a specified primary color, background color, secondary background color, text color, and font. Users choosing `Custom` can manually set these values.

![Predefined themes](/data-apps/streamlit/theming-predefined.png)

For `Custom`, users can select colors using the color pickers and choose the desired font from a list. For the exact color values of each predefined theme, see the [predefined theme reference](#predefined-theme-reference) at the bottom of this page.

For Streamlit configuration beyond theming (e.g. upload size, server or browser settings), see [Streamlit configuration](#streamlit-configuration) below.

## Streamlit configuration

Beyond the predefined themes above, you can inject any [Streamlit configuration option](https://docs.streamlit.io/develop/api-reference/configuration/config.toml) into your app's runtime `config.toml` directly from the app configuration in Keboola. This is useful when your app is deployed via the **Code** method (no Git repo, where you would otherwise commit a `.streamlit/config.toml` file) and you need to override Streamlit defaults such as upload size, server settings, or browser behavior.

### Setting a custom config.toml

In your app configuration, switch to the raw JSON editor and add a `config.toml` string under `parameters.dataApp.streamlit`:

```json
{
  "parameters": {
    "dataApp": {
      "streamlit": {
        "config.toml": "[server]\nmaxUploadSize = 500\n"
      }
    }
  }
}
```

The data app runtime extracts that string at startup and merges it into Streamlit's runtime config in this order, with later values winning:

1. Streamlit's built-in defaults
2. Keboola's runtime defaults (sets `[server] address = "0.0.0.0"` and `[browser] gatherUsageStats = false`)
3. Your repository's `.streamlit/config.toml` (if Git-deployed)
4. The `config.toml` string injected via the app configuration above

### Common use cases

**Increase `st.file_uploader` size limit.** Streamlit defaults to 200 MB. To accept larger files:

```toml
[server]
maxUploadSize = 500
```

**Disable usage stats:**

```toml
[browser]
gatherUsageStats = false
```

**Streamlit theme options not exposed in the Theming form** (e.g. `base = "dark"`, additional font controls, newly-added Streamlit theme keys) - see [Streamlit's theme reference](https://docs.streamlit.io/develop/concepts/configuration/theming).

> **Note on theming:** the **Theming** UI reads and rewrites the same `config.toml` field. Non-theme sections you set here (e.g. `[server]`, `[browser]`) are preserved when you save changes through the Theming UI. However, the Theming UI overwrites the `[theme]` section on save, so prefer the Theming UI when a value is available there - and use this raw JSON path for theme keys it doesn't expose.

## Base image
When the app is deployed, the code you provide is injected into the Streamlit base Docker image. You select a **backend version** when deploying; each version defines the Python version, Streamlit version, and a set of pre-installed packages you can use without adding them to the `Packages` field.

For the list of backend versions, supported Python versions, and the full pre-installed package list, see [Backend versions](#backend-versions) below.

## AgGrid Enterprise license
The AgGrid Enterprise License is available for Streamlit apps in Keboola, offering enhanced data manipulation capabilities, including:

- Inline dataset editing.
- Advanced features such as pivoting, filtering, and sorting.
- A professional interface, free from the "trial use only" watermark.

Ensure your app is configured to use the AgGrid component to take advantage of these enhanced features.

### How to enable the license
The **enterprise license** is **pre-configured for all Keboola stacks**, so no additional setup is required for supported applications.

To access the license key in your Streamlit app, use the following code:

```python
import streamlit as st
from keboola_streamlit import KeboolaStreamlit

URL = st.secrets["kbc_url"]
TOKEN = st.secrets["kbc_token"]

keboola = KeboolaStreamlit(URL, TOKEN)
license_key = keboola.aggrid_license_key
```

You can use this license_key directly in **AgGrid**.

**Reference implementation:**
[Keboola Streamlit Integration](https://github.com/keboola/keboola_streamlit/blob/main/src/keboola_streamlit/keboola_streamlit.py#L31)

## Predefined theme reference

Color values for each predefined theme. All use the **Sans Serif** font. Choose `Custom` to set your own.

| Theme | Primary | Background | Secondary background | Text |
|---|---|---|---|---|
| Keboola | `#1F8FFF` | `#FFFFFF` | `#E6F2FF` | `#222529` |
| Light Red | `#FF5D5D` | `#FFFFFF` | `#FFE6E6` | `#222529` |
| Light Purple | `#9A6DD7` | `#FFFFFF` | `#F2E6FF` | `#222529` |
| Light Blue | `#0000B2` | `#FFFFFF` | `#E6E6FF` | `#222529` |
| Dark Green | `#4CAF50` | `#222529` | `#3D4F41` | `#FFFFFF` |
| Dark Amber | `#FFC107` | `#222529` | `#4A3A24` | `#FFFFFF` |
| Dark Orange | `#FFA500` | `#222529` | `#4A3324` | `#FFFFFF` |

---

That completes the Apps section. Back to the [Apps overview](/data-apps/).
