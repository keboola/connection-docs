# Screenshot recapture TODO (Apps section)

These images are carried over from the old Jekyll docs and still render, but likely show
**older product UI**. Recapture from the live current UI when a project with the **Apps**
feature is available (need one Streamlit app for the settings screens). Project 6015 was used
before but is no longer accessible; any project with Apps works.

Capture method: Playwright-over-CDP to the dedicated Chrome (`~/.chrome-kbc-automation`, port
9222), hide the product-update popup (`div.tw-fixed.tw-bottom-4.tw-left-16`) and the right Kai
drawer, mask project ID / tokens / full hub URLs / private bucket-table names, save straight to
`public/data-apps/<name>.png` (exact filenames below). Reuse `apps-section/shoot-cdp.mjs`.

Tags: **[auto]** = static/settings screen · **[user-click]** = user presses the irreversible
control, agent only shoots · **[blocked]** = needs a state/config that must be created first.

| Page | File | State to capture | Tag |
|---|---|---|---|
| build-in-the-ui | `app-modal.png` | Create App screen — the "or create manually" Streamlit / Python-JS cards | [auto] |
| authentication | `auth-options.png` | App → Information & Settings → Authentication method options | [auto] |
| authentication | `auth-select-oidc-provider.png` | Provider-picker shown when opening an OIDC-protected app | [blocked] (needs an OIDC app) |
| reference | `manage-redeploy.png` | App actions menu (Deploy/Open/Redeploy/Suspend/Delete) | [auto] |
| reference | `terminal-log.png` | App → Terminal Logs tab | [auto] |
| reference | `deploy-timeout-backedsize.png` | Start/Redeploy wizard (backend version + size + inactivity timeout) — do NOT press Start | [auto] |
| reference | `proxy-wakeup.png` | The "waking up" page of a sleeping app | [user-click] (suspend app first) |
| reference | `proxy-error-wakeing-up.png` | The wakeup-error page | [user-click] / [blocked] |
| reference | `job-error-log.png` | Event log of a failed deploy job | [blocked] (needs a failing job) |
| streamlit/index | `custom-data-app-url.png` | Custom URL prefix field on create | [auto] |
| streamlit/index | `development-type-code.png` | Code deployment text area | [auto] |
| streamlit/index | `packages.png` | Packages field | [auto] |
| streamlit/index | `theming-predefined.png` | Theming panel (predefined themes) | [auto] |
| streamlit/index | `git-repository-public.png` | Git repository deployment fields | [auto] |
| streamlit/index | `git-repository-private-ssh.png` | Private repo SSH auth field | [auto] |
| streamlit/lock-version | `lock-upload-requirements.png` | Upload requirements.txt UI | [auto] |
| streamlit/lock-version | `lock-update-requirements.png` | Update requirements.txt in UI | [auto] |
| streamlit/lock-version | `lock-freeze-version-toggle.png` | "Freeze versions" toggle | [auto] |
| streamlit/lock-version | `lock-start-data-app.png` | Start App control | [auto] |
| streamlit/lock-version | `lock-update-dependencies.png` | "Update packages dependencies" toggle | [auto] |
| streamlit/design-guide | `design-guide-folder.png` | `.streamlit`/`static` folder result — app-code shot, not product UI | [blocked] (not product UI) |
| streamlit/design-guide | `design-guide-footer.png` | Footer render — app-code shot | [blocked] |
| streamlit/design-guide | `design-guide-save-button.png` | Styled save button render — app-code shot | [blocked] |

Already fresh (do NOT recapture): all `getting-started-*` and `examples-*`.
