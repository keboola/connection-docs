---
title: Snowflake Workspaces Access Changes
permalink: /workspace/snowflake-workspaces-access-changes/
redirect_from:
  - /transformations/workspace/snowflake-workspaces-access-changes/
---


* TOC
{:toc}

# ⚠️ Crucial Snowflake Workspace Access Change
By **end of the year 2025**, all projects using Keboola’s shared Snowflake backend ([Multi-tenant](/storage/#multi-tenant-mt) or [Pay-As-You-Go](/management/payg-project/)) will lose direct access to SQL workspaces, as Snowflake prohibits shared accounts across customers.

Users will no longer be able to log in to the Snowflake UI environment, nor connect through external tools such as IDEs or BI platforms. New tools are provided to support SQL development and connect the BI tools.


# Snowflake Single-factor Password Authentication Deprecation
While [Keboola-Brings-Database](/storage/#keboola-brings-database-kbdb) and [Bring-Your-Own-Database](/storage/#bring-your-own-database-byodb) projects are not losing access to Snowflake workspaces, [Snowflake is globally deprecating single-factor password authentication](https://docs.snowflake.com/en/user-guide/security-mfa-rollout) and we are implementing changes to Keboola platform to support this change.

# Timeline of Changes

Some changes apply only to specific customer types using the Snowflake backend for their Keboola projects:

- **KBDB/BYODB** (Keboola-Brings-Database/Bring-Your-Own-Database) - Contract customers using a dedicated Snowflake account for their project (direct ownership, reseller deal, or a dedicated account provided by Keboola).
- **MT/PAYG** (Multi-tenant/Pay-As-You-Go) - Contract customers using Keboola’s Snowflake backend shared with other Multi-tenant/Pay-As-You-Go customers.

✅ = This change applies to you

❌ = This change does not apply to you

We recommend scanning only the sections with ✅ for your customer type.

## October 6, 2025

### Snowflake SQL Workspaces: Key Pair as Default Authentication
✅ KBDB/BYODB

✅ MT/PAYG

In July, we introduced a new authentication method for Snowflake SQL workspaces - Key Pair & SSO.

Since Snowflake will soon deprecate single-factor password authentication, the default method for creating new workspaces will now be Key Pair.

## October 31, 2025

### Snowflake SQL Workspaces Migration Tool
✅ KBDB/BYODB

✅ MT/PAYG

Some users may heavily rely on their legacy workspaces with password authentication—whether for long-term BI tool database schemas or for worksheets with scripts they want to keep. To support them with the change, we are introducing a **migration tool** that allows them to easily switch a workspace’s authentication method to **Key Pair**.

This ensures they can keep all workspace content intact. The only required step will be updating the authentication method for any tool accessing that workspace (and its underlying Snowflake schema), changing it from **Password** to **Key Pair**.

The migration is irreversible.

## November 7, 2025

### Data Gateway Component Public Release
☑️ KBDB/BYODB

✅ MT/PAYG

The [Data Gateway](/components/applications/data-gateway/) component allows users to share data from Keboola Storage in read-only mode via a Snowflake schema that exists outside Keboola’s shared database. Its main purpose is to provide access for third-party BI tools, serving as a replacement for regular Snowflake workspaces, which MT/PAYG users will no longer be able to use.

**KBDB/BYODB** - Use of this component is optional for customers with a dedicated Snowflake account. Since it spins up an additional Snowflake warehouse outside the account, it may unnecessarily increase Snowflake usage. In this case, customers can use SQL workspaces or create schemas directly in their database, hence sharing resources with other Keboola components utilizing Snowflake. Our support team can help with the best solution for the customer's use case.

## November 30, 2025

### Snowflake SQL Workspaces: Password Authentication Deprecated
✅ KBDB/BYODB

✅ MT/PAYG

As announced by Snowflake, customers will no longer be able to create **new legacy workspaces** that support single-factor password authentication (find out more in the official [Snowflake documentation](https://docs.snowflake.com/en/user-guide/security-mfa-rollout#deprecation-timeline)).

To align with this global Snowflake change, we will remove the option to create legacy workspaces from the UI. Going forward, only **Key Pair** (for third-party tools) and **SSO** (for Snowsight) will be supported.

### Keboola SQL Editor in Production
✅ KBDB/BYODB

✅ MT/PAYG

Keboola’s brand new [SQL editor](/transformations/sql-editor/) allows SQL development directly within Keboola. This powerful tool lets you query, explore, and transform your data directly inside Keboola, without the need to authenticate external tools or leave the project context.

With the upcoming workspace access changes, this editor will serve as the go-to solution for SQL development for customers using Keboola’s shared Snowflake backend (MT/PAYG).

### Snowflake Writer: Remove Option to Choose Keboola Snowflake Database
❌ KBDB/BYODB

✅ MT/PAYG

Projects using Keboola's shared Snowflake backend (MT/PAYG) will no longer be able to use the [Keboola-provisioned Snowflake database](/components/writers/database/snowflake/#using-keboola-provisioned-database) as a data destination for Snowflake Writer.

The option to use the Keboola Snowflake database has been used mainly for connecting 3rd party BI tools. This use case will be covered by the recently released [Data Gateway](/components/applications/data-gateway/) component.

The Data Gateway component can reuse existing Snowflake Writer configurations to quickly set up tables, columns, and data loading options.

## January 7, 2026

### ⚠️ Multi-tenant and Pay-As-You-Go Projects Lose Direct Access to Snowflake Workspaces
❌ KBDB/BYODB

✅ MT/PAYG

By the end of the year, all customers using Keboola’s shared Snowflake backend (MT/PAYG) will lose direct access to Snowflake. This aligns with Snowflake’s policies for shared account environments.

We know this is a significant change, and it will impact many of our loyal customers. Here are the available paths forward:

**Options for Multi-tenant Customers**

- Continue using Keboola’s shared Snowflake backend with the **SQL Editor** and **Data Gateway** component, which provide a robust set of tools for ETL pipelines—without needing a dedicated Snowflake account.
- For those requiring more Snowflake features or direct access, we offer **dedicated Snowflake accounts**. We are proactively contacting heavy SQL users with this option. If you haven’t been contacted and believe this fits your needs, please reach out to your account manager or [our support team](/management/support/).
- Alternatively, switch to **BigQuery**, though this usually requires effort to re-write existing Snowflake transformations into the BigQuery dialect.

**Options for Pay-As-You-Go Customers**

- Use the **SQL Editor** and **Data Gateway** tools, similar to MT customers.
- Switch to a **BigQuery PAYG** project by creating a new one via our wizard. If you have prepaid credits in your Snowflake PAYG project, our support team can help transfer them.
- Move to a **regular contract**, either KBDB/BYODB (Snowflake/BigQuery) or MT BigQuery. This option best suits customers looking to expand their Keboola usage, though it naturally involves higher costs.

## August to October 2026

### Snowflake Fully Deprecates Single-Factor Password Authentication
✅ KBDB/BYODB

❌ MT/PAYG

When this change takes effect, only KBDB/BYODB customers will still have access to Snowflake workspaces. All existing workspaces must be migrated to Key Pair authentication; otherwise, access will stop working once [Snowflake rolls out this change](https://docs.snowflake.com/en/user-guide/security-mfa-rollout?ref=changelog.keboola.com#label-security-mfa-milestone-all-users).
