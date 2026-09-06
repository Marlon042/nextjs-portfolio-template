import { z } from 'zod'

export const blogStatusSchema = z.enum(['draft', 'published', 'archived'])
export const blogLanguageSchema = z.enum(['es', 'en'])

const slugSchema = z
  .string()
  .min(3)
  .max(80)
  .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones')
  .refine((s) => !s.startsWith('-') && !s.endsWith('-') && !s.includes('--'), {
    message: 'Sin guiones al inicio/fin ni dobles',
  })

export const blogTranslationSchema = z.object({
  title: z.string().min(5).max(120),
  excerpt: z.string().min(30).max(300),
  content_html: z.string().min(50),
  content_json: z.record(z.string(), z.unknown()),
  meta_title: z.string().max(120).optional().nullable(),
  meta_description: z.string().max(300).optional().nullable(),
})

export const blogPostSchema = z.object({
  slug: slugSchema,
  status: blogStatusSchema,
  cover_url: z.string().regex(/^https?:\/\/.+/, 'URL inválida').optional().nullable(),
  cover_alt: z.string().max(160).optional().nullable(),
  category_id: z.string().min(1).optional().nullable(),
  author_id: z.string().min(1).optional().nullable(),
  tags: z.array(z.string()).max(6).default([]),
  display_order: z.number().int().min(0).default(0),
  is_featured: z.boolean().default(false),
})

export const blogCreateSchema = blogPostSchema.extend({
  translations: z.object({
    es: blogTranslationSchema,
    en: blogTranslationSchema,
  }),
})

export type BlogCreateInput = z.infer<typeof blogCreateSchema>
export type BlogTranslationInput = z.infer<typeof blogTranslationSchema>
