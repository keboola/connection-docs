---
title: Transformation Migration
permalink: /transformations/migration/
---

* TOC
{:toc}

Current transformations will be fully deprecated 1.9.2021 on US AWS and EU AWS [Stacks](/overview/#stacks).
All transformations must be migrated by this date. 

## Migration step
The transformation migration process is as follows:
- go to the detail of the transformation bucket
- start migration process by clicked to the "Proceed to migration" button

{: .image-popup}
![Screenshot - Migration overview](/transformations/migration/migration-overview.png)

- after successfully migration process, the old transformation will be marked as "Migrated"

{: .image-popup}
![Screenshot - Migrated transformation](/transformations/migration/migrated.png)

- check and modify orchastration [tasks](orchestrator/tasks/) that used the migrated transformations

{: .image-popup}
![Screenshot - Modify orchastration](/transformations/migration/modify-orchastration.png)

- after modified all orchestrations, you can remove the old transformation bucket

## What Will Be Migrated
All transformations, that have in the transformation bucket:
- one [phase](/transformations/#phases) and one [transformation backend](/transformations/#backends)
- one [phase](/transformations/#phases) and multiple [transformation backends](/transformations/#backends)
- multiple [phases](/transformations/#phases) and one [transformation backend](/transformations/#backends)

## What Won't Be Migrated
- disabled transformations in the bucket (migration process skip these transformations)
- transformations, which have more different transformation [backends](/transformations/#backends) and [phases](/transformations/#phases)
  - in this case you must split the transformation bucket on transformations with one phase or backend. If you don't know how, please contact Keboola Support.
