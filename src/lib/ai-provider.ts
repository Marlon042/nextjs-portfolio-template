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
  return {
    apiKey,
    // Alias estable: siempre apunta a un Flash soportado (los versionados se retiran)
    model: process.env.AI_MODEL ?? 'gemini-flash-latest',
  }
}

async function callGemini(system: string, user: string): Promise<string> {
  const { apiKey, model } = getConfig()
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
    if (res.status === 429) throw new Error('Cupo gratuito excedido por hoy, intenta mañana')
    if (res.status === 503) throw new Error('La IA está saturada ahora mismo, intenta de nuevo en unos minutos')
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

/** Extrae JSON aunque venga envuelto en ```json ... ``` */
function parseDraft(text: string): AiDraft {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim()
  const parsed = JSON.parse(cleaned) as Partial<AiDraft>
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
