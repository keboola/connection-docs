---
title: R Client Library
slug: 'integrate/storage/r-client'
---


The R client library is a [Storage API client](https://api.keboola.com/?service=storage) which you can use in your R code.
The current implementation supports all basic data manipulations:

- Importing data
- Exporting data
- Creating and deleting buckets and tables

The client source code is available in our [Github repository](https://github.com/keboola/sapi-r-client).

## Installation
This library is available on [Github](https://github.com/keboola/sapi-r-client), so we
recommend that you use the `devtools` package to install it.

```r
# first install the devtools package if it isn't already installed
install.packages("devtools")

# install dependencies (another github package for aws requests)
devtools::install_github("cloudyr/aws.s3")

# install the SAPI R client package
devtools::install_github("keboola/sapi-r-client")

# load the library (dependencies will be loaded automatically)
library(keboola.sapi.r.client)
```

## Usage
To list available commands, run
```r
?keboola.sapi.r.client::SapiClient
```

**Important**: If you are running the code in R Studio, it might require a restart so that its help index is updated
and the above command works.

The client is implemented as an [RC class](http://adv-r.had.co.nz/R5.html). To work with it, create an instance of the client.
The only required argument to create it is a valid Storage API token.

```r
client <- SapiClient$new(
    token = 'your-token'
)
```

### Example --- Create a Table and Import Data
To create a new table in Storage, use the `saveTable` function. Provide the name of an existing bucket,
the name of the new table and a CSV file with the table's contents.

To create the `new-table` table in the `in.c-main` bucket, use

```r
myDataFrame <- data.frame(id = c(1,2,3,4), secondCol = c('a', 'b', 'c', 'd'))
client <- SapiClient$new(
    token = 'your-token'
)

table <- client$saveTable(
    df = myDataFrame,
    bucket = "in.c-main",
    tableName = "new-table",
    options = list(primaryKey = 'id')
)
```

The above command will import the contents of the `myDataFrame` variable into the newly created table. It will
also mark the `id` column as the primary key.

### Example --- Export Data
If you want to export a table from Storage and import it into R, use the `importTable` function. Provide
the ID (*bucketName.tableName*) of an existing table.

To export data from the `old-table` table in the `in.c-main` bucket, use

```r
client <- SapiClient$new(
  token = 'your-token'
)

data <- client$importTable('in.c-main.old-table')
```

The above command will export the table from Storage and save it in the `data` variable. The output is
a [data.table](https://cran.r-project.org/web/packages/data.table/index.html) object compatible with a `data.frame`.

### Other Examples

```r
# create a client
client <- SapiClient$new(
    token = 'your-token'
)

# verify the token
tokenDetails <- client$verifyToken()

# create a bucket
bucket <- client$createBucket("new_bucket", "in", "A brand new Bucket!")

# list buckets
buckets <- client$listBuckets()

# list all tables
tables <- client$listTables()

# list all tables in a bucket
tables <- client$listTables(bucket = bucket$id)

# delete a table
client$deleteTable(table$id)

# delete a bucket
client$deleteBucket(bucket$id)

```
