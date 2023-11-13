---
title: Generative AI
permalink: /components/applications/ai/generative-ai/
redirect_from:
    - /components/applications/ai/open-ai/
---

* TOC
{:toc}

The Generative AI application allows you to query both [OpenAI](https://platform.openai.com/docs) and [Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-services/openai/overview) models using data from your Keboola Connection project.

## Create New Configuration

[Set up a new configuration](/components/#creating-component-configuration) for the **OpenAI** application.

### OpenAI Service Authentication

Retrieve your API key from the Azure Portal. Follow the steps provided in the [Azure OpenAI quickstart guide](https://learn.microsoft.com/cs-cz/azure/ai-services/openai/quickstart?tabs=command-line&pivots=programming-language-python) for guidance.

### Azure OpenAI Service Authentication

1. For Azure OpenAI, obtain your API key from the [OpenAI platform settings](https://platform.openai.com/account/api-keys). 
2. Enter your API key into the **API Key** field within the **Data Source Configuration** window.
3. Specify the API Base URL, which should resemble: `https://YOUR_RESOURCE_NAME.openai.azure.com/`
4. Input the Deployment ID of your model, which can be located at: Azure Portal -> Azure Open-AI -> Model Deployments.
5. Specify the API version you intend to use. For more details, refer to the [Azure OpenAI documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/reference?WT.mc_id=AZ-MVP-5004796).

Upon completeing these steps, click the **Add Row** button and provide a name for the row configuration (this is solely for identification).

### Row Configuration

1. Click the **List Models** button to view the available models. Subsequently, choose your desired model in the **Model** field.
2. You can either stick with the default model settings or customize them in the **Model Options** section.
3. Consider the **Prompt Template Sync Action** as a template when crafting your prompts.
4. The **Prompt** field determines the prompt and data input format. Use the placeholder [[INPUT_COLUMN]] to reference an input column. Ensure your input table includes the mentioned column.
5. In the **Destination** section, select a name for your Storage table. Optionally, you can configure incremental load settings. If primary keys are designated, rows in the destination table will be updated. Without primary keys, new rows will be added.
