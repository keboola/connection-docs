---
title: OpenRefine Transformation
permalink: /manipulation/transformations/openrefine/
---

* TOC
{:toc}

[OpenRefine](http://openrefine.org/) is an open source project based on Google Refine. OpenRefine transformations allow row/cell text and number operations (replacements, calculations). Using OpenRefine you can easily clean up your dataset.

## Environment

The OpenRefine transformation scripts are running in an isolated [Docker environment](https://developers.keboola.com/overview/docker-bundle/). The installed OpenRefine version is `2.6-rc.2`.

### Memory and Processing Constraints

The Docker container running the OpenRefine server and transformation has allocated 8GB of memory and the maximum running time is 6 hours.

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

### OpenRefine Sandbox

We're working hard on preparing OpenRefine Sandboxes. We'll launch OpenRefine server for you and load the desired table into the environment. Stay tuned for more information and meanwhile use OpenRefine locally.  

## Public Beta Warning

OpenRefine transformations are currently in public beta. Some features may not work as expected. Please bear with us while we polish all necessities, all feedback welcomed at [support@keboola.com](mailto:support@keboola.com). 
