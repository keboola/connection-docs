---
title: R Transformation
permalink: /manipulation/transformations/r/
---

* TOC
{:toc}

[R](https://www.r-project.org/about.html) is designed for advanced statistical computations.
Apart from ready-to-use implementations of state-of-the-art algorithms, another great asset of R are vector and matrix computations. 
R transformations complement Python and SQL transformations (MySQL or Redshift) where computations or other operations are too difficult. 
Common operations with data like joining, sorting, and grouping are still easier and faster to do in [SQL Transformations](/manipulation/transformations/).

## Environment
The R script is running in an isolated [Docker environment](https://developers.keboola.com/overview/docker-bundle/).
The current R version is R 3.2.1.

### Memory
So far, we have allocated 8GB of memory to the Docker instance running the R transformation.
We will be increasing this limit along the way, but there will always be a defined memory constraint.

### File locations
The R script itself will be compiled to `/data/script.R`. To access input and output tables, use relative (`in/tables/file.csv`, `out/tables/file.csv`), 
or absolute (`/data/in/tables/file.csv`, `/data/out/tables/file.csv`) paths. To access downloaded files, use `in/user/tag` or `/data/in/user/tag` path. 
If you want to dig really deep, have a look at the full [Common Interface Specification](https://developers.keboola.com/extend/common-interface/).
Temporary files can be written to the `/tmp/` folder. Do not use the `/data/` folder for
files you do not wish to exchange with KBC.

## R Script Requirements
The R script to be run within our environment must meet the following requirements:

### Packages
The R transformation can use any package available on
[CRAN](https://www.cran.r-project.org/web/packages/available_packages_by_name.html). To install the package, list
its name in the package section that will automatically install the package and its dependencies.
The package will be loaded automatically as well, so you do not have to load using `library()`. Even though it does not hurt.

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

### Row index in output tables
Do not use the row index in the output table (`row.names=FALSE`).

{% highlight r %}
write.csv(data, file="out/tables/out.csv", row.names=FALSE)
{% endhighlight %}

The row index produces a new unnamed column in the CSV file which cannot be imported to [Storage](/storage/).

### Errors and warnings
We have set up our environment to be a little zealous; all warnings are converted to errors and they cause the transformation to be unsuccessful. 
If you have a piece of code in your transformation which may emit warnings, and you really want to ignore them, wrap the code in a `tryCatch` call:

{% highlight r %}
tryCatch(
    { ... some code ... },
    warning = function(w) {}
)
{% endhighlight %}

## Development Tutorial
To develop and debug R transformations, you can replicate the execution environment on your local machine.
To do so, you need to have [R installed](https://cloud.r-project.org/), preferably the same version as us. 
It is also helpful to use an IDE, such as [RStudio](https://www.rstudio.com/products/rstudio/#Desktop).

To simulate the input and output mapping, all you need to do is create the right directories with the right files.
The following image shows the directory structure:

{: .image-popup}
![Screenshot - Data folder structure](/manipulation/transformations/r/tree.png)

The script itself is expected to be in the `data` directory; its name is arbitrary. It is possible to use relative directories,
so that you can move the script to KBC transformation with no changes. To develop a Python transformation which takes
 a [sample CSV file](/manipulation/transformations/r/source.csv) locally, take the following steps:

- Put the R code into a file, for instance script.R, in the working directory.
- Put all tables from the input mapping inside the `in/tables` subdirectory of the working directory.
- If using any binary files, place them inside the `in/user` subdirectory of the working directory, and make sure that their name is without any extension.
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

A complete example of the above is attached below in [data.zip](/manipulation/transformations/r/data.zip). Download it and test the script in your local R installation. 
The `result.csv` output file will be created. This script can be used in your transformations without any modifications. 
All you need to do is

- upload the [sample CSV file](/manipulation/transformations/r/source.csv) into your Storage,
- set the input mapping from that table to `source.csv` (expected by the R script),
- set the output mapping from `result.csv` (produced by the R script) to a new table in your Storage,
- copy & paste the script into the transformation, and, finally,
- run the transformation.

{: .image-popup}
![Screenshot - Sample Input Output Mapping](/manipulation/transformations/python/sample-io.png)

### Going further
The above steps are usually sufficient for daily development and debugging of moderately complex R transformations,
although they do not reproduce the transformation execution environment exactly. To create a development environment
with the exact same configuration as the transformation environment, use [our Docker image](https://developers.keboola.com/extend/docker/running/#running-transformations).

## Examples
There are more in-depth examples dealing with

- [array splitting](/manipulation/transformations/r/array-splitter/),
- [plotting charts & graphs](/manipulation/transformations/r/plots/), and
- [using trained models and binary files](/manipulation/transformations/r/binary/).
