---
title: Snowflake Secure Data Sharing
permalink: /storage/byodb/snowflake-secure-data-sharing/
---

* TOC
{:toc}

This guide explains how to share a database and its objects with one or more accounts by creating a share. Currently, Keboola supports granting privileges directly to a share, specifically for tables, external tables, views, secure views, and secure materialized views. For further reference, consult the [Snowflake documentation](https://docs.snowflake.com/en/user-guide/data-sharing-gs#grant-privileges-directly-to-a-share).

The process involves **two roles**:

- **Producer:** The Snowflake account that owns and shares the data.
- **Consumer:** The Snowflake account that accesses the shared data. This account must be used in Keboola as [BYODB](https://help.keboola.com/storage/byodb/#main-header).

## Producer Workflow
As the producer, your role involves creating the share, adding the necessary database objects, and granting access to consumer accounts. Follow these steps to configure the share:

### Create a Share
Use `CREATE SHARE` to set up a share. Initially, the share is an empty container waiting for objects and accounts to be added.

```sql
CREATE SHARE <SHARE_NAME>;
```

### Add Objects to the Share by Granting Privileges
Grant privileges using `GRANT <privilege> ... TO SHARE`. You need to provide:
* USAGE privilege on the database to be shared. 
* USAGE privilege on each database schema containing the objects to be shared. 
* SELECT privilege for specific objects in the shared schema, such as:
  * Tables
  * External tables
  * Secure views
  * Secure materialized views

Example:
```sql
GRANT USAGE ON DATABASE <DATABASE_NAME> TO SHARE <SHARE_NAME>;
GRANT USAGE ON SCHEMA <DATABASE_NAME>.<SCHEMA_NAME> TO SHARE <SHARE_NAME>;
GRANT SELECT ON ALL TABLES IN DATABASE <DATABASE_NAME> TO SHARE <SHARE_NAME>;
GRANT SELECT ON ALL TABLES IN SCHEMA <DATABASE_NAME>.<SCHEMA_NAME> TO SHARE <SHARE_NAME>;
GRANT SELECT ON TABLE <DATABASE_NAME>.<SCHEMA_NAME>.<TABLE_NAME> TO SHARE <SHARE_NAME>;
```

To review object grants, use:
```sql
SHOW GRANTS TO SHARE <SHARE_NAME>;
```

### Add Accounts to the Share
Add one or more accounts to the share using `ALTER SHARE`. To verify, use `SHOW SHARES`.
```sql
ALTER SHARE <SHARE_NAME> ADD ACCOUNTS=<ACCOUNT_NAME>;
```
```sql
SHOW SHARES;
```

The share is now ready for consumption by the specified accounts. For detailed guidance, refer to [Create and configure shares](https://docs.snowflake.com/en/user-guide/data-sharing-provider).

## Consumer Workflow
To use the shared data, follow these steps to create and configure a database from the provided share. Refer to the [Snowflake documentation](https://docs.snowflake.com/en/user-guide/data-share-consumers) for more information.

### Role Requirements
To perform these tasks, use the `ACCOUNTADMIN` role or a role with the `IMPORT SHARE` global privilege. For more details, see [Enable non-ACCOUNTADMIN roles to perform data sharing tasks](https://docs.snowflake.com/en/user-guide/security-access-privileges-shares).

### Limitations of Imported Databases
Imported databases have the following restrictions:
* **Read-only**: Consumers can query data but cannot modify it or create new objects.
* Unsupported actions include:
  * Cloning imported databases, schemas, or tables.
  * Using Time Travel for imported databases or their objects.
  * Editing comments for imported databases.
* They cannot be:
  * Re-shared with other accounts.
  * Replicated.

### Viewing Available Shares
Use the web interface or SQL to view available shares:
```sql
SHOW SHARES;
```

```sql
DESC SHARE <PRODUCER_ACCOUNT>.<SHARE_NAME>;
```

### Create a Database from a Share
To consume shared data, create a database from the share:
```sql
CREATE DATABASE <CONSUMER_DATABASE_NAME> FROM SHARE <PRODUCER_ACCOUNT>.<SHARE_NAME>;
```

### Granting Privileges on an Imported Database
Keboola currently supports only shares with [**direct access to database objects**](https://docs.snowflake.com/en/user-guide/data-sharing-policy-protected-data). Shares with roles are not supported.

To allow users to access shared objects, grant the `IMPORTED PRIVILEGES` privilege on the imported database to one or more roles in your account. A role can grant `IMPORTED PRIVILEGES` only if it:
* Owns the imported database (i.e., has the `OWNERSHIP` privilege).
* Has been granted the `MANAGE GRANTS` global privilege.

Example:
```sql
GRANT IMPORTED PRIVILEGES ON DATABASE <CONSUMER_DATABASE_NAME> TO <KEBOOLA_PROJECT_ROLE>;
```

### Limitations
While sharing data can greatly enhance collaboration, certain object types and policies are not supported. Please keep the following limitations in mind:

- Supported objects exclude secure user-defined functions (UDFs) and Apache Iceberg™ tables.
- Masking policies will not be applied after sharing with other Keboola projects.

## Final Step
You can now register the schema in the newly created database as an external dataset in Keboola, enabling seamless data integration. Use `<CONSUMER_DATABASE_NAME>` as the database name and 
the schema present in this database. When registering, don't forget to check the `Secure Data Share` checkbox.
