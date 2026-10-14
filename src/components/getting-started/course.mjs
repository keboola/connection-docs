// The seven steps of the Getting Started course, in reading order, from one
// place.
//
// Two consumers: CourseLine.astro, which draws the course as a line of dots
// (vertically on the hub, as a short bar at the top of every step), and
// src/integrations/page-markdown.mjs, which prints the same list into the
// markdown twin. PageMeta used to carry no step numbers because numbering
// breaks the moment a page moves (2026-09-02); with the order kept here, a
// move is one edit and every number follows it (2026-09-29, DECISIONS.md).
//
// `key` is the page's last slug segment and what a page passes as
// <CourseLine current="…" />. `short` fits under a dot at phone width;
// `outcome` is what the reader can do after the step, one line; `term` is
// what Keboola calls the thing the step builds.

export const COURSE = [
  { key: 'project', short: 'Project', title: 'Create or join a project',
    outcome: 'One place for your data, its SQL, the app and the flow.', term: null },
  { key: 'load', short: 'Load', title: 'Load data into Storage',
    outcome: 'Five files and a live API, as six tables.', term: 'a data source connector' },
  { key: 'transform', short: 'Transform', title: 'Transform data',
    outcome: 'Join five of them with SQL into one table: café, day, expected demand, crew, a flag.',
    term: 'a transformation' },
  { key: 'ask', short: 'Explore', title: 'Explore your data',
    outcome: 'Ask that table a question in plain words and get an answer that says why.',
    term: null },
  { key: 'app', short: 'App', title: 'Build an app',
    outcome: 'Describe an app in a paragraph and get a grid: six cafés by seven days.',
    term: null },
  { key: 'automate', short: 'Flow', title: 'Build and schedule a weekly flow',
    outcome: 'Rebuild the table every Monday on the new forecast, and hear about it if it breaks.',
    term: null },
  { key: 'check', short: 'Check', title: 'Check Storage and Jobs',
    outcome: 'What a good run leaves there, and the failures that actually happen.',
    term: null },
].map((s) => ({ ...s, href: `/getting-started/${s.key}/` }));

/** The markdown twin's version of the hub's vertical line: a numbered list. */
export function courseListText() {
  return COURSE.map(
    (s, i) =>
      `${i + 1}. [${s.title}](${s.href}): ${s.outcome}` + (s.term ? ` Keboola calls it ${s.term}.` : ''),
  );
}

/** The markdown twin's version of the bar at the top of a step: where the page sits. */
export function courseBarText(key) {
  const at = COURSE.findIndex((s) => s.key === key);
  if (at < 0) return [];
  const step = COURSE[at];
  const before = COURSE[at - 1];
  const after = COURSE[at + 1];
  let line = `Getting Started, step ${at + 1} of ${COURSE.length}: ${step.title}.`;
  if (before) line += ` Before it: ${before.title} (${before.href}).`;
  if (after) line += ` After it: ${after.title} (${after.href}).`;
  return [line];
}
