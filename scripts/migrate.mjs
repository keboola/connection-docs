#!/usr/bin/env node

/**
 * migrate.mjs — Jekyll-to-Starlight content migration script
 *
 * Transforms all Jekyll markdown files to Starlight format and copies them
 * (along with images) to src/content/docs/.
 *
 * Usage:  node scripts/migrate.mjs
 *
 * This script is idempotent — running it again produces the same result.
 */

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, statSync, existsSync, rmSync } from 'fs';
import { join, dirname, extname, relative, resolve } from 'path';
import yaml from 'js-yaml';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const DEST_DOCS = join(ROOT, 'src', 'content', 'docs');
const DEST_ASSETS = join(ROOT, 'src', 'assets');
const DEST_PUBLIC = join(ROOT, 'public');

/** Directories / path prefixes to skip when scanning for .md files */
const SKIP_DIRS = new Set([
  '_includes', '_layouts', '_sass', '_data', '_site',
  'node_modules', 'src', 'scripts', '.worktrees', '.git',
  '.github', '.claude', 'assets', 'public',
  // Build outputs — never a migration source (and would pollute the asset walk)
  'dist', '.astro', '.vercel',
]);

/** Specific root-level files to skip */
const SKIP_FILES = new Set([
  'README.md', 'LICENSE', 'LICENSE.md', 'CONTRIBUTING.md',
  'AUDIT_LOG.md', 'UI_FIXES_LOG.md', 'DEV_DOCS_INTEGRATION.md',
  'claude.md', 'CLAUDE.md',
]);

/**
 * Directories under DEST_DOCS to delete after migration.
 * Use when a Jekyll page was moved/renamed and the old path still gets
 * regenerated from the source tree, causing the redirect to be suppressed
 * (the redirect-from integration skips any redirect whose target page exists).
 */
const POST_MIGRATE_DELETE = [
  'flows/conditional-flows', // moved to flows/index.md with redirect_from
];

/**
 * Per-file title overrides — keyed by the file's path relative to ROOT.
 * Use when the Jekyll frontmatter title is wrong (e.g. copied from a parent
 * section) and the correct title cannot be derived mechanically.
 */
const TITLE_OVERRIDES = {
  'overview/google-data-policy.md': 'Google Data Usage Policy',
};

/**
 * Code-fence language aliases — maps unrecognised language identifiers to
 * ones that expressive-code (Astro Starlight's highlighter) supports.
 * Add entries here whenever the build emits an "unknown language" warning.
 */
const FENCE_LANG_ALIASES = {
  bigquery: 'sql',
};

/** Image extensions to copy */
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']);

/** Downloadable asset extensions referenced from content (A-1: these were
 *  previously not migrated, breaking ~33 download links in tutorials/
 *  transformations). Root-level files (package.json, tsconfig.json, …) are
 *  excluded in findDownloadFiles so only in-content assets are copied. */
const DOWNLOAD_EXTS = new Set(['.csv', '.zip', '.docx', '.xlsx', '.pdf', '.json']);

// ---------------------------------------------------------------------------
// Counters for the summary
// ---------------------------------------------------------------------------

const stats = {
  mdFiles: 0,
  imagesCopied: 0,
  permalinksConverted: 0,
  layoutsRemoved: 0,
  showBreadcrumbsRemoved: 0,
  sitemapConverted: 0,
  tocRemoved: 0,
  highlightBlocks: 0,
  tipIncludes: 0,
  warningIncludes: 0,
  publicBetaIncludes: 0,
  privateBetaIncludes: 0,
  imagePopupRemoved: 0,
  kramdownAttrsRemoved: 0,
  rawTagsStripped: 0,
  commentTagsConverted: 0,
  overviewHeadingsRemoved: 0,
  redirectToPagesSkipped: 0,
  redirectFromAliasesInjected: 0,
  telemetryTablesExpanded: 0,
  jekyllAssetsCopied: 0,
};

// ---------------------------------------------------------------------------
// File discovery
// ---------------------------------------------------------------------------

/**
 * Recursively collect file paths under `dir` that match a predicate.
 * Skips directories listed in SKIP_DIRS (only at the first path segment).
 */
function walkDir(dir, predicate, collected = [], depth = 0) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return collected;
  }

  for (const entry of entries) {
    // At the top level, skip excluded directories and specific files
    if (depth === 0 && SKIP_DIRS.has(entry)) continue;
    if (depth === 0 && SKIP_FILES.has(entry)) continue;
    // Skip any directory starting with _ at top level (catches future additions)
    if (depth === 0 && entry.startsWith('_')) continue;

    const full = join(dir, entry);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }

    if (st.isDirectory()) {
      walkDir(full, predicate, collected, depth + 1);
    } else if (predicate(entry, full)) {
      collected.push(full);
    }
  }
  return collected;
}

