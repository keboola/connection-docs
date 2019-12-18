---
title: Project Deletion
permalink: /management/project/delete/
redirect_from:
  - /management/project-delete/
---

It is possible to entirely delete your project. However, consider [exporting the project](/management/project/export/) first.

To delete your project, go to **Users & Settings** and select the **Settings** tab. Then click the **Delete this project**
button. This marks your project for deletion, and, for some time, nothing else happens.

{: .image-popup}
![Screenshot - Project Delete](/management/project/delete/project-delete.png)

Once marked, the project enters a **60-day grace period** during which

- the project cannot be accessed.
- all project operations, such as data loads and orchestrations, are stopped.
- a request for **undeleting** the project can be sent to our [support team](mailto:support@keboola.com).

After the grace period expires, the deletion becomes **irreversible**, and the project along with any associated data
will be gone for good.

Again, we strongly suggest you [**export your project**](/management/project/export/) before deleting it.

## GoodData Projects
If the Keboola Connection project has provisioned a GoodData project, that project will also be deleted. The grace
period for a GoodData project is **5 days**. When a GoodData writer is deleted, the associated **provisioned** GoodData project
is deleted after the grace period. When a Keboola Connection project is deleted (but the GoodData writer was left in it),
the associated GoodData project will be deleted in 5 to 14 days from the deletion of the Keboola Connection project.

**Important**: Expiring projects will be deleted **automatically** when the expiration day is due.
You will receive a **notification** a week in advance.
When an expired project is deleted, the same grace period rules apply as if it was deleted manually.
