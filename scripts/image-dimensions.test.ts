// Tests for src/integrations/image-dimensions.mjs. Run: npm test

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readDimensions, sizeImages } from '../src/integrations/image-dimensions.mjs';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'imgdims-'));
const write = (name: string, data: Buffer | string) => {
  const file = path.join(dir, name);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, data);
  return file;
};

// Smallest headers each parser accepts.
const pngBytes = (w: number, h: number) => {
  const b = Buffer.alloc(24);
  b.writeUInt32BE(0x89504e47, 0);
  b.writeUInt32BE(0x0d0a1a0a, 4);
  b.write('IHDR', 12, 'latin1');
  b.writeUInt32BE(w, 16);
  b.writeUInt32BE(h, 20);
  return b;
};
const jpegBytes = (w: number, h: number) =>
  Buffer.from([0xff, 0xd8, 0xff, 0xc0, 0x00, 0x11, 0x08, h >> 8, h & 0xff, w >> 8, w & 0xff, 0x03, 0, 0, 0, 0]);

test('reads a PNG', () => {
  assert.deepEqual(readDimensions(write('a.png', pngBytes(640, 480))), { width: 640, height: 480 });
});

test('reads a JPEG saved with a .png extension', () => {
  assert.deepEqual(readDimensions(write('mislabeled.png', jpegBytes(1200, 1600))), { width: 1200, height: 1600 });
});

test('returns null for a file that is no image at all', () => {
  assert.equal(readDimensions(write('notes.png', 'just text')), null);
});

test('sizes a root-relative and a page-relative <img>, skips /_astro/ and author sizes', () => {
  write('docs/page/shot.png', pngBytes(300, 200));
  write('docs/page/local.png', pngBytes(10, 20));
  const html = [
    '<img src="/docs/page/shot.png" alt="a">',
    '<img src="./local.png" alt="b" />',
    '<img src="/_astro/x.webp" alt="c">',
    '<img src="/docs/page/shot.png" width="45%" alt="d">',
    '<img src="https://example.com/e.png" alt="e">',
  ].join('\n');
  const res = sizeImages(html, '/docs/page/', dir);
  assert.equal(res.sized, 2);
  assert.match(res.html, /<img src="\/docs\/page\/shot\.png" alt="a" width="300" height="200">/);
  assert.match(res.html, /<img src="\.\/local\.png" alt="b" width="10" height="20"\/>/);
  assert.match(res.html, /<img src="\/_astro\/x\.webp" alt="c">/);
  assert.match(res.html, /width="45%" alt="d">/);
  assert.deepEqual(res.missing, []);
});

test('reports a missing image', () => {
  const res = sizeImages('<img src="/nope.png" alt="x">', '/', dir);
  assert.deepEqual(res.missing, ['/nope.png']);
  assert.equal(res.sized, 0);
});