/** Return all .md files that should be migrated. */
function findMarkdownFiles() {
  return walkDir(ROOT, (name) => extname(name) === '.md');
}

/** Return all image files that should be copied. */
function findImageFiles() {
  return walkDir(ROOT, (name) => IMAGE_EXTS.has(extname(name).toLowerCase()));
}

/** Return downloadable asset files that should be copied (A-1). Skips files
 *  sitting directly in ROOT (config like package.json) — only assets that live
 *  inside content directories are migrated. */
function findDownloadFiles() {
  return walkDir(ROOT, (name, full) =>
    DOWNLOAD_EXTS.has(extname(name).toLowerCase()) && dirname(full) !== ROOT,
  );
}

// ---------------------------------------------------------------------------
// Frontmatter transformation
// ---------------------------------------------------------------------------

/**
 * Split a file into { frontmatter: string, body: string }.
 * `frontmatter` includes the leading/trailing `---` lines.
 */
function splitFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { frontmatter: '', body: content };
  const fmRaw = match[1];
  const afterIdx = match[0].length;
  return { frontmatter: fmRaw, body: content.slice(afterIdx) };
}

/**
 * Transform Jekyll frontmatter lines to Starlight equivalents.
 * Returns the new frontmatter string (without surrounding ---).
 */
