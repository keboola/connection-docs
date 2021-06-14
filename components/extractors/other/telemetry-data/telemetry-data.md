---
title: Telemetry Data
permalink: /components/extractors/other/telemetry-data/
redirect_from:
    - /extractors/other/telemetry-data/

---

* TOC
{:toc}

The Telemetry Data extractor allows you to retrieve data about your project or 
about your whole [organization](/management/organization/). 
It helps you monitor activities and usage of your Keboola Connection projects. It also helps Keboola calculate your project consumption.

## Configuration
To configure the extractor, select one of the following modes:
 
1. **Project mode** --- extracts data from a selected Keboola Connection project only.
2. **Organization mode** --- extracts data from all projects of your organization. The data is extracted to a single target project. This must be set up by Keboola: Configure the extractor and contact your Keboola Customer Success Manager or our [support](/management/support/).

## Data Model
The model below helps you better understand relations between individual tables extracted by this component. 
Keep in mind that the tables *contact_limit_monthly*, *kbc_organization*, and *usage_metric* are extracted only in **Organization** mode.

{: .image-popup}
![Screenshot - Telemetry data model](/components/extractors/other/telemetry-data/telemetry-data-model.png)

*Note: You can find the schema in full resolution and with several export options [here](https://dbdiagram.io/d/602629a380d742080a3a406a).*

## Extracted Tables
The extracted tables provide you with information about your buckets, configurations, jobs, sandboxes,
organizations, projects, users, security events, and contract limits.

### kbc_bucket_snapshot
This table shows snapshots of the buckets in Storage.

| **Column** | **Description** | **Example** | 
| `bucket_id` (PK) | Storage bucket identifier | `in.c-instagram` |
| `kbc_project_id` (PK) | Foreign key to a KBC project | `866_eu-central-1_aws` |
| `snapshot_date` (PK) | Date of the data snapshot | `2020-06-30` |
| `stage` | Storage stage of the bucket | `in` |
| `bucket` | Name of the bucket | `c-instagram` |
| `rows` | Number of rows in the bucket on the date of the snapshot | `4714` |
| `bytes` | Bucket size in bytes on the date of the snapshot | `1870336` |
| `sharing_type` | Type of the bucket sharing (Data Catalog). <br> Possible values: `none` – bucket not shared, <br> `target` – bucket linked from another project, <br>`source` / `org private` – bucket shared from this project, linkable only by organization members <br> `source` / `org public` – bucket shared from this project, linkable by any project members | `target` |
| `shared_from_project_id` | Identifier of the source project if the bucket is linked (sharing_type = 'target') | `860_eu-central-1_aws` |
| `shared_from_bucket` | Identifier of the source bucket if the bucket is linked (sharing_type = 'target') | `in.c-keboola-ex-instagram-152387726` |


### kbc_component_configuration
This table lists the [configurations of the components](/components/#creating-component-configuration) 
(e.g., a configuration of the AWS S3 extractor).

| **Column** | **Description** | **Example** |  
| `kbc_component_configuration_id` (PK) | Component configuration identifier | `580_us-east-1_aws_keboola.python- transformation-v2-610931033` |
| `kbc_component_configuration_url` | URL of the configuration in the KBC project | `https://connection.keboola.com/ admin/projects/580/transformations/ bucket/152336525` |
| `kbc_project_id` | Foreign key to the KBC project | `580_us-east-1_aws` |
| `kbc_component_id` | Identifier of the component | `keboola.python-transformation-v2` |
| `kbc_component` | Name of the component | `Generic` |
| `configuration_id_num` | Numeric identifier of the configuration | `610931033` |
| `kbc_component_configuration` | Name of the configuration | `Sample data from Dynamics` |
| `kbc_configuration_version` | Current version of the configuration | `5` |
| `kbc_configuration_is_deleted` | Flag determining if the configuration is deleted (`true`, `false`) | `false` |
| `token_id` | Identifier of the token that created this version of the configuration | `241247` |
| `token_name` | Name of the token that created this version of the configuration | `martin.matejka@keboola.com` |


### kbc_component_configuration_version
This table shows the [version history](/components/#configuration-versions) 
of the component configuration.

| **Column** | **Description** | **Example** | 
| `kbc_component_configuration_id` (PK) | Component configuration identifier | `6610_us-east-1_aws_orchestrator-583757303` |
| `configuration_updated_at` | Datetime of the configuration update | `2020-03-28 20:29:25` |
| `change_description` | Description of what was changed in the configuration | `Update orchestration notifications` |
| `configuration_version` (PK) | Version of the configuration | `3` |
| `last_version` | Flag determining if this is the last version of the configuration (`true`, `false`) | `false` |
| `token_id` | Identifier of the token that created this version of the configuration | `241247` |
| `token_name` | Name of the token that created this version of the configuration | `martin.matejka@keboola.com` |


### kbc_data_science_sandbox
This table lists Python/R [workspaces](/transformations/workspace/)/[sandboxes](/transformations/sandbox/) 
and their consumption.

| **Column** | **Description** | **Example** | 
| `kbc_data_science_sandbox_resume_id` (PK) | Identifier of the sandbox active window (between starting and pausing the sandbox) | `10910_eu-central-1_aws_8c9e68ac-3a40-4aea-a62c-34ef37d12a5a` |
| `kbc_data_science_sandbox_id` | Data science sandbox identifier | `10910_eu-central-1_aws` |
| `kbc_project_id` | Foreign key to the KBC Project | `1075-eu-central-1` |
| `date` (PK) | Date for which the runtime hours and time credits are calculated | `2020-11-27` |
| `created_at` | Datetime of sandbox creation | `2020-11-27 11:22:08` |
| `expiration_at` | Sandbox expiration datetime | `2020-12-02 11:22:08` |
| `updated_at` | Datetime of when the sandbox was last updated | `2020-11-27 14:03:40` |
| `start_at` | Datetime of when the sandbox resume window started | `2020-11-27 11:22:08` |
| `sleep_at` | Datetime of when the sandbox resume window ended | `2020-11-27 14:03:40` |
| `type` | Type of the sandbox (`jupyter`, `rstudio`) | `jupyter` |
| `sandbox_active` | Flag determining if the sandbox is active | `false` |
| `hostname` | Hostname of the sandbox | `i-099734d8f8b97ae75-sandbox.eu-central-1.keboola.com` | 
|`sandbox_runtime_hours` | Runtime of the sandbox on the particular date in hours | `2.413333` |
| `backend_size` | Size of the data science backend | `Small` |
| `time_credits_used` | Number of the time credits consumed by the sandbox on the particular date | `2.413333` |
| `billed_credits_used` | Number of the actually billed credits | `2.413333` |


### kbc_job
This table lists the Keboola Connection [jobs](/management/jobs/) 
(e.g., an extractor job or a transformation).

| **Column** | **Description** | **Example** | 
| `kbc_job_id` (PK) | KBC job identifier | `117644387_eu-central-1_aws` |
| `kbc_component_configuration_id` | Foreign key to the component configuration | `410_eu-central-1_aws_keboola.wr-google-sheets-259642632` |
| `kbc_component_id` | Identifier of the component related to the job | `keboola.wr-google-sheets` |
| `transformation_type` | Type of the transformation, in case it is a transformation job. Possible values: <br> `OpenRefine`, `R`, `Python`, `SQL`, `Unknown` – the backend wasn't recognized in the data/new backend not yet introduced in the telemetry, `None` – either not a transformation job, or it is encapsulating an apparent transformation job | `None` |
| `job_run_id` | Run ID of the job – more jobs can be run under the same Run ID | `117643429.117644388` |
| `job_start_at` | Datetime of when the job started | `2020-03-15 11:59:39` |
| `job_created_at` | Datetime of when the job was created | `2020-03-15 11:59:38` |
| `job_status` | Status of the job (`success`, `error`, `terminated`, `processing`) | `success` |
| `job_run_type` | Determines if the job was run by an orchestration or manually (`orchestration`, `manual`). | `orchestration` |
| `token_id` | Identifier of the token that ran this job | `145062` |
| `token_name` | Name of the token that ran this job | `Orchestrator GDrive` |
| `job_time_credits_used` | Number of the time credits consumed by the job | `0.001218890000` |
| `job_billed_credits_used` | Number of the actually billed credits | `0.001218890000` |
| `job_total_time_sec` | Total time of the job in seconds (since the job’s initial trigger; its start might be delayed) | `63` |
| `job_run_time_sec` | Runtime of the job in seconds (since the job started) | `62` |
| `job_network_mb` | Data transferred via the network in MB – used for Writer billing | `6.094449` |
| `ds_backend_size` | Backend used for data science transformations (`Small`, `Medium`, `Large`) | `Small` |
| `dwh_small_ratio` | Ratio of the Small DWH used for SQL transformations (the sum of all ratios might be less than 1, as it might partially run on a free DWH) | `0.75` |
| `dwh_medium_ratio` | Ratio of the Medium DWH used for SQL transformations (the sum of all ratios might be less than 1, as it might partially run on a free DWH) | `0.25` |
| `dwh_large_ratio` | Ratio of the Large DWH used for SQL transformations (the sum of all ratios might be less than 1, as it might partially run on a free DWH) | `0` |


### kbc_organization
This table shows data about Keboola Connection [organizations](/management/organization/).

*Note: The table is available in **Organization** mode only.*

| **Column** | **Description** | **Example** | 
| `kbc_organization_id` (PK) | KBC organization identifier | `225_us-east-1_aws` |
| `kbc_organization_id_num` | Numerical organization identifier | `225` |
| `kbc_organization` | Name of the organization | `Keboola Internal` |
| `kbc_maintainer_id` | Identifier of the Maintainer (the parent of the organization) | `12_us-east-1_aws` |
| `kbc_region` | Region of the organization | `us-east-1` |
| `kbc_cloud` | Cloud provider of the organization | `aws` |
| `kbc_organization_created_at` | Datetime of when the organization was created | `2013-12-31 10:22:33` |
| `kbc_organization_deleted_at` | Datetime of deletion, in case the organization was deleted | `2019-02-02 13:45:51` |
| `kbc_organization_is_deleted` | Flag determining if the organization is deleted (`true`, `false`) | `true` |
| `kbc_organization_autojoin` | Flag determining if Keboola Support can access projects in the organization without a confirmed request | `true` |
| `kbc_organization_url` | URL of the organization in KBC | `https://connection.keboola.com/ admin/organizations/225/settings` |


### kbc_project
This table shows data about Keboola Connection [projects](/management/project/) 
belonging to an organization.

| **Column** | **Description** | **Example** | 
| `kbc_project_id` (PK) | KBC project identifier | `1944_us-east-1_aws` |
| `kbc_project_id_num` | Project numeric identifier | `1944` |
| `kbc_project` | Name of the project | `Sales Workshop - Kuba` |
| `kbc_project_region` | Region of the project | `us-east-1` |
| `kbc_project_cloud` | Cloud provider of the project | `aws` |
| `kbc_project_url` | URL of the project | `https://connection.keboola.com/ admin/projects/1944` |
| `kbc_organization_id` | Foreign key to the KBC organization | `116_us-east-1_aws` |
| `kbc_project_created` | Datetime of when the project was created | `2017-09-04 14:26:40` |
| `kbc_project_deleted` | Datetime of when the project was deleted | `2017-10-19 14:26:49` |
| `kbc_project_is_deleted` | Determines if the project is deleted. | `true` |
| `kbc_project_expiration` | Datetime of the project expiration date | `2017-10-25 10:13:57` |
| `kbc_project_type` | Type of the project (no actual impact on billing). Possible values: <br> `demo`, `poc`, `poc15Days`, `poc15DaysGuideMode`, `poc30Days`,  `poc6months`, `production`, `payAsYouGo` | `poc` |
| `kbc_project_creator` | User that created the project | `martin.matejka@keboola.com` |


### kbc_project_snapshot
This table shows snapshots of the projects to track their size changes.

| **Column** | **Description** | **Example** | 
| `kbc_project_id` (PK) | Foreign key to the KBC project | `1105_eu-central-1_aws` |
| `snapshot_date` (PK) | Date of the data snapshot | `2020-06-26` |
| `rows` | Number of rows in the project at the time of the snapshot | `28137568882` |
| `bytes` | Data size of the project in bytes at the time of the snapshot | `1071491549696` |


### kbc_project_user
This table shows snapshots capturing the projects' [admins](/management/project/users/).
The snapshots are taken multiple times a day.

| **Column** | **Description** | **Example** | 
| `kbc_project_id` (PK) | Foreign key to the KBC project | `409_eu-west-1_azure` |
| `snapshot_time` (PK) | Datetime of the snapshot | `2020-06-29 12:55:16` |
| `user_id` (PK) | Identifier of the user | `2195` |
| `valid_from` | Datetime from which the user is a member of the project | `2020-03-28 11:19:47` |
| `email` | Email of the user | `martin.matejka@keboola.com` |
| `domain` | Email domain of the user | `keboola.com` |


### kbc_snowflake_stats
This table shows information about queries using Snowflake, including transformations and sandboxes.

| **Column** | **Description** | **Example** |
| `kbc_project_id` (PK) | Foreign key to the KBC project | `458_eu-central-1_aws` |
| `snowflake_job_start_at` (PK) | Datetime hour the jobs started (Snowflake jobs/queries are aggregated per hour) | `2019-08-19 06:00:00` |
| `dwh_size` (PK) | Size of the DWH used | `Medium` |
| `snowflake_dwh` (PK) | DWH name | `KEBOOLA_PROD` |
| `snowflake_database` (PK) | DB name | `KEBOOLA_391` |
| `snowflake_schema` (PK) | Schema name | `WORKSPACE_146192784` |
| `snowflake_user` (PK) | User running the queries | `KEBOOLA_WORKSPACE_146192784` |
| `snowflake_job_type` (PK) | Type of the Snowflake job. <br> Possible values: <br> `dwhm` – queries run via DWH manager, `sandbox` – queries run in SQL sandbox, `transformations` – queries run in SQL transformations, `writer` – queries run against Keboola-provisioned DB | `writer` |
| `snowflake_job_result` (PK) | Result of the queries (`Success`, `Error`) | `Success` |
| `snowflake_queries` | Number of the queries aggregated by the primary key | `19` |
| `snowflake_queries_length_s` | Length of the queries in seconds aggregated by the primary key | `205.214000` |
| `time_credits_used` | Number of the time credits consumed by the queries | `0.91206222224` |
| `billed_credits_used` | Number of the actually billed credits | `0.91206222224` |


### kbc_table_snapshot
This table shows [Storage table](/storage/tables/) snapshots.

| **Column** | **Description** | **Example** | 
| `table_id` (PK) | Storage table identifier | `in.c-GDU_Management.status` |
| `kbc_project_id` (PK) | Foreign key to the KBC project | `239_eu-central-1_aws` |
| `snapshot_date` (PK) | Date of the data snapshot | `2020-07-02` |
| `created` | Datetime the table was created | `2020-07-02 08:27:03` |
| `last_import` | Datetime of the last import to the table | `2020-07-02 08:33:39` |
| `table_name` | Name of the Storage table | `status` |
| `primary_key` | Primary key of the Storage table | `id` |
| `is_alias` | Determines if the table is an alias (`true`, `false`). | `true` |
| `alias_column_sync` | Determines if the alias table should sync all of the columns from the source table (`true`, `false`). | `true` |
| `source_project_id` | Foreign key to the KBC project the alias is coming from | `20-eu-central-1` |
| `source_table_id` | Identifier of the source table | `out.c-GDUserManagement.status` |
| `alias_filter_column` | Column used to filter rows of the source table | `USER_ID` |
| `alias_filter_operator` | Type of the alias filter operator. Possible values: <br> `eq` -- SQL “IN” <br> `ne` -- SQL “NOT IN” | `eq` |
| `alias_filter_value` | Value the alias filter is filtering by | `ASNDUH8737D` |
| `rows` | Number of rows in the table | `8` |
| `bytes` | Data size of the table in bytes | `2048` |


### kbc_usage_metrics_values
This table shows aggregated values of all metrics that may be part of the contract, for example, consumed credits, 
data in storage, and the number of users. This combines data from different data sources (jobs, Snowflake stats, 
etc.), so it is possible to use it for consumption overview.

*Note: `organization_value` and `company_value` are available in **Organization** mode only. 
You need data for all projects.*

| **Column** | **Description** | **Example** | 
| `metrics_values_id` (PK) | Identifier of the daily value of the usage metric (combination of the project ID, usage metric ID, metric breakdown, sandbox flag, and date) | `779_eu-central-1_aws_kbc_tb_KBC TB_false_2020-07-14` |
| `kbc_project_id` | Foreign key to the KBC project | `779_eu-central-1_aws` |
| `usage_metric_id` | Identifier of the usage metric. Possible values: <br> `kbc_ppu`, `kbc_tb`, `kbc_users`, `kbc_projects` | `kbc_tb` |
| `date` | Date of the value | `2019-11-01` |
| `usage_breakdown` | Breakdown of the usage metric (still the same limit, but a more detailed view of consumption for some metrics). For instance, PPU can be broken down to Writers, Applications and Transformations. | `KBC TB` |
| `is_sandbox` | Flag determining if the value is for sandbox | `true` |
| `value` | Value of the metric (always related to the particular metric, key-value pairs) | `4.150657` |
| `organization_value` | Organization value of the metric (used for KBC users, where we’re assigning distinct users to the single org project, so we’re not calculating users more than once when looking at organization value – a single user can be in multiple projects) | `15` |
| `company_value` | Similar to the organization value, but it might give a different result if the company contains more organizations | `12` |
| `time_credits_value` | Value in time credits for metrics calculated in credits | `0.001667` |
| `run_time_hours` | Runtime value in hours for metrics calculated by time | `0.000278` |


### security_event
This table lists [security events](/management/project/tokens/#token-events), 
such as project logins or token creations. The events might be related directly to the project, to its
organization, or to the Keboola Connection platform itself.

| **Column** | **Description** | **Example** | 
| `security_event_id` (PK) | Security event identifier | `2080005325_us-east-1_aws` | 
| `event_created` | Datetime of the event | `2020-07-01 10:15:20` |
| `company_id` | Identifier of the company the event belongs to | `011t00000Gs3BiAAJ` |
| `kbc_organization_id` | Foreign key to the KBC organization (events can be related to a project, organization or the whole platform, e.g., failed logins) | `211_us-east-1_aws` |
| `kbc_project_id` | Foreign key to the KBC project | `5954_us-east-1_aws` |
| `admin_email` | Email of the user participating in the event | `martin.matejka@keboola.com` |
| `admin_name` | Name of the user participating in the event | `Martin Matejka` |
| `admin_ip` | IP address from which the event was triggered | `34.200.169.177` |
| `operation` | Type of the event operation. Possible values are listed in the table [Security event operations](#security-event-operations) below. | `auditLog.project.adminsListed` |
| `operation_params` | Additional operation parameters. Possible values are listed in the table [Operation parameters](#operation-parameters) below. | `password` |
| `token_id` | Token identifier if it’s a part of the event (e.g., token creation) | `47949` |
| `token_description` | Token description if it’s a part of the event (e.g., token creation) | `token for linking shared bucket to project` |
| `context_admin_email` | Email of the user in the context with the event (e.g., invitation or admin removal) | `martin.matejka@keboola.com` |
| `context_admin_name` | Name of the user in the context with the event (e.g., invitation or admin removal) | `Martin Matejka` |

#### Security event operations

|`auditLog.admin.addNewU2fDevice`                |`auditLog.organization.invitationDeleted`|
|`auditLog.admin.changePassword`                 |`auditLog.organization.invitationDetail`|
|`auditLog.admin.disableMfa`                     |`auditLog.organization.invitationsListed`|
|`auditLog.admin.enableTotpMfa`                  |`auditLog.organization.metadataListed`|
|`auditLog.admin.enableU2fMfa`                   |`auditLog.organization.metadataSet`|
|`auditLog.admin.failedLogin`                    |`auditLog.organization.metadataDeleted`|
|`auditLog.admin.login`                          |`auditLog.organization.projectCreated`|
|`auditLog.admin.loginWithTotp`                  |`auditLog.organization.projectsListed`|
|`auditLog.admin.loginWithTotpViaRecoveryCode`   |`auditLog.organization.updated`|
|`auditLog.admin.loginWithU2f`                   |`auditLog.payAsYouGo.marketingData`|
|`auditLog.admin.logout`                         |`auditLog.project.addedToOrganization`|
|`auditLog.admin.lostPassword`                   |`auditLog.project.adminAdded`|
|`auditLog.admin.maintainerInvitation.accepted`  |`auditLog.project.adminRemoved`|
|`auditLog.admin.maintainerInvitation.detail`    |`auditLog.project.adminsListed`|
|`auditLog.admin.maintainerInvitation.rejected`  |`auditLog.project.adminUpdated`|
|`auditLog.admin.organizationInvitation.accepted`|`auditLog.project.deleted`|
|`auditLog.admin.projectInvitation.accepted`     |`auditLog.project.deletedDetail`|
|`auditLog.admin.projectInvitation.rejected`     |`auditLog.project.detail`|
|`auditLog.admin.reauthorizeCurrentUserTotp`     |`auditLog.project.featureAdded`|
|`auditLog.admin.regenerateRecoveryCodes`        |`auditLog.project.featureRemoved`|
|`auditLog.admin.removeU2fDevice`                |`auditLog.project.fileStorageAssigned`|
|`auditLog.admin.showRecoveryCodes`              |`auditLog.project.invitationCreated`|
|`auditLog.admin.sudo`                           |`auditLog.project.invitationDeleted`|
|`auditLog.deletedProjectsListed`                |`auditLog.project.invitationsListed`|
|`auditLog.maintainer.adminAdded`                |`auditLog.project.joinRequest.approved`|
|`auditLog.maintainer.adminRemoved`              |`auditLog.project.joinRequest.rejected`|
|`auditLog.maintainer.adminsListed`              |`auditLog.project.joinRequest.rejected`|
|`auditLog.maintainer.invitationCreated`         |`auditLog.project.joinRequestsListed`|
|`auditLog.maintainer.invitationDeleted`         |`auditLog.project.limitAdded`|
|`auditLog.maintainer.invitationDetail`          |`auditLog.project.limitRemoved`|
|`auditLog.maintainer.invitationsListed`         |`auditLog.project.metadataDeleted`|
|`auditLog.maintainer.promoCodesListed`          |`auditLog.project.metadataListed`|
|`auditLog.maintainers.created`                  |`auditLog.project.metadataSet`|
|`auditLog.maintainers.deleted`                  |`auditLog.project.removedFromOrganization`|
|`auditLog.maintainers.detail`                   |`auditLog.project.requestAccess`|
|`auditLog.maintainers.listed`                   |`auditLog.project.setEnabledStatus`|
|`auditLog.maintainers.organizationCreated`      |`auditLog.project.storageBackendAssigned`|
|`auditLog.maintainers.updated`                  |`auditLog.project.storageBackendRemoved`|
|`auditLog.organization.adminAdded`              |`auditLog.project.storageTokenCreated`|
|`auditLog.organization.adminRemoved`            |`auditLog.project.undeleted`|
|`auditLog.organization.adminsInProjectsListed`  |`auditLog.project.updated`|
|`auditLog.organization.adminsListed`            |`auditLog.promoCode.applied`|
|`auditLog.organization.deleted`                 |`auditLog.promoCode.created`|
|`auditLog.organization.detail`                  |
|`auditLog.organization.invitationCreated`       |



#### Operation parameters

| Updating project type: | `demo`, `poc`, `poc15Days`, `poc15DaysGuideMode`, `poc30Days`, `poc6months`, `production` |
| Logging into [pay-as-you-go project](/management/payg-project/) (PAYG): | `payAsYouGo` | 
| Logging into project via Google SSO: | `googleLogin` | 
| Password-related operations (incl. login via credentials): | `password` |


### contract_limit_monthly
This table lists the limits set in contracts to be compared with actual consumption.

*Note: The table is available in **Organization** mode only.*

| **Column** | **Description** | **Example** | 
| `contract_limit_monthly_idPK``|`(PK) | Identifier of the monthly limit of the usage metric (combination of the contract ID, usage metric ID, month and limit type) | `8011t000002V7W7AAK kbc_ppu 2019-08-01 contract` |
| `contract_id` | Identifier of the contract - there can be multiple active contracts at once | `8011t000002V7W7AAK` |
| `usage_metric_id` | Identifier of the usage metric. Possible values: <br> `kbc_ppu`, `kbc_tb`, `kbc_users`, `kbc_projects` | `kbc_ppu` |
| `date` | Month of the limit value | `2019-08-01` |
| `limit_value` | Value of the limit in particular month | `3500` |
| `limit_type` | Usually says `contract`, but it can be `reimbursement` in case of raised limits because of the platform issues | `contract` |


### usage_metric
This table shows metrics related to your contracts.

*Note: The table is available in **Organization** mode only.*

| **Column** | **Description** | **Example** | 
| `usage_metric_id` | Identifier of the usage metric. Possible values: <br> `kbc_ppu`, `kbc_tb`, `kbc_users`, `kbc_projects` | `kbc_ppu`
| `usage_metric` | Name of the metric | `2019-08-01` |
| `metric_type` | Defines if metric is calculated cumulatively over period of time (like PPU) or if it has actual total value on particular date (like Projects). <br> Possible values: <br> `cumulative`, `standard` | `cumulative` |
