---
title: Project Delete
permalink: /management/project-delete/
---

It is possible to entirely delete your project. To delete a project select *Users & Settings* and
on the *Settings* tab, there is a *Delete Project* button. The project deletion actually only marks the
project for deletion and does no other changes to it. We strongly suggest, that you make a 
[backup of your project](/management/project-export/) before deleting it. 

{: .image-popup}
![Screenshot - Project Delete](/management/project-delete/project-delete.png)

Once the project is marked for deletion, it enters a 60 days grace period during which it cannot 
be acessed and all operations (data loads, orchestrations) in the project are stopped.

During the grace period, you can send a request to [Support](mailto:support@keboola.com) to 
undelete the project. After the grace period, the project and all its associated data will be really 
deleted and cannot be undeleted any more.

Note that expiring projects will be deleted automatically when the expiration day is due. You will receive a 
notification a week before a project will expire. When an expired project is deleted, the same rules
about grace period apply as if it were deleted manually.  