function transformFrontmatter(fmRaw) {
  const lines = fmRaw.split('\n');
  const out = [];
  let i = 0;

  while (i < lines.length) {
    // Strip trailing \r to handle Windows line endings
    const line = lines[i].replace(/\r$/, '');

    // --- permalink → slug ---
    const permalinkMatch = line.match(/^permalink:\s*(.+)$/);
    if (permalinkMatch) {
      let value = permalinkMatch[1].trim();
      // Strip surrounding quotes if any
      value = value.replace(/^['"]|['"]$/g, '');

      if (value === '/') {
        // Homepage
        out.push("slug: ''");
      } else if (value === '/404.html') {
        out.push("slug: '404'");
      } else {
        // Strip leading slash, strip trailing slash
        let slug = value.replace(/^\//, '').replace(/\/$/, '');
        out.push(`slug: '${slug}'`);
      }
      stats.permalinksConverted++;
      i++;
      continue;
    }

    // --- Remove layout: ---
    if (/^layout:\s/.test(line)) {
      stats.layoutsRemoved++;
      i++;
      continue;
    }

    // --- Remove showBreadcrumbs: ---
    if (/^showBreadcrumbs:\s/.test(line)) {
      stats.showBreadcrumbsRemoved++;
      i++;
      continue;
    }

    // --- sitemap: false → pagefind: false ---
    if (/^sitemap:\s*false/.test(line)) {
      out.push('pagefind: false');
      stats.sitemapConverted++;
      i++;
      continue;
    }

    // Everything else passes through (title, redirect_from, etc.)
    out.push(line);
    i++;
  }

  return out.join('\n');
}

// ---------------------------------------------------------------------------
// Body / content transformations
// ---------------------------------------------------------------------------

/**
 * Remove TOC markers:  `* TOC` and `{:toc}` lines
 */
function removeTocMarkers(body) {
  const before = body;
  body = body.replace(/^[ \t]*\*\s*TOC\s*$/gm, '');
  body = body.replace(/^[ \t]*\{:toc\}\s*$/gm, '');
  if (body !== before) stats.tocRemoved++;
  return body;
}

/**
 * Convert single-line triple-backtick spans to proper fenced code blocks.
 *
 * Jekyll/Kramdown treats ```content``` on one line as an inline code span.
 * Remark (used by Astro) interprets the opening ``` as a fenced code block
 * start and treats everything up to the newline as the language identifier,
 * which breaks rendering entirely.
 *
 * Pattern:  ```some content here```   (opening and closing on the same line)
 * Becomes:
 *   ```
 *   some content here
 *   ```
 */
function expandSingleLineFences(body) {
  return body.replace(/^```(.+)```$/gm, (_match, content) => {
    return '```\n' + content + '\n```';
  });
}

/**
 * Remap unrecognised code-fence language identifiers using FENCE_LANG_ALIASES.
 * Runs after highlight-block conversion so both forms are covered.
 */
function remapFenceLanguages(body) {
  return body.replace(/^```(\w+)$/gm, (_match, lang) => {
    const mapped = FENCE_LANG_ALIASES[lang.toLowerCase()];
    return mapped ? '```' + mapped : _match;
  });
}

/**
 * Convert Jekyll highlight blocks:
 *   {% highlight lang %}...{% endhighlight %}
 * →
 *   ```lang
 *   ...
 *   ```
 */
function convertHighlightBlocks(body) {
  return body.replace(
    /\{%\s*highlight\s+(\w+)\s*%\}\s*\n([\s\S]*?)\{%\s*endhighlight\s*%\}/g,
    (_match, lang, code) => {
      stats.highlightBlocks++;
      // Trim trailing whitespace/newlines from the code block content
      const trimmed = code.replace(/\n\s*$/, '\n');
      return '```' + lang + '\n' + trimmed + '```';
    }
  );
}

/**
 * Convert {% include tip.html ... %} to Starlight :::tip admonitions.
 *
 * Handles:
 *   - Single-line and multi-line content
 *   - Optional title= attribute
 *   - Closing `" %}` possibly split across lines (e.g. `"\n%}`)
 */
function convertTipIncludes(body) {
  // Pattern with title
  body = body.replace(
    /\{%\s*include\s+tip\.html\s+title="([^"]*?)"\s+content="([\s\S]*?)"\s*%\}/g,
    (_match, title, content) => {
      stats.tipIncludes++;
      const trimmed = content.replace(/^\n+/, '').replace(/\n+$/, '');
      return `:::tip[${title}]\n${trimmed}\n:::`;
    }
  );

  // Pattern without title
  body = body.replace(
    /\{%\s*include\s+tip\.html\s+content="([\s\S]*?)"\s*%\}/g,
    (_match, content) => {
      stats.tipIncludes++;
      const trimmed = content.replace(/^\n+/, '').replace(/\n+$/, '');
      return `:::tip\n${trimmed}\n:::`;
    }
  );

  return body;
}

/**
 * Convert {% include warning.html ... %} to Starlight :::caution admonitions.
 *
 * Same shape as tip includes.
 */
function convertWarningIncludes(body) {
  // Pattern with title
  body = body.replace(
    /\{%\s*include\s+warning\.html\s+title="([^"]*?)"\s+content="([\s\S]*?)"\s*%\}/g,
    (_match, title, content) => {
      stats.warningIncludes++;
      const trimmed = content.replace(/^\n+/, '').replace(/\n+$/, '');
      return `:::caution[${title}]\n${trimmed}\n:::`;
    }
  );

  // Pattern without title
  body = body.replace(
    /\{%\s*include\s+warning\.html\s+content="([\s\S]*?)"\s*%\}/g,
    (_match, content) => {
      stats.warningIncludes++;
      const trimmed = content.replace(/^\n+/, '').replace(/\n+$/, '');
      return `:::caution\n${trimmed}\n:::`;
    }
  );

  return body;
}

/**
 * Convert {% include public-beta-warning.html %} to a :::caution admonition.
 */
function convertPublicBetaWarning(body) {
  return body.replace(
    /\{%\s*include\s+public-beta-warning\.html\s*%\}/g,
    () => {
      stats.publicBetaIncludes++;
      return ':::caution[Public Beta]\nThis feature is currently in public beta. Please provide feedback using the feedback button in your project.\n:::';
    }
  );
}

/**
 * Convert {% include private-beta-warning.html %} to a :::caution admonition.
 */
function convertPrivateBetaWarning(body) {
  return body.replace(
    /\{%\s*include\s+private-beta-warning\.html\s*%\}/g,
    () => {
      stats.privateBetaIncludes++;
      return ':::caution[Private Beta]\nThis feature is currently in private beta.\n:::';
    }
  );
}

/**
 * Convert Kramdown block-level alert attributes to Starlight admonitions.
 *
 * Jekyll pattern (attribute on the line BEFORE the paragraph it styles):
 *   {: .alert.alert-warning}
 *   Important: some text…
 *
 * Becomes:
 *   :::caution
 *   Important: some text…
 *   :::
 *
 * Mapping:
 *   .alert-warning  → :::caution
 *   .alert-info     → :::note
 *   .alert-danger   → :::danger
 *   .alert-success  → :::tip
 *
 * Must run before removeKramdownAttrs() which would strip the marker first.
 */
const ALERT_KIND = {
  warning: 'caution',
  info:    'note',
  danger:  'danger',
  success: 'tip',
};

