---
title: Implementation Notes
slug: 'extend/component/implementation'
redirect_from:
    - /extend/docker/images/
---


Here are some good practices in developing component code. They're best to be followed
across all components, especially if you want your component to be published. We also recommend
that you check our [component templates](https://github.com/keboola/component-generator).

Developing a component is a challenging task. To maximize your efficiency, follow these basic rules:

- **Do not repeat the functions of existing components.** For example, if you want to download data from Google Drive and transpose the
table, you do not have to create a component for that -- just load the table using the existing extractor and transpose it using
the existing R Transpose Table application.
- **Every component should do only one thing.** For example, if you want to extract data from an API and compute some metrics on them,
make two components -- one for extracting the data and a second one for computing the metrics.
- **Do as little data processing as possible.** As in the above example, having the processing tied to extraction makes it hard to
identify errors in data -- was it extracted incorrectly, or was it processed incorrectly? It also allows the end user to split the
task into smaller ones and have better control over their execution.
- **Avoid optional data modification.** For example, if you have a component which sometimes extracts data in ISO8892 encoding and sometimes
in UTF8 encoding, you do not need to implement this conversion in the component. You can let the end user configure
[processors](/extend/component/processors/) to load the incompatible data.
- **Avoid iterations.** For example, your component is downloading multiple files from a system and converts them to CSV files
for Storage import. You do not need to implement the loop around the files, you can use
[configuration rows](/storage/api/configurations/#configuration-rows) and implement processing of only a single table.

Before you create any complex components, be sure to read about
[configurations](/storage/api/configurations/) and [processors](/extend/component/processors/)
as they can substantially simplify your component code. We also recommend that you use our
[common interface](/extend/common-interface/) library, which is available for
[Python](/extend/component/implementation/python/#using-the-kbc-package),
[R](/extend/component/implementation/r/#using-the-kbc-package),
and [PHP](/extend/component/implementation/php/#using-the-kbc-package).
You may use any Docker image you see fit. We recommend to base your images on those from an [official repository](https://hub.docker.com/search?q=&type=image)
because they are the most stable ones.

## Memory
Keboola [components](/extend/component/) can be used to process substantial amounts of data (i.e., dozens of gigabytes), which are not
going to fit into memory. Every component should therefore be written so that it processes data in chunks of
a limited size (typically rows of a table). Many of the Keboola components run with less than 100MB memory.
While the Keboola platform is capable of running jobs with ~8GB of memory without problems, we are not particularly
happy to allow it, and we certainly do not want to allow components where the amount of used memory
depends on the size of the processed data.

## Error Handling
Depending on the component [exit code](/extend/common-interface/environment/#return-values), the component job is marked as
successful or failed.

- `exit code = 0`  The job is considered **successful**.
- `exit code = 1`  The job fails with a **user error**.
- `exit code > 1`  The job fails with an **application error**.

During a component execution, all the output sent to STDOUT is captured and sent live to job events.
The output to [STDERR](https://en.wikipedia.org/wiki/Standard_streams#Standard_error_.28stderr.29) is captured too, and
in case the job is successful or fails with a user error, it is displayed as the last event of the job. In case the
job ends with an application error, the entire contents of STDERR is hidden from the end user and sent only to
vendor internal logs. The end user will see only a canned response ('An application error occurred') with
the option to contact our support.

This means that you do not have to worry about the internals of your component leaking to the end user provided that
the component exit code is correct. On the other hand, the user error is supposed to be solvable by the end user. When creating an error message, stick by the following rules:

- Avoid **nonsense** messages. For example: 'Banana Error: Exceeding trifling witling' or only numeric errors.
- Avoid **errors users cannot solve**. For example: 'An outdated OpenSSL library, update to OpenSSL 1.0.2'.
- Provide **guidance** on what the user should do. For example: 'The input table is missing; make sure the output mapping destination is set to `items.csv`'.
- Avoid deliberate **leaking** sensitive information. For example: credentials, tokens. The output of each component is [filtered](/extend/common-interface/logging/#standard-output-and-standard-error) to prevent *accidental* leaks of sensitive information. That means you don't need to implement filtering for example for exception messages.

Also keep in mind that the output of the components (job events) serve to pass only informational and error messages; **no data** can be passed through.
The event message size is limited (about 64KB). If the limit is exceeded, the message will be trimmed. If the component produces
obscene amount (dozens of MBs) of output in a very short time, it may be terminated with an internal error.
Also make sure your component does not use any [output buffering](#language-specific-notes), otherwise all events will be cached after the application finishes.

## Implementing Processors
[Processors](/extend/component/processors/)
allow the end user to customize the input to the component and the output from it. That means
that many custom requirements can be solved by processors, keeping the component
code general.

Choosing whether to implement a specific feature as a processor or as part of your
component may be difficult. A processor might be a good solution if the following are true:

- The feature is **optional** (not all end users are interested in it).
- The feature is **simple** (one operation, contains no internal logic).
- The feature is **universal** (it is always applied to all input/output or none).

The first condition is especially important. Another way to read it is that a processor must never supply a function expected from the component.
In other words: **Each component should be able to consume/generate a valid input/output without any processors.** For example, if an extractor can
produce tables without any further processing, good, let it be tables, but if can not, it should output only files and processors should do the rest.
If processors are used together with [configuration rows](/storage/api/configurations/#configuration-rows),
the last condition is weakened, because a different set of processors may be applied to each configuration row.

### Design
Implementing a processor is in principle the same as implementing any other
[component](/extend/component/). However, processors are designed to be
[single responsibility](https://en.wikipedia.org/wiki/Single_responsibility_principle) components. This
means, for example, that processors should require no or very little configuration, should not communicate
over a network and should be fast.

Processors take data from the `in` [data folders](/extend/common-interface/folders/) and
store it in the `out` [data folders](/extend/common-interface/folders/) as any other components. Keep in mind, however,
that any files not copied to the `out` folders will be ignored (i.e., lost). That means if a processor is supposed to
"not touch" something, it actually has to copy that something to the `out` folder.

The processors should be aware of [manifest files](/extend/common-interface/manifest-files/). This means that
the processor:

- Must exclude manifests from processing (they are not data files).
- If the processor changes something stored in the manifest, it must process it (read the manifests in `in` folder, modify and store it in the `out` folder). Typical example is modification of table columns which must be reflected in the manifest.
- If the processor is doing change unrelated to manifest, it should copy the manifest from `in` to `out`.
- If the processor is not doing a 1:1 operation (e.g merges multiple tables into one), it should not do anything about the manifest, which means that it will be discarded.

Keep in mind that processors can be [chained](/extend/component/processors/#chaining-processors);
you can, for example, rely on

- the table CSV files being in [standard format](/storage/tables/csv-files/#output-csv-format).
- table manifest always present.
- the CSV file being orthogonal.

If the above conditions are not met, then another processor should be added before yours. I.e. you should keep the
processor simple and delegate the assumptions to other processors (and [**document** them](#publishing-a-processor)). If possible the
processor should also assume that the CSV files are headless and stored in arbitrary sub-folders. When implemented with this assumption
the processor will support [sliced tables](/extend/common-interface/folders/#sliced-tables).

### Publishing Processor
The process of processor registration is the same as [publishing any other component](/extend/publish/).
However, many of the fields do not apply, because processors have no UI.
The following fields are important:

- Vendor
- Component name and component type (`processor`)
- Short and full description
- Component documentation (`documentationUrl`)
    - must be public
    - must state whether the processor is capable of working with [sliced tables](/extend/common-interface/folders/#sliced-tables)
    - whether it requires/processes manifests
