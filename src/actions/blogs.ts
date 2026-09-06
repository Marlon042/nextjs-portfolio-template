'use server'

import { supabase } from '@/lib/supabase'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { sanitizeContentHtml } from '@/lib/blog-sanitize'
import { blogCreateSchema, type BlogCreateInput } from '@/lib/validations/blog'
import {
  BLOG_LANGUAGES,
  calcReadingTime,
  isValidSlug,
  normalizeTags,
  slugify,
  type BlogLanguage,
  type BlogStatus,
} from '@/utils/blog'

export interface BlogCategory {
  id: string
  slug: string
  name_es: string
  name_en: string
  display_order: number
}

export interface BlogAuthor {
  id: string
  slug: string
  name: string
  avatar_url: string | null
  bio_es: string | null
  bio_en: string | null
  social_github: string | null
  social_linkedin: string | null
  social_twitter: string | null
}

export interface BlogPost {
  id: string
  slug: string
  status: BlogStatus
  cover_url: string | null
  cover_alt: string | null
  category_id: string | null
  author_id: string | null
  tags: string[]
  display_order: number
  is_featured: boolean
  views: number
  reading_time: number | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface BlogPostTranslation {
  id: string
  post_id: string
  language: string
  title: string
  excerpt: string
  content_html: string
  content_json: Record<string, unknown>
  meta_title: string | null
  meta_description: string | null
}

export interface BlogPostWithContent extends BlogPost {
  translation: BlogPostTranslation | null
  category: BlogCategory | null
  author: BlogAuthor | null
}

// ─── Helpers ───

async function slugTaken(slug: string, excludeId?: string) {
  let query = supabase.from('blog_posts').select('id').eq('slug', slug)
  if (excludeId) query = query.neq('id', excludeId)
  const { data } = await query.maybeSingle()
  return !!data
}

/** Slug Policy §2.2: sugiere `base`, `base-2`, `base-3`… */
export async function findAvailableSlug(base: string, excludeId?: string) {
  const clean = slugify(base) || 'post'
  if (!(await slugTaken(clean, excludeId))) return clean
  for (let i = 2; i < 100; i++) {
    const candidate = `${clean}-${i}`.slice(0, 80)
    if (!(await slugTaken(candidate, excludeId))) return candidate
  }
  throw new Error('No se pudo generar un slug único')
}

// ─── Lecturas públicas ───

interface ListParams {
  lang?: BlogLanguage
  category?: string
  search?: string
  tag?: string
  featured?: boolean
  limit?: number
  offset?: number
}

export async function getPublishedPosts(params: ListParams = {}) {
  const { lang = 'es', category, search, tag, featured, limit = 9, offset = 0 } = params

  let postIds: string[] | null = null

  if (search) {
    const { data } = await supabase
      .from('blog_post_translations')
      .select('post_id')
      .eq('language', lang)
      .or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
    postIds = (data ?? []).map((r) => r.post_id)
    if (postIds.length === 0) return { posts: [], total: 0 }
  }

  let query = supabase
    .from('blog_posts')
    .select('*, blog_categories!inner(slug)', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (category) query = query.eq('blog_categories.slug', category)
  if (tag) query = query.contains('tags', [tag.toLowerCase()])
  if (featured !== undefined) query = query.eq('is_featured', featured)
  if (postIds) query = query.in('id', postIds)

  const { data, count, error } = await query.range(offset, offset + limit - 1)
  if (error) throw new Error(error.message)

  const posts = (data ?? []) as (BlogPost & { blog_categories: { slug: string } | null })[]
  const ids = posts.map((p) => p.id)
  if (ids.length === 0) return { posts: [], total: count ?? 0 }

  const { data: translations } = await supabase
    .from('blog_post_translations')
    .select('*')
    .in('post_id', ids)
    .eq('language', lang)

  const transMap = new Map((translations ?? []).map((t) => [t.post_id, t as BlogPostTranslation]))

  return {
    posts: posts.map((p) => ({
      ...p,
      translation: transMap.get(p.id) ?? null,
    })),
    total: count ?? 0,
  }
}

export async function getPostBySlug(slug: string, lang: BlogLanguage = 'es') {
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*, blog_categories(*), blog_authors(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !post) return null

  const { data: translations } = await supabase
    .from('blog_post_translations')
    .select('*')
    .eq('post_id', post.id)
    .in('language', [lang, 'es'])

  const list = (translations ?? []) as BlogPostTranslation[]
  const translation =
    list.find((t) => t.language === lang) ?? list.find((t) => t.language === 'es') ?? null

  return {
    ...(post as BlogPost),
    translation,
    category: (post.blog_categories ?? null) as BlogCategory | null,
    author: (post.blog_authors ?? null) as BlogAuthor | null,
  } as BlogPostWithContent
}

// ─── Admin ───

export async function getAllPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*, blog_post_translations(*), blog_categories(slug,name_es,name_en)')
    .order('display_order')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getPost(id: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*, blog_post_translations(*)')
    .eq('id', id)
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function createPost(input: BlogCreateInput) {
  const parsed = blogCreateSchema.safeParse(input)
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? 'Datos inválidos')
  const { translations, ...postFields } = parsed.data

  if (!isValidSlug(postFields.slug)) throw new Error('Slug inválido (§2.2)')
  if (await slugTaken(postFields.slug)) throw new Error(`Slug "${postFields.slug}" ya existe`)

  const admin = getSupabaseAdmin()
  const reading_time = calcReadingTime(translations.es.content_html)

  const { data: post, error: postError } = await admin
    .from('blog_posts')
    .insert([
      {
        ...postFields,
        tags: normalizeTags(postFields.tags ?? []),
        reading_time,
        published_at: postFields.status === 'published' ? new Date().toISOString() : null,
      },
    ])
    .select()
    .single()

  if (postError) throw new Error(postError.message)

  try {
    const rows = BLOG_LANGUAGES.map((lang) => ({
      post_id: post.id,
      language: lang,
      title: translations[lang].title,
      excerpt: translations[lang].excerpt,
      content_html: sanitizeContentHtml(translations[lang].content_html),
      content_json: translations[lang].content_json,
      meta_title: translations[lang].meta_title ?? null,
      meta_description: translations[lang].meta_description ?? null,
    }))

    const { error: transError } = await admin.from('blog_post_translations').insert(rows)
    if (transError) throw new Error(transError.message)
  } catch (err) {
    await admin.from('blog_posts').delete().eq('id', post.id)
    throw err instanceof Error ? err : new Error('Error guardando traducciones')
  }

  return post as BlogPost
}

export async function updatePost(
  id: string,
  input: Partial<Omit<BlogCreateInput, 'translations'>> & {
    translations?: Partial<Record<BlogLanguage, BlogCreateInput['translations']['es']>>
  },
) {
  const admin = getSupabaseAdmin()
  const { translations, ...postFields } = input

  if (postFields.slug) {
    if (!isValidSlug(postFields.slug)) throw new Error('Slug inválido (§2.2)')
    if (await slugTaken(postFields.slug, id)) throw new Error(`Slug "${postFields.slug}" ya existe`)
  }

  const patch: Record<string, unknown> = {
    ...postFields,
    ...(postFields.tags ? { tags: normalizeTags(postFields.tags) } : {}),
  }

  if (postFields.status === 'published') {
    const current = await getPost(id)
    if (!current?.published_at) patch.published_at = new Date().toISOString()
  }

  if (translations?.es?.content_html) {
    patch.reading_time = calcReadingTime(translations.es.content_html)
  }

  if (Object.keys(patch).length > 0) {
    const { error } = await admin.from('blog_posts').update(patch).eq('id', id)
    if (error) throw new Error(error.message)
  }

  if (translations) {
    for (const lang of BLOG_LANGUAGES) {
      const t = translations[lang]
      if (!t) continue
      const { error } = await admin
        .from('blog_post_translations')
        .upsert(
          {
            post_id: id,
            language: lang,
            title: t.title,
            excerpt: t.excerpt,
            content_html: sanitizeContentHtml(t.content_html),
            content_json: t.content_json,
            meta_title: t.meta_title ?? null,
            meta_description: t.meta_description ?? null,
          },
          { onConflict: 'post_id,language' },
        )
      if (error) throw new Error(error.message)
    }
  }

  return getPost(id)
}

export async function deletePost(id: string) {
  const admin = getSupabaseAdmin()
  const { error } = await admin.from('blog_posts').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function togglePublish(id: string, status: BlogStatus) {
  return updatePost(id, { status })
}

export async function incrementViews(slug: string) {
  try {
    const admin = getSupabaseAdmin()
    const { data } = await admin.from('blog_posts').select('id,views').eq('slug', slug).single()
    if (!data) return
    await admin.from('blog_posts').update({ views: (data.views ?? 0) + 1 }).eq('id', data.id)
  } catch {
    // fire-and-forget: nunca rompe el render
  }
}
