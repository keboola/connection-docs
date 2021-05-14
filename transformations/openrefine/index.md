---
title: OpenRefine Transformation
permalink: /transformations/openrefine/
redirect_from:
    - /manipulation/transformations/openrefine/

---

* TOC
{:toc}

[OpenRefine](http://openrefine.org/) is an open source project based on Google Refine.
OpenRefine transformations allow row/cell text and number operations such as replacements and calculations.
And you can easily clean up your dataset, too.

## Environment

The OpenRefine transformation scripts are running in an isolated [Docker environment](https://developers.keboola.com/integrate/docker-bundle/).
The installed OpenRefine version is `2.6-rc.2`.

### Memory and Processing Constraints

The Docker container running the OpenRefine server and transformation has 8GB of allocated memory.
7GB of that is allocated directly to OpenRefine. In our experience, this memory limit is enough to process ~2M 
rows or 0.5GB of raw CSV data. The maximum running time is 6 hours.

### Inputs/Outputs

As OpenRefine uses only one dataset as its input, and produces one dataset as its result,
the [input and output mapping](/transformations/mappings/) is limited to exactly one input/output.

## Development Tutorial

To develop and debug OpenRefine transformations, you can replicate the execution environment on your local machine.
To do so, have [OpenRefine installed](http://openrefine.org/download.html) (preferably the same version as us).

{: .image-popup}
![Screenshot - OpenRefine Welcome Screen](/transformations/openrefine/screen.png)

To simulate the [input and output mapping](/transformations/mappings/),
all you need to do is create a project with the desired CSV file.

{: .image-popup}
![Screenshot - OpenRefine CSV Load](/transformations/openrefine/loadcsv.png)

Then use the UI to modify the file according to your needs, and click the **Extract** button in the **Undo/Redo** tab.

{: .image-popup}
![Screenshot - OpenRefine Operation History](/transformations/openrefine/operationhistory.png)

And finally, copy the Operation History JSON to the transformation script.

{: .image-popup}
![Screenshot - OpenRefine Extract Operation History](/transformations/openrefine/operationhistoryextract.png)

### OpenRefine Sandbox

We are working hard on preparing OpenRefine Sandboxes.
After launching the OpenRefine server for you, we will load the desired table into the environment.
Stay tuned for more information and, meanwhile, use OpenRefine locally.

## Public Beta Warning

OpenRefine transformations are currently in public beta. Some features may not work as expected.
Please bear with us and provide feedback at [support@keboola.com](mailto:support@keboola.com).
