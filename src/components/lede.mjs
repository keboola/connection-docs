// Decides whether PageTitle.astro shows the frontmatter `description` as the
// lede under the H1.
//
// Many descriptions are the page's own first sentence, word for word (the
// PRDCT-377 backfill took them from the body). Shown as the lede, that sentence
// then appears twice in a row: once under the title, once as the first
// paragraph. `ledeRepeatsBody` spots that case so the page can drop the lede and
// keep the description for <meta>, search and llms.txt. A description written
// as a summary still shows.

// The first prose paragraph of a markdown or MDX body, as plain text. Skips
// what renders before it or isn't prose: frontmatter, MDX imports, comments,
// admonitions, code fences, headings, images, lists, quotes, HTML and
// component tags. Returns '' when the body has no prose paragraph.
export function firstParagraph(body) {
  if (!body) return '';
  // Frontmatter only when the block is YAML keys: a body (PageTitle passes one without its
  // frontmatter) may open with a `---` rule, and that is not frontmatter.
  const fm = body.match(/^\s*---\r?\n(?:(?:[A-Za-z_][\w-]*:.*|[ \t]+.*|[ \t]*)\r?\n)*?---[ \t]*(?:\r?\n|$)/);
  const lines = body.slice(fm ? fm[0].length : 0).split(/\r?\n/);
  const parts = [];
  let fence = null;
  let comment = null;
  const admonitions = []; // colon count of each open `:::name` / `::::agent` block

  for (const raw of lines) {
    const line = raw.trim();

    if (fence) { if (line.startsWith(fence)) fence = null; continue; }
    if (comment) { if (line.includes(comment)) comment = null; continue; }
    const opens = line.match(/^(:{3,})[A-Za-z]/);
    if (opens) { admonitions.push(opens[1].length); continue; }
    if (admonitions.length) { if (/^:{3,}$/.test(line) && line.length >= admonitions.at(-1)) admonitions.pop(); continue; }

    const isBreak =
      !line ||
      /^(`{3,}|~{3,})/.test(line) ||
      /^<!--/.test(line) ||
      /^\{\/\*/.test(line) ||
      /^(import|export)\s/.test(line) ||
      /^#{1,6}\s/.test(line) ||
      /^!?\[[^\]]*\]\([^)]*\)\s*$/.test(line) ||
      /^>/.test(line) ||
      /^([-*+]|\d+[.)])\s/.test(line) ||
      /^<\/?[A-Za-z]/.test(line) ||
      /^\|/.test(line) ||
      /^:::$/.test(line) ||
      /^([-*_])(?:[ \t]*\1){2,}$/.test(line);   // a thematic break (---, ***, ___)
    if (!isBreak) { parts.push(line); continue; }
    if (parts.length) break;

    const open = line.match(/^(`{3,}|~{3,})/);
    if (open) fence = open[1];
    else if (/^<!--/.test(line) && !line.includes('-->')) comment = '-->';
    else if (/^\{\/\*/.test(line) && !line.includes('*/}')) comment = '*/}';
  }
  return parts.join(' ');
}

// Markdown to comparable text: link and image text kept, markup and HTML tags
// dropped, typographic quotes and whitespace folded, lower case.
export function plainText(text) {
  return String(text ?? '')
    .replace(/!?\[([^\]]*)\]\((?:[^()]|\([^)]*\))*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[`*_~]/g, '')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

// True when the description is the opening of the first paragraph, ignoring
// markup and its own closing punctuation (the backfill turned some trailing
// colons into periods). Also true the other way round, but only for a paragraph
// cut short by a list ("…fetch data from the" followed by "- Azure Table
// storage"): that is the start of a description that ran on into the list. A
// first paragraph that ends its sentence is complete, and a description that
// starts with it and goes on is a summary worth showing.
export function ledeRepeatsBody(description, body) {
  const lede = plainText(description).replace(/[.:!?]+$/, '');
  if (!lede) return false;
  const para = plainText(firstParagraph(body));
  if (para.startsWith(lede)) return true;
  const cutShort = !/[.!?]["')\]]*$/.test(para);
  return cutShort && para.length >= 40 && lede.startsWith(para);
}
