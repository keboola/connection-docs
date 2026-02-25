---
title: Python/JS Data Apps
permalink: /data-apps/python-js/
---

* TOC
{:toc}

## Overview

Python/JavaScript Data Apps give you full control over what you build and how you build it. Unlike Streamlit Data Apps -- which use a ready-made Python environment -- Python/JS Data Apps let you use **any Python web framework** (Flask, FastAPI, Dash), serve a **JavaScript frontend**, or combine both. You bring the code; Keboola handles the hosting, access control, and data connectivity.

This guide assumes you are building with the help of an AI assistant. Every step is explained in plain language -- no deep technical knowledge required.

{% include tip.html content="**New to Data Apps?** Read the [Data Apps overview](/data-apps/) first to understand what Data Apps are and when to use them. If you want the simplest path and are building in Python, consider starting with [Streamlit Data Apps](/data-apps/streamlit/) instead." %}

## How It Works

When you deploy a Python/JS Data App, Keboola:

1. Clones your GitHub repository into the app container.
2. Runs your `setup.sh` script to install dependencies.
3. Starts your application using the process configuration you provide.
4. Routes all traffic through an internal web server (Nginx) that listens on port 8888.
5. Makes your app available at a secure URL.

You do not manage servers, ports, or Docker. You only manage your code and a small configuration folder called `keboola-config`.

```
Your browser -> Keboola -> Nginx (port 8888) -> Your app (internal port, e.g. 5000)
```

## What You Need Before Starting

* A **GitHub account** (free). Your app code lives here.
* A **Keboola project** with Data Apps available.
* Basic comfort with creating files and folders -- an AI assistant can generate all the code for you.

You do **not** need to install Python, Node.js, or any development tools on your computer. Everything runs inside Keboola's infrastructure.

## Repository Structure -- The Golden Rule

Every Python/JS Data App repository **must** follow this structure. Missing any piece will cause the deployment to fail.

```
your-repo/
├── keboola-config/             <- Required. Keboola reads this folder on startup.
│   ├── nginx/
│   │   └── sites/
│   │       └── default.conf    <- Required. Tells the web server how to reach your app.
│   ├── supervisord/
│   │   └── services/
│   │       └── app.conf        <- Required. Tells Keboola how to start your app.
│   └── setup.sh                <- Required if your app has dependencies. Installs them on startup.
├── pyproject.toml              <- Required for Python apps. Lists your Python packages.
└── app.py                      <- Your application code (name and structure are up to you).
```

**Important:** The `keboola-config` folder name and the subfolder paths inside it are exact -- do not rename them or change the folder hierarchy.

## Step 1 -- Create Your GitHub Repository

