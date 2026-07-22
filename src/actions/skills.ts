'use server'

import { supabase } from '@/lib/supabase'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

interface SkillInput {
  name: string
  icon_id: string
  display_order: number
}

export async function getSkills() {
  const { data } = await supabase
    .from('skills')
    .select('*')
    .order('display_order', { ascending: true })
  return data ?? []
}

export async function getSkill(id: string) {
  const { data } = await supabase
    .from('skills')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

export async function createSkill(input: SkillInput) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('skills')
    .insert([{ ...input }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateSkill(id: string, input: Partial<SkillInput>) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('skills')
    .update({ ...input })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteSkill(id: string) {
  const admin = getSupabaseAdmin()
  const { error } = await admin
    .from('skills')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
