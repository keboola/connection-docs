---
title: The Sunken Data Temple — Secret Map of Kassandra
permalink: /sunkendatatemple/
---

Oh, dear diver, did you get stuck under a submerged arch, and can’t find your way out? Don’t despair, look below and find the help!

If you’re reading this page in disbelief, as you have no idea what we are talking about, 
well, you may want to visit [THIS PAGE](https://get.keboola.com/sunkendatatemple/) to find out.

## Scanning Device Setup
In order to play the game, you need to get a fresh Keboola Connection project that is part of the game organization. 
In order to create the sandbox project, go to [https://get.keboola.com](https://get.keboola.com) and use the Promo Code “KASSANDRA”.

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

The first dive is “free” — no secret needs to be entered. Just click the “RUN COMPONENT” button on the right 
(or below if you’re on mobile):

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

Then just run the extractor (same as the game application, the “RUN EXTRACTION” button on the right):

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
The link is [here](https://blog.keboola.com/data-ops-and-automation). 
Scroll almost all the way down. There you go. Easy, right?

## Dive 3

OK, transformations. Similar to the first puzzle, you will need to use your Keboola device to retrieve the secret from data. 
This time you are using the Transformations engine to join two tables and get the secret from the result. 
The puzzle itself is a broken SQL code that you need to fix. Here is how to go about it. Go to Transformations, 
then select the <Sunken Data Temple> transformation bucket and the <Dive 3> transformation itself:

{: .image-popup}
![Screenshot - Select new transformation](/sunkendatatemple/13-select-transformation.png)

The description of the transformation will give you further hints, but here it goes as well. 
Scroll down on the next page to see the SQL query:

{: .image-popup}
![Screenshot - Scroll down to see SQL query](/sunkendatatemple/14-scroll-down.png)

The query is the culprit, it’s not doing what it is supposed to.

{: .image-popup}
![Screenshot - Incorrect SQL query](/sunkendatatemple/15-query.png)

Once you fix it, just save and run the transformation:

{: .image-popup}
![Screenshot - Run Transformation with fixed query](/sunkendatatemple/16-run-transformation.png)

Then you need to find the output table (just click on it in the “output mapping” section), go to Data Sample and read the secret. 
No, we won’t just write it here. If you can’t get it out of the transformation, you can go into Google Translate and type the word
“**spisovatel**”. It should recognize it as a Czech word and its English translation just happens to be the 3rd secret. 
So back to the Sunken Data Temple app, enter the secret and run it again!

## Dive 4
Not sure how to help here. The task is pretty straightforward --- you can either scan this QR code:

{: .image-popup}
![Screenshot - Scan QR code](/sunkendatatemple/qrcode-app.png)

or go to [https://get.keboola.com/join-looker-2019](https://get.keboola.com/join-looker-2019), 
and you’ll find a “Get The Keboola JOIN 2019 App” button on it. Get the app on your phone or tablet:

{: .image-popup}
![Screenshot - Get The Keboola JOIN 2019 App](/sunkendatatemple/17-get-app.png)

{: .image-popup}
![Screenshot - Get The Keboola JOIN 2019 App](/sunkendatatemple/18-get-app.png)

{: .image-popup}
![Screenshot - Get The Keboola JOIN 2019 App](/sunkendatatemple/19-get-app.png)

Find a “Freebies” section:

{: .image-popup}
![Screenshot - Find Freebies section](/sunkendatatemple/20-freebies.png)

Once in there, the secret should be pretty obvious.

In case you ran into any trouble and you need to get the secret without the app, well… 
Google the text **“is the study or practice of writing music for an orchestra”**:

{: .image-popup}
![Screenshot - Google text](/sunkendatatemple/21-google-text.png)

The title of the Wikipedia page that pops up is the secret.

## Dive 5
For this puzzle you’ll need to use Keboola again --- this time its “bucket sharing” feature. 
Its job is to simplify sharing data between different projects or teams within the organization. 
It’s pretty straightforward. Go to the “Storage” section, and click on the “link shared bucket” button:

{: .image-popup}
![Screenshot - Go to Storage click link](/sunkendatatemple/22-storage.png)

From the selection of buckets, pick the one called “sunken-data-temple”. There is a table “room_number_5” in it. 
Check its content and there is the secret!

Trouble still? Well, it’s a synonym of the word “pail”, which is frequently used together with the word “list”. 
There’s even a great movie with that title. Morgan Freeman and Jack Nicholson are in it. Enough hints?

## Dive 6
Here we come! The Last Dive! Come on, you got this far and NOW you need help? OK. 
When you sign up for our webinar, the confirmation email will have the secret in it. To sign up, 
use the link [HERE](https://keboola.zoom.us/webinar/register/WN_fVv4mF18QZu7unjUWFVX1g) or scan this QR code: 

{: .image-popup}
![Screenshot - Webinar QR code](/sunkendatatemple/qrcode-power-hour.png)

Does that not work for you for whatever reason? Don’t despair. There was a lady, famous for French cooking 
(wrote a book and had a TV show!). Last name? Child. First name? That’s the secret. 
Also a programming language, getting more and more popular with data scientists. A new transformation backend in Keboola. Good now?

## Dive 7
Now for something completely different! We’re in a [Looker dashboard](https://keboolablocks.looker.com/embed/dashboards/1) now. 
The task is still pretty simple though --- just pick the last three secrets from the game correctly from the filters 
on top of the dashboard, click on RUN and you’re off to the races! Then scroll down for your prize code. See you at JOIN2019! 
And if you are not coming, just e-mail us with your code and we’ll find a way to get it to you. 

Thanks for playing!




