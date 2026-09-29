// One source of truth for the wording of every shared prerequisite.
//
// Lives outside Prereqs.astro because two consumers need it: the component
// itself, and src/integrations/page-markdown.mjs, which renders a text
// fallback for <Prereqs /> into the agent-facing /<slug>/index.md twin — a
// page whose prerequisites are invisible there is a page an agent will
// happily start without a project.
//
// The box has up to three lists (Nikita, 2026-09-24: "I want to see the
// concrete things I need to start"). "You need" holds the things themselves,
// one per item, the thing first and then where to get it. A page with two
// ways through it (build-locally: with an agent or by hand) adds a second
// list under its own label. "Depending on the tab you use" says what each tab
// of a Prompt / UI / CLI page needs.
//
// Moved here from src/components/getting-started/ (PR #1144) so every section
// uses the same box. The `project` item links the Free Plan sign-up because
// /getting-started/project/ is not on main yet; once it is, point the item
// there ("Get a project"), and every page that uses the box follows.

export const LABELS = {
  box: 'Before you start',
  needs: 'You need',
  tabs: 'Depending on the tab you use',
};

// How to reach Kai and who switches it on (kai/getting-started.md): shared by
// the `kai` item and the Prompt tab line, so the two cannot drift.
const KAI_WHERE =
  'the <strong>Kai Agent</strong> button in the project\'s top bar, on supported stacks. The first time, an organization admin switches it on; see <a href="/kai/getting-started/">Get started with Kai</a>.';

/** Shared "You need" items, by the key a page passes in `needs`. HTML. */
export const SHARED = {
  project:
    '<strong>A Keboola project.</strong> No project yet? <a href="https://connection.us-east4.gcp.keboola.com/wizard">Create a free one</a>.',
  google:
    '<strong>A Google account</strong> you can sign in with, to approve Keboola\'s access.',
  kai: `<strong>Kai</strong>, ${KAI_WHERE}`,
};

/**
 * What each tab needs, in tab order. A page passes `tabs={3}` for Prompt, UI
 * and CLI / API, or `tabs={2}` for Prompt and UI. `html` is the default line;
 * a page whose tab needs something else overrides it with a named slot,
 * `<span slot="ui">…</span>`, because one global line was false on some pages
 * (2026-09-25: the UI tab of ask/ needs a workspace, of app/ a Git repository;
 * Kai from a terminal needs a master token).
 */
export const TABS = [
  { key: 'prompt', label: 'Prompt tab', html: `Kai, ${KAI_WHERE}` },
  { key: 'ui', label: 'UI tab', html: 'only a browser.' },
  { key: 'cli', label: 'CLI / API tab',
    html: '<a href="/cli/getting-started/">kbagent</a>, connected to your project with write access.' },
];

/** Reduce one HTML item to the markdown the twin prints. */
export function toText(html) {
  return html
    .replace(/<a href="([^"]+)">([^<]+)<\/a>/g, '$2 ($1)')
    .replace(/<\/?strong>/g, '**')
    .replace(/<\/?code>/g, '`')
    .replace(/<[^>]+>/g, '');
}

/** The same wording as plain text, for the markdown twin. */
export function sharedText(key) {
  const html = SHARED[key];
  return html ? toText(html) : null;
}

/**
 * The tab lines as plain text, for the markdown twin. `overrides` maps a tab
 * key to the page's own line, already reduced to markdown.
 */
export function tabsText(count, overrides = {}) {
  return TABS.slice(0, count).map((t) => `**${t.label}:** ${overrides[t.key] ?? toText(t.html)}`);
}
