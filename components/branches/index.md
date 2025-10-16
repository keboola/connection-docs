---
title: Branches
permalink: /components/branches/
---

# Branches

Branches allow you to create isolated development environments within a single Keboola project.  
Each branch operates as a self-contained workspace where you can safely experiment, test, and validate changes before deploying them to production.

---

## Branch Storage Architecture

The branched storage architecture creates a full clone of the production storage database, with a branch-specific prefix applied to all objects.  
This ensures that each branch storage acts as a complete snapshot of the production dataset, providing full isolation between production and branch environments.  

Development branches are inherently safer, as all operations are executed on their isolated copy of the data.

{: .image-popup}
![Screenshot - Branched storage](/tutorial/branches/figures/branched_storage.png)

---

## Deployment and Project Considerations

Keep in mind that the branch storage initially contains a complete copy of the production data.  
This can affect the user interface and storage behavior compared to production.  

Branch deployment to production is only possible when no other development branches are active — all non-production branches must be deleted before deployment.  

Newly created projects automatically include branched storage functionality.  
For existing projects, this feature must be manually enabled to take advantage of branched storage.

---

## Best Practices

- **Use branches for development and testing.**  
  Each branch provides a safe environment for configuration changes and data manipulation.
- **Clean up inactive branches.**  
  Unused branches still occupy storage resources.
- **Verify data before deploying.**  
  Always confirm that transformations and data models behave as expected before merging or deploying to production.
- **Restrict access appropriately.**  
  Limit write permissions in production branches to prevent accidental overwrites.

---

## Related Topics

- [Creating and Managing Branches](/tutorial/branches/)
- [Deployment Process](/tutorial/deployment/)
- [Storage Overview](/components/storage/)

