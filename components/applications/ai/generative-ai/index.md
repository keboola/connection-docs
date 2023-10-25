---
title: Generative AI
permalink: /components/applications/ai/generative-ai/
---

* TOC
{:toc}

## The Generative AI Application

The Generative AI application enables you to query the [OpenAI](https://platform.openai.com/docs) and [Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-services/openai/overview) models with data from your Keboola Connection project.

### Create New Configuration

[Create a new configuration](/components/#creating-component-configuration) of the **OpenAI** application.

#### OpenAI Service Authentication

1. Get your API key from the Azure Portal. You can follow the instructions from the [Azure OpenAI quickstart guide](https://learn.microsoft.com/cs-cz/azure/ai-services/openai/quickstart?tabs=command-line&pivots=programming-language-python).

#### Azure OpenAI Service Authentication

1. For Azure OpenAI, obtain your API key from the [OpenAI platform settings](https://platform.openai.com/account/api-keys). 
2. Fill in your API key in the **API Key** field in the **Data Source Configuration** window.
3. Provide the API Base, which should look like: `https://YOUR_RESOURCE_NAME.openai.azure.com/`
4. Fill in the Deployment ID of your model. This can be found at: Azure Portal -> Azure open-ai -> Model deployments.
5. Enter the API Version you wish to use. For reference, consult the [Azure OpenAI documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/reference?WT.mc_id=AZ-MVP-5004796).

After these steps, click the **Add Row** button and select a name for the row configuration. This name is for identification only.

#### Row Configuration

1. To view available models, click the **LIST MODELS** button. Then, select the model you want in the **Model** field.
2. Default model options can be used, or you can customize them in the **Model Options** window.
3. Use can use the **Prompt Template Sync Action** as an inspiration for creating your prompts.
4. The **Prompt** field defines the prompt and data input pattern. Use the placeholder [[INPUT_COLUMN]] to refer to the input column. Ensure the input table contains the referenced column.
5. In the **Destination** window, choose your preferred Storage table name. You also have the option to set incremental load. If primary keys are defined, rows in the destination table will update. If not, new rows will append.
