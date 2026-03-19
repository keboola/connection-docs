---
title: Custom Python
permalink: /components/applications/custom-python/
---

* TOC
{:toc}

This component allows you to run custom Python code directly within Keboola. Its primary purpose is to enable fast creation of
custom integrations (connectors) that can be configured and executed inside Keboola — removing the need to build and maintain
a separate dedicated component.

## Comparison to Python Transformations
- **[Python Transformations](/transformations/python-plain/)**: Designed exclusively for transforming data already present
  in Keboola Storage. Results are written back into Storage.
- **Custom Python Component**: Ideal for creating integrations or applications that interact with external systems,
  download or push data, or require user-provided secure parameters (e.g., API keys, passwords).

{% include warning.html content="Do not use Python Transformations for integrations with external systems requiring secure parameters. Use the Custom Python component instead." %}

## Key Features
- **Secure Parameters** — Safely provide encrypted parameters (API keys, tokens, passwords) via the Keboola UI
  using the `#` prefix.
- **Customizable Environment** — A clean container image to install only the dependencies you need, with support
  for multiple Python versions.
- **Flexible Code Execution** — Run code from a public or private Git repository, or directly within the Keboola UI
  configuration.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Custom Python** application.

The configuration has the following parameters:

- **Python Version & Environment Isolation** (`venv`) — Select the Python version and isolation mode:
  - `3.13` *(recommended)* — Isolated environment with only the packages of your choice.
  - `3.14` — Isolated environment (release candidate).
  - `3.12` — Isolated environment.
  - `base` — Shared environment (Python 3.10) containing many pre-installed packages in legacy versions.
    This option is not recommended and will be deprecated in the future.
- **User Parameters** (`user_properties`) — A JSON object containing custom configuration parameters.
  Key names prefixed with `#` will be encrypted upon saving.
  These parameters are accessible in your code via `CommonInterface`.
- **Source Code & Dependencies** (`source`) — Choose where the code comes from:
  - `code` *(default)* — Enter code manually in the Keboola UI.
  - `git` — Fetch code from a Git repository.
