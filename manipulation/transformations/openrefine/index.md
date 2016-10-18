---
title: OpenRefine Transformation
permalink: /manipulation/transformations/openrefine/
---

* TOC
{:toc}

[OpenRefine](http://openrefine.org/) is an open source project based on Google Refine. OpenRefine transformations allow row/cell text and number operations (replacements, calculations). Using OpenRefine you can easily clean up your dataset.

## Environment

The OpenRefine transformation scripts is running in an isolated Docker environment. The installed OpenRefine version is `2.6-rc.2`.

### Memory

So far, we have allocated 8GB of memory to the Docker instance running the OpenRefine transformation. We will be increasing this limit along the way, but there will always be a defined memory constraint.

### Inputs/Outputs

As OpenRefine has only one dataset as an input and the results is one dataset, the input and output mapping is limited to exactly one input/output. 

## Development Tutorial

To develop and debug OpenRefine transformations, you can replicate the execution environment on your local machine.
To do so, you need to have  [OpenRefine installed](http://openrefine.org/download.html), preferably the same version as us.

{: .image-popup}
![Screenshot - OpenRefine Welcome Screen](/manipulation/transformations/openrefine/screen.png)


To simulate the input and output mapping, all you need to do is create a project with the desired CSV file

{: .image-popup}
![Screenshot - OpenRefine CSV Load](/manipulation/transformations/openrefine/loadcsv.png)

The you can use the UI to modify the file according to your needs and click the Extract button in the Undo/Redo tab 

{: .image-popup}
![Screenshot - OpenRefine Operation History](/manipulation/transformations/openrefine/operationhistory.png)

And finally copy the Operation History JSON to the transformation script

{: .image-popup}
![Screenshot - OpenRefine Extract Operation History](/manipulation/transformations/openrefine/operationhistoryextract.png)

### Using Docker

Alternatively you can use our Docker image prepared in our GitHub repository


    git clone https://github.com/keboola/openrefine-php-client
    cd openrefine-php-client
    docker-compose build
    docker-compose up openrefine


Note that building Docker images will take a while, we're building OpenRefine from sources.
After everything runs just point your browser to `localhost:3333`.

## Public Beta Warning

OpenRefine transformations are currently in public beta. Some thing may not work as expected. Please bear with us while we polish all necessities, all feedback welcomed at [support@keboola.com](mailto:support@keboola.com). 
