import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Astro integration that generates redirect pages from `redirect_from` frontmatter.
 *
 * For each content file that has a `redirect_from` array in its frontmatter,
 * this integration generates a static HTML redirect page at each listed path.
 * The redirect page uses a <meta http-equiv="refresh"> tag to redirect to the
 * page's actual URL (derived from its `slug` frontmatter field).
 *
 * Runs in the `astro:build:done` hook, after all pages have been built,
 * so it will not overwrite any real pages that already exist.
 */

/**
 * Recursively find all .md files in a directory.
 */
function findMarkdownFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      findMarkdownFiles(full, files);
    } else if (extname(full) === '.md') {
      files.push(full);
    }
  }
  return files;
}

/**
 * Parse YAML frontmatter from a markdown file's content.
 * Extracts only the fields we need: slug and redirect_from.
 * Handles both compact YAML arrays and block-style arrays.
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const yaml = match[1];
  const fm = {};
  let currentKey = null;

  for (const line of yaml.split('\n')) {
    const trimmed = line.replace(/\r$/, '');

    // Array item: "  - value"
    const arrayItem = trimmed.match(/^\s+-\s+(.+)/);
    if (arrayItem && currentKey) {
      if (!Array.isArray(fm[currentKey])) {
        fm[currentKey] = [];
      }
      fm[currentKey].push(arrayItem[1].trim().replace(/^['"]|['"]$/g, ''));
      continue;
    }

    // Key-value pair: "key: value" or "key:"
    const keyVal = trimmed.match(/^([\w][\w_-]*):\s*(.*)/);
    if (keyVal) {
      currentKey = keyVal[1];
      const val = keyVal[2].trim();
      if (val) {
        fm[currentKey] = val.replace(/^['"]|['"]$/g, '');
      }
    }
  }

  return fm;
}

/**
 * Escape special HTML characters in a string to prevent injection.
 */
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Generate the HTML content for a redirect page.
 */
function redirectHtml(targetUrl) {
  const safeUrl = escapeHtml(targetUrl);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0;url=${safeUrl}">
<link rel="canonical" href="https://help.keboola.com${safeUrl}">
<title>Redirecting...</title>
</head>
<body>
<p>Redirecting to <a href="${safeUrl}">${safeUrl}</a></p>
</body>
</html>
`;
}

/**
 * Normalize a URL path to ensure it has a leading and trailing slash.
 */
function normalizePath(p) {
  let s = p.trim();
  if (!s.startsWith('/')) s = '/' + s;
  if (!s.endsWith('/')) s = s + '/';
  return s;
}

export default function redirectFrom() {
  return {
    name: 'redirect-from',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);

        // Resolve src/content/docs relative to this integration file.
        // This file lives at src/integrations/redirect-from.mjs, so
        // content/docs is at ../content/docs relative to this file.
        const thisDir = fileURLToPath(new URL('.', import.meta.url));
        const contentDir = join(thisDir, '..', 'content', 'docs');

        if (!existsSync(contentDir)) {
          logger.warn(`Content directory not found: ${contentDir}`);
          return;
        }

        const mdFiles = findMarkdownFiles(contentDir);
        let redirectCount = 0;
        let skippedCount = 0;

        for (const file of mdFiles) {
          const content = readFileSync(file, 'utf-8');
          const fm = parseFrontmatter(content);

          // Collect redirect paths
          let redirectPaths = [];
          if (Array.isArray(fm.redirect_from)) {
            redirectPaths = fm.redirect_from;
          } else if (typeof fm.redirect_from === 'string') {
            redirectPaths = [fm.redirect_from];
          }

          if (redirectPaths.length === 0) continue;

          // Determine target URL from the slug field
          if (!fm.slug) {
            logger.warn(`File has redirect_from but no slug: ${file}`);
            continue;
          }

          const targetUrl = normalizePath(fm.slug);

          for (const redirectPath of redirectPaths) {
            const cleanPath = redirectPath.replace(/^\//, '').replace(/\/$/, '');
            if (!cleanPath) continue;

            const htmlDir = join(outDir, cleanPath);
            const htmlFile = join(htmlDir, 'index.html');

            // Don't overwrite existing pages
            if (existsSync(htmlFile)) {
              logger.info(`Skipping redirect ${redirectPath} -> ${targetUrl} (page already exists)`);
              skippedCount++;
              continue;
            }

            mkdirSync(htmlDir, { recursive: true });
            writeFileSync(htmlFile, redirectHtml(targetUrl));
            redirectCount++;
          }
        }

        logger.info(`Generated ${redirectCount} redirect pages (${skippedCount} skipped, page already exists)`);
      },
    },
  };
}
