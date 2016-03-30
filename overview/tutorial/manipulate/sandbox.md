---
title: Part 2b - Using Sandbox
permalink: /overview/tutorial/manipulate/sandbox/
---

In the [previous step](/overview/tutorial/manipulate/) you learned, how to setup a transformation. An 
important part of the transformation is the SQL (or R or Python) script itself. To alow you more easily 
write these scripts, we provide a *Sandbox* functionality.

Sandbox is in fact a seprarate database storage, in which you can run arbitrary SQL scripts on the
**copies** of your tables, so that you do not affect neither data in your Storage, neither your
transformations. You can create the Sandbox from the transformation page:

{: .image-popup}
![Screenshot - Transformations Console](/overview/tutorial/manipulate/transformations-intro-2.png)

You will be given credentials to the sandbox and an option to what should be loaded. Use the default option
*Prepare Transformation* and click *Create*. The data will be loaded to your sanbox in the background.

{: .image-popup}
![Screenshot - Create Sandbox](/overview/tutorial/manipulate/transformations-create-sandbox.png)

The sandbox credentials do not generally change, so if you 
click on the *Create Sanbox* button later, you will get the same sandbox. Note: Sandbox databases do get reset 
after a certain variable time period (days), so don't use them to store any data permanently. You can copy 
the database credentials into your favorite SQL client, or you can use the *Connect* button to
connect to the database using a web client, if you want to start right away. 

{: .image-popup}
![Screenshot - Sandbox](/overview/tutorial/manipulate/sandbox-intro.png)

When you're happy with the outcomes of your SQL queries, you can go back to
[transformations](/overview/tutorial/manipulate/) and past them into the transformation script.  
