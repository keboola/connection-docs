---
title: dbt transformation
permalink: /transformations/dbt/transformation/
---

## Configuration

![](imgs/2776563892.jpeg){: width="100%" }

### dbt Project Repository

First you must define a repository by specifying the URL (ending with GIT) and entering the access credentials if required.

![](imgs/2776563898.png){: width="100%" }

After saving a configuration, click **Load branches** to select the desired branch. Do not forget to click **Save**.

![](imgs/2776563904.png){: width="100%" }

### Execution Steps

![](imgs/2776563910.png){: width="100%" }

Select the desired execution steps and rearrange them if needed. If there are other steps you require and you don’t see them, please send us a feature suggestion through the help icon.

### Execution Parameters

You can define specific [run parameters and node selectors](https://docs.getdbt.com/reference/node-selection/syntax). In a nutshell, it is everything after `--select`. Please refer to the official [dbt core documentation](https://docs.getdbt.com/reference/node-selection/syntax).

![](imgs/2776563916.png){: width="100%" }

You can also specify a path, tags, and specific models.

![](imgs/2776563922.png){: width="100%" }

*Note: The default thread level for the Keboola dbt transformation is set to 4. You can override this by using the `--threads X` parameter in the Execution Parameters.*

### Output Mapping (Keboola Storage Component Only)

This is a specific configuration needed for the Keboola dbt component. Define which tables will be imported within storage. This configuration uses a standard output mapping UI elements with configuration options, such as incremental or full load, filters, etc.

![](imgs/2776563928.png){: width="100%" }

### Database Connection (Remote DWH Components Only)

![](imgs/2776563934.png){: width="100%" }

Configuration parameters expose typical dbt connection configurations, adjusted to the specific adapter settings. To validate a connection, run a debug job from the right menu.

*Note: You can control threads for the execution as part of these settings.*

## Run Debug Job

![](imgs/2776563940.png){: width="50%" }

To test whether you are using the correct credentials and the overall project is correct, you can run a debug job. This is the same as running `dbt debug` from the command prompt.

The **Run debug** button will create a separate job with standard logging, exposing the results of the dbt debug command:

![](imgs/2776563946.png){: width="100%" }

## Manually Triggering dbt Transformation

When you run a dbt transformation manually, a new job is being triggered with standard logging and storing information such as:

*   person (token) triggered job

*   start, end and duration of the job

*   job parameters

*   component execution log

*   dbt deps and repository information

*   full dbt log for all steps defined

*   storage output (Keboola dbt)

*   record of producing and storing artifacts


![](imgs/2776563952.png){: width="100%" }

You can also access all configuration jobs from the configuration screen and the **Jobs** menu section.

![](imgs/2776563958.png){: width="100%" }

![](imgs/2776563964.png){: width="50%" }

## Discover

The **Discover** tab is designed to provide more information about the run. Keboola aims to expand the insights on this tab to provide more information to you. Currently, it provides the timeline designed to visually display the duration of each model build.

![](imgs/2777448784.png){: width="100%" }

## dbt Docs

When you press **dbt Project documentation**, the job will generate the necessary files within artifacts to power documentation. dbt docs are then accessible on the button from the main configuration screen.

![](imgs/2777710870.png){: width="50%" }

The button performs a synchronous action to generate docs in the popup:

![](imgs/2776269049.png){: width="100%" }
