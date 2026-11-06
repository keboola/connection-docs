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
  const lines = body.split(/\r?\n/);
  const parts = [];
  let fence = null;
  let comment = null;
  let admonition = 0;
  let frontmatter = false;
  let seenAny = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (!seenAny && line === '---') { frontmatter = !frontmatter; continue; }
    if (frontmatter) continue;
    if (line) seenAny = true;

    if (fence) { if (line.startsWith(fence)) fence = null; continue; }
    if (comment) { if (line.includes(comment)) comment = null; continue; }
    if (/^:::\S/.test(line)) { admonition++; continue; }
    if (admonition) { if (line === ':::') admonition--; continue; }

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
      /^:::$/.test(line);
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
// colons into periods). Also true the other way round: a paragraph cut short by
// a list ("…fetch data from the" followed by "- Azure Table storage") is the
// start of a description that ran on into that list.
export function ledeRepeatsBody(description, body) {
  const lede = plainText(description).replace(/[.:!?]+$/, '');
  if (!lede) return false;
  const para = plainText(firstParagraph(body));
  return para.startsWith(lede) || (para.length >= 40 && lede.startsWith(para));
}
