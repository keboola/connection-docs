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
        // Phase 3 authoring fields (task pages) — feed search, Ask Kai/RAG,
        // retrieval, and freshness tracking.
        keywords: z.array(z.string()).optional(),
        task: z.string().optional(),
        audience: z.string().optional(),
        // YAML parses an unquoted `2026-06-16` as a Date, quoted as a string —
        // accept either so authors don't have to remember to quote it.
        last_verified: z.union([z.string(), z.date()]).optional(),
        related: z.array(z.string()).optional(),
      }),
    }),
  }),
};
