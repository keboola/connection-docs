---
title: Data Apps
permalink: /data-apps/
redirect_from:
  - /components/data-apps/
---

* TOC
{:toc}

## Overview
Data apps are simple, interactive web applications that use data to deliver insights or automatically take action.
They are usually custom-tailored to tackle a specific problem and enable a dynamic, purpose-built user experience.

Examples of data apps include recommendation engines, interactive segmentation, AI integration, data visualization, 
customized internal reporting tools for business teams, and financial apps for analyzing spending patterns.

Data apps may be written in any language. However, for now Keboola only supports apps written in [Streamlit](https://streamlit.io/), a Python framework for the rapid development of such applications.

As mentioned above, a data app is a simple web application, which can be deployed inside a Keboola project 
and also publicly accessed from outside the project. 
This means that users accessing your data app do not need access to a Keboola project.

## Create a Data App
First, enter a custom prefix for your data app, which you will share with your users later.

{: .image-popup}
![Code - main menu](/components/data-apps/data_apps-custom-data-app-url.png)

There are two ways to create a data app in Keboola. Select a deployment type that will suit your needs:
- **Code** – Just paste a Streamlit code to create a simple data app. 
- **Git repository** – Specify a Git repository with Streamlit app sources. This is more suitable for complex applications. For repository authentication, you must provide your GitHub username, private access token, or SSH private key.

{: .image-popup}
![Code - main menu](/components/data-apps/data_apps-main_menu.png)

### Code
For simple use cases where your Streamlit code fits on one page, paste the code directly into a text area. 
This deployment type is ideal for simple apps or for testing. Check out our [Titanic Demo App](https://demo.keboola.com/app/data-apps/49752130) or [this example from Streamlit docs](https://docs.streamlit.io/library/get-started/create-an-app#lets-put-it-all-together).

{: .image-popup}
![Code - code](/components/data-apps/data_app-development-type-code.png)
{: .image-popup}
![Code - code](/components/data-apps/data_apps-hello_world-code.png)

#### Packages
To use additional Python packages that are not already included in our [Streamlit Base Image](#base-image), enter them into the `Packages` field.

{: .image-popup}
![Packages](/components/data-apps/data_apps-packages.png)

### Git Repository
{% include warning.html content="Currently in beta, we only support GitHub repositories." %}

To provide feedback, use the feedback button in your project.
If you have a complex application, push your app sources into GitHub and link the repository in this section.
Provide the Project URL, choose the right branch, and finally, select your main entrypoint file.

{: .image-popup}
![Code - code](/components/data-apps/data_app-development-type-github.png)
{: .image-popup}
![Git repository](/components/data-apps/data_apps-git_repository_public.png)

If you are using a private repository, you have two options to authenticate:
- With your GitHub username and personal access token
- With an SSH private key

Follow these steps to authenticate using your GitHub username and personal access token:

1. Generate a personal access token on GitHub by going to your GitHub account settings, selecting **Developer settings > Personal access tokens**, and clicking **Generate new token**. Ensure the token has the necessare permissions to access the repository.

2. In Keboola, navigate to the **Data App Repository** in your data app configuration, check the `Private` option, and enter your GitHub username and the personal access token you generated in step 1.

3. Click **Save** to authenticate with the private repository.

To authenticate using your SSH private key, follow the instructions in the [GitHub manual](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent). After generating your key, enter your SSH private key into the appropriate configuration field and click **Save**.

Now, you can deploy your data app from the private repository and access it within your Keboola project.

{: .image-popup}
![Git repository](/components/data-apps/data_apps-git_repository_private_SSH.png)

## Secrets
To provide your app with environment variables or sensitive information like credentials, API keys, etc.
These secrets will be injected into the `secrets.toml` file upon deployment of the app. 

When you upload `secrets.toml` using the direct secrets upload UI, Keboola imports secrets as flat, top-level keys. Sections (TOML groups) are not preserved as nested structures. This means keys in the file become `st.secrets["your_key"]` after upload — you cannot access them as `st.secrets["group"]["key"]`.
If your app expects nested secrets, use repo-based secrets.

[Read more about the Streamlit secrets](https://docs.streamlit.io/streamlit-community-cloud/get-started/deploy-an-app/connect-to-data-sources/secrets-management).

### Direct Secrets Upload
You can now upload a `secrets.toml` file directly through the UI when developing an app from code. The upload process:
- Overwrites existing secrets with matching names.
- Preserves existing secrets that don't match the uploaded ones.
- Creates new secrets if they don't exist.
- Does not delete any existing secrets.

#### Example secrets.toml structure:
```
aws_key = "YOUR_AWS_KEY"
aws_secret = "YOUR_AWS_SECRET"
openai = "YOUR_OPENAI_KEY"
```
### Best Practices
1. Always use descriptive secret names to improve clarity.
2. Back up your secrets configuration regularly.
3. Review existing secrets before uploading new ones to avoid unintentional overwrites.
4. If you need nested/groups, use repo-based secrets. Direct upload does not support nested access.

## Access Storage from Data App
By default, there are two environment variables available that make it easy to access Keboola Storage from your application:

- `KBC_URL`: This represents the URL of the current Keboola project.
- `KBC_TOKEN`: This represents the Storage token with full read-write access to Keboola Storage. 

To securely access Storage, we recommend creating a dedicated Storage token with limited permissions and passing it to your Data App as a secret.
You can generate such a token following the [guide here](https://help.keboola.com/management/project/tokens/).

**Important:**
Do not name your secret `KBC_TOKEN`, as this name is reserved.

These environment variables can be accessed within your Streamlit data app code. Here is an example of how to initialize the Keboola Storage token:
```
# Constants
kbc_token = os.environ.get('KBC_TOKEN')
kbc_url = os.environ.get('KBC_URL')
# Initialize Client
client = Client(kbc_url, kbc_token)
```
These variables represent the project where the application is deployed. To map data from a different project, you need to configure the appropriate secrets.

## Loading Data from Storage
To load data from the Storage of a Keboola project into the app, use the [input mapping](https://help.keboola.com/transformations/mappings/#input-mapping) section.
Just select your table in the input mapping section and navigate to that by `/data/in/tables/your_data.csv` or `/data/in/files/fileID_FileName.*` in your code.
Note that, while in BETA, the app needs to be redeployed to fetch up-to-date data.
Or you can use the [Keboola Storage Python Client](https://github.com/keboola/sapi-python-client) in the app to load the data as needed.
See the [examples](#example-data-apps) below for usage of the Keboola Storage Python Client.

## Writing Back to Storage
For writing data back to Keboola Project Storage, use our [Keboola Storage Python Client](https://github.com/keboola/sapi-python-client).
See the [examples](#example-data-apps) below for usage of the Keboola Storage Python Client.

## Deployment and App Management
{% include warning.html content="Once the data app is deployed, its URL will be publicly available! Keboola provides two authorization methods." %}

### Authorization
We recommend using the authorization methods provided by Keboola. Select the method that best suits your app’s requirements and security needs.

{: .image-popup}
![Code - code](/components/data-apps/data_app-authentication.png)

#### Basic authorization 
This method allows you to authenticate a user using a password generated by Keboola.

{: .image-popup}
![Code - code](/components/data-apps/data_app-authentication-basic-proxy.png)

#### OIDC (OpenID Connect) authorization
This enables users to log into your app using your Single Sign-On (SSO) providers. 

{: .image-popup}
![Code - code](/components/data-apps/data_app-authentication-oidc.png)

If you enter an app with OIDC, you'll be asked to select an `Authentication Provider` and sign in.

{: .image-popup}
![Code - code](/components/data-apps/data_apps-select-oidc-provider.png)

#### None
Alternatively, you may implement your own authorization method within your Streamlit data app. For instance, you can use the Streamlit authenticator. For
guidance, check out the [Streamlit authenticator tutorial](https://blog.streamlit.io/streamlit-authenticator-part-1-adding-an-authentication-component-to-your-app/) 
or take a look at [our example](https://github.com/KB-PS/mkt-bi-ocr/blob/master/Select_Invoices.py).

{: .image-popup}
![Code - code](/components/data-apps/data_app-authentication-none.png)

## Theming
To configure theming in your data app, you can select from predefined themes or create a custom theme. Predefined themes include `Keboola`, `Light Red`, `Light Purple`, `Light Blue`, `Dark Green`, `Dark Amber`, and `Dark Orange`. Each theme has a specified primary color, background color, secondary background color, text color, and font. Users choosing `Custom` can manually set these values.

{: .image-popup}
![Code - code](/components/data-apps/data_apps-theming-predefined.png)

For `Custom`, users can select colors using the color pickers and choose the desired font from a list.

{: .image-popup}
![Code - code](/components/data-apps/data_apps-theming-custom.png)

### Predefined Themes:
1. **Keboola**  
   - Primary Color: `#1F8FFF`  
   - Background Color: `#FFFFFF`  
   - Secondary Background Color: `#E6F2FF`  
   - Text Color: `#222529`  
   - Font: Sans Serif

2. **Light Red**  
   - Primary Color: `#FF5D5D`  
   - Background Color: `#FFFFFF`  
   - Secondary Background Color: `#FFE6E6`  
   - Text Color: `#222529`  
   - Font: Sans Serif

3. **Light Purple**  
   - Primary Color: `#9A6DD7`  
   - Background Color: `#FFFFFF`  
   - Secondary Background Color: `#F2E6FF`  
   - Text Color: `#222529`  
   - Font: Sans Serif

4. **Light Blue**  
   - Primary Color: `#0000B2`  
   - Background Color: `#FFFFFF`  
   - Secondary Background Color: `#E6E6FF`  
   - Text Color: `#222529`  
   - Font: Sans Serif

5. **Dark Green**  
   - Primary Color: `#4CAF50`  
   - Background Color: `#222529`  
   - Secondary Background Color: `#3D4F41`  
   - Text Color: `#FFFFFF`  
   - Font: Sans Serif

6. **Dark Amber**  
   - Primary Color: `#FFC107`  
   - Background Color: `#222529`  
   - Secondary Background Color: `#4A3A24`  
   - Text Color: `#FFFFFF`  
   - Font: Sans Serif

7. **Dark Orange**  
   - Primary Color: `#FFA500`  
   - Background Color: `#222529`  
   - Secondary Background Color: `#4A3324`  
   - Text Color: `#FFFFFF`  
   - Font: Sans Serif
     
## Sleep and Resume
Our Suspend/Resume feature helps you save resources by automatically putting your app to sleep after an hour of inactivity. Here's how it works:

+**Activity Monitoring**: The app monitors for HTTP requests and active Websocket connections. If no activity is detected for one hour, the app automatically suspends. Please note that an inactive browser tab where your app is open may still cause background activity, potentially preventing your app from sleeping. If you're using Google Chrome, you may want to enable Memory Saver in the settings which can help preventing such background activity.

**Automatic Resumption**: As soon as a new request is made to the app, it wakes up and resumes operation. While the resume process is designed to be smooth, the first request upon waking may take slightly longer to process.

**Cost Efficiency**: For example, if your app is active for two hours and then becomes inactive, it will go to sleep after one additional hour of inactivity. You'll only be billed for the three hours when the app was active or waiting to suspend.

This feature is not only efficient but also intelligent—ensuring you pay only for what you use, while keeping the app ready for when you need it next.

If you enter the URL of a sleeping app, it will trigger its wakeup, and you'll see a **waking up** page.

{: .image-popup}
![Code - code](/components/data-apps/data_apps-proxy-wakeup.png)

Should anything unexpected occur, a **wakeup error** page will appear, and you can click **Show More** to view the error details.

{: .image-popup}
![Code - code](/components/data-apps/data_apps-proxy-error-wakeing-up.png)

### How to Set Up Inactivity Timeout
When you click **Deploy** or **Redeploy** for your app, a wizard will appear, prompting you to specify the backend size and the auto-sleep timeout. You can set the duration of inactivity after which the app will go to sleep, with options ranging from five minutes to 24 hours. The default is set to five minutes.

{: .image-popup}
![Code - code](/components/data-apps/data_apps-deploy-timeout-backedsize.png)

### Base Image
When the app is deployed, the code specified in one of the deployment methods will be injected into the Streamlit base Docker image.
You can select a specific backend version when deploying your app. Each version defines the Python version, Streamlit version, and a set of pre-installed packages.

The following packages are pre-installed in all backend versions:

- `streamlit`, `pandas`, `numpy`, `matplotlib`, `plotly`, `scikit-learn`, `seaborn`
- `graphviz`, `deepmerge`, `python-dotenv`, `toml`
- `keboola.component`, `streamlit-aggrid`, `streamlit-keboola-api`, `streamlit_authenticator`

Starting with backend version **1.15.0**, each release is available with multiple Python versions (3.10, 3.11, 3.13). Python 3.10 is the default.

For the full list of available versions, pre-installed packages, and a changelog of what changed in each release, see the [Backend Versions](/data-apps/backend-versions/) page.

### Actions Menu
{: .image-popup}
![Secrets](/components/data-apps/data_apps-manage-redeploy-2.png)

- **Deploy Data App** – starts the data app. Once the deployment job is finished, you can go to the data app public URL by clicking **Open Data App**.
- **Open Data App** – opens a new window with your data app.
- **Redeploy** – if you made changes in the data app configuration, you have to redeploy it for the changes to take effect.
- **Suspend Data App** – stops the data app. The container in which the application is running will be stopped, and the app's URL will no longer be available. The configuration of the app will remain intact.
- **Delete Data App** – stops the data app deployment and deletes its configuration.

### Debugging App Deployment
If the data app's deployment job fails, you can see the logs from its container in the event log of the deployment job.  
For example, there may be a conflict with the specified packages:

{: .image-popup}
![Secrets](/components/data-apps/data_apps-job_error_log.png)

## AgGrid Enterprise License
The AgGrid Enterprise License is now available for Streamlit Data Apps in Keboola, offering enhanced data manipulation capabilities, including:

- Inline dataset editing.
- Advanced features such as pivoting, filtering, and sorting.
- A professional interface, free from the "trial use only" watermark.
 
Ensure your data app is configured to use the AgGrid component to take advantage of these enhanced features.

### How to Enable the License
The **enterprise license** is **pre-configured for all Keboola stacks**, so no additional setup is required for supported applications.

To access the license key in your Streamlit app, use the following code:

```
import streamlit as st
from keboola_streamlit import KeboolaStreamlit

URL = st.secrets["kbc_url"]
TOKEN = st.secrets["kbc_token"]

keboola = KeboolaStreamlit(URL, TOKEN)
license_key = keboola.aggrid_license_key
```

You can use this license_key directly in **AgGrid**.

**Reference Implementation:**   
[Keboola Streamlit Integration](https://github.com/keboola/keboola_streamlit/blob/main/src/keboola_streamlit/keboola_streamlit.py#L31)

## Example Data Apps

### Hello World
Author: Jordan Burger

This demo data app shows how to create a data app with Streamlit Python code from a code directly in Keboola.

- [Configuration](https://demo.keboola.com/app/data-apps/75298630)
- [Live app](https://hello-world-75299519.hub.north-europe.azure.keboola.com)
  
### Titanic Demo App
Author: Monika Feigler

This demo data app shows how to create a data app with Streamlit Python code and how to incorporate data and files from an input mapping into your code. This data app allows users to explore and analyze the Titanic dataset using interactive visualizations and filters.

- [Configuration](https://demo.keboola.com/app/data-apps/49752130)
- [Source](https://github.com/keboola/titanic-data-app)
- [Live app](https://titanic-demo-app-deployed-from-a-github-repository-49752295.hub.north-europe.azure.keboola.com/)

### AI-Created Content Checker
Author: Petr Huňka

This demo app offers a cutting-edge solution that leverages Shopify data to supercharge your campaigns. By harnessing the power of artificial intelligence (AI), tailor-made SMS messages are created and delivered 
through Twilio's platform. The result? A seamlessly personalized approach that captivates your audience, ensuring your marketing efforts are not only effective but also driven by AI precision.

- [Configuration](https://demo.keboola.com/app/data-apps/51362322)
- [Documentation](/flows/templates/ai-sms-campaign/)
- [Source](https://github.com/keboola/ai_campaign_executer)
- [Live app](https://ai-created-content-checker-ai-campaign-executer-51814454.hub.north-europe.azure.keboola.com)
  
The complete workflow for this data app can be implemented using the AI SMS Campaign template.

### Interactive Keboola Sheets
Author: Petr Huňka

Simplify data editing and management within your company. The data app eliminates the need to export data to external tools, allowing business users to directly access and edit tables stored in Keboola Storage.
- [Live app](https://interactive-keboola-sheets-keboola-sheets-app-51814820.hub.north-europe.azure.keboola.com)
- [Configuration](https://demo.keboola.com/app/data-apps/51359967)
- [Documentation](/flows/templates/interactive-keboola-sheets/)
- [Source](https://github.com/keboola/planning-sheets-data-app/)

This data app, along with the complete workflow, can be implemented using the Interactive Keboola Sheets template.

### eCommerce KPI Dashboard
Author: Ondřej Svoboda

This data app provides an interactive display of several business metrics with integrated Slack notifications.
- [Live app](https://interactive-kpi-report-kpi-app-71250158.hub.north-europe.azure.keboola.com)
- [Configuration](https://demo.keboola.com/app/data-apps/51361334)
- [Documentation](/flows/templates/ecomm-kpi-dashboard/)
- [Source](https://github.com/keboola/interactive-kpi-reporting)

This app, along with the complete workflow, can be implemented using the eCommerce KPI Dashboard template.

### Online Marketing Dashboard
Author: Monika Feigler

This demo app provides an overview of the costs for all campaigns across marketing channels. 
- [Live app](https://online-marketing-dashboard-49569899.hub.north-europe.azure.keboola.com)
- [Configuration](https://demo.keboola.com/app/data-apps/49567241)
- [Documentation](/flows/templates/marketing-platforms/)
- [Source](https://github.com/keboola/marketing-dashboard-data-app)

This data app, along with the complete workflow, can be implemented using the Advertising Platform template.

### UA and GA4 Data Comparison
Author: Marketing BI and Keboola

This data app is designed to provide a quick and comprehensive overview of the differences between data gathered by Google’s Universal Analytics (UA) and Google Analytics 4 (GA4).
- [Configuration](https://demo.keboola.com/app/data-apps/51525772)
- [Documentation](/flows/templates/ua-and-ga4-comparison/)
- [Source](https://github.com/keboola/ua-ga4-comparison)
- [Live app](https://ua-ga4-comparison-app-51525847.hub.north-europe.azure.keboola.com)

This app, along with the complete workflow, can be implemented using the UA and GA4 Comparison template.
