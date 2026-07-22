'use server'

import { supabase } from '@/lib/supabase'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function upsertTranslation(key: string, language: string, value: string) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('translations')
    .upsert({ key, language, value }, { onConflict: 'key,language' })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}
