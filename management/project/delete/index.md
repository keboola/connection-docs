---
title: Project Deletion
permalink: /management/project/delete/
redirect_from:
  - /management/project-delete/
---

It is possible to entirely delete your project. However, consider [exporting the project](/management/project/export/) first.

To delete your project, go to **Settings** and select the **Project** tab. Then click the **Delete Project**
button. This marks your project for deletion, and, for some time, nothing else happens.

{: .image-popup}
![Screenshot - Project Delete](/management/project/delete/project-delete.png)

Once marked, the project enters a **60-day grace period** during which

- the project cannot be accessed.
- all project operations, such as data loads and orchestrations, are stopped.
- a request for **undeleting** the project can be sent to our [support team](mailto:support@keboola.com).

After the grace period expires, the deletion becomes **irreversible**, and the project along with any associated data
will be purged and gone for good.

Again, we strongly suggest you [**export your project**](/management/project/export/) before deleting it.

**Important**: Expiring projects will be deleted **automatically** when the expiration day is due.
You will receive a **notification** a week in advance.
When an expired project is deleted, the same grace period rules apply as if it was deleted manually.
