'use client'

import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from './ImageUpload'
import TipTapEditor from './TipTapEditor'
import AiAssistModal, { type AiDraftData } from './AiAssistModal'
import { generateJSON } from '@tiptap/core'
import { getBlogExtensions } from './tiptap-extensions'
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
  const [aiOpen, setAiOpen] = useState(false)

  const handleAiApply = (targetLang: BlogLanguage, draft: AiDraftData) => {
    const contentJson = generateJSON(draft.content_html, getBlogExtensions()) as unknown as Record<string, unknown>
    setForm((prev) => ({
      ...prev,
      slug: !slugTouched && targetLang === 'es' && draft.title ? slugify(draft.title) : prev.slug,
      tags: draft.tags.length > 0 ? normalizeTags(draft.tags) : prev.tags,
      translations: {
        ...prev.translations,
        [targetLang]: {
          title: draft.title,
          excerpt: draft.excerpt,
          content_html: draft.content_html,
          content_json: contentJson,
        },
      },
    }))
    setLang(targetLang)
  }

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

  const fillSampleData = () => {
    const dirty =
      form.translations.es.title !== '' ||
      form.translations.en.title !== '' ||
      form.translations.es.content_html !== ''
    if (dirty && !confirm('¿Sobrescribir el formulario con datos de prueba?')) return

    const REPO = 'https://github.com/Marlon042/nextjs-portfolio-template/blob/main/'
    const TSAFI = 'https://github.com/michaelshimeles/tsafi'

    // Mini-helpers TipTap JSON
    const T = (text: string) => ({ type: 'text', text })
    const B = (text: string) => ({ type: 'text', text, marks: [{ type: 'bold' }] })
    const A = (text: string, href: string) => ({ type: 'text', text, marks: [{ type: 'link', attrs: { href } }] })
    const P = (...parts: object[]) => ({ type: 'paragraph', content: parts })
    const H2 = (text: string) => ({ type: 'heading', attrs: { level: 2 }, content: [T(text)] })
    const LI = (...parts: object[]) => ({ type: 'listItem', content: [P(...parts)] })
    const UL = (items: object[][]) => ({ type: 'bulletList', content: items.map((parts) => LI(...parts)) })
    const OL = (items: object[][]) => ({ type: 'orderedList', content: items.map((parts) => LI(...parts)) })
    const QUOTE = (text: string) => ({ type: 'blockquote', content: [P(T(text))] })
    const CODE = (code: string) => ({ type: 'codeBlock', content: [T(code)] })
    const DOC = (content: object[]) => ({ type: 'doc', content })

    const esTitle = 'Cómo construí un CMS de blog con Next.js, Supabase y TipTap'
    const esHtml =
      `<h2>De un placeholder a un CMS real</h2>` +
      `<p>La ruta <strong>/blogs</strong> de mi portfolio mostraba un cartel de “Coming Soon”. Un video sobre <a href="${TSAFI}">SupaNext</a>, un CMS open source de blogs con Next.js, Supabase y TipTap, me dio la idea: ¿por qué no construir uno propio, integrado al admin panel que ya tenía?</p>` +
      `<h2>Las decisiones que marcaron el rumbo</h2>` +
      `<ul><li><strong>Opción A, modelo simple:</strong> un post = un slug. El sistema Documentos → Artículos de Tsafi (un borrador, N slugs para SEO A/B) era complejidad innecesaria para un portfolio de un solo autor.</li>` +
      `<li><strong>Dos idiomas (ES/EN)</strong> en vez de los cinco del sitio, con tabla <strong>blog_post_translations</strong> y constraint de idioma.</li>` +
      `<li><strong>TipTap 2.x + Cloudinary:</strong> reutilizar el stack existente en lugar de sumar UploadThing o Prisma.</li>` +
      `<li><strong>Migraciones SQL planas,</strong> con el mismo estilo y convenciones del resto del proyecto.</li></ul>` +
      `<h2>Fase 1 — La base de datos</h2>` +
      `<p>Cuatro tablas en <a href="${REPO}supabase/migrations/00013_blog_schema.sql">00013_blog_schema.sql</a>: blog_categories, blog_authors, blog_posts y blog_post_translations. Con índice GIN para tags, trigger de updated_at y RLS que solo deja leer <strong>published</strong> al público.</p>` +
      `<pre><code>create table blog_posts (\n  id uuid primary key default gen_random_uuid(),\n  slug text unique not null,\n  status text not null default 'draft'\n    check (status in ('draft', 'published', 'archived')),\n  tags text[] not null default '{}'\n);</code></pre>` +
      `<h2>Fase 2 — Backend y API pública</h2>` +
      `<p>Server actions con el patrón getX / createX / updateX / deleteX en <a href="${REPO}src/actions/blogs.ts">src/actions/blogs.ts</a>: createPost valida con Zod, sanitiza el HTML, calcula el tiempo de lectura y hace rollback si falla una traducción. Además expusimos <a href="${REPO}src/app/api/blogs/route.ts">GET /api/blogs</a> para consumir el blog desde cualquier otro sitio, igual que hacía SupaNext.</p>` +
      `<ul><li><strong>findAvailableSlug:</strong> si el slug existe, sugiere slug-2, slug-3…</li>` +
      `<li><strong>incrementViews</strong> fire-and-forget para el contador de visitas.</li></ul>` +
      `<h2>Fase 3 — El admin con TipTap</h2>` +
      `<p>Tabla con filtros por estado, drag &amp; drop y toggle de publicación (<a href="${REPO}src/app/admin/blogs/page.tsx">admin/blogs</a>); <a href="${REPO}src/components/Admin/BlogForm.tsx">BlogForm</a> con tabs ES/EN, slug auto-generado y verificación de unicidad; y <a href="${REPO}src/components/Admin/TipTapEditor.tsx">TipTapEditor</a> con toolbar, resaltado, alineación e imágenes que suben directo a Cloudinary.</p>` +
      `<h2>Los dos bugs que casi nos ganan</h2>` +
      `<p>Probar en local no basta: los dos aparecieron contra datos reales.</p>` +
      `<ol><li><strong>RLS ocultaba los borradores:</strong> las lecturas del admin usaban la llave anónima y la policy solo deja ver published. Abrir el editor de un draft crasheaba la página. Fix: lecturas admin con service_role.</li>` +
      `<li><strong>PostgREST ignoraba el filtro</strong> por categoría sobre el embed con left join y devolvía todos los posts. Fix: resolver slug → id y filtrar por category_id.</li></ol>` +
      `<blockquote>La moraleja: un CMS se prueba contra datos reales, no contra supuestos.</blockquote>` +
      `<h2>Lo que sigue</h2>` +
      `<p>Estás leyendo este artículo en el frontend público (/blogs y /blogs/[slug]) con SEO, sitemap y RSS. Queda pulir detalles y, si algún día hace falta, evolucionar al modelo Documentos → Posts para SEO A/B. El código completo está en <a href="${REPO}">el repositorio</a>.</p>`

    const esJson = DOC([
      H2('De un placeholder a un CMS real'),
      P(T('La ruta '), B('/blogs'), T(' de mi portfolio mostraba un cartel de “Coming Soon”. Un video sobre '), A('SupaNext', TSAFI), T(', un CMS open source de blogs con Next.js, Supabase y TipTap, me dio la idea: ¿por qué no construir uno propio, integrado al admin panel que ya tenía?')),
      H2('Las decisiones que marcaron el rumbo'),
      UL([
        [B('Opción A, modelo simple:'), T(' un post = un slug. El sistema Documentos → Artículos de Tsafi (un borrador, N slugs para SEO A/B) era complejidad innecesaria para un portfolio de un solo autor.')],
        [B('Dos idiomas (ES/EN)'), T(' en vez de los cinco del sitio, con tabla '), B('blog_post_translations'), T(' y constraint de idioma.')],
        [B('TipTap 2.x + Cloudinary:'), T(' reutilizar el stack existente en lugar de sumar UploadThing o Prisma.')],
        [B('Migraciones SQL planas,'), T(' con el mismo estilo y convenciones del resto del proyecto.')],
      ]),
      H2('Fase 1 — La base de datos'),
      P(T('Cuatro tablas en '), A('00013_blog_schema.sql', `${REPO}supabase/migrations/00013_blog_schema.sql`), T(': blog_categories, blog_authors, blog_posts y blog_post_translations. Con índice GIN para tags, trigger de updated_at y RLS que solo deja leer '), B('published'), T(' al público.')),
      CODE("create table blog_posts (\n  id uuid primary key default gen_random_uuid(),\n  slug text unique not null,\n  status text not null default 'draft'\n    check (status in ('draft', 'published', 'archived')),\n  tags text[] not null default '{}'\n);"),
      H2('Fase 2 — Backend y API pública'),
      P(T('Server actions con el patrón getX / createX / updateX / deleteX en '), A('src/actions/blogs.ts', `${REPO}src/actions/blogs.ts`), T(': createPost valida con Zod, sanitiza el HTML, calcula el tiempo de lectura y hace rollback si falla una traducción. Además expusimos '), A('GET /api/blogs', `${REPO}src/app/api/blogs/route.ts`), T(' para consumir el blog desde cualquier otro sitio, igual que hacía SupaNext.')),
      UL([
        [B('findAvailableSlug:'), T(' si el slug existe, sugiere slug-2, slug-3…')],
        [B('incrementViews'), T(' fire-and-forget para el contador de visitas.')],
      ]),
      H2('Fase 3 — El admin con TipTap'),
      P(T('Tabla con filtros por estado, drag & drop y toggle de publicación ('), A('admin/blogs', `${REPO}src/app/admin/blogs/page.tsx`), T('); '), A('BlogForm', `${REPO}src/components/Admin/BlogForm.tsx`), T(' con tabs ES/EN, slug auto-generado y verificación de unicidad; y '), A('TipTapEditor', `${REPO}src/components/Admin/TipTapEditor.tsx`), T(' con toolbar, resaltado, alineación e imágenes que suben directo a Cloudinary.')),
      H2('Los dos bugs que casi nos ganan'),
      P(T('Probar en local no basta: los dos aparecieron contra datos reales.')),
      OL([
        [B('RLS ocultaba los borradores:'), T(' las lecturas del admin usaban la llave anónima y la policy solo deja ver published. Abrir el editor de un draft crasheaba la página. Fix: lecturas admin con service_role.')],
        [B('PostgREST ignoraba el filtro'), T(' por categoría sobre el embed con left join y devolvía todos los posts. Fix: resolver slug → id y filtrar por category_id.')],
      ]),
      QUOTE('La moraleja: un CMS se prueba contra datos reales, no contra supuestos.'),
      H2('Lo que sigue'),
      P(T('Estás leyendo este artículo en el frontend público (/blogs y /blogs/[slug]) con SEO, sitemap y RSS. Queda pulir detalles y, si algún día hace falta, evolucionar al modelo Documentos → Posts para SEO A/B. El código completo está en '), A('el repositorio', REPO), T('.')),
    ])

    const enTitle = 'How I built a blog CMS with Next.js, Supabase and TipTap'
    const enHtml =
      `<h2>From placeholder to real CMS</h2>` +
      `<p>The <strong>/blogs</strong> route of my portfolio showed a “Coming Soon” banner. A video about <a href="${TSAFI}">SupaNext</a>, an open-source blog CMS built with Next.js, Supabase and TipTap, gave me the idea: why not build my own, integrated into the admin panel I already had?</p>` +
      `<h2>The decisions that shaped the project</h2>` +
      `<ul><li><strong>Option A, simple model:</strong> one post = one slug. Tsafi's Documents → Articles system (one draft, N slugs for SEO A/B testing) was unnecessary complexity for a single-author portfolio.</li>` +
      `<li><strong>Two languages (ES/EN)</strong> instead of the site's five, with a <strong>blog_post_translations</strong> table and a language check.</li>` +
      `<li><strong>TipTap 2.x + Cloudinary:</strong> reuse the existing stack instead of adding UploadThing or Prisma.</li>` +
      `<li><strong>Plain SQL migrations,</strong> following the project's existing style and conventions.</li></ul>` +
      `<h2>Phase 1 — The database</h2>` +
      `<p>Four tables in <a href="${REPO}supabase/migrations/00013_blog_schema.sql">00013_blog_schema.sql</a>: blog_categories, blog_authors, blog_posts and blog_post_translations. With a GIN index for tags, an updated_at trigger, and RLS that only lets the public read <strong>published</strong> posts.</p>` +
      `<pre><code>create table blog_posts (\n  id uuid primary key default gen_random_uuid(),\n  slug text unique not null,\n  status text not null default 'draft'\n    check (status in ('draft', 'published', 'archived')),\n  tags text[] not null default '{}'\n);</code></pre>` +
      `<h2>Phase 2 — Backend and public API</h2>` +
      `<p>Server actions following the getX / createX / updateX / deleteX pattern in <a href="${REPO}src/actions/blogs.ts">src/actions/blogs.ts</a>: createPost validates with Zod, sanitizes the HTML, computes reading time, and rolls back if a translation fails. We also exposed <a href="${REPO}src/app/api/blogs/route.ts">GET /api/blogs</a> so any other site can consume the blog, just like SupaNext did.</p>` +
      `<ul><li><strong>findAvailableSlug:</strong> if the slug exists, it suggests slug-2, slug-3…</li>` +
      `<li><strong>incrementViews</strong> fire-and-forget for the view counter.</li></ul>` +
      `<h2>Phase 3 — The admin with TipTap</h2>` +
      `<p>A table with status filters, drag &amp; drop and a publish toggle (<a href="${REPO}src/app/admin/blogs/page.tsx">admin/blogs</a>); <a href="${REPO}src/components/Admin/BlogForm.tsx">BlogForm</a> with ES/EN tabs, auto-generated slug and uniqueness check; and <a href="${REPO}src/components/Admin/TipTapEditor.tsx">TipTapEditor</a> with toolbar, highlight, alignment and images uploaded straight to Cloudinary.</p>` +
      `<h2>The two bugs that almost beat us</h2>` +
      `<p>Testing locally is not enough: both showed up against real data.</p>` +
      `<ol><li><strong>RLS hid the drafts:</strong> admin reads used the anonymous key, whose policy only allows published. Opening a draft's editor crashed the page. Fix: admin reads with service_role.</li>` +
      `<li><strong>PostgREST ignored the filter</strong> on the left-joined embedded category and returned every post. Fix: resolve slug → id and filter by category_id.</li></ol>` +
      `<blockquote>The lesson: a CMS is tested against real data, not assumptions.</blockquote>` +
      `<h2>What's next</h2>` +
      `<p>You are reading this article on the public frontend (/blogs and /blogs/[slug]) with SEO, sitemap and RSS. Polishing remains and, if ever needed, evolving to the Documents → Posts model for SEO A/B. The full code lives in <a href="${REPO}">the repository</a>.</p>`

    const enJson = DOC([
      H2('From placeholder to real CMS'),
      P(T('The '), B('/blogs'), T(' route of my portfolio showed a “Coming Soon” banner. A video about '), A('SupaNext', TSAFI), T(', an open-source blog CMS built with Next.js, Supabase and TipTap, gave me the idea: why not build my own, integrated into the admin panel I already had?')),
      H2('The decisions that shaped the project'),
      UL([
        [B('Option A, simple model:'), T(" one post = one slug. Tsafi's Documents → Articles system (one draft, N slugs for SEO A/B testing) was unnecessary complexity for a single-author portfolio.")],
        [B('Two languages (ES/EN)'), T(" instead of the site's five, with a "), B('blog_post_translations'), T(' table and a language check.')],
        [B('TipTap 2.x + Cloudinary:'), T(' reuse the existing stack instead of adding UploadThing or Prisma.')],
        [B('Plain SQL migrations,'), T(" following the project's existing style and conventions.")],
      ]),
      H2('Phase 1 — The database'),
      P(T('Four tables in '), A('00013_blog_schema.sql', `${REPO}supabase/migrations/00013_blog_schema.sql`), T(': blog_categories, blog_authors, blog_posts and blog_post_translations. With a GIN index for tags, an updated_at trigger, and RLS that only lets the public read '), B('published'), T(' posts.')),
      CODE("create table blog_posts (\n  id uuid primary key default gen_random_uuid(),\n  slug text unique not null,\n  status text not null default 'draft'\n    check (status in ('draft', 'published', 'archived')),\n  tags text[] not null default '{}'\n);"),
      H2('Phase 2 — Backend and public API'),
      P(T('Server actions following the getX / createX / updateX / deleteX pattern in '), A('src/actions/blogs.ts', `${REPO}src/actions/blogs.ts`), T(': createPost validates with Zod, sanitizes the HTML, computes reading time, and rolls back if a translation fails. We also exposed '), A('GET /api/blogs', `${REPO}src/app/api/blogs/route.ts`), T(' so any other site can consume the blog, just like SupaNext did.')),
      UL([
        [B('findAvailableSlug:'), T(' if the slug exists, it suggests slug-2, slug-3…')],
        [B('incrementViews'), T(' fire-and-forget for the view counter.')],
      ]),
      H2('Phase 3 — The admin with TipTap'),
      P(T('A table with status filters, drag & drop and a publish toggle ('), A('admin/blogs', `${REPO}src/app/admin/blogs/page.tsx`), T('); '), A('BlogForm', `${REPO}src/components/Admin/BlogForm.tsx`), T(' with ES/EN tabs, auto-generated slug and uniqueness check; and '), A('TipTapEditor', `${REPO}src/components/Admin/TipTapEditor.tsx`), T(' with toolbar, highlight, alignment and images uploaded straight to Cloudinary.')),
      H2('The two bugs that almost beat us'),
      P(T('Testing locally is not enough: both showed up against real data.')),
      OL([
        [B('RLS hid the drafts:'), T(" admin reads used the anonymous key, whose policy only allows published. Opening a draft's editor crashed the page. Fix: admin reads with service_role.")],
        [B('PostgREST ignored the filter'), T(' on the left-joined embedded category and returned every post. Fix: resolve slug → id and filter by category_id.')],
      ]),
      QUOTE('The lesson: a CMS is tested against real data, not assumptions.'),
      H2("What's next"),
      P(T('You are reading this article on the public frontend (/blogs and /blogs/[slug]) with SEO, sitemap and RSS. Polishing remains and, if ever needed, evolving to the Documents → Posts model for SEO A/B. The full code lives in '), A('the repository', REPO), T('.')),
    ])

    setForm((prev) => ({
      ...prev,
      slug: slugTouched ? prev.slug : slugify(esTitle),
      tags: normalizeTags(['nextjs', 'supabase', 'cms']),
      translations: {
        es: {
          title: esTitle,
          excerpt:
            'De un "Coming Soon" a un CMS completo: cómo construí el blog de mi portfolio con Next.js 16, Supabase, TipTap y Cloudinary — decisiones, fases y los dos bugs reales del camino.',
          content_html: esHtml,
          content_json: esJson as Record<string, unknown>,
        },
        en: {
          title: enTitle,
          excerpt:
            'From a "Coming Soon" placeholder to a full CMS: how I built my portfolio blog with Next.js 16, Supabase, TipTap and Cloudinary — decisions, phases and two real bugs.',
          content_html: enHtml,
          content_json: enJson as Record<string, unknown>,
        },
      },
    }))
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          {action === 'create' ? 'New Post' : 'Edit Post'}
        </h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAiOpen(true)}
            title="Genera un borrador con IA o traduce ES → EN"
            className="rounded border border-[#5565e8] px-3 py-1.5 text-xs font-semibold text-[#8b95f0] transition hover:bg-[#5565e8]/20 hover:text-white"
          >
            ✨ Asistir con IA
          </button>
          <button
            type="button"
            onClick={fillSampleData}
            title="Rellena el artículo ES/EN sobre cómo construimos este CMS"
            className="rounded border border-dashed border-[#18f2e5]/60 px-3 py-1.5 text-xs text-[#18f2e5] transition hover:bg-[#18f2e5]/10"
          >
            ⚡ Datos de prueba
          </button>
        </div>
      </div>

      <AiAssistModal
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        activeLang={lang}
        getSource={(l) => ({
          title: form.translations[l].title,
          excerpt: form.translations[l].excerpt,
          content_html: form.translations[l].content_html,
        })}
        onApply={handleAiApply}
      />

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
