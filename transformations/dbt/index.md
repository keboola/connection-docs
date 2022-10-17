---
title: dbt Transformation
permalink: /transformations/dbt/
---

* TOC
{:toc}

[dbt™](https://www.getdbt.com/) is a transformation workflow that lets teams quickly and collaboratively deploy analytics code. It follows software engineering best practices like modularity, portability, CI/CD, and documentation. 
Now anyone who knows SQL can build production-grade data pipelines.

Keboola brings dbt components to define, control, execute and schedule dbt in the context of the full data pipeline. This means that users can use dbt the same way as they use other components. They are versioned, can be manually run and/or scheduled, controlled via CLI and all actions are captured in the metadata layer.

## Prerequisites

Users can either start with their existing dbt code project in a repository (private or public), or start with Keboola CLI to create development environment for creating dbt project from the scratch.

*   All **new PAYG projects** will have those features activated by default.

*   All **existing projects** can request the activation through support request.


## Use cases and components

Users can schedule and run dbt code on three types of environment:

*   Run dbt within Keboola on Keboola storage

*   Run dbt on an external DWH. In other words, execute remote jobs within their own DWH

*   Orchestrate dbt cloud jobs and extract details from dbt cloud API


All components can be used in the flows, thus orchestrated with data pipeline definitions.

<table data-layout="wide">
<tbody>
<tr>
    <th>
        <span>
            <img loading="lazy" src="imgs/table-keboola.png" width="226px" alt="keboola">
        </span>
        <p style="text-align: center;">
            <strong>Keboola infrastructure</strong>
        </p>
    </th>
    <th>
        <span>
            <img loading="lazy" src="imgs/table-remote.png" width="226px" alt="remote warehouse">
        </span>
        <p style="text-align: center;">
            <strong>Customer external DWH</strong>
        </p>
    </th>
    <th>
        <span>
            <img loading="lazy" src="imgs/table-dbt.png" width="226px" alt="dbt">
        </span>
        <p style="text-align: center;">
            <strong>dbt cloud</strong>
        </p>
    </th>
</tr>
<tr>
    <td>
        <p style="text-align: center;">
            <em>Keboola provisions all infrastructure automatically, including the development environment.</em>
        </p>
    </td>
    <td>
        <p style="text-align: center;">
            <em>Customer uses own external infrastructure and development environments.</em>
        </p>
    </td>
    <td class="confluenceTd">
        <p style="text-align: center;">
            <em>Development is provided by dbt cloud and execution is defined by user on own infrastructure.</em>
        </p>
    </td>
</tr>
<tr>
    <td style="vertical-align: top !important;">
        <p>Go to:</p>
        <ul>
            <li>Transformations</li>
            <li>Create new transformation</li>
            <li>dbt transformation</li>
            <li>Keboola Storage (default)</li>
        </ul>  
    </td>
    <td style="vertical-align: top !important;">
        <p>Go to:</p>
        <ul>
            <li>Transformations</li>
            <li>Create new transformation</li>
            <li>dbt transformation</li>
            <li>select your DWH type</li>
        </ul> 
    </td>
    <td style="vertical-align: top !important;">
        <p>Go to:</p>
        <ul>
            <li>Components</li>
            <li>search for "dbt"</li> 
        </ul>  
    </td> 
</tr>
<tr>
    <td style="vertical-align: top !important;">
        <img width="226px" loading="lazy" src="imgs/table-dbt-transformation.png" alt="dbt transformation" />
    </td>
    <td style="vertical-align: top !important;">
        <span>
            <img width="226px" loading="lazy" src="imgs/table-dbt-transformation-remote.png" alt="dbt transformation - remote" />
        </span>
    </td>
    <td style="vertical-align: top !important;">
        <span>
            <img width="226px" loading="lazy" src="imgs/table-dbt-components.png" alt="dbt components" />
        </span>
    </td>
</tr>
<tr>
    <td style="vertical-align: top !important;">
        <p>When defining a dbt transformation configuration, use the output mapping to define tables from the execution to be imported within Keboola storage.</p>
        <p>The execution engine stores artifacts and job run details in Keboola Metastore.</p>
        <p>Additionally, transformation UI provides deeper insights (thanks to artifacts) into the execution run, such as Timeline visualization and dbt docs.</p>
    </td>
    <td style="vertical-align: top !important;">
        <p>Data is being transformed in a user’s DWH so no data is being transferred to Keboola platform. However, the execution engine stores artifacts and job run details in Keboola Metastore.</p>
        <p>Additionally, transformation UI provides deeper insights (thanks to artifacts) into the execution run, such as Timeline visualization and dbt docs.</p>
    </td>
    <td style="vertical-align: top !important;">
        <p>To <strong>trigger dbt cloud jobs</strong>, use Trigger App:</p>
        <img alt="dbt Cloud Trigger app" loading="lazy" src="imgs/table-dbt-components-trigger.png" width="226px">
        <p>User can opt to wait for results and store job artifacts and job run details in Keboola Metastore.</p>
        <p>To <strong>extract metadata from dbt cloud</strong>, use dbt Cloud API data source:</p>
        <img loading="lazy" src="imgs/table-dbt-components-cloud-api-ex.png" alt="dbt Cloud API extractor" width="226px">
    </td>
</tr>
</tbody>
</table>

Note: Each component can have multiple configurations. They can differ by any configuration parameters. It is expected users will have different configurations for different repositories, but it is also possible for users to have different configurations for different branches (dev, prod, etc.), different run parameters (such as `tag: nighly`, model specification, etc.), or models to orchestrate portion of the dbt mono-repo.

When using dbt transformation on Keboola infrastructure, user can additionally setup CLI with local development environment against provisioned infrastructure (workspace). Please see dbt CLI section for more information.