function convertAlertAttributes(body) {
  const lines = body.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const m = lines[i].match(/^[ \t]*\{:\s*\.alert\.alert-(\w+)[^}]*\}\s*$/);
    if (m) {
      const kind = ALERT_KIND[m[1]] ?? 'note';
      i++; // skip the attribute line
      // Collect the following paragraph (lines until blank or another attribute)
      const para = [];
      while (i < lines.length && lines[i].trim() !== '' && !/^\{:/.test(lines[i])) {
        para.push(lines[i]);
        i++;
      }
      if (para.length) {
        out.push(`:::${kind}`);
        out.push(...para);
        out.push(':::');
      }
    } else {
      out.push(lines[i]);
      i++;
    }
  }
  return out.join('\n');
}

/**
 * Convert HTML <div class="alert alert-*"> blocks to Starlight admonitions.
 *
 * Handles both single-line and multi-line alert divs, stripping any inner
 * icon tags (<i class="fas …">) and role attributes. Also removes preceding
 * <div class="clearfix"></div> lines which serve no purpose in Astro.
 *
 * Must run before removeImagePopup / removeKramdownAttrs.
 */
function convertHtmlAlerts(body) {
  // Drop clearfix divs entirely
  body = body.replace(/^[ \t]*<div[^>]*class="clearfix"[^>]*>[\s\S]*?<\/div>[ \t]*\n?/gm, '');

  // Match <div class="alert alert-TYPE …"> … </div> (possibly multi-line)
  return body.replace(
    /<div[^>]*class="[^"]*alert\s+alert-(warning|info|danger|success)[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,
    (_match, type, inner) => {
      const kind = ALERT_KIND[type.toLowerCase()] ?? 'note';
      const cleaned = inner
        .replace(/<i[^>]*>[\s\S]*?<\/i>/gi, '')              // strip icon tags (with content)
        .replace(/<a\s[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)') // links → [text](url)
        .replace(/<code>([\s\S]*?)<\/code>/gi, '`$1`')        // code → backticks
        .replace(/<\/?(?:strong|b)>/gi, '**')                  // bold → **
        .replace(/<\/?(?:em|i)>/gi, '_')                       // italic → _
        .replace(/<[^>]+>/g, '')                               // strip remaining tags
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .join(' ')
        .trim();
      return `:::${kind}\n${cleaned}\n:::`;
    }
  );
}

/**
 * Remove `{: .image-popup}` lines entirely.
 */
function removeImagePopup(body) {
  return body.replace(/^[ \t]*\{:\s*\.image-popup\}\s*\n?/gm, () => {
    stats.imagePopupRemoved++;
    return '';
  });
}

/**
 * Remove other Kramdown attribute lists `{: .something}` lines.
 */
function removeKramdownAttrs(body) {
  return body.replace(/^[ \t]*\{:\s*\.[^}]+\}\s*\n?/gm, () => {
    stats.kramdownAttrsRemoved++;
    return '';
  });
}

/**
 * Strip `{% raw %}` and `{% endraw %}` tags — they are no-ops in Astro.
 */
function stripRawTags(body) {
  const before = body;
  body = body.replace(/\{%\s*(?:end)?raw\s*%\}/g, '');
  if (body !== before) stats.rawTagsStripped++;
  return body;
}

/**
 * Convert `{% comment %}...{% endcomment %}` blocks to HTML comments.
 */
function convertCommentTags(body) {
  const before = body;
  body = body.replace(
    /\{%\s*comment\s*%\}([\s\S]*?)\{%\s*endcomment\s*%\}/g,
    (_match, content) => `<!-- ${content.trim()} -->`
  );
  if (body !== before) stats.commentTagsConverted++;
  return body;
}

/**
 * Apply all body transformations in the correct order.
 */
/**
 * Lazy-load `_data/telemetry_tables.yml`. Returns the parsed object or null
 * if the file isn't present.
 */
let _telemetryTablesCache;
function loadTelemetryTables() {
  if (_telemetryTablesCache !== undefined) return _telemetryTablesCache;
  const p = join(ROOT, '_data', 'telemetry_tables.yml');
  if (!existsSync(p)) {
    _telemetryTablesCache = null;
    return null;
  }
  _telemetryTablesCache = yaml.load(readFileSync(p, 'utf-8'));
  return _telemetryTablesCache;
}

/**
 * Render one telemetry table entry to markdown. Mirrors the Liquid template
 * at `_includes/telemetry-table.html`.
 */
