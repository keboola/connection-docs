---
title: Keboola Platform Usage Blueprint
permalink: /tutorial/onboarding/usage-blueprint/
---

* TOC
{:toc}

> Welcome to your personalized Keboola Platform Usage Blueprint Document! 
> 
> *This comprehensive guide is designed to serve as a foundation for crafting your customized documentation. 
> Each section outlines its purpose and recommends content, providing you with a framework that can be tailored to your organization's specific principles
> and details. As you navigate through this document, notes formatted for guidance will accompany you, ensuring a seamless and
> straightforward customization process. Feel free to delete these notes once you've incorporated your unique insights and details into your personalized
> blueprint. Let's embark on this journey of building a tailored documentation resource that aligns perfectly with your organization's needs and practices.*

## Getting Access to the Keboola Platform 
### Keboola Administration
> *In the initial stages, you'll need to identify your Keboola Organization administrators who will have the authority to create new Keboola projects
> and invite initial users. It is generally recommended to keep the number of Organization administrators limited, typically ranging from 2 to 4,
> based on the organization's size.*

**Keboola Organization admin** is a role with permissions to:
- Leave and re-enter all existing projects in the organization.
- View and edit billing details.
- Manage [shared buckets](/catalog/#sharing-types).
- Create [new projects](/management/organization/#manage-projects).
- Change [organization settings](/management/organization/#organization-settings).
- Allow [Keboola Support team](/management/support/#require-approval-for-support-access) to join your projects.

Our Keboola organization administrators are:
- Name, [email@company.com](email@company.com)
- Name, [email2@company.com](email2@company.com)
- Name, [email3@company.com](email3@company.com)

#### User requesting access to a Keboola project
> *Usually, Keboola Administrators maintain a list of current projects, including the project owner or lead project engineer.
> Users are directed to this list to contact the project owner directly. The project owner can then follow the guide in our public documentation
> to invite the user into a project.*
>
> *It's important to note that if you are using a single-tenant Keboola deployment with customized identity and access management, such as Active Directory,
> this process may not apply to you. In such cases, you should describe your organization's specific process for users to follow.*

To request access to any of our existing Keboola projects, please contact the Project Owner directly to invite you to the project. Below is a list of our existing Keboola projects.

| Project ID | Name | Description | Owner |
|---|---|---|---|
| 111 | [PROD] Marketing | Production project for marketing campaign automation | Jane Doe; jane@company.com |

 

 

 

 

I am already a member of a project, how do I access it?
Depending on your selection, you might be operating in a multi-tenant Azure (North Europe region), AWS (US or EU regions), or a GCP (Europe region) stack, or in your dedicated single-tenant stack. The location of the deployment determines the root URL that'll take you to the platform's UI. Please find the relevant link for your deployment:

Azure North Europe: https://connection.north-europe.azure.keboola.com/admin/

AWS EU: https://connection.eu-central-1.keboola.com/admin

AWS US: https://connection.keboola.com/admin

GCP EU: [Please insert the link for GCP EU]

Single tenant stack: All relevant information is available within your Production Design document.

Navigate to the login site of our Keboola platform here - [https://connection.keboola.com/admin]. After you log in, you'll see a list of projects you have access to. Click on the selected project name to access the project environment.

How to request creation of new Keboola project?
If you wish to develop your own use-cases in Keboola, please reach out to one of the Organization administrators mentioned above to create a project for you.

To request the creation of a new project, the requester should get in touch with a Keboola Administrator. The Organization Administrator holds the exclusive role of managing Keboola projects.

 The specific process may vary for each organization. In larger organizations, it is common to implement a questionnaire or form that users can use to request a project. This form often provides administrators with additional details they may need for the project creation process.

How to process user termination?
Terminated users must be manually removed from all projects they are members of. Keboola Organization administrators can leverage Telemetry data (refer to the Keboola Governance guide [LINK][tbd] for more details) to identify the projects and subsequently remove users from individual projects.

Alternatively, Project Owners can take the responsibility to remove terminated users from their respective projects.

It's important to note that removing a user from a project will not affect any configurations created by them. Configurations will still remain usable and functional after the user is removed.

