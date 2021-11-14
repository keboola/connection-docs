---
title: Workflows
permalink: /cli/commands/workflows/
---

* TOC
{:toc}

```
kbc workflows [flags]
```

Generate workflows for GitHub Actions:
- `validate` - validates all branches on change
- `push` - pushes each change in the main branch to the project
- `pull` - pulls the main branch from the project every 5 minutes

You will be prompted which workflows you want to generate.

## Options

`--ci-main-branch <string>`
: Name of the main branch for push/pull workflows (default "main")

`--ci-pull <bool>`
: Create workflow to sync main branch from the project every 5 minutes (default true)

`--ci-push <bool>`
: Create workflow to push changes in main branch to the project (default true)

`--ci-validate <bool>`
: Create workflow to validate all branches on change to a GitHub branch (default true)

[Global Options](/cli/commands/#global-options)

## Example

```
➜ kbc workflows

Please confirm GitHub Actions you want to generate.

? Generate "validate" workflow?
All GitHub branches will be validated on change. Yes

? Generate "push" workflow?
Each change in the main GitHub branch will be pushed to the project. Yes

? Generate "pull" workflow?
The main GitHub branch will be synchronized every 5 minutes.
If a change found, then a new commit is created and pushed. Yes

? Please select the main GitHub branch name: main

Generating CI workflows ...
Created file ".github/actions/install/action.yml".
Created file ".github/workflows/validate.yml".
Created file ".github/workflows/push.yml".
Created file ".github/workflows/pull.yml".

CI workflows have been generated.
Feel free to modify them.

Please set the secret KBC_STORAGE_API_TOKEN in the GitHub settings.
See: https://docs.github.com/en/actions/reference/encrypted-secrets
```

## Next Steps

- [GitHub Integration](/cli/github-integration/)