function renderTelemetryTable(t) {
  const lines = [];
  lines.push(`### ${t.id}`);
  lines.push('');
  lines.push(t.description);
  if (t.is_full_load) {
    lines.push('');
    lines.push('*Note: The table is always extracted in full.*');
  }
  if (t.org_mode_note) {
    lines.push('');
    lines.push(`***Note:** ${t.org_mode_note}*`);
  }
  if (t.usage_breakdown) {
    lines.push('');
    lines.push('`usage_breakdown` data sources (which tables serve as sources for the results):');
    for (const item of t.usage_breakdown) {
      const src = item.source ? `\`${item.source}\`` : '';
      lines.push(`* \`${item.name}\` - ${src} (${item.detail})`);
    }
  }
  lines.push('');
  lines.push('| **Column** | **Description** | **Example** |');
  lines.push('|---|---|---|');
  for (const col of t.columns) {
    const pk = col.pk ? ' (PK)' : '';
    lines.push(`| \`${col.name}\`${pk} | ${col.description} | \`${col.example}\` |`);
  }
  if (t.note) {
    lines.push('');
    lines.push(t.note);
  }
  if (t.security_operations) {
    lines.push('');
    lines.push('#### Security event operations');
    lines.push('');
    for (const op of t.security_operations) lines.push(`- \`${op}\``);
    lines.push('');
    lines.push('#### Operation parameters');
    lines.push('');
    lines.push('| Condition | Values |');
    lines.push('|---|---|');
    for (const param of t.operation_parameters) {
      lines.push(`| ${param.condition}: | ${param.values} |`);
    }
  }
  return lines.join('\n');
}

/**
 * Expand the small set of Jekyll Liquid patterns used on the Telemetry Data
 * connector page. The page drives its table sections from YAML + an include
 * template. We resolve everything statically so the output is plain markdown:
 *
 *   {% assign sorted_tables = site.data.telemetry_tables.tables | sort: "id" %}
 *   → noop (we sort once below)
 *
 *   {% for table in sorted_tables %}{% if table.mode == "X" %}
 *   {% include telemetry-table.html table=table %}
 *   {% endif %}{% endfor %}
 *   → concatenated markdown rendering of each matching table
 *
 *   {{ site.data.telemetry_tables | jsonify }}
 *   → JSON string for the interactive diagram-viewer.js to consume
 */
function expandTelemetryTableIncludes(body) {
  if (!body.includes('telemetry-table.html') && !body.includes('site.data.telemetry_tables')) {
    return body;
  }
  const data = loadTelemetryTables();
  if (!data) return body;

  const sorted = [...(data.tables || [])].sort((a, b) => String(a.id).localeCompare(String(b.id)));

  // Drop the {% assign sorted_tables = ... %} line — it has no effect after expansion.
  body = body.replace(/\{%-?\s*assign\s+sorted_tables\s*=[^%]+%\}\s*\n?/g, '');

  // Replace mode-filtered loops with concatenated rendered tables.
  body = body.replace(
    /\{%-?\s*for\s+table\s+in\s+sorted_tables\s*-?%\}\s*\{%-?\s*if\s+table\.mode\s*==\s*"([^"]+)"\s*-?%\}\s*\{%-?\s*include\s+telemetry-table\.html\s+table=table\s*-?%\}\s*\{%-?\s*endif\s*-?%\}\s*\{%-?\s*endfor\s*-?%\}/g,
    (_match, mode) => {
      const filtered = sorted.filter((t) => t.mode === mode);
      stats.telemetryTablesExpanded += filtered.length;
      return filtered.map(renderTelemetryTable).join('\n\n');
    }
  );

  // Inline the full YAML as JSON for the diagram viewer's window.TELEMETRY_DIAGRAM.
  body = body.replace(
    /\{\{\s*site\.data\.telemetry_tables\s*\|\s*jsonify\s*\}\}/g,
    () => JSON.stringify(data)
  );

  return body;
}

/**
 * Strip a leading `## Overview` H2 heading. Only removes when `## Overview`
 * is the first H2 in the body — a Jekyll-era organizational wrapper that's
 * redundant under Starlight's page-title + intro lede convention. A mid-page
 * `## Overview` (i.e. preceded by other H2s) is preserved.
 */
function stripLeadingOverviewHeading(body) {
  const lines = body.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (!/^## /.test(lines[i])) continue;
    if (/^##\s+Overview\s*$/.test(lines[i])) {
      lines.splice(i, 1);
      if (i < lines.length && lines[i] === '') lines.splice(i, 1);
      stats.overviewHeadingsRemoved++;
    }
    break;
  }
  return lines.join('\n');
}

