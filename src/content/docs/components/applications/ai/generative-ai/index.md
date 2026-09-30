---
title: Generative AI
description: The Generative AI application allows you to query both OpenAI and Azure OpenAI models using data from your Keboola project.
slug: 'components/applications/ai/generative-ai'
redirect_from:
    - /components/applications/ai/open-ai/
---



:::caution[Beta]
The Generative AI application is in beta.
:::

The Generative AI application lets you query large language models using data from your Keboola project. Five providers are available:

- [OpenAI](https://platform.openai.com/docs)
- [Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-services/openai/overview)
- [Anthropic](https://docs.anthropic.com/)
- [Hugging Face](https://huggingface.co/docs/inference-providers) — also needs an **Endpoint URL** on each row
- Google — available on the US stack only

## Create New Configuration

[Set up a new configuration](/components/#creating-component-configuration) for the **Generative AI** application.

:::note
Look for **Generative AI**, not "OpenAI". The older **OpenAI** application is deprecated and no longer appears in the new-component list; if you have an existing OpenAI configuration, it keeps working, but new configurations are created from **Generative AI**.
:::

Select your provider in the **AI Service Provider** field, then authenticate.

### OpenAI Service Authentication

1. Obtain your API key from the [OpenAI platform settings](https://platform.openai.com/account/api-keys).
2. Enter your API key into the **API Key** field within the **Data Source Configuration** window.

### Azure OpenAI Service Authentication

1. Obtain your API key from your Azure OpenAI resource — see [Create and deploy an Azure OpenAI resource](https://learn.microsoft.com/en-us/azure/foundry-classic/openai/how-to/create-resource?pivots=web-portal), which covers retrieving the key and endpoint.
2. Enter your API key into the **API Key** field within the **Data Source Configuration** window.
3. Fill in **API Base**, which should resemble `https://YOUR_RESOURCE_NAME.openai.azure.com/`.
4. Fill in **Deployment ID** — the name you gave the model deployment. <!-- VERIFY(owner): Microsoft's docs now route deployments through the Foundry portal (ai.azure.com → Deployments), not "Azure Portal → Azure OpenAI → Model deployments" as this page previously said. Confirm the current path before restating a click-path here. -->
5. Fill in **API Version**. For the available versions, see the [Azure OpenAI REST API reference](https://learn.microsoft.com/en-us/azure/ai-services/openai/reference?WT.mc_id=AZ-MVP-5004796).

Upon completing these steps, click the **Add Row** button and provide a name for the row configuration (this is solely for identification).

### Row Configuration

1. Click the **List models** button to view the available models. Subsequently, choose your desired model in the **Model** field.
2. You can either stick with the default model settings or customize them in the **Model Options** section. **Maximum token spend (Optional)** caps what a single run may consume.
3. In the **Prompt Templates** section, pick a **Prompt Template** to load it, then copy it into the **Prompt** field as a starting point.
4. The **Prompt** field determines the prompt and data input format. Use the placeholder [[INPUT_COLUMN]] to reference an input column. Ensure your input table includes the mentioned column.
5. In the **Destination** section, select a name for your Storage table. Optionally, you can configure incremental load settings. If primary keys are designated, rows in the destination table will be updated. Without primary keys, new rows will be added.
