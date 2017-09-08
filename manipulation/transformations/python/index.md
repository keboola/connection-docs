---
title: Python Transformation
permalink: /manipulation/transformations/python/
---

* TOC
{:toc}

[Python](https://www.python.org/about/) transformations complement R and SQL transformations (MySQL or Redshift) where computations or other operations are too difficult.
Common data operations like joining, sorting, or grouping are still easier and faster to do in [SQL Transformations](/manipulation/transformations/).

## Environment

The Python script is running in an isolated [Docker environment](https://developers.keboola.com/integrate/docker-bundle/). The current Python version is 3.6.2.

### Memory and Processing Constraints

The Docker container running the Python transformation has allocated 8GB of memory and the maximum running time is 6 hours.

### File locations
The Python script itself will be compiled to `/data/script.py`. To access your input and output tables, use
relative (`in/tables/file.csv`, `out/tables/file.csv`) or absolute (`/data/in/tables/file.csv`, `/data/out/tables/file.csv`) paths.
To access downloaded files, use the `in/user/tag` or `/data/in/user/tag` path. If you want to dig really deep,
have a look at the [full Common Interface specification](https://developers.keboola.com/extend/common-interface/).
Temporary files can be written to a `/tmp/` folder. Do not use the `/data/` folder for files you do not wish to exchange with KBC.

## Python Script Requirements
Python is **sensitive to indentation**. Make sure not to mix tabs and spaces. All files are assumed to be in UTF;
`# coding=utf-8` at the beginning of the script is not needed. If you define a main function, do not wrap it within the `if __name__ == '__main__':` block as it will not be run. Simply calling it from within the script is enough:

{% highlight python %}
def main():
    print("Hello Keboola")

main()
{% endhighlight %}

### Packages
You can list extra packages in the UI. These packages are installed using [pip](https://pypi.python.org/pypi/pip).
Generally, any package available on [PyPI](https://pypi.python.org/pypi) can be installed. However, some packages have external dependencies, which might not be available.
Feel free to contact us if you run into problems. When the package is installed, you still need to `import` from it.

{: .image-popup}
![Screenshot - Package Configuration](/manipulation/transformations/python/packages.png)

The latest versions of packages are always installed.

### CSV format
Tables from Storage are imported to the Python script from CSV files. CSV files can be read by standard Python functions
from the [csv packages](https://docs.python.org/3/library/csv.html). It is recommended to explicitly specify the formatting options.
You can read CSV files either to vectors (numbered columns), or to dictionaries (named columns).
Your input tables are stored as CSV files in `in/tables/`, and your output tables in `out/tables/`.

If you can process the file line-by-line, then the most effective way is to read each line, process it and write
it immediately. The following two examples show two ways of reading and manipulating a CSV file.

## Development Tutorial
To develop and debug Python transformations, you can replicate the execution environment on your local machine.
To do so, you need to have [Python installed](https://www.python.org/downloads/), preferably the same version as us.

To simulate the input and output mapping, all you need to do is create the right directories with the right files.
The following image shows the directory structure:

{: .image-popup}
![Screenshot - Data folder structure](/manipulation/transformations/python/tree.png)

The script itself is expected to be in the `data` directory; its name is arbitrary. It is possible to use relative directories,
so that you can move the script to a KBC transformation with no changes. To develop a Python transformation which takes a [sample CSV file](/manipulation/transformations/python/source.csv) locally, take the following steps:

- Put the Python code into a file, for example script.py, in the working directory.
- Put all the input mapping tables inside the `in/tables` subdirectory of the working directory.
- If using binary files, place them inside the `in/user` subdirectory of the working directory, and make sure that their name is without any extension.
- Store the result CSV files inside the `out/tables` subdirectory.

Use this sample script:

{% highlight python %}
import csv

csvlt = '\n'
csvdel = ','
csvquo = '"'
with open('in/tables/source.csv', mode='rt', encoding='utf-8') as in_file, open('out/tables/destination.csv', mode='wt', encoding='utf-8') as out_file:
    writer = csv.DictWriter(out_file, fieldnames=['col1', 'col2'], lineterminator=csvlt, delimiter=csvdel, quotechar=csvquo)
    writer.writeheader()

    lazy_lines = (line.replace('\0', '') for line in in_file)
    reader = csv.DictReader(lazy_lines, lineterminator=csvlt, delimiter=csvdel, quotechar=csvquo)
    for row in reader:
        # do something and write row
        writer.writerow({'col1': row['first'] + 'ping', 'col2': int(row['second']) * 42})
{% endhighlight %}

A finished example of the above is attached below in [data.zip](/manipulation/transformations/python/data.zip).
Download it and test the script in your local Python installation. The `destination.csv` output file will be created.
This script can be used in your transformations without any modifications. All you need to do is

- upload the [sample CSV file](/manipulation/transformations/python/source.csv) into your storage,
- set the input mapping from that table to `source.csv` (expected by the Python script),
- set the output mapping from `destination.csv` (produced by the Python script) to a new table in your Storage,
- copy & paste the script into the transformation, and, finally,
- run the transformation.

{: .image-popup}
![Screenshot - Sample Input Output Mapping](/manipulation/transformations/python/sample-io.png)

### Going further
The above steps are usually sufficient for daily development and debugging of moderately complex Python transformations,
although they do not reproduce the transformation execution environment exactly. To create a development environment
with the exact same configuration as the transformation environment, use [our Docker image](https://developers.keboola.com/extend/docker/running/#running-transformations).

## Example 1 -- Using dictionaries
The following piece of code reads a table with two columns, named **first** and **second**, from the **source.csv** input mapping file into the `row` dictionary using `csvReader`.
It then adds *ping* to the first column and multiplies the second column by *42*. After that, it saves the row to the **destination.csv** output mapping file.

{% highlight python %}
import csv

csvlt = '\n'
csvdel = ','
csvquo = '"'
with open('in/tables/source.csv', mode='rt', encoding='utf-8') as in_file, open('out/tables/destination.csv', mode='wt', encoding='utf-8') as out_file:
    writer = csv.DictWriter(out_file, fieldnames=['col1', 'col2'], lineterminator=csvlt, delimiter=csvdel, quotechar=csvquo)
    writer.writeheader()

    lazy_lines = (line.replace('\0', '') for line in in_file)
    reader = csv.DictReader(lazy_lines, lineterminator=csvlt, delimiter=csvdel, quotechar=csvquo)
    for row in reader:
        # do something and write row
        writer.writerow({'col1': row['first'] + 'ping', 'col2': int(row['second']) * 42})
{% endhighlight %}

The above example shows how to process the file line-by-line; this is the most memory-efficient way which allows you to process data files of any size.
The expression `lazy_lines = (line.replace('\0', '') for line in in_file)` is a [Generator](https://wiki.python.org/moin/Generators) which makes sure that
[Null characters](https://en.wikipedia.org/wiki/Null_character) are properly handled.
It is also important to use `encoding='utf-8'` when reading and writing files.

## Example 2 -- Using lists

The following piece of code reads a table with some of its columns from the **source.csv** input mapping file into the `row` list of strings.
It then adds *ping* to the first column and multiplies the second column by *42*. After that it saves the row to the **destination.csv** output mapping file.

{% highlight python %}
csvlt = '\n'
csvdel = ','
csvquo = '"'
with open('/data/in/tables/source.csv', mode='rt', encoding='utf-8') as in_file, open('/data/out/tables/destination.csv', mode='wt', encoding='utf-8') as out_file:
    writer = csv.writer(out_file, lineterminator=csvlt, delimiter=csvdel, quotechar=csvquo)
    writer.writeheader()
    lazy_lines = (line.replace('\0', '') for line in in_file)
    reader = csv.reader(lazy_lines, lineterminator=csvlt, delimiter=csvdel, quotechar=csvquo)
    for row in reader:
        # do something and write row
        writer.writerow([row[0] + 'ping', int(row[1]) * 42])
{% endhighlight %}

## Example 3 -- Using CSV dialect
You can simplify the above code using our pre-installed KBC dialect.

{% highlight python %}
with open('/data/in/tables/source.csv', mode='rt', encoding='utf-8') as in_file, open('/data/out/tables/destination.csv', mode='wt', encoding='utf-8') as out_file:
    writer = csv.writer(out_file, dialect='kbc')
    writer.writeheader()
    lazy_lines = (line.replace('\0', '') for line in in_file)
    reader = csv.reader(lazy_lines, dialect='kbc')
    for row in reader:
        # do something and write row
        writer.writerow([row[0] + 'ping', int(row[1]) * 42])
{% endhighlight %}

The `kbc` dialect is automatically available in the transformation environment. If you want it in your local environment,
it is defined as `csv.register_dialect('kbc', lineterminator='\n', delimiter = ',', quotechar = '"')`.

