---
title: Component Quick Start
lastUpdated: 2026-11-27
slug: 'extend/component/tutorial'
description: 'Create a Hello, World! component in the Developer Portal, generate its repository from a template, deploy it through CI and run it in a Keboola project.'
redirect_from:
    - /extend/docker/quick-start/
    - /extend/custom-science/quick-start/
---


In this tutorial, you will create a simple "Hello, World!" component which runs in
Keboola.

A Keboola component is a Docker image. When a job runs, the [Job Queue](/extend/job-queue/) executes the image's
`ENTRYPOINT` or `CMD`, so your image must define one of them. Component images are stored in Amazon AWS ECR
provisioned by the [Developer Portal](https://components.keboola.com/) — the only supported registry — and are
pushed there by the [deploy script](/extend/component/deployment/) in your CI pipeline.

<!-- Tutorial-type page. Typed 2026-11-27 with its prerequisites and check step (T4/T5). -->

## Before you start

- A computer with working [Docker](https://www.docker.com/why-docker), to develop the Keboola component code.
  The [Python](#python) path can run the component locally without it.
- An account in the [Keboola Developer Portal](https://components.keboola.com/), which manages the list of
  components available in Keboola. You must be able to log in to it; how to get an account is below.
- Membership in a vendor in the Developer Portal, approved by the vendor administrator (or, for a new
  vendor, by Keboola).
- A Keboola project on one of the [stacks](/overview/#stacks) that you can log in to. Joining or creating a
  vendor should give you a development project.
- A [GitHub](https://github.com/) account, and Git 2.28 or later to push the component repository.
- For the [Python](#python) template's CI, a [Docker Hub](https://hub.docker.com/) account and access token
  for the `DOCKERHUB_USER` and `DOCKERHUB_TOKEN` secrets, unless your GitHub organization already sets them.
- For the [Python](#python) template: Python with `pip`, to install the cookiecutter tool, and
  [uv](https://docs.astral.sh/uv/), which the template uses to lock its dependencies and which brings the
  Python 3.14 the component runs on.

The Developer Portal uses different credentials than Keboola. [Creating an account](https://components.keboola.com/auth/create-account) is free; it requires a working email address
(to which a confirmation email will be sent) and a mobile phone for a mandatory two-factor authorization.

When you log in to the Developer Portal, you have to join a **vendor** — an organization of
developers. Every Keboola component has to have a vendor assigned. If you join an existing vendor, a
vendor administrator has to approve your request. If you do not work for a company, create a
vendor with your name (even a single developer has to be assigned to a vendor). When you join or create a vendor
you should also receive access to a development Keboola project.

![Screenshot -- Join a vendor](/extend/component/tutorial/join-vendor.png)

In order to create a **new vendor**, a Keboola administrator has to approve your request, and you will
receive a [development project](/extend/development-project/) in Keboola. In addition to that, you need to provide us
with a channel for receiving internal errors from your components. Anything supported
by [Papertrail notifications](https://help.papertrailapp.com/kb/how-it-works/alerts#supported-services)
is available, though e-mail or a Slack channel is most commonly used.

When you are confirmed as a member of a vendor, you may proceed to creating your own component.
The example component is written in the Python language, but no knowledge of Python is required.

*Note: Even though the tutorial assumes using [GitHub](https://github.com/) + [Travis](https://www.travis-ci.com/) services, they are not required for extending Keboola.
We use them because we like them the most. The [deployment documentation](/extend/component/deployment/) shows how to configure,
for example, [Bitbucket](/extend/component/deployment/#bitbucket-integration) and [GitLab](/extend/component/deployment/#gitlab-integration)
integrations.*

## Creating Component
To add a component, use the **Add a component** button on the main page, and fill in the component name and type:

![Screenshot -- Create component](/extend/component/tutorial/create-component-2.png)

**Important:** Do **not** use the words 'extractor', 'writer', or 'application' in the component name.

Choose the appropriate [component type](/extend/component/#component-types):

- `extractor` -- brings data into Keboola
- `writer` -- sends data out of Keboola
- `transformation` -- does some transformation of the data, [read more](/transformations/)
- `code pattern` -- generates code for transformation's component, [read more](/extend/component/code-patterns)
- `application` -- another arbitrary component

The above does not mean technically that, for example, an extractor cannot send data out of Keboola
or an application cannot bring new data into Keboola. It is a matter of user perception,
so use your judgement to select the correct type.

When you fill the form in, you will obtain a **component ID** (in the
form `vendor-id.component-name`, for instance, `keboola-test.ex-docs-tutorial`). Make a **note** of the ID.

## Creating Deployment Account
To be able to deploy the component to Keboola, you will need **service credentials**. For security
reasons, we strongly advice against using your own credentials in any deployment service. To create
new deployment credentials, click the **Create a service account** button on the **Service accounts** page.

![Screenshot -- Create account](/extend/component/tutorial/service-account-1.png)

Fill in a name (e.g., `ex_docs_tutorial_travis`) and description (e.g., `Travis deployment credentials`) and confirm:

![Screenshot -- Account details](/extend/component/tutorial/service-account-2.png)

Take a note of the **username** and **password**.

![Screenshot -- Account credentials](/extend/component/tutorial/service-account-3.png)

## Initializing Component
Once you have the **component ID** and the service account **username** and **password**,
you can create a component, the most convenient way is to use one of our templates.

### Python

Install the cookiecutter tool:

```bash
pip install cookiecutter
```

<!-- Source: cookiecutter prompts verified against keboola/cookiecutter-python-component cookiecutter.json, 2026-09-02, re-checked 2026-11-18 at 169a4d1. template_variant is now __template_variant (computed, not prompted); component_short_description and component_long_description no longer exist as prompts. -->
**Usage**

1. Run ```bash
cookiecutter gh:keboola/cookiecutter-python-component```
2. Fill in requested parameters:
    - `repository_url` - (OPT) URL of your repository. If filled in, the template git repository is initialized and its remote set to your repository.
    - `component_name` - Name of your component
    - `dev_portal_vendor_name` - Your vendor ID in the Developer Portal
    - `dev_portal_component_id` - The component ID to register. Defaults to the normalized component name.
    - `repository_folder_name` - (OPT) Name of the destination folder. By default `component-<normalized component name>`.

    Short and long descriptions are not prompted for — edit `component_config/component_short_description.md` and `component_config/component_long_description.md` in the generated repository.
3. Set up the CI secrets and variables (see [CI Setup](#ci-setup) below)
4. Navigate to the newly created folder. The template has already made a `git` repository on `main` with an initial commit; if you left `repository_url` empty, first add your GitHub repository as the remote (`git remote add origin <your repository URL>`). Push the `main` branch (`git push -u origin main`). This does not start the CI pipeline: the workflow ignores pushes to `main`. To build and deploy, tag the commit on `main` with a version number without a `v` prefix and push the tag after `main`, for example `git tag 0.1.0 && git push origin 0.1.0`. The component is deployed to your Developer Portal only for an `X.Y.Z` tag on the default branch; pushes to any other branch run the pipeline without the deploy step.
5. Modify the code in `src/component.py` and `src/configuration.py` as you like.
    - You can set the configuration parameters in `data/config.json`
    - You can execute the component via normal local environment without docker installed.
    - Add dependencies with `uv add <package>`, which updates `pyproject.toml` and `uv.lock`. The Docker image installs from those two files.
 
 More information on the template [here](https://github.com/keboola/cookiecutter-python-component)
   
## CI Setup
 - Check that the GitHub [workflows are enabled](https://docs.github.com/en/actions/managing-workflow-runs/disabling-and-enabling-a-workflow).
   The workflow is `.github/workflows/push.yml`; it calls the shared [keboola/component-ci](https://github.com/keboola/component-ci) pipeline.
 - The component ID and vendor need no setup: `push.yml` already passes them to the pipeline as the `app_id` (`<vendor>.<component ID>`) and `vendor` inputs, filled in from the `dev_portal_vendor_name` and `dev_portal_component_id` you entered above.
 
 Unless they are already set at the organization level, set the following in the repository settings (**Settings** > **Secrets and variables** > **Actions**). Repositories in the `keboola` GitHub organization get them from organization-level secrets and variables.
 
 - `KBC_DEVELOPERPORTAL_USERNAME` - a variable with the service account username
 - `KBC_DEVELOPERPORTAL_PASSWORD` - a secret with the service account password
 - `DOCKERHUB_USER` and `DOCKERHUB_TOKEN` - secrets with a Docker Hub username and access token; the pipeline logs in to Docker Hub before it pushes the image
 - `KBC_STORAGE_TOKEN` - (optional) a secret, in case you wish to run KBC automated tests; also add the test configuration IDs to `push.yml` as the `kbc_test_configs` input (space-separated)

 `push.yml` hands these to the pipeline with `secrets: inherit`, which works only for repositories in the `keboola` GitHub organization. In any other organization, list the secrets explicitly under `secrets:` and pass the username as the `kbc_developerportal_username` input instead of the variable, as shown in the "External vendors" section of the [component-ci README](https://github.com/keboola/component-ci).

[https://github.com/keboola/cookiecutter-python-component](https://github.com/keboola/cookiecutter-python-component)

### PHP, R or just CI pipeline for GitHub or Bitbucket

Create an empty [Github](https://github.com/) repository. The name of the repository is
arbitrary, but using the component is probably a good idea to avoid confusion.

![Screenshot -- Github Repository](/extend/component/tutorial/github-repository.png)

Checkout the repository on your local computer and execute the following from the command line:

	docker run -i -t --volume=/path/to/repository/:/code/ quay.io/keboola/component-generator

Replace `/path/to/repository/` with an absolute local path to your empty repository. Follow
the on-screen instructions:

![Screenshot -- Component Generator](/extend/component/tutorial/component-generator.png)

When done, you will have an initialized repository with a "Hello, World!" component.
In the above example, we chose the `python-simple` template, which contains the following:

- template.md -- description of the template files
- main.py -- a "Hello, World!" Python script
- Dockerfile -- a Dockerfile defining the environment in which the script runs
- deploy.sh -- a Bash script to deploy the component to Keboola

For Travis CI template contain:
- .travis.yml -- a configuration file for [Travis CI](https://docs.travis-ci.com/) to automate the deployment

For GitHub Actions CI template contain:
- .github/workflows/push.yml -- a configuration file for [GitHub Actions CI](https://github.com/features/actions) to automate the deploy

## Building Component
When done exploring, push to the repository.
This will automatically trigger a build on the Travis or GitHub Actions services; you can view the build
progress by visiting the provided link. In fact, two builds will be triggered: one
for the `master` branch, and one for the `0.1.0` tag.

Travis:

![Screenshot -- Travis Build](/extend/component/tutorial/travis-build-1.png)

GitHub Actions:

![Screenshot -- GitHub Actions Build](/extend/component/tutorial/gh-build-1.png)

We are more interested in the latter because that is going to trigger the deployment to Keboola.

Travis:

![Screenshot -- Travis Build Detail](/extend/component/tutorial/travis-build-2.png)

GitHub Actions:

![Screenshot -- GitHub Actions Build Detail](/extend/component/tutorial/gh-build-2.png)

If the deployment passes without errors, the component will become available in Keboola. You
can verify that in the component details (action Edit) in the Developer Portal:

![Screenshot -- Component Deployed](/extend/component/tutorial/component-deployed.png)

This means that the component deployment is fully automated. If you change the component
source code, all you need to do is push the changes to the git repository and tag them
with the [normal version tag](https://semver.org/#spec-item-2).

## Running Component
Once the component is deployed, it becomes available in Keboola. Note that it
takes **up to 5 minutes** for the changes to propagate to all Keboola instances. After that,
you can configure the component by visiting the following URL:

    https://connection.keboola.com/admin/projects/{DEFINED PROJECT_ID}/extractors/{YOUR COMPONENT_ID}

On this URL, you can create a configuration and run it.

![Screenshot -- Component Configuration](/extend/component/tutorial/component-configuration.png)

What the run needs depends on the template:

- **Generator `python-simple` template:** run it without any settings. The events show the
  "Hello world from python" message:

  ![Screenshot -- Component Events](/extend/component/tutorial/hello-world.png)

- **Cookiecutter [Python](#python) template:** an empty configuration fails. `src/configuration.py` requires
  `print_hello` and an `#api_token` in uppercase, and `src/component.py` stops with "No input tables found"
  when the job has no input table. The configuration form shows only the fields in
  `component_config/configSchema.json`, which are **Print Hello** and **Debug**, so add `#api_token` to the
  schema or drop it from `src/configuration.py` before you run the component.
  <!-- VERIFY(Nikita): how a reader gives a new component an input table in the UI (input mapping on a custom component). -->

**Check:** the job ends with the status **Success**. Its events include "Hello world from python" for the
generator template, or "Hello World" for the cookiecutter template with **Print Hello** turned on.
<!-- TODO(human-review, Nikita): rewrite this run step for the cookiecutter path with a ready configuration and input table, or keep the generator template as the example. Facts checked 2026-11-27 against keboola/cookiecutter-python-component main (src/configuration.py, src/component.py, component_config/configSchema.json) and keboola/component-generator templates/python-simple/main.py; hello-world.png (2020) shows the generator template. -->

When you create a component, it will have assigned a memory limit of **256MB** and
run timeout of **1 hour**. If you need to change those limits, please
[contact our support](mailto:support@keboola.com).

## Component Repository
The component repository is a crucial part of the component setting because it
actually defines what Docker image will be used when running the component.
We offer free hosting of your Docker images in the **[Amazon Container Registry (AWS ECR)](https://aws.amazon.com/ecr/)** under our own account.
All repositories in AWS ECR are private. When you create your component using the method shown above, we
have just provisioned you with the Docker image hosting and you do not need to worry about it any more.

AWS ECR is the **only supported registry** for Keboola components, providing reliable hosting for all Docker images.

## Summary
You have just created your own Keboola component. Although it does not do much, it shows the easiest path
to bringing your own application logic to Keboola. You can now continue with other parts of the tutorial:

 - using [input](/extend/component/tutorial/input-mapping/) and
   [output mapping](/extend/component/tutorial/output-mapping/)
 - using [configuration parameters](/extend/component/tutorial/configuration/)
 - [configuring a processor](/extend/component/tutorial/processors/)
 - [debugging a component](/extend/component/tutorial/debugging/)
 - [implementation notes](/extend/component/implementation/) for specific languages

Although you rarely need all of the above parts (e.g., you do not need input mapping when building an extractor),
we suggest you go through all of them to gain a general overview of the available options. You can also read
all the details in the respective parts of the documentation:

- general information about the [common interface](/extend/common-interface/)
- exchanging data in [data folders](/extend/common-interface/folders/)
- [manifest files](/extend/common-interface/manifest-files/)
- [OAuth support](/extend/common-interface/oauth/)
- [deployment settings](/extend/component/deployment/) (including [Bitbucket integration](/extend/component/deployment/#bitbucket-integration))
- [UI settings](/extend/component/ui-options/)

