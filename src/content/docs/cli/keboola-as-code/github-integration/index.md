---
title: GitHub Integration
slug: 'cli/keboola-as-code/github-integration'
---


The tool can generate workflows for GitHub Actions within commands [init](/cli/keboola-as-code/commands/sync/init/) 
and [workflows](/cli/keboola-as-code/commands/ci/workflows/). For automated CI/CD scenarios, use the `--skip-workflows` flag 
with the init command to bypass interactive workflow setup prompts.

Secret `KBC_STORAGE_API_TOKEN` with your master token needs to be added to the GitHub 
[secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository).

![Screenshot -- GitHub Actions](/cli/keboola-as-code/github-integration/github-actions.jpg)

## Pull

The Pull workflow is set to run automatically every hour to [pull](/cli/keboola-as-code/commands/sync/pull/) the changes from 
the project in Keboola. If it finds any changes, it creates a commit to the repository.

*Note: GitHub does not guarantee periodic running at exact times. The triggers may be delayed a few minutes 
depending on the current GitHub Actions workload.* 

![Screenshot -- A commit by Pull action](/cli/keboola-as-code/github-integration/pull-commit.jpg)

The commit contains description of the change:

![Screenshot -- A change description by Pull action](/cli/keboola-as-code/github-integration/pull-description.jpg)

## Push

The Push workflow is triggered by a push to the GitHub repository to [push](/cli/keboola-as-code/commands/sync/push/) the changes from
the local directory to the project in Keboola.

## Validate

The Validate workflow is triggered by a push to a branch in the GitHub repository to validate and preview its changes by 
a [push --dry-run](/cli/keboola-as-code/commands/sync/push/).
