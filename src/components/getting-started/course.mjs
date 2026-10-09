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
//
// For the with-kai page's step cards (GuidePrompts.astro, a third consumer
// through prompts.mjs), 2026-10-08, single-sourced 2026-10-09:
// - what Kai asks for comes from the step page itself: prompts.mjs lifts the
//   **Expect …** phrases of its Prompt tab. `approvals` is only for a step
//   whose page has no such phrase (ask/, app/).
// - `done` is a digest of the step page's Check, written for the card. The
//   build fails if a number or a **bold** label in it is no longer on that
//   page (prompts.mjs), so the two cannot drift apart unnoticed.
// - `shot` is the card's own frame of the finished step, with its own caption. The app card shows
//   where its prompt goes instead (2026-10-09, Nikita: "приложение на карточку"), since it is the one
//   prompt that does not go into Kai Agent; app/ keeps its builder screenshots (kai-builder.png just
//   after sending, grid-preview.png the draft grid).
// - `note`, optional, is what the card adds under Expect: a choice Kai may ask about there. It is a
//   digest too, so its bold labels are checked against the page like `done`.

/** The steps the with-kai page builds, in course order: the fork card, the twin and prompts.mjs read it. */
export const KAI_TRACK = ['load', 'transform', 'ask', 'app', 'automate'];

/** The with-kai run's measured time, for the hub's fork card (the PageMeta lines carry it as text). */
export const KAI_TRACK_TIME = 'about 30 minutes';

export const COURSE = [
  { key: 'project', short: 'Project', title: 'Create or join a project',
    outcome: 'One place for your data, its SQL, the app and the flow.', term: null },
  { key: 'load', short: 'Load', title: 'Load data into Storage',
    outcome: 'Five files and a live API, as six tables.', term: 'a data source connector',
    done: 'Kai comes back on its own with 6, 18, 9,761, 552 and 552 rows: after the run approval it says the job is running and hands the chat back, so wait about six minutes without prompting again. Then paste the forecast prompt in the same chat; it is done at 42 rows',
    shot: { src: '/getting-started/with-kai/load-done.png', alt: "Kai's answer once the load job finishes: the run worked, all five files loaded into Storage in about four minutes, and a table of row counts, stores 6, products 18, sales 9,761, staffing 552 and weather_daily 552",
      caption: "After the first prompt, in our run of 8 October. These five counts should match yours exactly; the forecast prompt then adds a table of 42 rows." } },
  { key: 'transform', short: 'Transform', title: 'Transform data',
    outcome: 'Join five of them with SQL into one table: café, day, expected demand, crew, a flag.',
    term: 'a transformation',
    done: 'Kai reports staffing_outlook with 42 rows (the job card above its answer says **Job succeeded**)',
    note: "In a week with cold, dry days the summer's sales never had, Kai may first ask what to do with them: pick the answer that leaves them empty (ours read **Leave them blank**). Those rows keep an empty expected_units and show no figure in the app (a dash in ours); [Transform data](/getting-started/transform/#run-it-and-check-the-result) says why.",
    shot: { src: '/getting-started/with-kai/transform-done.png', alt: "Kai's answer once the transformation has run: staffing_outlook has 42 rows, one per store per forecast day from 8 to 14 October; the most stretched is Boolabean Zelný trh in Brno on Monday 12 October at 65.5 units a person, and no store-day is short-handed, with 15 cold, dry store-days left blank",
      caption: "Kai's answer in our run of 8 October, a mostly cold week: the 42 rows match yours, the forecast figures will not." } },
  { key: 'ask', short: 'Explore', title: 'Explore your data',
    outcome: 'Ask that table a question in plain words and get an answer that says why.',
    term: null,
    approvals: 'no approvals, since the questions only read',
    done: "Kai's answer names the flagged café-days and what sets each apart from the rest of its week; in a cold week it says nobody is short-handed, and that is right. After the what-if prompt it lists each flagged day's figure before and after one more person, or says there is nothing to recompute",
    shot: { src: '/getting-started/with-kai/ask-done.png', alt: "Kai's answer in a cold week: the closest call is Boolabean Zelný trh in Brno on Monday 12 October at 65.5 expected units per person against the 67 threshold; the weather matches the rest of its week, and the roster is the difference, three people on Saturday and two on Monday",
      caption: "Our run of 8 October, a mostly cold week: Kai said no café was short-handed, then explained the closest call, shown here." } },
  { key: 'app', short: 'App', title: 'Build an app',
    outcome: 'Describe an app in a paragraph and get a grid: six cafés by seven days.',
    term: null,
    approvals: 'no approvals for the draft; publishing it, which is optional, asks twice',
    done: "the builder's chat ends with **Draft ready** and the preview shows the grid",
    shot: { src: '/getting-started/with-kai/app-where.png', alt: "The Apps page of a project with no app yet: under Build web apps from your Keboola data, the app's prompt pasted into the field, with the send arrow at its right end and the line Kai works only with a Keboola-hosted repository below",
      caption: "In a project with no app, Apps in the navigation opens this page: paste the prompt into the field and send it with the arrow at its right end. The builder then opens with Kai's chat and a preview, about five minutes to a grid. Once the project has an app, the page lists it, with a Create app button for the next one." } },
  { key: 'automate', short: 'Flow', title: 'Build and schedule a weekly flow',
    outcome: 'Rebuild the table every Monday on the new forecast, and hear about it if it breaks.',
    term: null,
    done: 'Kai reports that every phase succeeded (the run card says **Job succeeded**) and the flow has its Monday 06:00 schedule',
    shot: { src: '/getting-started/with-kai/flow-done.png', alt: "Kai's answer once the flow has run: every phase of the Boolabean morning outlook run succeeded in 3 minutes 38 seconds, Load sales and forecast in 2 min 33 s and Build staffing outlook in 54 s, and the flow is set to run every Monday at 06:00 Prague time",
      caption: "Kai's answer after the flow's first run, 8 October." } },
  { key: 'check', short: 'Check', title: 'Check Storage and Jobs',
    outcome: 'What a good run leaves there, and the failures that actually happen.',
    term: null },
].map((s) => ({ ...s, href: `/getting-started/${s.key}/` }));

/** The markdown twin's version of the hub's vertical line: a numbered list. */
export function courseListText() {
  const lines = COURSE.map(
    (s, i) =>
      `${i + 1}. [${s.title}](${s.href}): ${s.outcome}` + (s.term ? ` Keboola calls it ${s.term}.` : ''),
  );
  // the hub's fork after step 1, as CourseLine draws it
  const [first, last] = kaiTrackRange();
  lines.splice(1, 0, `   Or steps ${first} to ${last} in one sitting: [The whole guide with Kai](/getting-started/with-kai/), every prompt on one page.`);
  return lines;
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

/** Course numbers of the first and last step the with-kai page builds, e.g. [2, 6]. */
export function kaiTrackRange() {
  const at = KAI_TRACK.map((key) => COURSE.findIndex((s) => s.key === key) + 1);
  return [Math.min(...at), Math.max(...at)];
}

/** The markdown twin's line for <CourseLine track="kai" />: where the with-kai page sits in the course. */
export function kaiTrackText() {
  const [first, last] = kaiTrackRange();
  const before = COURSE[first - 2];
  const after = COURSE[last];
  return [`Getting Started, steps ${first} to ${last} on one page. Before them: ${before.title} (${before.href}). After them: ${after.title} (${after.href}).`];
}
