---
title: Part 2b - Using Sandbox
permalink: /overview/tutorial/manipulate/sandbox/
---

An important part of [setting up a transformation](/overview/tutorial/manipulate/) is the SQL (or R or Python) script itself. 
To make writing of these scripts easier for you, we provide the *Sandbox* functionality.

As a separate database storage, Sandbox allows you to run arbitrary SQL scripts on the
**copies** of your tables without affecting data in your Storage, or your transformations. 

Let's create a Sandbox from the Transformations page:

{: .image-popup}
![Screenshot - Transformations Console](/overview/tutorial/manipulate/transformations-intro-2.png)

You will be given credentials to your sandbox along with an option to what should be loaded. 
Use the default *Prepare Transformation* option, and click *Create*. The data will be loaded to your sandbox in the background.

{: .image-popup}
![Screenshot - Create Sandbox](/overview/tutorial/manipulate/transformations-create-sandbox.png)

The sandbox credentials do not change. Clicking on the *Create Sandbox* button later will give you the same sandbox. 
Copy the database credentials into your favorite SQL client, 
or, if you want to start right away, use the *Connect* button to connect to the database using a web client. 

{: .image-popup}
![Screenshot - Sandbox](/overview/tutorial/manipulate/sandbox-intro.png)

Since the Sandbox databases get reset every few days, make sure not to use them as a permanent data storage!

When happy with the outcomes of your SQL queries, go back to [transformations](/overview/tutorial/manipulate/) 
and paste the queries into the transformation script.  
