---
title: R transformation reference
slug: 'transformations/r-plain/reference'
description: Lookup reference for R transformations in Keboola — runtime environment and version, limits, file locations, packages, CSV format, row-index handling, warnings-as-errors, backend sizes, and logging.
keywords:
  - R transformation limits
  - R transformation version
  - R transformation packages
  - R transformation CSV
  - R transformation warnings errors
  - R transformation backend size
type: reference
---

Reference material for [R transformations](/transformations/r-plain/). To create and run one, see the [how-to](/transformations/r-plain/how-to/).

<!-- TODO(human-review): the source of truth for the R transformation is a
     component README (not in this docs repo), so the runtime limits, version,
     and preinstalled packages below could not be verified against it. -->

## Environment

The R script runs in an isolated [environment](https://developers.keboola.com/extend/#component). The current R version is **4.4.1**; you can switch a configuration to other available versions. <!-- TODO(human-review): confirm 4.4.1 is current and list other selectable versions. --> Version updates are announced in the [changelog](https://changelog.keboola.com/).

### Limits

| Resource | Limit |
|---|---|
| Memory | 16 GB <!-- TODO(human-review): verify --> |
| Max running time | 6 hours <!-- TODO(human-review): verify --> |
| CPU | Equivalent of two 2.3 GHz processors <!-- TODO(human-review): verify --> |

### File locations

- The script is compiled to `/data/script.R`.
- Mapped input/output tables: relative `in/tables/file.csv`, `out/tables/file.csv` or absolute under `/data/`.
- Downloaded files: `in/files/` (or `/data/in/files/`).
- Temporary files: `/tmp/`. Do **not** use `/data/` for files you don't want exchanged with Keboola.

See the full [Common Interface specification](https://developers.keboola.com/extend/common-interface/).

## Packages

R transformations can use any package on [CRAN](https://cloud.r-project.org/web/packages/available_packages_by_name.html). List a package's name in the package section to load and install it (with dependencies) automatically — `library()` is then not needed. The latest versions are installed.

Some packages are preinstalled (with dependencies); for an authoritative list use `installed.packages()`. Adding a preinstalled package explicitly does no harm but slows startup due to forced re-installation. <!-- TODO(human-review): the preinstalled list lives in the component repo (not here); confirm before relying on a package. -->

## CSV format

Input tables arrive as CSV and can be read with standard R functions. If R misreads the format, specify it explicitly:

```r
data <- read.csv("in/tables/in.csv", sep=",", quote="\"")
```

### Row index in output tables

Do **not** write the row index — use `row.names=FALSE`. The row index creates an unnamed column that cannot be imported to [Storage](/storage/).

```r
write.csv(data, file="out/tables/out.csv", row.names=FALSE)
```

If the row names hold real data, convert them to a column first:

```r
df <- data.frame(first = c('a', 'b'), second = c('x', 'y'))
data <- cbind(rownames(df), df)
write.csv(data, file="/data/out/tables/out.csv", row.names=FALSE)
```

## Warnings are errors

The environment converts **all warnings to errors**, which fail the transformation. To deliberately ignore warnings from a piece of code, wrap it in `tryCatch`:

```r
tryCatch(
{ ... some code ... },
warning = function(w) {}
)
```

## Logging and events

Print informational/debug messages by printing to stdout/stderr. The internally available `app$logInfo` and `app$logError` functions record the precise server time of an event (the standard job-event timestamp is when the event was received, converted to local time):

```r
print('doing something')
write('error message', stderr())
app$logInfo("information")
app$logError("error")
```

## Backend sizes (dynamic backends)

A larger backend allocates more resources for long or heavy transformations. Available sizes:

| Size | |
|---|---|
| XSmall | |
| Small | Default |
| Medium | |
| Large | |

Scaling up impacts [time-credit consumption](/management/project/limits/#project-power--time-credits). Dynamic backends are **not** available on the [Free Plan (Pay As You Go)](/management/payg-project/). <!-- TODO(human-review): confirm sizes, default, and plan availability. -->
