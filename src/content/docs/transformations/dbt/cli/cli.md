---
title: dbt CLI
slug: 'transformations/dbt/cli'
description: Set up local dbt development with the Keboola CLI — install it, run kbc dbt init, store credentials, and run dbt debug and dbt run against your project Storage.
keywords:
  - dbt CLI
  - Keboola CLI dbt
  - kbc dbt init
  - local dbt development
  - dbt debug run
type: how-to
---

Video:
<iframe width="560" height="315" src="https://www.youtube.com/embed/q3wZ8gukpnw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Local Development

Let's set up the local development with [Keboola CLI](https://developers.keboola.com/cli/).

It is easy on Mac with [homebrew](https://docs.brew.sh/Installation.html) support (other platforms covered in the [documentation](https://developers.keboola.com/cli/installation/)):

```java
brew tap keboola/keboola-cli
brew install keboola-cli
kbc --version
```

If you already have CLI, make sure you have the most updated version:

```java
brew upgrade keboola-cli
kbc --version
```

**You will then gain access to dbt-related commands within Keboola CLI!**

### Steps

**initial setup**

You must have a Keboola project, a cloned git repository with a dbt project, and the dbt binary installed.

The user is in the folder with the cloned dbt project and can run the following commands.

`kbc dbt init`
--------------

1.  Creates a Snowflake workspace.

2.  Generates `profiles` and `sources` yaml files.

    1.  `DBT_KBC_DEV_{ENV_NAME}_DATABASE` (we ask for env name)

3.  Generates env vars (used `profiles.yml`).

4.  They are outputted to stdout.


Store credentials to your zsh env profile (or your respective environment):
---------------------------------------------------------------------------

The file is located (Unix) in `~/.zshrc`. Add the environment variables that `kbc dbt init` printed to stdout.

Then you can run dbt locally against the project storage, safely develop and test your code.

As part of the init command, CLI will create all sources from storage buckets. A storage bucket becomes a dbt source file containing its tables.

<!-- TODO(human-review: add generated source-file example) The original screenshot
     showed a generated dbt source file for a bucket; its exact contents can't be
     reconstructed from the page text. Add a short fenced YAML example. -->

*Note: Please note that `_timestamp` is automatically filled, alongside `primary keys` and corresponding `tests` for primary keys (`unique` and `not_null` tests).*

### Run Test Debug

```java
dbt debug -t beer_demo --profiles-dir .
```

**Notes**

*   `beer_demo` is the target name used in the prior step and visible in profiles.yml


*   We are using local profiles; they are using environmental variables stored before.


All checks should pass (shown in green).

dbt Run
-------

For the script alteration, the only check/change you have to make with off-the-shelf scripts is to alter source definitions to match sources.

To execute the dbt:

```java
dbt run -t beer_demo  --profiles-dir .
```

### Other Commands for Future Use

`kbc dbt generate profile`
--------------------------

*   Generates just `profiles.yml`.

*   Reads the profile name from `dbt_project.yml` and the `target` name from the input.

*   Stores the profile to `profiles.yml`.

    *   If there is an existing profile with the same name, it will be overwritten. Otherwise, the new profile will be just appended to the others if there are any.

*   Can be run in non-interactive mode.

`kbc dbt generate sources`
--------------------------

*   Generates only `sources.yml`.

*   Lists all tables in the default branch from the Storage API and generates source files to `models/_sources`. Tables from each bucket are stored in a separate file.

*   Can be run in non-interactive mode.

`kbc dbt generate env`
----------------------

*   Generates bash commands to create env vars for dbt CLI.

*   Asks for an existing workspace (select box or id flag).

*   Can be run in non-interactive mode.

### Workspaces Support

*   Universal support to manage workspaces

*   Hide `keboola.sandboxes` configurations from the Keboola project folder structure.


### `kbc remote workspace create`

*   Supports parameter `name`, `type`, and `size` (for `python` and `r`).

*   Can be run in non-interactive mode.
