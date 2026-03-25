// Auto-generated from telemetry-data.md — defines schema for the interactive ER diagram
window.TELEMETRY_DIAGRAM = {
  tables: [
    // ===================== PROJECT MODE =====================
    {
      id: "kbc_bucket_snapshot",
      mode: "project",
      columns: [
        { name: "bucket_id", pk: true },
        { name: "kbc_project_id", pk: true, fk: "kbc_project" },
        { name: "snapshot_date", pk: true },
        { name: "stage", pk: false },
        { name: "bucket", pk: false },
        { name: "bucket_display_name", pk: false },
        { name: "rows", pk: false },
        { name: "bytes", pk: false },
        { name: "sharing_type", pk: false },
        { name: "shared_from_project_id", pk: false },
        { name: "shared_from_bucket", pk: false },
        { name: "is_external_schema", pk: false },
        { name: "kbc_branch_id", pk: true, fk: "kbc_branch" },
        { name: "kbc_bucket_owner_id", pk: false }
      ]
    },
    {
      id: "kbc_branch",
      mode: "project",
      columns: [
        { name: "kbc_branch_id", pk: true },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "kbc_branch", pk: false },
        { name: "kbc_branch_created_at", pk: false },
        { name: "is_default", pk: false },
        { name: "token_id", pk: false },
        { name: "token_name", pk: false },
        { name: "kbc_token_id", pk: false }
      ]
    },
    {
      id: "kbc_component_configuration",
      mode: "project",
      columns: [
        { name: "kbc_component_configuration_id", pk: true },
        { name: "kbc_component_configuration_url", pk: false },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "kbc_component_id", pk: false },
        { name: "kbc_component", pk: false },
        { name: "kbc_component_type", pk: false },
        { name: "kbc_component_vendor", pk: false },
        { name: "kbc_component_listing", pk: false },
        { name: "configuration_id_num", pk: false },
        { name: "kbc_component_configuration", pk: false },
        { name: "configuration_created", pk: false },
        { name: "kbc_configuration_version", pk: false },
        { name: "kbc_configuration_is_deleted", pk: false },
        { name: "description", pk: false },
        { name: "configuration_json", pk: false },
        { name: "kbc_branch_id", pk: false, fk: "kbc_branch" },
        { name: "branch_type", pk: false },
        { name: "token_id", pk: false },
        { name: "token_name", pk: false },
        { name: "kbc_token_id", pk: false },
        { name: "folder_name", pk: false }
      ]
    },
    {
      id: "kbc_component_configuration_version",
      mode: "project",
      columns: [
        { name: "kbc_component_configuration_id", pk: true, fk: "kbc_component_configuration" },
        { name: "kbc_branch_id", pk: true, fk: "kbc_branch" },
        { name: "configuration_updated_at", pk: false },
        { name: "change_description", pk: false },
        { name: "configuration_version", pk: true },
        { name: "last_version", pk: false },
        { name: "token_id", pk: false },
        { name: "token_name", pk: false },
        { name: "kbc_token_id", pk: false }
      ]
    },
    {
      id: "kbc_component_configuration_row",
      mode: "project",
      columns: [
        { name: "kbc_component_configuration_row_id", pk: true },
        { name: "kbc_component_configuration_id", pk: false, fk: "kbc_component_configuration" },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "kbc_component_id", pk: false },
        { name: "configuration_row_id_num", pk: false },
        { name: "kbc_component_configuration_row", pk: false },
        { name: "configuration_row_created", pk: false },
        { name: "kbc_configuration_row_version", pk: false },
        { name: "kbc_configuration_row_is_disabled", pk: false },
        { name: "kbc_configuration_row_is_deleted", pk: false },
        { name: "description", pk: false },
        { name: "configuration_row_json", pk: false },
        { name: "token_id", pk: false },
        { name: "token_name", pk: false },
        { name: "kbc_token_id", pk: false }
      ]
    },
    {
      id: "kbc_data_app_workspace",
      mode: "project",
      columns: [
        { name: "kbc_data_app_workspace_run_id", pk: true },
        { name: "kbc_data_app_workspace_id", pk: false },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "date", pk: true },
        { name: "created_at", pk: false },
        { name: "expiration_at", pk: false },
        { name: "updated_at", pk: false },
        { name: "start_at", pk: false },
        { name: "sleep_at", pk: false },
        { name: "type", pk: false },
        { name: "hostname", pk: false },
        { name: "data_app_runtime_hours", pk: false },
        { name: "backend_size", pk: false },
        { name: "time_credits_used", pk: false },
        { name: "billed_credits_used", pk: false }
      ]
    },
    {
      id: "kbc_data_science_sandbox",
      mode: "project",
      columns: [
        { name: "kbc_data_science_sandbox_resume_id", pk: true },
        { name: "kbc_data_science_sandbox_id", pk: false },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "date", pk: true },
        { name: "created_at", pk: false },
        { name: "expiration_at", pk: false },
        { name: "updated_at", pk: false },
        { name: "start_at", pk: false },
        { name: "sleep_at", pk: false },
        { name: "type", pk: false },
        { name: "hostname", pk: false },
        { name: "sandbox_runtime_hours", pk: false },
        { name: "backend_size", pk: false },
        { name: "time_credits_used", pk: false },
        { name: "billed_credits_used", pk: false }
      ]
    },
    {
      id: "kbc_job",
      mode: "project",
      columns: [
        { name: "kbc_job_id", pk: true },
        { name: "kbc_component_configuration_id", pk: false, fk: "kbc_component_configuration" },
        { name: "kbc_component_configuration_row_id", pk: false },
        { name: "kbc_branch_id", pk: false, fk: "kbc_branch" },
        { name: "branch_type", pk: false },
        { name: "kbc_component_id", pk: false },
        { name: "transformation_type", pk: false },
        { name: "credit_type", pk: false },
        { name: "job_run_id", pk: false },
        { name: "job_start_at", pk: false },
        { name: "job_created_at", pk: false },
        { name: "job_status", pk: false },
        { name: "error_type", pk: false },
        { name: "error_message", pk: false },
        { name: "job_run_type", pk: false },
        { name: "job_type", pk: false },
        { name: "token_id", pk: false },
        { name: "token_name", pk: false },
        { name: "kbc_token_id", pk: false },
        { name: "flow_id", pk: false },
        { name: "flow", pk: false },
        { name: "job_time_credits_used", pk: false },
        { name: "job_billed_credits_used", pk: false },
        { name: "job_total_time_sec", pk: false },
        { name: "job_run_time_sec", pk: false },
        { name: "job_network_mb", pk: false },
        { name: "ds_backend_size", pk: false },
        { name: "dwh_small_ratio", pk: false },
        { name: "dwh_medium_ratio", pk: false },
        { name: "dwh_large_ratio", pk: false },
        { name: "backend_size", pk: false },
        { name: "company_id", pk: false }
      ]
    },
    {
      id: "kbc_mcp_event",
      mode: "project",
      columns: [
        { name: "kbc_mcp_event_id", pk: true },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "event_created_at", pk: false },
        { name: "event", pk: false },
        { name: "type", pk: false },
        { name: "kbc_token_id", pk: false },
        { name: "token_name", pk: false },
        { name: "api_version", pk: false },
        { name: "http_user_agent", pk: false },
        { name: "mcp_user_agent", pk: false },
        { name: "mcp_version", pk: false },
        { name: "mcp_environment", pk: false },
        { name: "mcp_conversation_id", pk: false },
        { name: "tool", pk: false },
        { name: "tool_arguments", pk: false },
        { name: "duration", pk: false },
        { name: "message", pk: false },
        { name: "agent_type", pk: false },
        { name: "is_keboola_agent_event", pk: false }
      ]
    },
    {
      id: "kbc_project",
      mode: "project",
      columns: [
        { name: "kbc_project_id", pk: true },
        { name: "kbc_project_id_num", pk: false },
        { name: "kbc_project", pk: false },
        { name: "kbc_project_region", pk: false },
        { name: "kbc_project_cloud", pk: false },
        { name: "kbc_project_url", pk: false },
        { name: "kbc_organization_id", pk: false, fk: "kbc_organization" },
        { name: "kbc_project_created", pk: false },
        { name: "kbc_project_deleted", pk: false },
        { name: "kbc_project_is_deleted", pk: false },
        { name: "kbc_project_expiration", pk: false },
        { name: "kbc_project_type", pk: false },
        { name: "kbc_project_creator", pk: false }
      ]
    },
    {
      id: "kbc_project_snapshot",
      mode: "project",
      columns: [
        { name: "kbc_project_id", pk: true, fk: "kbc_project" },
        { name: "snapshot_date", pk: true },
        { name: "rows", pk: false },
        { name: "bytes", pk: false }
      ]
    },
    {
      id: "kbc_project_user",
      mode: "project",
      columns: [
        { name: "kbc_project_id", pk: true, fk: "kbc_project" },
        { name: "snapshot_time", pk: true },
        { name: "user_id", pk: true },
        { name: "kbc_token_id", pk: true },
        { name: "valid_from", pk: false },
        { name: "email", pk: false },
        { name: "domain", pk: false },
        { name: "role", pk: false },
        { name: "expires", pk: false },
        { name: "invited_by_user_id", pk: false },
        { name: "invited_by_email", pk: false },
        { name: "approved_by_user_id", pk: false },
        { name: "approved_by_email", pk: false },
        { name: "reason", pk: false }
      ]
    },
    {
      id: "kbc_snowflake_stats",
      mode: "project",
      columns: [
        { name: "kbc_snowflake_stats_id", pk: false },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "snowflake_job_start_at", pk: false },
        { name: "dwh_size", pk: false },
        { name: "snowflake_dwh", pk: false },
        { name: "snowflake_database", pk: false },
        { name: "snowflake_schema", pk: false },
        { name: "snowflake_user", pk: false },
        { name: "snowflake_job_type", pk: false },
        { name: "snowflake_job_result", pk: false },
        { name: "snowflake_queries", pk: false },
        { name: "snowflake_queries_length_s", pk: false },
        { name: "time_credits_used", pk: false },
        { name: "billed_credits_used", pk: false }
      ]
    },
    {
      id: "kbc_bigquery_stats",
      mode: "project",
      columns: [
        { name: "kbc_bigquery_stats_id", pk: false },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "bigquery_job_start_at", pk: false },
        { name: "bigquery_user", pk: false },
        { name: "bigquery_job_type", pk: false },
        { name: "bigquery_queries", pk: false },
        { name: "bigquery_queries_length_s", pk: false },
        { name: "time_credits_used", pk: false },
        { name: "billed_credits_used", pk: false }
      ]
    },
    {
      id: "kbc_table_snapshot",
      mode: "project",
      columns: [
        { name: "table_id", pk: true },
        { name: "kbc_project_id", pk: true, fk: "kbc_project" },
        { name: "snapshot_date", pk: true },
        { name: "bucket_id", pk: false },
        { name: "created", pk: false },
        { name: "last_import", pk: false },
        { name: "table_name", pk: false },
        { name: "primary_key", pk: false },
        { name: "is_alias", pk: false },
        { name: "alias_column_sync", pk: false },
        { name: "source_project_id", pk: false },
        { name: "source_table_id", pk: false },
        { name: "alias_filter_column", pk: false },
        { name: "alias_filter_operator", pk: false },
        { name: "alias_filter_value", pk: false },
        { name: "rows", pk: false },
        { name: "bytes", pk: false }
      ]
    },
    {
      id: "kbc_usage_metrics_values",
      mode: "project",
      columns: [
        { name: "metrics_values_id", pk: true },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "usage_metric_id", pk: false, fk: "usage_metric" },
        { name: "date", pk: false },
        { name: "usage_breakdown", pk: false },
        { name: "is_sandbox", pk: false },
        { name: "value", pk: false },
        { name: "organization_value", pk: false },
        { name: "company_value", pk: false },
        { name: "time_credits_value", pk: false },
        { name: "run_time_hours", pk: false },
        { name: "jobs", pk: false }
      ]
    },
    {
      id: "security_event",
      mode: "project",
      columns: [
        { name: "security_event_id", pk: true },
        { name: "event_created", pk: false },
        { name: "company_id", pk: false },
        { name: "kbc_organization_id", pk: false, fk: "kbc_organization" },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "admin_email", pk: false },
        { name: "admin_name", pk: false },
        { name: "admin_ip", pk: false },
        { name: "operation", pk: false },
        { name: "operation_params", pk: false },
        { name: "token_id", pk: false },
        { name: "token_description", pk: false },
        { name: "kbc_token_id", pk: false },
        { name: "context_admin_email", pk: false },
        { name: "context_admin_name", pk: false },
        { name: "context_merge_request_id", pk: false },
        { name: "context_merge_request_name", pk: false },
        { name: "context_operation", pk: false },
        { name: "context_state_from", pk: false },
        { name: "context_state_to", pk: false }
      ]
    },

    // ===================== ORGANIZATION MODE =====================
    {
      id: "contract_limit_monthly",
      mode: "organization",
      columns: [
        { name: "contract_limit_monthly_id", pk: true },
        { name: "contract_id", pk: false },
        { name: "usage_metric_id", pk: false, fk: "usage_metric" },
        { name: "date", pk: false },
        { name: "limit_value", pk: false },
        { name: "limit_type", pk: false }
      ]
    },
    {
      id: "kbc_organization",
      mode: "organization",
      columns: [
        { name: "kbc_organization_id", pk: true },
        { name: "kbc_organization_id_num", pk: false },
        { name: "kbc_organization", pk: false },
        { name: "kbc_maintainer_id", pk: false },
        { name: "company_id", pk: false },
        { name: "kbc_region", pk: false },
        { name: "kbc_cloud", pk: false },
        { name: "kbc_organization_created_at", pk: false },
        { name: "kbc_organization_deleted_at", pk: false },
        { name: "kbc_organization_is_deleted", pk: false },
        { name: "kbc_organization_autojoin", pk: false },
        { name: "kbc_organization_url", pk: false }
      ]
    },
    {
      id: "usage_metric",
      mode: "organization",
      columns: [
        { name: "usage_metric_id", pk: false },
        { name: "usage_metric", pk: false },
        { name: "metric_type", pk: false }
      ]
    },

    // ===================== ACTIVITY CENTER MODE =====================
    {
      id: "kbc_bucket",
      mode: "activity_center",
      columns: [
        { name: "bucket_id", pk: false },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "kbc_project_bucket_id", pk: true },
        { name: "stage", pk: false },
        { name: "bucket", pk: false },
        { name: "bucket_display_name", pk: false },
        { name: "rows", pk: false },
        { name: "bytes", pk: false },
        { name: "sharing_type", pk: false },
        { name: "shared_from_project_id", pk: false },
        { name: "shared_from_bucket", pk: false },
        { name: "description", pk: false },
        { name: "is_external_schema", pk: false },
        { name: "kbc_branch_id", pk: true, fk: "kbc_branch" },
        { name: "kbc_bucket_owner_id", pk: false }
      ]
    },
    {
      id: "kbc_column",
      mode: "activity_center",
      columns: [
        { name: "column_id", pk: false },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "kbc_project_column_id", pk: true },
        { name: "kbc_project_table_id", pk: false, fk: "kbc_table" },
        { name: "column_name", pk: false },
        { name: "sort", pk: false }
      ]
    },
    {
      id: "kbc_column_metadata",
      mode: "activity_center",
      columns: [
        { name: "kbc_column_metadata_id", pk: true },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "kbc_project_column_id", pk: false, fk: "kbc_column" },
        { name: "column_name", pk: false },
        { name: "table_id", pk: false },
        { name: "composite_id", pk: false },
        { name: "key", pk: false },
        { name: "value", pk: false },
        { name: "provider", pk: false }
      ]
    },
    {
      id: "kbc_flow_phase",
      mode: "activity_center",
      columns: [
        { name: "kbc_flow_phase_id", pk: true },
        { name: "kbc_component_configuration_id", pk: false, fk: "kbc_component_configuration" },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "phase_id", pk: false },
        { name: "phase_name", pk: false },
        { name: "depends_on_phase_id", pk: false }
      ]
    },
    {
      id: "kbc_flow_task",
      mode: "activity_center",
      columns: [
        { name: "kbc_flow_task_id", pk: true },
        { name: "kbc_flow_phase_id", pk: false, fk: "kbc_flow_phase" },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "task_id", pk: false },
        { name: "task_name", pk: false },
        { name: "task_enabled", pk: false },
        { name: "continue_on_failure", pk: false },
        { name: "mode", pk: false },
        { name: "task_component_id_orig", pk: false },
        { name: "task_configuration_id_num", pk: false },
        { name: "task_kbc_component_id", pk: false },
        { name: "task_kbc_component_configuration_id", pk: false, fk: "kbc_component_configuration" }
      ]
    },
    {
      id: "kbc_job_input_table",
      mode: "activity_center",
      columns: [
        { name: "kbc_job_id", pk: true, fk: "kbc_job" },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "table_id", pk: false },
        { name: "kbc_project_table_id", pk: true, fk: "kbc_table" },
        { name: "table_name", pk: false },
        { name: "mappings", pk: false }
      ]
    },
    {
      id: "kbc_job_output_table",
      mode: "activity_center",
      columns: [
        { name: "kbc_job_id", pk: true, fk: "kbc_job" },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "table_id", pk: false },
        { name: "kbc_project_table_id", pk: true, fk: "kbc_table" },
        { name: "table_name", pk: false },
        { name: "mappings", pk: false }
      ]
    },
    {
      id: "kbc_notification_subscription",
      mode: "activity_center",
      columns: [
        { name: "kbc_notification_subscription_id", pk: true },
        { name: "kbc_component_configuration_id", pk: false, fk: "kbc_component_configuration" },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "kbc_component_id", pk: false },
        { name: "type", pk: false },
        { name: "created_at", pk: false },
        { name: "deleted_at", pk: false },
        { name: "event", pk: false },
        { name: "recipient_channel", pk: false },
        { name: "recipient_address", pk: false }
      ]
    },
    {
      id: "kbc_organization_user",
      mode: "activity_center",
      columns: [
        { name: "kbc_organization_id", pk: true, fk: "kbc_organization" },
        { name: "snapshot_time", pk: true },
        { name: "user_id", pk: true },
        { name: "valid_from", pk: false },
        { name: "email", pk: false },
        { name: "domain", pk: false },
        { name: "invated_by_email", pk: false }
      ]
    },
    {
      id: "kbc_schedule",
      mode: "activity_center",
      columns: [
        { name: "kbc_schedule_id", pk: true },
        { name: "kbc_scheduler_configuration_id", pk: false },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "mode", pk: false },
        { name: "tag", pk: false },
        { name: "crontab", pk: false },
        { name: "crontab_timezone", pk: false },
        { name: "state", pk: false },
        { name: "kbc_component_configuration_id", pk: false, fk: "kbc_component_configuration" },
        { name: "kbc_component_id", pk: false },
        { name: "kbc_token_id", pk: false, fk: "kbc_token" },
        { name: "token_name", pk: false }
      ]
    },
    {
      id: "kbc_table",
      mode: "activity_center",
      columns: [
        { name: "kbc_project_table_id", pk: true },
        { name: "table_id", pk: false },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "kbc_project_bucket_id", pk: false, fk: "kbc_bucket" },
        { name: "last_snapshot_date", pk: false },
        { name: "created", pk: false },
        { name: "last_import", pk: false },
        { name: "table_name", pk: false },
        { name: "primary_key", pk: false },
        { name: "is_alias", pk: false },
        { name: "alias_column_sync", pk: false },
        { name: "source_project_id", pk: false },
        { name: "source_table_id", pk: false },
        { name: "alias_filter_column", pk: false },
        { name: "alias_filter_operator", pk: false },
        { name: "alias_filter_value", pk: false },
        { name: "rows", pk: false },
        { name: "bytes", pk: false },
        { name: "description", pk: false }
      ]
    },
    {
      id: "kbc_table_event",
      mode: "activity_center",
      columns: [
        { name: "kbc_table_event_id", pk: true },
        { name: "table_id", pk: false },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "kbc_project_table_id", pk: false, fk: "kbc_table" },
        { name: "event_created_at", pk: false },
        { name: "event", pk: false },
        { name: "event_type", pk: false },
        { name: "message", pk: false },
        { name: "params", pk: false },
        { name: "results", pk: false },
        { name: "kbc_token_id", pk: false, fk: "kbc_token" },
        { name: "token_name", pk: false },
        { name: "kbc_data_app_id", pk: false, fk: "kbc_data_app" }
      ]
    },
    {
      id: "kbc_table_metadata",
      mode: "activity_center",
      columns: [
        { name: "kbc_table_metadata_id", pk: true },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "kbc_project_table_id", pk: false, fk: "kbc_table" },
        { name: "composite_id", pk: false },
        { name: "key", pk: false },
        { name: "value", pk: false },
        { name: "provider", pk: false }
      ]
    },
    {
      id: "kbc_token",
      mode: "activity_center",
      columns: [
        { name: "kbc_token_id", pk: true },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "company_id", pk: false },
        { name: "description", pk: false },
        { name: "created", pk: false },
        { name: "expires", pk: false },
        { name: "refreshed", pk: false },
        { name: "is_disabled", pk: false },
        { name: "can_manage_buckets", pk: false },
        { name: "can_manage_tokens", pk: false },
        { name: "can_read_all_file_uploads", pk: false },
        { name: "can_purge_trash", pk: false },
        { name: "component_access", pk: false },
        { name: "is_master_token", pk: false },
        { name: "daily_capacity", pk: false },
        { name: "created_by_token_id", pk: false, fk: "kbc_token" },
        { name: "created_by_token_name", pk: false }
      ]
    },
    {
      id: "kbc_token_event",
      mode: "activity_center",
      columns: [
        { name: "kbc_token_event_id", pk: true },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "event_created_at", pk: false },
        { name: "event", pk: false },
        { name: "event_type", pk: false },
        { name: "target_kbc_token_id", pk: false, fk: "kbc_token" },
        { name: "target_kbc_token_name", pk: false },
        { name: "kbc_token_id", pk: false, fk: "kbc_token" },
        { name: "token_name", pk: false }
      ]
    },
    {
      id: "kbc_transformation_code",
      mode: "activity_center",
      columns: [
        { name: "kbc_transformation_code_id", pk: true },
        { name: "kbc_component_configuration_id", pk: false, fk: "kbc_component_configuration" },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "code_name", pk: false },
        { name: "code_script", pk: false }
      ]
    },
    {
      id: "kbc_transformation_input",
      mode: "activity_center",
      columns: [
        { name: "kbc_transformation_input_id", pk: true },
        { name: "kbc_component_configuration_id", pk: false, fk: "kbc_component_configuration" },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "changed_since", pk: false },
        { name: "destination", pk: false },
        { name: "source", pk: false },
        { name: "where_column", pk: false },
        { name: "where_operator", pk: false },
        { name: "where_values", pk: false }
      ]
    },
    {
      id: "kbc_transformation_input_column",
      mode: "activity_center",
      columns: [
        { name: "kbc_transformation_input_column_id", pk: true },
        { name: "kbc_transformation_input_id", pk: false, fk: "kbc_transformation_input" },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "column", pk: false },
        { name: "column_type", pk: false },
        { name: "column_length", pk: false },
        { name: "convert_empty_values_to_null", pk: false }
      ]
    },
    {
      id: "kbc_transformation_output",
      mode: "activity_center",
      columns: [
        { name: "kbc_transformation_output_id", pk: true },
        { name: "kbc_component_configuration_id", pk: false, fk: "kbc_component_configuration" },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "incremental", pk: false },
        { name: "destination", pk: false },
        { name: "source", pk: false },
        { name: "primary_key", pk: false },
        { name: "delete_where_column", pk: false },
        { name: "delete_where_operator", pk: false },
        { name: "delete_where_values", pk: false }
      ]
    },
    {
      id: "kbc_trigger",
      mode: "activity_center",
      columns: [
        { name: "kbc_trigger_id", pk: true },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "kbc_component_configuration_id", pk: false, fk: "kbc_component_configuration" },
        { name: "kbc_component_id", pk: false },
        { name: "state", pk: false },
        { name: "cool_down_period_minutes", pk: false },
        { name: "last_run", pk: false },
        { name: "updated", pk: false },
        { name: "run_with_token_id", pk: false, fk: "kbc_token" },
        { name: "run_with_token_name", pk: false },
        { name: "created_by_token_id", pk: false, fk: "kbc_token" },
        { name: "created_by_token_name", pk: false }
      ]
    },
    {
      id: "kbc_trigger_table",
      mode: "activity_center",
      columns: [
        { name: "kbc_trigger_table_id", pk: true },
        { name: "kbc_trigger_id", pk: false, fk: "kbc_trigger" },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "kbc_project_table_id", pk: false, fk: "kbc_table" },
        { name: "table_id", pk: false }
      ]
    },
    {
      id: "kbc_user_activity",
      mode: "activity_center",
      columns: [
        { name: "kbc_user_id", pk: true },
        { name: "kbc_project_id", pk: true, fk: "kbc_project" },
        { name: "kbc_component_id", pk: true },
        { name: "date", pk: true },
        { name: "activity_type", pk: true },
        { name: "activities", pk: false },
        { name: "last_project_activity", pk: false }
      ]
    },
    {
      id: "kbc_workspace",
      mode: "activity_center",
      columns: [
        { name: "kbc_workspace_id", pk: true },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "workspace_creator", pk: false },
        { name: "workspace_created", pk: false },
        { name: "workspace_type", pk: false },
        { name: "workspace_active", pk: false },
        { name: "workspace_expired", pk: false },
        { name: "workspace_hostname", pk: false },
        { name: "workspace_expire_hours", pk: false },
        { name: "workspace_start", pk: false },
        { name: "workspace_updated", pk: false },
        { name: "workspace_user", pk: false },
        { name: "backend_size", pk: false },
        { name: "storage_size_gb", pk: false },
        { name: "kbc_token_id", pk: false, fk: "kbc_token" },
        { name: "kbc_token_name", pk: false },
        { name: "workspace_shared", pk: false },
        { name: "workspace_read_only_storage_access", pk: false },
        { name: "kbc_workspace_name", pk: false },
        { name: "workspace_schema", pk: false }
      ]
    },
    {
      id: "kbc_workspace_event",
      mode: "activity_center",
      columns: [
        { name: "kbc_workspace_event_id", pk: true },
        { name: "kbc_workspace_id", pk: false, fk: "kbc_workspace" },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "event_created_at", pk: false },
        { name: "event", pk: false },
        { name: "event_type", pk: false },
        { name: "kbc_token_id", pk: false, fk: "kbc_token" },
        { name: "kbc_token_name", pk: false }
      ]
    },
    {
      id: "kbc_file_event",
      mode: "activity_center",
      columns: [
        { name: "kbc_file_event_id", pk: true },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "event_created_at", pk: false },
        { name: "event", pk: false },
        { name: "event_type", pk: false },
        { name: "message", pk: false },
        { name: "kbc_file_id", pk: false },
        { name: "kbc_token_id", pk: false, fk: "kbc_token" },
        { name: "kbc_token_name", pk: false }
      ]
    },
    {
      id: "kbc_data_app",
      mode: "activity_center",
      columns: [
        { name: "kbc_data_app_id", pk: true },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "data_app_created", pk: false },
        { name: "data_app_id_num", pk: false },
        { name: "kbc_data_app_name", pk: false },
        { name: "kbc_data_app_url", pk: false },
        { name: "kbc_component_id", pk: false },
        { name: "kbc_component", pk: false },
        { name: "kbc_component_configuration_id", pk: false, fk: "kbc_component_configuration" },
        { name: "kbc_data_app_is_deleted", pk: false }
      ]
    },
    {
      id: "kbc_data_app_params_event",
      mode: "activity_center",
      columns: [
        { name: "kbc_data_app_event_id", pk: true },
        { name: "kbc_project_id", pk: false, fk: "kbc_project" },
        { name: "kbc_data_app_id", pk: false, fk: "kbc_data_app" },
        { name: "data_app_id_num", pk: false },
        { name: "event_created_at", pk: false },
        { name: "event", pk: false },
        { name: "message", pk: false },
        { name: "kbc_token_id", pk: false, fk: "kbc_token" },
        { name: "token_name", pk: false },
        { name: "params", pk: false }
      ]
    }
  ],

  relationships: [
    // Organization -> Project
    { from: "kbc_organization", to: "kbc_project", label: "has projects", type: "one-to-many" },
    { from: "kbc_organization", to: "kbc_organization_user", label: "has users", type: "one-to-many" },
    { from: "kbc_organization", to: "security_event", label: "has events", type: "one-to-many" },

    // Project -> direct children
    { from: "kbc_project", to: "kbc_branch", label: "has branches", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_bucket_snapshot", label: "has bucket snapshots", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_project_snapshot", label: "has snapshots", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_project_user", label: "has users", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_component_configuration", label: "has configurations", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_component_configuration_row", label: "has config rows", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_data_app_workspace", label: "has data app workspaces", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_data_science_sandbox", label: "has sandboxes", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_job", label: "has jobs", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_mcp_event", label: "has MCP events", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_snowflake_stats", label: "has Snowflake stats", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_bigquery_stats", label: "has BigQuery stats", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_table_snapshot", label: "has table snapshots", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_usage_metrics_values", label: "has usage metrics", type: "one-to-many" },
    { from: "kbc_project", to: "security_event", label: "has security events", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_bucket", label: "has buckets", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_column", label: "has columns", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_column_metadata", label: "has column metadata", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_flow_phase", label: "has flow phases", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_flow_task", label: "has flow tasks", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_job_input_table", label: "has job inputs", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_job_output_table", label: "has job outputs", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_notification_subscription", label: "has notifications", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_schedule", label: "has schedules", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_table", label: "has tables", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_table_event", label: "has table events", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_table_metadata", label: "has table metadata", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_token", label: "has tokens", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_token_event", label: "has token events", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_transformation_code", label: "has transformation code", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_transformation_input", label: "has transformation inputs", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_transformation_input_column", label: "has input columns", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_transformation_output", label: "has transformation outputs", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_trigger", label: "has triggers", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_trigger_table", label: "has trigger tables", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_user_activity", label: "has user activity", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_workspace", label: "has workspaces", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_workspace_event", label: "has workspace events", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_file_event", label: "has file events", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_data_app", label: "has data apps", type: "one-to-many" },
    { from: "kbc_project", to: "kbc_data_app_params_event", label: "has data app events", type: "one-to-many" },

    // Branch relationships
    { from: "kbc_branch", to: "kbc_bucket_snapshot", label: "has bucket snapshots", type: "one-to-many" },
    { from: "kbc_branch", to: "kbc_component_configuration", label: "has configurations", type: "one-to-many" },
    { from: "kbc_branch", to: "kbc_component_configuration_version", label: "has config versions", type: "one-to-many" },
    { from: "kbc_branch", to: "kbc_job", label: "has jobs", type: "one-to-many" },
    { from: "kbc_branch", to: "kbc_bucket", label: "has buckets", type: "one-to-many" },

    // Component configuration relationships
    { from: "kbc_component_configuration", to: "kbc_component_configuration_version", label: "has versions", type: "one-to-many" },
    { from: "kbc_component_configuration", to: "kbc_component_configuration_row", label: "has rows", type: "one-to-many" },
    { from: "kbc_component_configuration", to: "kbc_job", label: "runs jobs", type: "one-to-many" },
    { from: "kbc_component_configuration", to: "kbc_flow_phase", label: "has phases", type: "one-to-many" },
    { from: "kbc_component_configuration", to: "kbc_flow_task", label: "has tasks", type: "one-to-many" },
    { from: "kbc_component_configuration", to: "kbc_notification_subscription", label: "has notifications", type: "one-to-many" },
    { from: "kbc_component_configuration", to: "kbc_schedule", label: "has schedules", type: "one-to-many" },
    { from: "kbc_component_configuration", to: "kbc_trigger", label: "has triggers", type: "one-to-many" },
    { from: "kbc_component_configuration", to: "kbc_transformation_code", label: "has code", type: "one-to-many" },
    { from: "kbc_component_configuration", to: "kbc_transformation_input", label: "has inputs", type: "one-to-many" },
    { from: "kbc_component_configuration", to: "kbc_transformation_output", label: "has outputs", type: "one-to-many" },
    { from: "kbc_component_configuration", to: "kbc_data_app", label: "has data app", type: "one-to-many" },

    // Flow phase -> task
    { from: "kbc_flow_phase", to: "kbc_flow_task", label: "has tasks", type: "one-to-many" },

    // Job -> input/output tables
    { from: "kbc_job", to: "kbc_job_input_table", label: "reads tables", type: "one-to-many" },
    { from: "kbc_job", to: "kbc_job_output_table", label: "writes tables", type: "one-to-many" },

    // Bucket -> table
    { from: "kbc_bucket", to: "kbc_table", label: "contains tables", type: "one-to-many" },

    // Table relationships
    { from: "kbc_table", to: "kbc_column", label: "has columns", type: "one-to-many" },
    { from: "kbc_table", to: "kbc_table_metadata", label: "has metadata", type: "one-to-many" },
    { from: "kbc_table", to: "kbc_table_event", label: "has events", type: "one-to-many" },
    { from: "kbc_table", to: "kbc_job_input_table", label: "used as input", type: "one-to-many" },
    { from: "kbc_table", to: "kbc_job_output_table", label: "used as output", type: "one-to-many" },
    { from: "kbc_table", to: "kbc_trigger_table", label: "triggers", type: "one-to-many" },

    // Column -> metadata
    { from: "kbc_column", to: "kbc_column_metadata", label: "has metadata", type: "one-to-many" },

    // Token relationships
    { from: "kbc_token", to: "kbc_token_event", label: "has events", type: "one-to-many" },
    { from: "kbc_token", to: "kbc_schedule", label: "runs schedules", type: "one-to-many" },
    { from: "kbc_token", to: "kbc_table_event", label: "creates events", type: "one-to-many" },
    { from: "kbc_token", to: "kbc_workspace_event", label: "creates events", type: "one-to-many" },
    { from: "kbc_token", to: "kbc_file_event", label: "creates events", type: "one-to-many" },
    { from: "kbc_token", to: "kbc_workspace", label: "creates workspaces", type: "one-to-many" },
    { from: "kbc_token", to: "kbc_trigger", label: "runs/creates triggers", type: "one-to-many" },
    { from: "kbc_token", to: "kbc_data_app_params_event", label: "creates events", type: "one-to-many" },
    { from: "kbc_token", to: "kbc_token", label: "creates token", type: "one-to-many" },

    // Trigger -> trigger table
    { from: "kbc_trigger", to: "kbc_trigger_table", label: "watches tables", type: "one-to-many" },

    // Transformation input -> columns
    { from: "kbc_transformation_input", to: "kbc_transformation_input_column", label: "has columns", type: "one-to-many" },

    // Workspace -> events
    { from: "kbc_workspace", to: "kbc_workspace_event", label: "has events", type: "one-to-many" },

    // Data app relationships
    { from: "kbc_data_app", to: "kbc_data_app_params_event", label: "has events", type: "one-to-many" },
    { from: "kbc_data_app", to: "kbc_table_event", label: "has events", type: "one-to-many" },

    // Usage metric relationships
    { from: "usage_metric", to: "contract_limit_monthly", label: "has limits", type: "one-to-many" },
    { from: "usage_metric", to: "kbc_usage_metrics_values", label: "has values", type: "one-to-many" }
  ]
};