1. Go to [github.com](https://github.com/) and sign in.
2. Click **New repository**.
3. Give it a name (e.g., `my-keboola-app`).
4. Set it to **Public** or **Private** (both work; private requires extra credentials in Keboola -- see Step 5).
5. Click **Create repository**.

You now have an empty repository. Next, you will add your app code and configuration files.

{% include tip.html content="If you are using an AI assistant, tell it: *\"Create a Python Flask app for Keboola Data Apps with the required keboola-config folder structure.\"* It will generate all the files you need." %}

## Step 2 -- Write Your Application Code

Your app can be written in Python or JavaScript (Node.js). The only firm rules are:

* Your app must listen on an **internal port** (common choices: `5000` for Flask/FastAPI, `3000` for Node.js, `8050` for Dash).
* Your app must respond to both **GET and POST requests** on the root path (`/`). Keboola sends a POST request to `/` when it starts your app to check that it is running.

### Python example (Flask)

```python
# app.py
from flask import Flask
import os

app = Flask(__name__)
PORT = int(os.environ.get("PORT", 5000))

@app.route("/", methods=["GET", "POST"])   # POST is required -- Keboola checks this on startup
def index():
    return "<h1>Hello from Keboola!</h1>"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT)
```

### Node.js example (Express)

```javascript
// server.js
import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

app.all('/', (req, res) => {          // app.all handles both GET and POST
    res.send('<h1>Hello from Keboola!</h1>');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`App running on port ${PORT}`);
});
```

{% include warning.html content="**Common mistake:** If your root route only handles GET (`@app.route(\"/\")` in Flask or `app.get('/')` in Express), Keboola's startup check will receive a \"Method Not Allowed\" error and your app will appear broken even though it works locally. Always allow POST on `/`." %}

## Step 3 -- Create the `keboola-config` Folder

This folder is the bridge between your code and Keboola's infrastructure. You need three files inside it.

### File 1: `keboola-config/nginx/sites/default.conf`

This file configures Nginx -- the web server that sits in front of your app. The only thing you need to change is the **port number** to match what your app listens on.

```
server {
    listen 8888;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:5000;    # Change 5000 to your app's port
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

If your app uses **WebSockets** (for example, Dash or any app with live-updating content), add these lines inside the `location /` block:

```
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
```

**What is Nginx?** Nginx (pronounced "engine-x") is a web server that handles incoming traffic and forwards it to your application. Think of it as a reception desk -- visitors arrive at port 8888, and Nginx sends them to wherever your app is actually running.

### File 2: `keboola-config/supervisord/services/app.conf`

This file tells Keboola's process manager (Supervisord) how to start your application.

**For Python (Flask/FastAPI):**

```
[program:app]
command=uv run python /app/app.py
directory=/app
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
```

**For Python (FastAPI with uvicorn):**

```
[program:app]
command=uv run uvicorn app:app --host 127.0.0.1 --port 5000
directory=/app
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
```

**For Node.js:**

```
[program:app]
command=node /app/server.js
directory=/app
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
```

Rules to follow:

* Always use **absolute paths** starting with `/app/` (e.g., `/app/app.py`, not `./app.py`).
* For Python commands, always prefix with `uv run` (see [Key Terms Explained](#key-terms-explained) for why).
* Do **not** add a `[program:nginx]` section -- Nginx is managed by Keboola automatically.

{% include tip.html content="**What is Supervisord?** Supervisord is a process manager -- software that starts your application and automatically restarts it if it crashes. Think of it as a watchdog for your app." %}

### File 3: `keboola-config/setup.sh`

This script runs once when the container starts, before your app launches. Its job is to install all dependencies.

**For Python apps:**

```bash
#!/bin/bash
set -Eeuo pipefail
cd /app && uv sync
```

**For Node.js apps:**

```bash
#!/bin/bash
set -Eeuo pipefail
cd /app && npm install
```

**For apps with both Python and Node.js:**

```bash
#!/bin/bash
set -Eeuo pipefail
cd /app && uv sync &
cd /app/frontend && npm install &
wait
```

{% include tip.html content="**Note:** Keboola automatically makes `setup.sh` executable before running it. If you are testing locally outside of Keboola, you may need to run `chmod +x keboola-config/setup.sh` yourself." %}

## Step 4 -- Define Your Dependencies

### Python: `pyproject.toml`

Python apps must list their dependencies in a `pyproject.toml` file at the root of your repository. A plain `requirements.txt` file is **not sufficient** -- Keboola uses a modern Python tool called `uv` that requires `pyproject.toml`.

```toml
[project]
name = "my-keboola-app"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "flask>=3.0.0",
    "pandas>=2.0.0",
    "requests>=2.31.0",
]

