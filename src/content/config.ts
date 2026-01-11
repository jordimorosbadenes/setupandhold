import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    updated: z.date().optional(),
    tags: z.array(z.string()).default([]),
    pinned: z.boolean().default(false),
    pinned_order: z.number().int().optional(),
    draft: z.boolean().default(false),
    hero: z
      .object({
        alt: z.string().optional(),
        src: z.string(),
        height: z.number().int().positive().optional(),
        position: z.string().optional(),
      })
      .optional(),
  }),
});

export const collections = {
  blog,
};
