import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    updated: z.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    hero: z
      .object({
        alt: z.string().optional(),
        src: z.string(),
      })
      .optional(),
  }),
});

export const collections = {
  blog,
};
