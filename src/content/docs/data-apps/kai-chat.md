---
title: Add a Kai chat to your app
lastUpdated: 2026-11-26
slug: 'data-apps/kai-chat'
description: 'Give the visitors of your Python/JS app a ready-made Kai chat: turn on Kai in the app, mount the server relay, render the chat component, and know what Kai can read.'
---

:::caution[Public Beta]
Kai in apps is in public beta. It works in Python/JS apps with a React frontend and a Node backend.
<!-- VERIFY(Miro): how a project gets the beta (self-service switch, on for everyone, or on request) is not decided yet. -->
:::

Turn on **Kai in the app** and your app's visitors can ask Kai about the data behind the page they're looking at. You don't write the chat yourself: the app's backend mounts a relay from `@keboola/api-client`, and the page renders a ready-made chat component. The Kai token stays on the server.

Use it when visitors want to ask follow-up questions that your charts and tables don't answer, such as "Why did revenue drop last week?" or "Which regions are behind plan?". Kai in an app only reads; it can't change anything in the project.

**On this page:** [Before you start](#before-you-start) · [Turn on Kai in the app](#1-turn-on-kai-in-the-app) · [Mount the relay](#2-mount-the-relay-on-the-backend) · [Render the chat](#3-render-the-chat) · [Customize the chat](#customize-the-chat) · [What Kai can read](#what-visitors-can-ask-and-what-kai-can-read) · [Beta limits](#limits-of-the-beta) · [HTTP API](#use-the-http-api-instead) · [Troubleshooting](#troubleshooting)

## Before you start

You need:

- A Python/JS app with a React frontend and a Node (Express or Fetch) backend. [Build locally](/data-apps/build-locally/) covers the layout.
- Kai turned on in the project. See [Kai](/kai/#getting-started).
- **Storage Access** turned on for the app. Kai works in the app's workspace. See [Storage Access](/data-apps/reference/#storage-access).
- No row-level or column-level security. Kai isn't available in an app with row or column policies, or in a project with the `row-level-security` feature, yet.

During the beta, the **Kai in the app** setting appears only in projects where the feature is available.

The chat spends the project's [Kai credits](/kai/pricing/), like any other Kai conversation.

## 1. Turn on Kai in the app

1. Open the app in **Apps** and go to **Advanced Settings**.
2. Turn on **Kai in the app**.
3. Deploy the app again. Turning Kai on or off takes effect at the next deploy.

<!-- Screenshot needed: Advanced Settings with the "Kai in the app" switch on. -->

Each deploy gives the app its own Kai token, valid for 90 days. The platform puts it in the `KAI_STORAGE_API_TOKEN` environment variable and sets `KAI_ENABLED`. The relay in the next step reads both; your code doesn't need to.

If Kai can't be turned on, the setting says why, for example "Kai needs Storage access. Turn it on first."

In an app with a Keboola-managed repository, **Set up with Kai** under the setting opens the Builder and asks Kai to check or add the app's chat.

## 2. Mount the relay on the backend

The relay ships in `@keboola/api-client`. `initializeApp()` returns `kai`, which you mount on the app's own server:

```ts
import express from 'express';
import { initializeApp } from '@keboola/api-client/sdk/dataAppServer';

const app = express();
const kbc = initializeApp();

app.use('/api/kai', kbc.kai.expressHandler());
```

Mount it before any handler that answers unmatched `/api` paths with 404. You can mount it at another path, but the chat component expects `/api/kai` unless you tell it otherwise.

On a server built on the Fetch API (`Request` in, `Response` out), call the handler directly:

```ts
const response = await kbc.kai.handle(request);
```

What the relay does for you:

- **Picks the token.** It uses `KAI_STORAGE_API_TOKEN` when `KAI_ENABLED` is on, and never `KBC_TOKEN`. It sends the app's workspace with every request.
- **Keeps the token on the server.** The browser talks only to your app. The token never reaches it.
- **Rebuilds every chat request.** It passes on one text message (up to 8,000 characters) and the page context, and drops everything else the browser sends, such as a model, project or branch. Kai always runs with read-only tools.
- **Binds chats to the browser.** The relay issues chat IDs and keeps them in a signed cookie (`HttpOnly; Secure; SameSite=None; Partitioned`). A chat opens only in the browser that started it. The cookie keeps the last 5 chats.
- **Refuses approvals.** A visitor can decline an action Kai proposes, never approve it.
- **Refuses requests from other sites.** A request from another origin gets 403; a request body over 64 KB gets 413.
- **Streams answers.** Kai's streamed answer passes through unbuffered, also behind nginx.

The chat works inside the Builder preview as well as in the deployed app.

### Run it locally

On your computer there's no Kai token. To try the chat locally, let the relay use your own token from `STORAGE_API_TOKEN`:

```ts
const kbc = initializeApp({ kai: { allowPersonalToken: true } });
```

The relay uses `STORAGE_API_TOKEN` only with this option and only while `KAI_ENABLED` is off. Kai then reads with your access, for every visitor of the app. Keep this option out of deployed apps.

## 3. Render the chat

The browser half is the `@keboola/kai-app-chat` package. Add the component once, for example in your root layout:

```tsx
import { KaiChat } from '@keboola/kai-app-chat';
import '@keboola/kai-app-chat/styles.css';

export function App() {
  return (
    <>
      {/* your app */}
      <KaiChat title="Ask Kai" />
    </>
  );
}
```

The component opens as a floating button in the corner of the page and streams Kai's answers into a panel. When Kai is off for the app, or the run has no Kai token, it renders nothing.

<!-- Screenshot needed: an app page with the Kai chat panel open and a streamed answer. -->

## Customize the chat

You can change the chat at three levels.

| Level | What you change | How |
|---|---|---|
| Theme | Colors, corner radius, font, light or dark mode | The `theme` prop, or CSS variables on `.kai-chat` |
| Props | Title, greeting, suggested questions, placement, page context, relay path | Props on `<KaiChat>` |
| Your own UI | The whole chat window | The `useKaiChat()` hook from `@keboola/kai-app-chat/headless` |

### Theme

The chat's styles are scoped under the `.kai-chat` class, so they don't change the rest of your app and your app's styles don't leak in. By default the chat uses your app's font.

```tsx
<KaiChat theme={{ mode: 'light', primary: '#1f8fff', radius: 8 }} />
```

### Props

```tsx
<KaiChat
  title="Ask Kai"
  greeting="Ask about the numbers on this page."
  suggestedPrompts={['Why did revenue drop last week?', 'Top 5 regions by margin']}
  context={{ title: 'Sales overview', text: 'Chart: revenue by region, filter Q3 2026' }}
  placement="panel"
  endpoint="/api/kai"
/>
```

- `context` tells Kai what the visitor is looking at: a `title` (up to 200 characters) and a `text` (up to 2,000 characters). It's sent with each message, so keep it in step with what's on screen.
- `placement` is `floating` (the default), `panel` or `inline`.
- `endpoint` is the path where you mounted the relay. The default is `/api/kai`.

<!-- VERIFY(Miro): kai-agent reads `appContext` (page context) by the beta day. -->

### Your own UI

To build the chat window yourself, use the headless hook. It gives you the messages and the actions, and no markup:

```tsx
import { useKaiChat } from '@keboola/kai-app-chat/headless';

const { messages, status, send, stop, error } = useKaiChat({ endpoint: '/api/kai' });
```

## What visitors can ask and what Kai can read

Visitors can ask anything about the data Kai can read: totals, trends, comparisons, why a number changed, which rows stand out. Kai answers by querying the data, and it can explain how Keboola works. It can't create, change or run anything.

Kai reads the same data the app reads. It depends on the app's input mapping:

- **Read-only access to the whole Storage** (the default). Kai reads every bucket that exists in the app's branch when the app is deployed. Its queries run in the app's workspace.
- **Direct Grant input mapping.** Kai sees only the buckets of the tables the app maps, and its queries reach only the mapped tables. The access is granted per bucket, not per table: Kai lists every table in such a bucket with its columns and row count, also the tables the app doesn't map. Keep a table that visitors must not learn about in a bucket the app doesn't map.

Both depend on the buckets that exist at deploy time. Deploy the app again after you add a bucket or change the mapping.

All visitors of one app are one Kai user. Kai doesn't know who is asking, and every visitor reads the same data, whoever signed in to the app. Row-level security per visitor isn't available in the beta.

## Limits of the beta

- **React apps only.** Streamlit apps, apps with a Python backend (for example FastAPI) and apps without React have no ready-made chat yet. See [Use the HTTP API instead](#use-the-http-api-instead).
- **One Kai user per app.** There are no per-visitor permissions and no row-level security per visitor.
- **Read-only.** Kai can't change the project. The relay refuses every approval; declining passes.
- **No answers to Kai's questions.** When Kai asks the visitor a follow-up question, the visitor can't answer it yet.
- **Chats stay in one browser.** A chat opens only in the browser that started it. A redeploy gives the app a new token, which ends the open chats.
- **Message size.** One message holds up to 8,000 characters of text. Files can't be attached.

## Use the HTTP API instead

If your app doesn't use React, or you want full control, your backend can call Kai's HTTP API itself. The app-building skill's [Kai integration reference](https://github.com/keboola/ai-kit/blob/main/plugins/dataapp-developer/skills/dataapp-development/references/kai-integration.md) describes the token, the headers, the stream and a relay for an Express backend.

If you write your own relay, keep the same rules: the token stays on the server, and the relay passes on only "no" to an approval. Every visitor is the same Kai user, so an approval from one visitor would run Kai's action for all of them.

## Troubleshooting

### The chat doesn't appear

The component renders nothing when Kai is off for the app or the run has no Kai token.

- Check that **Kai in the app** is on in **Advanced Settings**, then deploy the app again.
- Check the app's logs. "Kai is on, but this run has no Kai token; deploy the app again." means the app started without a Kai token. A new deploy by a project member gives it one.
- Check that the relay is mounted at the path the component calls (`/api/kai` by default).

### Deploy fails after turning Kai on

The **Kai in the app** setting says why. "This project doesn't allow Kai in apps, so deploys fail until you turn Kai off." means the project doesn't have the feature. Kai also needs Storage Access, and it isn't available with row or column policies. Turn Kai off to deploy the app without it.

### 403

- "Kai requests must come from the app itself." The request came from another site. Serve the page and the relay from the same app.
- "Visitors cannot approve Kai actions." The chat sent an approval. In an app, a visitor can only decline.

### 404 "Chat not found"

The chat ID isn't in this browser's session. It was started in another browser, the cookie was cleared, or the app was deployed again. Start a new chat.

### 429

Kai's rate limit or a Kai spending limit was reached. When the response has a `Retry-After` header, the chat can send again after that time. For spending limits, see [Kai pricing and limits](/kai/pricing/#setting-limits).

<!-- VERIFY(Miro): how the rate limit counts for app chats in the beta (shared by all visitors of an app, or per chat). -->
