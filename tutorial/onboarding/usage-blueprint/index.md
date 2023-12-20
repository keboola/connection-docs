---
title: Keboola Platform Usage Blueprint
permalink: /tutorial/onboarding/usage-blueprint/
---

* TOC
{:toc}

> Welcome to your personalized Keboola Platform Usage Blueprint Document! 
> 
> *This comprehensive guide is designed to serve as a foundation for crafting your customized documentation. 
> Each section outlines its purpose and recommends content, providing you with a framework that can be tailored to your organization's specific principles
> and details. As you navigate through this document, notes formatted for guidance will accompany you, ensuring a seamless and
> straightforward customization process. Feel free to delete these notes once you've incorporated your unique insights and details into your personalized
> blueprint. Let's embark on this journey of building a tailored documentation resource that aligns perfectly with your organization's needs and practices.*

## Getting Access to the Keboola Platform 
### Keboola Administration
> *In the initial stages, you'll need to identify your Keboola Organization administrators who will have the authority to create new Keboola projects
> and invite initial users. It is generally recommended to keep the number of Organization administrators limited, typically ranging from 2 to 4,
> based on the organization's size.*

**Keboola Organization admin** is a role with permissions to:
- Leave and re-enter all existing projects in the organization.
- View and edit billing details.
- Manage [shared buckets](/catalog/#sharing-types).
- Create [new projects](/management/organization/#manage-projects).
- Change [organization settings](/management/organization/#organization-settings).
- Allow [Keboola Support team](/management/support/#require-approval-for-support-access) to join your projects.

Our Keboola organization administrators are:
- Name, [email@company.com](email@company.com)
- Name, [email2@company.com](email2@company.com)
- Name, [email3@company.com](email3@company.com)

#### User requesting access to a Keboola project
> *Usually, Keboola Administrators maintain a list of current projects, including the project owner or lead project engineer.
> Users are directed to this list to contact the project owner directly. The project owner can then follow the guide in our public documentation
> to invite the user into a project.*
>
> *It's important to note that if you are using a single-tenant Keboola deployment with customized identity and access management, such as Active Directory,
> this process may not apply to you. In such cases, you should describe your organization's specific process for users to follow.*

To request access to any of our existing Keboola projects, please contact the Project Owner directly to invite you to the project. Below is a list of our existing Keboola projects.

| Project ID | Name | Description | Owner |
|---|---|---|---|
| 111 | [PROD] Marketing | Production project for marketing campaign automation | Jane Doe; jane@company.com |

#### Member accessing a project
> *Depending on your selection, you might be operating in a multi-tenant Azure (North Europe region), AWS (US or EU regions), or a GCP (Europe region) stack,
> or in your dedicated single-tenant stack. The location of the deployment determines the root URL that'll take you to the platform's UI.
> Please find the relevant link for your deployment:*
>
> *Azure North Europe: [https://connection.north-europe.azure.keboola.com/admin/](https://connection.north-europe.azure.keboola.com/admin/)
> AWS EU: [https://connection.eu-central-1.keboola.com/admin](https://connection.eu-central-1.keboola.com/admin)
> AWS US: [https://connection.keboola.com/admin](https://connection.keboola.com/admin)
> GCP EU: [TODO Please insert the link for GCP EU]
> Single tenant stack: All relevant information is available within your Production Design document.*

Navigate to the login site of our Keboola platform here: [https://connection.keboola.com/admin](https://connection.keboola.com/admin). 
After you log in, you'll see a list of projects you have access to. Click on the selected project name to access the project environment.

#### Requesting a new Keboola project
If you wish to develop your own use-cases in Keboola, please reach out to one of the Organization administrators mentioned above to create a project for you.

> *To request the creation of a new project, the requester should get in touch with a Keboola Administrator.
> The Organization Administrator holds the exclusive role of managing Keboola projects.*
>
> *The specific process may vary for each organization. In larger organizations, it is common to implement a questionnaire or form that users can use
> to request a project. This form often provides administrators with additional details they may need for the project creation process.*

#### Processing user termination
Terminated users must be manually removed from all projects they are members of. Keboola Organization administrators can leverage Telemetry data 
(refer to the [**Keboola Governance Guide**](/tutorial/onboarding/governance-guide/) for more details) to identify the projects and 
subsequently remove users from individual projects.

Alternatively, Project Owners can take the responsibility to remove terminated users from their respective projects.

It's important to note that removing a user from a project will not affect any configurations created by them. Configurations will still remain usable 
and functional after the user is removed.

### Project Naming Conventions
> *It is advisable to establish and uphold naming conventions for project names. The chosen names should be clear and indicative of the project's purpose.
> Below, we suggest some of the typical conventions. Please refer to the [Multi-Project Architecture Guide](/tutorial/onboarding/architecture-guide/)
> for details about different project levels/stages etc.*
>
> *In the following example, numerical codes such as 00, 10, 20 are used for project levels, but they can also be represented as L0, L1, L2, or other variations.*

All projects within our organization adhere to a specific naming convention:

`[STAGE]{Domain - optional}[Region - optional] Project Name`

For the **Project Name** part, the convention dictates capitalizing the initial letter of each word, except for conjunctions like "and" and "or."

Here are examples of project names:

- `[10]{Sales}[EU] Financial Reporting`
- `[00]{Sales} Corporate Rrofiling`
- `[20]{HR}[GLOBAL] Compensation and Benefits Planning`

## Keboola Project Rules and Principles
### Managing Project Users
> *As we mentioned in the previous chapters it’s typical to identify a Project Owner who is mainly responsible for managing project users.
> Keboola identifies several project user roles.*

The Project Owner bears the responsibility of ensuring that users are invited into their projects with the suitable roles. 
Keboola user roles are documented [here](https://help.keboola.com/management/project/users/#user-roles). 
It's essential to understand that the status of Project Owner is purely a formal role and 
doesn't directly correspond to specific Keboola project roles and privileges. In most cases, users are invited under a project admin role 
(or a share role) unless there is a specific requirement for a different role.

To invite or remove a user from your project, please refer to the official steps outlined in the Keboola documentation [here](https://help.keboola.com/management/project/users/#inviting-user).

### Naming Conventions
> *Implementing naming conventions for all components in Keboola is recommended. This ensures that the project remains organized, comprehensible,
> and simpler to manage and navigate. Keep in mind that the following is just a suggestion, as there is no universally recognized best practice
> for naming conventions.*

All configurations for Keboola components, including data source and data destination connectors, Transformations, Workspaces, Flows, and others, along with any Storage objects created, are required to adhere to the standard naming conventions outlined below.

#### Component configurations
The name of each component (data source/data destination connector or application) should include a use case/category (if possible), a domain (if applicable), 
and the configuration name should follow the convention of capitalizing the first letter.

`{Domain}[USECASE - optional] Configuration Name`

Examples:
- `{Sales}[REPORTING] Payments and Invoices`
- `{Operations}[PLANNING] Workloads and Plan`

Certain components, particularly data source connectors, may incorporate configuration rows. For example, in a database configuration, 
a configuration row signifies a connection to a specific individual table. In this scenario, it is recommended to maintain the specific source object name 
as the configuration row's name. If it's an API or service connector, the name should represent a distinct endpoint or domain.

#### Transformations
For transformations and optional transformation folders, employ a systematic approach such as `[USECASE - optional] Transformation Name` to categorize 
and distinguish different transformations.

Examples:
- `[REPORTING] Payment Data Preprocessing`
- `[REPORTING] Invoices Denormalization`

If it's anticipated that individual transformations are components of a larger process and will consistently be executed together in a specific order, 
consider incorporating a stage sign, like:

- `[REPORTING][00] Payment Data Preprocessing`
- `[REPORTING][01] Invoices Denormalization`
- `[REPORTING][02] Main Report Calculation`

Transformations can be further grouped in Transformation Folders. Naming of such folders should follow a convention of `[USECASE] Transformation Folder Name`.

Example:
- `[REPORTING] Financial Reporting`

#### Workspaces
Names of private workspaces are completely up to the user. For shared workspaces, please follow the convention of `[USECASE]{Owner-optional} Workspace Name`.

Example:
- `[REPORTING]{Jane} ML Model Development`

#### Flows
Flow names should clearly articulate their purpose and use case. If there are dependencies between flows within one project, you can replicate the stage signs 
as suggested in the Transformations section above. Also, you can introduce a Domain unless the Domain is given by the project directly. 
The convention is `[USECASE]{Domain}[STAGE] Flow Name`.

Examples:
- `[REPORTING]{Sales} Main Reporting Calculations`
- `[PLANNING][00] Data extractions`
- `[PLANNING][01] Data normalization`

Flows can be further grouped in Flows Folders. Naming of such folders should follow a convention of `{Group} Flow Folder Name`. 
The `{Group}` can be for example the `Domain` or `STAGE` or simply anything you’d like to group your flows by.

Example:
- `{Sales} Financial Reporting`

#### Storage
Please be aware that certain objects, specifically Storage bucket names and Storage table names, are automatically generated by Keboola data source connectors.
The conventions outlined below are applicable solely to objects created through configurations, where users have the ability to set the object names.

For Storage buckets, tables, and columns, use the following rules:
1. Use uppercase `SNAKE_CASE` type of naming convention.
2. Avoid using `OUT` buckets for temporary tables, by putting something in an out bucket you're de facto declaring "these are processed and validated data that are ready for consumption". Please refer to Keboola official documentation for details about IN and OUT stages of Storage Buckets [here](/storage/buckets/).
3. Buckets linked to your project from [Data Catalog](/catalog/) should be marked with a `SHARED` keyword, e.g., `SHARED_REPORTING_FINANCIAL` for a bucket that’s named `REPORTING_FINANCIAL` in the source project.
4. Avoid using too general words like `MAIN` and rather choose something a bit more descriptive `SALES_METRICS`. Even if it is a final output bucket from a domain specific project `Sales` it should be named as `SALES_MAIN` rather than just `MAIN`.
5. Clearly differentiate between storage stages IN/OUT:
   - IN stage
      - Anything that comes to the project from the outside, before it is processed
      - Raw data from data source components, shared buckets
      - Tabular configurations for other components
   - OUT stage
      - Processed, output data that is ready for outputting outside – to BI tools, Snowflake, other projects.
6. Set “_PK” and “_ID” columns within each table to clearly define primary and foreign keys.

> [!IMPORTANT]
> It's important to note that certain Data Sources connector components might create Storage buckets that are not editable in the component configuration.
> In general, it is recommended not to impose the same naming conventions on ingested objects. Instead, maintain the original names from the data source
> and apply preferred naming conventions to layers created above them for consistency and simplicity.
