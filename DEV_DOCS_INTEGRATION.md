# Developer Docs → Connection Docs: Integration One-Pager

**For:** Jordan · **From:** Nikita · **Date:** 2026-06-09
**TL;DR:** Bring `developers.keboola.com` into the new Astro Starlight site as one
unified docs property — one search, one nav, one design — but treat it as a
*second migration* (port faithfully first, rewrite later), exactly like the
Jekyll→Astro move we just did.

---

## Why now / why it's worth doing

- **You want one roof.** You've said you don't see why developer docs live
  separately, and unifying removes a real seam for users.
- **The content already leans on it.** The Phase 2 audit found the connection
  docs link out to `developers.keboola.com` in many in-content places (part of
  finding **A-3**), plus at least one *internal* link to a developer-only path
  (`/integrate/storage/api/importer/…` in **A-2**). Today those are
  cross-domain hops; unified, they become internal links that just work.
- **Same toolchain.** Our `scripts/migrate.mjs` (Jekyll→Astro transforms:
  Kramdown, alerts, code fences, redirects) is largely reusable for a second
  source, so the mechanical cost is lower than starting cold.

## Recommended approach

1. **One site, distinct section — not a separate site.** Add a top-level
   **Developers** area in the same Starlight project with its own sidebar tree and
   landing page, under `/developers/…` (or keep the legacy `/extend`, `/integrate`
   roots — see questions). Unified Pagefind search + Beacon design; clear audience
   separation in the IA.
2. **Migrate mechanically first, rewrite later.** Mirror your Phase 1/2/3
   discipline: port dev docs faithfully, run the same fidelity audit, *then*
   improve prose. Keep it on its own branch so it doesn't entangle the current
   connection-docs migration (#897) or rewrite.
3. **Reuse `migrate.mjs`.** Factor the shared transforms into a module and add a
   second entry point that reads the dev-docs source and emits into
   `src/content/docs/developers/…`. All our F-fixes apply for free.
4. **Redirects.** Use the existing `src/integrations/redirect-from.mjs` to 301 the
   old `developers.keboola.com/<path>` URLs to the new location — preserve SEO and
   bookmarks. Once live, fold the A-3 `developers.keboola.com` links into internal
   links via the same `migrate.mjs` pass.

## Open questions (need your call — these are content/architecture facts)

1. **One site or two?** Single unified site with a Developers section (recommended),
   or keep two sites and just tighten cross-linking?
2. **IA & URLs.** Where does it live — `/developers/…`, or preserve current
   `/extend`, `/integrate`, `/cli`, `/apis` roots? Top-nav switcher between
   "Docs" and "Developers", or one merged sidebar?
3. **Source of truth.** What repo/format are the dev docs in today (Jekyll?
   GitBook? Markdown?), where's the repo, and roughly how many pages? (Drives the
   migrate.mjs effort.)
4. **Sequence.** Before, after, or parallel to the connection-docs rewrite (Phase 3)?
   My instinct: land the connection-docs migration (#897) on `main` first, then
   start dev-docs as its own Phase-1-style migration.
5. **Ownership/redirects.** Who owns the `developers.keboola.com` domain + its
   current deploy, so we can plan the cutover and redirects?

## Rough phasing (once questions are answered)

- **D-0** Decide IA + URL scheme (this doc's questions).
- **D-1** Port dev-docs source via shared `migrate.mjs` → `developers/` section; build clean.
- **D-2** Run `scripts/audit-phase2.mjs` over the merged site; fix mechanical breakage; wire redirects.
- **D-3** Content rewrite of dev docs (task-oriented), bundled with the broader Phase 3.

---

*Evidence references: see `AUDIT_LOG.md` → Phase 2 systematic audit, findings A-2
and A-3.*
