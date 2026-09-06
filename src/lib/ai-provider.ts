/**
 * Cliente server-only para Gemini (AI Studio, tier gratuito).
 * Sin SDK: usa la API REST nativa `generateContent` con modo JSON.
 * NUNCA importar en client components — la key vive solo en el server.
 */

export interface AiDraft {
  title: string
  excerpt: string
  content_html: string
  tags: string[]
}

const ALLOWED_HTML = 'h2, h3, p, ul, ol, li, blockquote, pre, code, strong, em, a'

const GENERAR_SYSTEM = `Eres un redactor técnico senior que escribe para el blog de un desarrollador full-stack.
Responde ÚNICAMENTE con un objeto JSON válido (sin markdown, sin explicaciones, sin texto extra) con estas claves:
- "title": string de 30 a 110 caracteres, atractivo y con valor SEO.
- "excerpt": string de 80 a 220 caracteres, 1 o 2 frases que resuman el artículo.
- "content_html": string con el artículo completo de 400 a 700 palabras. Usa SOLO estas etiquetas HTML: ${ALLOWED_HTML}. Empieza con un <h2>. Incluye al menos una lista y, si el tema lo permite, un bloque <pre><code>.
- "tags": array de 2 a 4 strings en minúsculas, sin espacios (usa guiones).
Escribe todo en español.`

const TRADUCIR_SYSTEM = `Eres un traductor profesional de español a inglés especializado en contenido técnico.
Recibirás un objeto JSON con "title", "excerpt" y "content_html" en español.
Devuelve ÚNICAMENTE un objeto JSON válido (sin markdown ni explicaciones) con las mismas claves traducidas al inglés.
Reglas: traducción fiel, no resumas ni añadas contenido; conserva TODAS las etiquetas HTML y su estructura exacta; conserva bloques de código intactos (no traduzcas código).`

interface GeminiPart {
  text?: string
}

interface GeminiResponse {
  candidates?: { content?: { parts?: GeminiPart[] } }[]
  error?: { message?: string }
}

function getConfig() {
  const apiKey = process.env.AI_GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('Falta AI_GEMINI_API_KEY en .env.local (gratis en AI Studio)')
  }
  const primary = process.env.AI_MODEL ?? 'gemini-flash-latest'
  // Fallback automático: los Lite tienen más cupo y otros responden cuando el principal satura
  const fallbacks = ['gemini-flash-lite-latest', 'gemini-3.5-flash-lite', 'gemini-3.6-flash']
  return { apiKey, models: [primary, ...fallbacks.filter((m) => m !== primary)] }
}

class RetryableError extends Error {}

async function tryModel(apiKey: string, model: string, system: string, user: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60000)

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ parts: [{ text: user }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          maxOutputTokens: 3000,
          temperature: 0.7,
        },
      }),
    })

    if (res.status === 400) throw new Error('Petición rechazada por la IA (revisa el tema e intenta de nuevo)')
    if (res.status === 403) throw new Error('API key inválida o sin acceso (verifica AI_GEMINI_API_KEY)')
    if (res.status === 404) throw new RetryableError(`Modelo ${model} no disponible`)
    if (res.status === 429) throw new RetryableError('Cupo excedido en este modelo')
    if (res.status === 503) throw new RetryableError('Modelo saturado')
    if (!res.ok) throw new Error(`La IA respondió con error ${res.status}`)

    const json = (await res.json()) as GeminiResponse
    if (json.error) throw new Error(json.error.message ?? 'Error de la IA')
    const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? ''
    if (!text.trim()) throw new Error('La IA devolvió una respuesta vacía')
    return text
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('La IA tardó demasiado (timeout 60s), intenta de nuevo')
    }
    throw err instanceof Error ? err : new Error('Error llamando a la IA')
  } finally {
    clearTimeout(timeout)
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function callGemini(system: string, user: string): Promise<string> {
  const { apiKey, models } = getConfig()
  let lastRetryable: string | null = null

  for (const model of models) {
    try {
      return await tryModel(apiKey, model, system, user)
    } catch (err) {
      if (!(err instanceof RetryableError)) throw err
      lastRetryable = err.message
      await sleep(1500)
    }
  }

  throw new Error(
    lastRetryable?.includes('Cupo')
      ? 'Cupo gratuito excedido en todos los modelos, intenta mañana'
      : 'La IA está saturada ahora mismo, intenta de nuevo en unos minutos',
  )
}

/**
 * Escapa caracteres de control crudos (\n, \t…) dentro de strings JSON.
 * Los modelos suelen emitirlos en bloques <pre><code> aunque se pida JSON.
 */
function repairJson(text: string): string {
  let out = ''
  let inString = false
  let escaped = false
  for (const ch of text) {
    if (inString) {
      if (escaped) {
        out += ch
        escaped = false
      } else if (ch === '\\') {
        out += ch
        escaped = true
      } else if (ch === '"') {
        out += ch
        inString = false
      } else if (ch === '\n') {
        out += '\\n'
      } else if (ch === '\r') {
        out += '\\r'
      } else if (ch === '\t') {
        out += '\\t'
      } else if (ch < ' ') {
        out += `\\u${ch.charCodeAt(0).toString(16).padStart(4, '0')}`
      } else {
        out += ch
      }
    } else {
      out += ch
      if (ch === '"') inString = true
    }
  }
  return out
}

/** Extrae JSON aunque venga envuelto en ```json ... ``` o con control chars crudos */
function parseDraft(text: string): AiDraft {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim()
  let parsed: Partial<AiDraft>
  try {
    parsed = JSON.parse(cleaned) as Partial<AiDraft>
  } catch {
    try {
      parsed = JSON.parse(repairJson(cleaned)) as Partial<AiDraft>
    } catch {
      throw new Error('La IA devolvió un formato inválido, intenta de nuevo')
    }
  }
  return {
    title: String(parsed.title ?? ''),
    excerpt: String(parsed.excerpt ?? ''),
    content_html: String(parsed.content_html ?? ''),
    tags: Array.isArray(parsed.tags) ? parsed.tags.map(String) : [],
  }
}

export async function generateBlogDraft(topic: string, detail?: string): Promise<AiDraft> {
  const user = detail?.trim()
    ? `Tema: ${topic}\nContexto adicional: ${detail.trim()}`
    : `Tema: ${topic}`
  return parseDraft(await callGemini(GENERAR_SYSTEM, user))
}

export async function translateBlogPost(source: {
  title: string
  excerpt: string
  content_html: string
}): Promise<AiDraft> {
  const draft = parseDraft(
    await callGemini(TRADUCIR_SYSTEM, JSON.stringify(source)),
  )
  return { ...draft, tags: [] }
}
