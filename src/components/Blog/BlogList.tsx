'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/context/LanguageContext'
import { getCategories } from '@/actions/blog-categories'
import BlogCard from './BlogCard'

const PAGE_SIZE = 9

interface ApiPost {
  id: string
  slug: string
  cover_url: string | null
  cover_alt: string | null
  published_at: string | null
  reading_time: number | null
  views: number
  translation: {
    title: string
    excerpt: string
  } | null
  blog_categories?: { slug: string } | null
  blog_authors?: { name: string } | null
}

interface Category {
  id: string
  slug: string
  name_es: string
  name_en: string
}

function SkeletonCard() {
  return (
    <div className="bg-secondary border-border animate-pulse overflow-hidden rounded-2xl border">
      <div className="aspect-video w-full bg-[#0d1a3b]" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 rounded bg-[#0d1a3b]" />
        <div className="h-4 w-full rounded bg-[#0d1a3b]" />
        <div className="h-4 w-1/2 rounded bg-[#0d1a3b]" />
      </div>
    </div>
  )
}

export default function BlogList() {
  const { lang, t } = useLanguage()
  const [posts, setPosts] = useState<ApiPost[]>([])
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState<Category[]>([])
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchPosts = useCallback(async (reset: boolean, langCode: string, cat: string, q: string, offset: number) => {
    if (reset) setLoading(true)
    else setLoadingMore(true)
    try {
      const params = new URLSearchParams({
        lang: langCode,
        limit: String(PAGE_SIZE),
        offset: String(offset),
      })
      if (cat) params.set('category', cat)
      if (q) params.set('search', q)
      const res = await fetch(`/api/blogs?${params.toString()}`)
      const json = await res.json()
      setTotal(json.total ?? 0)
      setPosts((prev) => (reset ? (json.posts ?? []) : [...prev, ...(json.posts ?? [])]))
    } catch {
      // lista conserva lo que tenía
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  // search con debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDebouncedSearch(search.trim()), 400)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [search])

  // categorías una vez
  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
  }, [])

  // posts al cambiar lang/categoría/búsqueda
  useEffect(() => {
    fetchPosts(true, lang, category, debouncedSearch, 0)
  }, [lang, category, debouncedSearch, fetchPosts])

  // realtime: cambios publicados recargan la primera página
  useEffect(() => {
    const channel = supabase
      .channel('blogs-public')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blog_posts', filter: 'status=eq.published' },
        () => fetchPosts(true, lang, category, debouncedSearch, 0),
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, category, debouncedSearch])

  const catName = (c: Category) => (lang === 'es' ? c.name_es : c.name_en)
  const catNameOf = (slug?: string | null) => {
    const found = categories.find((c) => c.slug === slug)
    return found ? catName(found) : null
  }

  return (
    <div>
      {/* Filtros */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory('')}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              category === '' ? 'bg-accent text-secondary' : 'border border-border text-tertiary-content hover:text-accent'
            }`}
          >
            {t('blog.all') === 'blog.all' ? 'Todos' : t('blog.all')}
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.slug)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                category === c.slug ? 'bg-accent text-secondary' : 'border border-border text-tertiary-content hover:text-accent'
              }`}
            >
              {catName(c)}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Buscar…"
          className="bg-secondary border-border text-neutral rounded-lg border px-4 py-2 text-sm outline-none focus:border-accent md:ml-auto md:w-64"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-tertiary-content py-16 text-center">
          {debouncedSearch || category ? 'Sin resultados. Prueba otra búsqueda.' : t('blog.description')}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <BlogCard
                key={p.id}
                slug={p.slug}
                cover_url={p.cover_url}
                cover_alt={p.cover_alt}
                categoryName={catNameOf(p.blog_categories?.slug)}
                title={p.translation?.title ?? p.slug}
                excerpt={p.translation?.excerpt ?? ''}
                authorName={p.blog_authors?.name ?? null}
                published_at={p.published_at}
                reading_time={p.reading_time}
                views={p.views}
              />
            ))}
          </div>
          {posts.length < total && (
            <div className="mt-10 text-center">
              <button
                type="button"
                disabled={loadingMore}
                onClick={() => fetchPosts(false, lang, category, debouncedSearch, posts.length)}
                className="bg-accent hover:bg-accent/60 text-secondary cursor-pointer rounded-lg px-6 py-3 transition-colors duration-300 disabled:opacity-50"
              >
                {loadingMore ? 'Cargando…' : `Ver más (${posts.length}/${total})`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
