---
title: Build an app in the UI
slug: 'data-apps/build-in-the-ui'
description: Create, configure, and deploy a Keboola app from the interface.
---



Build an app directly in the Keboola interface when you want to set it up yourself without coding from scratch.

## Before you start

- A Keboola project with the data you want to use.

## Create the app

1. In your Keboola project, go to the **Apps** section. <!-- VERIFY(Miro): exact navigation label and entry point. -->
2. Click the **+** button to create a new app.
3. Choose your technology stack (Streamlit or Python/JS).

![Choose type](/data-apps/app-modal.png)

4. Enter a custom URL prefix for your app and select a deployment method (Code or Git repository).
5. Configure the app's settings — see [Reference](/data-apps/reference/) for the full list.
6. Click **Deploy**. Your app will be available at its public URL.

<!-- TODO(human-review, Miro): replace the steps above with the real UI flow. Keep UI-locator screenshots only; transcribe any code/config into fenced blocks with masked placeholders. -->

## Configure access and settings

Each app has its own settings, including authentication, URL, and versioning. See:

- [Authentication](/data-apps/authentication/) — who can open the app.
- [Reference](/data-apps/reference/) — all per-app settings.

## Next steps

- [Publish and share](/data-apps/publish-and-share/)
- Want Kai to set this up for you instead? See [Build with Kai](/data-apps/build-with-kai/).