[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"
```

Replace the packages in `dependencies` with whatever your app needs. Add one package per line, using `>=` to specify the minimum version.

{% include tip.html content="**What is `uv`?** `uv` is a fast Python package manager -- it is the tool Keboola uses to install your Python libraries. Instead of the older `pip install` command, Keboola uses `uv sync`, which reads your `pyproject.toml` and installs everything listed there. You don't need to call `uv` directly from your application code. The `uv sync` command in your `setup.sh` runs automatically before your app starts, installing everything listed in `pyproject.toml`." %}

{% include tip.html content="**What is `pip`?** `pip` is the traditional Python package installer. You may have seen commands like `pip install flask` in tutorials. In Keboola's Python/JS image, direct `pip` usage is blocked for system stability reasons -- `uv sync` replaces it." %}

### Node.js: `package.json`

For Node.js apps, dependencies are defined in `package.json` as usual. The `setup.sh` script runs `npm install` to install them.

```json
{
  "name": "my-keboola-app",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "express": "^4.18.0"
  }
}
```

## Step 5 -- Configure and Deploy in Keboola

1. In your Keboola project, go to **Data Apps** and click **Create Data App**.
2. Choose **Python/JS** as the type.
3. Under **Repository**, enter your GitHub repository URL.
4. Select the **branch** you want to deploy from (usually `main`).
5. If your repository is private, enable **Private repository** and authenticate using either:
   - **Personal Access Token**: Enter your GitHub username and a [Personal Access Token](https://github.com/settings/tokens), or
   - **SSH Private Key**: Paste your SSH private key for key-based authentication.
6. Add any [secrets](#secrets-and-environment-variables) your app needs.
7. Click **Deploy**.

Keboola will clone your repository, run `setup.sh`, and start your app. The first deployment may take a few minutes. Once complete, a URL will appear -- click it to open your app.

{% include tip.html content="**To update your app:** Push changes to your GitHub repository, then click **Redeploy** in the Keboola Data App configuration. Keboola will pull the latest code and restart the app." %}

## Working with Keboola Data

### Reading data loaded via Input Mapping

If you configured **Input Mapping** in your Data App settings, Keboola loads selected tables from Storage into the container before your app starts. Your app can then read them as CSV files:

```python
import pandas as pd

# File path follows this pattern: /data/in/tables/<table-name>.csv
df = pd.read_csv("/data/in/tables/my_table.csv")
print(df.head())
```

**Note:** Input Mapping data is loaded once when the app starts. To get fresh data, you need to redeploy the app or use the Storage API to fetch data at runtime.

### Reading data at runtime using the Storage API

For apps that need to fetch up-to-date data without redeploying, use the Keboola Storage API. Store your Storage token as a secret (see next section) and load data programmatically:

```python
import requests
import pandas as pd
from io import StringIO
import os

KBC_URL = os.environ.get("KBC_URL")          # e.g. https://connection.keboola.com
KBC_TOKEN = os.environ.get("KBC_TOKEN")       # your Storage API token

def load_table(table_id: str) -> pd.DataFrame:
    """Load a table from Keboola Storage into a pandas DataFrame."""
    url = f"{KBC_URL}/v2/storage/tables/{table_id}/export-async"
    headers = {"X-StorageApi-Token": KBC_TOKEN}
    response = requests.post(url, headers=headers)
    response.raise_for_status()
    # Follow the async export job...
    return pd.read_csv(StringIO(response.text))
```

For a complete example using the official Python client library, see the [Keboola Storage Python Client documentation](https://developers.keboola.com/integrate/storage/python-client/).

## Secrets and Environment Variables

Sensitive values -- API keys, tokens, passwords -- should never be written directly into your code. Store them as **secrets** in the Data App configuration instead.

### Adding a secret in Keboola

In your Data App configuration, go to the **Secrets** section and add key-value pairs:

| Key | Value |
|---|---|
| `#KBC_TOKEN` | `your-storage-api-token` |
| `#ANTHROPIC_API_KEY` | `your-api-key` |
| `#DB_PASSWORD` | `your-database-password` |

The `#` prefix marks the value as a secret (encrypted at rest).

### Accessing secrets in your code

Keboola automatically makes secrets available as environment variables when your app starts. The `#` prefix is stripped, and the name is uppercased:

```python
# Python
import os

kbc_token = os.environ.get("KBC_TOKEN")
api_key = os.environ.get("ANTHROPIC_API_KEY")
```

```javascript
// Node.js
const kbcToken = process.env.KBC_TOKEN;
const apiKey = process.env.ANTHROPIC_API_KEY;
```

{% include tip.html content="**How the name is transformed:** `#my-custom-var` becomes `MY_CUSTOM_VAR`. Dashes become underscores, the value is uppercased, and the `#` is removed." %}

## Example: Hello World App

This is the simplest possible Python/JS Data App. It displays \"Hello from Keboola!\" in a browser.

