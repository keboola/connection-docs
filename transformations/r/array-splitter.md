---
title: Array Splitting
permalink: /transformations/r/array-splitter/
redirect_from:
    - /manipulation/transformations/r/array-splitter/

---

Array splitting is what you do if you have a list of values in a single cell delimited by a character (a comma, semi-colon, etc.), 
and want each of those delimited values in a separate row.

The following example will take a table like

| id | name               |
|----|--------------------|
| 1  | first,second,third |
| 2  | fourth,fifth,sixth |

and produce a table like

| globalId | globalPos | globalVal |
|----------|-----------|-----------|
| 1        | 1         | first     |
| 1        | 2         | second    |
| 1        | 3         | third     |
| 2        | 1         | fourth    |
| 2        | 2         | fifth     |
| 2        | 3         | sixth     |

## Prepare 
Use the [sample table](/transformations/r/array-source.csv) shown above and import it into your *Storage*. 
Then set the input and output mapping for your transformation.

{: .image-popup}
![Screenshot - Input/Output mapping](/transformations/r/array-split-io.png)

## Use the Script
The following script will take each row of the source table, and split the column, the name of which is specified in the
`splitCol` variable by the character specified in the `splitChar` variable. The resulting values will be put 
together with their id specified in the `idCol` variable, and they will also be assigned a new sequential id
in the `globalPos` column.   

{% highlight r %}
splitChar = ','
splitCol = 'name'
idCol = 'id'

data <- read.csv(file = "in/tables/array-source.csv")
data <- data.frame(data)

# helper function to generate positions for each array
genPos = function(array){
  array <- getVals(array)
  return(match(array,array))
}

# helper function to grab all the individual values
getVals = function(array){
  array <- toString(array)
  array <- unlist(strsplit(array, splitChar, fixed = FALSE))
  array <- array[array != ""]
  return(array)
}

# rerun these three lines before the for loop, if not the first time
globalId <- c()
globalPos <- c()
globalVal <- c()

# parse through all data and do the actual formatting
for (i in 1:length(data[[splitCol]])) {
  posi <- genPos(data[[splitCol]][i])
  idi <- c(rep(data[[idCol]][i], length(posi)))
  vali <- getVals(data[[splitCol]][i])
  globalId <- c(globalId, idi)
  globalPos <- c(globalPos, posi)
  globalVal <- c(globalVal, vali)
}

processedData <- data.frame(cbind(globalId, globalPos, globalVal))
write.csv(processedData, file = "out/tables/split-values.csv", row.names = FALSE)
{% endhighlight %}

When you run the transformation, you will obtain a table with three columns:

- `globalId` -- ID of each row in the original table (the name of the id column is in the `idCol` variable),
- `globalPos` -- sequential ID of each value **within** the original row, and
- `globalVal` -- each value that has been split out of the original array column (the name of that column is specified in the `splitCol` variable).
