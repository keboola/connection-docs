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


#### Example output

`kbc dbt init` prints environment variables to stdout and generates the dbt files shown below. **All values here are placeholders** — use the exact values from your own `kbc dbt init` output, and never commit secrets (storage token, password) to the repository.

Environment variables (printed to stdout — store them in your shell profile, e.g. `~/.zshrc`):

```shell
export KBC_STORAGE_API_TOKEN=<your_storage_api_token>   # secret — do not commit
export DBT_KBC_TARGET1_TYPE=snowflake
export DBT_KBC_TARGET1_ACCOUNT=<account>
export DBT_KBC_TARGET1_DATABASE=<database>
export DBT_KBC_TARGET1_WAREHOUSE=<warehouse>
export DBT_KBC_TARGET1_SCHEMA=<schema>
export DBT_KBC_TARGET1_USER=<user>
export DBT_KBC_TARGET1_PASSWORD=<password>              # secret — do not commit
export DBT_KBC_TARGET1_THREADS=4
```

Generated `profiles.yml`:

```yaml
default:
  outputs:
    target1:
      type: "{{ env_var('DBT_KBC_TARGET1_TYPE') }}"
      account: "{{ env_var('DBT_KBC_TARGET1_ACCOUNT') }}"
      database: "{{ env_var('DBT_KBC_TARGET1_DATABASE') }}"
      warehouse: "{{ env_var('DBT_KBC_TARGET1_WAREHOUSE') }}"
      schema: "{{ env_var('DBT_KBC_TARGET1_SCHEMA') }}"
      user: "{{ env_var('DBT_KBC_TARGET1_USER') }}"
      password: "{{ env_var('DBT_KBC_TARGET1_PASSWORD') }}"
      threads: "{{ env_var('DBT_KBC_TARGET1_THREADS') | as_number }}"
  target: target1
```

Generated source file — one per Storage bucket (for example `models/_sources/in.c-test.yml`). `_timestamp` is added automatically, alongside the primary keys and their `unique` and `not_null` tests:

```yaml
version: 2

sources:
  - name: in.c-test
    schema: in.c-test
    tables:
      - name: <table_name>
        columns:
          - name: <primary_key_column>
            tests:
              - unique
              - not_null
          - name: _timestamp        # filled automatically by Keboola
```

Store credentials to your shell env profile (or your respective environment):
---------------------------------------------------------------------------

On Unix, add the `export` lines above to `~/.zshrc` (or your shell profile). Then you can run dbt locally against the project storage, safely develop and test your code.

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
