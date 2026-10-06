import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { gunzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

/**
 * Astro integration that writes dist/pagefind-titles.json: one
 * [resultId, title, url] row per page in the Pagefind index.
 *
 * public/pagefind-rerank.js reads it to move title matches to the top of the
 * search results without downloading a fragment per result. The ids are
 * Pagefind's own fragment names, so they match `result.id` at search time.
 *
 * Runs in `astro:build:done` and has to come after starlight() in the
 * integrations list: Starlight builds the Pagefind index in the same hook, and
 * Astro runs the hooks in list order.
 */
export default function pagefindTitles() {
  return {
    name: 'pagefind-titles',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const fragmentDir = join(outDir, 'pagefind', 'fragment');
        if (!existsSync(fragmentDir)) {
          logger.warn('no Pagefind index found, skipping pagefind-titles.json');
          return;
        }
        const rows = [];
        for (const file of readdirSync(fragmentDir)) {
          if (!file.endsWith('.pf_fragment')) continue;
          // Fragments are gzipped JSON behind a "pagefind_dcd" signature.
          const raw = gunzipSync(readFileSync(join(fragmentDir, file))).toString('utf8');
          const fragment = JSON.parse(raw.slice(raw.indexOf('{')));
          rows.push([file.replace(/\.pf_fragment$/, ''), fragment.meta?.title ?? '', fragment.url]);
        }
        writeFileSync(join(outDir, 'pagefind-titles.json'), JSON.stringify(rows));
        logger.info(`wrote pagefind-titles.json (${rows.length} pages)`);
      },
    },
  };
}
