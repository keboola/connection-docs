---
title: 'Send Your Data Somewhere'
slug: 'getting-started/write'
description: 'Send the table you just built out of Keboola into a Google Sheet using the Google Sheets data destination connector.'
redirect_from:
  - /tutorial/write/
---

Data that never leaves the platform is not worth much. This step pushes your joined table
out to a Google Sheet — the same move, under the same mechanism, that later sends data to a
warehouse, a BI tool, or a CRM. Step 4 of the [Getting Started](/getting-started/) arc.

<!-- Tutorial-type page (step 4 of 6). UI labels and screenshots pending live verification in demo project 264. -->

## What you need

- The table `opportunity_denorm` in Storage, from
  [Transform Your Data](/getting-started/transform/).
- A Google account you can authorize.

## Sending data out

Getting data out is handled by **data destination connectors** — the mirror image of the
data source connectors you loaded with. The pattern is always the same: authorize the
target, pick the Storage table, say where it goes, run it. Sending processed data back into
the operational systems it came from is often called **reverse ETL**; in Keboola it is just
another component in your flow.

Google Sheets is the easiest destination to try. The
[full catalogue](/components/writers/) covers databases, BI tools, and cloud storage.

## Configure the destination

1. Open **Components**, click **Add Component**, and search for `Sheets`. Several results
   come back, including a *data source* and a *data destination* with almost the same name —
   pick **Google Sheets** *data destination* (component ID `keboola.wr-google-sheets`).
   Picking the data source by mistake makes the rest of this page impossible.

   ![Screenshot - Search for the Google Sheets destination](/getting-started/write/writing1.png)

2. Click **Add Component**, then **Connect To My Data**.

   ![Screenshot - Connect to my data](/getting-started/write/writing2.png)

3. Name the configuration `[TUTORIAL] Opportunity denorm to Sheets`, add a description, and
   click **Create Configuration**.

   ![Screenshot - Name the configuration](/getting-started/write/writing3.png)

## Authorize your Google account

4. Authorize the account you want to write into.

   ![Screenshot - Authorize a Google account](/getting-started/write/writing4.png)

5. Name the authorization and click **Sign in with Google**. Use **external authorization**
   instead if a colleague — not you — owns the target account; Keboola sends them a link
   and never sees their credentials.

   ![Screenshot - Sign in with Google](/getting-started/write/writing5.png)

6. Click **Allow**.

   ![Screenshot - Grant access](/getting-started/write/writing6.png)

The authorization belongs to this configuration. Keboola stores component secrets as
[encrypted configuration parameters](https://developers.keboola.com/overview/encryption/) —
there is no decryption API, so the credentials are never readable back out of the
configuration.

<!-- VERIFY(owner): the previous version of this page claimed the authorization "will only
allow you to write data into a Google Spreadsheet". The exact OAuth scopes requested by
keboola.wr-google-sheets are not published, and step 9 lets the reader pick an existing
spreadsheet from Drive, which implies more than spreadsheet-write. Claim removed rather than
guessed. -->

## Pick the table and the sheet

7. Click **New Table**.

   ![Screenshot - New table](/getting-started/write/writing7.png)

8. Select `out.c-denormalize-opportunities.opportunity_denorm` and click **Next**.

   ![Screenshot - Select the Storage table](/getting-started/write/writing8.png)

   You are now in a small wizard with tabs — **Source**, **Destination**, **Options** —
   which is why the next two steps feel like one long form.

9. On **Destination**, choose **New spreadsheet** and name the *spreadsheet* (the file that
   will appear in Drive). An existing spreadsheet works too — you pick it from the authorized
   account's Drive. Click **Next**.

   ![Screenshot - New spreadsheet](/getting-started/write/writing9.png)

10. On **Options**, name the *sheet* (the tab inside that file), select **Update rows**, and
    click **Save Sheet**. This creates the empty spreadsheet in the authorized account, ready
    to receive data.

    ![Screenshot - Name and save the sheet](/getting-started/write/writing10.png)

    **Update rows** replaces the sheet's contents on every run. The alternative, **Append
    rows**, adds to the bottom — right for a log, wrong for a table you want to reflect
    current state.

## Run it and check the result

11. Click **Run Component**.

12. When the job finishes, click the spreadsheet name to open it in Google Drive.

    ![Screenshot - Open the spreadsheet](/getting-started/write/writing11.png)

The sheet should hold every row of `opportunity_denorm`, with the joined columns —
`UserName`, `AccountName`, `ProbabilityClass` — that did not exist in any of the four CSVs
you started with. That is the whole pipeline, end to end.

## If it goes wrong

- **The job fails with a permission error.** The authorization expired or was revoked in the
  Google account. Re-authorize the configuration; the sheet selection survives.
- **The spreadsheet stays empty.** The table was saved in the configuration but the
  component has not run since — click **Run Component**. If it did run, check in **Jobs**
  whether the source table had any rows.
- **Only some columns arrive.** The sheet was created against an older version of the table.
  Delete the sheet from the configuration and add it again so the column list is rebuilt.
- **You cannot open the spreadsheet.** It lives in the authorized Google account, not
  yours — if you authorized a colleague's account, ask them to share it.

:::tip[Or ask Kai]
Kai can confirm the delivery matched the source:

> Read the last Google Sheets destination job and tell me whether it succeeded and what it
> reported, then give me the row count of
> `out.c-denormalize-opportunities.opportunity_denorm`.
:::

**Next:** [Automate it with a flow →](/getting-started/automate/)
