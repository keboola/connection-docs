# Diátaxis split checklist

Standard checklist for splitting one "frankenstein" page into how-to / reference
/ explanation + hub. Use it per page for Issue B (the remaining ~15). The
Snowflake transformation split is the validated reference example.

## 0. Classify (Block 0)

- [ ] Find the page's row in the Block 0 classification (Linear PRDCT-354): its
      Diátaxis type(s), frankenstein flag, audience, and **machine
      source-of-truth** (the component repo / config schema to verify against).
- [ ] Confirm it is actually a frankenstein (mixes ≥2 of how-to / reference /
      explanation). If it is a clean single type, it does not need splitting.

## 1. Inventory the source

- [ ] Read the source page top to bottom; list every section.
- [ ] Tag each section: how-to (a task), reference (lookup), or explanation
      (why/when). This mapping is the split plan — get it reviewed before writing.
- [ ] Note every screenshot and decide: does the text already carry it? Drop it
      unless it helps locate something in the UI.
- [ ] Note every inbound link/anchor you'll need to preserve.

## 2. Verify facts against code (not the UI, not the old text)

- [ ] For each field / parameter / type / limit, check the component code or
      config schema (the Block 0 source-of-truth).
- [ ] Anything you cannot verify → `<!-- TODO(human-review): … -->` inline.
- [ ] Do **not** add, rename, or remove config fields — flag for a human instead.

## 3. Write the three pages (use the template)

- [ ] How-to, reference, explanation each created from the template.
- [ ] Frontmatter on every page: `title`, `slug`, `description`, `keywords`,
      `type` (+ `redirect_from` where relevant).
- [ ] Titles + descriptions in the user's words / symptom vocabulary; keywords
      cover singular/plural + synonyms.
- [ ] How-to has: literal control names + nav paths, copy-pasteable config, an
      explicit "confirm it worked" step, and a troubleshooting section.
- [ ] Reference is lookup-only; explanation is conceptual-only.
- [ ] All code/config in fenced blocks. No code in screenshots.
- [ ] Clean up migration leftovers on the pages you create (e.g. `{: width}`,
      stale anchors).

## 4. Hub + redirect (don't break the old URL)

- [ ] Replace the old page at its existing slug with a thin hub linking to the
      three new pages.
- [ ] Keep existing `redirect_from` entries; the old URL must still resolve.
- [ ] Cross-link: each new page links back to the other two.

## 5. Wire navigation

- [ ] Add the three pages under the hub in `_data/navigation.yml`.
- [ ] `npm run gen:sidebar` (don't hand-edit `src/sidebar.mjs`).

## 6. Verify the build

- [ ] `npm run build` is clean.
- [ ] `node scripts/audit-phase2.mjs` shows no new issues on the pages you touched.
- [ ] Every cross-page anchor resolves (new heading IDs + the ones you link to on
      existing pages).
- [ ] The old URL 301-redirects to the hub.

## 7. Ship

- [ ] Branch name and PR title carry the Linear id (e.g. `PRDCT-354: …`).
- [ ] Touch only the pilot page and its split outputs — nothing else.
- [ ] PR body lists: BEFORE → AFTER (what went where) and the human-review queue
      (every `TODO(human-review)`).
- [ ] Share a preview link for review.
