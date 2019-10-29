---
title: The Sunken Data Temple — Secret Map of Kassandra
permalink: /sunkendatatemple/
---

Oh, dear diver, did you get stuck under a submerged arch, and can’t find your way out? Don’t despair, look below and find the help!

If you’re reading this page in disbelief, as you have no idea what we are talking about, 
well, you may want to visit [THIS PAGE](https://get.keboola.com/sunkendatatemple/) to find out.

## Scanning Device Setup
In order to play the game you need to get a Keboola Connection project (nothing is stopping you from playing in your own 
if you are already a user, but the game generates components and configurations you probably don’t want in your live environment). 
In order to create the sandbox project, go to [https://get.keboola.com](https://get.keboola.com) and use the Promo Code “Kassandra”.

You will receive an invitation via email, and after registration, you will get access to your new project. After opening it, 
you will arrive to this page (will look slightly differently on mobile or based on your screen size, but you get the gist):

{: .image-popup}
![Screenshot - Project overview](/sunkendatatemple/01-project-overview.png)

The red rectangle marks the “Applications” menu item. Click on that and on the next screen, find and engage the “Sunken Data Temple” application:

{: .image-popup}
![Screenshot - Find and engage application](/sunkendatatemple/02-application.png)

The next screen lets you create a configuration of this application and start playing:

{: .image-popup}
![Screenshot - New configuration](/sunkendatatemple/03-new-configuration.png)

Give it a (arbitrary) name, confirm and you’re good to go:

{: .image-popup}
![Screenshot - Name and create configuration](/sunkendatatemple/04-name-configuration.png)

That’s it. You’re ready for your first dive.

## Dives
Each “dive” is a run of the game application. Based on how many “secrets” are entered, the application knows how far in the game you are.

The first dive is “free” — no secret needs to be entered. Just click the “Run” button on the right (or below if you’re on mobile):

{: .image-popup}
![Screenshot - Free dive](/sunkendatatemple/05-free-dive.png)

Once the run completes, a job record appears in the “Last runs” section:

{: .image-popup}
![Screenshot - Last runs](/sunkendatatemple/06-last-runs.png)

Click on it to get to the Job Detail page. Scrolling down you’ll see the journal of your dive (eh, job event log) and in it the key message:

{: .image-popup}
![Screenshot - Event log and key message](/sunkendatatemple/07-event-log.png)

That’s it. There you see the clue and instructions how to obtain the secret needed to unlock your next dive.

## Dive 1
While you were under water searching for the first clue, the game application created a configuration of a MySQL extractor. 
To check it out, go to the “Extractors” section, which will show you the configuration and you can click on it to open:

{: .image-popup}
![Screenshot - New configuration of MySQL extractor](/sunkendatatemple/08-mysql-extractor.png)

While the description on the next screen also provides guidance, here it is too to save you time. 
All you need to do is select the tables to pull from the dropdown in the middle of the screen. The tables you want are:

- join-dive-1
- join-dive-3-part-1
- join-dive-3-part-2

Then click the “Create” button and you’re done:

{: .image-popup}
![Screenshot - Create new config of MySQL extractor](/sunkendatatemple/09-create-mysql-extractor.png)

Then just run the extractor (same as the game application, the now-familiar “Run” button on the right):

{: .image-popup}
![Screenshot - Run MySQL extractor](/sunkendatatemple/10-run-mysql-extractor.png)

And wait briefly for the job to finish. As soon as it's done, the links to tables in the center of the screen will spring to life, 
and you can click on the first one:

{: .image-popup}
![Screenshot - Links to tables](/sunkendatatemple/11-links-to-tables.png)

Click on “Data Sample” on the next screen, and find the secret in the table preview in the column aptly named “secret”. 
Grab it and head back to the game application, enter it there, save the config and onto your next dive:

{: .image-popup}
![Screenshot - Get and enter secret](/sunkendatatemple/12-get-secret.png)

*(In case you were wondering — yes, we KNOW we’ve ‘accidentally’ left the secret in the screenshot. 
However, this is the LAST time we’re going to make it this easy for you - plus, if you skipped this step and 
didn’t actually run the extractor, it will bite you later. Just sayin’...)*

## Dive 2
Now, this is an easy one. Not sure why you are on the help page for this, but anyway… 
All we are asking you to do is to go read a blog… Once you do, the secret should be pretty obvious. 
It actually says “This is the secret for the Sunken Data Temple game…”. 
The link is [here](https://blog.keboola.com/data%20ops%20and%20automation). 
Scroll almost all the way down. There you go. Easy, no?

## Dive 3

*Coming soon.*


