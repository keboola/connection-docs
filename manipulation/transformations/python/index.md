---
title: Python
permalink: /manipulation/transformations/python/
---

* TOC
{:toc}

[Python](https://www.python.org/about/) is a very versatile programming language and has plenty of functions for computing and machine learning. Python transformations are a complement to SQL transformations (MySQL or Redshift) and to R transformations 
as they can be used to perform computations or other operations which are difficult to do in SQL/R. On the other hand it 
is easier and faster to do common operations with data like joining, sorting, grouping in 
[SQL Transformations](/manipulation/transformations/). 

## Environment

The Python script is running in isolated docker environment. Current Python version is 3.5.1.

### Memory
Currently we've allocated 8GB of memory to the docker instance running the Python transformation. We'll be increasing this limit along the way, but there will always be a defined memory constraint.

### File locations
The Python script itself will be compiled to `/data/script.py`. To access input and output tables you can use 
relative (`in/tables/file.csv`, `out/tables/file.csv`) or absolute paths (`/data/in/tables/file.csv`, `/data/out/tables/file.csv`). 
To access downloaded files use `in/user/tag` or `/data/in/user/tag` path. If you want to dig really deep, you can
have a look at [full Common Interface specication](http://developers.keboola.com/extend/common-interface/)
If you need to write temporary files, write them to `/tmp/` folder (do not use the `/data/` folder for
files you do not wish to exchange with KBC).

## Python script requirements
Python language is sensitive to indentation - make sure not to mix tabs and spaces. All files are assumed to be in UTF, putting 
`# coding=utf-8` at the beginning of the script is not needed. To run the script within our environment the python script must
meet the following requirements. 

### Packages
You can list extra packages in the UI. These packages are installed using [pip](https://pypi.python.org/pypi/pip). 
Generally any package available on [PyPI](https://pypi.python.org/) can be installed. However some packages have external
dependencies which might not be available, contact us on support if you run into problems.
When the package is installed you still need to `import` from it.

{: .image-popup}
![Screenshot - Package Configuration](/manipulation/transformations/python/packages.png)

The packages are always installed with their latest versions.

### CSV format
Tables from Storage are imported to Python script from CSV files. The CSV files can be read by standard python functions
from the [csv packages](https://docs.python.org/3/library/csv.html). It is recommended to explicitly specify the formatting 
options. You can read the CSV files either to vectors (numbered columns) or to dictionaries (named columns). Input tables 
are stored as CSV files in `in/tables/`, output tables are stored in `out/tables/`. 

If you can process the file line-by-line, then the most effective way is to read each line, process it and write 
it immediately. The following two examples show two ways of reading CSV file and manipulating it.

## Development Tutorial
To develop and debug Python transformations, you can replicate the execution environment on your local machine. 
To do so, you need to have [Python installed](https://www.python.org/downloads/), preferably in the same version as we 
have.

To simulate input and output mapping, all you need to do is create the right directories with right files. 
The following image shows the directory structure:

{: .image-popup}
![Screenshot - Data folder structure](/manipulation/transformations/python/tree.png)

The script itself is expected to reside in the `data` directory, its name is arbitrary. You can use relative directories, 
so that you can move the script to KBC transformation without any changes. To develop a Python transformation which takes
 a [sample CSV file](/manipulation/transformations/python/source.csv) 
locally, you need to:

- put the Python code in the in working directory in a file, e.g. script.py  
- put all tables from input mapping inside `in/tables` subdirectory of the working directory 
- if you use any binary files, place them inside the `in/user` subdirectory of the working directory,
 make sure that the is named without any extension,
- make sure that the result CSV files are stored in inside `out/tables` subdirectory

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
        
A finished example of the above is attached below in [data.zip](/manipulation/transformations/python/data.zip). You can 
download the zip file and verify that you can execute it in your local Python installation. When the script finishes successfully, it
will create the output file `destination.csv`, you can then use this script in transformations without any modifications. To 
use it in the transformations do:

- upload the [sample CSV file](/manipulation/transformations/python/source.csv) into your storage
- set input mapping from that table to `source.csv` (expected by the python script)
- set ouput mapping from `destination.csv` (produced by the python script) to a new table in your Storage
- copy & paste the script into the transfromation
- run the transformation

{: .image-popup}
![Screenshot - Sample Input Output Mapping](/manipulation/transformations/python/sample-io.png)

### Going further
The above steps are usually sufficient for daily development and debugging of moderately complex Python transformations 
(although they do not reproduce the transformation execution environment exactly). To create development environment 
which has the exact same configuration as the transformation environment, you can use 
[our docker image](http://developers.keboola.com/extend/docker/running/#running-transformations).

## Examples

### Working with data using dictionaries
The following piece of code reads table withe columns **first** and **second** from input mapping 
file **source.csv** into dictionary `csvReader`. It then adds *ping* to the first column and multiplies the 
second column by *42* and saves the row to output mapping file **destination.csv**.

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

The above example shows how to process the file line-by-line; this is the most memory-efficient way which
allows you to process data files of any size. The expression
`lazy_lines = (line.replace('\0', '') for line in in_file)` is a
[Generator](https://wiki.python.org/moin/Generators) which makes sure that
[Null characters](https://en.wikipedia.org/wiki/Null_character) are properly handled.
It is also important to use `encoding='utf-8'` when reading and writing files.

### Working with data using lists

The following piece of code reads table withe some columns from input mapping file **source.csv** into list of 
strings `reader`. It then adds *ping* to the first column and multiplies the second column by *42* and saves 
the row to output mapping file **destination.csv**.

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

### Using CSV dialect
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

The `kbc` dialect is automatically available in the transformation environment. If you want it in your local environment 
it is defined as:
`csv.register_dialect('kbc', lineterminator='\n', delimiter = ',', quotechar = '"')`

