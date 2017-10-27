---
title: R Transformation
permalink: /manipulation/transformations/r/
---

* TOC
{:toc}

[R](https://www.r-project.org/about.html) is designed for **advanced statistical computations**.
Apart from ready-to-use implementations of state-of-the-art algorithms, R's other great assets are vector and matrix 
computations. R transformations complement Python and SQL transformations where computations or 
other operations are too difficult. Common data operations like joining, sorting, and grouping, however, are still 
easier and faster to do in [SQL Transformations](/manipulation/transformations/).

## Environment
The R script is running in an isolated [Docker environment](https://developers.keboola.com/integrate/docker-bundle/).
The current R version is R **3.4.2**.

### Memory and Processing Constraints

The Docker container running the R transformation has allocated 8GB of memory and the maximum running time is 6 hours.

### File locations
The R script itself will be compiled to `/data/script.R`. To access input and output tables, use relative 
(`in/tables/file.csv`, `out/tables/file.csv`), or absolute (`/data/in/tables/file.csv`, `/data/out/tables/file.csv`) paths. 
To access downloaded files, use the `in/user/tag` or `/data/in/user/tag` path. If you want to dig really deep, have a look 
at the full [Common Interface Specification](https://developers.keboola.com/extend/common-interface/). Temporary files can 
be written to the `/tmp/` folder. Do not use the `/data/` folder for files you do not wish to exchange with KBC.

## R Script Requirements
The R script to be run within our environment must meet the following requirements:

### Packages
The R transformation can use any package available on
[CRAN](https://cloud.r-project.org/web/packages/available_packages_by_name.html). In order for a package and 
its dependencies to be automatically loaded and installed, list its name in the package section. Using `library()` 
for loading is not necessary then.

{: .image-popup}
![Screenshot - Package Configuration](/manipulation/transformations/r/packages.png)

The latest versions of packages are always installed.

### CSV format
Tables from Storage are imported to the R script from CSV files. The CSV files can be read by standard R functions.
Generally, the table can be read with default R settings. In case R gets confused, use the exact format
specification `sep=",", quote="\""`. For example:

{% highlight r %}
data <- read.csv("in/tables/in.csv", sep=",", quote="\"")
{% endhighlight %}

### Row Index in Output Tables
Do not use the row index in the output table (`row.names=FALSE`).

{% highlight r %}
write.csv(data, file="out/tables/out.csv", row.names=FALSE)
{% endhighlight %}

The row index produces a new unnamed column in the CSV file which cannot be imported to [Storage](/storage/).

### Errors and Warnings
We have set up our environment to be a little zealous; all warnings are converted to errors and they cause the 
transformation to be unsuccessful. If you have a piece of code in your transformation which may emit warnings
and you really want to ignore them, wrap the code in a `tryCatch` call:

{% highlight r %}
tryCatch(
    { ... some code ... },
    warning = function(w) {}
)
{% endhighlight %}

## Development Tutorial

We recommend that you create an [RStudio sandbox](/manipulation/transformations/sandbox/#rstudio-sandbox) with the same 
input mapping your transformation will use. This is the fastest way to develop your transformation code.

**Tip:** Limit the number of rows you read in from the CSV files:

{% highlight r %}
mydata <- read.csv("in/tables/mydata", nrows=500)
{% endhighlight %}

This will help you catch annoying issues without having to process all data. 

You can also develop and debug R transformations on your local machine. 
To do so, [install R](https://cloud.r-project.org/), preferably the same [version as us](#environment).
It is also helpful to use an IDE, such as [RStudio](https://www.rstudio.com/products/rstudio/#Desktop).

To simulate the input and output mapping, all you need to do is create the right directories with the right files.
The following image shows the directory structure:

{: .image-popup}
![Screenshot - Data folder structure](/manipulation/transformations/r/tree.png)

The script itself is expected to be in the `data` directory; its name is arbitrary. It is possible to use relative directories,
so that you can move the script to a KBC transformation with no changes. To develop a Python transformation which takes
a [sample CSV file](/manipulation/transformations/r/source.csv) locally, take the following steps:

- Put the R code into a file, for instance, script.R in the working directory.
- Put all tables from the input mapping inside the `in/tables` subdirectory of the working directory.
- Place the binary files (if using any) inside the `in/user` subdirectory of the working directory, and make sure 
that their name is without any extension.
- Store the result CSV files inside the `out/tables` subdirectory.

Use this sample script:
{% highlight r %}
data <- read.csv(file = "in/tables/source.csv");

df <- data.frame(
  col1 = paste0(data$first, 'ping'),
  col2 = data$second * 42
)
write.csv(df, file = "out/tables/result.csv", row.names = FALSE)
{% endhighlight %}

A complete example of the above is attached below in [data.zip](/manipulation/transformations/r/data.zip). 
Download it and test the script in your local R installation. The `result.csv` output file will be created. 
This script can be used in your transformations without any modifications. 
All you need to do is

- upload the [sample CSV file](/manipulation/transformations/r/source.csv) into your Storage,
- set the input mapping from that table to `source.csv` (expected by the R script),
- set the output mapping from `result.csv` (produced by the R script) to a new table in your Storage,
- copy & paste the script into the transformation, and finally,
- run the transformation.

{: .image-popup}
![Screenshot - Sample Input Output Mapping](/manipulation/transformations/python/sample-io.png)

### Events and Output
It is possible to output informational and debug messages from the R script simply by printing them out. 
The following R script:

{% highlight r %}

print('doing something')
Sys.sleep(3)
print('doing something else')
Sys.sleep(3)
write('still doing something', stdout())
Sys.sleep(3)
write('error message', stderr())
Sys.sleep(3)
app$logInfo("information")
Sys.sleep(3)
app$logError("error")
Sys.sleep(3)
TRUE
{% endhighlight %}

produces the following events in the transformation job:

![Screenshot - Script Events](/manipulation/transformations/r/events-output.png)

The `app$logInfo` and `app$logError` functions are internally available; they can be useful if you need to know the precise 
server time of when an event occurred. The standard event timestamp in job events is the time when the event was received 
converted to the local time-zone.

### Going Further
The above steps are usually sufficient for daily development and debugging of moderately complex R transformations.
Although they do not reproduce the transformation execution environment exactly. To create a development environment
with the exact same configuration as the transformation environment, use [our Docker image](https://developers.keboola.com/extend/docker/running/#running-transformations).

## Examples
There are more in-depth examples dealing with

- [array splitting](/manipulation/transformations/r/array-splitter/),
- [plotting charts & graphs](/manipulation/transformations/r/plots/), and
- [using trained models and binary files](/manipulation/transformations/r/binary/).
