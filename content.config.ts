import { defineContentConfig, defineCollection, z } from "@nuxt/content";

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string().or(z.date()),
  tags: z.array(z.string()),
  image: z.string(),
  author: z.string(),
});

export default defineContentConfig({
  collections: {
    blog_en: defineCollection({
      type: "page",
      source: "en/*.md",
      schema: blogSchema,
    }),
    blog_de: defineCollection({
      type: "page",
      source: "de/*.md",
      schema: blogSchema,
    }),
  },
});
