---
title: Generic Extractor
slug: 'extend/generic-extractor'
---


Generic Extractor is a [Keboola component](/overview/) that acts like a customizable
[HTTP REST](/extend/generic-extractor/tutorial/rest/) client. It can be configured to extract data
from virtually any sane web API.

Due to the versatility of different APIs running in the wild, Generic Extractor offers many [**configuration options**](/extend/generic-extractor/configuration/). 

You may opt to use the [**visual builder**](/extend/generic-extractor/configuration/#user-interface), which provides a very convenient way 
of configuring and testing the configuration. With it, you can build
an entirely new extractor for Keboola in **less than an hour**.

![Generic Extractor - UI](/extend/generic-extractor/ui.png)

To get started quickly, follow our [Generic Extractor tutorial](/extend/generic-extractor/tutorial).

## Generic Extractor Requirements
Generic Extractor allows you to extract data from an API into Keboola only by configuring it.
No programming skills or additional tools are required. You just need to do two easy things before you start:

- Become familiar with [JSON format](/extend/generic-extractor/tutorial/json/).
- Have the documentation of your chosen API at hand. The API should be [RESTful](/extend/generic-extractor/tutorial/rest/)
and, more or less, follow the HTTP specification.

## Configuration & Development
Again, if you are new to Generic Extractor, we strongly suggest you go through the
[Generic Extractor tutorial](/extend/generic-extractor/tutorial/). It outlines the basic principles and the most important features.

With the new convenient user interface, you can set up and test the connection in a few clicks, 
just like you are used to in some other popular API development tools. 

Features such as cURL import, request tests, output mapping generator, or dynamic function templates and evaluation make the configuration process as easy as ever.

If you intend to develop a more complicated configuration, check out how to [run Generic Extractor locally](/extend/generic-extractor/running/).
The documentation includes [several examples](https://github.com/keboola/generic-extractor/tree/master/doc) that [can also be run locally](/extend/generic-extractor/running/#running-examples).

## Publishing Generic Extractor Configuration
Each Generic Extractor configuration can be [published](/extend/generic-extractor/publish/) as
a new standalone component. However, for registration, configurations must be
[converted to templates](/extend/generic-extractor/publish/#submission).

Publishing your Generic Extractor configuration is **not required**. However, when published,
it can be easily used in multiple projects. A great advantage of using templates is that they
do not limit the configuration. You can always switch to JSON
[free-form configuration](/extend/generic-extractor/publish/#submission) when necessary.

Also, templates can be used only with published components based on Generic Extractor configurations.

## Generic Extractor Source
As with other Keboola components, the Generic Extractor connector is available on
[GitHub](https://github.com/keboola/generic-extractor/). Apart from the
main repository, it uses some vital libraries (which partially define its capabilities):

- [Juicer](https://github.com/keboola/juicer) --- component responsible for processing HTTP JSON responses
- [CSV Map](https://github.com/keboola/php-csvmap) --- library that converts JSON data into CSV tables
- [Filter](https://github.com/keboola/php-filter) --- library that allows to match values together
- [JSON Parser](https://github.com/keboola/php-jsonparser) --- JSON parser which produces CSV tables while maintaining relations
