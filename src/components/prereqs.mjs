// One source of truth for the wording of every shared prerequisite.
//
// Lives outside Prereqs.astro because two consumers need it: the component
// itself, and src/integrations/page-markdown.mjs, which renders a text
// fallback for <Prereqs /> into the agent-facing /<slug>/index.md twin — a
// page whose prerequisites are invisible there is a page an agent will
// happily start without a project. getting-started/FromTo.astro reads the
// two state labels from here too.
//
// The box has up to four parts. "Where you are" → "When you finish" says what
// state a step page starts from and leaves you in. "You need" holds the things
// themselves, one per item, the thing first and then where to get it. A page
// with two ways through it (build-locally: with an agent or by hand) adds a
// second list under its own label. "What each tab needs" says what each tab of
// a Prompt / UI / CLI page needs, so a reader on the Prompt tab learns that it
// needs Kai and a reader on the CLI / API tab that it needs kbagent.
//
// 2026-10-12: the Getting Started guide had its own copy of this box
// (components/getting-started/Prereqs.astro and prereqs.mjs); Jordan's review
// on #1116, item 6, merged it into this one. Its state cards, tab cards and
// the newer Kai wording came along, and `project` now points at the guide's
// project page, which was the TODO here.

export const LABELS = {
  box: 'Before you start',
  from: 'Where you are',
  to: 'When you finish',
  needs: 'You need',
  tabs: 'What each tab needs',
};

// Where Kai is and who switches it on: one wording for the `kai` item and the
// Prompt tab line, so the two cannot drift. 2026-10-01: a new Free Plan project
// (6375) had Kai from its first login, so the line says that first.
const KAI =
  'the <strong>Kai Agent</strong> button in the top bar, on supported stacks. A new Free Plan project has it from the start; elsewhere an organization admin turns it on once: <a href="/kai/getting-started/">Get started with Kai</a>.';

/** Shared "You need" items, by the key a page passes in `needs`. HTML. */
export const SHARED = {
  project:
    '<strong>A Keboola project.</strong> No project yet? <a href="/getting-started/project/">Create or join a project</a>.',
  // for a page that needs Kai, listed before `kai`. No sign-up link: it was written while it was
  // open whether the Free Plan includes apps. Free Plan project 6375 deployed the Getting Started
  // app on 2026-10-01, so linking getting-started/project/ here is now the Apps owners' call
  // (VERIFY(Jordan) on data-apps/build-locally.mdx).
  projectWithKai: '<strong>A Keboola project</strong> on a stack where Kai is available.',
  google:
    '<strong>A Google account</strong> you can sign in with, to approve Keboola\'s access.',
  kai: `<strong>Kai</strong>, ${KAI} What it can see and change: <a href="/kai/security-and-privacy/">Kai security and privacy</a>.`,
};

/**
 * What each tab needs, in tab order. A page passes `tabs={3}` for Prompt, UI
 * and CLI / API, or `tabs={2}` for Prompt and UI. `html` is the default line;
 * a page whose tab needs something else overrides it with a named slot,
 * `<span slot="ui">…</span>`, because one line can't fit every page: one UI
 * tab needs a workspace, another a Git repository, and Kai from a terminal
 * needs a master token.
 */
export const TABS = [
  { key: 'prompt', label: 'Prompt tab', html: `Kai, ${KAI}` },
  { key: 'ui', label: 'UI tab', html: 'a browser.' },
  { key: 'cli', label: 'CLI / API tab',
    html: '<a href="/cli/getting-started/">kbagent</a>, connected to your project with write access.' },
];

/**
 * Links as `Label (url)`. One rule for the box's own items here and for the
 * markup a page writes inside the box (page-markdown.mjs), so a link with more
 * attributes than `href`, such as `<a download>`, keeps its URL in both.
 */
export function linksToText(html) {
  return html.replace(/<a\s[^>]*?href="([^"]+)"[^>]*>([^<]*)<\/a>/g, '$2 ($1)');
}

/** Reduce one HTML item to the markdown the twin prints. */
export function toText(html) {
  return linksToText(html)
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
