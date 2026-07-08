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
        // Docs revamp (Diátaxis) — every revamped page declares the single
        // reader need it serves, plus user-vocabulary keywords for search/RAG.
        keywords: z.array(z.string()).optional(),
        type: z.enum(['how-to', 'reference', 'explanation', 'tutorial']).optional(),
      }),
    }),
  }),
};
