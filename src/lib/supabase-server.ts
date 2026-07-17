import { createClient } from '@supabase/supabase-js'

let serverClient: ReturnType<typeof createClient> | null = null

export function getSupabaseServer() {
  if (serverClient) return serverClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Supabase env vars not configured')
  }

  serverClient = createClient(url, key)
  return serverClient
}
