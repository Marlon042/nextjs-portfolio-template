'use server'

import { supabase } from '@/lib/supabase'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export interface Icon {
  id: string
  label: string
  category: string
  svg_content: string | null
  is_bundled: boolean
}

export async function getIcons() {
  const { data } = await supabase.from('icons').select('*').order('id')
  return (data ?? []) as Icon[]
}

export async function getIcon(id: string) {
  const { data } = await supabase.from('icons').select('*').eq('id', id).single()
  return data as Icon | null
}

export async function createIcon(input: { id: string; label: string; category: string; svg_content?: string }) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('icons')
    .insert([{ ...input, is_bundled: false }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateIcon(id: string, input: { label?: string; category?: string; svg_content?: string }) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('icons')
    .update({ ...input })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteIcon(id: string) {
  const admin = getSupabaseAdmin()
  const { error } = await admin.from('icons').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
