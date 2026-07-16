---
title: Environment Specification
slug: 'extend/common-interface/environment'
---


Components use several [channels](/extend/common-interface/) to exchange information with Keboola,
primarily through [structured folders](/extend/common-interface/) and [configuration files](/extend/common-interface/config-file/).
Each component has full access to the external network.
Below are the specific aspects of the environment in which your component operates.

## Environment Variables
The following environment variables are injected into the container:

 - `KBC_DATADIR`: Always `/data/` in Keboola; use this variable during component development to create development and testing environments.
 - `KBC_RUNID`: The RunId from Storage; links all events within an API call (useful for logging).
 - `KBC_PROJECTID`: The ID of the project in Keboola within a [Keboola stack](/overview/).
 - `KBC_STACKID`: The ID of the [Keboola stack](/overview/).
 - `KBC_CONFIGID`: The ID of the configuration, or a hash of configuration data if the configuration is not named (e.g., when `configData` is used in an [API call](https://api.keboola.com/?service=job-queue#post-/jobs)).
 - `KBC_CONFIGVERSION`: The version of the configuration, or empty if unnamed (when `configData` is used in the [API call](https://api.keboola.com/?service=job-queue#post-/jobs)).
 - `KBC_COMPONENTID`: The ID of the component.
 - `KBC_CONFIGROWID`: The ID of the configuration row, if available.
 - `KBC_BRANCHID`: The ID of the [development branch](https://api.keboola.com/?service=storage#get-/v2/storage/dev-branches/-id-).
 - `KBC_STAGING_FILE_PROVIDER`: Either `aws` or `azure`, depending on the type of [stack](/overview/) the container is running. This value refers to the file storage used during [file import/export operations](/integrate/storage/api/import-export/).
 - `KBC_PROJECT_FEATURE_GATES`: A comma-separated list of feature gates activated for the current project. Feature gates are considered internal and may change or disappear without notice. We recommend checking with our support team before relying on any feature gates.
 - `KBC_COMPONENT_RUN_MODE`: Either `run` or `debug`. The value `debug` is used when the job is run in debug mode ([learn more](/extend/component/running/#debugging)). This variable can be helpful, for example, to enable more verbose logging.
 - `KBC_DATA_TYPE_SUPPORT`: Either `authoritative`, `hints`, or `none`:
   - `authoritative`: The component generates columns with data types in the schema node.
   - `hints`: The component generates columns without data types in the schema node.
   - `none`: The component generates only column names in the columns node. 

### Additional Variables for Forwarded Token and Token Details
 
 The following variables are available only if "Forwards token" and "Forwards token details" are
 enabled in the [component configuration](https://components.keboola.com/) (and approved by Keboola):

 - `KBC_PROJECTNAME`: The name of the project in Keboola.
 - `KBC_TOKENID`: The ID of the token running the container.
 - `KBC_TOKENDESC`: A description of the token (e.g., user name or token name).
 - `KBC_TOKEN`: The token itself.
 - `KBC_URL`: The Storage API URL.
 - `KBC_REALUSER`: The user ID provided by [SAML](https://en.wikipedia.org/wiki/Security_Assertion_Markup_Language) authentication.

### Additional Variables for GELF Logger
The following variables are available when the [GELF Logger](/extend/common-interface/logging/#gelf-logger) is enabled in the
[component configuration](https://components.keboola.com/):

- `KBC_LOGGER_ADDR`: The IP address of the GELF server.
- `KBC_LOGGER_PORT`: The port of the GELF server.

## Return Values
The script defined in the Dockerfile's `ENTRYPOINT` or `CMD` should provide an exit status. The
following rules apply:

- `exit code = 0`:  The execution is considered successful.
- `exit code = 1`:  The execution fails with a *User Error*.
Both STDOUT and [STDERR](https://en.wikipedia.org/wiki/Standard_streams#Standard_error_.28stderr.29) are sent to Storage API Events.
- `exit code > 1`:  The execution fails with an *Application Error*. Both STDOUT and STDERR are logged internally.

### Modifying Error Behavior
To report all errors as User Errors regardless of the exit code, set `no_application_errors` in the [component configuration](https://components.keboola.com/).
See the [implementation notes](/extend/component/implementation/) for tips on distinguishing between User Errors and Application Errors.
