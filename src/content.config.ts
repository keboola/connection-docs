import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        redirect_from: z.array(z.string()).optional(),
        // Beacon design — optional per-page overrides
        ask: z.string().optional(),
        icon: z.string().optional(),
        section: z.string().optional(),
        beacon: z.boolean().optional(),
        // Suppresses the page-head meta chrome (eyebrow pill + "Copy as
        // Markdown" split button). Used by utility pages like 404 where that
        // chrome is noise — a 404 has no section and nothing worth copying.
        hideMeta: z.boolean().optional(),
        // Search "best bets": a query that matches one of these phrases puts
        // this page first (public/pagefind-rerank.js). For the cases where two
        // pages fit a query and only an editor can say which one is meant.
        search_keywords: z.array(z.string()).optional(),
      }),
    }),
  }),
};
