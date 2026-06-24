---
title: How do I run an Oracle transformation?
slug: 'transformations/oracle'
description: Create, configure, and run an Oracle SQL transformation in Keboola — set up the database user and credentials, write the SQL, map input and output, and run it. Note that Oracle transformations run on your own Oracle server.
keywords:
  - Oracle transformation
  - Oracle transformations
  - Oracle SQL transformation Keboola
  - Oracle transformation credentials
  - Oracle transformation schema
type: how-to
---

You want to transform data with SQL on an [Oracle database](https://www.oracle.com/database/). Unlike other backends, an Oracle transformation runs on **your own Oracle server** (it is not provisioned by Keboola), so you set up the database user and credentials yourself. This page takes you from nothing to a successful run.

**Time:** ~15 minutes · **You will need:** a Keboola project, access to an Oracle server where you can create a user, and one table in [Storage](/storage/tables/) to read from.

## Before you start

- You manage the Oracle server. Keboola connects to it with credentials you provide, so the server must be reachable from Keboola and you are responsible for its availability.
- Have the [sample CSV file](/transformations/source.csv) (or any table) ready to upload to Storage as the input.

## Step 1 — Create a database user

In Oracle, create a dedicated user for Keboola and grant it the privileges to open a session and create tables. Replace the password with your own:

```sql
CREATE USER KEBOOLA_TRANSFORMATION IDENTIFIED BY "secretPassword20" QUOTA UNLIMITED ON USERS;

GRANT CREATE SESSION TO KEBOOLA_TRANSFORMATION;
GRANT CREATE TABLE TO KEBOOLA_TRANSFORMATION;
```

## Step 2 — Create the transformation and add credentials

1. Open **Components → Transformations**, click **New Transformation**, and choose **Oracle Transformation**. <!-- TODO(human-review): confirm nav + type labels. -->
2. Open the **Database Credentials** link in the configuration.
3. Enter the host, port, database/service, username, and password for the `KEBOOLA_TRANSFORMATION` user.
4. **(Optional) Schema** — an optional `schema` field under the database connection (`db.schema` in the configuration). Set it to run the transformation against a specific Oracle schema; leave it empty to use the connected user's default schema. <!-- Verified vs code (PRDCT-354 audit): optional scalarNode('schema') in oracle-transformation ConfigDefinition.php. -->
5. Click **Test Credentials**, then **Save**.

## Step 3 — Map the input

1. Upload the [sample CSV file](/transformations/source.csv) to Storage as a table.
2. In **Input Mapping**, add the table and set its **Destination** to `source`.
3. Save the mapping.

## Step 4 — Write the SQL script

In the code editor, paste:

```sql
CREATE TABLE "result" AS SELECT * FROM "source";
```

You can split longer scripts into [blocks](/transformations/#writing-scripts).

## Step 5 — Add the output mapping

1. In **Output Mapping**, set **Source** to `result` (the table the script creates).
2. Set **Destination** to a new Storage table, for example `out.c-main.result`.
3. Save the mapping.

## Step 6 — Run it and confirm the result

1. Click **Run** on the transformation.
2. Wait for the [job](/management/jobs/) to finish with a success status.
3. Open **Storage** and confirm your destination table contains the rows from `source`.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Credentials test fails | Server unreachable, wrong host/port/service, or user lacks `CREATE SESSION` | Verify connectivity and re-check the grants in Step 1. |
| `table or view does not exist` | Input destination name doesn't match the script, or wrong schema | Ensure the input **Destination** is `source`; if you set **Schema**, confirm the objects live there. |
| Run succeeds but nothing in Storage | Missing/incorrect output mapping | Add an output mapping whose **Source** matches the table the script created (`result`). |

## Related

- [Input and output mapping](/transformations/mappings/) — how staging works.
- [Tutorial: Manipulating data](/tutorial/manipulate/) — guided first transformation.
