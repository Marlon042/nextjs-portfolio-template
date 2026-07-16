'use server'

import { supabase } from '@/lib/supabase'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

interface ProjectInput {
  title: string
  short_description: string
  cover_url: string
  type: string
  priority: number
  live_preview_url?: string
  github_link?: string
  visitors?: string
  earned?: string
  github_stars?: string
  ratings?: string
  number_of_sales?: string
  site_age?: string
}

export async function getProjects() {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .order('priority', { ascending: true })
  return data ?? []
}

export async function getProject(id: string) {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

export async function createProject(input: ProjectInput) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('projects')
    .insert([{ ...input }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateProject(id: string, input: Partial<ProjectInput>) {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('projects')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteProject(id: string) {
  const admin = getSupabaseAdmin()
  const { error } = await admin
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
