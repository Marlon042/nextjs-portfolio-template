'use server'

import { supabase } from '@/lib/supabase'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export interface Section {
  id: string
  identifier: string
  section_type: string
  display_order: number
  is_active: boolean
}

export interface SectionWithMeta extends Section {
  count?: number
}

export interface SectionItem {
  id: string
  section_id: string
  icon_id: string
  display_order: number
}

export interface ItemTranslation {
  id: string
  item_id: string
  language: string
  title: string
  description: string
}

// ─── Sections ───

export async function getSections() {
  const { data } = await supabase
    .from('sections')
    .select('*')
    .order('display_order')
  return (data ?? []) as Section[]
}

export async function getSection(id: string) {
  const { data } = await supabase
    .from('sections')
    .select('*')
    .eq('id', id)
    .single()
  return data as Section | null
}

export async function createSection(input: { identifier: string; section_type: string; display_order: number }) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('sections')
    .insert([{ ...input, is_active: true }])
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateSection(id: string, input: Partial<{ section_type: string; display_order: number; is_active: boolean }>) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('sections')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteSection(id: string) {
  const admin = getSupabaseAdmin()
  const { error } = await admin.from('sections').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ─── Section Items ───

export async function getSectionItems(sectionId: string) {
  const { data } = await supabase
    .from('section_items')
    .select('*')
    .eq('section_id', sectionId)
    .order('display_order')
  return (data ?? []) as SectionItem[]
}

export async function getSectionItem(id: string) {
  const { data } = await supabase
    .from('section_items')
    .select('*')
    .eq('id', id)
    .single()
  return data as SectionItem | null
}

export async function createSectionItem(input: { section_id: string; icon_id: string; display_order: number }) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('section_items')
    .insert([input])
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateSectionItem(id: string, input: { icon_id?: string; display_order?: number }) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('section_items')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteSectionItem(id: string) {
  const admin = getSupabaseAdmin()
  const { error } = await admin.from('section_items').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ─── Item Translations ───

export async function getItemTranslations(itemId: string) {
  const { data } = await supabase
    .from('section_item_translations')
    .select('*')
    .eq('item_id', itemId)
  return (data ?? []) as ItemTranslation[]
}

export async function upsertItemTranslation(input: { item_id: string; language: string; title: string; description: string }) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('section_item_translations')
    .upsert(input, { onConflict: 'item_id,language' })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}
