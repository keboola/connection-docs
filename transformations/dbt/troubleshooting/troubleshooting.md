---
title: Troubleshooting
permalink: /transformations/dbt/troubleshooting/
---

## Remote workspaces

Debugging connection failures in remote workspaces is often complex because we lack access to the source code. Since the dbt project is hosted in the client's private Git repository, we cannot review the specific configurations causing the issue.

### Authentication issues

A connection failure may occur if the authentication method supplied by the dbt transformation does not match the method expected in the dbt project's `profiles.yml`. 

In `profiles.yml`, you have access to two environment variables. One is populated when using a password (`DBT_KBC_PROD_PASSWORD`), while the other is populated when using a private key (`DBT_KBC_PROD_PRIVATE_KEY`). Ensure the private key is pasted exactly as generated, without any modifications. It is crucial to include both the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` comments.

You may encounter the following errors.

**Transformation uses a private key for authentication, but the dbt project expects a password:**

```
Runtime Error   Database error while listing schemas in database ""SCHEMA_4242""   Database Error     250001 (08001): Failed to connect to DB: my-remote.snowflakecomputing.com:443. Incorrect username or password was specified.
```

**Transformation uses a password for authentication, but the dbt project expects a private key:**

```
Parsing Error   Env var required but not provided: 'DBT_KBC_PROD_PRIVATE_KEY'
```

**Transformation provided an incorrect or malformed private key**

```
Runtime Error   Database error while listing schemas in database ""SCHEMA_1313""   Database Error     250001 (08001): Failed to connect to DB: my-remote.snowflakecomputing.com:443. JWT token is invalid.
```
