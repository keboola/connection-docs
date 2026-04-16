---
title: Storage Access
permalink: /data-apps/storage-access/
---

* TOC
{:toc}

## Overview

Storage Access allows your Data App to read data from and write data back to Keboola Storage tables in real-time. Your app connects directly to Keboola's storage through Query Service via SQL, enabling:

- **Real-time data access**: Always work with the latest data, no redeployment needed
- **Write-back capability**: Update, insert into **existing** Storage tables directly from your app
- **Interactive applications**: Build data entry forms, approval workflows, and collaborative tools

This feature is available for both **Streamlit** and **Python/JS** Data Apps.

## When to Use Storage Access

**Use Storage Access when you need to:**

- Build interactive data entry or editing applications
- Work with large datasets more efficiently - no need to load them via input mapping
- Enable business users to update data directly from the app

**Stick with Input Mapping when:**

- You don't need write-back capability - the app only reads and displays data

## How It Works

### Architecture Overview 

When you enable Storage Access, Keboola creates a dedicated **workspace** for your Data App. This workspace contains a database user with specific permissions (INSERT, SELECT, UPDATE, TRUNCATE, DELETE) on the tables you've selected.

```
Your Data App
     │
     ▼
Query Service ────► Workspace User ────► Storage Tables
     │                                        │
     │                                        │
     └── Handles authentication,              └── Your selected tables
         billing, metadata refresh                 with granted permissions
```

