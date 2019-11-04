---
title: Using Binary Files
permalink: /transformations/r/binary/
redirect_from:
    - /manipulation/transformations/r/binary/

---

* TOC
{:toc}

Inside an R transformation, pre-computed models can be used. These models of your data behaviour are great for predictions, for example.
The following are some of the reasons for using a pre-computed model inside an R transformation:

- Too many resources are required to compute the model, memory-wise and time-wise, and it is therefore impractical to compute it inside a (daily) business transformation.
- The model requires manual action; either its creation requires specially treated data (cleaned and validated),
or, you want to verify the results before using them in production.
- The model is provided by a 3rd party.

In either case, it is possible to use a pre-computed model in an R transformation using standard R `save()` and `load()` functions. 
You can also [download a sample package](/transformations/r/data.zip) 
for [local development](/transformations/r/#development-tutorial). 

## Prepare
To show you how it works, let's use an example in which we have a `cashier-data` table with the following data 
([full table](/transformations/r/cashier-data.csv)):

| number_of_items  |  time_spent_in_shop   |  ...  |
|------------------|-----------------------|-------|
|  11              |  452                  |       |
|  27              |  3006                 |       |
|  110             |  7456                 |       |
|  ...             |                       |       |
 
The table contains some observed values of customers who visited the shop. Now, let's find out how much time 
a customer with 40 items in their basket will spend in the shop. Create another table (`cashier-data-predict`) like the following ([full table](/transformations/r/cashier-data-predict.csv)):

| number_of_items  |
|------------------|
|  40              |
|  ...             |

Only the second table will be used in the actual R transformation. Upload that table to your **Storage**. 


## Step 1 - Create the model

First, it is necessary to get a file with the R model. To create and save a very simple model, use a script similar to the following one. 
It is supposed to be executed **outside KBC**, for example on your local machine.

{% highlight r %}
data <- read.csv("cashier-data.csv")
lm <- lm(time_spent_in_shop ~ number_of_items, data)
save(lm, file = "time_model.rda")
{% endhighlight %}

After executing the script, you get the `time_model.rda` binary file with a very simple model of dependency 
of the **time_spent_in_shop** column on the **number_of_items** column in the data 
([cashier-data.csv](/transformations/r/cashier-data.csv)):
 
## Step 2 - Save the model to KBC

The second step is to save the model file to KBC. For that go to **Storage** -- [**File uploads**](/storage/file-uploads/) and upload the obtained file (`time_model.rda`), 
the file should be marked as *permanent* and a tag must be assigned to it.

{: .image-popup}
![Screenshot - Upload file](/transformations/r/file-import.png)

In the sample above, we decided to give the file a tag `predictionModel`.

## Step 3 - Create R Transformation

Finally, write the actual transformation. Create an R transformation, set the input and output mapping, 
and add the (`predictionModel`) tag to select stored files.

{: .image-popup}
![Screenshot - Transformation Setup](/transformations/r/binary-transformation.png)

**Important:** In the transformation, you reference only the file tag, not the actual uploaded file. 
The rules for transforming a tag to a file are following: 

- Only a single file will always be present in the R transformation (removes ambiguity).
- If multiple files with the same tag are present in File uploads, only the latest one will be copied to the R 
transformation (it allows easy updates; if you need to rollback, just delete the new file, or re-upload an old one).
- If you need multiple files in your R transformation, each one must have a different tag (it forces clarity).
- If there is no file with a given tag in File uploads, the transformation will fail.

The following sample script demonstrates the use of the pre-computed model. The `lm` variable is loaded from the `predictionModel` file.

{% highlight r %}
data <- read.csv(file = "in/tables/cashier-data-predict.csv");

# Load the pre-computed model
load("in/user/predictionModel")

# Predict unknown values
predicted <- predict(lm, data, interval = "confidence")

# Write the results
df <- round(data.frame(data, predicted))
write.csv(df, file = "out/tables/data-predicted.csv", row.names = FALSE)
{% endhighlight %}

The result table will be stored according to the output mapping setting and will look like this:

| number_of_items  |  fit  |  lwr  |  upr  |
|------------------|-------|-------|-------|
|  40              |  3481 |  3168 |  3795 |
|  ...             |       |       |       |

This contains the predicted value and lower and upper bound of the confidence interval. The predicted value was 
obtained from the (very simple linear) model that was created outside KBC in the first step. This technique with 
binary files can also be used for other purposes as they can contain virtually any R code or data.

## Running & Debugging Locally
When attempting to run the above [transformation locally](/transformations/r/#development-tutorial),
make sure to

- Put the R code in the working directory in a file, for example, `script.R`.
- Download the table `in.c-r-transformations.cashier-data-predict` from the input mapping and place it inside the `in/tables` 
subdirectory of the working directory into the `cashier-data-predict.csv` file.
- Download a file with the `predictionModel` tag from Storage File Uploads and place that
file inside the `in/user` subdirectory of the working directory in the `predictionModel` file. Make sure the
 downloaded file has **no extension**.
- Store the result R `data.frame` inside the `out/tables` subdirectory in `data-predicted.csv`.
