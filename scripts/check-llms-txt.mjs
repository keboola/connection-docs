#!/usr/bin/env node
// Smoke check for the llms.txt AI layer (PRDCT-383).
// Runs as `postbuild` (after `astro build`) and in CI. Asserts the generated
// artifacts exist, the entrypoint lists the named sets, the small-variant
// exclude holds, and the Snowflake description is intact. Exits non-zero on any
// failure so a broken AI layer fails the build instead of shipping silently.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');
const src = join(process.cwd(), 'src');

const failures = [];
const ok = (msg) => console.log(`  ✓ ${msg}`);
const fail = (msg) => {
  failures.push(msg);
  console.error(`  ✗ ${msg}`);
};

const read = (path) => (existsSync(path) ? readFileSync(path, 'utf8') : null);

// 1. The four artifacts exist and are non-empty.
const artifacts = {
  'llms.txt': join(dist, 'llms.txt'),
  'llms-full.txt': join(dist, 'llms-full.txt'),
  'llms-small.txt': join(dist, 'llms-small.txt'),
  'Transformations set': join(dist, '_llms-txt', 'transformations.txt'),
};
const content = {};
for (const [name, path] of Object.entries(artifacts)) {
  const body = read(path);
  content[name] = body;
  if (body === null) fail(`${name} is missing (${path})`);
  else if (body.trim().length === 0) fail(`${name} is empty`);
  else ok(`${name} exists and is non-empty (${body.length} bytes)`);
}

// 2. llms.txt lists the named sets.
const entry = content['llms.txt'] ?? '';
for (const marker of ['llms-small.txt', 'llms-full.txt', 'transformations.txt']) {
  if (entry.includes(marker)) ok(`llms.txt links the ${marker} set`);
  else fail(`llms.txt does not link ${marker}`);
}

// 3. The exclude holds: the Bing Ads report-presets reference is in the full
//    variant but stripped from the small variant.
const MARKER = 'AccountPerformance Report Presets';
const full = content['llms-full.txt'] ?? '';
const small = content['llms-small.txt'] ?? '';
if (full.includes(MARKER)) ok('report-presets page present in llms-full.txt');
else fail('report-presets page missing from llms-full.txt (should be included)');
if (!small.includes(MARKER)) ok('report-presets page excluded from llms-small.txt');
else fail('report-presets page leaked into llms-small.txt (exclude broken)');

// 4. The Snowflake description is intact (no garble from the em-dash edit).
const snowflake = read(
  join(src, 'content', 'docs', 'transformations', 'snowflake-plain', 'index.md'),
);
if (snowflake === null) {
  fail('snowflake-plain/index.md is missing');
} else {
  const desc = (snowflake.match(/^description:\s*(.+)$/m) || [])[1] ?? '';
  if (/query and syntax limits/.test(desc) && /Snowflake backend/.test(desc)) {
    ok('snowflake description is intact');
  } else {
    fail(`snowflake description looks garbled: ${desc}`);
  }
}

if (failures.length) {
  console.error(`\nllms.txt smoke check FAILED (${failures.length} issue(s)).`);
  process.exit(1);
}
console.log('\nllms.txt smoke check passed.');
