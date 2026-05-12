/**
 * beacon-transforms.mjs — remark plugin that automatically upgrades plain
 * markdown nodes to the richer Beacon design components.
 *
 * What it does on every page (no source edits required):
 *
 *  1. The first short bullet list before any H2 → green-check "advantage grid"
 *     (.beacon-check-grid). Pattern lifted from the snowflake page's "Snowflake
 *     brings these advantages" list.
 *
 *  2. Ordered lists where every item has a short "title-then-detail" shape
 *     → numbered step cards (.beacon-steps), with the title auto-bolded.
 *     Matches the Snowflake page's "Example" walkthrough and similar guides.
 *
 *  3. Two consecutive code blocks in the same language → side-by-side
 *     "works / fails" pair grid (.beacon-code-pair). Picks up the labels from
 *     the preceding paragraphs if they exist.
 *
 *  4. Bold-prefixed paragraphs like `**Note:** ...`, `**Important:** ...`,
 *     `**Tip:** ...` → automatic asides matching the Beacon callout palette.
 *
 * The plugin uses only mdast utilities so it works inside Astro's markdown
 * pipeline without adding dependencies.
 */

import { visit, SKIP } from 'unist-util-visit';

const ADVANTAGE_MAX_ITEM_LEN = 90;
const ADVANTAGE_MIN_ITEMS = 3;

const STEP_MIN_ITEMS = 3;
const STEP_MAX_ITEM_LEN = 320;

const CALLOUT_PREFIXES = [
  { re: /^\*?\*?(important|warning)\*?\*?\s*[:.]?\s*/i, type: 'caution' },
  { re: /^\*?\*?(note|heads up|fyi)\*?\*?\s*[:.]?\s*/i, type: 'note' },
  { re: /^\*?\*?(tip|hint|recommendation)\*?\*?\s*[:.]?\s*/i, type: 'tip' },
  { re: /^\*?\*?(danger|caution)\*?\*?\s*[:.]?\s*/i, type: 'danger' },
];

/** mdast → plain text utility */
function mdastText(node) {
  if (!node) return '';
  if (typeof node.value === 'string') return node.value;
  if (Array.isArray(node.children)) return node.children.map(mdastText).join('');
  return '';
}

/** Ensure node.data.hProperties exists and has a className array */
function addClass(node, ...classes) {
  node.data ??= {};
  node.data.hProperties ??= {};
  const existing = node.data.hProperties.className;
  const arr = Array.isArray(existing) ? existing : existing ? [existing] : [];
  for (const c of classes) if (!arr.includes(c)) arr.push(c);
  node.data.hProperties.className = arr;
}

/** ---------------------------------------------------------------------
 *  1) First short ul → beacon-check-grid (green check advantage list)
 *  ------------------------------------------------------------------- */
function transformAdvantageList(tree) {
  let foundHeading = false;
  for (let i = 0; i < tree.children.length; i++) {
    const node = tree.children[i];

    if (node.type === 'heading' && node.depth >= 2) {
      foundHeading = true;
      // Allow the very first H2 to still gate as long as the list is *before* it.
      // We break here because anything after the first H2 is unlikely to be
      // a hero advantage list.
      break;
    }

    if (node.type === 'list' && !node.ordered) {
      if (foundHeading) break;
      if (node.children.length < ADVANTAGE_MIN_ITEMS) continue;

      const allShort = node.children.every((li) => {
        const txt = mdastText(li).trim();
        return txt.length > 0 && txt.length <= ADVANTAGE_MAX_ITEM_LEN;
      });
      if (!allShort) continue;

      addClass(node, 'beacon-check-grid');
      break;
    }
  }
}

/** ---------------------------------------------------------------------
 *  2) Step-style ordered lists → numbered step cards
 *  ------------------------------------------------------------------- */
