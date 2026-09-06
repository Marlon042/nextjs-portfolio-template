import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPostBySlug, getPublishedPosts } from '@/actions/blogs'
import { formatDate } from '@/utils'
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs'
import BlogCard from '@/components/Blog/BlogCard'
import BlogViewTracker from '@/components/Blog/BlogViewTracker'
import BlogTableOfContents from '@/components/Blog/BlogTableOfContents'

export const revalidate = 60

type Lang = 'es' | 'en'

const ui = {
  es: {
    home: 'Inicio',
    blog: 'Blog',
    by: 'Por',
    minRead: 'min de lectura',
    views: 'vistas',
    contents: 'Contenido',
    share: 'Compartir',
    copyLink: 'Copiar enlace',
    related: 'Artículos relacionados',
    back: '← Volver al blog',
  },
  en: {
    home: 'Home',
    blog: 'Blog',
    by: 'By',
    minRead: 'min read',
    views: 'views',
    contents: 'Contents',
    share: 'Share',
    copyLink: 'Copy link',
    related: 'Related articles',
    back: '← Back to blog',
  },
} satisfies Record<Lang, Record<string, string>>

function getLang(searchParams: { lang?: string | string[] }): Lang {
  const raw = Array.isArray(searchParams.lang) ? searchParams.lang[0] : searchParams.lang
  return raw === 'en' ? 'en' : 'es'
}

export async function generateStaticParams() {
  try {
    const { posts } = await getPublishedPosts({ lang: 'es', limit: 100 })
    return posts.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ lang?: string | string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const lang = getLang(await searchParams)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-portfolio-url.com'

  try {
    const post = await getPostBySlug(slug, lang)
    if (!post?.translation) return { title: 'Blog' }
    const title = post.translation.meta_title || post.translation.title
    const description = post.translation.meta_description || post.translation.excerpt
    return {
      title,
      description,
      alternates: { canonical: `${baseUrl}/blogs/${slug}` },
      openGraph: {
        title,
        description,
        url: `${baseUrl}/blogs/${slug}`,
        type: 'article',
        publishedTime: post.published_at ?? undefined,
        authors: post.author?.name ? [post.author.name] : undefined,
        ...(post.cover_url ? { images: [{ url: post.cover_url, alt: post.cover_alt ?? title }] } : {}),
      },
      twitter: { card: 'summary_large_image', title, description },
    }
  } catch {
    return { title: 'Blog' }
  }
}

export default async function BlogPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ lang?: string | string[] }>
}) {
  const { slug } = await params
  const lang = getLang(await searchParams)
  const t = ui[lang]

  let post: Awaited<ReturnType<typeof getPostBySlug>>
  try {
    post = await getPostBySlug(slug, lang)
  } catch {
    post = null
  }
  if (!post?.translation) notFound()

  const { translation } = post
  const otherLang: Lang = lang === 'es' ? 'en' : 'es'

  let related: { id: string; slug: string }[] = []
  try {
    if (post.category) {
      const { posts } = await getPublishedPosts({ lang, category: post.category.slug, limit: 4 })
      related = posts.filter((p) => p.id !== post.id).slice(0, 3)
    }
  } catch {
    related = []
  }

  return (
    <main className="mx-auto max-w-[800px] px-4 py-10">
      <BlogViewTracker slug={slug} />

      <Breadcrumbs
        breadcrumbs={[
          { label: t.home, href: '/' },
          { label: t.blog, href: '/blogs' },
          { label: translation.title, href: `/blogs/${slug}` },
        ]}
      />

      <div className="mb-6 flex items-center justify-end gap-2 text-sm">
        <span className="text-tertiary-content">{lang.toUpperCase()}</span>
        <Link href={`/blogs/${slug}?lang=${otherLang}`} className="text-accent hover:underline">
          {otherLang.toUpperCase()}
        </Link>
      </div>

      {post.category && (
        <span className="mb-4 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
          {lang === 'es' ? post.category.name_es : post.category.name_en}
        </span>
      )}

      <h1 className="text-neutral mb-4 text-3xl font-bold md:text-4xl">{translation.title}</h1>

      <div className="text-tertiary-content mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        {post.author && (
          <span>
            {t.by} <span className="text-neutral font-semibold">{post.author.name}</span>
          </span>
        )}
        {post.published_at && <span>{formatDate(post.published_at)}</span>}
        {post.reading_time != null && (
          <span>
            · {post.reading_time} {t.minRead}
          </span>
        )}
        <span>
          · 👁 {post.views} {t.views}
        </span>
      </div>

      {post.cover_url && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-2xl">
          <Image
            src={post.cover_url}
            alt={post.cover_alt || translation.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <p className="text-tertiary-content mb-8 border-l-2 border-accent pl-4 text-lg italic">
        {translation.excerpt}
      </p>

      <BlogTableOfContents targetId="blog-article" title={t.contents} />

      <div
        id="blog-article"
        className="blog-prose !min-h-0 !p-0"
        dangerouslySetInnerHTML={{ __html: translation.content_html }}
      />

      {post.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-secondary border border-border px-3 py-1 text-xs text-tertiary-content">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <span className="text-tertiary-content text-sm">{t.share}:</span>
        <a
          href={`https://x.com/intent/tweet?text=${encodeURIComponent(translation.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-accent transition hover:bg-accent/10"
        >
          X
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`/blogs/${slug}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-accent transition hover:bg-accent/10"
        >
          LinkedIn
        </a>
      </div>

      {post.author && (post.author.bio_es || post.author.bio_en) && (
        <div className="bg-secondary mt-8 flex items-center gap-4 rounded-2xl border border-border p-5">
          {post.author.avatar_url && (
            <Image
              src={post.author.avatar_url}
              alt={post.author.name}
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
          )}
          <div>
            <p className="text-neutral font-bold">{post.author.name}</p>
            <p className="text-tertiary-content text-sm">
              {lang === 'es' ? post.author.bio_es : post.author.bio_en}
            </p>
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-neutral mb-6 text-2xl font-bold">{t.related}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {related.map((r) => {
              const full = r as unknown as {
                slug: string
                cover_url: string | null
                cover_alt: string | null
                published_at: string | null
                reading_time: number | null
                views: number
                translation: { title: string; excerpt: string } | null
              }
              return (
                <BlogCard
                  key={r.id}
                  slug={full.slug}
                  cover_url={full.cover_url}
                  cover_alt={full.cover_alt}
                  categoryName={null}
                  title={full.translation?.title ?? full.slug}
                  excerpt={full.translation?.excerpt ?? ''}
                  authorName={null}
                  published_at={full.published_at}
                  reading_time={full.reading_time}
                  views={full.views}
                />
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-12">
        <Link href="/blogs" className="text-accent hover:underline">
          {t.back}
        </Link>
      </div>
    </main>
  )
}
