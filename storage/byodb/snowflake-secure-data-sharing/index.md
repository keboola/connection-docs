---
title: Snowflake Securat Data Sharing
permalink: /storage/byodb/snowflake-secure-data-sharing/
---

* TOC
{:toc}

Use the information provided here to share a database and its objects with one or more accounts by creating a share. Keboola now supports only **Grant privileges on objects directly to a share** and tables, external tables, views, secure views and secure materialized views. This guide can be also found in [Snowflake documentation](https://docs.snowflake.com/en/user-guide/data-sharing-gs#grant-privileges-directly-to-a-share).

The process is divided between _Producer_ and _Consumer._ Producer is Snowflake account where shared data lives. Consumer is account that want access to those data.

## Producer part

### Create a share
Use `CREATE SHARE` to create a share. At this step, the share is simply a container waiting for objects and accounts to be added.

```sql
CREATE SHARE <SHARE_NAME>;
```

### Add objects to the share by granting privileges
Use `GRANT <privilege> … TO SHARE` to grant the following object privileges to the share:
* USAGE privilege on the database you wish to share. 
* USAGE privilege on each database schema containing the objects you wish to share. 
* SELECT privilege for sharing specific objects in each shared schema:
  * Tables 
  * External tables 
  * Secure views 
  * Secure materialized views

```sql
GRANT USAGE ON DATABASE <DATABASE_NAME> TO SHARE <SHARE_NAME>;
GRANT USAGE ON SCHEMA <DATABASE_NAME>.<SCHEMA_NAME> TO SHARE <SHARE_NAME>;
GRANT SELECT ON ALL TABLES IN DATABASE <DATABASE_NAME> TO SHARE <SHARE_NAME>;
GRANT SELECT ON ALL TABLES IN SCHEMA <DATABASE_NAME>.<SCHEMA_NAME> TO SHARE <SHARE_NAME>;
GRANT SELECT ON TABLE <DATABASE_NAME>.<SCHEMA_NAME>.<TABLE_NAME> TO SHARE <SHARE_NAME>;
```

Optionally use `SHOW GRANTS` to view the object grants for the share.
```sql
SHOW GRANTS TO SHARE <SHARE_NAME>;
```

### Add one or more accounts to the share
Use `ALTER SHARE` to add one or more accounts to the share. To review the accounts added to the share, you can use `SHOW SHARES`.
```sql
ALTER SHARE <SHARE_NAME ADD ACCOUNTS=<ACCOUNT_NAME>;
```
```sql
SHOW SHARES;
```

The share is now ready to be consumed by the specified accounts. For more detailed instructions for performing these and other data provider tasks, refer to [Create and configure shares](https://docs.snowflake.com/en/user-guide/data-sharing-provider).

## Consumer Part

This guide can be also found in [Snowflake documentation](https://docs.snowflake.com/en/user-guide/data-share-consumers)

You must use the `ACCOUNTADMIN` role (or a role granted the `IMPORT SHARE` global privilege) to perform these tasks. For more details about the `IMPORT SHARE` privilege, see [Enable non-ACCOUNTADMIN roles to perform data sharing tasks](https://docs.snowflake.com/en/user-guide/security-access-privileges-shares).

### General limitations for imported databases
Imported databases have the following limitations for consumers:
* Imported databases are read-only. Users in a consumer account can view/query data, but cannot insert or update data, or create any objects in the database. 
* The following actions are not supported:
  * Creating a clone of an imported database or any schemas/tables in the database. 
  * Time Travel for an imported database or any schemas/tables in the database. 
  * Editing the comments for an imported database.
* Imported databases and all the objects in the database cannot be re-shared with (imported by) other accounts. 
* Imported databases cannot be replicated.

### Viewing available shares
You can view the shares that are available to consume in your account using either the web interface or SQL:
```sql
SHOW SHARES;
```

```sql
DESC SHARE <PRODUCER_ACCOUNT>.<SHARE_NAME>;
```

### Creating a database from a share
You can create a database from a share using the web interface or SQL:
```sql
CREATE DATABASE <CONSUMER_DATABASE_NAME> FROM SHARE <PRODUCER_ACCOUNT>.<SHARE_NAME>;
```

### Granting privileges on an imported database
Keboola now support only shares with dirrect access to database objects. Shares with roles are not supported right now.

Allow users to access objects in a share by granting the `IMPORTED PRIVILEGES` privilege on an imported database to one or more roles in your account.

A role can grant `IMPORTED PRIVILEGES` on an imported database only when it either:
* Owns the imported database (i.e. has the `OWNERSHIP` privilege on the database). 
* Was granted the `MANAGE GRANTS` global privilege.

```sql
GRANT IMPORTED PRIVILEGES ON DATABASE <CONSUMER_DATABASE_NAME> TO <KEBOOLA_PROJECT_ROLE>;
```

## Finish
Now you can register your schema in newly created database as external bucket in Keboola to work with it inside Keboola.
