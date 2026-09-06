export type BlogLanguage = 'es' | 'en'
export type BlogStatus = 'draft' | 'published' | 'archived'

export const BLOG_LANGUAGES: BlogLanguage[] = ['es', 'en']

/** Slug Policy §2.2: lowercase, sin acentos, solo a-z0-9-, 3–60 chars */
export const SLUG_REGEX = /^[a-z0-9-]+$/

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
    .replace(/-$/g, '')
}

export function isValidSlug(slug: string): boolean {
  return (
    slug.length >= 3 &&
    slug.length <= 80 &&
    SLUG_REGEX.test(slug) &&
    !slug.startsWith('-') &&
    !slug.endsWith('-') &&
    !slug.includes('--')
  )
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** ~200 palabras por minuto, mínimo 1 */
export function calcReadingTime(html: string): number {
  const words = stripHtml(html).split(' ').filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

/** Tags: lowercase, sin espacios, max 6, sin duplicados */
export function normalizeTags(tags: string[]): string[] {
  const seen = new Set<string>()
  for (const raw of tags) {
    const tag = raw.toLowerCase().trim().replace(/\s+/g, '-')
    if (tag && !seen.has(tag)) seen.add(tag)
    if (seen.size >= 6) break
  }
  return [...seen]
}

const FIELD_LABELS: Record<string, string> = {
  slug: 'Slug',
  status: 'Estado',
  cover_url: 'Portada',
  cover_alt: 'Texto portada',
  category_id: 'Categoría',
  author_id: 'Autor',
  tags: 'Tags',
  'translations.es.title': 'Español · Título',
  'translations.es.excerpt': 'Español · Resumen',
  'translations.es.content_html': 'Español · Contenido',
  'translations.en.title': 'English · Title',
  'translations.en.excerpt': 'English · Excerpt',
  'translations.en.content_html': 'English · Content',
}

interface ValidationIssue {
  path: readonly (string | number | symbol)[]
  code: string
  minimum?: number | bigint
  maximum?: number | bigint
}

/** Convierte el primer error de zod en mensaje en español con campo incluido. */
export function formatValidationError(issues: ValidationIssue[]): string {
  const issue = issues[0]
  if (!issue) return 'Datos inválidos'
  const key = issue.path.map(String).join('.')
  const label = FIELD_LABELS[key] ?? (issue.path.map(String).join(' · ') || 'Formulario')
  if (issue.code === 'too_small') return `${label}: mínimo ${String(issue.minimum ?? '?')} caracteres`
  if (issue.code === 'too_big') return `${label}: máximo ${String(issue.maximum ?? '?')} caracteres`
  if (issue.code === 'invalid_format') return `${label}: formato inválido (solo minúsculas, números y guiones)`
  if (issue.code === 'invalid_type') return `${label}: campo requerido`
  return `${label}: valor inválido`
}

/** Excerpt fallback: primeras ~160 chars del contenido */
export function excerptFromHtml(html: string, maxLen = 160): string {
  const text = stripHtml(html)
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).replace(/\s+\S*$/, '') + '…'
}
