---
title: 'Get Your Data In'
slug: 'getting-started/load'
description: 'Load your first four tables into Keboola Storage with the HTTP data source connector, pulling the sample CSV files straight from a URL.'
redirect_from:
  - /tutorial/load/
---

A deal row in this pipeline carries an `OwnerId`, not a rep's name — and the deals, the accounts
they belong to, the reps who own them and those reps' seniority arrive as four separate files.
None of them answers anything alone. This step gets all four into Storage so the next step can
join them into one table.
Step 2 of the [Getting Started](/getting-started/) arc.

<!-- Tutorial-type page (step 2 of 6). Rebuilt on the HTTP connector: CSV Import is deprecated
and cannot take new configurations (verified live in project 264, 2026-08-04). Every label,
default and dialog below was walked live in project 264 on 2026-08-04 with keboola.ex-http, and
the four-row run took 2 min 4 s. Note our own connector page
(components/extractors/storage/http/index.md) still says "Add Table"; the UI says "Add Row". -->

## What you need

A Keboola project you can sign in to. If you do not have one, start with
[Get a Project](/getting-started/project/).

Nothing to download — the connector fetches the files itself.

:::tip[Do it with Kai]
Setting up a data source connector is one of the things Kai does
([Integration Setup](/kai/use-cases/#integration-setup)). Open **Kai Agent** in the top bar and ask
for the whole configuration at once:

```text
Create one HTTP data source configuration called "[TUTORIAL] Sample data", with base URL
https://help.keboola.com and four rows — one per file — fetching /getting-started/opportunity.csv,
/getting-started/account.csv, /getting-started/user.csv and /getting-started/level.csv into the
tables opportunity, account, user and level. Then run it and tell me the row counts.
```

One configuration with four rows, not four configurations: [step 5](/getting-started/automate/)
runs this as a single task and the parallelism note below assumes that shape.

**Check:** four tables in Storage with 639 / 275 / 28 / 28 rows, and a **Rows** list showing four
entries, as in [Check it worked](#check-it-worked). If Kai built something else, delete it and
follow the numbered steps — the ten minutes are worth it anyway, since the rest of the arc assumes
you have seen where a configuration and its rows live.
:::

## The sample data

Four small tables: a quarter of deals (639 opportunities created in Q1 2015), the 275 accounts those
deals belong to, the 28 reps who own them, and each rep's seniority level. Each table is only
half the story — a deal names an account and an owner by ID, not by name, and a rep's seniority
lives in a fourth table entirely. They are published here, and the connector reads them over HTTPS:

| Table | File |
|---|---|
| opportunities | [`/getting-started/opportunity.csv`](/getting-started/opportunity.csv) |
| accounts | [`/getting-started/account.csv`](/getting-started/account.csv) |
| users | [`/getting-started/user.csv`](/getting-started/user.csv) |
| levels | [`/getting-started/level.csv`](/getting-started/level.csv) |

All characters in this data are fictitious, and any resemblance to real persons, living, dead,
undead, unborn, or otherwise semi-existent is purely coincidental.

## How loading works

Data gets into Keboola through **data source connectors** — components that fetch from a source
on demand or on a schedule. There are [hundreds of them](/components/extractors/): databases,
APIs, ad platforms, cloud drives. They differ in how they authenticate and what they can fetch,
but they all end the same way: rows in a Storage table.

You will use the **HTTP** connector, which downloads CSV files from a URL. It is the simplest
one that still behaves like a real connector — it can be re-run, scheduled, and dropped into a
flow, which is what [step 5](/getting-started/automate/) depends on.

One configuration can fetch **many** files, so you will build a single configuration holding
four tables rather than four separate configurations.

## Create the configuration

1. Open **Components** and search for `HTTP`. Two results come back — pick plain **HTTP**
   (*Data Source*), not **HTTP Advanced**, and click **Add Component**.

   ![Screenshot - Find the HTTP data source connector](/getting-started/load/01-find-http.png)

2. Choose **Connect To My Data**. (**Use With Demo Data** sets the connector up against a
   dataset Keboola prepared — handy for a look around, but here you want your own URL.)

3. Replace the suggested name with `[TUTORIAL] Sample data`, add a description, and click
   **Create Configuration**. Descriptions are what keep a project readable six months later;
   see the [best practices cheat sheet](/overview/onboarding/cheat-sheet/).

   ![Screenshot - Create the configuration](/getting-started/load/02-create-configuration.png)

4. Open **Base URL and Connection Options** and set **Base URL** to the prefix shared by every
   file this configuration downloads, then click **Save**:

   ```
   https://help.keboola.com
   ```

   ![Screenshot - Set the base URL](/getting-started/load/03-base-url.png)

## Add the four tables

Each file is a [configuration row](/components/#configuration-rows) — its own path and settings,
sharing the configuration's base URL.

5. In the **Rows** section, click **Add Row**, name it `opportunity`, and click **Create**. The
   row name becomes the Storage table name, so use exactly this spelling.

6. Under **Download Settings**, set **Path** to the file, relative to the base URL:

   ```
   /getting-started/opportunity.csv
   ```

7. Check the rest of the row and click **Save**:

   - **Save Settings → Table name** is already `opportunity`, taken from the row name.
   - **Delimiter** `,` and **Enclosure** `"` are already right for these files.
   - Leave **Incremental load** off: each run should replace the table, not append to it.
   - **Header & Primary Key → Read Header** already reads *Read the header from the file(s)
     header*, which is what you want — the sample files carry column names on the first line.
     Leave it alone. (The alternatives are typing the columns yourself or having them generated
     as `col_1`, `col_2`, ….)

   ![Screenshot - Row path and save settings](/getting-started/load/04-row-settings.png)

8. Repeat steps 5–7 for the other three files:

   | Row name | Path |
   |---|---|
   | `account` | `/getting-started/account.csv` |
   | `user` | `/getting-started/user.csv` |
   | `level` | `/getting-started/level.csv` |

9. Back on the configuration, click **Run Component** and confirm with **Run**. One job fetches
   all four rows.

   ![Screenshot - The configuration ready to run](/getting-started/load/05-run.png)

## Check it worked

Watch it in **Jobs**. The rows are fetched one after another, so expect a couple of minutes for
all four — the run behind these screenshots took 2 minutes 4 seconds.

Then open **Storage**. Data lives in **buckets**, and each bucket holds tables. The connector
created a bucket of its own — its name is the component plus the configuration's ID, like
`keboola-ex-http-01kz5050bhhezq9scmd0t9c73f`, shown with an **IN** badge — holding four tables:
`opportunity`, `account`, `user` and `level`.

![Screenshot - The four tables in Storage](/getting-started/load/06-storage-tables.png)

Click a table and open its **Data Sample** tab to see the real contents. `opportunity` should
have 639 rows with columns like `AccountId`, `Amount` and `StageName`; `account` 275; `user` and
`level` 28 each. If that matches, this step is done.

![Screenshot - Table detail with data sample](/getting-started/load/07-table-detail.png)

:::note[Your bucket name will differ]
The bucket name contains the configuration's own ID, so yours will not match the screenshots
exactly — and that is fine. The **Rows** list shows where each row lands, and the next step lets
you name these tables whatever you like inside the transformation; it is those names the SQL
depends on.
:::

## If it goes wrong

- **The job fails with a 404.** The path is wrong, or missing its leading slash. Base URL and
  path are concatenated, so `https://help.keboola.com` + `/getting-started/user.csv` is right,
  while a base URL with a trailing slash gives you a double slash. Open the full URL in a browser
  to see whether the file is really there.
- **Every row arrives as one column.** The **Delimiter** setting does not match the file. These
  files are comma-separated.
- **The first data row is missing, or columns are called `col_1`.** Wrong header option — set
  **Read Header** back to *Read the header from the file(s) header*.
- **The table is empty but the job succeeded.** The URL returned an HTML error page instead of a
  CSV. Open it in a browser to see what actually comes back.
- **You want the four files fetched at the same time.** Raise **Parallel jobs** on the
  configuration — the connector then processes its rows concurrently.
- **You would rather have Kai read the job.** It has the log and the tables in front of it:
  `Read the last HTTP connector job and tell me what failed, then show me a sample of opportunity.`

## Going further

- [Load from Google Sheets](/getting-started/load/googlesheets/) — the same data pulled from a
  spreadsheet, with an authorized account instead of a public URL.
- [Load from a database](/getting-started/load/database/) — the pattern every database connector
  follows.

**Next:** [Transform your data →](/getting-started/transform/)
