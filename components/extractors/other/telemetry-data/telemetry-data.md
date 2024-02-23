---
title: Telemetry Data
permalink: /components/extractors/other/telemetry-data/
redirect_from:
    - /extractors/other/telemetry-data/

---

* TOC
{:toc}

The Telemetry Data extractor allows you to retrieve data about your project or your entire [organization](/management/organization/). 
It helps you monitor activities and usage in your Keboola projects. It also aids Keboola in calculating your project's consumption.

## Configuration
To configure the extractor, select one of the following modes:
 
1. [**Project mode**](#project-mode-tables): Extracts data only from a selected Keboola project.
2. [**Organization mode**](#organization-mode-tables): Extracts data from all projects within your organizations. The data is compiled into a single target project. This must be set up by Keboola. After configuring the extractor, contact your Keboola Account Manager or our [support team](/management/support/).
3. [**Activity Center mode**](#activity-center-mode-tables): Extracts data from all projects within your organizations. The data is compiled into a single target project. This mode is available to customers who have the **Activity Center add-on** in their contract and also must be set up by Keboola. After configuring the extractor, contact your Keboola Account Manager or our [support team](/management/support/).

## Data Model
The model below helps you better understand relations between individual tables extracted by this component. 
Keep in mind that the tables *contact_limit_monthly*, *kbc_organization*, and *usage_metric* are extracted only in **Organization** mode. The model does not contain tables available in Activity Center mode.

{: .image-popup}
![Screenshot - Telemetry data model](/components/extractors/other/telemetry-data/telemetry-data-model.png)

*Note: You can find the schema in full resolution and with several export options [here](https://dbdiagram.io/d/602629a380d742080a3a406a).*

## Project Mode Tables
The extracted tables provide you with information about your buckets, configurations, branches, jobs, sandboxes, projects, users, and security events.

### kbc_bucket_snapshot
This table shows snapshots of buckets in Storage.

| **Column** | **Description** | **Example** | 
|---|---|---|
| `bucket_id` (PK) | Identifier for the storage bucket | `1147628` |
| `kbc_project_id` (PK) | Foreign key to a Keboola project | `866_kbc-eu-central-1` |
| `snapshot_date` (PK) | Date of the data snapshot | `2020-06-30` |
| `stage` | Storage stage of the bucket | `in` |
| `bucket` | Name of the bucket | `c-instagram` |
| `rows` | Number of rows in the bucket as of the date of the snapshot | `4714` |
| `bytes` | Size of the bucket in bytes as of the date of the snapshot | `1870336` |
| `sharing_type` | Type of bucket sharing (Data Catalog). <br> Possible values: `none` – not shared, <br> `target` – bucket linked from another project, <br>`source` / `org private` – bucket shared from this project, linkable only by organization members <br> `source` / `org public` – bucket shared from this project, linkable by any project members | `target` |
| `shared_from_project_id` | Identifier of the source project if the bucket is linked (sharing_type = 'target') | `860_kbc-eu-central-1` |
| `shared_from_bucket` | Identifier of the source bucket if the bucket is linked (sharing_type = 'target') | `in.c-keboola-ex-instagram-152387726` |

### kbc_branch
This table shows main and development [branches](/components/branches/) in the project.

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_branch_id` (PK) | Keboola Branch identifier | `3419_kbc-eu-central-1` |
| `kbc_project_id` | Foreign key to a Keboola project | `866_kbc-eu-central-1` |
| `kbc_branch` | Name of the branch | `My dev branch` |
| `kbc_branch_created_at` | Datetime of the branch creation | `2022-05-18 06:13:45` |
| `is_default` | Determines if the branch is the main (default) branch (`true`, `false`) | `false` |
| `token_id` | Identifier of the token that created this branch | `241247` |
| `token_name` | Name of the token that created this branch | `john.doe@keboola.com` |
| `kbc_token_id` | Unique identifier of the token containing stack identification | `241247_kbc-us-east-1` |


### kbc_component_configuration
This table lists the [configurations of components](/components/#creating-component-configuration) 
(e.g., a configuration of the AWS S3 extractor).

*Note: The table is always extracted in full.*

| **Column** | **Description** | **Example** |  
|---|---|---|
| `kbc_component_configuration_id` (PK) | Identifier for the component configuration | `580_kbc-us-east-1_keboola.python- transformation-v2-610931033` |
| `kbc_component_configuration_url` | URL of the configuration in the Keboola project | `https://connection.keboola.com/ admin/projects/580/transformations/ bucket/152336525` |
| `kbc_project_id` | Foreign key to the Keboola project | `580_kbc-us-east-1` |
| `kbc_component_id` | Identifier of the component | `keboola.python-transformation-v2` |
| `kbc_component` | Name of the component | `Generic` |
| `configuration_id_num` | Numeric identifier of the configuration | `610931033` |
| `kbc_component_configuration` | Name of the configuration | `Sample data from Dynamics` |
| `configuration_created` | Datetime when the configuration was created | `2022-07-20 18:45:17` |
| `kbc_configuration_version` | Current version of the configuration | `5` |
| `kbc_configuration_is_deleted` | Flag indicating whether the configuration is deleted (`true`, `false`) | `false` |
| `configuration_json` | Complete JSON configuration of the component | `{"parameters":{"id":"34289954"}}` |
| `token_id` | Identifier of the token that created this version of the configuration | `241247` |
| `token_name` | Name of the token that created this version of the configuration | `john.doe@keboola.com` |
| `kbc_token_id` | Unique identifier of the token containing stack identification | `241247_kbc-us-east-1` |

### kbc_component_configuration_version
This table shows the [version history](/components/#configuration-versions) 
of the component configuration.

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_component_configuration_id` (PK) | Identifier for the component configuration | `6610_kbc-us-east-1_orchestrator-583757303` |
| `kbc_branch_id` (PK) | Foreign key to the Keboola branch | `3419_kbc-eu-central-1` |
| `configuration_updated_at` | Datetime when the configuration was updated | `2020-03-28 20:29:25` |
| `change_description` | Description of what changed in the configuration | `Update orchestration notifications` |
| `configuration_version` (PK) | Version of the configuration | `3` |
| `last_version` | Flag indicating whether this is the last version of the configuration (`true`, `false`) | `false` |
| `token_id` | Identifier of the token that created this version of the configuration | `241247` |
| `token_name` | Name of the token that created this version of the configuration | `john.doe@keboola.com` |
| `kbc_token_id` | Unique identifier of the token containing stack identification | `241247_kbc-us-east-1` |


### kbc_component_configuration_row
This table lists rows of the [configurations for the components](/components/#creating-component-configuration) 
(e.g., a configuration for a single table in the Snowflake writer).

| **Column** | **Description** | **Example** |  
|---|---|---|
| `kbc_component_configuration_row_id` (PK) | Component configuration row identifier | `8765_kbc-us-east-1_keboola.ex-db-mysql_844500148_844500150` |
| `kbc_component_configuration_id` | Foreign key to the Keboola component configuration | `8765_kbc-us-east-1_keboola.ex-db-mysql_844500148` |
| `kbc_project_id` | Foreign key to the Keboola project | `8765_kbc-us-east-1` |
| `kbc_component_id` | Identifier of the component | `keboola.ex-db-mysql_kbc-us-east-1` |
| `configuration_row_id_num` | Numeric identifier of the configuration row | `844500150` |
| `kbc_component_configuration_row` | Name of the configuration row | `test_view` |
| `configuration_row_created` | Datetime of the configuration row's creation | `2022-04-25 11:59:42` |
| `kbc_configuration_row_version` | Current version of the configuration row | `1` |
| `kbc_configuration_is_disabled` | Flag indicating whether the configuration is disabled (`true`, `false`) | `false` |
| `configuration_row_json` | Complete JSON configuration row of the component | `{"parameters":{"incremental":false}}` |
| `token_id` | Identifier of the token that created this version of the configuration row | `241247` |
| `token_name` | Name of the token that created this version of the configuration | `john.doe@keboola.com` |
| `kbc_token_id` | Unique identifier of the token containing stack identification | `241247_kbc-us-east-1` |


### kbc_data_science_sandbox
This table lists Python/R [workspaces](/transformations/workspace/)/[sandboxes](/transformations/sandbox/) 
and their consumption metrics.

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_data_science_sandbox_resume_id` (PK) | Identifier of the sandbox active window (between starting and pausing the sandbox) | `10910_kbc-eu-central-1_8c9e68ac-3a40-4aea-a62c-34ef37d12a5a` |
| `kbc_data_science_sandbox_id` | Data science sandbox identifier | `10910_kbc-eu-central-1` |
| `kbc_project_id` | Foreign key to the Keboola Project | `1075-eu-central-1` |
| `date` (PK) | Date for which the runtime hours and time credits are calculated | `2020-11-27` |
| `created_at` | Datetime of sandbox creation | `2020-11-27 11:22:08` |
| `expiration_at` | Sandbox expiration datetime | `2020-12-02 11:22:08` |
| `updated_at` | Datetime when the sandbox was last updated | `2020-11-27 14:03:40` |
| `start_at` | Datetime when the sandbox resume window started | `2020-11-27 11:22:08` |
| `sleep_at` | Datetime when the sandbox resume window ended | `2020-11-27 14:03:40` |
| `type` | Type of the sandbox (`jupyter`, `rstudio`) | `jupyter` |
| `sandbox_active` | Flag indicating whether the sandbox is active | `false` |
| `hostname` | Hostname of the sandbox | `i-099734d8f8b97ae75-sandbox.eu-central-1.keboola.com` | 
|`sandbox_runtime_hours` | Runtime of the sandbox on the particular date in hours | `2.413333` |
| `backend_size` | Size of the data science backend | `Small` |
| `time_credits_used` | Number of time credits consumed by the sandbox on the particular date | `2.413333` |
| `billed_credits_used` | Number of the actually billed credits | `2.413333` |


### kbc_job
This table lists Keboola [jobs](/management/jobs/) 
(e.g., an extractor job or a transformation).

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_job_id` (PK) | Keboola job identifier | `117644387_kbc-eu-central-1` |
| `kbc_component_configuration_id` | Foreign key to the component configuration | `410_kbc-eu-central-1_keboola.wr-google-sheets-259642632` |
| `kbc_branch_id` | Foreign key to the Keboola branch | `3419_kbc-eu-central-1` |
| `kbc_component_id` | Identifier of the component related to the job | `keboola.wr-google-sheets` |
| `transformation_type` | Type of the transformation, if applicable. Possible values: <br> `OpenRefine`, `R`, `Python`, `SQL`, `Unknown`: backend wasn't recognized or a new backend not yet introduced, `None` – not a transformation job or encapsulating an apparent transformation job | `None` |
| `job_run_id` | Run ID of the job – multiple jobs can run under the same Run ID | `117643429.117644388` |
| `job_start_at` | Datetime when the job started | `2020-03-15 11:59:39` |
| `job_created_at` | Datetime when the job was created | `2020-03-15 11:59:38` |
| `job_status` | Status of the job (`success`, `error`, `terminated`, `processing`, `cancelled`, `warning`) | `success` |
| `error_type` | Type of error for unsuccessful jobs (`user`, `application`) | `user` |
| `error_message` | Message propagated in the error job event | `Transformation aborted with message...` |
| `job_run_type` | Specifies if the job was run by orchestration or manually (`orchestration`, `manual`) | `orchestration` |
| `job_type` | Indicates whether the job is a standard job or a container job, which encapsulates another job (such as Flow). Only `standard` jobs consume credits (`standard`, `container`, `orchestrationContainer`, `phaseContainer`) | `orchestration` |
| `token_id` | Identifier of the token that initiated the job | `145062` |
| `token_name` | Name of the token that initiated the job | `Orchestrator GDrive` |
| `kbc_token_id` | Unique identifier of the token with stack identification | `145062_kbc-eu-central-1` |
| `job_time_credits_used` | Number of time credits consumed by the job | `0.001218890000` |
| `job_billed_credits_used` | Number of actually billed credits | `0.001218890000` |
| `job_total_time_sec` | Total time of the job in seconds (from initial trigger; start may be delayed) | `63` |
| `job_run_time_sec` | Runtime of the job in seconds (from the time the job started) | `62` |
| `job_network_mb` | Data transferred via the network in MB – used for writer billing | `6.094449` |
| `ds_backend_size` | Backend used for data science transformations (`Small`, `Medium`, `Large`) | `Small` |
| `dwh_small_ratio` | Ratio of Small DWH used for SQL transformations (sum of ratios may be <1, may partially run on free DWH) | `0.75` |
| `dwh_medium_ratio` | Ratio of Medium DWH used for SQL transformations (sum of ratios may be <1, may partially run on free DWH) | `0.25` |
| `dwh_large_ratio` | Ratio of Large DWH used for SQL transformations (sum of ratios might be <1, may partially run on free DWH) | `0` |


### kbc_project
This table shows data about Keboola [projects](/management/project/) 
belonging to an organization.

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_project_id` (PK) | Keboola project identifier | `1944_kbc-us-east-1` |
| `kbc_project_id_num` | Project numeric identifier | `1944` |
| `kbc_project` | Name of the project | `Sales Workshop - Kuba` |
| `kbc_project_region` | Region of the project | `us-east-1` |
| `kbc_project_cloud` | Cloud provider of the project | `aws` |
| `kbc_project_url` | URL of the project | `https://connection.keboola.com/admin/projects/1944` |
| `kbc_organization_id` | Foreign key to the Keboola organization | `116_kbc-us-east-1` |
| `kbc_project_created` | Datetime when the project was created | `2017-09-04 14:26:40` |
| `kbc_project_deleted` | Datetime when the project was deleted | `2017-10-19 14:26:49` |
| `kbc_project_is_deleted` | Determines if the project is deleted. | `true` |
| `kbc_project_expiration` | Datetime of the project's expiration date | `2017-10-25 10:13:57` |
| `kbc_project_type` | Type of the project. No actual impact on billing. Possible values: <br> `demo`, `poc`, `poc15Days`, `poc15DaysGuideMode`, `poc30Days`,  `poc6months`, `production`, `payAsYouGo` | `poc` |
| `kbc_project_creator` | User that created the project | `john.doe@keboola.com` |


### kbc_project_snapshot
This table shows snapshots of projects to track changes in their size.

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_project_id` (PK) | Foreign key to the Keboola project | `1105_kbc-eu-central-1` |
| `snapshot_date` (PK) | Date of the data snapshot | `2020-06-26` |
| `rows` | Number of rows in the project at the time of the snapshot | `28137568882` |
| `bytes` | Data size of the project in bytes at the time of the snapshot | `1071491549696` |


### kbc_project_user
This table shows snapshots capturing the projects' [admins](/management/project/users/).
The snapshots are taken multiple times a day.

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_project_id` (PK) | Foreign key to the Keboola project | `409_com-keboola-azure-north-europe` |
| `snapshot_time` (PK) | Datetime of the snapshot | `2020-06-29 12:55:16` |
| `user_id` (PK) | Identifier of the user | `2195` |
| `valid_from` | Datetime from which the user has been a member of the project | `2020-03-28 11:19:47` |
| `email` | Email of the user | `john.doe@keboola.com` |
| `domain` | Email domain of the user | `keboola.com` |


### kbc_snowflake_stats
This table shows information about queries using Snowflake, including transformations and sandboxes.

| **Column** | **Description** | **Example** |
|---|---|---|
| `kbc_project_id` (PK) | Foreign key to the Keboola project | `458_kbc-eu-central-1` |
| `snowflake_job_start_at` (PK) | Datetime hour the jobs started (Snowflake jobs/queries are aggregated per hour) | `2019-08-19 06:00:00` |
| `dwh_size` (PK) | Size of the DWH used | `Medium` |
| `snowflake_dwh` (PK) | DWH name | `KEBOOLA_PROD` |
| `snowflake_database` (PK) | DB name | `KEBOOLA_391` |
| `snowflake_schema` (PK) | Schema name | `WORKSPACE_146192784` |
| `snowflake_user` (PK) | User running the queries | `KEBOOLA_WORKSPACE_146192784` |
| `snowflake_job_type` (PK) | Type of the Snowflake job. <br> Possible values: <br> `dwhm` – queries run via DWH manager, `sandbox` – queries run in SQL sandbox, `transformations` – queries run in SQL transformations, `writer` – queries run against a Keboola-provisioned DB, `sapi` - queries related to the project's Storage, `platform_management` - system queries related to management of the project | `writer` |
| `snowflake_job_result` (PK) | Result of the queries (`Success`, `Error`) | `Success` |
| `snowflake_queries` | Number of the queries aggregated by the primary key | `19` |
| `snowflake_queries_length_s` | Length of the queries in seconds aggregated by the primary key | `205.214000` |
| `time_credits_used` | Number of the time credits consumed by the queries | `0.91206222224` |
| `billed_credits_used` | Number of the actually billed credits | `0.91206222224` |


### kbc_table_snapshot
This table shows [Storage table](/storage/tables/) snapshots.

| **Column** | **Description** | **Example** | 
|---|---|---|
| `table_id` (PK) | Storage table identifier | `in.c-GDU_Management.status` |
| `kbc_project_id` (PK) | Foreign key to the Keboola project | `239_kbc-eu-central-1` |
| `snapshot_date` (PK) | Date of the data snapshot | `2020-07-02` |
| `bucket_id` | Foreign key to the Keboola bucket | `1695` |
| `created` | Datetime when the table was created | `2020-07-02 08:27:03` |
| `last_import` | Datetime of the last import to the table | `2020-07-02 08:33:39` |
| `table_name` | Name of the Storage table | `status` |
| `primary_key` | Primary key of the Storage table | `id` |
| `is_alias` | Indicates if the table is an alias (`true`, `false`) | `true` |
| `alias_column_sync` | Determines if the alias table should sync all the columns from the source table (`true`, `false`). | `true` |
| `source_project_id` | Foreign key to the Keboola project the alias is coming from | `20-eu-central-1` |
| `source_table_id` | Identifier of the source table | `out.c-GDUserManagement.status` |
| `alias_filter_column` | Column used to filter rows of the source table | `USER_ID` |
| `alias_filter_operator` | Type of the alias filter operator. Possible values: <br> `eq` -- SQL “IN” <br> `ne` -- SQL “NOT IN” | `eq` |
| `alias_filter_value` | Value the alias filter is filtering by | `ASNDUH8737D` |
| `rows` | Number of rows in the table | `8` |
| `bytes` | Data size of the table in bytes | `2048` |


### kbc_usage_metrics_values
This table shows aggregated values for all metrics that may be included in the contract, such as consumed credits, 
data in storage, and the number of users. This combines data from different data sources (tables), making it useful for providing an overview of consumption.

`usage_breakdown` data sources (which tables serve as sources for the results):
* `Applications` - `kbc_job` (jobs with **application** *component_type*)
* `Data Science` - `kbc_job` (jobs with **R/Python** *transformation_type*)
* `Data Science Sandbox` - `kbc_data_science_sandbox` (aggregation of *sandbox_runtime_hours*)
* `DWH Direct Query` - `kbc_snowflake_stats` (records with **writer/dwhm** *snowflake_job_type*)
* `Extractor` - `kbc_job` (jobs with **extractor** *component_type*)
* `KBC Users` - `kbc_project_user` (Active/Inactive state is defined based on users' activity in the last 3 days)
* `KBC Projects` - `kbc_project` (existing projects per particular date)
* `KBC TB` - `kbc_project_snapshot` (aggregation of *bytes*)
* `Snowflake Sandbox` - `kbc_snowflake_stats` (records with **sandbox** *snowflake_job_type*)
* `Transfromations` - `kbc_job` (jobs with **SQL** *transformation_type*)
* `Writers` - `kbc_job` (jobs with **writer** *component_type*)
* `BAPI Messages` - Buffer API (data streams) usage; only aggregated values available
* `BAPI Receiver` - Buffer API endpoints used; only aggregated values available

*Note: `organization_value` and `company_value` are available in **Organization** mode only. 
You need data for all projects.*

| **Column** | **Description** | **Example** | 
|---|---|---|
| `metrics_values_id` (PK) | Identifier of the daily value of the usage metric (combination of the project ID, usage metric ID, metric breakdown, sandbox flag, and date) | `779_kbc-eu-central-1_kbc_tb_KBC TB_false_2020-07-14` |
| `kbc_project_id` | Foreign key to the Keboola project | `779_kbc-eu-central-1` |
| `usage_metric_id` | Identifier of the usage metric. Possible values: <br> `kbc_ppu`, `kbc_tb`, `kbc_users`, `kbc_projects` | `kbc_tb` |
| `date` | Date of the value | `2019-11-01` |
| `usage_breakdown` | Breakdown of the usage metric (still the same limit, but a more detailed view of consumption for some metrics). For instance, PPU can be broken down into writers, applications, and transformations. | `DWH Direct Query` |
| `is_sandbox` | Flag determining if the value is for sandbox | `true` |
| `value` | Value of the metric (always related to the particular metric, key-value pairs) | `4.150657` |
| `organization_value` | Organization value of the metric (used for Keboola users, where we’re assigning distinct users to the single org project, so we’re not calculating users more than once when looking at organization value – a single user can be in multiple projects) | `15` |
| `company_value` | Similar to the organization value, but it might give a different result if the company contains more organizations | `12` |
| `time_credits_value` | Value in time credits for metrics calculated in credits | `0.001667` |
| `run_time_hours` | Runtime value in hours for metrics calculated based on time | `0.000278` |


### security_event
This table lists [security events](/management/project/tokens/#token-events), 
such as project logins or token creations. The events might be related directly to the project, its
organization, or the Keboola platform itself.

| **Column** | **Description** | **Example** | 
|---|---|---|
| `security_event_id` (PK) | Security event identifier | `2080005325_kbc-us-east-1` | 
| `event_created` | Datetime of the event | `2020-07-01 10:15:20` |
| `company_id` | Identifier of the company the event belongs to | `011t00000Gs3BiAAJ` |
| `kbc_organization_id` | Foreign key to the Keboola organization (events can be related to a project, organization or the whole platform, e.g., failed logins) | `211_kbc-us-east-1` |
| `kbc_project_id` | Foreign key to the Keboola project | `5954_kbc-us-east-1` |
| `admin_email` | Email of the user participating in the event | `john.doe@keboola.com` |
| `admin_name` | Name of the user participating in the event | `Martin Matejka` |
| `admin_ip` | IP address from which the event was triggered | `34.200.169.177` |
| `operation` | Type of the event operation. Possible values are listed in the table [Security event operations](#security-event-operations) below. | `auditLog.project.adminsListed` |
| `operation_params` | Additional operation parameters. Possible values are listed in the table [Operation parameters](#operation-parameters) below. | `password` |
| `token_id` | Token identifier if it’s a part of the event (e.g., token creation) | `47949` |
| `token_description` | Token description if it’s a part of the event (e.g., token creation) | `token for linking shared bucket to project` |
| `kbc_token_id` | Unique identifier of the token containing stack identification | `47949_kbc-us-east-1` |
| `context_admin_email` | Email of the user in the context with the event (e.g., invitation or admin removal) | `john.doe@keboola.com` |
| `context_admin_name` | Name of the user in the context with the event (e.g., invitation or admin removal) | `Martin Matejka` |
| `context_merge_request_id` | ID of the merge request (related to branch merge request events in SOX projects) | `42` |
| `context_merge_request_name` | Name of the merge request (related to branch merge request events in SOX projects) | `Update of my configuration` |
| `context_operation` | Type of the merge request operation (`request_review`, `finish_review`, `approve`, `merge`, `publish`) | `request_review` |
| `context_state_from` | Original state of the merge request operation (`development`, `in_review`, `approved`, `in_merge`) | `in_review` |
| `context_state_to` | End state of the merge request operation (`in_review`, `approved`, `in_merge`, `published`) | `approved` |

#### Security event operations

|`auditLog.admin.activation`
|`auditLog.admin.addNewU2fDevice`
|`auditLog.admin.changePassword`
|`auditLog.admin.disableMfa`
|`auditLog.admin.enableTotpMfa`
|`auditLog.admin.enableU2fMfa`
|`auditLog.admin.failedLogin`
|`auditLog.admin.login`
|`auditLog.admin.loginWithTotp`
|`auditLog.admin.loginWithTotpViaRecoveryCode`
|`auditLog.admin.loginWithU2f`
|`auditLog.admin.logout`
|`auditLog.admin.lostPassword`
|`auditLog.admin.maintainer.invitationListed`
|`auditLog.admin.maintainerInvitation.accepted`
|`auditLog.admin.maintainerInvitation.detail`
|`auditLog.admin.maintainerInvitation.rejected`
|`auditLog.admin.metadataListed`
|`auditLog.admin.organizationInvitation.accepted`
|`auditLog.admin.organizationInvitation.rejected`
|`auditLog.admin.projectInvitation.accepted`
|`auditLog.admin.projectInvitation.rejected`
|`auditLog.admin.reauthorizeCurrentUserTotp`
|`auditLog.admin.regenerateRecoveryCodes`
|`auditLog.admin.removeU2fDevice`
|`auditLog.admin.showRecoveryCodes`
|`auditLog.admin.sudo`
|`auditLog.dataPlanes.listed`
|`auditLog.deletedProjectsListed`
|`auditLog.maintainer.adminAdded`
|`auditLog.maintainer.adminRemoved`
|`auditLog.maintainer.adminsListed`
|`auditLog.maintainer.invitationCreated`
|`auditLog.maintainer.invitationDeleted`
|`auditLog.maintainer.invitationDetail`
|`auditLog.maintainer.invitationsListed`
|`auditLog.maintainer.metadataDeleted`
|`auditLog.maintainer.metadataListed`
|`auditLog.maintainer.metadataSet`
|`auditLog.maintainer.promoCodesListed`
|`auditLog.maintainers.created`
|`auditLog.maintainers.deleted`
|`auditLog.maintainers.detail`
|`auditLog.maintainers.listed`
|`auditLog.maintainers.organizationCreated`
|`auditLog.maintainers.updated`
|`auditLog.mergeRequest.created`
|`auditLog.mergeRequest.stateChanged`
|`auditLog.organization.adminAdded`
|`auditLog.organization.adminRemoved`
|`auditLog.organization.adminsInProjectsListed`
|`auditLog.organization.adminsListed`
|`auditLog.organization.deleted`
|`auditLog.organization.detail`
|`auditLog.organization.invitationCreated`
|`auditLog.organization.invitationDeleted`
|`auditLog.organization.invitationDetail`
|`auditLog.organization.invitationsListed`
|`auditLog.organization.metadataDeleted`
|`auditLog.organization.metadataListed`
|`auditLog.organization.metadataSet`
|`auditLog.organization.projectCreated`
|`auditLog.organization.projectsListed`
|`auditLog.organization.updated`
|`auditLog.payAsYouGo.creditsManualTopUp`
|`auditLog.payAsYouGo.wizardComplete`
|`auditLog.payg.topup.try`
|`auditLog.payg.topup.updated`
|`auditLog.project.addedToOrganization`
|`auditLog.project.adminAdded`
|`auditLog.project.adminRemoved`
|`auditLog.project.adminUpdated`
|`auditLog.project.adminsListed`
|`auditLog.project.deleted`
|`auditLog.project.deletedDetail`
|`auditLog.project.detail`
|`auditLog.project.featureAdded`
|`auditLog.project.featureRemoved`
|`auditLog.project.fileStorageAssigned`
|`auditLog.project.invitationCreated`
|`auditLog.project.invitationDeleted`
|`auditLog.project.invitationsListed`
|`auditLog.project.joinRequest.approved`
|`auditLog.project.joinRequest.rejected`
|`auditLog.project.joinRequestsListed`
|`auditLog.project.limitAdded`
|`auditLog.project.limitRemoved`
|`auditLog.project.metadataDeleted`
|`auditLog.project.metadataListed`
|`auditLog.project.metadataSet`
|`auditLog.project.purged`
|`auditLog.project.removedFromOrganization`
|`auditLog.project.requestAccess`
|`auditLog.project.setEnabledStatus`
|`auditLog.project.storageBackendAssigned`
|`auditLog.project.storageBackendRemoved`
|`auditLog.project.storageTokenCreated`
|`auditLog.project.undeleted`
|`auditLog.project.updated`
|`auditLog.promoCode.applied`
|`auditLog.promoCode.created`
|`auditLog.spc.account.created`
|`auditLog.storageBackendConnection.created`
|`auditLog.storageBackendConnection.deleted`
|`auditLog.storageBackendConnection.listed`
|`auditLog.storageBackendConnection.updated`
|`auditLog.mergeRequest.created`
|`auditLog.mergeRequest.stateChanged`

#### Operation parameters

| Updating project type: | `demo`, `poc`, `poc15Days`, `poc15DaysGuideMode`, `poc30Days`, `poc6months`, `production` |
| Logging into [pay-as-you-go project](/management/payg-project/) (PAYG): | `payAsYouGo` | 
| Logging into project via Google SSO: | `googleLogin` | 
| Password-related operations (incl. login via credentials): | `password` |

## Organization Mode Tables
In addition to the tables provided to you by [Project Mode](#project-mode-tables), this mode adds information about your organizations, outlines the limits of your contracts, and includes a table with usage metrics. This table can be used as a common dimension for both contract limits and metric values.

### contract_limit_monthly
This table lists the limits set in contracts for comparison with actual consumption.

| **Column** | **Description** | **Example** | 
|---|---|---|
| `contract_limit_monthly_idPK``|`(PK) | Identifier of the monthly limit of the usage metric (combination of the contract ID, usage metric ID, month, and limit type) | `8011t000002V7W7AAK kbc_ppu 2019-08-01 contract` |
| `contract_id` | Identifier of the contract – there can be multiple active contracts at once | `8011t000002V7W7AAK` |
| `usage_metric_id` | Identifier of the usage metric. Possible values: <br> `kbc_ppu`, `kbc_tb`, `kbc_users`, `kbc_projects` | `kbc_ppu` |
| `date` | Month of the limit value | `2019-08-01` |
| `limit_value` | Value of the limit for a particular month | `3500` |
| `limit_type` | Usually labeled as `contract`, but it can be `reimbursement` in case of raised limits due to platform issues | `contract` |

### kbc_organization
This table shows data about Keboola [organizations](/management/organization/).

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_organization_id` (PK) | Keboola organization identifier | `225_kbc-us-east-1` |
| `kbc_organization_id_num` | Numerical organization identifier | `225` |
| `kbc_organization` | Name of the organization | `Keboola Internal` |
| `kbc_maintainer_id` | Identifier of the Maintainer (the parent of the organization) | `12_kbc-us-east-1` |
| `kbc_region` | Region of the organization | `us-east-1` |
| `kbc_cloud` | Cloud provider of the organization | `aws` |
| `kbc_organization_created_at` | Datetime of the organization's creation | `2013-12-31 10:22:33` |
| `kbc_organization_deleted_at` | Datetime of deletion, if the organization was deleted | `2019-02-02 13:45:51` |
| `kbc_organization_is_deleted` | Flag indicating if the organization is deleted (`true`, `false`) | `true` |
| `kbc_organization_autojoin` | Flag indicating if Keboola Support can access projects in the organization without a confirmed request | `true` |
| `kbc_organization_url` | URL of the organization in Keboola | `https://connection.keboola.com/ admin/organizations/225/settings` |

### usage_metric
This table shows metrics related to your contracts.

| **Column** | **Description** | **Example** | 
|---|---|---|
| `usage_metric_id` | Identifier of the usage metric. Possible values: <br> `kbc_ppu`, `kbc_tb`, `kbc_users`, `kbc_projects` | `kbc_ppu`
| `usage_metric` | Name of the metric | `2019-08-01` |
| `metric_type` | Defines whether the metric is calculated cumulatively over a period of time (like PPU) or whether it represents the actual total value on a particular date (like Projects). <br> Possible values: <br> `cumulative`, `standard` | `cumulative` |

## Activity Center Mode Tables
In addition to the tables provided to you by [Organization Mode](#organization-mode-tables), this mode ads information about columns, flows, notifications, schedules, storage metadata, tokens, transformations, triggers, user activity, and workspaces.

### kbc_bucket
This table shows data about the current state of storage buckets.

*Note: The table is always extracted in full.*

| **Column** | **Description** | **Example** | 
|---|---|---|
| `bucket_id` | Storage bucket identifier | `1147628` |
| `kbc_project_id` | Foreign key to the Keboola project | `866_kbc-eu-central-1` |
| `kbc_project_bucket_id` (PK) | Keboola bucket identifier | `866_kbc-eu-central-1_1147628` |
| `stage` | Storage stage of the bucket | `in` |
| `bucket` | Name of the bucket | `c-instagram` |
| `rows` | Number of rows in the bucket as of the date of the snapshot | `4714` |
| `bytes` | Bucket size in bytes as of the date of the snapshot | `1870336` |
| `sharing_type` | Type of the bucket sharing (Data Catalog). <br> Possible values: `none` – bucket not shared, <br> `target` – bucket linked from another project, <br>`source` / `org private` – bucket shared from this project, linkable only by organization members <br> `source` / `org public` – bucket shared from this project, linkable by any project members | `target` |
| `shared_from_project_id` | Identifier of the source project if the bucket is linked (sharing_type = 'target') | `860_kbc-eu-central-1` |
| `shared_from_bucket` | Identifier of the source bucket if the bucket is linked (sharing_type = 'target') | `in.c-keboola-ex-instagram-152387726` |

### kbc_column
This table shows data about the current state of storage columns.

*Note: The table is always extracted in full.*

| **Column** | **Description** | **Example** | 
|---|---|---|
| `column_id` | Storage column identifier | `in.c-in_sh_kbc_internal.kbc_schedule.kbc_token_id` |
| `kbc_project_id` | Foreign key to the Keboola project | `7880_kbc-us-east-1` |
| `kbc_project_column_id` (PK) | Keboola column identifier | `7880_kbc-us-east-1_in.c-in_sh_kbc_internal.kbc_schedule.kbc_token_id` |
| `kbc_project_table_id` | Foregin key to the Keboola table | `7880_kbc-us-east-1_in.c-in_sh_kbc_internal.kbc_schedule` |
| `column_name` | Name of the column | `kbc_token_id` |
| `sort` | Order of the column in the table | `11` |

### kbc_column_metadata
This table shows data about columns' metadata.

*Note: The table is always extracted in full.*

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_column_metadata_id` (PK) | Keboola column metadata identifier | `1713681942_kbc-us-east-1` |
| `kbc_project_id` | Foreign key to the Keboola project | `7880_kbc-us-east-1` |
| `kbc_project_column_id` | Foreign key to the Keboola column | `7880_kbc-us-east-1_out.c-kbc_public_telemetry.kbc_job.kbc_token_id` |
| `column_name` | Name of the column | `kbc_token_id` |
| `table_id` | Identifier of the storage table | `out.c-kbc_public_telemetry.kbc_job` |
| `composite_id` | Folder structure identifier | `799945/storage/kbc_job/kbc_token_id` |
| `key` | Metadata key | `KBC.datatype.type` |
| `value` | Metadata value | `VARCHAR` |

### kbc_flow_phase
This table shows data about particular phases of flows.

*Note: The table is always extracted in full.*

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_flow_phase_id` (PK) | Keboola flow phase identifier | `7880_kbc-us-east-1_keboola.orchestrator_884004674_9` |
| `kbc_component_configuration_id` | Foreign key to the flow component configuration | `7880_kbc-us-east-1_keboola.orchestrator_884004674` |
| `kbc_project_id` | Foreign key to the Keboola project | `7880_kbc-us-east-1` |
| `phase_id` | Identifier of the phase | `9` |
| `phase_name` | Name of the phase | `Load` |
| `depends_on_phase_id` | Identifiers of the phases this depends on (JSON array) | `[8]` |

### kbc_flow_task
This table shows data about flow tasks.

*Note: The table is always extracted in full.*

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_flow_task_id` (PK) | Keboola flow task identifier | `7880_kbc-us-east-1_keboola.orchestrator_884004674_67558` |
| `kbc_flow_phase_id` | Foreign key to Keboola flow phase | `7880_kbc-us-east-1_keboola.orchestrator_884004674_9` |
| `kbc_project_id` | Foreign key to the Keboola project | `7880_kbc-us-east-1` |
| `task_id` | Identifier of the task | `67558` |
| `task_name` | Name of the task | `keboola.wr-db-snowflake-952663182` |
| `task_enabled` | Flags if the task is enabled | `true` |
| `continue_on_failure` | Flags if the flow should run in case of a task failure | `false` |
| `mode` | Selected mode of the task | `run` |
| `task_component_id_orig` | Keboola component identifier | `keboola.wr-db-snowflake` |
| `task_configuration_id_num` | Numeric identifier of the task configuration | `952663182` |
| `task_kbc_component_id` | Unique Keboola component identifier | `keboola.wr-db-snowflake_kbc-us-east-1` |
| `task_kbc_component_configuration_id` | Foreign key to the flow component configuration | `7880_kbc-us-east-1_keboola.wr-db-snowflake_952663182` |

### kbc_job_input_table
This table shows data about all input tables of the job.

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_job_id` (PK) | Keboola flow task identifier | `963416992_kbc-us-east-1` |
| `kbc_project_id` | Foreign key to the Keboola project | `7880_kbc-us-east-1` |
| `table_id` | Identifier of the table | `in.c-in_sh_kbc_internal.kbc_project` |
| `kbc_project_table_id` (PK) | Foreign key to the Keboola Table | `7880_kbc-us-east-1_in.c-in_sh_kbc_internal.kbc_project` |
| `table_name` | Name of the table | `kbc_project` |
| `mappings` | Number of times the table was used in the job input (i.e., one table can be used multiple times in the input mapping of the transformation) | `1` |

### kbc_job_output_table
This table shows data about all output tables of the job.

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_job_id` (PK) | Keboola flow task identifier | `909588277_kbc-us-east-1` |
| `kbc_project_id` | Foreign key to the Keboola project | `7880_kbc-us-east-1` |
| `table_id` | Identifier of the table | `out.c-kbc_billing.kbc_event` |
| `kbc_project_table_id` (PK) | Foreign key to the Keboola Table | `7880_kbc-us-east-1_out.c-kbc_billing.kbc_event` |
| `table_name` | Name of the table | `kbc_event` |
| `mappings` | Number of times the table was used in the job output (i.e., one table can be written multiple times to the storage in the output mapping of the transformation) | `1` |

### kbc_notification_subscription
This table shows data subscriptions to notifications sent by Keboola (mostly flow notifications).

*Note: The table is always extracted in full.*

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_notification_subscription_id` (PK) | Keboola notification subscription identifier | `1083_kbc-us-east-1` |
| `kbc_component_configuration_id` | Foreign key to the flow component configuration | `7880_kbc-us-east-1_keboola.orchestrator_884004674` |
| `kbc_project_id` | Foreign key to the Keboola project | `7880_kbc-us-east-1` |
| `kbc_component_id` | Unique Keboola component identifier | `keboola.orchestrator_kbc-us-east-1` |
| `type` | Type of the notification | `project` |
| `created_at` | Datetime when the notification subscription was created | `2022-07-29 08:39:09` |
| `deleted_at` | Datetime when the notification subscription was deleted | `2022-12-01 08:39:28` |
| `event` | Defines event which triggers the notification | `job-succeeded-with-warning` |
| `recipient_channel` | Channel the notification is sent through | `email` |
| `recipient_address` | Address of the recipient | `my-notifications@keboola.com` |

### kbc_organization_user
This table shows data about users in [organizations](/management/organization/).

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_organization_id` (PK) | Foreign key to the Keboola organization | `141_kbc-us-east-1` |
| `snapshot_time` (PK) | Date of the snapshot | `2023-07-25` |
| `user_id` (PK) | Unique identifier of the user | `53_kbc-us-east-1` |
| `valid_from` | Datetime from which the user is a member of the organization | `2019-11-12 14:06:02` |
| `email` | Email of the user | `john.doe@keboola.com` |
| `domain` | Email domain of the user | `keboola.com` |
| `invated_by_email` | Email of the inviter | `john.doe@keboola.com` |

### kbc_schedule
This table shows data about configuration schedules.

*Note: The table is always extracted in full.*

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_schedule_id` (PK) | Keboola schedule identifier | `21860_kbc-us-east-1` |
| `kbc_scheduler_configuration_id` | Foreign key to the scheduler component configuration | `7880_kbc-us-east-1_keboola.scheduler_884004680` |
| `kbc_project_id` | Foreign key to the Keboola project | `7880_kbc-us-east-1` |
| `mode` | Mode of the schedule execution | `run` |
| `tag` | Tag associated with the schedule | `mytag` |
| `crontab` | Crontab definition of the schedule | `55 2 * * *` |
| `crontab_timezone` | Timezone of the crontab | `UTC` |
| `state` | Current state of the schedule | `enabled` |
| `kbc_component_configuration_id` | Foreign key to the configuration of the scheduled component | `7880_kbc-us-east-1_keboola.orchestrator_884004679` |
| `kbc_component_id` | Unique identifier of the scheduled Keboola component | `keboola.orchestrator_kbc-us-east-1` |
| `kbc_token_id` | Foreign key to the Keboola token | `516358_kbc-us-east-1` |
| `token_name` | Name of the token | `[_internal] Daily Scheduler` |

### kbc_table
This table shows data about the current state of storage [tables](/storage/tables/).

*Note: The table is always extracted in full.*

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_project_table_id` (PK) | Unique Keboola storage table identifier | `7880_kbc-us-east-1_in.c-in_sh_kbc_internal.kbc_project_user` |
| `table_id` | Storage table identifier | `in.c-in_sh_kbc_internal.kbc_project_user` |
| `kbc_project_id` | Foreign key to the Keboola project | `7880_kbc-us-east-1` |
| `kbc_project_bucket_id` | Foreign key to the Keboola bucket | `7880_kbc-us-east-1_729486` |
| `created` | Datetime when the table was created | `2020-10-07 12:29:25` |
| `last_import` | Datetime of the last import to the table | `2023-08-17 08:00:12` |
| `table_name` | Name of the Storage table | `kbc_project_user` |
| `primary_key` | Primary key of the Storage table | `kbc_project_id,snapshot_time,user_id` |
| `is_alias` | Determines if the table is an alias (`true`, `false`) | `true` |
| `alias_column_sync` | Determines if the alias table should sync all the columns from the source table (`true`, `false`). | `true` |
| `source_project_id` | Foreign key to the Keboola project the alias is coming from | `7874_kbc-us-east-1` |
| `source_table_id` | Identifier of the source table | `out.c-kbc_internal.kbc_project_user` |
| `alias_filter_column` | Column used to filter rows of the source table | `user_id` |
| `alias_filter_operator` | Type of the alias filter operator. Possible values: <br> `eq` -- SQL “IN” <br> `ne` -- SQL “NOT IN” | `eq` |
| `alias_filter_value` | Value the alias filter is filtering by | `ASNDUH8737D` |
| `rows` | Number of rows in the table | `16362276` |
| `bytes` | Data size of the table in bytes | `294944256` |

### kbc_table_event
This table shows data about events of the storage [tables](/storage/tables/).

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_table_event_id` (PK) | Unique Keboola table event identifier | `7103338092_kbc-us-east-1` |
| `table_id` | Storage table identifier | `in.c-in_sh_kbc_internal.kbc_flow_task` |
| `kbc_project_id` | Foreign key to the Keboola project | `7880_kbc-us-east-1` |
| `kbc_project_table_id` | Foreign key to the Keboola table | `7880_kbc-us-east-1_in.c-in_sh_kbc_internal.kbc_flow_task` |
| `event_created_at` | Datetime the table was created | `2023-06-14 00:13:23` |
| `event` | Table event which occurred | `storage.tableImportDone` |
| `event_type` | Type of the event | `success` |
| `message` | Message describing the event | `Imported table in.c-in_sh_kbc_internal.kbc_flow_task` |
| `params` | Parameters of the event (JSON object) | `{"importId":"985123712","incremental":true,"source":{"dataObject":"out_kbc_flow_task","type":"workspace","tableName":"out_kbc_flow_task","workspaceId":"985122240"}}` |
| `results` | Results of the event (JSON object). | `{"rowsCount":"272800","sizeBytes":15412736}` |
| `kbc_token_id` | Foreign key to the Keboola token | `516356_kbc-us-east-1` |
| `token_name` | Name of the token | `orchestration trigger` |

### kbc_table_metadata
This table shows data about metadata of the storage [tables](/storage/tables/).

*Note: The table is always extracted in full.*

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_table_metadata_id` (PK) | Unique Keboola table metadata identifier | `1709268888_kbc-us-east-1` |
| `kbc_project_id` | Foreign key to the Keboola project | `7880_kbc-us-east-1` |
| `kbc_project_table_id` | Foreign key to the Keboola table | `7880_kbc-us-east-1_out.c-kbc_billing.daily_credit_changes` |
| `composite_id` | Folder structure identifier | `729487/storage/daily_credit_changes` |
| `key` | Metadata key | `KBC.name` |
| `value` | Metadata value | `out_daily_credit_changes` |

### kbc_token
This table shows data about the storage [tokens](/management/project/tokens/).

*Note: The table is always extracted in full.*

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_token_id` (PK) | Unique Keboola token identifier | `516357_kbc-us-east-1` |
| `kbc_project_id` | Foreign key to the Keboola project | `7880_kbc-us-east-1` |
| `description` | Name of the token | `[_internal] Main Scheduler` |
| `created` | Datetime when the token was created | `2022-07-29 08:39:08` |
| `expires` | Datetime when the token expires | `2024-07-29 08:39:08` |
| `refreshed` | Datetime when the token was refreshed | `2022-07-29T08:39:08Z` |
| `is_disabled` | Flags if the token is disabled | `false` |
| `can_manage_buckets` | Flags if the token can manage storage buckets | `true` |
| `can_manage_tokens` | Flags if the token can manage other tokens | `false` |
| `can_read_all_file_uploads` | Flags if the token can read storage file uploads | `true` |
| `can_purge_trash` | Flags if the token can purge project trash | `false` |
| `component_access` | Defines if the token has access to only a specific component | `orchestrator` |
| `is_master_token` | Defines is the token is a master (generally user's personal token) | `false` |
| `daily_capacity` | Daily operations capacity of the token (currently not used by the backend) | `5` |
| `created_by_token_id` | Foreign key to the creator Keboola token | `287689_kbc-us-east-1` |
| `created_by_token_name` | Name of the creator token | `john.doe@keboola.com` |

### kbc_token_event
This table shows data about events of the storage [tokens](/management/project/tokens/).

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_token_event_id` (PK) | Unique Keboola token event identifier | `7104199256_kbc-us-east-1` |
| `kbc_project_id` | Foreign key to the Keboola project | `7880_kbc-us-east-1` |
| `event_created_at` | Datetime when the table was created | `2023-06-14 06:03:10` |
| `event` | Token event which occurred | `storage.tokenCreated` |
| `event_type` | Type of the event | `info` |
| `target_kbc_token_id` | Foreign key to the Keboola token related to the event | `593967_kbc-us-east-1` |
| `target_kbc_token_name` | Name of the Keboola token related to the event | `[_internal] Scheduler for 985200312 Scheduler` |
| `kbc_token_id` | Foreign key to the Keboola token creating the event | `287689_kbc-us-east-1` |
| `token_name` | Name of the token creating the event | `john.doe@keboola.com` |

### kbc_transformation_code
This table shows data about codes of [transformations](/transformations/).

*Note: The table is always extracted in full.*

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_transformation_code_id` (PK) | Unique Keboola transformation code identifier | `7880_kbc-us-east-1_keboola.snowflake-transformation_867148197_Product Stickiness` |
| `kbc_component_configuration_id` | Foreign key to the transformation component configuration | `7880_kbc-us-east-1_keboola.snowflake-transformation_867148197` |
| `kbc_project_id` | Foreign key to the Keboola project | `7880_kbc-us-east-1` |
| `code_name` | Name of the transformation code | `Product Stickiness` |
| `code_script` | Script in the code block (JSON object) | `["--speed up queries by some deletes\nCREATE TABLE \"kbc_usage_metrics_values_filtered\"\nAS\n SELECT...` |

### kbc_transformation_input
This table shows data about inputs of [transformations](/transformations/).

*Note: The table is always extracted in full.*

| **Column** | **Description** | **Example** |
|---|---|---|
| `kbc_transformation_input_id` (PK) | Unique Keboola transformation input identifier | `7880_kbc-us-east-1_keboola.snowflake-transformation_854061922_kbc_column_metadata` |
| `kbc_component_configuration_id` | Foreign key to the transformation component configuration | `7880_kbc-us-east-1_keboola.snowflake-transformation_854061922` |
| `kbc_project_id` | Foreign key to the Keboola project | `7880_kbc-us-east-1` |
| `changed_since` | Changed since data filter value | `-12 hours` |
| `destination` | Destination table in the transformation workspace | `kbc_column_metadata` |
| `source` | Source storage table | `out.c-kbc_public_telemetry_preprocess.kbc_column_metadata` |
| `where_column` | Column to filter by | `kbc_project_stack` |
| `where_operator` | Column filter operator | `eq` |
| `where_values` | Column filter value (JSON array) | `["com-keboola-azure-north-europe"]` |

### kbc_transformation_input_column
This table shows data about input columns of [transformations](/transformations/). Available only for non-clone mappings.

*Note: The table is always extracted in full.*

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_transformation_input_column_id` (PK) | Unique Keboola transformation input column identifier | `7880_kbc-us-east-1_keboola.snowflake-transformation_854061913_kbc_job_job_storage_mb` |
| `kbc_transformation_input_id` | Foreign key to transformation input | `7880_kbc-us-east-1_keboola.snowflake-transformation_854061913_kbc_job` |
| `kbc_project_id` | Foreign key to the Keboola project | `7880_kbc-us-east-1` |
| `column` | Input column name | `job_storage_mb` |
| `column_type` | Data type of the column | `VARCHAR` |
| `column_length` | Maximum length of the column | `16777216` |
| `convert_empty_values_to_null` | Flags if the empty values should be converted to NULL | `false` |

### kbc_transformation_output
This table shows data about outputs of the [transformations](/transformations/).

*Note: The table is always extracted in full.*

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_transformation_output_id` (PK) | Unique Keboola transformation output identifier | `7880_kbc-us-east-1_keboola.snowflake-transformation_854061913_out.c-kbc_billing.kbc_data_science_sandbox` |
| `kbc_component_configuration_id` | Foreign key to the transformation component configuration | `7880_kbc-us-east-1_keboola.snowflake-transformation_854061913` |
| `kbc_project_id` | Foreign key to the Keboola project | `7880_kbc-us-east-1` |
| `incremental` | Flags if the data should be written to the destination table incrementally | `true` |
| `destination` | Destination storage table | `out.c-kbc_billing.kbc_data_science_sandbox` |
| `source` | Source table in the transformation workspace | `out_kbc_data_science_sandbox` |
| `primary_key` | Primary key of the table (JSON array) | `["kbc_data_science_sandbox_resume_id","date"]` |
| `delete_where_column` | Column used to identify records to delete before storage import | `kbc_project_stack` |
| `delete_where_operator` | Column filter operator | `eq` |
| `delete_where_values` | Column filter value (JSON array) | `["com-keboola-azure-north-europe"]` |

### kbc_trigger
This table shows data about [triggers](/components/applications/triggers/).

*Note: The table is always extracted in full.*

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_trigger_id` (PK) | Unique Keboola trigger identifier | `1773_kbc-us-east-1` |
| `kbc_project_id` | Foreign key to the Keboola project | `7874_kbc-us-east-1` |
| `kbc_component_configuration_id` | Foreign key to the component configuration which is being triggered | `7874_kbc-us-east-1_keboola.orchestrator_884004642` |
| `kbc_component_id` | Unique identifier of Keboola component of the triggered configuration | `keboola.orchestrator_kbc-us-east-1` |
| `state` | State of the trigger | `charging` |
| `cool_down_period_minutes` | Defines a time period before the trigger can be run again | `5` |
| `last_run` | Datetime of the last run | `2022-08-03 11:53:19` |
| `updated` | Datetime of the last trigger update | `2022-08-03 11:53:20` |
| `run_with_token_id` | Foreign key to the Keboola token triggering the job | `516356_kbc-us-east-1` |
| `run_with_token_name` | Name of the token triggering the job | `Orchestration trigger` |
| `created_by_token_id` | Foreign key to the Keboola token creating the trigger | `516354_kbc-us-east-1` |
| `created_by_token_name` | Name of the token creating the trigger | `john.doe@keboola.com` |

### kbc_trigger_table
This table shows data about tables used to [trigger](/components/applications/triggers/) jobs.

*Note: The table is always extracted in full.*

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_trigger_table_id` (PK) | Unique Keboola trigger table identifier | `5700_kbc-us-east-1` |
| `kbc_trigger_id` | Foreign key to the Keboola trigger | `1773_kbc-us-east-1` |
| `kbc_project_id` | Foreign key to the Keboola project | `7874_kbc-us-east-1` |
| `kbc_project_table_id` | Foreign key to Keboola table triggering the job | `7874_kbc-us-east-1_out.c-kbc_billing.trigger` |
| `table_id` | Identifier of the storage table triggering the job | `out.c-kbc_billing.trigger` |

### kbc_user_activity
This table shows data about basic activity of project users (job runs and configuration updates).

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_user_id` (PK) | Keboola user email (activity can be tracked across stacks) | `john.doe@keboola.com` |
| `kbc_project_id` (PK) | Foreign key to the Keboola project related to the activity | `7880_kbc-us-east-1` |
| `kbc_component_id` (PK) | Identifier of the Keboola component related to the activity  | `keboola.wr-db-snowflake_kbc-us-east-1` |
| `date` (PK) | Date the activity occurred | `2023-08-14` |
| `activity_type` (PK) | Type of the activity (`Job Run`, `Configuration Update` and `None` to see that the user did nothing) | `Job Run` |
| `activities` | Number of activities (number of run job or configuration updates) | `3` |
| `last_project_activity` | Flags if the activity is the last activity of the user in the project | `true` |

### kbc_workspace
This table shows data about existing [workspaces](/transformations/workspace/). Unlike SQL and Data Science sandboxes, this table includes all workspaces of the project (i.e., those created by transformations).

*Note: The table is always extracted in full.*

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_workspace_id` (PK) | Unique Keboola workspace identifier | `985088171_kbc-us-east-1` |
| `kbc_project_id` | Foreign key to the Keboola project | `7880_kbc-us-east-1` |
| `workspace_creator` | Foreign key to the Keboola table | `John Doe` |
| `workspace_created` | Datetime when the workspace was created | `2023-06-13 20:41:42.268` |
| `workspace_type` | Backend type of the workspace | `snowflake` |
| `workspace_active` | Flags if the workspace is active | `1` |
| `workspace_expired` | Datetime when the workspace expired (empty for active) | `2023-07-18 10:20:56.384` |
| `workspace_hostname` | Hostname of the workspace | `https://keboola.snowflakecomputing.com` |
| `workspace_expire_hours` | Number of hours before the workspace expires due to inactivity (currently for data science workspaces) | `1` |
| `workspace_start` | Datetime when the workspace started | `2023-06-13T20:41:42.268Z` |
| `workspace_updated` | Datetime when the workspace was updated | `2023-07-12T12:01:24.181Z` |
| `workspace_user` | User generated for the workspace | `SAPI_WORKSPACE_985088174` |
| `backend_size` | Backend size of the workspace | `small` |
| `storage_size_gb` | Size of the workspace (used for persistent workspaces) | `2` |
| `kbc_token_id` | Foreign key to the Keboola token creating the workspace | `287689_kbc-us-east-1` |
| `kbc_token_name` | Name of the token creating the workspace | `john.doe@keboola.com` |

### kbc_workspace_event
This table shows data about [workspace](/transformations/workspace/) events.

| **Column** | **Description** | **Example** | 
|---|---|---|
| `kbc_workspace_event_id` (PK) | Unique Keboola workspace event identifier | `7236030887_kbc-us-east-1` |
| `kbc_workspace_id` | Foreign key to the Keboola workspace | `985088171_kbc-us-east-1` |
| `kbc_project_id` | Foreign key to the Keboola project | `7880_kbc-us-east-1` |
| `event_created_at` | Datetime when the workspace event was created | `2023-07-23 06:23:19` |
| `event` | Description of the event | `storage.workspaceCreated` |
| `event_type` | Type of the event | `info` |
| `kbc_token_id` | Foreign key to the Keboola token creating the event | `516357_kbc-us-east-1` |
| `kbc_token_name` | Name of the token creating the event | `[_internal] main scheduler` |

## dst_ Columns
Columns with the **dst_** prefix are system columns used in Telemetry Data extractor executions. They are **not** related to the data itself.

## Data Recency
You can obtain telemetry data for your project that is approximately 3 hours old when running the extractor.

*Note: This is not guaranteed, as the raw data is processed before reaching the extractor's source; therefore delays in processing might occur.*
 
