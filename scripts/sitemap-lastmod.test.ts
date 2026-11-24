// Tests for src/integrations/sitemap-lastmod.mjs: the sitemap's <lastmod> comes
// from each page's frontmatter `lastUpdated`. Run: npm test

import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { pageDates, sitemapOptions } from '../src/integrations/sitemap-lastmod.mjs';

test('slug and date come from the frontmatter, quoted or not', () => {
  assert.deepEqual(pageDates("---\ntitle: S\nlastUpdated: 2026-08-04\nslug: 'storage'\n---\nBody"), { slug: 'storage', date: '2026-08-04' });
  assert.deepEqual(pageDates('---\nslug: "a/b"\nlastUpdated: "2024-01-02"\n---\n'), { slug: 'a/b', date: '2024-01-02' });
  assert.deepEqual(pageDates("---\nslug: ''\nlastUpdated: 2025-05-05\n---\n"), { slug: '', date: '2025-05-05' });
});

test('a page without a usable date gives none', () => {
  assert.equal(pageDates("---\nslug: 'x'\n---\n"), null);
  assert.equal(pageDates("---\nslug: 'x'\nlastUpdated: true\n---\n"), null);
  assert.equal(pageDates('no frontmatter'), null);
  // a lastUpdated line in the body is not frontmatter
  assert.equal(pageDates("---\nslug: 'x'\n---\nlastUpdated: 2026-01-01\n"), null);
});

test('serialize stamps dated URLs and leaves the rest alone', () => {
  const dir = mkdtempSync(join(tmpdir(), 'sitemap-'));
  mkdirSync(join(dir, 'storage'));
  writeFileSync(join(dir, 'index.mdx'), "---\nslug: ''\nlastUpdated: 2026-01-01\n---\n");
  writeFileSync(join(dir, 'storage', 'index.md'), "---\nslug: 'storage'\nlastUpdated: 2026-08-04\n---\n");
  writeFileSync(join(dir, 'storage', 'undated.md'), "---\nslug: 'storage/undated'\n---\n");
  const { serialize } = sitemapOptions({ contentDir: dir, site: 'https://help.keboola.com' });
  assert.deepEqual(serialize({ url: 'https://help.keboola.com/' }), { url: 'https://help.keboola.com/', lastmod: '2026-01-01' });
  assert.deepEqual(serialize({ url: 'https://help.keboola.com/storage/' }), { url: 'https://help.keboola.com/storage/', lastmod: '2026-08-04' });
  assert.deepEqual(serialize({ url: 'https://help.keboola.com/storage/undated/' }), { url: 'https://help.keboola.com/storage/undated/' });
});
