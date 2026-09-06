import { NextResponse } from 'next/server'
import { getPostBySlug } from '@/actions/blogs'
import type { BlogLanguage } from '@/utils/blog'

/** GET /api/blogs/:slug?lang=es */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const lang: BlogLanguage = searchParams.get('lang') === 'en' ? 'en' : 'es'

    const post = await getPostBySlug(slug, lang)
    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 })
    }
    return NextResponse.json(post)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 },
    )
  }
}
