---
title: Keboola Platform Usage Blueprint
permalink: /tutorial/onboarding/usage-blueprint/
---

> Welcome to your personalized Keboola Platform Usage Blueprint Document! 
> 
> *This detailed guide helps you create your own documentation, explaining each part and what to include.
> It's designed to fit your organization's specific needs and values. You'll find helpful notes throughout to make customization easy.
> Once you've added your details, you can remove these notes. Download [this file](/tutorial/onboarding/usage-blueprint/), and start creating documentation matching your organization's unique requirements!*
>
> *You can view a sample of the content from the Platform Usage Blueprint document below.*

* TOC
{:toc}

## Getting Access to the Keboola Platform 
### Keboola Administration
> *At the start, choose a few people (usually 2 to 4, depending on how big your organization is) to be your Keboola organization administrators.
> They'll have the power to set up new Keboola projects and add the first users. It's best to keep this group small.*

**Keboola organization admin** is a role with permissions to:
- Leave and re-enter all existing projects in the organization.
- View and edit billing details.
- Manage [shared buckets](/catalog/#sharing-types).
- Create [new projects](/management/organization/#manage-projects).
- Change [organization settings](/management/organization/#organization-settings).
- Allow [Keboola support team](/management/support/#require-approval-for-support-access) to join your projects.

Our Keboola organization administrators are:
- Name, [email@company.com](email@company.com)
- Name, [email2@company.com](email2@company.com)
- Name, [email3@company.com](email3@company.com)

#### User requesting access to a project
> *Usually, Keboola administrators keep a list of all current projects, project owners, and lead project engineers.
> If you want access to a project, find the project leader on this list and ask them directly. They can use our public guide to add you to the project.*
>
> *Keep in mind, if you use a single-tenant Keboola deployment with customized identity and access management, such as Active Directory,
> this process may not apply to you. In that case, describe your organization's own process.*

To join an existing Keboola project, reach out to the **project owner** directly to invite you to the project. We’ve listed all our current projects below.

| Project ID | Name | Description | Owner |
|---|---|---|---|
| 111 | [PROD] Marketing | Production project for marketing campaign automation | Jane Doe; jane@company.com |

#### Member accessing a project
> *Depending on your selection, you might be operating in a multi-tenant Azure (North Europe region), AWS (US or EU regions),
> or GCP (Europe region) stack, or a dedicated single-tenant stack. The location of the stack determines the base URL that’ll take you to the platform’s UI.
> Check below for the link that matches your stack:*
>
> - Azure North Europe: [https://connection.north-europe.azure.keboola.com/admin/](https://connection.north-europe.azure.keboola.com/admin/)
> - AWS EU: [https://connection.eu-central-1.keboola.com/admin](https://connection.eu-central-1.keboola.com/admin)
> - AWS US: [https://connection.keboola.com/admin](https://connection.keboola.com/admin)
> - GCP EU: [https://connection.europe-west2.gcp.keboola.com](https://connection.europe-west2.gcp.keboola.com)
> - Single tenant stack: All relevant information is available within your Production Design document.

Navigate to the login site of the Keboola platform here: [https://connection.keboola.com/admin](https://connection.keboola.com/admin). 
After you log in, you'll see a list of projects you can access. Click on the selected project name to access the project environment.

#### Requesting a new project
If you wish to develop your own use cases in Keboola, reach out to one of the organization administrators mentioned above to create a project for you.

> *To have a new project created, contact a Keboola administrator. Organization administrators are the only ones who can set up Keboola projects.*
>
> *The way to request a new project might vary based on the company size. In larger companies, using a form or questionnaire for project requests is common.
> This helps give the administrators the extra information they need to create the project.*

#### User termination
Terminated users must be manually removed from all projects they are members of. Keboola organization administrators can use telemetry data 
(see the [**Keboola Governance Guide**](/tutorial/onboarding/governance-guide/) for more details) to determine which projects to remove them from.

Or, project owners can remove the terminated user themselves.

***Note:** Removing a user from a project will not affect any configurations they set up. 
All their configurations will remain usable and functional after the user is removed.*

### Project Naming Conventions
> *It is a good idea to establish and follow a convention for creating project names so they are clear and show what the project is about.
> We suggest some of the typical conventions below. See the [Multi-Project Architecture Guide](/tutorial/onboarding/architecture-guide/)
> for more on how to name different project levels, stages, etc.*
>
> *In the following example, we use numerical codes like 00, 10, and 20 to show project levels, but you can also use L0, L1, L2, or other styles.*

All projects in our organization follow this naming convention:

`[STAGE]{Domain - optional}[Region - optional] Project Name`

In the **Project Name**, we capitalize the first letter of each word, except for conjunctions like "and" and "or."

Here are examples of how we name projects:

- `[10]{Sales}[EU] Financial Reporting`
- `[00]{Sales} Corporate Rrofiling`
- `[20]{HR}[GLOBAL] Compensation and Benefits Planning`

## Keboola Project Rules and Principles
### Managing Project Users
> *As mentioned before, a project owner is mainly responsible for managing project users. Keboola has different roles for project users.*

The project owner needs to ensure users are added with the right roles. Keboola user roles are documented [here](https://help.keboola.com/management/project/users/#user-roles). 
Remember, being a project owner is a formal role and doesn’t directly correspond to specific Keboola project roles and privileges. 
Usually, users are invited as project admins or with a sharing role unless they need a different one.

To invite or remove a user from your project, follow the steps in the [Keboola documentation](https://help.keboola.com/management/project/users/#inviting-user).

### Naming Conventions
> *Using naming conventions for all Keboola components is recommended to keep your project well organized, comprehensible, and simpler to manage and navigate.
> The guidelines below are just suggestions, as there is no universally recognized best practice for naming.*

Make sure to apply the naming rules below to all configurations of Keboola components, including data source and data destination connectors, 
transformations, workspaces, flows, and any other Storage objects you create.

#### Component configurations
When naming a component (like a data connector or application), include its use case or category and, if relevant, its domain. 
Start each word in the configuration name with a capital letter.

`{Domain}[USECASE - optional] Configuration Name`

Examples:
- `{Sales}[REPORTING] Payments and Invoices`
- `{Operations}[PLANNING] Workloads and Plan`

For components with configuration rows, like connectors loading data from a database, name each row after the specific table it connects to. 
The name should reflect the specific endpoint or domain if it's an API or service connector.

#### Transformations
When naming transformations or optional folders, use a format like `[USECASE - optional] Transformation Name` to keep them organized.

Examples:
- `[REPORTING] Payment Data Preprocessing`
- `[REPORTING] Invoices Denormalization`

If transformations are part of a bigger process and run in a set order, add a number to show the sequence:

- `[REPORTING][00] Payment Data Preprocessing`
- `[REPORTING][01] Invoices Denormalization`
- `[REPORTING][02] Main Report Calculation`

Transformations can also be grouped into transformation folders. Name such folders using the following format: `[USECASE] Transformation Folder Name`.

Example:
- `[REPORTING] Financial Reporting`

#### Workspaces
You can name private workspaces however you like. For shared workspaces, use `[USECASE]{Owner-optional} Workspace Name`.

Example:
- `[REPORTING]{Jane} ML Model Development`

#### Flows
Flow names need to state their purpose and use case. If flows depend on each other in a project, use the stage signs like in the Transformations section. 
You can add a domain if it’s not part of the project. The convention is `[USECASE]{Domain}[STAGE] Flow Name`.

Examples:
- `[REPORTING]{Sales} Main Reporting Calculations`
- `[PLANNING][00] Data extractions`
- `[PLANNING][01] Data normalization`

Flows can also be grouped into flow folders. Name such folders using the following format: `{Group} Flow Folder Name`. 
The `{Group}` can be, for example, the `Domain` or `STAGE` or simply anything that helps to organize your flows.

Example:
- `{Sales} Financial Reporting`

#### Storage
Keep in mind that Storage bucket and table names are automatically created by Keboola data source connectors. 
The following naming conventions are for objects you create yourself.

For Storage buckets, tables, and columns:
1. Use uppercase `SNAKE_CASE` naming.
2. Don't use `OUT` buckets for temporary tables. `OUT` buckets should only have data that's ready to use. See Keboola's documentation for more on IN and OUT Storage buckets [here](/storage/buckets/).
3. Mark buckets from the [Data Catalog](/catalog/) as `SHARED`, like `SHARED_REPORTING_FINANCIAL`.
4. Be specific with names. Instead of `MAIN`, use something descriptive like `SALES_METRICS`. Even in specific projects, use `SALES_MAIN` rather than just `MAIN`.
5. Clearly separate IN/OUT Storage stages:
   - IN stage: Incoming data, like raw data or shared buckets 
   - OUT stage: Processed data ready to be used elsewhere (in BI tools, Snowflake, other projects).
6. Set “_PK” and “_ID” columns within each table to mark primary and foreign keys.


<div class="clearfix"></div>
<div class="alert alert-warning" role="alert">
    <i class="fas fa-exclamation-circle"></i>
    <strong>Important:</strong> Some data source connectors create Storage buckets you cannot rename. 
   Generally, don’t apply the same naming conventions on anything loaded into Keboola via a data source connector (e.g., a table, CSV file, and JSON). 
   Keep their original names and use these naming conventions only for the layers you add on top for consistency and simplicity.
</div>


### Descriptions
Every component configuration, transformation, or flow should briefly explain (in two or three sentences) its role in the data flow.
Here are some tips:

1. Add more details further into the description, like any implementation specifics or important points to note.
2. Use Markdown to highlight important sections.
3. Include links to related objects or other parts of the project, e.g., `Keep in sync with the [original transformation](https://connection.keboola.com/admin/projects/xx/transformations/bucket/1234/transformation/1)`.
4. Consider mentioning the original owner of the configuration, even though this can be seen in the version history.

### Sharing Data via Data Catalog
> *This depends on your multi-project architecture. Here’s a guide for a system with multiple project layers.*

Only users with `organization admin` or `share` role permissions can share buckets. 

As a rule, avoid sharing data from higher to lower stages/layers. Limit sharing within the same stage/layer unless necessary.

In the example below, we use levels 00, 10, 15, and 20 as equivalents to L0, L1, L15, and L2.

**Sharing from level 00**
- Share only with 10-level projects.
- Share only `OUT` stage buckets. Share tables into the output buckets using table aliases if no transformation is needed.

**Sharing from level 1+**
- Do not share with 00-level projects.
- Try to limit sharing to other level 10 projects if possible.
- Share only `OUT` stage buckets. Share tables into the output buckets using table aliases if no transformation is needed.

**Sharing from level 20**
- Do not share with 00- or 10- or 15-level projects.
- The outputs of level 20 projects typically consist of data products that are ready for consumption in BI tools, applications, or other contexts.

**Linking buckets**
- Buckets from other projects are always in the `IN` stage, prefixed with `SHARED` and a reference to the input project.

### Using Development Branches
> *[Development branches](/components/branches/) are separate areas for independently developing or modifying configurations for a specific purpose.
> Changes made within a branch become accessible to other branches or projects only after they are merged into production.*
>
> *Some users implement changes in development branches but create new configurations directly in the production branch. Others might not use branches,
> depending on their internal rules.*

When creating or modifying configurations, use a development branch. Name it `{Owner}[USE-CASE] Branch Name` to show its purpose, like 
`{Jane}[FINANCIAL REPORTING] New MSSQL data integration`.

Run components like data source connectors, applications, and transformations in the development branch first to test them.

Be careful with data destination connectors, as they can still overwrite production data.

## Security Principles
> *Include your organization’s specific security principles here. The platform might not directly enforce some,
> but Organization admins can monitor them using telemetry data.*
>
> *Here are some of the commonly followed principles:*

- Only project owners invite users to their projects.
- Every user must enable an MFA (multi-factor authentication).
- All changes should be made in a development branch.
- Don’t store sensitive information like passwords, tokens, or keys in plain text in configurations (e.g., don’t use a Python transformation for integration with an API that requires a token authentication).
- Consult the project owner before using data destination components to write data out of projects.
  
### Admin Project
> *For organizations with multiple projects, creating a dedicated admin project is helpful. This is a central hub for administrators to manage
> and analyze telemetry data. Find more details in the [Keboola Governance Guide](/tutorial/onboarding/governance-guide/).*

Our admin project link: [https://connection.keboola.com/admin/projects/XXX](https://connection.keboola.com/admin/projects/)

The project extracts the organization's telemetry data and prepares it for visualization and reporting.