- **Python Packages** (`packages`) — An array of extra packages to install (available only when `source` is `code`).
- **Python Code** (`code`) — The Python code to run (available only when `source` is `code`).
- **Git Repository Source Settings** (`git`) — Configuration for the Git repository
  (available only when `source` is `git`). See [Git Configuration](#git-configuration).

{% include tip.html content="We recommend using an **isolated environment** (Python 3.12+). The shared `base` environment
may lead to package collisions and will become subject to deprecation. Update your code regularly to run with the latest
package versions to avoid security vulnerabilities." %}

### Git Configuration
When using a Git repository as the code source, configure the following:

- **Repository URL** (`url`) — Supports both HTTPS and SSH formats.
- **Repository Visibility & Authentication** (`auth`):
  - `none` *(default)* — Public repository, no authentication.
  - `pat` — Private repository, authenticating with a Personal Access Token.
  - `ssh` — Private repository, authenticating with an SSH key.
- **Personal Access Token** (`#token`) — Required when `auth` is `pat`. This value is encrypted in Keboola Storage.
- **SSH Keys** (`ssh_keys`) — Required when `auth` is `ssh`. Contains:
  - `public` — Public key saved in your Git project (stored for reference only).
  - `#private` — Private key used for authentication (encrypted in Keboola Storage).
- **Branch Name** (`branch`) — The branch to check out. If left empty, `main` is used.
  The UI provides a dynamic branch selector.
- **Script Filename** (`filename`) — The Python script to execute. If left empty, `main.py` is used.
  The UI lists available files from the repository.

When using a Git repository, specify your dependencies in one of the following ways (files must be in the repository root):

- A `pyproject.toml` file accompanied by a `uv.lock` file *(recommended, modern approach)*.
- A `requirements.txt` file *(legacy approach)*.

If both are present, `pyproject.toml` with `uv.lock` takes precedence.

## Code Examples

### Accessing User Parameters
The code below is pre-populated in every new configuration. It shows how to access user parameters
via `CommonInterface`:

```python
from keboola.component import CommonInterface

ci = CommonInterface()
# Access user parameters
print(ci.configuration.parameters)
```

### Loading Configuration Parameters

```python
import logging

from keboola.component import CommonInterface

SOME_PARAMETER = "some_user_parameter"
REQUIRED_PARAMETERS = [SOME_PARAMETER]

# Initialize the interface
ci = CommonInterface()

# Validate required parameters (raises ValueError if any is missing)
ci.validate_configuration_parameters(REQUIRED_PARAMETERS)

# Print KBC Project ID from environment variables
logging.info(ci.environment_variables.project_id)

# Load a specific configuration parameter
logging.info(ci.configuration.parameters[SOME_PARAMETER])
```

### Creating an Output Table with Schema

```python
import csv

from keboola.component import CommonInterface
from keboola.component.dao import BaseType, ColumnDefinition

ci = CommonInterface()

# Define the table schema
schema = {
    "id": ColumnDefinition(
        data_types=BaseType.integer(),
        primary_key=True,
    ),
    "created_at": ColumnDefinition(data_types=BaseType.timestamp()),
    "status": ColumnDefinition(),  # Default type is string
    "value": ColumnDefinition(data_types=BaseType.numeric(length="38,2")),
}

# Create table definition
out_table = ci.create_out_table_definition(
    name="results.csv",
    destination="out.c-data.results",
    schema=schema,
    incremental=True,
    has_header=True,
)

# Write data to the output file
with open(out_table.full_path, "w+", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=out_table.column_names)
    writer.writeheader()
    writer.writerow({
        "id": "1",
        "created_at": "2023-01-15T14:30:00Z",
        "status": "completed",
        "value": "123.45",
    })

# Write the manifest file
ci.write_manifest(out_table)
```

### Accessing Input Tables from Mapping

```python
import csv

from keboola.component import CommonInterface

ci = CommonInterface()

# Access input mapping configuration
input_tables = ci.configuration.tables_input_mapping

for table in input_tables:
    table_name = table.destination

    # Load table definition from manifest
    table_def = ci.get_input_table_definition_by_name(table_name)

    print(f"Processing table: {table_name}")
    print(f"  Columns: {table_def.column_names}")

    # Read data from the CSV file
    with open(table_def.full_path, "r") as input_file:
        csv_reader = csv.DictReader(input_file)
        for row in csv_reader:
            print(f"  Row: {row}")
```

### Processing Input Files

```python
import logging

from keboola.component import CommonInterface

ci = CommonInterface()

# Get input files with specific tags (only latest versions)
input_files = ci.get_input_files_definitions(
    tags=["images", "documents"],
    only_latest_files=True,
)

for file in input_files:
    print(f"Processing file: {file.name}")
    print(f"  Full path: {file.full_path}")
    print(f"  Tags: {file.tags}")
```

### Creating Output Files

```python
import json

from keboola.component import CommonInterface

ci = CommonInterface()

output_file = ci.create_out_file_definition(
    name="results.json",
    tags=["processed", "results"],
    is_public=False,
    is_permanent=True,
)

with open(output_file.full_path, "w") as f:
    json.dump({"status": "success", "processed_records": 42}, f)

ci.write_manifest(output_file)
```

### Using State Files for Incremental Processing
[State files](https://developers.keboola.com/extend/common-interface/config-file/#state-file) allow your component to
store and retrieve information between runs. This is useful for incremental processing or tracking the last processed data.

```python
from datetime import datetime

from keboola.component import CommonInterface

ci = CommonInterface()

# Load state from the previous run
state = ci.get_state_file()

last_updated = state.get("last_updated", "1970-01-01T00:00:00Z")
print(f"Last processed data up to: {last_updated}")

# Process data (only new data since last_updated)
processed_items = [
    {"id": 1, "timestamp": "2023-05-15T10:30:00Z"},
    {"id": 2, "timestamp": "2023-05-16T14:45:00Z"},
]

if processed_items:
    processed_items.sort(key=lambda x: x["timestamp"])
    new_last_updated = processed_items[-1]["timestamp"]
else:
    new_last_updated = last_updated

# Store the new state for the next run
ci.write_state_file({
    "last_updated": new_last_updated,
    "processed_count": len(processed_items),
    "last_run": datetime.now().isoformat(),
})
```

### Handling Errors

```python
import logging

from keboola.component.exceptions import UserException

try:
    do_something()
except UserException as exc:
    logging.exception(exc)
    exit(1)  # Exit code 1 = user error
except Exception as exc:
    logging.exception(exc)
    exit(2)  # Exit code 2 = application error
```

### Logging
Always use the `logging` library, as it integrates with Keboola's rich logger after `CommonInterface` initialization:

```python
import logging

from keboola.component import CommonInterface

ci = CommonInterface()

logging.info("Info message")
logging.warning("Warning message")
logging.exception(exception, extra={"additional_detail": "xxx"})
```

## Running Code from a Git Repository
We have prepared a
[simple example project](https://github.com/keboola/component-custom-python-example-repo-1)
to help you get started with running custom Python code from a Git repository. It can also serve as a template
for your future projects.

Example configuration for running code from a public Git repository:

```json
{
  "parameters": {
    "source": "git",
    "venv": "3.13",
    "git": {
      "url": "https://github.com/keboola/component-custom-python-example-repo-1.git",
      "branch": "main",
      "filename": "main.py",
      "auth": "none"
    },
    "user_properties": {
      "debug": true
    }
  }
}
```

## Listing Pre-Installed Packages
If you are using the shared `base` environment and want to see which packages are available, run the following code:

```python
import subprocess

subprocess.check_call(["uv", "pip", "list"])
```
