import { NextResponse } from 'next/server'
import { getPublishedPosts } from '@/actions/blogs'
import type { BlogLanguage } from '@/utils/blog'

/**
 * API pública del blog (consumo externo tipo Tsafi §4:39).
 * GET /api/blogs?lang=es&category=tutoriales&search=nextjs&tag=react&limit=9&offset=0
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const langParam = searchParams.get('lang')
    const lang: BlogLanguage = langParam === 'en' ? 'en' : 'es'

    const { posts, total } = await getPublishedPosts({
      lang,
      category: searchParams.get('category') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      tag: searchParams.get('tag') ?? undefined,
      limit: Math.min(Number(searchParams.get('limit') ?? 9), 50),
      offset: Math.max(Number(searchParams.get('offset') ?? 0), 0),
    })

    return NextResponse.json({ posts, total, lang })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 },
    )
  }
}
