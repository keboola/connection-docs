---
title: Using binary files
permalink: /manipulation/transformations/r/binary/
---

* TOC
{:toc}

It is possible to use pre-computed models (models of some kind of behaviour in your data which may be used e.g for predictions)
inside an R transformation. There may be multiple reasons for using a pre-computed model inside an R transformation e.g.:

- it takes too much resources (time/memory) to compute the model and it's therefore impractical to compute it inside a 
(daily) business transformation
- the model requires manual action, it can be either that its creation requires specially treated data (cleaned, validated)
or that you'd like the results verified before using them in production
- the model is provided by a 3rd party

In either case it is possible to use a pre-computed model in R transformation using standard R function `save()` and `load()`. 
You can also [download a sample package](/manipulation/transformations/r/data.zip) 
for [local development](/manipulation/transformations/r/#development-tutorial). 

## Prepare
To demonstrate the use, we'll use an example in which we have a table cashier-data with the following data 
([full table](/manipulation/transformations/r/cashier-data.csv)):

| number_of_items  |  time_spent_in_shop   |  ...  |
|------------------|-----------------------|-------|
|  11              |  452                  |       |
|  27              |  3006                 |       |
|  110             |  7456                 |       |
|  ...             |                       |       |
{: .table}
 
The table contains some observed values for customers who visited the shop. Now we'd like to know how much time a 
customer with 40 items in his basket will spent in the shop. We therefore create another table 
(cashier-data-predict) like the following ([full table](/manipulation/transformations/r/cashier-data-predict.csv)):

| number_of_items  |
|------------------|
|  40              |
|  ...             |
{: .table}

Only the second table will be used in the actual R transformation. Upload that table to your **Storage**. 


## Step 1 - Create the model

First it is necessary to obtain a file with the R model. To create and save a very simple model you can 
use a script similar to this. This script is supposed to be executed **outside KBC**, e.g. on your local machine.

{% highlight r %}
data <- read.csv("cashier-data.csv")
lm <- lm(time_spent_in_shop ~ number_of_items, data)
save(lm, file = "time_model.rda")
{% endhighlight %}

When you execute the script, you obtain a binary file `time_model.rda` with very simple model of dependency 
of the column **time_spent_in_shop** on **number_of_items** column in the data 
([cashiser-data.csv](/manipulation/transformations/r/cashier-data.csv)):
 
## Step 2 - Save the model to KBC

Second step is to save the model file to KBC. For that go to **Storage** - 
[**File uploads**](/storage/file-uploads/) and upload the 
obtained file (`time_model.rda`), the file should be marked as *permanent* and a tag must be assigned to it.

{: .image-popup}
![Screenshot - Upload file](/manipulation/transformations/r/file-import.png)

In the sample above, we decided to give the file a tag `predictionModel`.

## Step 3 - Create R Transformation

Last step is to write an actual transformation. Create an R transformation set the input and output mapping 
and add a tag (`predictionModel`) to select stored files.

{: .image-popup}
![Screenshot - Transformation Setup](/manipulation/transformations/r/binary-transformation.png)

Note the in the transformation you reference only the file tag, not the actual uploaded file. 
The rules for transforming tag to file are following: 

- Only a single file will always be present in the R transformation (removes ambiguity).
- If multiple files with the same tag are present in file uploads, only the latest one will be copied to R 
transformation (allows easy updates; if you need to rollback, just delete the new file, or re-upload an old one).
- If you need multiple files in your R transformation, each one must have different tag (forces clarity).
- If there is no file with the given tag in file uploads, the transformation will fail.

The following sample script demonstrates the use of the pre-computed model. Variable
`lm` is loaded from the `predictionModel` file.

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

The result table will be stored according to output mapping setting and will look like this;

| number_of_items  |  fit  |  lwr  |  upr  |
|------------------|-------|-------|-------|
|  40              |  3481 |  3168 |  3795 |
|  ...             |       |       |       |
{: .table}

This contains the predicted value and lower and upper bound of the confidence interval. The predicted value was 
obtained from the (very simple linear) model that was created outside KBC in the first step. This technique with 
binary files can also be used for other purposes as they can contain virtually any R code or data.

## Running & Debugging Locally
When you attempt to run the above [transformation locally](/manipulation/transformations/r/#development-tutorial)
make sure that you:

- Put the R code in the in working directory in a file, e.g. `script.R`.
- Download the table from input mapping `in.c-r-transformations.cashier-data-predict` and place it inside `in/tables` 
subdirectory of the working directory into file `cashier-data-predict.csv`.
- Download file from Storage File Uploads with the tag `predictionModel` and place that
file inside `in/user` subdirectory of the working directory in file `predictionModel`, make sure that the
 downloaded file has **no extension**.
- Make sure that the result R `data.frame` is stored in inside `out/tables` subdirectory in `data-predicted.csv`.
