'use server'

import { supabase } from '@/lib/supabase'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { slugify } from '@/utils/blog'

export async function getCategories() {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('display_order')
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function createCategory(input: { slug?: string; name_es: string; name_en: string }) {
  const admin = getSupabaseAdmin()
  const slug = slugify(input.slug || input.name_en)
  const { data, error } = await admin
    .from('blog_categories')
    .insert([{ slug, name_es: input.name_es, name_en: input.name_en }])
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteCategory(id: string) {
  const admin = getSupabaseAdmin()
  const { error } = await admin.from('blog_categories').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