function transformBody(body) {
  body = removeTocMarkers(body);
  body = expandSingleLineFences(body);
  body = convertHighlightBlocks(body);
  body = remapFenceLanguages(body);
  body = convertTipIncludes(body);
  body = convertWarningIncludes(body);
  body = convertPublicBetaWarning(body);
  body = convertPrivateBetaWarning(body);
  // Expand Jekyll YAML+include patterns (telemetry tables) before stripRawTags
  // so the `{% %}` blocks are resolved to plain markdown.
  body = expandTelemetryTableIncludes(body);
  // alert attributes must run before image-popup and generic kramdown stripping
  // so the marker is still present when we need to convert the following paragraph
  body = convertAlertAttributes(body);
  body = convertHtmlAlerts(body);
  // image-popup must come before generic kramdown attrs
  // (since {: .image-popup} also matches the generic pattern)
  body = removeImagePopup(body);
  body = removeKramdownAttrs(body);
  // Strip residual Liquid tags that are no-ops in Astro
  body = stripRawTags(body);
  body = convertCommentTags(body);
  body = stripLeadingOverviewHeading(body);
  return body;
}

// ---------------------------------------------------------------------------
// Full file transform
// ---------------------------------------------------------------------------

/**
 * Inject extra entries into the frontmatter's `redirect_from:` list.
 * If a `redirect_from:` block exists, appends entries at the end of its list.
 * If not, appends a new `redirect_from:` block at the end of the frontmatter.
 */
function injectRedirectAliases(fmRaw, aliases) {
  if (!aliases || aliases.length === 0) return fmRaw;

  const lines = fmRaw.split('\n');
  let listStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^redirect_from:\s*$/.test(lines[i])) {
      listStart = i;
      break;
    }
  }

  const aliasLines = aliases.map((a) => `  - ${a}`);
  if (listStart >= 0) {
    let endIdx = listStart + 1;
    while (endIdx < lines.length && /^\s+-\s/.test(lines[endIdx])) endIdx++;
    lines.splice(endIdx, 0, ...aliasLines);
  } else {
    // Drop any trailing blank line so the new block sits flush
    while (lines.length && lines[lines.length - 1] === '') lines.pop();
    lines.push('redirect_from:', ...aliasLines);
  }

  stats.redirectFromAliasesInjected += aliases.length;
  return lines.join('\n');
}

/**
 * Pre-scan all markdown files for `redirect_to:` frontmatter and build:
 *   - aliasMap: target permalink → array of paths to append to its redirect_from
 *   - skipPaths: absolute paths of files to skip writing (the redirect stubs)
 *
 * This replicates Jekyll's jekyll-redirect-from behavior for `redirect_to`,
 * which the Astro redirect-from integration does not honor natively.
 */
function buildRedirectAliasMap(mdFiles) {
  const aliasMap = new Map();
  const skipPaths = new Set();

  for (const absPath of mdFiles) {
    const content = readFileSync(absPath, 'utf-8');
    const { frontmatter } = splitFrontmatter(content);
    if (!frontmatter) continue;

    let fm;
    try {
      fm = yaml.load(frontmatter);
    } catch {
      continue;
    }
    if (!fm || typeof fm !== 'object' || !fm.redirect_to) continue;

    const target = String(fm.redirect_to).replace(/\/$/, '') + '/';
    const aliases = [];
    if (fm.permalink) aliases.push(String(fm.permalink));
    if (Array.isArray(fm.redirect_from)) {
      for (const r of fm.redirect_from) aliases.push(String(r));
    }

    if (!aliasMap.has(target)) aliasMap.set(target, []);
    aliasMap.get(target).push(...aliases);
    skipPaths.add(absPath);
  }

  return { aliasMap, skipPaths };
}

/**
 * Extract this file's permalink (with trailing slash) so we can look it up
 * in the redirect alias map.
 */
function getPermalinkForLookup(frontmatter) {
  if (!frontmatter) return null;
  let fm;
  try {
    fm = yaml.load(frontmatter);
  } catch {
    return null;
  }
  if (!fm || typeof fm !== 'object' || !fm.permalink) return null;
  return String(fm.permalink).replace(/\/$/, '') + '/';
}

