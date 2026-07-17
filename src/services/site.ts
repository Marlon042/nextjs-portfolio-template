import { getSupabaseServer } from '@/lib/supabase-server'

export interface Skill {
  id: string
  name: string
  icon_id: string
  display_order: number
}

export interface Section {
  id: string
  identifier: string
  section_type: string
  display_order: number
  is_active: boolean
}

export interface SectionItem {
  id: string
  section_id: string
  icon_id: string
  display_order: number
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon_id: string
  display_order: number
}

export interface FooterLink {
  id: string
  title: string
  href: string
  display_order: number
}

export interface Theme {
  id: string
  name: string
  colors: string[]
  is_active: boolean
}

export interface SiteConfig {
  id: string
  key: string
  value: any
}

export async function getSkills(): Promise<Skill[]> {
  const supabase = getSupabaseServer()
  const { data } = await supabase.from('skills').select('*').order('display_order')
  return data ?? []
}

export async function getSections(): Promise<Section[]> {
  const supabase = getSupabaseServer()
  const { data } = await supabase.from('sections').select('*').order('display_order')
  return data ?? []
}

export async function getSectionItems(sectionId: string): Promise<SectionItem[]> {
  const supabase = getSupabaseServer()
  const { data } = await supabase
    .from('section_items')
    .select('*')
    .eq('section_id', sectionId)
    .order('display_order')
  return data ?? []
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const supabase = getSupabaseServer()
  const { data } = await supabase.from('social_links').select('*').order('display_order')
  return data ?? []
}

export async function getFooterLinks(): Promise<FooterLink[]> {
  const supabase = getSupabaseServer()
  const { data } = await supabase.from('footer_links').select('*').order('display_order')
  return data ?? []
}

export async function getThemes(): Promise<Theme[]> {
  const supabase = getSupabaseServer()
  const { data } = await supabase.from('themes').select('*')
  return data ?? []
}

export async function getSiteConfig(): Promise<Record<string, any>> {
  const supabase = getSupabaseServer()
  const { data } = await supabase.from('site_config').select('key, value')
  const config: Record<string, any> = {}
  if (data) {
    (data as { key: string; value: any }[]).forEach((item) => { config[item.key] = item.value })
  }
  return config
}
