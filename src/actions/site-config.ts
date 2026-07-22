'use server'

import { supabase } from '@/lib/supabase'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function getSiteConfig() {
  const { data } = await supabase.from('site_config').select('key, value')
  const config: Record<string, any> = {}
  if (data) {
    (data as { key: string; value: any }[]).forEach((item) => {
      config[item.key] = item.value
    })
  }
  return config
}

export async function updateSiteConfig(key: string, value: any) {
  const admin = getSupabaseAdmin()
  const { error } = await admin
    .from('site_config')
    .upsert({ key, value }, { onConflict: 'key' })

  if (error) throw new Error(error.message)
}
