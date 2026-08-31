---
title: Kai Settings
slug: 'kai/settings'
description: Configure Kai's tool permissions, system instructions, context files (knowledge files), and skill files — in the UI or programmatically via the Storage Files API.
---



Kai's settings let you personalize how Kai behaves in your project. Open the Kai chat panel and click the **Settings** icon (gear) to access them. Settings are **per-user and per-project**, so each team member can configure their own preferences independently.

The settings panel has two tabs: **Tool Permissions** and **System Instructions**. Project-wide customization — project-level instructions, [context files](#context-files), and [skill files](#skill-files) — is managed in **Settings → Kai Agent** in the main Keboola navigation (the tab is labeled **Kai Assistant** in projects not yet upgraded to the new Kai engine).

## Tool Permissions

Tool Permissions let you control which tools Kai is allowed to use. This eliminates the need to manually approve each action — you can pre-approve tools you trust and block those you don't want Kai to use.

These are your own settings. They apply to your Kai in this project and change nothing for your teammates, who set their own.

![Kai Settings — Tool Permissions](/kai/kai-settings-tool-permissions.png)

### Tool Categories

Tools are organized into two categories:

- **Read-only tools** — Tools that only read data from your project (e.g., listing tables, reading configurations). By default, all read-only tools are set to **Always allow**.
- **Write tools** — Tools that can create or modify resources in your project (e.g., creating configurations, updating transformations, running jobs).

### Permission Levels

For each tool, you can set one of three permission levels:

|  | Permission | Behavior |
|--|------------|----------|
| ![Always allow](/kai/kai-perm-always-allow.png) | **Always allow** | The tool runs automatically without asking for confirmation. |
| ![Always ask](/kai/kai-perm-always-ask.png) | **Always ask** | Kai must request your approval each time before using the tool. |
| ![Block](/kai/kai-perm-block.png) | **Block** | The tool is completely disabled and Kai cannot use it. |

### Setting Permissions

You can configure permissions in two ways:

- **From the Settings panel** — Open **Settings → Tool Permissions**, find the tool, and select the desired permission level.
- **From the approval dialog** — When Kai requests approval for a tool, click **Always allow** to automatically approve that tool for all future uses.

Your permissions persist across all conversations within the same project.

## System Instructions

System instructions are standing rules Kai follows in every conversation, so you stop repeating yourself. "Always use snake_case." "Our fiscal year starts in April." "Respond in German."

They exist at two levels. **Project-level** instructions apply to everyone in the project. **User-level** instructions are personal to you and are added on top. Both are included in every conversation.

Instructions are the place for short rules. For longer knowledge, such as a data model or a business glossary, use [context files](#context-files). For a step-by-step procedure you invoke when you need it, use [skill files](#skill-files).

### Project-Level Instructions

![Project-level system instructions in Settings → Kai Agent](/kai/kai-settings-project-instructions.png)

Project-level instructions apply to **all users** in the project. They are managed in the project settings:

1. Go to **Settings → Kai Agent** in the main Keboola navigation.
2. Enter your instructions in the **System instructions** text field.
3. The instructions auto-save.

Use project-level instructions for team-wide standards such as:

- **Naming conventions** — e.g., "Always prefix staging tables with `stg_` and use snake_case for all column names."
- **Coding standards** — e.g., "Write SQL transformations using CTEs instead of subqueries. Always include comments explaining business logic."
- **Project context** — e.g., "Our fiscal year starts in April. Revenue calculations should exclude returns and use the `completed_at` date."

Project-level instructions can be edited by project admins and managers.

### User-Level Instructions

![User-level system instructions in the Kai chat panel](/kai/kai-settings-user-instructions.png)

User-level instructions are **personal to you** and are added on top of the project-level instructions. They are configured in the Kai chat panel:

1. Open the Kai chat panel.
2. Click the **Settings** icon.
3. Select the **System Instructions** tab.
4. Enter your instructions in the text field.
5. The instructions auto-save.

Use user-level instructions for personal preferences such as:

- **Response style** — e.g., "Keep explanations concise. Always show the SQL query before executing it."
- **Preferred workflows** — e.g., "Always create transformations in a dev branch first."
- **Language or formatting** — e.g., "Respond in German. Use metric units."

### How Instructions Are Applied

When you start a conversation with Kai, both levels of instructions are included:

1. **Project-level instructions** are applied first.
2. **User-level instructions** are appended on top.

This means user-level instructions can refine or add to the project-level instructions but cannot override Kai's core system rules.

### Tips

- Each instruction field supports up to **4,000 characters**.
- Keep instructions clear and specific — vague guidelines are less effective.
- Update instructions as your project evolves and conventions change.
- Focus on rules Kai can't infer from your project data alone (e.g., business logic, team preferences).
- If Kai doesn't seem to follow an instruction, try rephrasing it more directly.
- For knowledge that outgrows the 4,000-character limit — data standards documents, business glossaries — use [context files](#context-files) instead.

## Context Files

Context files (also called knowledge files) are Markdown documents that Kai reads automatically at the start of every conversation. Use them to give Kai project knowledge that is too long for system instructions: data standards, naming conventions, business glossaries, or documentation of your data model.

To manage them, go to **Settings → Kai Agent** in the main Keboola navigation and use the **Context files** card:

![Context files card in Settings → Kai Agent](/kai/kai-settings-context-files.png)

1. Drag a Markdown (`.md`) file onto the card, or click **Select Files**.
2. The file is uploaded and takes effect in every **new** conversation (running conversations are not affected).
3. To replace a file, upload the new version and delete the old one.

Rules and limits:

- **Format:** Markdown (`.md`) only.
- **Size:** up to **50 KB** per file.
- **Count:** up to **10 files** per project.
- A file named `CLAUDE.md` becomes Kai's top-level memory file; all other files are loaded as always-on rules alongside it.
- Context files apply **project-wide** — every user's conversations include them.

### Example

A context file is ordinary Markdown with no required structure. Give it headings and keep
it to things Kai cannot work out from the project itself:

```markdown
# Data standards

## Buckets

- `in.c-*` holds raw extractor output. Never modify it directly.
- `out.c-*` holds tables other teams and BI tools read.

## Naming

- Staging tables take an `stg_` prefix.
- Columns are snake_case.
- Timestamps end in `_at` and are always UTC.

## Business rules

- The fiscal year starts in April.
- Revenue excludes VAT and any order with `status = 'cancelled'`.
- An active customer has placed an order in the last 90 days.

## Glossary

- **ARR** is annual recurring revenue and excludes one-off services.
- **Churn** means no order in 180 days, not a cancelled contract.
```

If you upload only one file, name it `CLAUDE.md` so it becomes Kai's top-level memory file.

:::tip
Every context file is read in every conversation, so keep the set small and focused. One well-structured standards document usually works better than many overlapping files.
:::

Under the hood, context files are ordinary [Storage Files](/storage/files/) tagged **`kai-context`**, which means you can also manage them programmatically — see [Managing Files via API or CLI](#managing-files-via-api-or-cli).

## Skill Files

A skill is a playbook Kai runs when you need it. Skills appear in the chat's **`/` slash-command menu** alongside Kai's built-in skills. Use them for longer, task-specific instructions such as "build the monthly report" or "onboard a new data source".

:::tip[Difference between a Skill and a Context file]
A context file is read in every conversation and it can take up your context window space.
A skill is used only when called, or when your request matches the skill's description.
:::

Manage them in **Settings → Kai Agent** using the **Skill files** card.

![Skill files card in Settings → Kai Agent](/kai/kai-settings-skill-files.png)

Two formats are accepted:

1. **A single `.md` file** starting with YAML frontmatter. The `name` and `description` fields are required — the description tells Kai when to invoke the skill:

   ```markdown
   ---
   name: monthly-reporting
   description: Build the monthly revenue report. Use when the user asks for the monthly report or KPI refresh.
   ---

   # Monthly reporting

   Step-by-step instructions for Kai...
   ```

2. **A `.skill` archive** — a ZIP file with a `SKILL.md` at its root (or at the root of a single top-level directory), plus any supporting files the skill references.

Rules and limits:

- **Size:** up to **50 KB** per file.
- **Count:** up to **10 skill files** per project.
- A project skill with the same `name` as a built-in skill replaces the built-in one.

Skill files are Storage Files tagged **`kai-skill`**.

### How a skill gets invoked

You can call a skill in two ways:

- **Call it yourself** by typing `/` in the chat and picking it from the menu.
- **Let Kai call it** when your request matches the skill's `description`.

![Calling a skill from the slash-command menu](/kai/kai-skill-slash-menu.png)

This is why the `description` matters more than anything else in the file. Kai matches
against it, and the menu shows it to whoever is choosing. Write what the
skill does, then when to use it, including the words your team actually types. A good one is
long and specific:

```yaml
description: Build narrative, scroll-driven data stories where scroll position drives
  charts, color, and animation. Use whenever the user wants a "scrollytelling" app, a
  "data story", a "narrative dashboard", or wants to turn a dataset into a guided
  scrolling experience instead of an explore-it-yourself dashboard.
```

Compare that with `description: Data stories`, which gives Kai nothing to match on.

### What to write a skill for

Write a skill when you want Kai to do something a particular way, every time.

- **House style.** Your brand palette, layout conventions and component choices, so every
  data app someone builds looks like it belongs to your company.
- **A recurring procedure.** Month-end close, onboarding a new data source, the same set of
  quality checks.
- **A specialised output** Kai would not produce by default, where the instructions run to
  pages rather than paragraphs. This is what `.skill` archives are for: a `SKILL.md` plus
  reference files it can read when needed.

Skills are project-wide, so one person can encode the standard once and the whole team gets
it.

## Managing Files via API or CLI

Because context and skill files are ordinary Storage Files identified by a tag (`kai-context` or `kai-skill`), any Storage API client can manage them. Upload with the tag and the **permanent** flag (so the file never expires):

List current files by tag:

```
GET https://connection.{stack}/v2/storage/files?tags[]=kai-context
X-StorageApi-Token: {token}
```

Upload a new file (Storage import service, multipart form — see the `?service=import` section of your stack's [API reference](https://keboola.docs.apiary.io/)):

```
POST https://import.{stack}/upload-file
X-StorageApi-Token: {token}
Form fields: data=@data-standards.md, tags[]=kai-context, isPermanent=1
```

Delete a file by ID:

```
DELETE https://connection.{stack}/v2/storage/files/{fileId}
X-StorageApi-Token: {token}
```

Or use [kbagent, the Keboola CLI](/cli/):

```bash
kbagent storage files --project myproj --tag kai-context
kbagent storage file-upload --project myproj --file data-standards.md --tag kai-context --permanent
kbagent storage file-delete --project myproj --file-id 12345 --yes
```

### Keeping a Context File in Sync Automatically

A common pattern: your team maintains a standards document in its own repository or wiki, and a scheduled job keeps Kai's copy current. Kai then answers standards questions from the actual document, and it stays up to date without manual re-uploads.

On each run, the sync job should:

1. **List** files tagged `kai-context` and note the ID(s) of the current copy (match by file name).
2. **Upload** the fresh version with the `kai-context` tag and the permanent flag.
3. **Delete** the old file ID(s) from step 1.

Upload-then-delete (rather than delete-then-upload) ensures a conversation starting mid-sync still finds a copy. Deleting the old copy is required: Kai loads at most 10 tagged files, and both revisions would otherwise be loaded together.

The job can run anywhere — a CI pipeline triggered on changes to the source document, or a scheduled Keboola flow with a Python step calling the Storage API. It only needs a Storage API token with file write permissions. The same pattern works for skill files using the `kai-skill` tag.

### Troubleshooting

- **File uploaded but Kai doesn't see it** — check that the tag is exactly `kai-context` or `kai-skill`, the file is under 50 KB, there are at most 10 tagged files, and the conversation was started *after* the upload.
- **Skill shows without a description, under a wrong name, or Kai doesn't invoke it** — add `name` and `description` to the `.md` frontmatter. Uploads from the Settings UI enforce the frontmatter, but API uploads don't — a file without it still appears in the `/` menu under a name derived from its file name, with no description to tell Kai when to use it. A `.skill` archive must contain `SKILL.md` at its root (or at the root of a single top-level directory).
- **File expired or disappeared** — it was uploaded without the permanent flag; re-upload it as permanent (uploads from the Settings UI are always permanent).
