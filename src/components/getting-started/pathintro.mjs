// The tab convention in words, for the two places that need it: the page
// (PathIntro.astro renders pathIntroHtml) and the markdown twin
// (page-markdown.mjs prints pathIntroText).
//
// The twin matters more than it looks. It flattens the tabs into three
// consecutive blocks, so an agent reading it top to bottom sees "ask Kai to
// build it", then "click through and build it", then "build it from a
// terminal" — and, executed literally, builds the thing three times. The
// sentence that says they are alternatives has to survive the flattening.
//
// So the two are worded differently on purpose: the page keeps to three short
// lines and leaves the approvals detail to the hub, the twin keeps the fuller
// wording. Both live in this file, and scripts/pathintro.test.ts holds them to
// the same facts for every <PathIntro> a page uses.
//
// TAB LABEL CONTRACT — these three strings, byte for byte, on every page:
//
//     Prompt        UI        CLI / API
//
// Starlight's <Tabs syncKey="howto"> remembers the reader's choice under the
// label text, so a page that spells one differently drops out of the sync.

export const TAB_LABELS = ['Prompt', 'UI', 'CLI / API'];

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * The intro as the page shows it: one entry per paragraph, as HTML. The last
 * entry is the undo line, marked `recovery` for its own class.
 *
 * @param {{ tabs?: number, manual?: boolean, approvals?: boolean, yours?: string }} props
 * @returns {{ html: string, recovery?: boolean }[]}
 */
export function pathIntroHtml({ tabs = 2, manual, approvals, yours } = {}) {
  let lead;
  if (manual === false) {
    // app/: only the Prompt tab builds it, and the lead still names all three tabs
    lead =
      '<strong>Prompt, UI and CLI / API are three tabs, not three steps,</strong> and here only ' +
      '<strong>Prompt</strong> builds it: the <strong>UI</strong> tab says where the hand-built ' +
      'route is covered, and <strong>CLI / API</strong> works on what the Prompt tab built.';
  } else if (tabs === 3) {
    lead = '<strong>Prompt, UI and CLI / API: three ways to do the same task, not three steps.</strong>';
  } else {
    lead = '<strong>Prompt and UI: two ways to do the same task, not two steps.</strong>';
  }
  const out = [{ html: `${lead} Pick one tab below; later pages open on it.` }];

  if (yours) out.push({ html: `One thing stays yours either way: ${escapeHtml(yours)}.` });

  out.push({
    recovery: true,
    html:
      (approvals === false
        ? 'Most'
        : 'In the chat, Kai asks before each change it makes ' +
          '(<a href="/getting-started/#approvals-and-plan-mode">how approvals work</a>), and most') +
      ' of it can be undone: if a step builds something else, say so in the same chat.',
  });

  return out;
}

/**
 * Plain-text rendering of the intro for the twin: the same facts as
 * pathIntroHtml, in the fuller wording.
 *
 * @param {{ tabs?: number, manual?: boolean, approvals?: boolean, yours?: string }} props
 */
export function pathIntroText({ tabs = 2, manual, approvals, yours } = {}) {
  const out = [];

  if (manual === false) {
    // app/: the three are not interchangeable there, so the usual "each reach
    // the same result" would be false
    out.push(
      '**Three tabs, not three steps**, and here only **Prompt** builds it. There is no ' +
        'click-by-click equivalent: by hand it is a development workflow with its own section, and ' +
        'the **UI** section says where to go for it. **CLI / API** works on what the Prompt tab ' +
        'built.',
    );
  } else if (tabs === 3) {
    out.push(
      '**Three ways to do this, one page. They are alternatives, not steps.** The sections ' +
        'below (**Prompt**, **UI**, **CLI / API**) each reach the same result: **Prompt** is what ' +
        'you paste into Kai, **UI** is the same task click by click, **CLI / API** is the same ' +
        'task from a terminal. Do one of them, not all three.',
    );
  } else {
    out.push(
      '**Two ways to do this, one page. They are alternatives, not steps.** **Prompt** is what ' +
        'you paste into Kai; **UI** is the same task click by click. Do one of them, not both.',
    );
  }

  if (approvals !== false) {
    out.push(
      'In the chat, Kai asks before each change it makes: one approval card each, showing what it ' +
        'is about to write or run, unless you chose Always allow for that tool. ' +
        'Questions that only read do not ask.',
    );
  }

  if (yours) out.push(`One thing stays yours either way: ${yours}.`);

  out.push(
    'If a step builds something other than what this page describes, say so in the same chat; ' +
      'it edits what it made. Most of it can be undone.',
  );

  return out;
}
