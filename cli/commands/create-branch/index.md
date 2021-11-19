---
title: Create Branch
permalink: /cli/commands/create-branch/
---

* TOC
{:toc}

```
kbc create branch [flags]
```

Create a new dev branch as a copy of the main branch in the project and pull its state back to the local directory. 
If you have some local changes of the main branch push them to the project first. Note that branches 
cannot be created locally and pushed to the project.

*Note: Branches cannot be created locally and pushed to the project, this is the required way.*

### Options

`-n, --name <string>`
: Name of the branch to be created

[Global Options](/cli/commands/#global-options)

### Examples

```
➜ kbc create branch -n try1

The branch was successfully created.
Pulling objects to the local directory.
Plan for "pull" operation:
  * C main/extractor/keboola.ex-google-drive/my-google-drive-data-source | changed: configuration
Pull done.
Created new branch "try1".
```

## Next Steps

- [Create Config](/cli/commands/create-config/)
