/**
 * beacon-transforms.mjs — remark plugin that automatically upgrades plain
 * markdown nodes to the richer Beacon design components.
 *
 * What runs on every page (no source edits required):
 *
 *  1. The first short bullet list before any H2 → green-check "advantage
 *     grid" (.beacon-check-grid).
 *
 *  2. Legacy `<div class="alert alert-…">` HTML blocks → Starlight asides.
 *
 *  3. Pseudo-H4 — a paragraph whose sole child is a `**Bold ending colon:**`
 *     followed by a list → real H4 heading (so it lands in the right-rail
 *     TOC and gets card-style chrome).
 *
 *  4. Ordered lists with "title-then-detail" + imperative shape → numbered
 *     step cards. Tighter heuristic — requires an imperative verb OR a
 *     "follow these steps:" cue, so enumerated outlines aren't mis-promoted.
 *
 *  5. Unordered lists preceded by a "follow these steps:" cue + imperative
 *     verbs → step cards (mirror of #4).
 *
 *  6. Two consecutive same-language code blocks → side-by-side pair grid.
 *
 *  7. Bold-prefixed paragraphs (`**Note:** …`, `***Note:** …*`, blockquotes)
 *     → matched Starlight aside callouts. Handles both plain `strong` and
 *     italic-wrapped `emphasis > strong` variants.
 *
 * Per-page opt-out via `beacon: false` in frontmatter.
 */

import { visit } from 'unist-util-visit';

const ADVANTAGE_MAX_ITEM_LEN = 90;
const ADVANTAGE_MIN_ITEMS = 3;

const STEP_MIN_ITEMS = 3;
const STEP_MAX_ITEM_LEN = 320;

/** Common imperative verbs that signal procedure steps */
const IMPERATIVE_VERBS = new Set([
  'add', 'apply', 'browse', 'check', 'choose', 'click', 'close', 'configure',
  'confirm', 'connect', 'copy', 'create', 'define', 'delete', 'disable',
  'download', 'drag', 'duplicate', 'edit', 'enable', 'enter', 'expand',
  'export', 'fill', 'find', 'finish', 'follow', 'go', 'hit', 'import',
  'install', 'launch', 'load', 'log', 'navigate', 'open', 'paste', 'pick',
  'press', 'pull', 'push', 'register', 'remove', 'rename', 'replace',
  'review', 'run', 'save', 'scroll', 'search', 'select', 'send', 'set',
  'sign', 'specify', 'start', 'submit', 'switch', 'tap', 'toggle', 'try',
  'type', 'update', 'upload', 'use', 'verify', 'visit', 'wait',
]);

/** Cue phrases that signal "next is a procedure" */
const STEP_CUE_RE =
  /(follow(?:\s+these)?\s+steps|take\s+the\s+following\s+steps|do\s+the\s+following|step[\s-]by[\s-]step|here['']?s\s+how|to\s+\w[^.]{0,60},\s+follow)\s*:?\s*$/i;

/** Heading text that gates step-card promotion */
const STEP_HEADING_RE =
  /^(steps?|how\s+to|procedure|setup|set\s+up|configure|create|getting\s+started|example|walkthrough|quickstart|quick\s+start|installation|installing|usage)\b/i;

/** mdast → plain text */
function mdastText(node) {
  if (!node) return '';
  if (typeof node.value === 'string') return node.value;
  if (Array.isArray(node.children)) return node.children.map(mdastText).join('');
  return '';
}

/** Ensure node.data.hProperties.className contains the given classes */
function addClass(node, ...classes) {
  node.data ??= {};
  node.data.hProperties ??= {};
  const existing = node.data.hProperties.className;
  const arr = Array.isArray(existing) ? existing : existing ? [existing] : [];
  for (const c of classes) if (!arr.includes(c)) arr.push(c);
  node.data.hProperties.className = arr;
}

function setHProp(node, key, value) {
  node.data ??= {};
  node.data.hProperties ??= {};
  node.data.hProperties[key] = value;
}

