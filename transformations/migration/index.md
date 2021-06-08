---
title: Transformation Migration
permalink: /transformations/migration/
---

* TOC
{:toc}

Current transformations will be fully deprecated on the US AWS and the EU AWS [stacks](/overview/#stacks) on September 1, 2021.
All transformations must be migrated by this date. 

## Migration Steps
The transformation migration process is as follows:
- Go to the detail of the transformation bucket.
- Start the migration process by clicking the button "Proceed to Migration".

{: .image-popup}
![Screenshot - Migration overview](/transformations/migration/migration-overview.png)

- Once the migration process finishes successfully, the old transformation will be marked as "Migrated".

{: .image-popup}
![Screenshot - Migrated transformation](/transformations/migration/migrated.png)

- Check and modify the orchestration [tasks](orchestrator/tasks/) that used the migrated transformations.

{: .image-popup}
![Screenshot - Modify orchastration](/transformations/migration/modify-orchastration.png)

- Once all orchestrations are modified, you can remove the old transformation bucket.

## What Will Be Migrated
All transformations that meet the following conditions will be migrated. They must be in a transformation bucket with:
- One [phase](/transformations/#phases) and one [transformation backend](/transformations/#backends).
- One [phase](/transformations/#phases) and multiple [transformation backends](/transformations/#backends).
- Multiple [phases](/transformations/#phases) and one [transformation backend](/transformations/#backends).

## What Will Not Be Migrated
The migration process will skip the following transformations and they will not be migrated:
- Disabled transformations in the bucket 
- Transformations that have both multiple [phases](/transformations/#phases) and multiple transformation [backends](/transformations/#backends)
  - In this case, you must split the bucket, so that each of the resulting buckets have either one phase or one backend. If you are not sure how to do that, please contact our support.
