---
title: Orchestration Trigger
description: The Orchestration Trigger application triggers Keboola Conditional Flows and Legacy Flows — typically across different Keboola projects in a Multi-Project…
slug: 'components/applications/triggers/orchestration-trigger-queue-v2'
---



The **Orchestration Trigger** application triggers Keboola [Conditional Flows](/flows/) and Legacy Flows — typically across different Keboola projects in a [Multi-Project Architecture](/catalog/multi-project/) setup.

## Authorization

Authorization is done with a [Keboola Storage API token](/management/project/tokens/) created in the **destination** project (the project where the flow you want to trigger lives). You have two options:

* An API token with full access to all buckets and components.
* A [Limited Access Token](/management/project/tokens/#limited-access-to-components) with access to the Legacy Flow and Conditional Flow components, every component used inside the flow, and the buckets those components interact with.

If you choose the limited token, remember to extend its permissions every time a new component or bucket is added to the flow.

## Configuration

[Create a new configuration](/components/#creating-component-configuration) of the **Orchestration Trigger** application.

![Screenshot - Orchestration Trigger configuration](/components/applications/triggers/orchestration-trigger-queue-v2/config.png)

The configuration has the following parameters:

* **KBC Storage API token** (required) – The Storage API token of the destination project. Treated as a secret.
* **KBC Stack** (required) – The Keboola stack the destination project runs on. Select the matching stack from the list, or pick `Custom Stack` and enter the `{CUSTOM_STACK}` portion of the URL `connection.{CUSTOM_STACK}.keboola.cloud` in the **Custom Stack** field that appears below.
* **Flow ID** (required) – The configuration ID of the Legacy Flow or Conditional Flow to trigger. Use the **RE-LOAD FLOWS** button to populate the picker with flows from the destination project; both Conditional Flows and Legacy Flows are listed.
* **Variables of the flow** – Optional list of `name` / `value` pairs passed as variables into the triggered flow.
* **Wait for job finish and check jobs status** – When checked, this trigger job ends only after the triggered flow finishes (and inherits its status). When unchecked, the trigger job ends as soon as the flow has been started.
* **Fail on Warning** (applies only to Legacy Flows) – Visible only when **Wait for job finish and check jobs status** is enabled. When checked, the trigger job fails if the triggered flow ends with a warning.
* **Trigger flow on failure** – Visible only when **Wait for job finish and check jobs status** is enabled. Enables an additional recovery flow that runs when the main flow does not succeed.
* **Flow on failure settings** – Visible when **Trigger flow on failure** is enabled. Contains:
  * **Flow Location** – `Current Project` runs the recovery flow in the project where this trigger component is configured (using the project's own context). `Destination Project` runs the recovery flow in the same project as the main flow (using the Storage API token configured above).
  * **Flow ID** (required) – The configuration ID of the recovery Legacy Flow or Conditional Flow. Use **RE-LOAD FLOWS** to populate the list; refresh after changing **Flow Location**.
  * **Pass Main Flow Variables** – When checked, the variables defined for the main flow are appended to the recovery flow's variables.
  * **Variables of the flow on failure** – Optional list of `name` / `value` pairs passed into the recovery flow.
* **Trigger Info** – Click **SHOW INFO** to validate the configuration. The action confirms that the Storage API token, stack, and flow IDs are valid and shows which flow (and in which project) will be triggered. When **Store Metadata in configuration** is enabled, the resolved **Project ID**, **Project Name**, and **Orchestration link** are stored in the configuration for quick reference.
