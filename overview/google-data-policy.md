---
title: Keboola Connection Overview
permalink: /overview/google-data-policy/
---

## Google Data Usage Policy
Keboola Connection as our platform is a host of smaller application components, which interacts with various Google APIs and services. This platform also consists of a Storage, database like component, where users data are stored.

Watch this introduction video to get basic knowledge of our platform.

The components working directly with Google APIs and services are divided into two categories - extractors and writers:


### Extractors
Extractors are components of our platform - small apps that download data on users’ behalf from the API of various Google services: Gmail, Google Drive, Google Analytics, Google BigQuery and so on.
All the data that extractors obtain from the API are then imported into our Storage.
These data (in Storage) can only be accessed by users within the same KBC project as the user who authorized the component to access (download) their data.
Other users can’t download or see or edit data or other user’s documents. Collaborators within KBC project are only able to run the extraction of the data or document, the authorized user has selected. The collaborators can work with the data downloaded into Storage.

### Writers
Writers are components of our platform - small apps that write data on users’ behalf from our Storage into various Google services: Google Drive, Google BigQuery and so on.
User selects data table from our Storage, which they want to upload into their account within the Google service e.g. Google Sheets. After the authorization they can select where they want to store the data (e.g. folder and spreadsheet in Google Sheets).
Other users can’t see, download, edit or manipulate this user’s data or documents (even within the same KBC project). They can only run the component, which means the the table from Storage, chosen by the authorized user will be written into the authorized account within the Google service.

### Common
At any time the user can reset his authorization and the extractor or writer looses access to the user’s account within the Google service.

At any time the user can delete tables containing the data from the Storage. There’s a backup, which is contained for 7 more days. But the user can ask us to remove the data immediately if needed.
