/**
 * image-dimensions.mjs — remark plugin that stamps intrinsic width/height onto
 * markdown images served from `public/`.
 *
 * Why this exists: Astro sizes the images it processes itself (they come out as
 * `/_astro/…` with width and height), but it never touches `public/`, so it
 * cannot know the intrinsic size of an image referenced the way AGENTS.md
 * prescribes — `![Alt](/section/page/image.png)`. Those ship as a bare
 * `<img src alt>`, and the browser has no aspect ratio to reserve space with
 * until the bytes arrive.
 *
 * Starlight already ships `max-width: 100%; height: auto` for content images,
 * which is exactly the pairing that makes intrinsic attributes correct: the
 * browser derives the ratio from width/height, `max-width` caps the displayed
 * size and `height: auto` keeps the proportion. So this adds the attributes and
 * changes nothing about how images render.
 *
 * Dimensions are read straight from the file header — no decode, no new
 * dependency, and synchronous, so the remark pipeline stays synchronous like
 * every other plugin here. Results are cached per build, since the same
 * screenshot is often referenced from several pages.
 *
 * This must run BEFORE beacon-transforms: `transformFigureCaptions` replaces
 * image nodes with hand-built raw HTML, and reads the dimensions this plugin
 * attaches.
 */

import fs from 'node:fs';
import path from 'node:path';
import { visit } from 'unist-util-visit';

/** Enough for every header we parse; JPEG re-reads in full if SOF sits later. */
const HEADER_BYTES = 65536;

/** Resolved path → {width, height} | null (null = parsed and unusable). */
const cache = new Map();

function readHead(file, bytes) {
  let fd;
  try {
    fd = fs.openSync(file, 'r');
    const size = fs.fstatSync(fd).size;
    const buf = Buffer.alloc(Math.min(size, bytes));
    fs.readSync(fd, buf, 0, buf.length, 0);
    return buf;
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
  }
}

