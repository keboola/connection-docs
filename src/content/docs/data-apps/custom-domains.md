---
title: Custom domains
lastUpdated: 2026-11-27
slug: 'data-apps/custom-domains'
description: Serve a Keboola app on your own domain, such as app.example.com. Add the domain, create a CNAME record, and optionally make it the app's primary URL.
---

By default an app is served at a Keboola address that ends in `.hub.<stack-host>`. A custom domain lets you serve the same app at an address you own, such as `app.example.com`.

Adding a domain does not change the app. The app keeps answering on its Keboola address, and the new domain answers next to it. Making the domain the app's **primary URL** is a separate step, and it restarts the app once.

<!-- VERIFY(product): UI labels and where the Custom domain settings sit in the app configuration; the UI PRs (UI2) are not merged yet. -->

:::caution[Availability]
Custom domains are rolled out stack by stack. They work only on public multi-tenant stacks, only for Python/JS apps, and with one custom domain per app. Streamlit apps are not supported yet. If your stack does not offer them, the **Custom domain** settings do not appear.
:::

## Before you start

- The app is a Python/JS app on a stack where custom domains are enabled.
- You own a domain and can edit its DNS records.
- The domain is a **subdomain** such as `app.example.com`. A bare domain such as `example.com` (an apex domain) is not supported, because a CNAME record cannot sit at the apex. DNS features that fake a CNAME at the apex, called ALIAS or CNAME flattening, hide the target, so Keboola cannot verify them.
- Your DNS provider does not proxy the record. See [Create the DNS record](#create-the-dns-record).

## Add a domain

1. Open the app's configuration and find the **Custom domain** settings.
2. Enter the domain, for example `app.example.com`, and add it.
3. Copy the DNS record that Keboola shows.

Keboola lowercases the name and removes a trailing dot. It rejects wildcards, IP addresses, public suffixes such as `co.uk`, reserved names such as `localhost`, and any address under a Keboola domain.

If the app has never been deployed, the domain stays **pending** until you deploy it.

## Create the DNS record

At your DNS provider, add one CNAME record:

| Field | Value |
|---|---|
| Type | `CNAME` |
| Name | your domain, for example `app.example.com` |
| Value | `<app-id>.alias.<stack-host>` |

For example: `app.example.com → 74016144.alias.europe-west3.gcp.keboola.com`. Copy the exact value from the **Custom domain** settings. It contains your app's ID and your stack's host.

Rules for the record:

- **DNS only.** Turn off CDN or proxy mode. In Cloudflare, set the record to **DNS only** (grey cloud), not **Proxied** (orange cloud). Keboola checks the CNAME in public DNS, and a proxy hides it. The app's certificate is issued for the domain itself, so there is no CDN in front of it.
- **One CNAME at the name.** A name can't hold a CNAME and other records at once.
- **No apex.** ALIAS and CNAME flattening records at the apex are not supported.

### Allow certificate issuance (CAA)

Keboola gets a free certificate from Let's Encrypt. If your domain has CAA records, they must allow it. Add this record to the CAA set of the zone that holds the domain:

```
0 issue "letsencrypt.org"
```

If the domain has no CAA records, you don't need to do anything.

## Wait for the domain to become active

DNS changes take time to spread. Keboola checks DNS by itself, so you don't need to click anything. After a wrong or missing record, the negative answer may stay cached at your DNS provider for a few minutes, up to the TTL of the zone's SOA record.

The domain shows one of these statuses:

| Status | Meaning | What to do |
|---|---|---|
| **Pending** | Keboola is setting up the domain, or the app has not been deployed yet. | Deploy the app if you have not. Otherwise wait. |
| **Awaiting DNS** | Keboola can't see the right CNAME. Either the record is missing, it points somewhere else, or a proxy or apex flattening hides it. The status message shows what Keboola sees. | Create or fix the CNAME. Turn off proxying. Use a subdomain. |
| **Issuing certificate** | The CNAME is right. Keboola is getting the certificate. | Wait. This usually takes a few minutes. |
| **Queued** | Many certificates are being issued. Yours waits in line. | Wait. |
| **Active** | The domain serves the app over HTTPS. | Nothing. |
| **DNS points elsewhere** | The CNAME points to another app. | Point it to this app's target, or remove this domain. |
| **Domain in use** | Another app on this stack serves this domain. | Point the CNAME to this app's target to move the domain here. |
| **CAA blocked** | A CAA record does not allow Let's Encrypt. | Add the [CAA record](#allow-certificate-issuance-caa). |
| **Certificate error** | Issuing the certificate failed. The message shows the reason. | Fix the cause in the message. Check CAA and the CNAME. |
| **DNS lost** | The CNAME has been missing for 48 hours. The domain no longer serves the app. | Create the CNAME again. |
| **Rejected** | The domain is not allowed. The message shows the rule. | Use another domain. |

An active domain keeps working through certificate renewals. Keboola renews the certificate by itself. If a renewal fails, the status turns to an error. Before the certificate expires, the status shows a warning.

## Make a domain the primary URL

An active domain serves the app, but the app's primary URL stays the Keboola address until you change it. The primary URL is the address in **Open**, in the **App URL** block, in the API and in the app's `KBC_APP_PUBLIC_URL` environment variable.

To make the domain primary, click **Make primary** next to the active domain and confirm.

This acts like moving the app to other hosting. It is a normal re-deploy:

- **The app restarts once**, if it is running. Its input mapping runs again and open WebSocket connections reconnect. If the new instance fails to start, the app can stop. Check the [terminal log](/data-apps/reference/#terminal-log) after the change.
- **The app gets one URL.** `KBC_APP_PUBLIC_URL` holds the custom domain. Anything your app builds from it moves too, for example an OAuth issuer or resource URL, or a webhook address.
- **Integrations bound to the old address are not moved.** Webhooks, connectors and other integrations that you set up on the Keboola address must be created again on the custom domain.
- **Nothing is turned off.** The Keboola address and every other domain of the app keep serving it, and Keboola does not redirect between them. The app decides what to do with requests on each host. See [Write an app for several hosts](/data-apps/reference/#write-an-app-for-several-hosts).
- **Sign-in is set up per host.** Register the login callback of the custom domain with your provider. See [Login callbacks per host](/data-apps/authentication/#callback-urls-per-host).

To go back, click **Use the Keboola address as primary**. This restarts the app once more. The custom domain keeps serving the app.

### If the primary domain breaks

Keboola never changes the primary URL by itself. If the DNS record is removed or the certificate fails, the domain stays primary and its status shows the error. The app is then reachable only at its Keboola address. Fix the DNS record, or reset the primary to the Keboola address. Resetting works in any status.

## Remove a domain

Remove the domain in the **Custom domain** settings. Removing a non-primary domain does not restart the app. Removing the primary domain sets the primary back to the Keboola address, with one restart. Then delete the DNS record at your provider.

## Move a domain to another app

A domain serves one app per stack. To move it, add the domain to the new app and point the CNAME to the new app's target. The old app loses the domain when DNS changes, and its status shows **DNS points elsewhere**. You can then remove the domain from the old app.

## Limits

| Limit | Value |
|---|---|
| Domains per app | 1 |
| App types | Python/JS apps. Streamlit apps are not supported yet. |
| Stacks | Public multi-tenant stacks where custom domains are enabled. Single-tenant (private) stacks are not supported. |
| Domain type | Subdomains only. No apex, no wildcards. |
| DNS | A plain CNAME to `<app-id>.alias.<stack-host>`, with proxying off. |
| Certificate | Let's Encrypt. CAA records must allow `letsencrypt.org`. |

<!-- VERIFY(product): "up to the TTL of the zone's SOA record", the 48-hour DNS grace, and "usually a few minutes" for issuance are taken from the design, not measured on a stack. -->

---

**Next:** [Operate and update an app →](/data-apps/operate/)
