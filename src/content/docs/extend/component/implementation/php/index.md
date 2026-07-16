---
title: PHP Implementation Notes
slug: 'extend/component/implementation/php'
redirect_from:
    - /extend/custom-science/php/
---


## Docker
Use the [official images](https://hub.docker.com/_/php/) if possible. Usually, the `alpine` versions are sufficient and are the
smallest and fastest. If you need Composer, use its [official image](https://hub.docker.com/_/composer/) or
[our templates](https://github.com/keboola/component-generator/blob/master/templates/).

## Working with CSV Files
We recommend using our [CSV library](https://github.com/keboola/php-csv), which provides a convenience wrapper
around the build-in [CSV functions](https://www.php.net/manual/en/function.fgetcsv.php). However, the functions work well on their own too.
If you are using bare PHP functions, the following code illustrates their use:

```php
<?php
$fhIn = fopen('/data/in/tables/source.csv', 'r');
$fhOut = fopen('/data/out/tables/destination.csv', 'w');
$header = fgetcsv($fhIn);
$numberIndex = array_search('number', $header);
fputcsv($fhOut, array_merge($header, ['double_number']));
while ($row = fgetcsv($fhIn)) {
	$row[] = $row[$numberIndex] * 2;
	fputcsv($fhOut, $row);
}
fclose($fhIn);
fclose($fhOut);
echo "All done";
```

Note that we open both the input and output files simultaneously; as soon as a row is processed,
it is immediately written to the destination file. This approach keeps only a single row of data in the memory and is
generally very efficient. It is recommended to implement the processing in this way because data files
coming from Keboola can be quite large.

The same can be achieved via the [CSV library](https://github.com/keboola/php-csv). Install the
package with `composer require keboola/csv`. The following
piece of code uses it and reads the [configuration file](/extend/common-interface/config-file/).

```php
<?php

require "vendor/autoload.php";

// read the configuration file
$dataDir = getenv('KBC_DATADIR') . DIRECTORY_SEPARATOR;
$configFile = $dataDir . 'config.json';
$config = json_decode(file_get_contents($configFile), true);

$multiplier = $config['parameters']['multiplier'];

// create output file and write header
$outFile = new \Keboola\Csv\CsvFile(
    $dataDir . 'out' . DIRECTORY_SEPARATOR . 'tables' . DIRECTORY_SEPARATOR . 'destination.csv'
);
$outFile->writeRow(['number', 'someText', 'double_number']);

// read input file and write rows of output file
$inFile = new Keboola\Csv\CsvFile($dataDir . 'in' . DIRECTORY_SEPARATOR . 'tables' . DIRECTORY_SEPARATOR . 'source.csv');
foreach ($inFile as $rowNum => $row) {
    if ($rowNum == 0) {
        // skip header
        continue;
    }
    $outFile->writeRow([
        $row[0],
        $row[1],
        $row[0] * $multiplier
    ]);
}
```

## Using Keboola Package
Keboola's [PHP component package](https://github.com/keboola/php-component) provides functions to

- read and parse the configuration file and parameters: 
	`getConfig` method or `getConfig()->getParameters()` methods.
- list input files and tables: `getConfig()->getInputFiles()`, `getConfig()->getInputTables()` methods.
- work with manifests containing table and file metadata: `getManifestManager()->getTableManifest()`, `getManifestManager()->writeTableManifest()`, `getManifestManager()->getFileManifest()`, `getManifestManager()->writeFileManifest()` methods.
- list expected outputs: `getConfig()->getExpectedOutputFiles()` or `getConfig()->getExpectedOutputTables()` methods.

You can go through the [generated docs](https://keboola.github.io/php-component/master/classes.html) of all available methods and classes.
The package can be installed by [Composer](https://getcomposer.org/):

    composer require keboola/php-component

The package can be used standalone (good for existing code), or you can inherit your own component from it (good for new components).
When inheriting from the package, see the [GitHub repository](https://github.com/keboola/php-component) for examples, or
our [component template](https://github.com/keboola/component-generator/tree/master/templates).
Using the package as a standalone class does not require anything else than creating its instance:

```php
<?php

require "vendor/autoload.php";

$component = new \Keboola\Component\BaseComponent();
$parameters = $component->getConfig()->getValue(['parameters']);
var_export($parameters);

$inputTables = $component->getConfig()->getInputTables();
var_export($inputTables);
```

The configuration is read from the [data folder](/extend/common-interface/config-file/) specified by the
[KBC_DATADIR environment variable](/extend/common-interface/environment/).
Given the following `config.json` file:

```json
{
    "storage": {
        "input": {
            "tables": [
                {
                    "source": "in.c-main.sample",
                    "destination": "source.csv"
                }
            ],
            "files": []
        }
    },
    "parameters": {
        "myParameter": "myValue",
        "repeat": 2
    }
}
```

The above PHP code would output:

```php
array (
  'myParameter' => 'myValue',
  'repeat' => 2,
)array (
  0 =>
  array (
    'source' => 'in.c-main.sample',
    'destination' => 'source.csv',
  ),
)
```

### Dynamic Input/Output Mapping
In the [tutorial](/extend/component/tutorial/) and the above examples, we show
applications which have names of their input/output tables hard-coded.
The following example shows how to read an input and output mapping specified by the end user,
which is accessible in the [configuration file](/extend/common-interface/config-file/). It demonstrates
how to read and write tables and table manifests. File manifests are handled the same way. For a full authoritative list
of items returned in table list and manifest contents, see [the specification](/extend/common-interface/config-file/).

Note that the `destination` label in the script refers to the destination from the
[mapper](/extend/component/tutorial/input-mapping/) perspective.
The input mapper takes `source` tables from the user's storage and produces `destination` tables that become
the input of your component. The output tables of your component are consumed by the output mapper
whose `destination` are the resulting tables in Storage.

The following piece of code reads an arbitrary number of tables and adds an auto-generated primary key
to them. The name of the added column is configured in parameters (`primaryKeyName`). Also, the
step of the generator is configured in parameters (`primaryKeyStep`). The end of the code writes
a table [manifest file](/extend/common-interface/manifest-files/) which stores the configuration of
the primary key and optional table metadata.

```php
<?php

require "vendor/autoload.php";

$component = new \Keboola\Component\BaseComponent();
$inputTables = $component->getConfig()->getInputTables();

$j = 0;
foreach ($inputTables as $inputTable) {
    // get csv file name
    $inFileName = $component->getDataDir() . '/in/tables/' . $inputTable['destination'];

    // get file name from output mapping
    $outFileName = $component->getDataDir() . '/out/tables/' .
        $component->getConfig()->getExpectedOutputTables()[$j]['destination'];

    // read table manifest
    $manifest = $component->getManifestManager()->getTableManifest($inFileName);

    // open input and output files
    $inFile = new \Keboola\Csv\CsvFile($inFileName);
    $outFile = new \Keboola\Csv\CsvFile($outFileName);
    // get value of `primaryKeyName` parameter
    $columnName = $component->getConfig()->getParameters()['primaryKeyName'];

    // process table data
    $header = $inFile->getHeader();
    array_push($header, $columnName);
    $outFile->writeRow($header);
    $i = 0;
    foreach ($inFile as $row) {
        // skip the first line with header
        if ($i != 0) {
            // add generated primary key
            array_push($row, $i);
            $outFile->writeRow($row);
        }
        // get value of `primaryKeyStep` parameter (different approach to `primaryKeyName` above)
        $i = $i + $component->getConfig()->getValue(['parameters', 'primaryKeyStep']);
    }

    // store table metadata
    $metadata = $manifest['metadata'];
    array_push($metadata, [["key" => "sample", "value" => "metadata"]]);

    // create table manifest with primary ket and metadata
    $component->getManifestManager()->writeTableManifestFromArray(
        $outFileName,
        [
            'primary_key' => [$columnName],
            'metadata' => $metadata,
        ]
    );
    $j++;
}
```

## Logging
For simple applications, printing with `echo` or `print` is enough. To print to STDERR, you have to use
e.g., `fwrite(STDERR, "Hello, world!" . PHP_EOL);`. The best option is to use the [Monolog package](https://github.com/Seldaek/monolog).
The following is a useful initialization:

```php
$formatter = new LineFormatter("%message%\n");
$errHandler = new StreamHandler('php://stderr', Logger::NOTICE, false);
$errHandler->setFormatter($formatter);
$handler = new StreamHandler('php://stdout', Logger::INFO);
$handler->setFormatter($formatter);
$logger = new Logger('main', [$errHandler, $handler]);
```

This means that a log with the [NOTICE level](https://github.com/Seldaek/monolog/blob/master/doc/01-usage.md#log-levels) and above
will go to STDERR, and the INFO level will go to STDOUT. The formatter removes unnecessary fields like `timestamp` and `context`.

## Error Handling
The following [piece of code](https://github.com/keboola/component-generator/blob/master/templates/php-component/src/run.php) is a good entry point:

```php
$logger = new Logger();
try {
    $app = new Component($logger);
    $app->execute();
    exit(0);
} catch (UserException $e) {
    $logger->error($e->getMessage());
    exit(1);
} catch (\Throwable $e) {
    $logger->critical(
        get_class($e) . ':' . $e->getMessage(),
        [
            'errFile' => $e->getFile(),
            'errLine' => $e->getLine(),
            'errCode' => $e->getCode(),
            'errTrace' => $e->getTraceAsString(),
            'errPrevious' => $e->getPrevious() ? get_class($e->getPrevious()) : '',
        ]
    );
    exit(2);
}
```

In this case, we consider everything derived from `UserException` to be an error which should be shown to the end user.
You have to create that exception class in your component. Every other error will lead to a generic message; only
the developer will see the details, and the code will follow the [general error handling rules](#error-handling).
Here we use the [`Throwable`](https://www.php.net/manual/en/class.throwable.php) ancestor, which also catches PHP errors. You can, of
course, modify this logic to your liking.
