---
title: Running Jobs in Parallel
slug: 'components/running-jobs-in-parallel'
---



In components that support [configuration rows](/components/#configuration-rows) — typically data source and destination connectors — every row runs as its own job. The **parallelism** setting controls how many of these row jobs execute concurrently within a single configuration.

Understanding what this setting does — and what it doesn't — helps you make better decisions about performance and cost.

## What Parallelism Means

Parallelism defines the **maximum number of row jobs that may run at the same time** within a configuration's execution. For example, if your configuration has 10 rows and you set parallelism to 3, those rows are processed in batches of up to 3.

**Parallelism is an upper limit, not a guarantee.** The actual number of concurrently running jobs may be lower than your configured value. Jobs that cannot start immediately are placed into a **waiting** state — this is normal behavior, not an error.

The default and minimum value is **1**: rows run one after another, each in its own job. The former **Parallel jobs: Off** option was removed in June 2026; see the [changelog announcement](https://changelog.keboola.com/parallelism-enabled-by-default-across-all-stacks/).

**Example:** A configuration has five rows and parallelism set to 2. The rows are processed in three consecutive sets — (2 + 2 + 1) — with the jobs in each set running in parallel.

## One Job per Row

Since June 2026, every configuration row runs as its own job, even at parallelism 1. Before that, all rows of a configuration ran inside a single job.

**What you get:**
- **A failing row no longer stops the rest of the run.** The remaining rows still run, and the job summary lists every row that failed with its error, not just the first one.
- **Each row is visible on its own.** Every row is a separate job you can open, inspect, and retry.

**What it costs:**
- Each row job adds some startup overhead. At parallelism 1, most multi-row configurations therefore run slower than they did when all rows ran in one job.
- Raising parallelism recovers that time. A value of around **3 to 4** typically brings a configuration back to its previous runtime. Whether this costs more depends on the component; see [Job States and Billing](#job-states-and-billing).

## Why Actual Concurrency May Be Lower

Even with a high parallelism setting, multiple system-level constraints determine how many jobs actually run simultaneously:

| Constraint | Effect |
|---|---|
| **Storage job capacity** | [Storage jobs](/storage/jobs/) have their own parallel limit. Table import and export operations contribute to this count. |
| **Resource locks** | If multiple jobs write to the same table, only one proceeds at a time. Others wait until the lock is released. |
| **Worker availability** | Backend workers are a shared infrastructure resource. Under load, a job may briefly wait for a worker to become free. |

A practical way to reason about it:

> **Actual concurrency = min(component parallelism, storage capacity, resource availability)**

This is not a flaw — it is how Keboola ensures stability and data consistency across concurrent workloads.

## Job States and Billing

Every job passes through the states listed on the [Jobs API](/extend/jobs/#job-status) page; for billing, two of them matter:

**How billing relates to job state:**
- Jobs in the **waiting** state are not billed at the job level. A job only consumes [credits](/management/project/limits/#project-power--time-credits) once it starts **processing**.
- Jobs in the **processing** state are billed based on compute resources consumed.

**How billing relates to parallelism:**
- **Data destination connectors and most apps** are billed on data volume, not runtime (see [time credits](/management/project/limits/#project-power--time-credits)). Raising parallelism makes them faster without increasing cost.
- **Data source connectors** are billed on active runtime. The per-row startup overhead shows up in credits, and each parallel row job is billed separately, so raising parallelism to get the runtime back also increases credit consumption. For large configurations, contact [Keboola Support](/management/support/) before changing it.

**Important — container runtime billing:** Some components run inside a container that orchestrates multiple child jobs. In these cases, the parent container may continue running and accumulating runtime costs even while individual child jobs are in the waiting state. Setting very high parallelism in a container-based component does not pause the container while jobs queue — the container remains active throughout.

## Example Scenario

Consider a database extractor with 100 configuration rows and parallelism set to 10.

- Keboola attempts to start 10 row jobs simultaneously.
- However, storage job capacity limits the effective concurrency to 3.

**Result:**
- 3 row jobs are **running** (processing)
- 97 row jobs are **waiting**

As each running job completes, the next waiting job starts. The backlog clears gradually — this is expected behavior. The parallelism setting of 10 still takes effect as capacity opens up.

If you expected exactly 10 simultaneous extractions, you may see slower-than-anticipated progress during busy periods in your project. The solution is usually not a higher parallelism value but rather an awareness that system capacity is the bottleneck.

## Best Practices

- **Check configurations still on the default.** If a multi-row configuration has been slower since June 2026, it is most likely running at the default parallelism of 1. For data destination connectors and apps, raise it — it costs nothing and runs get faster. For data source connectors, raise it if you need the runtime back, but expect credit consumption to rise.
- **Use higher parallelism only for independent workloads.** Rows that don't share state or write to the same table benefit most from parallel execution.
- **Be careful with shared destinations.** Data destination connectors writing to the same table cause lock contention. Reducing parallelism may actually improve overall throughput in these cases.
- **Watch out for API rate limits.** For data source connectors hitting external APIs, parallel requests can exhaust rate limits quickly. Check the API documentation for your source and choose a moderate parallelism setting.
- **Higher parallelism is not always faster — or cheaper.** If system capacity is already saturated, increasing parallelism just adds more waiting jobs without improving throughput. Meanwhile, if a container is running, it continues accumulating runtime cost.
- **Monitor running vs. waiting jobs.** Check the [Jobs view](/management/jobs/) to observe how many jobs are running vs. waiting. A consistently high waiting count signals that system limits are the bottleneck, not your parallelism setting.

## When High Parallelism Helps

Parallelism delivers real gains when:

- **Many independent data sources** – For example, a connector pulling from many separate API endpoints where each row targets a distinct destination table.
- **Partitioned extractions** – Database extractors pulling from multiple independent tables simultaneously.
- **Embarrassingly parallel workloads** – Any scenario where rows are fully independent and the external system can handle concurrent requests without rate limiting.

In these cases, higher parallelism reduces total execution time proportionally to available system capacity.

## When Parallelism Does Not Help

Parallelism has little or no effect when:

- **Multiple rows write to the same destination table** – Table-level locks mean only one writer proceeds at a time, regardless of the parallelism setting.
- **Sequential dependencies between rows** – If one row depends on the output of another, parallelism cannot help. Use [flow phases](/flows/#phases-and-tasks) to enforce the required ordering instead.
- **Shared backend bottlenecks** – If the upstream system (database, API, storage layer) is already saturated, adding concurrent requests may slow things down further by increasing contention.
