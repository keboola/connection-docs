/**
 * image-dimensions.mjs: an Astro integration that stamps intrinsic width/height
 * onto every <img> in the built HTML whose file is served from `public/`.
 *
 * Why this exists: Astro sizes the images it processes itself (they come out as
 * `/_astro/…` with width and height), but it never touches `public/`, so it
 * cannot know the intrinsic size of an image referenced the way AGENTS.md
 * prescribes, `![Alt](/section/page/image.png)`. Those ship as a bare
 * `<img src alt>`, and the browser has no aspect ratio to reserve space with
 * until the bytes arrive.
 *
 * Starlight already ships `max-width: 100%; height: auto` for content images,
 * which is the pairing that makes intrinsic attributes correct: the browser
 * derives the ratio from width/height, `max-width` caps the displayed size and
 * `height: auto` keeps the proportion.
 *
 * It runs in `astro:build:done` over every built `.html` page rather than as a remark
 * plugin, so it sees every image the reader gets (markdown images, figures that
 * beacon-transforms writes as raw HTML, hand-written <img> tags) and always
 * reads the files that shipped: Astro's content cache can't serve stale sizes
 * after a screenshot is replaced under the same name. It doesn't run in
 * `astro dev`, which is fine for a layout-shift fix.
 *
 * Dimensions are read straight from the file header, no decode and no new
 * dependency.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Enough for every header we parse; JPEG re-reads in full if SOF sits later. */
const HEADER_BYTES = 65536;

/**
 * Resolved path → {width, height} | null (null = parsed and unusable). Cleared
 * at the start of every build, so a replaced screenshot is always re-read.
 */
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
  // Only a plain number or px counts. The name must start the attribute, so
  // stroke-width doesn't match, and %, em and friends fall through to the viewBox:
  // width="100%" sets no intrinsic size.
  const attr = (name) => {
    const m = tag[0].match(new RegExp(`\\s${name}\\s*=\\s*(["']?)\\s*([\\d.]+)\\s*(?:px)?\\s*\\1(?=[\\s/>])`, 'i'));
    return m ? Number.parseFloat(m[2]) : null;
  };
  const w = attr('width');
  const h = attr('height');
  if (w && h) return { width: Math.round(w), height: Math.round(h) };
  // No usable width/height: fall back to the viewBox's own aspect ratio.
  const vb = tag[0].match(/\bviewBox\s*=\s*["']\s*[\d.-]+[\s,]+[\d.-]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  if (vb) return { width: Math.round(Number.parseFloat(vb[1])), height: Math.round(Number.parseFloat(vb[2])) };
  return null;
}

/**
 * Picks the parser from the file's first bytes, not its extension: some files
 * in public/ are JPEGs named `.png`, and trusting the name would skip them.
 */
function sniff(b) {
  if (b.length >= 4 && b.readUInt32BE(0) === 0x89504e47) return png;
  if (b.length >= 2 && b.readUInt16BE(0) === 0xffd8) return jpeg;
  if (b.length >= 4 && b.toString('latin1', 0, 4) === 'GIF8') return gif;
  if (b.length >= 12 && b.toString('latin1', 0, 4) === 'RIFF' && b.toString('latin1', 8, 12) === 'WEBP') return webp;
  if (/^\s*(?:﻿)?\s*<(?:\?xml|svg|!--|!DOCTYPE)/i.test(b.toString('utf8', 0, Math.min(b.length, 256)))) return svg;
  return null;
}

/** Reads intrinsic size from `file`, or null if the format/file is unusable. */
export function readDimensions(file) {
  if (cache.has(file)) return cache.get(file);
  let out = null;
  try {
    const head = readHead(file, HEADER_BYTES);
    const parse = sniff(head);
    if (parse) {
      out = parse(head);
      // A JPEG's frame header can sit past our window; that is the only format
      // where re-reading in full is worth it.
      if (!out && parse === jpeg) out = jpeg(fs.readFileSync(file));
    }
  } catch {
    out = null; // unreadable or malformed; the build warns about it
  }
  if (out && (!Number.isFinite(out.width) || !Number.isFinite(out.height) || out.width <= 0 || out.height <= 0)) {
    out = null;
  }
  cache.set(file, out);
  return out;
}

/** Every `.html` file under `dir`. The `index.md` twins are left alone. */
function htmlFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...htmlFiles(full));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

