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
Custom domains are rolled out stack by stack. They work only on public multi-tenant stacks, only for Python/JS apps, and with one custom domain per app. Streamlit apps are not supported yet; their settings show a "not available yet" notice. If your stack does not offer custom domains, the **Custom domain** settings do not appear.
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

Keboola lowercases the name and removes a trailing dot. It stores an international domain in its punycode form (`xn--…`). Use that form as the name of the DNS record. It rejects wildcards, IP addresses, public suffixes such as `co.uk`, reserved names such as `localhost`, and any address under a Keboola domain.

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

If the domain has no CAA records, you don't need to do anything. Keboola reads the first non-empty CAA set it finds, starting at the domain and going up to the registrable domain. A CAA record that limits `validationmethods` without `http-01`, or that sets `accounturi`, also blocks issuance.

## Wait for the domain to become active

DNS changes take time to spread. Keboola checks DNS by itself, so you don't need to click anything. After a wrong or missing record, the negative answer may stay cached at your DNS provider for up to the SOA minimum (negative-caching) TTL of the zone.

Keboola checks often at first, then less often. A domain that has waited for its CNAME for over an hour is checked every 15 minutes, and after 7 days every 6 hours. A domain that never got a correct CNAME stays **Awaiting DNS** and does not expire. If you fix the record late, activation can take a few hours.

The domain shows one of these statuses:

| Status | Meaning | What to do |
|---|---|---|
| **Pending** | Keboola is setting up the domain, or the app has not been deployed yet. | Deploy the app if you have not. Otherwise wait. |
| **Awaiting DNS** | Keboola can't see the right CNAME. Either the record is missing, it points somewhere else, or a proxy or apex flattening hides it. The status message shows what Keboola sees. | Create or fix the CNAME. Turn off proxying. Use a subdomain. |
| **Issuing certificate** | The CNAME is right. Keboola is getting the certificate. | Wait. This usually takes a few minutes. |
| **Queued** | Keboola limits new certificates to 30 per hour per stack and 10 per day per project. Yours waits for the limit to refill. | Wait. This can take up to a day. |
| **Active** | The domain serves the app over HTTPS. If the CNAME is removed, the domain stays **Active** and keeps serving for up to 48 hours before it turns to **DNS lost**. | Nothing. |
| **DNS points elsewhere** | The CNAME points to another app's target. Keboola stops serving the domain on this app at once. | Point it to this app's target, or remove this domain. |
| **Domain in use** | Another app on this stack serves this domain. | Point the CNAME to this app's target to move the domain here. |
| **CAA blocked** | A CAA record does not allow Let's Encrypt. | Add the [CAA record](#allow-certificate-issuance-caa). |
| **Certificate error** | Issuing the certificate failed. The message shows the reason. | Fix the cause in the message. Check CAA and the CNAME. |
| **DNS lost** | The CNAME has been missing for 48 hours. The domain no longer serves the app. | Create the CNAME again. |
| **Disabled** | Custom domains are switched off on the stack. | Contact Keboola support. |
| **Rejected** | The domain is not allowed. The message shows the rule. | Use another domain. |

Keboola renews the certificate by itself. If a renewal fails, or a CAA record blocks it, the domain stays **Active** and shows a warning. It turns to **Certificate error** only after the certificate has expired. Fix the cause while the warning shows.

## Make a domain the primary URL

An active domain serves the app, but the app's primary URL stays the Keboola address until you change it. The primary URL is the address behind **Open**, the address in the API, and the value of the app's `KBC_APP_PUBLIC_URL` environment variable. The **App URL** block keeps showing the Keboola address, where you edit the URL prefix; the custom domain is shown next to it.

To make the domain primary, click **Make primary** next to the active domain and confirm.

<!-- VERIFY(product): the design names the button "Use .hub as primary" for the reverse action; the labels here are provisional until the UI PR lands. -->

This acts like moving the app to other hosting. It restarts the app in place, like a redeploy, but creates no new version:

- **The app restarts once**, if it is running. The new instance starts before the old one stops. Its input mapping runs again and open WebSocket connections reconnect. If the new instance fails to start, the app can stop. Check the [terminal log](/data-apps/reference/#terminal-log) after the change.
- **A stopped or sleeping app is not started.** It shows the new URL at once and gets the new `KBC_APP_PUBLIC_URL` the next time it starts.
- **The app gets one URL.** `KBC_APP_PUBLIC_URL` holds the custom domain. Anything your app builds from it moves too, for example an OAuth issuer or resource URL, or a webhook address.
- **Integrations bound to the old address are not moved.** Webhooks, connectors and other integrations that you set up on the Keboola address must be created again on the custom domain.
- **Nothing is turned off.** The Keboola address and every other domain of the app keep serving it, and Keboola does not redirect between them. The app decides what to do with requests on each host. See [Write an app for several hosts](/data-apps/reference/#write-an-app-for-several-hosts).
- **Sign-in is set up per host.** Register the login callback of the custom domain with your provider. Providers that accept only one redirect URI, such as GitLab, need the custom domain's callback and the custom domain as the primary URL. See [Callback URLs per host](/data-apps/authentication/#callback-urls-per-host).

To go back, click **Use the Keboola address as primary** (labelled **Use .hub as primary** in some versions of the UI). This restarts the app once more. The custom domain keeps serving the app.

### If the primary domain breaks

Keboola never changes the primary URL by itself. If the DNS record is removed or the certificate fails, the domain stays primary, its status shows the error, and the app's settings show a warning banner.

What happens next depends on the cause:

- **CNAME removed.** The domain keeps serving the app for up to 48 hours. After that, the app is reachable only at its Keboola address, while links and **Open** still point at the custom domain.
- **Certificate problem.** Routing continues, but browsers show a certificate warning once the certificate has expired.

Fix the DNS record or the certificate, or reset the primary to the Keboola address. Resetting works in any status.

## Remove a domain

Remove the domain in the **Custom domain** settings. Removing a non-primary domain does not restart the app. Removing the primary domain sets the primary back to the Keboola address, with one restart. Then delete the DNS record at your provider.

## Move a domain to another app

A domain serves one app at a time. To move it:

1. If the domain is the old app's primary URL, reset the primary on the old app first. Otherwise it stays primary there, and that app's URL stops working.
2. Add the domain to the new app and point the CNAME to the new app's target.

The old app's status turns to **DNS points elsewhere**. The new app shows **Domain in use** until the old app's next DNS check, which takes about 10 minutes. Then it takes over, and you can remove the domain from the old app.

## Limits

| Limit | Value |
|---|---|
| Domains per app | 1 |
| App types | Python/JS apps. Streamlit apps are not supported yet. |
| Stacks | Public multi-tenant stacks where custom domains are enabled. Single-tenant (private) stacks are not supported. |
| Domain type | Subdomains only. No apex, no wildcards. A domain with international characters is stored as punycode (`xn--…`), and so must its DNS record. |
| Drafts and previews | Drafts, Kai and dev-mode previews, and embedding the app in an iframe stay on the Keboola address. |
| DNS | A plain CNAME to `<app-id>.alias.<stack-host>`, with proxying off. |
| Certificate | Let's Encrypt. CAA records must allow `letsencrypt.org`. |

<!-- VERIFY(product): the 48-hour DNS grace, the check intervals and the "about 10 minutes" takeover come from the design, not from a measured stack. -->

---

**Next:** [Operate and update an app →](/data-apps/operate/)