function transformStepList(tree) {
  visit(tree, 'list', (node) => {
    if (!node.ordered) return;
    if (node.children.length < STEP_MIN_ITEMS) return;

    let stepShaped = 0;
    for (const li of node.children) {
      const txt = mdastText(li).trim();
      if (!txt || txt.length > STEP_MAX_ITEM_LEN) return;
      // Short imperative or title-ish first phrase: starts with a capital
      // and the first 2–6 words look like a label.
      const head = txt.split(/[—:.]/)[0]?.trim() ?? '';
      const wordCount = head.split(/\s+/).length;
      if (wordCount >= 1 && wordCount <= 6 && /^[A-Z]/.test(head)) stepShaped++;
    }

    // At least 2/3 of the items must look step-shaped to qualify.
    if (stepShaped / node.children.length < 0.66) return;

    addClass(node, 'beacon-steps');

    // Auto-bold the first phrase in each li so the title pops.
    for (const li of node.children) {
      const firstPara = li.children?.find((c) => c.type === 'paragraph');
      if (!firstPara || !firstPara.children?.length) continue;
      const firstChild = firstPara.children[0];
      if (firstChild.type !== 'text') continue;
      const value = firstChild.value;
      // Split into "Title" + rest at first `—`, `:`, or sentence-ending `.`
      const splitMatch = value.match(/^([^—:.]{1,60})([—:.])\s*(.*)$/s);
      if (!splitMatch) continue;
      const [, title, sep, rest] = splitMatch;
      const newChildren = [
        { type: 'strong', children: [{ type: 'text', value: title.trim() }] },
      ];
      if (rest) newChildren.push({ type: 'text', value: ` ${rest}` });
      // Replace the first text node with strong + remaining text
      firstPara.children.splice(0, 1, ...newChildren);
    }
  });
}

/** ---------------------------------------------------------------------
 *  3) Two consecutive code blocks → side-by-side pair grid
 *  ------------------------------------------------------------------- */
function transformCodePairs(tree) {
  for (let i = 0; i < tree.children.length - 1; i++) {
    const a = tree.children[i];
    const b = tree.children[i + 1];
    if (a.type !== 'code' || b.type !== 'code') continue;
    if (a.lang !== b.lang) continue;
    // Each block must be reasonably small — pair grids are for compare-and-contrast
    if ((a.value?.length ?? 0) > 600 || (b.value?.length ?? 0) > 600) continue;

    // Wrap the two code nodes in an HTML container. We use raw HTML nodes
    // because mdast doesn't have a "div" type; the markdown renderer will
    // pass these through as-is when allowed.
    const wrapper = {
      type: 'html',
      value: '<div class="beacon-code-pair">',
    };
    const closer = { type: 'html', value: '</div>' };
    tree.children.splice(i, 2, wrapper, a, b, closer);
    // Skip past the wrapper + pair + closer
    i += 3;
  }
}

/** ---------------------------------------------------------------------
 *  4) Bold-prefixed paragraphs (**Note:** …) → Starlight asides
 *  ------------------------------------------------------------------- */
function transformBoldedCallouts(tree) {
  for (let i = 0; i < tree.children.length; i++) {
    const node = tree.children[i];
    if (node.type !== 'paragraph') continue;
    const first = node.children?.[0];
    if (!first || first.type !== 'strong') continue;
    const label = mdastText(first).trim().toLowerCase().replace(/:$/, '');
    let kind = null;
    if (['note', 'heads up', 'fyi'].includes(label)) kind = 'note';
    else if (['tip', 'hint', 'recommendation'].includes(label)) kind = 'tip';
    else if (['important', 'warning', 'caution'].includes(label)) kind = 'caution';
    else if (['danger'].includes(label)) kind = 'danger';
    if (!kind) continue;

    // Drop the leading bold + its trailing punctuation/space from the paragraph.
    node.children.shift();
    while (
      node.children.length &&
      node.children[0].type === 'text' &&
      /^[\s:–—-]*$/.test(node.children[0].value)
    ) {
      node.children.shift();
    }
    // Trim leading whitespace on the first remaining text node
    if (node.children[0]?.type === 'text') {
      node.children[0].value = node.children[0].value.replace(/^\s+/, '');
    }

    const aside = {
      type: 'containerDirective',
      name: kind,
      attributes: {},
      children: [node],
      data: {
        hName: 'aside',
        hProperties: { className: ['starlight-aside', `starlight-aside--${kind}`] },
      },
    };
    tree.children.splice(i, 1, aside);
  }
}

/** ---------------------------------------------------------------------
 *  Remark plugin entry
 *  ------------------------------------------------------------------- */
export default function beaconTransforms() {
  return (tree, file) => {
    // Skip if the page has explicitly opted out via frontmatter
    if (file?.data?.astro?.frontmatter?.beacon === false) return;

    transformAdvantageList(tree);
    transformStepList(tree);
    transformCodePairs(tree);
    transformBoldedCallouts(tree);
  };
}