function png(b) {
  // 8-byte signature, then the IHDR chunk: length(4) type(4) width(4) height(4).
  if (b.length < 24) return null;
  if (b.readUInt32BE(0) !== 0x89504e47 || b.readUInt32BE(4) !== 0x0d0a1a0a) return null;
  if (b.toString('latin1', 12, 16) !== 'IHDR') return null;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function gif(b) {
  if (b.length < 10) return null;
  const sig = b.toString('latin1', 0, 6);
  if (sig !== 'GIF87a' && sig !== 'GIF89a') return null;
  return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
}

/** Frame markers that carry the dimensions; C4/C8/CC are tables, not frames. */
const JPEG_SOF = new Set([
  0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
]);

function jpeg(b) {
  if (b.length < 4 || b.readUInt16BE(0) !== 0xffd8) return null;
  let i = 2;
  while (i + 3 < b.length) {
    if (b[i] !== 0xff) {
      i += 1; // resync past padding
      continue;
    }
    const marker = b[i + 1];
    // Standalone markers carry no length field.
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2;
      continue;
    }
    if (marker === 0xd9 || marker === 0xda) return null; // EOI / start of scan
    const len = b.readUInt16BE(i + 2);
    if (len < 2) return null;
    if (JPEG_SOF.has(marker)) {
      if (i + 9 > b.length) return null;
      return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  return null;
}

function webp(b) {
  if (b.length < 30) return null;
  if (b.toString('latin1', 0, 4) !== 'RIFF' || b.toString('latin1', 8, 12) !== 'WEBP') return null;
  const chunk = b.toString('latin1', 12, 16);
  if (chunk === 'VP8 ') {
    // Lossy: 3-byte frame tag, 3-byte sync code, then 14-bit dimensions.
    if (b.readUInt8(23) !== 0x9d || b.readUInt8(24) !== 0x01 || b.readUInt8(25) !== 0x2a) return null;
    return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === 'VP8L') {
    // Lossless: signature byte, then two 14-bit values packed across 4 bytes.
    if (b.readUInt8(20) !== 0x2f) return null;
    const bits = b.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (chunk === 'VP8X') {
    // Extended: canvas size as two 24-bit little-endian values, minus one.
    const w = b.readUIntLE(24, 3) + 1;
    const h = b.readUIntLE(27, 3) + 1;
    return { width: w, height: h };
  }
  return null;
}

function svg(b) {
  const head = b.toString('utf8', 0, Math.min(b.length, 8192));
  const tag = head.match(/<svg\b[^>]*>/i);
  if (!tag) return null;
  const attr = (name) => {
    const m = tag[0].match(new RegExp(`\\b${name}\\s*=\\s*["']?\\s*([\\d.]+)\\s*(px)?\\s*["']?`, 'i'));
    return m ? Number.parseFloat(m[1]) : null;
  };
  const w = attr('width');
  const h = attr('height');
  if (w && h) return { width: Math.round(w), height: Math.round(h) };
  // No usable width/height: fall back to the viewBox's own aspect ratio.
  const vb = tag[0].match(/\bviewBox\s*=\s*["']\s*[\d.-]+[\s,]+[\d.-]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  if (vb) return { width: Math.round(Number.parseFloat(vb[1])), height: Math.round(Number.parseFloat(vb[2])) };
  return null;
}

const PARSERS = { '.png': png, '.gif': gif, '.jpg': jpeg, '.jpeg': jpeg, '.webp': webp, '.svg': svg };

/** Reads intrinsic size from `file`, or null if the format/file is unusable. */
export function readDimensions(file) {
  if (cache.has(file)) return cache.get(file);
  let out = null;
  try {
    const ext = path.extname(file).toLowerCase();
    const parse = PARSERS[ext];
    if (parse) {
      out = parse(readHead(file, HEADER_BYTES));
      // A JPEG's frame header can sit past our window; that is the only format
      // where re-reading in full is worth it.
      if (!out && (ext === '.jpg' || ext === '.jpeg')) out = jpeg(fs.readFileSync(file));
    }
  } catch {
    out = null; // unreadable or malformed — caller warns
  }
  if (out && (!Number.isFinite(out.width) || !Number.isFinite(out.height) || out.width <= 0 || out.height <= 0)) {
    out = null;
  }
  cache.set(file, out);
  return out;
}

/**
 * Resolves an image URL to a file on disk, or null when it is not ours to size
 * (external, data URI, or produced by Astro's own pipeline).
 */
function resolveImage(url, { publicDir, pageDir }) {
  if (!url) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('//')) return null; // http:, data:, …
  const clean = url.split('#')[0].split('?')[0];
  if (!clean) return null;
  let decoded;
  try {
    decoded = decodeURIComponent(clean);
  } catch {
    decoded = clean;
  }
  if (decoded.startsWith('/_astro/')) return null; // already sized by Astro
  if (decoded.startsWith('/')) return path.join(publicDir, decoded);
  // A relative URL resolves against the page's own URL, which mirrors its
  // directory under public/ for anything not picked up by Astro's pipeline.
  return pageDir ? path.join(publicDir, pageDir, decoded) : null;
}

/**
 * @param {object} [options]
 * @param {string} [options.publicDir]  absolute path to the public/ directory
 * @param {string} [options.contentDir] absolute path to src/content/docs
 */
export default function imageDimensions({ publicDir, contentDir } = {}) {
  const PUBLIC = publicDir ?? path.resolve('public');
  const CONTENT = contentDir ?? path.resolve('src/content/docs');

  return (tree, file) => {
    // The page's directory relative to the docs root, used to resolve the
    // handful of images written as relative URLs.
    let pageDir = null;
    if (file?.path) {
      const rel = path.relative(CONTENT, file.path);
      if (rel && !rel.startsWith('..')) pageDir = path.dirname(rel);
    }

    visit(tree, 'image', (node) => {
      const existing = node.data?.hProperties;
      if (existing && existing.width != null && existing.height != null) return;

      const resolved = resolveImage(node.url, { publicDir: PUBLIC, pageDir });
      if (!resolved) return;

      if (!fs.existsSync(resolved)) {
        // Not fatal: audit-phase2.mjs is what fails on a genuinely missing
        // image, and a hard error here would block editing a page whose
        // screenshot has not landed yet.
        console.warn(`[image-dimensions] missing image ${node.url} (referenced by ${file?.path ?? 'unknown page'})`);
        return;
      }

      const size = readDimensions(resolved);
      if (!size) return; // unsupported format or unreadable header

      node.data = node.data ?? {};
      node.data.hProperties = { ...node.data.hProperties, width: size.width, height: size.height };
    });
  };
}
