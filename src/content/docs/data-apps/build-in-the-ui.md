---
title: Build an app in the UI
slug: 'data-apps/build-in-the-ui'
description: Create, configure, and deploy a Keboola app from the interface.
---



Build an app directly in the Keboola interface when you want to set it up yourself without coding from scratch.

## Before you start

- A Keboola project with the data you want to use.

## Create the app

Manual creation lives on the **Create App** screen, under **or create manually** — pick a stack and Keboola sets the app up for you to configure.

![The Create App screen: the Kai prompt at the top and, under "or create manually", the Streamlit and Python / JS choice cards](/data-apps/build-in-ui-create.png)

1. In your Keboola project, open **Apps** and click **+ Create App**.
2. Under **or create manually**, choose a stack — **Streamlit** (dashboards, data exploration, internal tools; basic Python) or **Python / JS** (custom apps, production UIs; connect a Git repository).
3. Name the app and click **Create App**. It opens on its own configuration page, marked **Not Deployed**.
4. Set the **Code Source** — paste inline **Code** or connect a **Git Repository** — and pick the **Authentication** method.
5. Configure the rest of the app's settings — backend size, auto-sleep, and more; see [Reference](/data-apps/reference/) for the full list.

![The app's configuration page: the Overview tab with Authentication and Code Source (Git Repository or Code), plus the App Info panel showing backend version, size, auto-sleep, and App ID](/data-apps/build-in-ui-config.png)

6. Click **Deploy App**. A short wizard asks for the **backend size** and an **inactivity timeout**, then deploys the app. (The same wizard runs on **Redeploy**.)

![The deploy/redeploy wizard: backend size and inactivity timeout](/data-apps/deploy-timeout-backedsize.png)

7. When the status turns **Active**, click **Open App** to open it at its public URL. Use **Redeploy** to apply any later config change; see [App actions](/data-apps/reference/#app-actions).

<!-- Steps + labels observed live in the Create App / manual-Streamlit flow (us-east4, dev branch): "or create manually" cards → Create App → config page (Not Deployed, Code Source: Git Repository / Code, Authentication) → Deploy App wizard. Confirm labels are identical across stacks/stacks-versions before treating as final. -->

## Configure access and settings

Each app has its own settings, including authentication, URL, and versioning. See:

- [Authentication](/data-apps/authentication/) — who can open the app.
- [Reference](/data-apps/reference/) — all per-app settings.

## Next steps

- [Publish and share](/data-apps/publish-and-share/)
- Want Kai to set this up for you instead? See [Build with Kai](/data-apps/build-with-kai/).
