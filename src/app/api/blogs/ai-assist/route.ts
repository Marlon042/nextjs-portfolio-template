import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateBlogDraft, translateBlogPost } from '@/lib/ai-provider'
import { sanitizeContentHtml } from '@/lib/blog-sanitize'
import { normalizeTags } from '@/utils/blog'
import { aiAssistRequestSchema, aiDraftSchema } from '@/lib/validations/ai'

/** Rate-limit simple en memoria: 1 petición / 20s por usuario admin */
const lastCall = new Map<string, number>()
const MIN_INTERVAL_MS = 20000

async function requireAdmin(request: Request): Promise<string | null> {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return null
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return null
  const client = createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })
  const { data } = await client.auth.getUser()
  return data.user?.id ?? null
}

/**
 * POST /api/blogs/ai-assist — asistente IA solo-admin.
 * Body: { mode: 'generar', topic, detail? } | { mode: 'traducir', source: { title, excerpt, content_html } }
 * Responde: { title, excerpt, content_html, tags } (content_html sanitizado).
 */
export async function POST(request: Request) {
  try {
    const userId = await requireAdmin(request)
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado: inicia sesión en el admin' }, { status: 401 })
    }

    const now = Date.now()
    const prev = lastCall.get(userId) ?? 0
    if (now - prev < MIN_INTERVAL_MS) {
      return NextResponse.json(
        { error: `Espera ${Math.ceil((MIN_INTERVAL_MS - (now - prev)) / 1000)}s antes de pedir de nuevo` },
        { status: 429 },
      )
    }

    const body = await request.json()
    const parsed = aiAssistRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Petición inválida' },
        { status: 400 },
      )
    }

    const { mode, topic, detail, source } = parsed.data
    const raw =
      mode === 'generar'
        ? await generateBlogDraft(topic ?? '', detail)
        : await translateBlogPost(source!)

    const draft = aiDraftSchema.safeParse({
      ...raw,
      tags: mode === 'generar' ? normalizeTags(raw.tags) : [],
    })
    if (!draft.success) {
      return NextResponse.json(
        { error: 'La IA devolvió un borrador incompleto, intenta de nuevo' },
        { status: 502 },
      )
    }

    lastCall.set(userId, now)
    return NextResponse.json({
      ...draft.data,
      content_html: sanitizeContentHtml(draft.data.content_html),
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 },
    )
  }
}