function slugify(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function firstWord(text) {
  return text.trim().match(/^([A-Za-z]+)/)?.[1]?.toLowerCase() ?? '';
}

function isImperativeFirstWord(text) {
  return IMPERATIVE_VERBS.has(firstWord(text));
}

/** Returns true if any descendant of node is `inlineCode` or `code`. */
function containsCode(node) {
  let found = false;
  visit(node, (child) => {
    if (child.type === 'inlineCode' || child.type === 'code') {
      found = true;
      return false; // stop walking
    }
  });
  return found;
}

/** ---------------------------------------------------------------------
 *  1) First short ul → beacon-check-grid
 *
 *  Promotes the page's first short unordered list (before any H2) to the
 *  two-column green-check "advantage" grid. Only fires when the list reads
 *  like a feature/benefit list:
 *    - 3+ short (≤90 char) items
 *    - no inline code in any item (content lists like
 *      `- Adform connector with the \`Campaigns\` config` should NOT match)
 *    - no embedded links (advantage lists are typically standalone phrases)
 *  ------------------------------------------------------------------- */
function transformAdvantageList(tree) {
  let foundHeading = false;
  for (let i = 0; i < tree.children.length; i++) {
    const node = tree.children[i];
    if (node.type === 'heading' && node.depth >= 2) {
      foundHeading = true;
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

      // Each item must read like a feature/benefit, not an entity name or
      // mid-sentence continuation:
      //   - at least 2 words (filters out noun-only lists like
      //     "Activities / Customers / Subscriptions")
      //   - starts with an uppercase letter or digit (filters out lists that
      //     continue a sentence from the preceding paragraph)
      const itemsLookLikeBenefits = node.children.every((li) => {
        const txt = mdastText(li).trim();
        if (!/^[A-Z0-9]/.test(txt)) return false;
        if (!/\s/.test(txt)) return false;
        return true;
      });
      if (!itemsLookLikeBenefits) continue;

      // Reject lists that look like in-content references: anything with
      // inline code or links is almost certainly not a marketing-style
      // advantage list.
      let anyCode = false;
      let anyLink = false;
      visit(node, (child) => {
        if (child.type === 'inlineCode' || child.type === 'code') anyCode = true;
        if (child.type === 'link') anyLink = true;
      });
      if (anyCode || anyLink) continue;
      addClass(node, 'beacon-check-grid');
      break;
    }
  }
}

/** ---------------------------------------------------------------------
 *  2) Legacy <div class="alert alert-…"> HTML → Starlight aside
 *  ------------------------------------------------------------------- */
const ALERT_VARIANT_TO_KIND = {
  warning: 'caution',
  info: 'note',
  danger: 'danger',
  success: 'tip',
};
const ALERT_OPEN_RE =
  /<div\s+class\s*=\s*["']\s*alert\s+alert-(warning|info|danger|success)[^"']*["'][^>]*>/i;
const DIV_CLOSE_RE = /<\/div>/i;

function makeAside(kind, children) {
  return {
    type: 'containerDirective',
    name: kind,
    attributes: {},
    children,
    data: {
      hName: 'aside',
      hProperties: { className: ['starlight-aside', `starlight-aside--${kind}`] },
    },
  };
}

function transformLegacyAlerts(tree) {
  for (let i = 0; i < tree.children.length; i++) {
    const node = tree.children[i];
    if (node.type !== 'html') continue;
    const m = node.value.match(ALERT_OPEN_RE);
    if (!m) continue;
    const kind = ALERT_VARIANT_TO_KIND[m[1].toLowerCase()] ?? 'note';

    // Same-node open+close (rare): <div class="alert ..."><i></i> text </div>
    if (DIV_CLOSE_RE.test(node.value.replace(ALERT_OPEN_RE, ''))) {
      const inner = node.value
        .replace(ALERT_OPEN_RE, '')
        .replace(/<\/div>[\s\S]*$/i, '')
        .trim();
      if (!inner) continue;
      tree.children.splice(i, 1, makeAside(kind, [{ type: 'html', value: inner }]));
      continue;
    }

    // Multi-node alert: scan forward for </div>
    let endIdx = -1;
    for (let j = i + 1; j < tree.children.length; j++) {
      if (tree.children[j].type === 'html' && DIV_CLOSE_RE.test(tree.children[j].value)) {
        endIdx = j;
        break;
      }
    }
    if (endIdx === -1) continue;

    const openTrail = node.value.replace(/^[\s\S]*?<div[^>]*>/i, '').trim();
    const closeLead = tree.children[endIdx].value.replace(/<\/div>[\s\S]*$/i, '').trim();
    const collected = [];
    if (openTrail) collected.push({ type: 'html', value: openTrail });
    for (let j = i + 1; j < endIdx; j++) collected.push(tree.children[j]);
    if (closeLead) collected.push({ type: 'html', value: closeLead });

    tree.children.splice(i, endIdx - i + 1, makeAside(kind, collected));
  }
}

/** ---------------------------------------------------------------------
 *  3) Pseudo-H4 — `**Bold:**` paragraph followed by a list → real H4
 *  ------------------------------------------------------------------- */
function transformPseudoHeadings(tree) {
  for (let i = 0; i < tree.children.length - 1; i++) {
    const node = tree.children[i];
    const next = tree.children[i + 1];
    if (node.type !== 'paragraph') continue;
    if (next.type !== 'list') continue;
    if (!node.children || node.children.length !== 1) continue;
    const strong = node.children[0];
    if (strong.type !== 'strong') continue;
    const text = mdastText(strong).trim();
    if (!text.endsWith(':')) continue;
    if (text.length > 80) continue;

    const cleanText = text.replace(/:$/, '').trim();
    const id = slugify(cleanText);
    const h4 = {
      type: 'heading',
      depth: 4,
      children: [{ type: 'text', value: cleanText }],
      data: { hProperties: { id, className: ['beacon-pseudo-h4'] } },
    };
    tree.children.splice(i, 1, h4);
  }
}

/** ---------------------------------------------------------------------
 *  4 + 5) Step lists (ordered with tightened heuristic, plus imperative UL)
 *  ------------------------------------------------------------------- */
function precedingCueIsStep(tree, idx) {
  // Look back at the immediate paragraph
  const prev = tree.children[idx - 1];
  if (prev?.type === 'paragraph') {
    const t = mdastText(prev).trim();
    if (STEP_CUE_RE.test(t)) return true;
  }
  // Or the nearest heading
  for (let j = idx - 1; j >= 0; j--) {
    if (tree.children[j].type === 'heading') {
      return STEP_HEADING_RE.test(mdastText(tree.children[j]).trim());
    }
  }
  return false;
}

function boldFirstPhrase(node) {
  for (const li of node.children) {
    const firstPara = li.children?.find((c) => c.type === 'paragraph');
    if (!firstPara || !firstPara.children?.length) continue;
    const firstChild = firstPara.children[0];

    // A leading authored bold (`**Title**` at the very start of the item) is a
    // genuine step title — tag it so CSS can block it. Do NOT tag inline bold
    // that follows text (e.g. "Select **Applications**"): that's mid-sentence
    // emphasis, and CSS `:first-child` would otherwise mistake it for a title
    // because it ignores the leading text node, breaking the step onto a
    // staircase of lines.
    if (firstChild.type === 'strong') {
      addClass(firstChild, 'beacon-step-title');
      continue;
    }
    if (firstChild.type !== 'text') continue;
    const value = firstChild.value;
    const splitMatch = value.match(/^([^—:.]{1,60})([—:.])\s*(.*)$/s);
    if (!splitMatch) continue;
    const [, title, , rest] = splitMatch;
    const titleNode = {
      type: 'strong',
      data: { hProperties: { className: ['beacon-step-title'] } },
      children: [{ type: 'text', value: title.trim() }],
    };
    const newChildren = [titleNode];
    if (rest) newChildren.push({ type: 'text', value: ` ${rest}` });
    firstPara.children.splice(0, 1, ...newChildren);
  }
}

/** Blocks allowed between two fragments of one numbered sequence. A lone image
 *  becomes a `paragraph` wrapping the image node, so `paragraph` covers it. */
const STEP_CONNECTIVE = new Set(['paragraph', 'html', 'thematicBreak', 'code', 'blockquote']);

function transformStepLists(tree) {
  for (let i = 0; i < tree.children.length; i++) {
    const node = tree.children[i];
    if (node.type !== 'list') continue;
    if (node.children.length < STEP_MIN_ITEMS) continue;

    const cued = precedingCueIsStep(tree, i);

    // Count signals
    let titleShaped = 0;
    let imperativeCount = 0;
    let oversize = false;
    for (const li of node.children) {
      const txt = mdastText(li).trim();
      if (!txt || txt.length > STEP_MAX_ITEM_LEN) { oversize = true; break; }
      const head = txt.split(/[—:.]/)[0]?.trim() ?? '';
      const wordCount = head.split(/\s+/).length;
      if (wordCount >= 1 && wordCount <= 6 && /^[A-Z]/.test(head)) titleShaped++;
      if (isImperativeFirstWord(txt)) imperativeCount++;
    }
    if (oversize) continue;

    const items = node.children.length;
    const titleRatio = titleShaped / items;
    const imperativeRatio = imperativeCount / items;

    if (node.ordered) {
      // Tightened: require title shape AND (imperative verbs OR procedure cue)
      const shaped = titleRatio >= 0.66;
      const hasSignal = imperativeRatio >= 0.5 || cued;
      if (shaped && hasSignal) {
        addClass(node, 'beacon-steps');
        boldFirstPhrase(node);
      }
      continue;
    }

    // Unordered list: only promote to steps when explicitly cued AND imperative
    if (!cued) continue;
    if (imperativeRatio < 0.5) continue;
    node.ordered = true;
    addClass(node, 'beacon-steps');
    boldFirstPhrase(node);
  }

  // An image/paragraph (or a step's nested sub-bullets) between steps makes
  // markdown split one numbered list into several `<ol start=N>`. The pass above
  // only tags the first fragment; extend `.beacon-steps` to the continuations
  // (carrying the badge counter forward) so a sequence isn't styled half as
  // badges and half as bare blue numbers — e.g. steps 1–3 badges, 4–5 plain.
  promoteStepContinuations(tree);
}

function promoteStepContinuations(tree) {
  const kids = tree.children;
  const isStepList = (n) =>
    n?.type === 'list' && n.ordered &&
    (n.data?.hProperties?.className || []).includes('beacon-steps');

  for (let i = 0; i < kids.length; i++) {
    if (!isStepList(kids[i])) continue;
    let expected = (kids[i].start ?? 1) + kids[i].children.length;
    for (let j = i + 1; j < kids.length; j++) {
      const b = kids[j];
      if (b.type === 'heading') break; // new section ends the sequence
      if (b.type === 'list') {
        if (!b.ordered) continue; // a step's nested sub-bullets — step over
        if ((b.start ?? 1) !== expected) break; // numbering doesn't continue
        addClass(b, 'beacon-steps');
        setHProp(b, 'style', `counter-reset: beacon-step ${(b.start ?? 1) - 1}`);
        boldFirstPhrase(b);
        expected += b.children.length;
        continue;
      }
      if (!STEP_CONNECTIVE.has(b.type)) break; // a real content break
    }
  }
}

/** ---------------------------------------------------------------------
 *  6) Two consecutive code blocks → side-by-side pair grid
 *  ------------------------------------------------------------------- */
function transformCodePairs(tree) {
  for (let i = 0; i < tree.children.length - 1; i++) {
    const a = tree.children[i];
    const b = tree.children[i + 1];
    if (a.type !== 'code' || b.type !== 'code') continue;
    if (a.lang !== b.lang) continue;
    if ((a.value?.length ?? 0) > 600 || (b.value?.length ?? 0) > 600) continue;

    const wrapper = { type: 'html', value: '<div class="beacon-code-pair">' };
    const closer = { type: 'html', value: '</div>' };
    tree.children.splice(i, 2, wrapper, a, b, closer);
    i += 3;
  }
}

/** ---------------------------------------------------------------------
 *  7) Bolded-prefix paragraphs (and italic-wrapped variants) → asides
 *  ------------------------------------------------------------------- */
const CALLOUT_LABELS = {
  note: 'note',
  'heads up': 'note',
  fyi: 'note',
  tip: 'tip',
  hint: 'tip',
  recommendation: 'tip',
  important: 'caution',
  warning: 'caution',
  caution: 'caution',
  danger: 'danger',
};

function classifyLabel(text) {
  const label = text.trim().toLowerCase().replace(/:$/, '');
  return CALLOUT_LABELS[label] ?? null;
}

function convertParagraphToAside(node) {
  if (!node.children || !node.children.length) return null;

  // Case A: paragraph starts with strong — e.g. **Note:** body
  const first = node.children[0];
  if (first.type === 'strong') {
    const kind = classifyLabel(mdastText(first));
    if (!kind) return null;
    node.children.shift();
    while (
      node.children.length &&
      node.children[0].type === 'text' &&
      /^[\s:–—-]*$/.test(node.children[0].value)
    ) node.children.shift();
    if (node.children[0]?.type === 'text') {
      node.children[0].value = node.children[0].value.replace(/^\s+/, '');
    }
    return makeAside(kind, [node]);
  }

  // Case B: paragraph wrapped in emphasis containing leading strong — ***Note:** body*
  if (first.type === 'emphasis' && first.children?.[0]?.type === 'strong') {
    const kind = classifyLabel(mdastText(first.children[0]));
    if (!kind) return null;
    // Drop the leading strong inside the emphasis
    first.children.shift();
    while (
      first.children.length &&
      first.children[0].type === 'text' &&
      /^[\s:–—-]*$/.test(first.children[0].value)
    ) first.children.shift();
    if (first.children[0]?.type === 'text') {
      first.children[0].value = first.children[0].value.replace(/^\s+/, '');
    }
    // Unwrap the emphasis so the body isn't all italic inside the aside
    node.children.splice(0, 1, ...first.children);
    return makeAside(kind, [node]);
  }

  return null;
}

function transformBoldedCallouts(tree) {
  // Top-level paragraphs
  for (let i = 0; i < tree.children.length; i++) {
    const node = tree.children[i];
    if (node.type !== 'paragraph') continue;
    const aside = convertParagraphToAside(node);
    if (aside) tree.children.splice(i, 1, aside);
  }

  // Inside blockquotes — convert single-paragraph blockquote to aside.
  // Walk in reverse so splice doesn't shift indices we still need.
  visit(tree, 'blockquote', (bq, index, parent) => {
    if (!parent || index == null) return;
    if (!bq.children?.length) return;
    // Convert only when the blockquote is a single bold-prefixed paragraph
    if (bq.children.length !== 1) return;
    const para = bq.children[0];
    if (para.type !== 'paragraph') return;
    const aside = convertParagraphToAside(para);
    if (!aside) return;
    parent.children.splice(index, 1, aside);
  });
}

/** ---------------------------------------------------------------------
 *  8) Backend-size pills — UL of XSmall/Small/Medium/Large items
 *  ------------------------------------------------------------------- */
const SIZE_RE =
  /^(XSmall|Small|Medium|Large|XLarge|2XLarge|3XLarge|4XLarge)(\s+\(default\))?\s*$/i;

function transformBackendSizes(tree) {
  visit(tree, 'list', (node) => {
    if (node.ordered) return;
    if (node.children.length < 3 || node.children.length > 8) return;
    const matches = [];
    for (const li of node.children) {
      const t = mdastText(li).trim();
      const m = t.match(SIZE_RE);
      if (!m) return;
      matches.push({ name: m[1], isDefault: !!m[2] });
    }
    addClass(node, 'beacon-size-pills');
    for (let k = 0; k < node.children.length; k++) {
      if (matches[k].isDefault) addClass(node.children[k], 'is-default');
    }
  });
}

/** ---------------------------------------------------------------------
 *  9) Term–definition glossary lists
 *      `- **Term** — definition text…`
 *  ------------------------------------------------------------------- */
function transformGlossaryList(tree) {
  visit(tree, 'list', (node) => {
    if (node.ordered) return;
    if (node.children.length < 3) return;
    let glossaryShape = 0;
    for (const li of node.children) {
      const para = li.children?.find((c) => c.type === 'paragraph');
      if (!para || !para.children?.length) return;
      const first = para.children[0];
      if (first.type !== 'strong') return;
      const second = para.children[1];
      if (!second || second.type !== 'text') return;
      if (!/^\s*(—|–|--|-)\s+/.test(second.value)) return;
      glossaryShape++;
    }
    if (glossaryShape / node.children.length < 0.66) return;
    addClass(node, 'beacon-glossary');

    // Wrap the whole definition (everything after the leading term) in a single
    // element so the 2-col grid gets exactly [term][definition]. Without this,
    // `p{display:contents}` flattens each inline node (extra bold, links) into
    // its own grid cell → the definition "staircases" into the narrow term
    // column. Wrapped, the definition flows as one full-width sentence.
    for (const li of node.children) {
      const para = li.children?.find((c) => c.type === 'paragraph');
      if (!para?.children?.length) continue;
      const [term, ...rest] = para.children;
      if (!rest.length) continue;
      para.children = [
        term,
        {
          type: 'beaconGlossaryDef',
          data: { hName: 'span', hProperties: { className: ['beacon-glossary-def'] } },
          children: rest,
        },
      ];
    }
  });
}

/** ---------------------------------------------------------------------
 *  10) Label-value "spec" tables (2-col, col 1 is bold)
 *  ------------------------------------------------------------------- */
function transformSpecTables(tree) {
  visit(tree, 'table', (table) => {
    if (!table.children?.length) return;
    let validRows = 0;
    let twoColumns = true;
    for (const row of table.children) {
      if (!row.children || row.children.length !== 2) { twoColumns = false; break; }
      const firstCell = row.children[0];
      const onlyBold =
        firstCell.children?.length === 1 &&
        firstCell.children[0].type === 'strong';
      if (onlyBold) validRows++;
    }
    if (!twoColumns) return;
    // Header row may not match — require 66% of remaining rows to be bold-prefixed
    if (validRows / table.children.length < 0.5) return;
    addClass(table, 'beacon-spec-table');
  });
}

/** ---------------------------------------------------------------------
 *  11) Status-emoji table cells → status pills
 *  ------------------------------------------------------------------- */
const STATUS_EMOJI_TO_CLASS = {
  '🚧': 'beacon-status--pending',
  '✅': 'beacon-status--ok',
  '✔️': 'beacon-status--ok',
  '❌': 'beacon-status--gone',
  '⚠️': 'beacon-status--warn',
  '🟢': 'beacon-status--ok',
  '🔴': 'beacon-status--gone',
  '🟡': 'beacon-status--warn',
};
function transformStatusTables(tree) {
  visit(tree, 'table', (table) => {
    let touched = false;
    for (const row of table.children ?? []) {
      for (const cell of row.children ?? []) {
        const firstChild = cell.children?.[0];
        if (!firstChild) continue;
        const text = firstChild.type === 'text' ? firstChild.value : '';
        for (const [emoji, cls] of Object.entries(STATUS_EMOJI_TO_CLASS)) {
          if (text.startsWith(emoji)) {
            addClass(cell, 'beacon-status', cls);
            touched = true;
            break;
          }
        }
      }
    }
    if (touched) addClass(table, 'beacon-status-table');
  });
}

/** ---------------------------------------------------------------------
 *  12) Prompt bubbles — `Label:` paragraph + fenced code w/ quoted body
 *  ------------------------------------------------------------------- */
function transformPromptBubbles(tree) {
  for (let i = 0; i < tree.children.length - 1; i++) {
    const para = tree.children[i];
    const code = tree.children[i + 1];
    if (para.type !== 'paragraph' || code.type !== 'code') continue;
    if (code.lang) continue;
    const text = mdastText(para).trim();
    if (!text.endsWith(':')) continue;
    if (text.length < 4 || text.length > 100) continue;
    const codeBody = code.value.trim();
    // Body must start with a quote character (typical chat-style examples)
    if (!/^["“'‘]/.test(codeBody)) continue;

    const open = { type: 'html', value: '<div class="beacon-prompt">' };
    const close = { type: 'html', value: '</div>' };
    addClass(para, 'beacon-prompt-label');
    addClass(code, 'beacon-prompt-body');
    tree.children.splice(i, 2, open, para, code, close);
    i += 3;
  }
}

/** ---------------------------------------------------------------------
 *  13) <div align="center">caption</div> below image → <figure>+caption
 *  ------------------------------------------------------------------- */
function transformFigureCaptions(tree) {
  for (let i = 0; i < tree.children.length - 1; i++) {
    const node = tree.children[i];
    const next = tree.children[i + 1];
    if (node.type !== 'paragraph') continue;
    if (node.children?.length !== 1 || node.children[0].type !== 'image') continue;
    if (next.type !== 'html') continue;
    const m = next.value.match(/^<div\s+align\s*=\s*["']center["']\s*>([\s\S]*?)<\/div>\s*$/i);
    if (!m) continue;

    const img = node.children[0];
    const alt = (img.alt ?? '').replace(/"/g, '&quot;');
    const url = (img.url ?? '').replace(/"/g, '&quot;');
    const caption = m[1].trim();
    const figureHtml = {
      type: 'html',
      value:
        `<figure class="beacon-figure">` +
        `<img src="${url}" alt="${alt}" />` +
        `<figcaption>${caption}</figcaption>` +
        `</figure>`,
    };
    tree.children.splice(i, 2, figureHtml);
  }
}

/** ---------------------------------------------------------------------
 *  14) Wrap wide tables in a horizontal-scroll container
 *  ------------------------------------------------------------------- */
function transformTableScroll(tree) {
  // Wrap every non-spec, non-status table in a scroll container. The CSS
  // overflow rule is a no-op when content fits, so it's safe to apply
  // broadly — and avoids tuning a column/length heuristic.
  for (let i = 0; i < tree.children.length; i++) {
    const node = tree.children[i];
    if (node.type !== 'table') continue;

    // Don't wrap a spec table — that one is borderless on purpose
    const classes = node.data?.hProperties?.className;
    if (Array.isArray(classes) && classes.includes('beacon-spec-table')) continue;

    const open = { type: 'html', value: '<div class="beacon-table-scroll">' };
    const close = { type: 'html', value: '</div>' };
    tree.children.splice(i, 1, open, node, close);
    i += 2;
  }
}

/** ---------------------------------------------------------------------
 *  Plugin entry
 *  ------------------------------------------------------------------- */
export default function beaconTransforms() {
  return (tree, file) => {
    if (file?.data?.astro?.frontmatter?.beacon === false) return;

    /* Order matters:
       - legacy alerts before everything else so their bodies participate
         in later passes
       - pseudo-H4 before step lists so the new heading can act as a cue
       - backend / glossary / status table classifiers BEFORE generic step
         and table-scroll passes (so they win the more-specific match)
       - bolded callouts last so other transforms don't see asides
    */
    transformLegacyAlerts(tree);
    transformPseudoHeadings(tree);
    transformAdvantageList(tree);
    transformBackendSizes(tree);
    transformGlossaryList(tree);
    transformSpecTables(tree);
    transformStatusTables(tree);
    transformStepLists(tree);
    transformPromptBubbles(tree);
    transformCodePairs(tree);
    transformFigureCaptions(tree);
    transformTableScroll(tree);
    transformBoldedCallouts(tree);
  };
}
