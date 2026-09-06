'use client'

import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from './ImageUpload'
import TipTapEditor from './TipTapEditor'
import { createPost, updatePost, findAvailableSlug, type BlogCategory, type BlogAuthor } from '@/actions/blogs'
import { getCategories } from '@/actions/blog-categories'
import { getAuthors } from '@/actions/blog-authors'
import { slugify, isValidSlug, calcReadingTime, normalizeTags, type BlogLanguage, type BlogStatus } from '@/utils/blog'

interface TranslationForm {
  title: string
  excerpt: string
  content_html: string
  content_json: Record<string, unknown>
}

export interface BlogFormData {
  slug: string
  status: BlogStatus
  cover_url: string
  cover_alt: string
  category_id: string
  author_id: string
  tags: string[]
  is_featured: boolean
  display_order: number
  translations: Record<BlogLanguage, TranslationForm>
}

interface BlogFormProps {
  initialData?: BlogFormData
  postId?: string
  action: 'create' | 'update'
}

const emptyTranslation = (): TranslationForm => ({
  title: '',
  excerpt: '',
  content_html: '',
  content_json: { type: 'doc', content: [] },
})

const emptyForm = (): BlogFormData => ({
  slug: '',
  status: 'draft',
  cover_url: '',
  cover_alt: '',
  category_id: '',
  author_id: '',
  tags: [],
  is_featured: false,
  display_order: 1,
  translations: { es: emptyTranslation(), en: emptyTranslation() },
})

const inputClass =
  'w-full rounded border border-[#607b96] bg-[#011627] px-3 py-2 text-white outline-none focus:border-[#18f2e5]'
const labelClass = 'mb-1 block text-sm text-[#607b96]'

