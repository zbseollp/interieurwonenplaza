import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { draftField, imageField, statusField, stringListField } from './lib/blog-schema';

const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/*.{md,mdx}',
  }),
  // Payload sync emits a moving target: heroImage/image aliases, media objects,
  // string booleans, description under excerpt. Accept them all and normalise —
  // anything rejected here silently disappears from the site.
  schema: z
    .object({
      title: z.string(),
      description: z.string().optional(),
      excerpt: z.string().optional(),
      metaDescription: z.string().optional(),
      pubDate: z.coerce.date().optional(),
      date: z.coerce.date().optional(),
      updatedDate: z.coerce.date().optional(),
      author: z.string().optional(),
      categories: stringListField,
      tags: stringListField,
      featuredImage: imageField,
      heroImage: imageField,
      image: imageField,
      ogImage: imageField,
      featuredImageAlt: z.string().optional(),
      imageAlt: z.string().optional(),
      slug: z.string().optional(),
      draft: draftField,
      _status: statusField,
      useLiveHtml: z.boolean().optional(),
    })
    .passthrough()
    .transform((data) => ({
      ...data,
      description: data.description || data.excerpt || data.metaDescription || '',
      pubDate: data.pubDate ?? data.date ?? new Date(0),
    })),
});

const pages = defineCollection({
  loader: glob({
    base: './src/content/pages',
    pattern: '**/*.{md,mdx}',
  }),
  schema: z
    .object({
      title: z.string(),
      description: z.string().optional().default(''),
      pubDate: z.coerce.date().optional(),
      updatedDate: z.coerce.date().optional(),
      featuredImage: imageField,
      pageType: z.enum(['product', 'page']).optional(),
    })
    .passthrough(),
});

export const collections = { blog, pages };
