---
title: GoodData
permalink: /components/writers/bi-tools/gooddata/
redirect_from:
    - /writers/bi-tools/gooddata/
---

* TOC
{:toc}

This writer sends tables into a [GoodData](https://www.gooddata.com/) project and can be used with
either your own GoodData account or with an account provided by Keboola. Before configuring the GoodData writer, it
is important to understand that GoodData analytics relies on a
[Logical Data Model (LDM)](https://help.gooddata.com/doc/en/building-on-gooddata-platform/data-modeling-and-logical-data-model) of your dataset.
The GoodData writer creates the LDM for you, so that you don't have to use CloudConnect or other tools
provided by GoodData. However, you need to provide all the required information in the configuration. This makes
the configuration non-trivial, and you should have the data model designed before you start configuring
the writer.

Check out the section on [writing into GoodData](/tutorial/write/gooddata/) available for you
in our Getting Started tutorial. You can also watch our [GoodData Writer Demo](https://www.youtube.com/watch?v=h46t0_nOtyI) video.

## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Facebook Ads** extractor.

The first step is to configure the GoodData project that will be used for writing:

{: .image-popup}
![Screenshot - Main Page](/components/writers/bi-tools/gooddata/gooddata-1.png)

## Project Setup
There are several options in the configuration dialog:

{: .image-popup}
![Screenshot - Project Setup](/components/writers/bi-tools/gooddata/gooddata-2.png)

Here you need to enter a project name and choose the type of the project. You can 

- create a **demo** project. This is provided for free by Keboola and expires in 1 month. Extension is not
possible, but the GoodData project may be transferred to production through a support request. Each KBC
project can have up to 2 demo GoodData projects.
- create a **production** project. This is full GoodData production project, which is proxied by Keboola.
That means we take care of the contract and billing with GoodData. Contact Keboola support or your maintainer
to enable this type of production GoodData project in your KBC project.
- create a **custom** project. Use this when you have your own contract with GoodData. In that case, you should
have received your [Project Authorization Token](https://help.gooddata.com/doc/en/building-on-gooddata-platform/gooddata-integration-into-your-application/set-up-user-authentication-and-sso/gooddata-token-types#GoodDataTokenTypes-ProjectAuthorizationtokens)
which allows you to create GoodData projects. The writer will then create the project for you.
- use an **existing GoodData project**. Either the project should be empty, or you should take extra care when setting
up the writer. Either use the **Load data only** update mode, or be sure to understand what the consequences
of changing your LDM are.

After you set up the project, you can see the **Go To Project** button. This will allow you to login to the GoodData project
from within your KBC project using [Single Sign-On (SSO)](https://help.gooddata.com/doc/en/building-on-gooddata-platform/gooddata-integration-into-your-application/set-up-user-authentication-and-sso/single-sign-on-overview). (SSO access works only for projects provisioned by Keboola. If you used an existing project, you will have to login on your own.)

{: .image-popup}
![Screenshot - Access Project](/components/writers/bi-tools/gooddata/gooddata-3.png)

## Date Dimension
[Date dimension](https://help.gooddata.com/doc/en/reporting-and-dashboards/dates-and-times) is an important concept of the GoodData LDM.
It is the question of the LDM design to determine for which columns a date dimension should be created. One rule of thumb
is that different date columns in a single table should have different date dimensions. On the other hand, you might want
to share a date dimension between different tables --- a *main* date representing an event of something.
It is also possible to have different date dimensions representing e.g.
a calendar year and a fiscal year.

{: .image-popup}
![Screenshot - Add Date Dimension](/components/writers/bi-tools/gooddata/gooddata-4.png)

When creating a date dimension, you have to enter the dimension name and a dimension template. The available templates are:

- Standard GoodData date dimension
- Keboola date dimension, which is extended with a 'floating' week (which lets you analyze data as if the week starts e.g. on Wednesday).
- Custom date dimension -- this can be either a date dimension created for you directly by GoodData, or a [Self service calendar](https://help.gooddata.com/doc/en/reporting-and-dashboards/dates-and-times/custom-calendars-self-service). In the former case, you'll have the dimension URN in form `urn:my-company-dimension:date`, enter `my-company-dimension` as *Template ID*. For the latter case, enter `custom` as the *Template ID*.

## Configure Tables
Click the **New Table** button to add a new table to the writer:

{: .image-popup}
![Screenshot - Add Table](/components/writers/bi-tools/gooddata/gooddata-5.png)

Select an existing table from the [Storage](/storage/tables/) and enter a *Title* which will be used for the table in
the GoodData project (you can change the title later if needed). The next step is to configure the table columns.

### Table Columns

{: .image-popup}
![Screenshot - Configure Columns](/components/writers/bi-tools/gooddata/gooddata-6.png)

Setting the table columns involves configuration of three things:

- **Title** of the column which is displayed in the GoodData project.
- **Data Type** of the column. You can choose from `INT`, `BIGINT`, `DECIMAL` for numbers, `VARCHAR` for texts.
Consult the [GoodData documentation](https://help.gooddata.com/doc/en/building-on-gooddata-platform/data-modeling-and-logical-data-model/xae-product-introduction/maql-ddl#MAQLDDL-SpecifyaDATATYPE) for
the limits of each data type.

- **Type** of the column which defines the role of the column in LDM. Column types are:
    - `IGNORE` --- The column is excluded from the load and will not be created in the GoodData project.
    - `FACT` --- The [Fact component](https://help.gooddata.com/doc/en/building-on-gooddata-platform/data-modeling-and-logical-data-model/gooddata-modeling-concepts#GoodDataModelingConcepts-LDMComponents) --- a numerical piece of arbitrary data used to define metrics, e.g. *Price* column.
    - `ATTRIBUTE` --- The [Attribute component](https://help.gooddata.com/doc/en/building-on-gooddata-platform/data-modeling-and-logical-data-model/gooddata-modeling-concepts#GoodDataModelingConcepts-LDMComponents) of the LDM model --- a discrete set of alphanumeric or numeric data, e.g. *Eye Color* column containing values *Blue*, *Brown* and *Green*.
    - `CONNECTION_POINT` --- The [Connection point component](https://help.gooddata.com/doc/en/building-on-gooddata-platform/data-modeling-and-logical-data-model/working-with-your-data-model-in-cloudconnect-logical-data-modeler/learning-data-modeling-by-doing/working-with-objects-in-your-data-model/adding-objects-to-your-project/data-model-object-types/connection-point) --- acts like a primary key, i.e. it is used to identify the rows of the table.
    - `REFERENCE` --- A column which defines a [Relation](https://help.gooddata.com/doc/en/building-on-gooddata-platform/data-modeling-and-logical-data-model/gooddata-modeling-concepts#GoodDataModelingConcepts-LDMComponents) between tables. You have to select a **Reference** column as a target to which the relation points to. The target must be a `CONNECTION_POINT` already defined in another table.
    - `DATE` --- A date column --- you have to select a corresponding [date dimension](#date-dimension) for it.
    - `LABEL` --- A [Label attribute](https://help.gooddata.com/doc/en/building-on-gooddata-platform/data-modeling-and-logical-data-model/working-with-your-data-model-in-cloudconnect-logical-data-modeler/learning-data-modeling-by-doing/creating-your-first-data-model/getting-started-building-your-first-logical-data-model/notes-on-labels) which allows you to display alternative values for a column. You have to select a **Reference** column, which is the name of an attribute column in the same table. The label column is used as a secondary view of the reference column in the GoodData UI. For example, you can create a reference column `FullName` and add a label column `Surname`. You can define multiple labels for a single attribute.
    - `HYPERLINK` --- A [Hyperlink attribute](https://help.gooddata.com/doc/en/building-on-gooddata-platform/data-modeling-and-logical-data-model/working-with-your-data-model-in-cloudconnect-logical-data-modeler/learning-data-modeling-by-doing/working-with-objects-in-your-data-model/adding-objects-to-your-project/data-model-object-types/hyperlink), which acts as a link in the reports. You have to select a **Reference** which is the name of an attribute column in the same table. The reference column is the one which will be used as a label, the hyperlink column is the one which is expected to contain the address.

{: .image-popup}
![Screenshot - Hyperlink configuration](/components/writers/bi-tools/gooddata/gooddata-7.png)

**Save** your configuration.

### Additional Table Options

{: .image-popup}
![Screenshot - Incremental configuration](/components/writers/bi-tools/gooddata/gooddata-8.png)

You can also select a load type: **Full Load** (the default), **Automatic Incremental Load** or **Manual Incremental Load**. 
Incremental load will keep the existing data in the GoodData project.
It can be much faster, but the source data needs to be correctly prepared. 
The incremental load relies on the following two features:

- [Incremental processing](/storage/tables/#incremental-processing) in Storage, and
- Identity in GoodData; this can be either a `CONNECTION_POINT` column (which acts as a database primary key), or a [Fact Grain](https://help.gooddata.com/doc/en/building-on-gooddata-platform/data-modeling-and-logical-data-model/data-modeling-tutorials/set-the-grain-of-a-fact-table-to-avoid-duplicate-records) (which acts as a compound unique key). Fact Grain can be used when there is no single identifying column (i.e. there is no `CONNECTION_POINT`) and there is a combination of columns which can be used to identify rows. If there is no such combination, then incremental loading can't be used.

From the table configuration page, you can also **Run** a load of a single table. However, if the table has relations to other
tables, it will fail with the message: `Schema reference of column 'X' of dataset Y is invalid.`

## Writing Data
There are multiple options how you can write data to a GoodData project:

{: .image-popup}
![Screenshot - Table Load Settings](/components/writers/bi-tools/gooddata/gooddata-9.png)

By default, the LDM is updated with each run of the writer. If your project structure settled down and does not
change often, you may wish to switch to **Load data only** mode. This saves some time from each run and also
is somewhat safer against inadvertent changes of the model. When you change the LDM definition in the writer and load data
without updating the model, you're likely to receive an error similar to this: `"The object identifier "XY" mentioned in the manifest
does not represent a valid object. Adjust the manifest or create the object."`.

Another option is to switch between **Separate load** and
**Multiload**. These represent different modes of transferring data into GoodData, and depending on the size and nature
of your project, either of them may be faster.

### GoodData Project
Since the project is partially managed by the writer, there are some things you should be aware of.

The writer manages the LDM in the project. If you make changes to the LDM using other tools, they will be overwritten by the writer 
--- unless it is used solely in **Load data only** mode. You can review the LDM in the GoodData project management:

{: .image-popup}
![Screenshot - GoodData Logical Data Model](/components/writers/bi-tools/gooddata/gooddata-model.png)

The writer creates service users which are used to update the LDM and manage the SSO (`Keboola GoodData` and `provisioning (KBC)`). 
You should not disable those users or change their role. Any KBC project user can enter the GoodData project using 
the [SSO](https://help.gooddata.com/doc/en/building-on-gooddata-platform/gooddata-integration-into-your-application/set-up-user-authentication-and-sso/single-sign-on-overview). Once they activate the SSO, a new user will be created 
for them in the GoodData project (these users have `(KBC)` suffix and `@kbc.keboola.com` login).

{: .image-popup}
![Screenshot - GoodData project users](/components/writers/bi-tools/gooddata/gooddata-users.png)

When you delete a writer that created a GoodData project, that project will also be deleted after a [grace period](/management/project/delete/#gooddata-projects). When you delete a writer that was connected to an existing project, it won't be deleted.
