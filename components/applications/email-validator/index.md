---
title: Email validator
permalink: /components/applications/email-validator/
redirect_from:
    - /applications/validator/
---

* TOC
{:toc}

The Email validator enables users to validate emails from tables in Keboola for their uses in email marketing or other
usecases. The validator returns estimates on validity and performed checks. This component supports the following APIs : Sendgrid Email Address validation.
**For another API to be added to this application, contact support.**
## Configuration
[Create a new configuration](/components/#creating-component-configuration) of the **Email validator** application.  

First specify the input [table](/storage/tables/) containing the emails to be validated. Next select the API service used 
to validate the emails. Based on the service fill in the API key and other parameters of the service; email column (column in input
table that contains the email) and source column (column in the input table that contains the source of the email to be validated eg. from 
an online newsletter signup)

{: .image-popup}
![Screenshot - Application configuration](/components/applications/email-validator/config.png)

Finally, select which loading option you wish to use. Select one of the following two load types:

- Incremental Update – updates the result tables based on the primary key set in the configuration
- Full Load – overwrites the destination table each time

{: .image-popup}
![Screenshot - Application configuration](/components/applications/email-validator/loading.png)

Then click **Save**. 
