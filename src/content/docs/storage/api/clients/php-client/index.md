---
title: Storage PHP Client Library
slug: 'storage/api/clients/php-client'
redirect_from:
    - /integrate/storage/php-client/
---


The Storage API PHP client library is a portable command line client providing
the most complete [Storage API](https://api.keboola.com/?service=storage) implementation.
It runs on any platform which has PHP installed.
Currently this client implements almost all Storage API functions including, of course, exporting and importing tables.

The client source is available in our [Github repository](https://github.com/keboola/storage-api-php-client).

## Installation

The Library is available as a [Composer package](https://getcomposer.org/).
Unless you already have it, [install Composer](https://getcomposer.org/download/) on your system.
On *nix system, do so by running

```bash
curl -s http://getcomposer.org/installer | php
mv ./composer.phar ~/bin/composer # or /usr/local/bin/composer
```

On Windows, use the [installer](https://getcomposer.org/Composer-Setup.exe).

To install the library, run

```bash
composer require keboola/storage-api-client
```

in the root of your project. You should get an output similar to this one:

    Using version ^4.11 for keboola/storage-api-client
    ./composer.json has been created
    Loading composer repositories with package information
    Updating dependencies (including require-dev)
    - Installing aws/aws-sdk-php (3.18.18)
        Downloading: 100%
    ...
    - Installing keboola/storage-api-client (4.11.0)
        Downloading: 100%
    Writing lock file
    Generating autoload files

Then add the generated autoloader in your bootstrap script:

```php
require 'vendor/autoload.php';
```

You can read more in the [Composer documentation](https://getcomposer.org/doc/01-basic-usage.md). Packages
installable by Composer can be browsed at [Packagist package repository](https://packagist.org/).

## Usage
The Storage API client is implemented as a single class. To create an instance of the class, provide a Storage API token to the
constructor.

```php
<?php

require 'vendor/autoload.php';

use Keboola\StorageApi\Client;

$client = new Client([
  'token' => 'your-token',
]);
```

### Example --- Create a Table
To create a new table in Storage, it is recommended to use an additional
[php-csv](https://github.com/keboola/php-csv) library to work
with CSV files. The library will get installed
automatically with the Storage API client, so you can use it out of the box.
To create a new table and import CSV data in it, use the following PHP script:

```php
<?php
require 'vendor/autoload.php';

use Keboola\Csv\CsvFile;
use Keboola\StorageApi\Client;

$client = new Client([
    'token' => 'your-token',
]);
$csvFile = new CsvFile('./new-table.csv');
$client->createTableAsync('in.c-main', 'new-table', $csvFile);
```

### Example --- Import Data
To import CSV data into an existing table and overwrite its contents, use the following PHP script:

```php
<?php
require 'vendor/autoload.php';

use Keboola\Csv\CsvFile;
use Keboola\StorageApi\Client;

$client = new Client([
    'token' => 'your-token',
]);
$csvFile = new CsvFile('./new-table.csv');
$client->writeTableAsync('in.c-main.new-table', $csvFile);
```

### Example --- Import Data Incrementally
To import CSV data into an existing table and append the new data to the existing table contents, use the following PHP script:

```php
<?php
require 'vendor/autoload.php';

use Keboola\Csv\CsvFile;
use Keboola\StorageApi\Client;

$client = new Client([
    'token' => 'your-token',
]);
$csvFile = new CsvFile('./new-table.csv');
$client->writeTableAsync('in.c-main.new-table', $csvFile, ['incremental' => true]);
```

All available upload options are listed in the [API documentation](https://api.keboola.com/?service=storage#post-/v2/storage/branch/-branchId-/tables/-id-/import-async).

### Example --- Export Data
To export data from a Storage table to a CSV file, use the
`TableExporter` class. It is part of the client library. You can use the following script:

```php
<?php
require 'vendor/autoload.php';

use Keboola\StorageApi\Client;
use Keboola\StorageApi\TableExporter;

$client = new Client([
    'token' => 'your-token'
]);

$exporter = new TableExporter($client);
$exporter->exportTable('in.c-main.my-table', './old-table.csv');
```
