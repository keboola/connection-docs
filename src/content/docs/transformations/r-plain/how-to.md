---
title: How do I run an R transformation?
slug: 'transformations/r-plain/how-to'
description: Create, run, and develop an R transformation in Keboola — write the script, map input and output CSV files, run it, confirm the result, and debug it in a workspace or locally.
keywords:
  - run an R transformation
  - create R transformation
  - R transformation example
  - develop R transformation locally
  - R transformation workspace
type: how-to
---

You want to run advanced statistical or vector/matrix computations with R. An R transformation reads your mapped input tables as CSV files, runs your script, and writes CSV outputs back to [Storage](/storage/tables/). This page gets you from nothing to a successful run, then shows how to develop and debug. For limits, packages, and CSV rules, see the [reference](/transformations/r-plain/reference/).

**Time:** ~10 minutes · **You will need:** a Keboola project and one table in [Storage](/storage/tables/) (or the [sample CSV file](/transformations/r-plain/source.csv)).

## Step 1 — Create the transformation

1. Open **Components → Transformations**, click **New Transformation**, and choose **R Transformation**. <!-- TODO(human-review): confirm nav + type labels. -->
2. Name it and confirm.

## Step 2 — Map input and output

1. Upload the [sample CSV file](/transformations/r-plain/source.csv) to Storage as a table.
2. In **Input Mapping**, add it and set its **Destination** to `source` (the script reads `in/tables/source.csv`).
3. In **Output Mapping**, map `result.csv` to a new Storage table, for example `out.c-main.result`.

## Step 3 — Write the script

```r
data <- read.csv(file = "in/tables/source.csv")

df <- data.frame(
  col1 = paste0(data$first, 'ping'),
  col2 = data$second * 42
)
write.csv(df, file = "out/tables/result.csv", row.names = FALSE)
```

Always write outputs with `row.names = FALSE` — see [row index in output tables](/transformations/r-plain/reference/#row-index-in-output-tables). You can split the script into [blocks](/transformations/#writing-scripts).

## Step 4 — Run it and confirm the result

1. Click **Run**.
2. Wait for the [job](/management/jobs/) to finish with a success status.
3. Open **Storage**, find your output table, and confirm `col1` has the `ping` suffix and `col2` is `second × 42`.

## Develop and debug

The fastest way to iterate is an [R workspace](/workspace/) with the same input mapping. While developing, read fewer rows to catch issues quickly:

```r
mydata <- read.csv("in/tables/mydata", nrows=500)
```

To develop **locally**, [install R](https://cloud.r-project.org/) (preferably the [same version as Keboola](/transformations/r-plain/reference/#environment)) and recreate the directory structure (`in/tables/`, `out/tables/`, and `in/user/` for extension-less binary files) with your input files. A ready example is in [data.zip](/transformations/r-plain/data.zip); the same script then runs unchanged as a transformation. For an exact environment, use the [Keboola Docker image](https://developers.keboola.com/extend/docker/running/#running-transformations).

## Make it faster (backend size)

For large data, raise the **Backend size** in the configuration (XSmall → Small → Medium → Large); see [backend sizes](/transformations/r-plain/reference/#backend-sizes-dynamic-backends). This affects [time-credit consumption](/management/project/limits/#project-power--time-credits).

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Transformation fails on a harmless warning | Warnings are converted to errors | Fix the cause, or wrap the code in `tryCatch(..., warning = function(w) {})` ([reference](/transformations/r-plain/reference/#warnings-are-errors)). |
| Extra unnamed column / import fails | Row index written to the CSV | Write with `row.names = FALSE`. |
| `cannot open file 'in/tables/source.csv'` | Input destination doesn't match the path | Set the input **Destination** to `source`. |
| Output table empty / not created | Output **Source** doesn't match the file the script writes | Map `result.csv`. |

## Related

- [R transformation reference](/transformations/r-plain/reference/) — limits, packages, CSV, logging.
- In-depth examples: [array splitting](/transformations/r-plain/array-splitter/) · [charts & graphs](/transformations/r-plain/plots/) · [binary files](/transformations/r-plain/binary/).
- [Workspaces](/workspace/) · [Input and output mapping](/transformations/mappings/).
