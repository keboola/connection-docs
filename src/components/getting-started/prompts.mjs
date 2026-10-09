// The guide's prompts in course order, read from the pages themselves.
//
// Two consumers: GuidePrompts.astro, which shows them on the page "The whole guide with Kai"
// (getting-started/with-kai/), and src/integrations/page-markdown.mjs, which prints the same list
// into that page's markdown twin. Each step also carries `approvals` and `done` from course.mjs.
// Each step page keeps its prompts where a reader meets them, in its Prompt tab; this module only
// reads them, so a prompt changed on its page changes on with-kai/ with the next build (2026-10-07).
//
// A prompt is a ```text title="Prompt" block inside the page's <TabItem label="Prompt">, at any
// indentation (app/ has it inside a numbered list). Steps without a Prompt tab (project/, check/)
// are left out. The build fails, rather than ship an empty list, when a step that should have
// prompts has none: a renamed tab label or fence title, or a build started outside the repo root.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { COURSE } from './course.mjs';

const PAGES = join(process.cwd(), 'src/content/docs/getting-started');
const EXPECTED = ['load', 'transform', 'ask', 'app', 'automate'];

// Where each prompt goes, as [before, UI label, after], so only the label is bold. Every step but
// the app is a Kai Agent chat; the app is described in the Apps builder (app/ says why).
const WHERE = { app: ['the Apps builder (', 'Apps', ' in the navigation)'] };
const DEFAULT_WHERE = ['', 'Kai Agent', ''];

/** The prompt blocks of one step page's Prompt tab, dedented. */
export function stepPrompts(key) {
  let src;
  try {
    src = readFileSync(join(PAGES, key, 'index.mdx'), 'utf8');
  } catch {
    if (EXPECTED.includes(key)) throw new Error(`prompts.mjs: cannot read ${key}/index.mdx under ${PAGES}`);
    return [];
  }
  const tab = src.match(/<TabItem label="Prompt">([\s\S]*?)<\/TabItem>/);
  if (!tab) return [];
  const prompts = [];
  const block = /^([ \t]*)```text title="Prompt"[^\n]*\n([\s\S]*?)^\1```[ \t]*$/gm;
  for (const [, indent, body] of tab[1].matchAll(block)) {
    const text = body
      .replace(/\n$/, '')
      .split('\n')
      .map((line) => (line.startsWith(indent) ? line.slice(indent.length) : line.trimStart()))
      .join('\n');
    if (text.trim()) prompts.push(text);
  }
  return prompts;
}

/** Every step that has prompts, in course order, with where its prompts go. */
export function guidePrompts() {
  const steps = COURSE.map((step) => ({
    key: step.key,
    title: step.title,
    href: step.href,
    where: WHERE[step.key] ?? DEFAULT_WHERE,
    n: COURSE.indexOf(step) + 1,
    approvals: step.approvals ?? null,
    done: step.done ?? null,
    shot: step.shot ?? null,
    prompts: stepPrompts(step.key),
  }));
  const missing = steps.filter((s) => EXPECTED.includes(s.key) && !s.prompts.length).map((s) => s.key);
  if (missing.length) {
    throw new Error(`prompts.mjs: no \`\`\`text title="Prompt" block in the Prompt tab of ${missing.join(', ')}`);
  }
  return steps.filter((step) => step.prompts.length);
}

/** "Expect … Done when …", the line after a step's prompts; markdown bold kept as is. */
export function expectLine(step) {
  const parts = [];
  if (step.approvals) parts.push(`Expect ${step.approvals}.`);
  if (step.done) parts.push(`Done when ${step.done}.`);
  return parts.join(' ');
}

/** The markdown twin's version: a numbered heading line per step, its prompts as fences, then the expect line. */
export function guidePromptsText() {
  const out = [];
  guidePrompts().forEach((step, i) => {
    const [before, label, after] = step.where;
    // a heading, not a list item: the unindented fences below would restart a markdown list
    out.push(`### ${step.n}. [${step.title}](${step.href}), in ${before}${label}${after}`, '');
    for (const prompt of step.prompts) out.push('```text', prompt, '```', '');
    const line = expectLine(step);
    if (line) out.push(line, '');
  });
  return out;
}
