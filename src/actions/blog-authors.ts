'use server'

import { supabase } from '@/lib/supabase'

export async function getAuthors() {
  const { data, error } = await supabase
    .from('blog_authors')
    .select('*')
    .order('name')
  if (error) throw new Error(error.message)
  return data ?? []
}
