---
title: dbt CLI
slug: 'transformations/dbt/cli'
---

Video:
<iframe width="560" height="315" src="https://www.youtube.com/embed/q3wZ8gukpnw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Local Development

Let's set up the local development with [Keboola CLI](/cli/keboola-as-code/).

It is easy on Mac with [homebrew](https://docs.brew.sh/Installation.html) support (other platforms covered in the [documentation](/cli/keboola-as-code/installation/)):

```bash
brew tap keboola/keboola-cli
brew install keboola-cli
kbc --version
```

If you already have CLI, make sure you have the most updated version:

```bash
brew upgrade keboola-cli
kbc --version
```

![](imgs/2772467715.png)

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


### Example

![](imgs/2770010115.jpg)

Store credentials to your zsh env profile (or your respective environment):
---------------------------------------------------------------------------

The file is located (Unix) in `~/.zshrc`

![](imgs/2770206732.png)

Then you can run dbt locally against the project storage, safely develop and test your code.

As part of the init command, CLI will create all sources from storage buckets. A storage bucket is a source file containing tables:

![](imgs/2777448699.png)

*Note: Please note that `_timestamp` is automatically filled, alongside `primary keys` and corresponding `tests` for primary keys (`unique` and `not_null` tests).*

### Run Test Debug

```bash
dbt debug -t beer_demo --profiles-dir .
```

**Notes**

*   `beer_demo` is the target name used in the prior step and visible in profiles.yml


*   We are using local profiles; they are using environmental variables stored before.


![](imgs/2769649699.png)

You should see green in all steps:

![](imgs/2770239505.png)

dbt Run
-------

For the script alteration, the only check/change you have to make with off-the-shelf scripts is to alter source definitions to match sources:

![](imgs/2769879073.png)


![](imgs/2770042889.png)

To execute the dbt:

```bash
dbt run -t beer_demo  --profiles-dir .
```

![](imgs/2769879081.png)

### Other Commands for Future Use

`kbc dbt generate profile`
--------------------------

*   Generates just `profiles.yml`.

*   Reads the profile name from `dbt_project.yml` and the `target` name from the input.

*   Stores the profile to `profiles.yml`.

    *   If there is an existing profile with the same name, it will be overwritten. Otherwise, the new profile will be just appended to the others if there are any.

*   **Example** (non-interactive mode):


![](imgs/2770010121.jpg)

`kbc dbt generate sources`
--------------------------

*   Generates only `sources.yml`.

*   Lists all tables in the default branch from the Storage API and generates source files to `models/_sources`. Tables from each bucket are stored in a separate file.

*   **Example** (non-interactive mode)

    ![](imgs/2770010127.jpg)

`kbc dbt generate env`
----------------------

*   Generates bash commands to create env vars for dbt CLI.

*   Asks for an existing workspace (select box or id flag).

*   **Example**

    ![](imgs/2770010133.jpg )

### Workspaces Support

*   Universal support to manage workspaces

*   Hide `keboola.sandboxes` configurations from the Keboola project folder structure.


### `kbc remote workspace create`

*   Supports parameter `name`, `type`, and `size` (for `python` and `r`).

*   **Example** (non-interactive mode)

    ![](imgs/2770010139.jpg)
