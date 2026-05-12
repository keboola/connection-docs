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
      }),
    }),
  }),
};
