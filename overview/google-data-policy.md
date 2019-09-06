---
title: Keboola Connection Overview
permalink: /overview/google-data-policy/
---

## Google Data Usage Policy
Keboola Connection, our platform, is the host of smaller application components that interact with various Google APIs and services. 
It also contains Storage, a database-like component where users store their data.

Watch the following introduction video for basic info about our platform:

The components working directly with Google APIs and services are divided into two categories: extractors and writers.


### Extractors
Extractors are components of our platform --- small apps that download data for our users from APIs of various Google services: 
Gmail, Google Drive, Google Analytics, Google BigQuery, etc.
All the data that extractors obtain from the APIs is then imported into our Storage.
The data (in Storage) can be accessed only by those users who are in the KBC project that downloaded the data.
Other users cannot download, see or edit data or another user’s documents. Collaborators within a KBC project are only able to run 
the extraction of the data or document that the authorized user has selected. The collaborators can work with the data downloaded into Storage.

### Writers
Writers are also components of our platform --- small apps that write data for our users from Storage into various Google services: Google Drive, Google BigQuery, etc.
In Storage, a user selects a data table which they want to upload into their account within the Google service, e.g., Google Sheets.
After being authorized, they can select where they want to store the data (e.g., a folder and a spreadsheet in Google Sheets).
Other users cannot see, download, edit, or manipulate this user’s data or documents (even within the same KBC project). 
They can only run the component; it means that the table from Storage that was chosen by the authorized user will be written into the authorized account within the Google service.

### Common
At any time, the user can reset their authorization, and the extractor or the writer will loose access to the user’s account within the Google service.

At any time, the user can delete any tables containing data from Storage. There’s a backup which is kept for seven more days. 
However, the user can ask us to remove the data immediately if needed.