Your app communicates with Storage through the [**Query Service API**](https://query.keboola.com/api-docs/), not directly with Snowflake. This provides:

- Automatic authentication using your app's token
- Usage tracking for billing
- Automatic metadata refresh after writes
- Abstraction from the underlying backend

The recommended Python client library is [keboola.query-service-client](https://pypi.org/project/keboola.query-service-client/).

### Workspace Lifecycle

The workspace is **ephemeral** - a fresh workspace is created each time your app starts (including wake-up from sleep):

| Event | Workspace Action |
| --- | --- |
| App deploys | New workspace created |
| App wakes from sleep | New workspace created (old one deleted) |
| App redeployed | New workspace created (old one deleted) |
| App deleted | Workspace deleted |

This design ensures:

- Permission changes take effect on next app start
- No stale credentials or connections
- Clean isolation between app runs

## Setting Up Storage Access

### Step 1: Enable Storage Access
1. Go to the **Project Settings**.
2.  Go to the **Features**.
3.  Find the **Storage Access** feature and activate it.

### Step 2: Storage Access

1. Open your Data App configuration in Keboola.
2. Go to the **Advanced Settings** tab.
3. Find the **Storage Access** section.
4. Click **+ Add Writable Table**.
2. Select a bucket and table from Storage.
3. For each table, the app will have **SELECT**, **UPDATE**, and **TRUNCATE** permissions.

**Notes:**

- You can add multiple tables from different buckets.
- All selected tables must exist before deploying.

### Step 3: Deploy Your App

Click **Deploy** (or **Redeploy** for existing apps). During deployment:

1. Keboola creates a new workspace with your selected table permissions.
2. The workspace ID is passed to your app as an environment variable.
3. Your app code can now use the Query Service to read and write data.

## Reading Data from Storage

### Using the Query Service Client

Install the Keboola Query Service client:

**In `pyproject.toml` (Python):**

```toml
dependencies = [
    "kbcstorage>=0.8.0",
    "keboola.query-service-client>=0.2.0",
]
```

**In your Python code:**

```python
import os
import json
from keboola.query_service_client import QueryServiceClient

# Read workspace ID from the manifest file (once at startup)
manifest_path = os.environ.get("KBC_WORKSPACE_MANIFEST_PATH", 
                                "/var/run/secrets/keboola.com/workspace/manifest.json")

try:
    with open(manifest_path) as f:
        manifest = json.load(f)
        workspace_id = manifest["workspaceId"]
except (FileNotFoundError, KeyError) as e:
    raise RuntimeError(
        "Storage Access is not enabled for this app. "
        "Enable it in Advanced Settings and redeploy."
    ) from e

# Initialize the Query Service client
client = QueryServiceClient(
    token=os.environ["KBC_TOKEN"],
    url=os.environ["KBC_URL"]
)
```

### Reading Selected Tables

To read a table you've selected in the UI:

```python
import pandas as pd

# Query a table - use the full table ID (bucket.table)
result = client.execute_query(
    workspace_id=workspace_id,
    query='SELECT * FROM "in.c-main"."customers" LIMIT 1000'
)

# Convert to DataFrame
df = pd.DataFrame(result["data"], columns=result["columns"])
print(df.head())
```

**Table naming convention:**

- Use the full table ID in quotes: `"bucket_stage.bucket_name"."table_name"`
- Example: `"in.c-sales"."orders"` for a table `orders` in bucket `in.c-sales`

### Running Custom Queries

You can run any SELECT query against your permitted tables:

```python
# Join multiple tables
query = """
    SELECT 
        c.customer_name,
        SUM(o.amount) as total_spent
    FROM "in.c-main"."customers" c
    JOIN "in.c-main"."orders" o ON c.id = o.customer_id
    GROUP BY c.customer_name
    ORDER BY total_spent DESC
    LIMIT 10
"""

result = client.execute_query(workspace_id=workspace_id, query=query)
```

## Writing Data Back to Storage

Storage Access allows your app to modify data in Storage tables using standard SQL statements via the Query Service. This is useful for:

- Data entry forms
- Approval workflows
- Data correction interfaces
- Collaborative editing

### Inserting and Updating Data

You can use standard SQL INSERT and UPDATE statements directly via the Query Service:

```python
# INSERT new records
client.execute_query(
    workspace_id=workspace_id,
    query='''
        INSERT INTO "in.c-main"."approvals" ("id", "name", "status", "updated_at")
        VALUES (1, 'New Record', 'pending', CURRENT_TIMESTAMP)
    '''
)

# UPDATE existing records
client.execute_query(
    workspace_id=workspace_id,
    query='''
        UPDATE "in.c-main"."approvals"
        SET status = 'approved', updated_at = CURRENT_TIMESTAMP
        WHERE id = 123
    '''
)

# DELETE records
client.execute_query(
    workspace_id=workspace_id,
    query='''
        DELETE FROM "in.c-main"."approvals"
        WHERE status = 'cancelled'
    '''
)
```

The Query Service automatically handles metadata refresh in Storage after write operations, so row counts and table statistics stay current without any additional calls.

### Truncating Tables

To remove all data from a table:

```python
client.execute_query(
    workspace_id=workspace_id,
    query='TRUNCATE TABLE "in.c-main"."temp_data"'
)
```

**Warning:** Truncation is immediate and cannot be undone. Use with caution.

### Important Considerations

**Metadata refresh:** After any write operation, Keboola automatically refreshes the table metadata. This ensures:

- Row counts are accurate in the Storage UI
- Other components see the updated data
- Table statistics are current

**Concurrency:** Multiple users of your app may write simultaneously. If you need to prevent conflicts, you must handle this in your application logic:

```python
# Example: Optimistic locking with version column
query = """
    UPDATE "in.c-main"."records"
    SET status = 'approved', version = version + 1
    WHERE id = 123 AND version = 5
"""
result = client.execute_query(workspace_id=workspace_id, query=query)

if result["rows_affected"] == 0:
    raise Exception("Record was modified by another user. Please refresh and try again.")
```

## Environment Variables

When Storage Access is enabled, these environment variables are available to your app:

| Variable | Description |
| --- | --- |
| `KBC_WORKSPACE_MANIFEST_PATH` | Path to the workspace manifest file (contains `workspaceId`) |
| `KBC_TOKEN` | Storage API token (always available) |
| `KBC_URL` | Keboola Connection URL (always available) |

**Reading the workspace ID:**

The recommended way to obtain the workspace ID is from the manifest file:

```python
import os
import json

manifest_path = os.environ.get("KBC_WORKSPACE_MANIFEST_PATH",
                                "/var/run/secrets/keboola.com/workspace/manifest.json")
try:
    with open(manifest_path) as f:
        workspace_id = json.load(f)["workspaceId"]
except (FileNotFoundError, KeyError) as e:
    raise RuntimeError(
        "Storage Access is not enabled. Enable it in Advanced Settings and redeploy."
    ) from e
```

## Comparison: Input Mapping vs Direct Storage Access

| Aspect | Input Mapping | Direct Storage Access |
| --- | --- | --- |
| **Data freshness** | Snapshot at deploy time | Real-time, always current |
| **Data loading** | CSV files loaded to `/data/in/tables/` | Query on demand via API |
| **Write capability** | None (read-only) | SELECT, UPDATE, TRUNCATE, DELETE |
| **Dataset size** | Limited by container memory | Virtually unlimited (pagination) |
| **Configuration** | Select tables in UI | Select tables + enable toggle |
| **Use case** | Static dashboards, reports | Interactive apps, data entry |

**You can use both together:** Input Mapping for reference data that rarely changes, Storage Access for data you need to read/write in real-time.

## Example: Read-Write Data App

This example shows a simple Flask app that reads records from Storage and allows users to update their status.

**`app.py`:**

```python
from flask import Flask, request, jsonify, render_template_string
import os
import json
import pandas as pd
from keboola.query_service_client import QueryServiceClient

app = Flask(__name__)

# Initialize Query Service client once at startup
manifest_path = os.environ.get("KBC_WORKSPACE_MANIFEST_PATH",
                                "/var/run/secrets/keboola.com/workspace/manifest.json")
with open(manifest_path) as f:
    WORKSPACE_ID = json.load(f)["workspaceId"]

qs_client = QueryServiceClient(
    token=os.environ["KBC_TOKEN"],
    url=os.environ["KBC_URL"]
)

ALLOWED_STATUSES = {"pending", "approved", "rejected"}


@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        # Validate and sanitize user input
        record_id = int(request.form["record_id"])  # ensure integer
        new_status = request.form["status"]
        if new_status not in ALLOWED_STATUSES:
            return "Invalid status", 400
        
        qs_client.execute_query(
            workspace_id=WORKSPACE_ID,
            query=f'''
                UPDATE "in.c-main"."approvals"
                SET status = '{new_status}', updated_at = CURRENT_TIMESTAMP
                WHERE id = {record_id}
            '''
        )
    
    # Load current records
    result = qs_client.execute_query(
        workspace_id=WORKSPACE_ID,
        query='SELECT id, name, status, updated_at FROM "in.c-main"."approvals" ORDER BY id'
    )
    records = [dict(zip(result["columns"], row)) for row in result["data"]]
    
    return render_template_string(TEMPLATE, records=records)


TEMPLATE = """
<!DOCTYPE html>
<html>
<head><title>Approval Manager</title></head>
<body>
    <h1>Pending Approvals</h1>
    <table border="1">
        <tr><th>ID</th><th>Name</th><th>Status</th><th>Action</th></tr>
        {% for r in records %}
        <tr>
            <td>{{ r.id }}</td>
            <td>{{ r.name }}</td>
            <td>{{ r.status }}</td>
            <td>
                <form method="POST" style="display:inline">
                    <input type="hidden" name="record_id" value="{{ r.id }}">
                    <select name="status">
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <button type="submit">Update</button>
                </form>
            </td>
        </tr>
        {% endfor %}
    </table>
</body>
</html>
"""

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

**`pyproject.toml`:**

```toml
[project]
name = "approval-app"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "flask>=3.0.0",
    "pandas>=2.0.0",
    "kbcstorage>=0.8.0",
    "keboola.query-service-client>=0.2.0",
]

[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"
```

## Best Practices

**1. Handle missing workspace gracefully**

```python
import os, json

manifest_path = os.environ.get("KBC_WORKSPACE_MANIFEST_PATH",
                                "/var/run/secrets/keboola.com/workspace/manifest.json")
try:
    with open(manifest_path) as f:
        workspace_id = json.load(f)["workspaceId"]
except (FileNotFoundError, KeyError):
    # Storage Access is not enabled — show a user-friendly error
    import streamlit as st  # or use your framework's error handling
    st.error("Storage Access is not enabled for this app. Enable it in Advanced Settings and redeploy.")
    st.stop()
```

**2. Validate and sanitize user input to prevent SQL injection**

Since the Query Service accepts raw SQL strings, you must validate all user input before including it in queries:

```python
# ❌ DANGEROUS - never do this
query = f"SELECT * FROM table WHERE id = {user_input}"

# ✅ SAFE - validate types and use allowlists
safe_id = int(user_input)  # Ensure it's actually a number
query = f"SELECT * FROM table WHERE id = {safe_id}"

# ✅ For string values, use an allowlist of permitted values
ALLOWED_STATUSES = {"pending", "approved", "rejected"}
if status not in ALLOWED_STATUSES:
    raise ValueError(f"Invalid status: {status}")
query = f"UPDATE table SET status = '{status}' WHERE id = {safe_id}"
```

**3. Implement keyset pagination for large datasets**

Use keyset (cursor-based) pagination instead of OFFSET, which can produce duplicates or gaps on live data:

```python
page_size = 1000
last_id = 0  # Start from the beginning

while True:
    result = client.execute_query(
        workspace_id=workspace_id,
        query=f'''
            SELECT * FROM "in.c-main"."my_table"
            WHERE id > {last_id}
            ORDER BY id ASC
            LIMIT {page_size}
        '''
    )
    if not result["data"]:
        break
    process_batch(result["data"])
    last_id = result["data"][-1][0]  # Update cursor to last row's id
```

**4. Cache frequently-used data**

For **Streamlit** apps, use `st.cache_data`:

```python
import streamlit as st

@st.cache_data(ttl=300)  # Cache for 5 minutes
def load_reference_data():
    result = client.execute_query(
        workspace_id=workspace_id,
        query='SELECT * FROM "in.c-main"."reference_data"'
    )
    return pd.DataFrame(result["data"], columns=result["columns"])
```

For **Python/JS** (non-Streamlit) apps, use a simple in-memory cache:

```python
from functools import lru_cache
import time

_cache = {}
_cache_ttl = 300  # seconds

def get_cached_data(key, query_fn):
    now = time.time()
    if key in _cache and now - _cache[key]["ts"] < _cache_ttl:
        return _cache[key]["data"]
    data = query_fn()
    _cache[key] = {"data": data, "ts": now}
    return data
```

**5. Track write operations**

Write operations are automatically tracked by the Query Service for billing purposes. For additional application-level auditing, log to stdout (visible in Data App container logs):

```python
import logging
logging.basicConfig(level=logging.INFO)

logging.info(f"User {current_user} updated record {record_id} to status {new_status}")
# Output goes to stdout → visible in the Terminal Log tab of your Data App
```

## Limitations

- **Snowflake only**: Storage Access currently works only with Snowflake backends. BigQuery support is planned for a future release.
- **Column-level permissions not supported**: If you grant access to a table, the app can read/write all columns.
- **Permission changes require app restart**: If you add or remove tables from the Storage Access configuration, the changes take effect on the next app start (deploy, redeploy, or wake from sleep).
