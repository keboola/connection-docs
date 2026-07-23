---
title: Build your first app with Kai
slug: 'data-apps/getting-started'
description: Build and publish a Keboola app in about 10 minutes — describe it to Kai, preview the live draft, publish to production. Plus prompting tips, the approval model, and manual creation.
redirect_from:
  - /data-apps/build-with-kai/
  - /data-apps/build-in-the-ui/
---



Kai builds a working app from a plain-language description — no coding and no Git account needed. From one chat it reads your governed data, writes the code, and opens a live draft you can preview, refine, and publish. This walkthrough takes you from nothing to a **live, published app in about 10 minutes**, and covers the details you'll want next: how to prompt, what Kai asks before touching your project, how drafts become production, and the [manual creation path](#create-an-app-manually) on the same screen.

Apps go well beyond dashboards — the same steps produce internal tools, data narratives, or [anything interactive](/data-apps/#beyond-dashboards). This page builds a simple dashboard so you can learn the flow.

## What you'll need

- A Keboola project with **Kai** available. <!-- TODO(human-review, Adam Vyborny): state the exact prerequisite. Building Python/JS apps requires the new Kai backend enabled on the project. Give the real enablement step or link. -->
- At least one table in **Storage** — Kai reads your data directly, so it works with whatever you already have.
- A few minutes.

:::tip[Get your agent started right away]
Building with Claude Code, Cursor, or Copilot? Grab the skill and add it to your agent — or install the full [AI Kit](/ai/ai-kit/) plugin marketplace. The download is the complete skill folder: the skill itself, ready-made app templates (Python, Node.js, full-stack, Streamlit), and reference guides your agent can draw on.

<a class="skill-download-btn" href="/data-apps/keboola-dataapp-development-skill.zip" download="keboola-dataapp-development-skill.zip">⬇ Download the app-building skill (with templates)</a>
<!-- Full skill folder vendored verbatim from keboola/ai-kit@b7f57df (plugins/dataapp-developer/skills/dataapp-development/) as a zip so the download works same-origin. Per Jordan (Jul 14 sync): ship the whole folder — skill + templates + references — not just SKILL.md. TODO: sync mechanism when repo→docs mirroring lands (Jordan). -->
:::

## Step 1 — Open Apps and start a new app

In your project, open **Apps** from the left navigation, then click **+ Create App**.

![The Apps list in a Keboola project with the Create App button in the top right](/data-apps/getting-started-apps-list.png)

You land on the **Build web apps from your Keboola data** screen. It leads with a single prompt — *"Describe what you want to build…"* — and, below it, manual **Streamlit** and **Python / JS** options for when you'd rather [set things up yourself](#create-an-app-manually). (The **Kai Agent** chat anywhere in your project works too.)

![The Create App screen: a "Describe what you want to build" prompt with manual Streamlit and Python/JS options below](/data-apps/getting-started-create-app.png)

## Step 2 — Describe the app you want

Type what you want in plain language. The clearer your prompt, the closer Kai's first version lands — name three things: **the data**, **the audience**, and **the main action** you want people to take. For example:

> Build a simple dashboard from my Storage data: a title, three key metrics as big number tiles, and one bar chart. Keep it clean and easy to read.

The more specific you are — which tables, which charts, who it's for — the less you'll need to refine afterward.

## Step 3 — Watch Kai read your data, verify it, and ask for your approval

Kai gets to work. It **explores your Storage on its own** — listing buckets, reading table details, even sampling the data to verify its queries will work. Then, before creating anything in your project, it shows a **Confirmation required** card with the exact app configuration — name, description, and authentication type — and waits for your **Approve** (or **Decline**; **Always allow** skips this prompt for future builds).

![Kai's confirmation card before creating the app: the generated configuration with Decline, Always allow, and Approve buttons, next to the draft-vs-production explainer](/data-apps/getting-started-approve.png)

After you approve, Kai creates the app, sets up a **private draft**, and writes the code — you see each step in the chat (*File index.ts edited*, *Writing file…*) while it deploys a development container.

In our run, Kai found the project's Shopify tables and built a **Toy Store Sales Dashboard**: total orders, revenue, and customers as tiles, plus a "top products by orders" bar chart.

![Kai building the dashboard: creating the prod app and the draft, deploying the dev container, and writing each file, next to the draft panel](/data-apps/getting-started-kai-build.png)

## Step 4 — Preview the draft and refine it

The build runs in a **split-screen builder**: your chat with Kai on the left, and the app as a **draft** on the right — toggle between a live **Preview** and the **Code** view of its files. As the product puts it, this is *"a private draft that updates live as Kai builds"* — it hot-reloads as Kai edits and doesn't touch anything you've shared.

![The split-screen builder: Kai's chat next to the live Preview of the Toy Store Sales Dashboard draft — metric tiles and a top-products chart — with the Publish to Production button](/data-apps/getting-started-draft-preview.png)

Kai's first version is a starting point, not the final word. Keep chatting to change it — a different chart, another metric, a new filter, a cleaner layout — in as many rounds as you need. Kai finishes each round with next-step suggestions: **Publish to production**, **Make changes**, or type your own.

## Step 5 — Publish to production

When you're happy with the draft, click **Publish to Production**. Kai merges the draft into the app's main branch, deploys the production app, and cleans the draft up. The app turns **Active** and is available at its own URL — and Kai's final message hands you the **App URL, the password, and an Open App button**.

![The published app: the configuration page showing Active status, next to Kai's final message with the App URL, the generated password, and an Open App button](/data-apps/getting-started-deployed.png)

By default the app is protected with **Basic (Password)** authentication — the generated password also sits on the app's configuration page, ready to copy. To change who can access it (public, a password, SSO, GitHub, and more), see [Authentication](/data-apps/authentication/).

Open the URL, enter the password, and your app is live — running on your governed data, served from its own address:

![The published Toy Store Sales Dashboard open at its own URL — metric tiles and the top-products chart, no Keboola chrome around it](/data-apps/getting-started-live-app.png)

That's it — you've built and published your first app, and you never picked a framework. The sections below cover the mechanics you'll want as you build more.

## What Kai does on its own — and what it asks first

Kai explores your Storage without asking, so it can find the right tables and understand your data. But before it **creates or modifies the app** in your project, it shows the **Confirmation required** card and waits for your **Approve** — click **Always allow** to skip the prompt for future builds ([Tool Permissions](/kai/settings/#tool-permissions) gives you the same control centrally). The draft itself is private: nothing is shared until you publish.

## How drafts become production

A draft is your private working version with live preview — Kai keeps it on its own branch in the app's managed Git repository, alongside the production app it created up front. **Publish to Production** merges the draft branch into `main`, deploys the production app, and cleans the draft up.

<!-- Publish mechanics observed live (264, 2026-07-10): update context file (CLAUDE.md in the app repo), merge draft branch → main, deploy prod, delete draft branch/config. -->

## How Kai handles data access

Kai uses your data through the project's access controls — the app can only reach data the project can reach. Read-only access is used by default, so the app can't change your data unless you ask for write-back.

<!-- TODO(human-review, Adam Vyborny): confirm "read-only by default" claim and how write-back is enabled. -->

## Create an app manually

Prefer to set the app up yourself, without the chat? Manual creation lives on the same **Create App** screen, under **or create manually** — pick a stack and Keboola sets the app up for you to configure.

![The Create App screen: the Kai prompt at the top and, under "or create manually", the stack choice cards](/data-apps/build-in-ui-create.png)

1. In your Keboola project, open **Apps** and click **+ Create App**.
2. Under **or create manually**, choose a stack — **Python / JS** (custom apps, production UIs) or **Streamlit** (existing Streamlit apps; basic Python).
3. Name the app and click **Create App**. It opens on its own configuration page, marked **Not Deployed**.
4. Set the **code source** and the **Authentication** method. A **Python / JS** app runs from a **Git repository** — connect one (there's no inline-code option for Python/JS). A **Streamlit** app can use inline **Code** or a Git repository.
5. Configure the rest of the app's settings — backend size, auto-sleep, and more; see [Reference](/data-apps/reference/) for the full list.

![The app's configuration page: the Overview tab with Authentication and a Git Repository section, plus the App Info panel showing backend version, size, auto-sleep, and App ID](/data-apps/build-in-ui-config.png)

6. Click **Deploy App**. A short wizard asks for the **backend size** and an **inactivity timeout**, then deploys the app. (The same wizard runs on **Redeploy**.)

![The deploy/redeploy wizard: backend size and inactivity timeout](/data-apps/deploy-timeout-backedsize.png)

7. When the status turns **Active**, click **Open App** to open it at its public URL. Use **Redeploy** to apply any later config change; see [App actions](/data-apps/reference/#app-actions).

---

**Next:** [Build an app locally →](/data-apps/build-locally/)