You can clone the complete example from **[keboola/example-python-js-hello-world](https://github.com/keboola/example-python-js-hello-world)** and deploy it directly.

**Repository structure:**

```
helloworld/
├── keboola-config/
│   ├── nginx/
│   │   └── sites/
│   │       └── default.conf
│   ├── supervisord/
│   │   └── services/
│   │       └── app.conf
│   └── setup.sh
├── pyproject.toml
└── app.py
```

`app.py`:

```python
from flask import Flask
import os

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    return """
    <html>
      <body style="font-family: sans-serif; padding: 2rem;">
        <h1>Hello from Keboola!</h1>
        <p>Your Python/JS Data App is running.</p>
      </body>
    </html>
    """

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

`pyproject.toml`:

```toml
[project]
name = "helloworld"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "flask>=3.0.0",
]

[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"
```

`keboola-config/nginx/sites/default.conf`:

```
server {
    listen 8888;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

`keboola-config/supervisord/services/app.conf`:

```
[program:app]
command=uv run python /app/app.py
directory=/app
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
```

`keboola-config/setup.sh`:

```bash
#!/bin/bash
set -Eeuo pipefail
cd /app && uv sync
```

## Troubleshooting

### App shows "Method Not Allowed" or a blank page on first open

Your root route (`/`) likely only accepts GET requests. Keboola sends a POST request to `/` to verify the app is running. Add `methods=["GET", "POST"]` in Flask, or use `app.all('/')` in Express.

### App fails to start / keeps restarting

Check the **Terminal Log** tab in your Data App configuration in Keboola -- it shows stdout and stderr output from your app. Common causes:

* A path in `app.conf` is relative (`app.py`) instead of absolute (`/app/app.py`).
* A Python command in `app.conf` is missing the `uv run` prefix.
* A package listed in `pyproject.toml` has a typo or does not exist.

### "externally-managed-environment" error

You have `pip install` somewhere in `setup.sh` or your code. Replace it with `uv sync` in `setup.sh` and make sure all dependencies are listed in `pyproject.toml`.

### App works locally but not in Keboola

* **Port mismatch:** The port in `default.conf` (the `proxy_pass` line) must match the port your app listens on.
* **Missing secrets:** A required environment variable is not defined in the Secrets section.
* **Missing `uv run`:** Python commands in `app.conf` must be prefixed with `uv run`.

### Environment variable is undefined

Add it as a secret in the Keboola Data App configuration (see [Secrets and Environment Variables](#secrets-and-environment-variables)). Secrets are available to both `setup.sh` and your running app.

### Streaming responses arrive all at once instead of in real time

Add `proxy_buffering off;` to the relevant `location` block in `default.conf`. By default, Nginx collects the full response before forwarding it -- this breaks Server-Sent Events and other streaming patterns.

## Key Terms Explained

**uv** -- A fast Python package manager. Keboola uses it to install your Python dependencies from `pyproject.toml`. You interact with it via `uv sync` (in `setup.sh`) and `uv run` (in your Supervisord config). Think of it as a modern replacement for `pip`.

**pip** -- The traditional Python package installer (e.g., `pip install flask`). Keboola's Python/JS image blocks direct `pip` usage to keep the environment stable -- use `uv sync` instead.

**pyproject.toml** -- A configuration file that defines your Python project: its name, required Python version, and list of dependencies. It is the modern standard for Python projects and is required by `uv`.

**Nginx** -- A web server that handles incoming internet traffic and forwards it to your application. You configure it with `default.conf`. The most important setting is the `proxy_pass` port, which must match your app's port.

**Supervisord** -- A process manager that starts and monitors your application. You configure it with `app.conf`. If your app crashes, Supervisord automatically restarts it.

**Port** -- A number that identifies a specific communication channel on a computer. Your app listens on an internal port (e.g., 5000), while Nginx listens on port 8888 (the public-facing port required by Keboola). You never need to change 8888; only change your app's internal port.

**Environment variable** -- A named value available to a running program, set outside the code itself. In Keboola, secrets become environment variables accessible via `os.environ.get("MY_KEY")` in Python or `process.env.MY_KEY` in Node.js.

**Input Mapping** -- A Keboola feature that copies selected Storage tables into your app container as CSV files before the app starts. Useful for apps that need a snapshot of your data at startup.

**Container** -- A lightweight, isolated computing environment in which your app runs. Keboola manages the container; you only manage the code inside it.
