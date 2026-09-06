import { ImageResponse } from 'next/og'
import { getPostBySlug } from '@/actions/blogs'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let title = 'Blog'
  let excerpt = ''
  try {
    const post = await getPostBySlug(slug, 'es')
    if (post?.translation) {
      title = post.translation.title
      excerpt = post.translation.excerpt
    }
  } catch {
    // fallback genérico
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: '#011627',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        <div style={{ fontSize: 28, color: '#18f2e5', marginBottom: 16 }}>Marlon Gutiérrez · Blog</div>
        <div style={{ fontSize: 56, color: 'white', fontWeight: 700, lineHeight: 1.2 }}>{title}</div>
        {excerpt && (
          <div style={{ fontSize: 24, color: '#99a1af', marginTop: 24, lineHeight: 1.4 }}>
            {excerpt.slice(0, 140)}
          </div>
        )}
      </div>
    ),
    { ...size },
  )
}
