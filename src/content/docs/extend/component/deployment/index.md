---
title: Deployment
slug: 'extend/component/deployment'
redirect_from:
  - /extend/docker/tutorial/automated-build/
  - /extend/registration/deployment/
---

If you created your component according to the [tutorial](/extend/component/tutorial/), you already have
a deployment pipeline set up. This article explains in more detail how the pipeline works. It also describes
alternative set ups. Assuming your component is similar to the one created in the [tutorial](/extend/component/tutorial/),
you see the following behavior:

- Every push the workflow listens to triggers a build, and the built image lands in our
  [AWS ECR registry](https://aws.amazon.com/ecr/) — tagged with the git tag on a tag push, and with
  `<branch>-<run number>` otherwise. (The workflow cookiecutter generates ignores pushes to `main`;
  the self-contained templates listen to every push.)
- Every [normal version tag](https://semver.org/#spec-item-2) (x.y.z) updates the image tag in the [Developer Portal](https://components.keboola.com/) and subsequently makes the image available in Keboola.

We highly recommend the above setup (or a similar one) as it imposes very little extra work on the developer, yet
it deploys new versions of the component in a controlled and traceable manner.

## How It Works
The following text explains the default setup in detail so that you know what to do if something
breaks or how to set up the pipeline manually.

### Integration
GitHub Actions runs from a workflow file committed in your repository, so there is no third-party
service to connect and no repository to enable — pushing the workflow file is the integration.

Two shapes ship today. Both build the image, run the tests, push to ECR and update the Developer
Portal; they differ in how much you maintain yourself.

### Build Setting
**The shared pipeline (recommended).** `keboola/component-ci` publishes a reusable workflow, and
your repository only calls it. This is what
[`cookiecutter-python-component`](https://github.com/keboola/cookiecutter-python-component)
generates as `.github/workflows/push.yml`:

```yaml
name: Keboola Component Build & Deploy Pipeline
on:
  push:
    branches-ignore:
      - main
    tags:
      - "*"

concurrency: ci-${{ github.ref }}

jobs:
  ci:
    uses: keboola/component-ci/.github/workflows/component-pipeline.yml@master
    with:
      app_id: your-vendor.your-component
      vendor: your-vendor
      test_build_target: test
      docker_build_target: production
    secrets: inherit
```

Only `app_id` and `vendor` are required. The rest of the inputs have defaults and are worth knowing
when your component does not fit the standard shape:

| Input | Default | What it is for |
|---|---|---|
| `kbc_test_configs` | empty | Space-separated list of configuration IDs to run as tests in a real project |
| `kbc_host` | `connection.keboola.com` | The stack those test configurations live in |
| `test_command` | `python -m pytest tests/ --tb=short -q` | Command run inside the container |
| `dockerfile` / `context` | `./Dockerfile` / `.` | Where the image is built from |
| `docker_build_target` / `test_build_target` | empty | Build targets for multi-stage Dockerfiles; setting the test target enables multi-stage mode |
| `use_docker_compose` | `false` | Run tests through `docker compose` when they need side services such as SFTP |
| `compose_file` / `compose_service` | `docker-compose.yml` / `test` | Which compose file and which service to run, in compose mode |

In compose mode the pipeline skips its own build-and-test steps, so **`test_command` is ignored** — put the
command in the compose service instead.

`secrets: inherit` only passes secrets when the caller lives in the same GitHub organization or
enterprise. An external vendor has to pass them explicitly, which is why the pipeline declares each
secret it accepts.

One input is worth setting deliberately even though it has a default: on a version tag the pipeline
runs `update_properties_script`, defaulting to `scripts/developer_portal/update_properties.sh`. The
cookiecutter skeleton ships that script; a repository that copies only the YAML above does not, and
every version tag will fail until you add it or point the input elsewhere.

**A self-contained workflow.** `component-generator` ships
[`templates-ci/common/github-actions`](https://github.com/keboola/component-generator/tree/master/templates-ci/common/github-actions),
which performs the same steps inline instead of calling the shared pipeline. Use it when you need
to change a step the shared pipeline does not expose, and accept that you maintain it yourself.
PHP components have their own variant under `templates-ci/php-component/github-actions`.

### Deploy Script
The Bitbucket and GitLab templates carry a `deploy.sh` that does the actual work: log in to ECR, push
the image under the git tag, and tell the Developer Portal about it. The GitHub workflows do the same
thing through `keboola/action-push-to-ecr` and `action-set-tag-developer-portal` instead of a script,
but the mechanics below are what runs underneath either way. This is the shipped GitLab copy; the
Bitbucket one is identical apart from the tag variable:

```sh
#!/bin/sh
set -e

# Obtain the component repository and log in
docker pull quay.io/keboola/developer-portal-cli-v2:latest
export REPOSITORY=`docker run --rm  \
    -e KBC_DEVELOPERPORTAL_USERNAME \
    -e KBC_DEVELOPERPORTAL_PASSWORD \
    quay.io/keboola/developer-portal-cli-v2:latest \
    ecr:get-repository ${KBC_DEVELOPERPORTAL_VENDOR} ${KBC_DEVELOPERPORTAL_APP}`

eval $(docker run --rm \
    -e KBC_DEVELOPERPORTAL_USERNAME \
    -e KBC_DEVELOPERPORTAL_PASSWORD \
    quay.io/keboola/developer-portal-cli-v2:latest \
    ecr:get-login ${KBC_DEVELOPERPORTAL_VENDOR} ${KBC_DEVELOPERPORTAL_APP})

# Push to the repository
docker tag ${APP_IMAGE}:latest ${REPOSITORY}:${CI_COMMIT_TAG}
docker tag ${APP_IMAGE}:latest ${REPOSITORY}:latest
docker push ${REPOSITORY}:${CI_COMMIT_TAG}
docker push ${REPOSITORY}:latest

# Update the tag in Keboola Developer Portal -> Deploy to KBC
if echo ${CI_COMMIT_TAG} | grep -c '^v\?[0-9]\+\.[0-9]\+\.[0-9]\+$'
then
    docker run --rm \
        -e KBC_DEVELOPERPORTAL_USERNAME \
        -e KBC_DEVELOPERPORTAL_PASSWORD \
        quay.io/keboola/developer-portal-cli-v2:latest \
        update-app-repository ${KBC_DEVELOPERPORTAL_VENDOR} ${KBC_DEVELOPERPORTAL_APP} ${CI_COMMIT_TAG} ecr ${REPOSITORY}
else
    echo "Skipping deployment to KBC, tag ${CI_COMMIT_TAG} is not allowed."
fi
```

Every step runs [`developer-portal-cli-v2`](https://github.com/keboola/developer-portal-cli-v2), the tool that talks to the Developer Portal. `CI_COMMIT_TAG` is GitLab's name for the git tag; the Bitbucket copy uses `BITBUCKET_TAG`. Note that these scripts push the image twice, under the tag and under `latest`. The GitHub actions push
`latest` only on a deploy-ready tag, so an ordinary branch push there lands one image.

### Deploy Configuration
What you configure depends on which of the two shapes you use.

**On the shared pipeline**, the component's identity travels as workflow *inputs* — `vendor` and
`app_id` in the YAML above — not as repository variables. What the repository supplies is credentials:

 - `KBC_DEVELOPERPORTAL_USERNAME` — the [**Service Account**](/extend/component/tutorial/#creating-deployment-account) login, as a repository **variable** (or the `kbc_developerportal_username` input)
 - `KBC_DEVELOPERPORTAL_PASSWORD` — the Service Account password, as a **secret**
 - `DOCKERHUB_USER` and `DOCKERHUB_TOKEN` — as **secrets**. The push-to-ECR step logs in to Docker Hub
   unconditionally, so leaving these empty fails that step even though the workflow declares them optional.
 - `KBC_STORAGE_TOKEN` — as a **secret**, needed only when you run test configurations in a real project.

**On a self-contained workflow**, the same four `KBC_DEVELOPERPORTAL_*` names live in the workflow file
itself — `VENDOR`, `APP` and `USERNAME` as plain values filled in when the template is generated, and only
`PASSWORD` as a secret. There is no repository variable to set. `DOCKERHUB_USER` is a plain value too,
while `DOCKERHUB_TOKEN` and `KBC_STORAGE_TOKEN` are secrets; the Docker Hub login is conditional here, so
those two really are optional.

### Trigger Build
Commit and push to trigger the build. To deploy, push a tag. The shared pipeline updates the Developer
Portal only when all three hold: the commit is on the default branch, the ref is a tag, and the tag is a
bare [semantic version](https://semver.org/) — `1.2.3`, **not** `v1.2.3`. Every other path accepts the
`v` prefix: the self-contained GitHub workflow, and the Bitbucket and GitLab `deploy.sh` scripts.

    git tag 0.0.6
    git push origin --tags

Watch the run under the **Actions** tab of your repository. If it finishes without errors, the
component is deployed: the Developer Portal shows the repository and the tag it was given.

*Note that it takes up to **5 minutes** before the changes in the Developer Portal propagate to all Keboola instances in all regions.*

## Bitbucket Integration
The [development tutorial](/extend/component/tutorial/) and the description above assume GitHub, where the
pipeline runs on GitHub Actions. If your repository lives on [Bitbucket](https://bitbucket.org/) instead, use its own
continuous integration service -- [Bitbucket Pipelines](https://bitbucket.org/product/features/pipelines).

You have to enable Bitbucket Pipelines in your repository:

![Screenshot -- Bitbucket Pipelines](/extend/component/deployment/bitbucket-1.png)

Note that only the owner of the repository can enable pipelines. Then set the environment variables in settings:

![Screenshot -- Bitbucket Environment Variables](/extend/component/deployment/bitbucket-2.png)

Add the following [`bitbucket-pipelines.yml`](https://github.com/keboola/component-generator/blob/master/templates-ci/bitbucket-deploy/bitbucket-pipelines/bitbucket-pipelines.yml) file to your repository:

```yaml
options:
  docker: true

pipelines:
  default:
    - step:
        script:
          - export APP_IMAGE=keboola-component
          - docker build . --tag=$APP_IMAGE
          - docker images

  tags:
    '*':
      - step:
          script:
          - export APP_IMAGE=keboola-component
          - docker build . --tag=$APP_IMAGE
          - docker images
          - ./deploy.sh
```

Also add the [`deploy.sh` script](https://github.com/keboola/component-generator/blob/master/templates-ci/bitbucket-deploy/bitbucket-pipelines/deploy.sh),
which is modified to use the [`BITBUCKET_TAG`](https://confluence.atlassian.com/bitbucket/environment-variables-794502608.html) variable (for the git tag). When done, commit and push; a build will automatically appear in the **Pipelines** section:

![Screenshot -- Bitbucket Build](/extend/component/deployment/bitbucket-3.png)

With the above settings, Bitbucket Pipelines deploys exactly like the GitHub pipeline described above.
You can also have a look at a [10 minute video](https://www.youtube.com/watch?v=Pf_hfM_zNyU) showing the Bitbucket setup on a new component.

## GitLab Integration
The [development tutorial](/extend/component/tutorial/) and the description above assume GitHub, where the
pipeline runs on GitHub Actions. If your repository lives on [GitLab](https://about.gitlab.com/) instead, use its own
continuous integration service -- [CI Pipelines](https://docs.gitlab.com/ee/ci/pipelines.html).

You have to set the environment variables in settings:

![Screenshot -- GitLab Environment Variables](/extend/component/deployment/gitlab-1.png)

Then add the following [`.gitlab-ci.yml`](https://github.com/keboola/component-generator/blob/master/templates-ci/gitlab-deploy/gitlab-ci/.gitlab-ci.yml) file to your repository:

```yaml
image: docker:latest

variables:
  DOCKER_DRIVER: overlay2
  APP_IMAGE: keboola-component

services:
- docker:dind

before_script:
- docker info

build-component:
  stage: build
  script:
    - docker build . --tag=$APP_IMAGE

deploy-component:
  stage: deploy
  script:
    - docker build . --tag=$APP_IMAGE
    - pwd
    - ls -la
    - export
    - ./deploy.sh
  only:
    - tags
```

Also add the [`deploy.sh` script](https://github.com/keboola/component-generator/blob/master/templates-ci/gitlab-deploy/gitlab-ci/deploy.sh),
which is modified to use the [`CI_COMMIT_TAG`](https://docs.gitlab.com/ci/variables/) (for the git tag). When done, commit and push; a build will automatically appear in the **Pipelines** section:

![Screenshot -- GitLab Build](/extend/component/deployment/gitlab-2.png)

With the above settings, GitLab CI deploys exactly like the GitHub pipeline described above.
You can also have a look at a [10 minute video](https://www.youtube.com/watch?v=TC-tN-zYgEw) showing the GitLab setup on a new component.

## Manual Deployment
If you want to use another continuous integration setting or deploy to the repository manually, you can do so without limitations.
As in the [above script](/extend/component/deployment/#deploy-script),
we recommend using the [Developer Portal CLI client](https://github.com/keboola/developer-portal-cli-v2). This CLI tool (runnable in Docker or PHP)
allows you to obtain the repository for a component and push credentials to that repository. See the chapter about
[running components](/extend/component/running/#running-component), for example, how to obtain the AWS registry credentials.
If you want to get even more low level, you can use the [Developer Portal API](https://api.keboola.com/?service=developer-portal) directly.
It also allows you to [generate credentials for a service account](https://api.keboola.com/?service=developer-portal#post-/vendors/-vendor-/credentials)
programmatically. We use our AWS ECR registry for hosting all component images.

## Test Live Configurations
Unit tests run inside the container as part of every build. `component-generator` ships example test code under
[`templates/python-tests`](https://github.com/keboola/component-generator/tree/master/templates/python-tests)
and [`templates/php-component`](https://github.com/keboola/component-generator/tree/master/templates/php-component).

You may also want to run the component against 'real' configurations in a project. On the shared pipeline this
needs no scripting: pass the configuration IDs as the `kbc_test_configs` input (and `kbc_host` if they live on
another stack), and give the workflow a `KBC_STORAGE_TOKEN` secret. On a self-managed workflow, extend the build
script yourself with the same two values. Create a dedicated [Storage token](/storage/tokens/) for this -- it runs
real jobs in a real project.

![Screenshot -- Sample Configurations](/extend/component/deployment/configuration-sample.png)

Create a configuration in a test project and set an arbitrary table on its input.

<!-- VERIFY(owner): this paragraph pointed at github.com/keboola/ex-docs-tutorial as the sample
     component. That repository returns 404 as of 2026-09-02. Restore the pointer if it comes back,
     or name the cookiecutter skeleton as the sample instead. -->

The pipeline then does the following on every push:

- builds the component image and runs the tests inside it,
- pushes the image to the component's ECR registry. The tag is the git tag on a tag push, and
  `<branch>-<run number>` otherwise — there is no fixed `test` tag,
- runs each configuration you listed as a job in the project, against that freshly pushed image.

A plain commit therefore gets built and tested against production data, but **is not deployed**. Deployment
needs the same three conditions as above — default branch, a tag ref, and a bare semantic version — and the
tests must have passed.

Worked example test code lives in the templates repository:
[Python](https://github.com/keboola/component-generator/tree/master/templates/python-tests) and
[PHP](https://github.com/keboola/component-generator/tree/master/templates/php-component). The matching CI
workflows sit alongside them under `templates-ci/`.
