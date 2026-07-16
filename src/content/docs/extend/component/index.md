---
title: Components
slug: 'extend/component'
redirect_from:
    - /extend/docker/
    - /extend/custom-science/
    - /extend/custom-science/development/

---


Components allow you to [extend](/extend/) Keboola.
The data interface to components is very similar to [Transformations](/transformations/) --- data is exchanged as
CSV files in [designated directories](/extend/common-interface/).

### Intro to Component Creation
As a developer, you implement the application logic in a language of your choice and store it in a
git repository. The component must adhere to our [common interface](/extend/common-interface/).
To start quickly, use our component generators for [Python](https://github.com/keboola/cookiecutter-python-component) or [PHP, CI pipelines](https://github.com/keboola/component-generator) that can generate a skeleton of the component for you. We also provide libraries to help you with implementation in
[Python](https://github.com/keboola/python-component) and
[PHP](https://github.com/keboola/php-docker-application).
Check our example component in [Python](https://github.com/keboola/cookiecutter-python-component/tree/main/%7B%7Bcookiecutter.repository_folder_name%7D%7D).

The main part of the [common interface](/extend/common-interface/) is the specification how 
[CSV files and designated folders](/extend/common-interface/folders/) are used to exchange data between Keboola and components:

- Applications process input tables stored in CSV files and generate result tables in CSV files.
- Extractors write results in the same way as applications, but instead of reading their
input from Keboola tables, they get it from an external source (usually an API).
- Writers, on the other hand, access their input tables in the same way as applications, but push their results into external systems and do not generate any Keboola tables.

Apart from this basic usage, the common interface offers many more features:

- Passing parameters
- Error control
- Working with metadata
- OAuth support
- Working with non-CSV files
- Logging configuration
- Etc.

Our [Job Queue](/extend/job-queue/) service makes sure that the common interface is honoured
from our side. It also takes care of executing your component in its own [isolated environment](/extend/job-queue/).

## Requirements
Before you start developing a new component, you should

- have a [Keboola project](/#development-project) where you can test your code.
- get yourself acquainted with Docker. You should be
able to run `docker` commands. Strictly speaking, you can get away
with not using them, but it will certainly speed things up for you.
- be able to send API requests. Although you can use the [api.keboola.com](https://api.keboola.com/) console, we
recommend using [Postman](https://www.getpostman.com/) as it is
more convenient. A list of [sample requests](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D?version=latest)
is available.
- have a git repository ([Github](https://github.com/) or [Bitbucket](https://bitbucket.org/) are recommended, 
although any other host should work as well).

You can work with your component in your Keboola projects immediately as soon as you
[create it](/extend/component/tutorial/). However, to make the component publicly available to all users,
it must be [published](/extend/publish/).

## Component Types
The following component types are currently allowed:

- **Extractor** -- a component designed to bring data into Keboola Storage
- **Writer** -- a component designed to bring data to an external system
- **Application** -- another arbitrary component
- **Processor** -- a [processor](/extend/component/processors/)
- **Code Pattern** -- a [code pattern](/extend/component/code-patterns/)
- Transformation -- a special type of component for transformations
- Other -- a completely special component

The type of a component has no effect on the component internals -- i.e., all components regardless of their type 
share the identical features of the [common interface](/extend/common-interface/). The component type just tells 
the end-user what behavior to expect from a given component. For example, an extractor is expected to extract data 
from an external system. Nothing prevents it from processing data from Storage 
(e.g., [Geocoding](/components/extractors/other/geocoding-augmentation/) does that), 
but its primary reason of existence is to bring data into Storage.

The expected behavior of the above component types can be described in more detail as follows: 

- **Extractor** -- extracts data from an external system into Storage, uses no Storage tables on input, has a UI.
- **Writer** -- loads data from Storage into an external system, generates no Storage tables on output, has a UI.
- **Application** -- processes data in Storage, either something like a wrapped transformation or using an external service. Or, it does not work with data in Storage at all. This component has a UI.
- **Processor** -- is designed for post-processing or pre-processing data of other components. It is not designed to run alone and has no UI.
- **Code Pattern** -- generates code for the transformation's component. This component has a UI.
- Transformation -- represents a transformation engine. The UI treats these components specially and expects that they have similar capabilities
and configuration options. These are created by Keboola. If you wish to bring your own, please contact us first.
- Other -- this component type has a special role in the UI, it has no standard component UI. Notable "other" components are:
    - `keboola.variables` -- Component for storing [variables](/integrate/variables/) configurations. Use the standard [configurations API](https://api.keboola.com/?service=storage#tag--Component-Configurations). No jobs can be made.
    - `keboola.storage` -- Placeholder component for actions from Storage service. Neither configurations nor jobs can be made. Use the
    [dedicated API](https://api.keboola.com/?service=storage) to work with Storage.

## Next Steps
- Create a [developer account](/extend/component/tutorial/#before-you-start) so that you can create your own components.
- Follow our [tutorial](/extend/component/tutorial/) to build a "Hello, World!" component in 10 minutes.
- Follow the [next steps](/extend/component/tutorial/input-mapping/) of the tutorial to understand how your component interacts with Keboola.
- See more about [testing and debugging of components](/extend/component/tutorial/debugging/) in the Keboola environment.
- Request [publication](/extend/publish/) of your component. 
