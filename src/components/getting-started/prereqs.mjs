// One source of truth for the wording of every shared prerequisite.
//
// Lives outside Prereqs.astro because two consumers need it: the component
// itself, and src/integrations/page-markdown.mjs, which renders a text
// fallback for <Prereqs /> into the agent-facing /<slug>/index.md twin — a
// page whose prerequisites are invisible there is a page an agent will
// happily start without a project.
//
// Keys are the `needs` values a page may ask for; the values are HTML for the
// component and are reduced to plain text for the markdown twin.

export const SHARED = {
  project:
    'A Keboola project. <a href="/getting-started/project/">Get a project</a> covers creating or joining one — the Free Plan covers this guide.',
  google:
    'A Google account you can sign in with. The consent screen lives in your own account, so it is the one thing no assistant can click for you.',
  kai:
    'The <strong>Kai Agent</strong> button in the top bar. An organization admin switches the feature on; see <a href="/kai/getting-started/">Get started with Kai</a>.',
  nothing:
    'Nothing else. No installs, no credentials, no files to download.',
};

/** The same wording as plain text, for the markdown twin. */
export function sharedText(key) {
  const html = SHARED[key];
  if (!html) return null;
  return html
    .replace(/<a href="([^"]+)">([^<]+)<\/a>/g, '$2 ($1)')
    .replace(/<\/?strong>/g, '**')
    .replace(/<[^>]+>/g, '');
}
