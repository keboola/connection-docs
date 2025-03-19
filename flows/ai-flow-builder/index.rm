---
title: AI Flow Builder
permalink: /ai-flow-builder/
---

* TOC
{:toc}

# AI Flow Builder

AI Flow Builder is an experimental AI assistant that helps you create a simple 3-step ETL flow from end to end based on your intent. It is available exclusively in **Pay-As-You-Go** projects, with the primary purpose of jumpstarting the first Flow creation.

This version is offered **free of charge** as it is subject to change, and we plan to expand its functionalities in the future.

## Functionality

The AI-assisted Flow Builder process is divided into **three logical phases**.

### 1. Defining the Flow Structure Based on Your Intent
You provide an intent, e.g., _"I would like to analyze my marketing campaigns,"_ and the assistant will ask additional questions about the data sources and desired destination to build the Flow structure. Once you confirm the suggested sequence of steps (components), the Flow is created with **empty configurations**, and the configuration process can begin.

### 2. Flow Configuration
At this stage, you gradually configure the components, starting with the first phase of the Flow (**Extract**). When you click on a component configuration to open the **configuration detail view**, the assistant will guide you through the setup.

Once the component configuration is completed, you click the **"BACK TO FLOW"** button, and the component execution starts automatically. During this period, you can **monitor the progress** or proceed with configuring the remaining components within the phase.

If any errors occur, you will be notified, and navigating to the failed component configuration will prompt the assistant to help resolve the issue.

**Important:** The AI Flow Builder **does not allow** proceeding to the next Flow phase until all components are fully configured and their execution is completed successfully (indicated by a **green checkmark**).

### 3. Previewing Results
The output of a component can be previewed by clicking the **"EXPLORE DATA"** icon located at the bottom-right corner of the component icon.

### AI Flow Builder Drafts
You may choose to leave the AI Flow Builder before completing the Flow configuration. In such cases, the Flow is labeled as a **"DRAFT"**, allowing you to return later and finish the setup.

## Transformation Phase
Once the **Extract** phase is completed, you can proceed to configure the **SQL transformation**. All data from the previous phase's outputs will be **automatically available** in the Transformation input mapping.

The assistant will guide you through the **SQL code creation** process, allowing you to ask additional questions and test the generated query until you are satisfied.

Once the transformation is completed, the outputs of this phase will be **automatically used** in the **destination phase** if configured.

## Destination (Load) Phase
If a **destination component** was specified during the initial Flow setup, it will be included in the Flow. The setup process for this phase is similar to previous phases—you configure the component, and once done, it will execute when you return to the Flow.

## Flow Publishing
Once **all jobs** in all Flow phases are successfully completed, you can click the **"PUBLISH"** button. This finalizes the Flow, and you are redirected to the standard Flow Builder, where you can set up **scheduling** or make additional modifications as needed.

**Important:** Once the Flow is published, the **AI Flow Builder can no longer be used** for that Flow.

## Limitations

### 1 **Only 3-Step (Phase) Flows Are Supported**
- The AI Flow Builder supports Flows with up to **three phases**: **Extract, Transform, and Load**.
- The **Extract** phase may contain **multiple connectors**.
- The **Transform** phase supports **only one SQL transformation configuration**.
- The **Load** phase is **optional** and contains a destination component. If omitted, the transformed data will be stored in **Keboola Storage**.
- After publishing the AI-generated Flow, you can freely edit it using the **standard Flow Builder**, adding additional phases or configurations.

### 2 **Only AI-Assisted SQL Transformations Are Supported**
- In the **Data Processing phase**, only **AI-assisted SQL transformations** are currently supported.

### 3 **AI Flow Builder Cannot Be Used on Existing Flows**
- The AI Flow Builder is designed to create new Flows **from scratch**. It **cannot** be used on existing Flows.

### 4 **Scheduling Can Be Set Up Only After Publishing**
- Flow scheduling can be configured **only after** the AI Flow Builder process is **completed and published** as a standard Flow.

### 5 **Flow Structure Cannot Be Changed After Confirmation**
- Once you **confirm the Flow structure and components**, **it cannot be modified later** within the AI Flow Builder. Any further modifications must be made in the standard Flow Builder.
