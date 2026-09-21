/**
 * unshallow.mjs — deepen a shallow git clone before the build, so Starlight's
 * `lastUpdated` can read each page's last commit.
 *
 * Starlight takes a page's "Updated <date>" from the last commit that touched
 * its file. Under a shallow clone that lookup throws, Starlight catches it and
 * returns undefined, and the line renders on no page at all — which is exactly
 * what happened when `lastUpdated` was first switched on (PR #1132): Vercel
 * clones shallow and Vercel has no documented clone-depth setting.
 *
 * This runs from the `prebuild` npm script rather than a `buildCommand` in
 * vercel.json on purpose: `npm run build` is what every environment already
 * runs, so one mechanism covers Vercel, GitHub Actions and a local build, and
 * nothing overrides the build command configured in the Vercel project.
 *
 * It must never fail a build. A missing .git, no network, or a credential the
 * build step cannot use are all survivable: the site builds fine, the Updated
 * line just does not render, which is the behaviour we had before.
 */

import { execFileSync } from 'node:child_process';

function git(args, { capture = false } = {}) {
  return execFileSync('git', args, {
    stdio: capture ? ['ignore', 'pipe', 'pipe'] : ['ignore', 'inherit', 'inherit'],
    encoding: 'utf8',
  });
}

try {
  // No repository (e.g. a source tarball) — nothing to deepen.
  git(['rev-parse', '--git-dir'], { capture: true });

  const shallow = git(['rev-parse', '--is-shallow-repository'], { capture: true }).trim();
  if (shallow !== 'true') {
    console.log('[unshallow] clone already has full history — nothing to do');
  } else {
    console.log('[unshallow] shallow clone detected, fetching full history for lastUpdated…');
    git(['fetch', '--unshallow', '--quiet']);
    console.log('[unshallow] done');
  }
} catch (err) {
  // Deliberately non-fatal: see the header. Log loudly enough to be findable
  // in a build log when dates are missing, then let the build continue.
  const reason = (err?.stderr || err?.message || String(err)).toString().trim().split('\n')[0];
  console.warn(`[unshallow] could not deepen the clone (${reason}) — "Updated" dates will not render`);
}
