---
title: Python Implementation Notes
slug: 'extend/component/implementation/python'
redirect_from:
    - /extend/custom-science/python/
---


## Docker
Use the [official images](https://hub.docker.com/_/python/) if possible. Usually, the `alpine` versions are sufficient and are the
smallest and fastest. We recommend using [our templates](https://github.com/keboola/component-generator/tree/master/templates).

## Working with CSV Files
We advise you to follow the guidelines for the [Python transformation](/transformations/python/#development-tutorial).

The build-in CSV functions for Python work well except when the data in the CSV file contain a null character. This is
[usually fixed](https://stackoverflow.com/questions/4166070/python-csv-error-line-contains-null-byte) by
adding `lazy_lines = (line.replace('\0', '') for line in in_file)`. The expression
is a [generator](https://wiki.python.org/moin/Generators) which makes sure that
[null characters](https://en.wikipedia.org/wiki/Null_character) are properly handled.
It is also important to use `encoding='utf-8'` when reading and writing files.

```python
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
```

Note that we open both the input and output files simultaneously; as soon as a row is processed,
it is immediately written to the output file. This approach keeps only a single row of data in the memory and is
generally very efficient. It is recommended to implement the processing in this way because data files
coming from Keboola can be quite large (i.e., dozens of gigabytes).

## Using Keboola Python Package
The [Python component package](https://github.com/keboola/python-component) provides a Python wrapper over the
[Keboola Common Interface](/extend/common-interface/). It simplifies all tasks related
 to the communication of the [component](/extend/component/) with 
 Keboola that is defined by the Common Interface. Such tasks are config manipulation, validation, 
 component state, I/O handling, I/O metadata and manifest files, logging, etc.
 
 **NOTE:** That this package is a replacement for the previous legacy [Python docker application](https://github.com/keboola/python-docker-application)

The `CommonInterface` class provides following methods:

- read and parse the configuration file and parameters: `configuration` object and `configuration.parameters` properties.
- list input files and tables represented by Python objects for easier manipulation: 
- work with [manifests](/extend/common-interface/manifest-files/) containing table and file metadata: `get_table_manifest()`, `get_file_manifest()`, `write_table_manifest()`, `write_file_manifest()` methods.
- list expected outputs: `configuration.files_input_mapping`, `configuration.tables_input_mapping` properties.

The library is a standard Python package that is available by default in the production environment.
It is a public PYPI project [keboola.component](https://pypi.org/project/keboola.component/), so it can be installed
locally with `pip3 install keboola.component`.

A generated [API documentation](https://htmlpreview.github.io/?https://raw.githubusercontent.com/keboola/python-component/main/docs/api-html/component/interface.html)
is available for the package, and an actual working example can be found in our
[Python template](https://bitbucket.org/kds_consulting_team/kbc-python-template/src/master/src/component.py).

### Initialization

The core class is `keboola.component.interface.CommonInterface`, upon its initialization the environment is 
created. e.g.

- data folder initialized (either from the [Environment Variable](/extend/common-interface/environment/#environment-variables) or manually)
- [Configuration file](/extend/common-interface/config-file/) is loaded
- All Environment variables are loaded

The optional parameter `data_folder_path` of the constructor is the path to the data directory.
If not provided, [`KBC_DATADIR` environment variable](/extend/common-interface/environment/#environment-variables) will be used.

The class can be either extended or just instantiated and manipulated like object. 
The `CommonInterface` class is exposed in the `keboola.component` namespace:

```python
from keboola.component import CommonInterface
# init the interface
# A ValueError error is raised if the KBC_DATADIR does not exist or contains non-existent path.
ci = CommonInterface()
```

### Loading configuration parameters

The below example loads initializes the common interface class and automatically loading config.json from the 
[data folder](/extend/common-interface/folders/) 
 
 **NOTE:** The `configuration` object is initialized upon access and a ValueError is thrown if the `config.json` does not exist 
 in the data folder. E.g., `cfg = ci.configuration` may throw a ValueError even though the data folder exists and ci (CommonInterface) 
 is properly initialized.

```python
from keboola.component import CommonInterface
# Logger is automatically set up based on the component setup (GELF or STDOUT)
import logging

SOME_PARAMETER = 'myParameter'
REQUIRED_PARAMETERS = [SOME_PARAMETER]

# init the interface
# A ValueError error is raised if the KBC_DATADIR does not exist or contains non-existent path.
ci = CommonInterface()

# A ValueError error is raised if the config.json file does not exists in the data dir.
# Checks for required parameters and throws ValueError if any is missing.
ci.validate_configuration(REQUIRED_PARAMETERS)

# print Keboola Project ID from the environment variable if present:
logging.info(ci.environment_variables.project_id)

# load particular configuration parameter
logging.info(ci.configuration.parameters[SOME_PARAMETER])
```

The above would read the `somemyParameter_user_parameter` parameter from the user-supplied configuration:

```json
{
    "myParameter": "myValue"
}
```

The following piece of code shows how to read parameters:

```python
import csv
from keboola.component import CommonInterface

# initialize the library and read parameter 'multiplier'
ci = CommonInterface()
multiplier = ci.configuration.parameters['multiplier']

# open the input and output files
with open('in/tables/source.csv', mode='rt', encoding='utf-8') as in_file, open('out/tables/destination.csv', mode='wt', encoding='utf-8') as out_file:
    # write output file header
    writer = csv.DictWriter(out_file, fieldnames=['number', 'someText', 'double_number'], dialect='kbc')
    writer.writeheader()

    # read input file line-by-line
    lazy_lines = (line.replace('\0', '') for line in in_file)
    csv_reader = csv.DictReader(lazy_lines, dialect='kbc')
    for row in csv_reader:
        # do something and write row
        writer.writerow({'number': row['number'], 'someText': row['someText'], 'double_number': int(row['number']) * multiplier})
```

Note that we have also simplified reading and writing of the CSV files using the `dialect='kbc'` option. The dialect is
registered automatically when the `CommonInterface` class is initialized.

### Processing input tables -- Manifest vs I/O mapping

Input and output tables specified by the user are listed in the [configuration file](/extend/common-interface/config-file/). 
Apart from that, all input tables provided by user also include manifest file with additional metadata.

Tables and their manifest files are represented by the `keboola.component.dao.TableDefinition` object and may be loaded 
using the convenience method `get_input_tables_definitions()`. The result object contains all metadata about the table,
such as [manifest file](/extend/common-interface/manifest-files/#dataintables-manifests) representations (if present), system path and name.

#### Manifest & input folder content

```python
from keboola.component import CommonInterface
import logging

# init the interface
ci = CommonInterface()

input_tables = ci.get_input_tables_definitions()

# print path of the first table (random order)
first_table = input_tables[0]
logging.info(f'The first table named: "{first_table.name}" is at path: {first_table.full_path}')

# get information from table manifest
logging.info(f'The first table has following columns defined in the manifest {first_table.column_names}')

```

#### Get input table by name

```python
from keboola.component import CommonInterface

# init the interface
ci = CommonInterface()
table_def = ci.get_input_table_definition_by_name('input.csv')
```

#### Using I/O mapping

```python
import csv
from keboola.component import CommonInterface

# initialize the library
ci = CommonInterface()

# get list of input tables from the input mapping ()
tables = ci.configuration.tables_input_mapping
j = 0
for table in tables:
    # get csv file name
    inName = table.destination
    
    # read input table manifest and get its physical representation
    table_def = ci.get_input_table_definition_by_name(table.destination)

    # get csv file name with full path from output mapping
    outName = ci.configuration.tables_output_mapping[j].full_path

    # get file name from output mapping
    outDestination = ci.configuration.tables_output_mapping[j]['destination']
```

### Output tables - manifest files and processing results

The component may define output [manifest files](/extend/common-interface/manifest-files/#dataouttables-manifests) 
that define options on storing the results back to the Keboola Storage. This library provides methods that simplifies 
the manifest file creation and allows defining the export options.

`TableDefinition` object serves as a result container containing all the information needed to store the Table into the Storage. 
It contains the manifest file representation and initializes all attributes available in the manifest.
This object represents both Input and Output manifests. All output manifest attributes are exposed in the class.

There are convenience method for manifest creation `CommonInterface.write_tabledef_manifest()`. 
Also it is possible to create the container for the output table using the `CommonInterface.create_out_table_definition()`
(useful particularly when working with [sliced tables](/extend/common-interface/folders/#sliced-tables)).

```python
from keboola.component import CommonInterface
from keboola.component.dao import ColumnDefinition, DataType, SupportedDataTypes, BaseType

# init the interface
ci = CommonInterface(data_folder_path='data')

# create container for the result
out = ci.create_out_table_definition("testDef",
                                     schema=['foo', 'bar'],
                                     destination='some-destination',
                                     primary_key=['foo'],
                                     incremental=True,
                                     delete_where={'column': 'lilly',
                                                   'values': ['a', 'b'],
                                                   'operator': 'eq'})

# update column
out.update_column('foo',
                  ColumnDefinition(data_types=BaseType(dtype=SupportedDataTypes.INTEGER, length='20')))

# add new columns
out.add_column('note', ColumnDefinition(nullable=False))
out.add_column('test1')
out.add_columns(['test2', 'test3', 'test4'])

# add new typed column
out.add_column('id', ColumnDefinition(primary_key=True,
                                      data_types={'snowflake': DataType(dtype="INTEGER", length='200')})
               )

out.add_columns({
    'phone': ColumnDefinition(primary_key=True,
                              data_types={'snowflake': DataType(dtype="INTEGER", length='200'),
                                          'bigquery': DataType(dtype="BIGINT")}),
    'new2': ColumnDefinition(data_types={'snowflake': DataType(dtype="INTEGER", length='200')}),
                 })

# delete columns
out.delete_column('bar')
out.delete_columns(['test2', 'test3'])

# write some content
with open(out.full_path, 'w') as result:
    result.write('line')
    
# write manifest
ci.write_manifest(out)
```

### Processing input files

Similarly as tables, [files and their manifest files](/extend/common-interface/folders/#folder-datainfiles) are represented by the `keboola.component.dao.FileDefinition` object and may be loaded 
using the convenience method `get_input_files_definitions()`. The result object contains all metadata about the file,
such as manifest file representations, system path and name.

The `get_input_files_definitions()` supports filter parameters to filter only files with a specific tag or retrieve only the latest file of each. 
This is especially useful because the Keboola input mapping will by default include all versions of files matching specific tag. By default, the method 
returns only the latest file of each.

```python
from keboola.component import CommonInterface
import logging

# init the interface
ci = CommonInterface()

input_files = ci.get_input_files_definitions(tags= ['my_tag'], only_latest_files=True)

# print path of the first file (random order) matching the criteria
first_file = input_files[0]
logging.info(f'The first file named: "{input_files.name}" is at path: {input_files.full_path}')
```

When working with files it may be useful to retrieve them in a dictionary structure grouped either by name or a tag group. 
For this there are convenience methods `get_input_file_definitions_grouped_by_tag_group()` and `get_input_file_definitions_grouped_by_name()`

```python
from keboola.component import CommonInterface
import logging

# init the interface
ci = CommonInterface()

# group by tag
input_files_by_tag = ci.get_input_file_definitions_grouped_by_tag_group(only_latest_files=True)

# print list of files matching specific tag
logging.info(input_files_by_tag['my_tag']) 

# group by name
input_files_by_name = ci.get_input_file_definitions_grouped_by_name(only_latest_files=True)

# print list of files matching specific name
logging.info(input_files_by_name['image.jpg'])

```

#### Processing state files

[State files](/extend/common-interface/config-file/#state-file) can be easily loaded and written 
using the `get_state_file()` and `write_state_file()` methods:
 
```python
from keboola.component import CommonInterface
from datetime import datetime
import logging

# init the interface
ci = CommonInterface()

last_state = ci.get_state_file()

# print last_updated if exists
logging.info(f'Previous job stored following last_updated value: {last_state.get("last_updated","")})')

# store new state file
ci.write_state_file({"last_updated": datetime.now().isoformat()})
```

### Logging

The library automatically initializes STDOUT or GELF logger based on the presence of the `KBC_LOGGER_PORT/HOST` environment variables 
upon the `CommonInterface` initialization. To use the GELF logger just enable the logger for your application in the 
[Developer Portal](https://components.keboola.com/). 
More details about logging options are available in a [dedicated article](/extend/common-interface/logging/#examples).

With either setting, you can log your messages using the logging library:

```python
from keboola.component import CommonInterface
from datetime import datetime
import logging

# init the interface
ci = CommonInterface()

logging.info("Info message")
```

To fully leverage the benefits of the GELF logger such as outputting the `Stack Trace` into the log event detail (available by clicking on the log event) 
log exceptions using `logger.exception(ex)`.

**TIP:** When the logger verbosity is set to `verbose` you may leverage `extra` fields to log the detailed message 
in the detail of the log event by adding extra fields to you messages:

```python
logging.error(f'{error}. See log detail for full query. ',
                         extra={"failed_query": json.dumps(query)})
```

If you use STDOUT logging note that in Python components, the output is buffered. The buffering may 
be [switched off](https://stackoverflow.com/questions/107705/disable-output-buffering). The easiest solution is to run your script
with the `-u` option: you would use `CMD python -u ./main.py` in your `Dockerfile`.

## Error Handling
The following [piece of code](https://github.com/keboola/component-generator/blob/master/templates/python-tests/src/main.py) is a good entry point:

```python
import my_component
import os
import sys
import traceback

try:
    datadir = os.environ.get('KBC_DATADIR') or '/data/'
    my_component.run(datadir)
except ValueError as err:
    print(err, file=sys.stderr)
    sys.exit(1)
except Exception as err:
    print(err, file=sys.stderr)
    traceback.print_exc(file=sys.stderr)
    sys.exit(2)
```

In this case, we consider everything derived from `ValueError` to be an error which should be shown to the end user.
Every other error will lead to a generic message, and only developers will see the details.
If you maintain that any user error is a `ValueError`, then whatever happens in the `my_component.run` will follow
the [general error handling rules](#error-handling).
You can, of course, modify this logic to your liking.
