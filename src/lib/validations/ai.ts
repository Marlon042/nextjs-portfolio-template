import { z } from 'zod'

export const aiAssistRequestSchema = z
  .object({
    mode: z.enum(['generar', 'traducir']),
    topic: z.string().min(3).max(200).optional(),
    detail: z.string().max(1000).optional(),
    source: z
      .object({
        title: z.string().min(1),
        excerpt: z.string().min(1),
        content_html: z.string().min(1),
      })
      .optional(),
  })
  .refine((v) => (v.mode === 'generar' ? !!v.topic?.trim() : !!v.source), {
    message: 'Modo generar requiere tema; modo traducir requiere contenido ES',
  })

export const aiDraftSchema = z.object({
  title: z.string().min(5).max(120),
  excerpt: z.string().min(30).max(300),
  content_html: z.string().min(50),
  tags: z.array(z.string()).max(6).default([]),
})

export type AiAssistRequest = z.infer<typeof aiAssistRequestSchema>
export type AiDraftValidated = z.infer<typeof aiDraftSchema>
