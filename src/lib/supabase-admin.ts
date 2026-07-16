import { createClient } from '@supabase/supabase-js'

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Supabase admin configuration is incomplete. Set SUPABASE_SERVICE_ROLE_KEY in .env.local',
    )
  }

  return createClient(url, key)
}
