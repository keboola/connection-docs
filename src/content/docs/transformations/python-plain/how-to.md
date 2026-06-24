---
title: How do I run a Python transformation?
slug: 'transformations/python-plain/how-to'
description: Create, run, and develop a Python transformation in Keboola — write the script, map input and output CSV files, run it, confirm the result, and debug it in a workspace or locally.
keywords:
  - run a Python transformation
  - create Python transformation
  - Python transformation example
  - develop Python transformation locally
  - Python transformation workspace
type: how-to
---

You want to process data with Python where SQL is awkward. A Python transformation reads your mapped input tables as CSV files, runs your script, and writes CSV outputs back to [Storage](/storage/tables/). This page gets you from nothing to a successful run, then shows how to develop and debug. For limits, file paths, and packages, see the [reference](/transformations/python-plain/reference/).

:::caution[Never put credentials in transformation code]
Python transformations have **no facility for encrypting secrets**. Any API key, password, token, or connection string in the code is stored as **plaintext** in the configuration — readable by anyone with project access and included when features like AI **Generate description** process the configuration. Store secrets in the [Custom Python](/components/applications/custom-python/) application instead, where any parameter whose key starts with `#` is [encrypted](https://developers.keboola.com/overview/encryption/) and exposed to your code as an environment variable.
:::

**Time:** ~10 minutes · **You will need:** a Keboola project and one table in [Storage](/storage/tables/) (or the [sample CSV file](/transformations/source.csv)).

## Step 1 — Create the transformation

1. Open **Components → Transformations**, click **New Transformation**, and choose **Python Transformation**. <!-- TODO(human-review): confirm nav + type labels. -->
2. Name it and confirm.

## Step 2 — Map input and output

1. Upload the [sample CSV file](/transformations/source.csv) to Storage as a table.
2. In **Input Mapping**, add it and set its **Destination** to `source` (the script reads `in/tables/source.csv`).
3. In **Output Mapping**, map `result.csv` (produced by the script) to a new Storage table, for example `out.c-main.result`.

## Step 3 — Write the script

Paste a script that reads `in/tables/source.csv` and writes `out/tables/result.csv`:

```python
import csv

with open('in/tables/source.csv', mode='rt', encoding='utf-8') as in_file, open('out/tables/result.csv', mode='wt', encoding='utf-8') as out_file:
    reader = csv.DictReader((line.replace('\0', '') for line in in_file), dialect='kbc')
    writer = csv.DictWriter(out_file, dialect='kbc', fieldnames=['col1', 'col2'])
    writer.writeheader()
    for row in reader:
        writer.writerow({'col1': row['first'] + 'ping', 'col2': int(row['second']) * 42})
```

See the [reference](/transformations/python-plain/reference/#reading-and-writing-csv) for list-based and explicit-format variants. You can split the script into [blocks](/transformations/#writing-scripts).

## Step 4 — Run it and confirm the result

1. Click **Run**.
2. Wait for the [job](/management/jobs/) to finish with a success status.
3. Open **Storage**, find your output table, and confirm `col1` has the `ping` suffix and `col2` is `second × 42`.

## Develop and debug

The fastest way to iterate is a [Python workspace](/workspace/) (JupyterLab) with the same input mapping:

1. Configure input (and optionally output) mapping, then **Load Data** and **Connect** to the workspace.
2. Paste your script into the notebook — the `in/`/`out/` directory structure and input files are already prepared.
3. Run it; optionally **Unload Data** to push results to Storage, or **Create Transformation** to scaffold a transformation with the same mapping.

To develop **locally**, [install Python](https://www.python.org/downloads/) and recreate the directory structure (`in/tables/`, `out/tables/`) with your input files. A ready example is in [data.zip](/transformations/python-plain/data.zip); the same script then runs unchanged as a transformation. For an exact environment, use the [Keboola Docker image](https://developers.keboola.com/extend/docker/running/#running-transformations).

## Make it faster (backend size)

For large data, raise the **Backend size** in the configuration (XSmall → Small → Medium → Large); see [backend sizes](/transformations/python-plain/reference/#backend-sizes-dynamic-backends). This affects [time-credit consumption](/management/project/limits/#project-power--time-credits).

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `FileNotFoundError` on `in/tables/source.csv` | Input mapping destination doesn't match the path in the script | Set the input **Destination** to `source` (or change the path in the script). |
| Output table empty / not created | Output mapping **Source** doesn't match the file the script writes | Map `result.csv` (the file your script writes to `out/tables/`). |
| `IndentationError` / `TabError` | Mixed tabs and spaces | Use consistent indentation; Python is indentation-sensitive. |
| A defined `main()` never runs | Wrapped in `if __name__ == '__main__':` | Call `main()` directly instead. |

## Related

- [Python transformation reference](/transformations/python-plain/reference/) — limits, file paths, packages, CSV.
- [Custom Python application](/components/applications/custom-python/) — for code that needs encrypted secrets.
- [Workspaces](/workspace/) · [Input and output mapping](/transformations/mappings/).
