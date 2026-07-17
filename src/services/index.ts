import { Project, Testimonial } from '@/lib/types'
import { getSupabaseServer } from '@/lib/supabase-server'

const getAllProjects = async (): Promise<Project[]> => {
  try {
    const supabase = getSupabaseServer()
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('priority', { ascending: true })

    if (!data) return []

    return (data as Record<string, any>[]).map((item) => ({
      id: item.id,
      title: item.title,
      shortDescription: item.short_description,
      priority: item.priority,
      cover: item.cover_url,
      cover_url: item.cover_url,
      livePreview: item.live_preview_url,
      githubLink: item.github_link,
      visitors: item.visitors ?? '',
      earned: item.earned ?? '',
      githubStars: item.github_stars ?? '',
      ratings: item.ratings ?? '',
      numberOfSales: item.number_of_sales ?? '',
      type: item.type,
      siteAge: item.site_age ?? '',
    }))
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