/** The value of `name` on an <img> tag, or null. */
function attr(tag, name) {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return m ? (m[1] ?? m[2] ?? m[3]) : null;
}

/**
 * Resolves an <img src> to a file in the build output, or null when it is not
 * ours to size (external, data URI, or produced by Astro's own pipeline).
 * Relative sources resolve against the page's URL, the way the browser does.
 */
function resolveSrc(src, pageUrl, outDir) {
  if (!src) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(src) || src.startsWith('//')) return null; // http:, data:, …
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(src, `https://x${pageUrl}`).pathname);
  } catch {
    return null;
  }
  if (pathname.startsWith('/_astro/')) return null; // already sized by Astro
  return path.join(outDir, pathname);
}

/** Sizes the images on one built page. Returns the new HTML and what it saw. */
export function sizeImages(html, pageUrl, outDir) {
  let sized = 0;
  const missing = [];
  const unsized = [];
  // Quoted values are matched whole: a '>' inside alt="Settings > Users" is not
  // the end of the tag (the HTML serializer leaves '>' unescaped in attributes).
  const out = html.replace(/<img\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi, (tag) => {
    const src = attr(tag, 'src');
    const file = resolveSrc(src, pageUrl, outDir);
    if (!file) return tag;
    // Checked before the author-size skip, so a sized <img> with a mistyped path
    // still fails CI.
    if (!fs.existsSync(file)) {
      missing.push(src);
      return tag;
    }
    // An author-set width or height (like width="45%") is a layout choice; leave it.
    if (attr(tag, 'width') != null || attr(tag, 'height') != null) return tag;
    const size = readDimensions(file);
    if (!size) {
      unsized.push(src);
      return tag;
    }
    sized += 1;
    return tag.replace(/\s*(\/?)>$/, ` width="${size.width}" height="${size.height}"$1>`);
  });
  return { html: out, sized, missing, unsized };
}

/** The URL a built file is served at: `kai/settings/index.html` → `/kai/settings/`. */
function pageUrlFor(file, outDir) {
  const rel = path.relative(outDir, file).split(path.sep).join('/');
  return '/' + rel.replace(/(^|\/)index\.html$/, '$1');
}

export default function imageDimensions() {
  return {
    name: 'image-dimensions',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        cache.clear();
        let sized = 0;
        let pages = 0;
        const missing = [];
        const unsized = [];
        for (const file of htmlFiles(outDir)) {
          const html = fs.readFileSync(file, 'utf8');
          if (!/<img\b/i.test(html)) continue;
          const pageUrl = pageUrlFor(file, outDir);
          const res = sizeImages(html, pageUrl, outDir);
          for (const src of res.missing) missing.push(`${pageUrl} → ${src}`);
          for (const src of res.unsized) unsized.push(`${pageUrl} → ${src}`);
          if (res.sized) {
            fs.writeFileSync(file, res.html);
            sized += res.sized;
            pages += 1;
          }
        }
        for (const m of missing) logger.warn(`missing image ${m}`);
        for (const u of unsized) logger.warn(`could not read the size of ${u}`);
        logger.info(`Sized ${sized} images on ${pages} pages`);
        // A missing image fails the build in CI (GitHub Actions and Vercel both
        // set CI), so a mistyped public/ path can't ship. Locally it only warns,
        // so a page can be edited before its screenshot lands.
        if (missing.length && process.env.CI) {
          throw new Error(`[image-dimensions] ${missing.length} image(s) referenced but not in the build; see the warnings above`);
        }
      },
    },
  };
}
