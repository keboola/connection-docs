---
title: GitHub Integration
permalink: /cli/github-integration/
---

* TOC
{:toc}

The tool can generate workflows for GitHub Actions within commands [init](/cli/commands/init/) 
and [workflows](/cli/commands/workflows/).

Secret `KBC_STORAGE_API_TOKEN` with your master token needs to be added to the GitHub 
[secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository).

{: .image-popup}
![Screenshot -- GitHub Actions](/cli/github-integration/github-actions.jpg)

## Pull

The Pull workflow is set to run automatically every five minutes to [pull](/cli/commands/pull/) the changes from 
the project in Keboola Connection. If it finds any changes it creates a commit to the repository.

Note that GitHub does not guarantee periodic running in exact times so that the triggers may be delayed a few minutes 
depending on the current GitHub Actions workload. 

{: .image-popup}
![Screenshot -- A commit by Pull action](/cli/github-integration/pull-commit.jpg)

The commit contains description of the change:

{: .image-popup}
![Screenshot -- A change description by Pull action](/cli/github-integration/pull-description.jpg)

## Push

The Push workflow is triggered by push to the GitHub repository to [push](/cli/commands/push/) the changes from
the local directory to the project in Keboola Connection.

## Validate

The Validate workflow is triggered by push to a branch in the GitHub repository to validate and preview its changes by 
a [push --dry-run](/cli/commands/push/).
