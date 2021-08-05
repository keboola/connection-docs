---
title: Transformation Migration
permalink: /transformations/migration/
---

* TOC
{:toc}

## Migration Steps
The transformation migration process is as follows:
- Go to the list of transformation buckets.
- Start the migration by clicking the button **Migrate to New Transformations** in the menu of the transformation bucket.

{: .image-popup}
![Screenshot - Migration overview](/transformations/migration/migration-overview.png)

- Once the migration finishes successfully, the old transformation will be marked as *Migrated*.

{: .image-popup}
![Screenshot - Migrated transformation](/transformations/migration/migrated.png)

- Check and modify the orchestration [tasks](orchestrator/tasks/) that used the migrated transformations.

{: .image-popup}
![Screenshot - Modify orchastration](/transformations/migration/modify-orchestration.png)

- Once all orchestrations are modified, you can remove the old transformation bucket.

## What Will Be Migrated
All transformations that meet the following conditions will be migrated. They must be in a transformation bucket with:
- One [phase](/transformations/#phases) and one [transformation backend](/transformations/#backends).
- One [phase](/transformations/#phases) and multiple [transformation backends](/transformations/#backends).
- Multiple [phases](/transformations/#phases) and one [transformation backend](/transformations/#backends).

### Migrating Transformations with Multiple Phases
When migrating a transformation bucket with one backend and multiple phases, a new transformation will be created for each phase. 
If you want all your legacy transformations in the bucket to be converted into a single new transformation, you must put the legacy transformations 
into one phase first. This can be done manually, see the picture below.

{: .image-popup}
![Screenshot - Migration overview](/transformations/migration/migration-multiple-phases.png)

## What Will Not Be Migrated
The following transformations will be skipped over in the migration process. They will not be migrated:
- Disabled transformations in the bucket 
- Transformations that have both multiple [phases](/transformations/#phases) and multiple transformation [backends](/transformations/#backends); in this case, you must split the bucket, so that each of the resulting buckets have either one phase or one backend. If you are not sure how to do that, please contact our support.

## What Happens During Migration
We check automatically if the transformation is suitable for migration.
The names (and the associated descriptions) are transferred in the following way:

For mixed backends:
  - Transformation bucket → New transformation name (names of individual transformations are lost)

For single backends:
  - Multiple transformations in one bucket result in a single new transformation with code blocks corresponding to the old transformations
  - Mappings are merged
  - Transformation bucket → new transformation name
  - Transformation name → code block name
  - Each transformation within a bucket → code snippet name 
