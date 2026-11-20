// Tests for src/integrations/image-dimensions.mjs. Run: npm test

import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import imageDimensions, { readDimensions, sizeImages } from '../src/integrations/image-dimensions.mjs';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'imgdims-'));
after(() => fs.rmSync(dir, { recursive: true, force: true }));
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

const gifBytes = (w: number, h: number) => {
  const b = Buffer.alloc(10);
  b.write('GIF89a', 0, 'latin1');
  b.writeUInt16LE(w, 6);
  b.writeUInt16LE(h, 8);
  return b;
};
// RIFF container with one WebP chunk; the parser needs 30 bytes.
const webpBytes = (chunk: string, fill: (b: Buffer) => void) => {
  const b = Buffer.alloc(30);
  b.write('RIFF', 0, 'latin1');
  b.writeUInt32LE(22, 4);
  b.write('WEBP', 8, 'latin1');
  b.write(chunk, 12, 'latin1');
  b.writeUInt32LE(10, 16);
  fill(b);
  return b;
};

test('reads a GIF', () => {
  assert.deepEqual(readDimensions(write('a.gif', gifBytes(320, 240))), { width: 320, height: 240 });
});

test('reads a lossy WebP (VP8)', () => {
  const b = webpBytes('VP8 ', (b) => {
    b.writeUInt8(0x9d, 23);
    b.writeUInt8(0x01, 24);
    b.writeUInt8(0x2a, 25);
    b.writeUInt16LE(1024, 26);
    b.writeUInt16LE(768, 28);
  });
  assert.deepEqual(readDimensions(write('lossy.webp', b)), { width: 1024, height: 768 });
});

test('reads a lossless WebP (VP8L)', () => {
  // 14 bits of width-1, then 14 bits of height-1.
  const b = webpBytes('VP8L', (b) => {
    b.writeUInt8(0x2f, 20);
    b.writeUInt32LE((1000 - 1) | ((600 - 1) << 14), 21);
  });
  assert.deepEqual(readDimensions(write('lossless.webp', b)), { width: 1000, height: 600 });
});

test('reads an extended WebP (VP8X)', () => {
  const b = webpBytes('VP8X', (b) => {
    b.writeUIntLE(4000 - 1, 24, 3);
    b.writeUIntLE(3000 - 1, 27, 3);
  });
  assert.deepEqual(readDimensions(write('extended.webp', b)), { width: 4000, height: 3000 });
});

test('reads a JPEG whose frame header sits past the first 64 KB', () => {
  // Two 40 KB APP1 segments push SOF0 past the header window, forcing the full re-read.
  const app1 = Buffer.alloc(40002);
  app1.writeUInt16BE(0xffe1, 0);
  app1.writeUInt16BE(40000, 2);
  const file = write('late-sof.jpg', Buffer.concat([Buffer.from([0xff, 0xd8]), app1, app1, jpegBytes(2048, 1536).subarray(2)]));
  assert.ok(fs.statSync(file).size > 65536);
  assert.deepEqual(readDimensions(file), { width: 2048, height: 1536 });
});

test('SVG: px and unitless sizes are read', () => {
  assert.deepEqual(readDimensions(write('px.svg', '<svg xmlns="http://www.w3.org/2000/svg" width="120px" height="80">')), { width: 120, height: 80 });
});

test('SVG: width="100%" falls back to the viewBox', () => {
  assert.deepEqual(
    readDimensions(write('pct.svg', '<svg width="100%" height="100%" viewBox="0 0 800 400">')),
    { width: 800, height: 400 },
  );
});

test('SVG: stroke-width is not the width', () => {
  assert.deepEqual(
    readDimensions(write('stroke.svg', '<svg stroke-width="2" viewBox="0 0 800 400" height="400">')),
    { width: 800, height: 400 },
  );
});

test('SVG: em units fall back to the viewBox', () => {
  assert.deepEqual(
    readDimensions(write('em.svg', '<?xml version="1.0"?>\n<svg width="20em" height="10em" viewBox="0 0 640 320">')),
    { width: 640, height: 320 },
  );
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

test('a missing image warns locally and fails the build in CI', async () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'imgdims-dist-'));
  fs.mkdirSync(path.join(out, 'a'));
  fs.writeFileSync(path.join(out, 'a', 'index.html'), '<p><img src="/nope.png" alt="x"></p>');
  const warnings: string[] = [];
  const logger = { warn: (s: string) => warnings.push(s), info: () => {} };
  const run = () => imageDimensions().hooks['astro:build:done']({ dir: pathToFileURL(out + '/'), logger } as any);
  const ci = process.env.CI;
  try {
    delete process.env.CI;
    await run();
    assert.deepEqual(warnings, ['missing image /a/ → /nope.png']);
    process.env.CI = 'true';
    await assert.rejects(run, /1 image\(s\) referenced but not in the build/);
  } finally {
    if (ci === undefined) delete process.env.CI;
    else process.env.CI = ci;
    fs.rmSync(out, { recursive: true, force: true });
  }
});

test('a > inside a quoted attribute does not end the tag', () => {
  write('docs/page/menu.png', pngBytes(40, 30));
  const res = sizeImages('<img alt="Settings > Users" src="/docs/page/menu.png">', '/docs/page/', dir);
  assert.equal(res.html, '<img alt="Settings > Users" src="/docs/page/menu.png" width="40" height="30">');
});

test('reports a missing image', () => {
  const res = sizeImages('<img src="/nope.png" alt="x">', '/', dir);
  assert.deepEqual(res.missing, ['/nope.png']);
  assert.equal(res.sized, 0);
});

test('reports a missing image even when the author set its width', () => {
  const res = sizeImages('<img src="/nope.png" width="45%" alt="x">', '/', dir);
  assert.deepEqual(res.missing, ['/nope.png']);
  assert.equal(res.sized, 0);
});
