---
title: R
permalink: /manipulation/transformations/r/
---

* TOC
{:toc}

[R](https://www.r-project.org/about.html) is a programming language designed for advanced statistical 
computations, it also has plenty of functions for computing and machine learning. R transformations are a 
complement to SQL transformations (MySQL or Redshift) and Python transformations as they can be used to 
perform computations or other operations which are difficult to do in SQL/Python. Apart from having ready to use
implementations of many state of the art algorithms, a great asset of R are vector and matrix computations.
On the other hand it is easier and faster to do common operations with data like joining, sorting, grouping in 
[SQL Transformations](/manipulation/transformations/). 

## Environment
The R script is running in isolated [docker environment](http://developers.keboola.com/overview/docker-bundle/). 
Current R version is R 3.2.1.

### Memory
Currently we've allocated 8GB of memory to the docker instance running the R transformation. 
We'll be increasing this limit along the way, but there will always be a defined memory constraint.

### File locations
The R script itself will be compiled to `/data/script.R`. To access input and output tables you 
can use relative (`in/tables/file.csv`, `out/tables/file.csv`) or absolute 
paths (`/data/in/tables/file.csv`, `/data/out/tables/file.csv`). To access downloaded 
files use `in/user/tag` or `/data/in/user/tag` path. If you want to dig really deep, you 
can have a look at full [Common Interface Specification](http://developers.keboola.com/extend/common-interface/).
If you need to write temporary files, write them to `/tmp/` folder (do not use the `/data/` folder for
files you do not wish to exchange with KBC).

## R script requirements
To run the script within our environment the R script must meet the following requirements.

### Packages
The R transformation can use any package available on 
[CRAN](https://www.cran.r-project.org/web/packages/available_packages_by_name.html). To install the package, list 
the package's name in the packages section, which will automatically install the package and its dependencies. 
The package will also automatically be loaded, so you don't have to load the package using `library()` 
(but it doesn't hurt). 

{: .image-popup}
![Screenshot - Package Configuration](/manipulation/transformations/r/packages.png)

The packages are always installed with their latest versions.

### CSV format
Tables from Storage are imported to R script from CSV files. The CSV files can be read by standard R functions. 
Generally the table can be read with default R settings. In case R gets confused, use the exact format 
specification `sep=",", quote="\""`, eg:

{% highlight r %}
data <- read.csv("in/tables/in.csv", sep=",", quote="\"")
{% endhighlight %}

### Row index in output tables
Do not use the row index in the output table (`row.names=FALSE`).

{% highlight r %}
write.csv(data, file="out/tables/out.csv", row.names=FALSE)
{% endhighlight %}

The row index produces a new unnamed column in the CSV file which cannot be imported to 
[Storage](/storage/).

### Errors & Warnings
We have set up our environment to be a little zealous, so all warnings are converted to errors and
they cause the transformation to be unsuccessful. If you have a piece of code in your transformation which may emit 
warnings and you really want to ignore them, you should wrap the code in a `tryCatch` call:

{% highlight r %}
tryCatch(
    { ... some code ... }, 
    warning = function(w) {}
)
{% endhighlight %}

## Development Tutorial
To develop and debug R transformations, you can replicate the execution environment on your local machine. 
To do so, you need to have [R installed](https://cloud.r-project.org/), preferably in the same version as we 
have. It is also helpful to use an IDE, such as [RStudio](https://www.rstudio.com/products/rstudio/#Desktop).

To simulate input and output mapping, all you need to do is create the right directories with right files. 
The following image shows the directory structure:

{: .image-popup}
![Screenshot - Data folder structure](/manipulation/transformations/r/tree.png)

The script itself is expected to reside in the `data` directory, its name is arbitrary. You can use relative directories, 
so that you can move the script to KBC transformation without any changes.

To replicate the transformation locally, we need to:

- put the R code in the in working directory in a file, e.g. script.R  
- download all tables from input mapping and place them inside `in/tables` subdirectory of the working directory, e.g
download table `in.c-r-transformations.cashier-data-predict` into file `cashier-data-predict.csv` 
- if you use any binary files, then download each file from Storage File Uploads with the specified tag and place that
file inside `in/user` subdirectory of the working directory, make sure that the downloaded file is 
named without any extension, e.g. `predictionModel`
- make sure that the result R `data.frame` is stored in inside `out/tables` subdirectory - e.g. data-predicted.csv.

A finished example of the above is attached below in [data.zip](/manipulation/transformations/r/data.zip) 
(which is the [binary file example](/manipulation/transformations/r/binary-transformation/)). You can download 
the zip file and verify that you can execute it in your local R installation. When the script finishes successfully, it
will create the output file `data-predicted.csv`, you can then use this script in transformations without any modifications.

### Going further
The above steps are usually sufficient for daily development and debugging of moderately complex R transformations 
(although they do not reproduce the transformation execution environment exactly). To create development environment 
which has the exact same configuration as the transformation environment, you can use 
[our docker image](http://developers.keboola.com/extend/docker/running/#running-transformations).

## Examples
There are more in-depth examples dealing with:

- [array splitting](/manipuluation/transfornations/r/array-splitter/)
- [plotting charts & graphs](/manipulation/transformations/r/plots/)
- [using trained models and binary files](/manipulation/transformations/r/binary/)

 