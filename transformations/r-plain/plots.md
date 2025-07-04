---
title: Plots & Graphs
permalink: /transformations/r-plain/plots/
redirect_from:
    - /manipulation/transformations/r/plots/
    - /transformations/r/plots/

---

* TOC
{:toc}

Generating plots in R is supported through [Storage file uploads](/storage/files/). To upload a plot to Storage,
save the file in the output directory for files (`out/files/`). Each file in that directory will be automatically saved into Storage File Uploads.

To make file handling a bit easier, it is possible to write a *manifest*, which describes the file. This can be used to set *file tags*
and other file upload options. To write the manifest, use the `app$writeFileManifest` function with the following signature:

{% highlight r %}
app$writeFileManifest = function(fileName, fileTags = vector(), isPublic = FALSE, isPermanent = TRUE, notify = FALSE)
{% endhighlight %}

Remember to use the `out/files/` directory for plots. And note that the `rDocker` tag will be automatically added to all files with manifests.

In the following **examples**, use the sample [graph-source.csv](/transformations/r-plain/graph-source.csv) data file. Create a new bucket in Storage and upload the table to it.

{: .image-popup}
![Screenshot - Upload table](/transformations/r-plain/graph-source.png)

## Example 1 -- Output of a single file

Create a [new R transformation](/tutorial/manipulate/), and add the **graph-source** table
in the input mapping. There is no output mapping.

{: .image-popup}
![Screenshot - Configure transformations](/transformations/r-plain/graph-source-2.png)

Then use the following R script in the transformation and run it.

{% highlight r %}
data <- read.csv("/data/in/tables/graph-source.csv")

model <- lm(formula = time_spent_in_shop ~ customer_age + I(customer_age^2), data = data)
png("/data/out/files/graph-2x2.png", width = 600, height = 600)
# plot graphs to 2x2 grid
oldPar <- par(mfrow = c(2,2))
plot(model)
# write to file
dev.off()
par(oldPar)

app$writeFileManifest("/data/out/files/graph-2x2.png", c("regression", "all-in-one"))
{% endhighlight %}

Once the transformation finishes, a file will be added to File uploads:

{: .image-popup}
![Screenshot - File Uploads](/transformations/r-plain/plot-file-uploads.png)

Because the `lm.plot` function produces multiple plots, the above example plots all four graphs to a
single image using a 2x2 grid.

{: .image-popup}
![Result linear model plots](/transformations/r-plain/graph_2x2.png)

## Example 2 -- Output of multiple files
Use the following script the same way as in Example 1. The only difference is that this script
produces multiple files.

{% highlight r %}
data <- read.csv("/data/in/tables/graph-source.csv")

model <- lm(formula = time_spent_in_shop ~ customer_age + I(customer_age^2), data = data)
png("/data/out/files/graph-%d.png", width = 800, height = 800, res=120)
plot(model)
dev.off()

app$writeFileManifest("/data/out/files/graph-1.png", c("regression", "residuals vs. fitted"))
app$writeFileManifest("/data/out/files/graph-2.png", c("regression", "QQ plot"))
app$writeFileManifest("/data/out/files/graph-3.png", c("regression", "scale-location"))
app$writeFileManifest("/data/out/files/graph-4.png", c("regression", "residuals vs. leverage"))
{% endhighlight %}

If a plot function produces multiple graphs, like the `lm.plot` in the above example, use `%d` in the file name in order to generate multiple files.
A manifest is written for each file individually.

## Example 3 -- Using ggplot

If you want to use the [ggplot](https://ggplot2.tidyverse.org/reference/) package, use a different function for saving a file in your script.
The rest remains the same as in the previous examples.

{% highlight r %}
library(ggplot2)
data <- read.csv("/data/in/tables/graph-source.csv")

plot <- ggplot(data, aes(y = time_spent_in_shop, x = customer_age)) +
    geom_point(shape = 1) +
    stat_smooth(method = "lm", formula = y ~ x + I(x^2), size = 1)
ggsave(filename = "/data/out/files/graph2.png", width = 10, height = 10, units = "cm")

app$writeFileManifest("/data/out/files/graph2.png", c("regression", "ggplot"))
{% endhighlight %}

Do not forget to list `ggplot2` in the package section of the transformation.
