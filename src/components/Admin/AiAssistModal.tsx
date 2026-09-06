'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { BlogLanguage } from '@/utils/blog'

export interface AiDraftData {
  title: string
  excerpt: string
  content_html: string
  tags: string[]
}

interface AiAssistModalProps {
  open: boolean
  onClose: () => void
  /** Tab activo del form: ahí se aplica lo generado */
  activeLang: BlogLanguage
  /** Lee el contenido actual del form (para modo traducir) */
  getSource: (lang: BlogLanguage) => { title: string; excerpt: string; content_html: string }
  /** Vuelca el borrador al form (el padre genera el content_json) */
  onApply: (lang: BlogLanguage, draft: AiDraftData) => void
}

type Mode = 'generar' | 'traducir'

export default function AiAssistModal({ open, onClose, activeLang, getSource, onApply }: AiAssistModalProps) {
  const [mode, setMode] = useState<Mode>('generar')
  const [topic, setTopic] = useState('')
  const [detail, setDetail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<AiDraftData | null>(null)

  if (!open) return null

  const targetLang: BlogLanguage = mode === 'generar' ? activeLang : 'en'

  const handleGenerate = async () => {
    setError('')
    setPreview(null)

    if (mode === 'generar' && topic.trim().length < 3) {
      setError('Escribe un tema de al menos 3 caracteres')
      return
    }
    if (mode === 'traducir') {
      const src = getSource('es')
      if (src.title.trim().length < 5 || src.content_html.replace(/<[^>]*>/g, '').trim().length < 50) {
        setError('Para traducir, el tab ES necesita título y contenido')
        return
      }
    }

    setLoading(true)
    try {
      const { data: session } = await supabase.auth.getSession()
      const token = session.session?.access_token
      if (!token) throw new Error('Sesión expirada: recarga el admin e inicia sesión de nuevo')

      const body =
        mode === 'generar'
          ? { mode, topic: topic.trim(), detail: detail.trim() || undefined }
          : { mode, source: getSource('es') }

      const res = await fetch('/api/blogs/ai-assist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? `Error ${res.status}`)
      setPreview(json as AiDraftData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generando con IA')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = () => {
    if (!preview) return
    onApply(targetLang, preview)
    setPreview(null)
    setTopic('')
    setDetail('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-[#607b96] bg-[#0d1a3b] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-white">✨ Asistente IA (Gemini)</h3>
          <button type="button" onClick={onClose} className="text-[#607b96] transition hover:text-white">
            ✕
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          {(['generar', 'traducir'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m)
                setPreview(null)
                setError('')
              }}
              className={`rounded px-4 py-1.5 text-sm font-semibold capitalize transition ${
                mode === m ? 'bg-[#5565e8] text-white' : 'border border-[#607b96] text-[#607b96] hover:text-white'
              }`}
            >
              {m === 'generar' ? 'Generar borrador' : 'Traducir ES → EN'}
            </button>
          ))}
        </div>

        {mode === 'generar' ? (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm text-[#607b96]" htmlFor="ai-topic">
                Tema del artículo * (se aplicará al tab {activeLang.toUpperCase()})
              </label>
              <input
                id="ai-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ej: cómo optimizar imágenes en Next.js"
                className="w-full rounded border border-[#607b96] bg-[#011627] px-3 py-2 text-white outline-none focus:border-[#18f2e5]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#607b96]" htmlFor="ai-detail">
                Detalles opcionales (puntos a cubrir, tono, audiencia…)
              </label>
              <textarea
                id="ai-detail"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                rows={2}
                placeholder="Ej: enfocado en Cloudinary, con ejemplos de código"
                className="w-full rounded border border-[#607b96] bg-[#011627] px-3 py-2 text-white outline-none focus:border-[#18f2e5]"
              />
            </div>
          </div>
        ) : (
          <p className="rounded border border-[#607b96]/40 bg-[#011627] p-3 text-sm text-[#607b96]">
            Traduce el contenido actual del tab <b className="text-white">ES</b> al inglés y lo aplica al tab{' '}
            <b className="text-white">EN</b>. Revisa el ES antes de generar.
          </p>
        )}

        {error && <p className="mt-3 rounded bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="mt-4 w-full rounded bg-[#5565e8] px-4 py-2 font-semibold text-white transition hover:bg-[#4555d8] disabled:opacity-50"
        >
          {loading ? 'Generando… (puede tardar ~30s)' : mode === 'generar' ? 'Generar borrador' : 'Traducir al inglés'}
        </button>

        {preview && (
          <div className="mt-4 rounded border border-[#18f2e5]/40 p-4">
            <p className="mb-2 text-xs font-semibold text-[#18f2e5]">
              VISTA PREVIA → se aplicará al tab {targetLang.toUpperCase()}
            </p>
            <h4 className="mb-1 font-bold text-white">{preview.title}</h4>
            <p className="mb-3 text-sm text-[#607b96] italic">{preview.excerpt}</p>
            <div
              className="blog-prose !min-h-0 max-h-64 overflow-y-auto rounded bg-[#011627] !p-3 text-sm"
              dangerouslySetInnerHTML={{ __html: preview.content_html }}
            />
            {preview.tags.length > 0 && (
              <p className="mt-2 text-xs text-[#607b96]">Tags: {preview.tags.join(', ')}</p>
            )}
            <button
              type="button"
              onClick={handleApply}
              className="mt-3 w-full rounded bg-[#18f2e5]/20 px-4 py-2 font-semibold text-[#18f2e5] transition hover:bg-[#18f2e5]/30"
            >
              Aplicar al formulario
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
