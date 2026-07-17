import { Project, Testimonial } from '@/lib/types'
import { getSupabaseServer } from '@/lib/supabase-server'

const getAllProjects = async (): Promise<Project[]> => {
  try {
    const supabase = getSupabaseServer()
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('priority', { ascending: true })
    return data ?? []
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

const getAllTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const supabase = getSupabaseServer()
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
    return data ?? []
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }
}

export { getAllProjects, getAllTestimonials }