function transformFile(content, aliases, relPath) {
  const { frontmatter, body } = splitFrontmatter(content);

  let fmToTransform = frontmatter;
  if (frontmatter && aliases && aliases.length) {
    fmToTransform = injectRedirectAliases(frontmatter, aliases);
  }

  let newFm = fmToTransform ? transformFrontmatter(fmToTransform) : '';

  // Apply per-file title overrides after all other frontmatter transforms.
  const titleOverride = relPath && TITLE_OVERRIDES[relPath];
  if (titleOverride && newFm) {
    newFm = newFm.replace(/^title:.*$/m, `title: ${titleOverride}`);
  }

  const newBody = transformBody(body);

  if (newFm) {
    return '---\n' + newFm + '\n---' + newBody;
  }
  return newBody;
}

// ---------------------------------------------------------------------------
// File writing helpers
// ---------------------------------------------------------------------------

function ensureDir(filePath) {
  mkdirSync(dirname(filePath), { recursive: true });
}

function rmrf(dirPath) {
  try { rmSync(dirPath, { recursive: true, force: true }); } catch { /* non-fatal */ }
}

function writeFileSafe(dest, content) {
  ensureDir(dest);
  writeFileSync(dest, content, 'utf-8');
}

function copyFileSafe(src, dest) {
  ensureDir(dest);
  copyFileSync(src, dest);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

/**
 * Mirror `assets/js/*.js` from the Jekyll source into `public/assets/js/`
 * so that pages embedding `<script src="/assets/js/...">` continue to work.
 * (The `assets/` tree is excluded from the markdown walk via SKIP_DIRS, so
 * its files don't get auto-copied with content images.)
 */
function copyJekyllAssetsJs() {
  const srcDir = join(ROOT, 'assets', 'js');
  if (!existsSync(srcDir)) return;
  for (const name of readdirSync(srcDir)) {
    if (extname(name) !== '.js') continue;
    const src = join(srcDir, name);
    const dest = join(DEST_PUBLIC, 'assets', 'js', name);
    copyFileSafe(src, dest);
    stats.jekyllAssetsCopied++;
    console.log(`Copied: assets/js/${name} → public/assets/js/${name}`);
  }
}

function main() {
  console.log('=== Jekyll → Starlight migration ===');
  console.log(`Root:        ${ROOT}`);
  console.log(`Destination: ${DEST_DOCS}`);
  console.log();

  // ---- 1. Migrate markdown files ----
  console.log('Scanning for markdown files...');
  const mdFiles = findMarkdownFiles();
  console.log(`Found ${mdFiles.length} markdown files to process.\n`);

  // Pre-scan for redirect_to pages so we can skip them and fold their
  // permalinks into the target page's redirect_from list.
  const { aliasMap, skipPaths } = buildRedirectAliasMap(mdFiles);

  for (const absPath of mdFiles) {
    if (skipPaths.has(absPath)) {
      stats.redirectToPagesSkipped++;
      continue;
    }
    const rel = relative(ROOT, absPath);
    const content = readFileSync(absPath, 'utf-8');

    const { frontmatter } = splitFrontmatter(content);
    const permalink = getPermalinkForLookup(frontmatter);
    const aliases = permalink ? aliasMap.get(permalink) : null;

    const transformed = transformFile(content, aliases, rel);
    const dest = join(DEST_DOCS, rel);
    writeFileSafe(dest, transformed);
    stats.mdFiles++;
  }

  console.log(`Transformed and wrote ${stats.mdFiles} markdown files.\n`);

  // ---- 2. Copy image files from content directories ----
  // Content pages use a mix of absolute refs (`/foo/bar.png` → resolved against
  // `public/`) and relative refs (`imgs/baz.png` → resolved against the page's
  // own folder under `src/content/docs/`). Each image is copied to both
  // locations so either form works after migration.
  console.log('Scanning for image files in content directories...');
  const imageFiles = findImageFiles();
  console.log(`Found ${imageFiles.length} image files.\n`);

  for (const absPath of imageFiles) {
    const rel = relative(ROOT, absPath);
    copyFileSafe(absPath, join(DEST_DOCS, rel));
    copyFileSafe(absPath, join(DEST_PUBLIC, rel));
    stats.imagesCopied++;
  }

  console.log(`Copied ${stats.imagesCopied} image files.\n`);

  // ---- 2b. Copy downloadable assets (A-1: .csv/.zip/.docx/.xlsx/.pdf/.json) ----
  // Same dual copy as images so both absolute (`/foo/bar.csv` → public) and
  // relative (`bar.csv` → page folder) references resolve after migration.
  console.log('Scanning for downloadable asset files in content directories...');
  const downloadFiles = findDownloadFiles();
  console.log(`Found ${downloadFiles.length} downloadable asset files.\n`);

  let downloadsCopied = 0;
  for (const absPath of downloadFiles) {
    const rel = relative(ROOT, absPath);
    copyFileSafe(absPath, join(DEST_DOCS, rel));
    copyFileSafe(absPath, join(DEST_PUBLIC, rel));
    downloadsCopied++;
  }
  console.log(`Copied ${downloadsCopied} downloadable asset files.\n`);

  // ---- 3. Copy special asset files ----
  const logoSrc = join(ROOT, 'assets', 'img', 'logo.png');
  const logoDest = join(DEST_ASSETS, 'logo.png');
  if (existsSync(logoSrc)) {
    copyFileSafe(logoSrc, logoDest);
    console.log(`Copied logo: assets/img/logo.png → src/assets/logo.png`);
  } else {
    console.warn(`WARNING: ${logoSrc} not found — skipping logo copy.`);
  }

  const koleckoSrc = join(ROOT, 'keboola-kolecko.png');
  const koleckoDest = join(DEST_PUBLIC, 'keboola-kolecko.png');
  if (existsSync(koleckoSrc)) {
    copyFileSafe(koleckoSrc, koleckoDest);
    console.log(`Copied: keboola-kolecko.png → public/keboola-kolecko.png`);
  } else {
    console.warn(`WARNING: ${koleckoSrc} not found — skipping.`);
  }

  const faviconSrc = join(ROOT, 'favicon.ico');
  const faviconDest = join(DEST_PUBLIC, 'favicon.ico');
  if (existsSync(faviconSrc)) {
    copyFileSafe(faviconSrc, faviconDest);
    console.log(`Copied: favicon.ico → public/favicon.ico`);
  } else {
    console.warn(`WARNING: ${faviconSrc} not found — skipping.`);
  }

  // ---- 4. Mirror Jekyll's /assets/js/ so pages that reference
  //         `<script src="/assets/js/foo.js">` still work in Astro.
  copyJekyllAssetsJs();

  // ---- 5. Post-migration cleanup ----
  // Remove directories that were moved/renamed in main — their old paths
  // still get regenerated by the migration but must not exist so the
  // redirect-from integration can activate the declared redirect_from aliases.
  for (const rel of POST_MIGRATE_DELETE) {
    const target = join(DEST_DOCS, rel);
    if (existsSync(target)) {
      rmrf(target);
      console.log(`Deleted stale path: ${rel}`);
    }
  }

  // ---- Summary ----
  console.log('\n=== Migration Summary ===');
  console.log(`  Markdown files processed:     ${stats.mdFiles}`);
  console.log(`  Images copied:                ${stats.imagesCopied}`);
  console.log(`  Permalinks → slug:            ${stats.permalinksConverted}`);
  console.log(`  layout: lines removed:        ${stats.layoutsRemoved}`);
  console.log(`  showBreadcrumbs: removed:     ${stats.showBreadcrumbsRemoved}`);
  console.log(`  sitemap → pagefind:           ${stats.sitemapConverted}`);
  console.log(`  TOC markers removed:          ${stats.tocRemoved}`);
  console.log(`  highlight blocks converted:   ${stats.highlightBlocks}`);
  console.log(`  tip includes converted:       ${stats.tipIncludes}`);
  console.log(`  warning includes converted:   ${stats.warningIncludes}`);
  console.log(`  public-beta-warning includes: ${stats.publicBetaIncludes}`);
  console.log(`  private-beta-warning includes:${stats.privateBetaIncludes}`);
  console.log(`  {: .image-popup} removed:     ${stats.imagePopupRemoved}`);
  console.log(`  Kramdown attrs removed:       ${stats.kramdownAttrsRemoved}`);
  console.log(`  raw tags stripped:            ${stats.rawTagsStripped}`);
  console.log(`  comment tags converted:       ${stats.commentTagsConverted}`);
  console.log(`  leading ## Overview removed:  ${stats.overviewHeadingsRemoved}`);
  console.log(`  redirect_to stubs skipped:    ${stats.redirectToPagesSkipped}`);
  console.log(`  redirect_from aliases added:  ${stats.redirectFromAliasesInjected}`);
  console.log(`  telemetry tables expanded:    ${stats.telemetryTablesExpanded}`);
  console.log(`  jekyll assets/js copied:      ${stats.jekyllAssetsCopied}`);
  console.log('\nDone.');
}

main();
