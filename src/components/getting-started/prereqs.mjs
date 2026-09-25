// One source of truth for the wording of every shared prerequisite.
//
// Lives outside Prereqs.astro because two consumers need it: the component
// itself, and src/integrations/page-markdown.mjs, which renders a text
// fallback for <Prereqs /> into the agent-facing /<slug>/index.md twin — a
// page whose prerequisites are invisible there is a page an agent will
// happily start without a project.
//
// The box has two lists (Nikita, 2026-09-24: "I want to see the concrete
// things I need to start"). "You need" holds the things themselves, one per
// item, the thing first and then where to get it. "Depending on the tab you
// use" says what each tab needs, so a reader on the Prompt tab learns that it
// needs Kai and a reader on the CLI / API tab that it needs kbagent, on every
// page rather than on the two or three that happened to say so.

export const LABELS = {
  needs: 'You need',
  tabs: 'Depending on the tab you use',
};

/** Shared "You need" items, by the key a page passes in `needs`. HTML. */
export const SHARED = {
  project:
    '<strong>A Keboola project.</strong> No project yet? <a href="/getting-started/project/">Get a project</a>.',
  google:
    '<strong>A Google account</strong> you can sign in with. Approving Keboola\'s access there is a click no assistant can make.',
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
  { key: 'prompt', label: 'Prompt tab',
    html: 'Kai, the <strong>Kai Agent</strong> button in the project\'s top bar, on supported stacks. The first time, an organization admin switches it on; see <a href="/kai/getting-started/">Get started with Kai</a>.' },
  { key: 'ui', label: 'UI tab', html: 'only a browser.' },
  { key: 'cli', label: 'CLI / API tab',
    html: '<a href="/cli/getting-started/">kbagent</a>, connected to your project with write access. A read-only token is not enough.' },
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