export default function BlogForm({ initialData, postId, action }: BlogFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<BlogFormData>(initialData ?? emptyForm())
  const [lang, setLang] = useState<BlogLanguage>('es')
  const [slugTouched, setSlugTouched] = useState(action === 'update')
  const [tagInput, setTagInput] = useState('')
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [authors, setAuthors] = useState<BlogAuthor[]>([])
  const [loading, setLoading] = useState(false)
  const [checkingSlug, setCheckingSlug] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
    getAuthors().then(setAuthors).catch(() => {})
  }, [])

  const setField = <K extends keyof BlogFormData>(name: K, value: BlogFormData[K]) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const setTranslation = (language: BlogLanguage, patch: Partial<TranslationForm>) => {
    setForm((prev) => ({
      ...prev,
      translations: { ...prev.translations, [language]: { ...prev.translations[language], ...patch } },
    }))
  }

  const handleTitleChange = (value: string) => {
    setTranslation(lang, { title: value })
    if (lang === 'es' && !slugTouched) {
      setForm((prev) => ({ ...prev, slug: slugify(value) }))
    }
  }

  const handleCheckSlug = async () => {
    if (!form.slug) return
    setCheckingSlug(true)
    try {
      const available = await findAvailableSlug(form.slug, postId)
      if (available !== form.slug) {
        setField('slug', available)
      } else {
        setError('')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error verificando slug')
    } finally {
      setCheckingSlug(false)
    }
  }

  const handleAddTag = () => {
    if (!tagInput.trim()) return
    setField('tags', normalizeTags([...form.tags, ...tagInput.split(',')]))
    setTagInput('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        slug: form.slug,
        status: form.status,
        cover_url: form.cover_url || null,
        cover_alt: form.cover_alt || null,
        category_id: form.category_id || null,
        author_id: form.author_id || null,
        tags: form.tags,
        display_order: form.display_order,
        is_featured: form.is_featured,
        translations: {
          es: { ...form.translations.es, meta_title: null, meta_description: null },
          en: { ...form.translations.en, meta_title: null, meta_description: null },
        },
      }
      if (action === 'create') {
        await createPost(payload)
      } else if (postId) {
        await updatePost(postId, payload)
      }
      window.location.href = '/admin/blogs'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  const t = form.translations[lang]
  const slugValid = form.slug === '' || isValidSlug(form.slug)

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-white">
        {action === 'create' ? 'New Post' : 'Edit Post'}
      </h1>

      {error && <p className="rounded bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}

      {/* Tabs idioma */}
      <div className="flex gap-2">
        {(['es', 'en'] as BlogLanguage[]).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className={`rounded px-4 py-1.5 text-sm font-semibold transition ${
              lang === l ? 'bg-[#5565e8] text-white' : 'border border-[#607b96] text-[#607b96] hover:text-white'
            }`}
          >
            {l.toUpperCase()}
            {form.translations[l].title ? ' ✓' : ''}
          </button>
        ))}
        <span className="self-center text-xs text-[#607b96]">Ambos idiomas obligatorios</span>
        <span className="ml-auto self-center text-xs text-[#607b96]">
          {calcReadingTime(t.content_html || '<p></p>')} min · {t.content_html.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length} palabras
        </span>
      </div>

      <div>
        <label className={labelClass} htmlFor="title">Título ({lang.toUpperCase()}) * — el H1 del artículo, mín. 5 caracteres</label>
        <input
          id="title"
          value={t.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          minLength={5}
          maxLength={120}
          placeholder={lang === 'es' ? 'Ej: Cómo optimicé mi portfolio con Next.js 15' : 'E.g.: How I optimized my portfolio with Next.js 15'}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="excerpt">
          Resumen ({lang.toUpperCase()}) * — 1 o 2 frases que aparecen en la tarjeta del blog y en Google (30–300 caracteres)
        </label>
        <textarea
          id="excerpt"
          value={t.excerpt}
          onChange={(e) => setTranslation(lang, { excerpt: e.target.value })}
          required
          rows={2}
          maxLength={300}
          placeholder={lang === 'es' ? 'Ej: Te cuento paso a paso cómo dejé mi portfolio cargando en menos de 1 segundo…' : 'E.g.: Step by step on how I got my portfolio loading in under 1 second…'}
          className={inputClass}
        />
        <p className="mt-1 text-right text-xs text-[#607b96]">{t.excerpt.length}/300 (mín. 30)</p>
      </div>

      <div>
        <label className={labelClass}>Contenido ({lang.toUpperCase()}) * — el cuerpo del artículo</label>
        <TipTapEditor
          key={lang}
          content={t.content_json && Object.keys(t.content_json).length > 0 ? t.content_json : null}
          onChange={(html, json) => setTranslation(lang, { content_html: html, content_json: json })}
        />
      </div>

      {/* Slug (§2.2) */}
      <div>
        <label className={labelClass} htmlFor="slug">Slug * — único, compartido ES/EN</label>
        <div className="flex gap-2">
          <input
            id="slug"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true)
              setField('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
            }}
            required
            className={`${inputClass} ${slugValid ? '' : 'border-red-500'}`}
          />
          <button
            type="button"
            onClick={handleCheckSlug}
            disabled={checkingSlug || !form.slug}
            className="shrink-0 rounded border border-[#607b96] px-4 py-2 text-sm text-[#607b96] transition hover:bg-[#1a2d4a] hover:text-white disabled:opacity-50"
          >
            {checkingSlug ? '…' : 'Verificar'}
          </button>
        </div>
        {!slugValid && <p className="mt-1 text-xs text-red-400">Slug inválido: 3–80 chars, solo minúsculas, números y guiones.</p>}
        {action === 'update' && form.status === 'published' && (
          <p className="mt-1 text-xs text-yellow-400/80">⚠ Post publicado: cambiar el slug rompe links/SEO (§2.2).</p>
        )}
      </div>

      <ImageUpload
        label="Cover Image"
        currentImage={form.cover_url}
        onUpload={(url) => setField('cover_url', url)}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="category_id">Category</label>
          <select
            id="category_id"
            value={form.category_id}
            onChange={(e) => setField('category_id', e.target.value)}
            className={inputClass}
          >
            <option value="">— Sin categoría —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name_es} / {c.name_en}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="author_id">Author</label>
          <select
            id="author_id"
            value={form.author_id}
            onChange={(e) => setField('author_id', e.target.value)}
            className={inputClass}
          >
            <option value="">— Sin autor —</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="tags">Tags (max 6)</label>
        <div className="flex gap-2">
          <input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault()
                handleAddTag()
              }
            }}
            placeholder="nextjs, supabase… (Enter para añadir)"
            className={inputClass}
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="shrink-0 rounded border border-[#607b96] px-4 py-2 text-sm text-[#607b96] transition hover:bg-[#1a2d4a] hover:text-white"
          >
            Añadir
          </button>
        </div>
        {form.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {form.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 rounded-full bg-[#18f2e5]/10 px-3 py-1 text-xs text-[#18f2e5]">
                {tag}
                <button type="button" onClick={() => setField('tags', form.tags.filter((x) => x !== tag))} className="hover:text-white">✕</button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass} htmlFor="status">Status *</label>
          <select id="status" value={form.status} onChange={(e) => setField('status', e.target.value as BlogStatus)} className={inputClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="display_order">Order</label>
          <input
            id="display_order"
            type="number"
            min={0}
            value={form.display_order}
            onChange={(e) => setField('display_order', Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-[#607b96]">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setField('is_featured', e.target.checked)}
              className="size-4 accent-[#18f2e5]"
            />
            Featured ⭐
          </label>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-[#5565e8] px-6 py-2 font-semibold text-white transition hover:bg-[#4555d8] disabled:opacity-50"
        >
          {loading ? 'Saving...' : action === 'create' ? 'Create Post' : 'Update Post'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/blogs')}
          className="rounded border border-[#607b96] px-6 py-2 text-[#607b96] transition hover:bg-[#1a2d4a] hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
