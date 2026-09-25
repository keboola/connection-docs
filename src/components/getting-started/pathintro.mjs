// The tab convention in words, for the two places that need it: the component
// (PathIntro.astro) and the markdown twin (page-markdown.mjs).
//
// The twin matters more than it looks. It flattens the tabs into three
// consecutive blocks, so an agent reading it top to bottom sees "ask Kai to
// build it", then "click through and build it", then "build it from a
// terminal" — and, executed literally, builds the thing three times. The
// sentence that says they are alternatives has to survive the flattening.
//
// TAB LABEL CONTRACT — these three strings, byte for byte, on every page:
//
//     Prompt        UI        CLI / API
//
// Starlight's <Tabs syncKey="howto"> remembers the reader's choice under the
// label text, so a page that spells one differently drops out of the sync.

export const TAB_LABELS = ['Prompt', 'UI', 'CLI / API'];

/**
 * Plain-text rendering of the intro, matching what PathIntro.astro shows.
 *
 * @param {{ tabs?: number, manual?: boolean, approvals?: boolean, yours?: string }} props
 */
export function pathIntroText({ tabs = 2, manual, approvals, yours } = {}) {
  const out = [];

  if (tabs === 3) {
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

  if (manual === false) {
    out.push(
      'There is no click-by-click equivalent for building this: by hand it is a development ' +
        'workflow with its own section, and the **UI** section says where to go for it.',
    );
  }

  if (approvals !== false) {
    out.push(
      'Kai asks before it changes anything: one approval dialog per object it creates, showing ' +
        'the configuration it is about to write. Questions that only read do not ask.',
    );
  }

  if (yours) out.push(`One thing stays yours either way: ${yours}.`);

  out.push(
    'If a step builds something other than what this page describes, say so in the same chat; ' +
      'it edits what it made. Nothing here is one-way.',
  );

  return out;
}
