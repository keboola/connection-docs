---
title: Create Branch
slug: 'cli/keboola-as-code/commands/remote/create/branch'
---


**Create a new [branch](/components/branches/) from the `main` branch.**

```
kbc remote create branch [flags]
```

Create a new dev branch as a copy of the main branch in the project and pull its state back to the local directory. 
If you have some local changes of the main branch, push them to the project first. 

**Limitation:**  
A branch cannot be created locally, it must be created directly in the project from the `main` branch.

### Options

`-n, --name <string>`
: Name of the branch to be created

`--output-json <string>`
: Output as a JSON file

[Global Options](/cli/keboola-as-code/commands/#global-options)

### Examples

```
➜ kbc remote create branch -n try1

The branch was successfully created.
Pulling objects to the local directory.
Plan for "pull" operation:
  * C main/extractor/keboola.ex-google-drive/my-google-drive-data-source | changed: configuration
Pull done.
Created new branch "try1".
```

## Next Steps

- [All Commands](/cli/keboola-as-code/commands/)
- [Create Configuration](/cli/keboola-as-code/commands/local/create/config/)
- [Create Configuration Row](/cli/keboola-as-code/commands/local/create/row/)

