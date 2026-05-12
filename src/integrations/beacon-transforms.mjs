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

/** ---------------------------------------------------------------------
 *  1) First short ul → beacon-check-grid
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
    if (firstChild.type !== 'text') continue;
    const value = firstChild.value;
    const splitMatch = value.match(/^([^—:.]{1,60})([—:.])\s*(.*)$/s);
    if (!splitMatch) continue;
    const [, title, , rest] = splitMatch;
    const newChildren = [
      { type: 'strong', children: [{ type: 'text', value: title.trim() }] },
    ];
    if (rest) newChildren.push({ type: 'text', value: ` ${rest}` });
    firstPara.children.splice(0, 1, ...newChildren);
  }
}

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
 *  Plugin entry
 *  ------------------------------------------------------------------- */
export default function beaconTransforms() {
  return (tree, file) => {
    if (file?.data?.astro?.frontmatter?.beacon === false) return;

    /* Order matters:
       - legacy alerts before everything else so their bodies participate
         in later passes
       - pseudo-H4 before step lists so the new heading can act as a cue
       - bolded callouts last so other transforms don't see asides
    */
    transformLegacyAlerts(tree);
    transformPseudoHeadings(tree);
    transformAdvantageList(tree);
    transformStepLists(tree);
    transformCodePairs(tree);
    transformBoldedCallouts(tree);
  };
}
