import { getPublishedPosts } from '@/actions/blogs'

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** GET /api/blogs/rss?lang=es — feed RSS de posts publicados */
export async function GET(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-portfolio-url.com'
  const { searchParams } = new URL(request.url)
  const lang = searchParams.get('lang') === 'en' ? 'en' : 'es'

  try {
    const { posts } = await getPublishedPosts({ lang, limit: 50 })
    const items = posts
      .filter((p) => p.translation)
      .map(
        (p) => `    <item>
      <title>${escapeXml(p.translation!.title)}</title>
      <link>${baseUrl}/blogs/${p.slug}</link>
      <guid>${baseUrl}/blogs/${p.slug}</guid>
      <description>${escapeXml(p.translation!.excerpt)}</description>
      ${p.published_at ? `<pubDate>${new Date(p.published_at).toUTCString()}</pubDate>` : ''}
    </item>`,
      )
      .join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Marlon Gutiérrez · Blog</title>
    <link>${baseUrl}/blogs</link>
    <description>Artículos y tutoriales de desarrollo web</description>
    <language>${lang}</language>
${items}
  </channel>
</rss>`

    return new Response(xml, {
      headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
    })
  } catch (err) {
    return new Response(err instanceof Error ? err.message : 'Error', { status: 500 })
  }
}
