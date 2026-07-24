'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Project } from '@/lib/types'
import { useLanguage } from '@/context/LanguageContext'
import SectionHeading from '../SectionHeading/SectionHeading'
import ProjectCard from './ProjectCard'
import ProjectSkeleton from './ProjectSkeleton'

const ProjectSection: React.FC = () => {
  const { t } = useLanguage()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('priority', { ascending: true })

      if (!data) return

      setProjects(
        (data as Record<string, any>[]).map((item) => ({
          id: item.id,
          title: item.title,
          shortDescription: item.short_description,
          priority: item.priority,
          cover: item.cover_url,
          cover_url: item.cover_url,
          livePreview: item.live_preview_url,
          githubLink: item.github_link,
          gallery_urls: item.gallery_urls ?? [],
          visitors: item.visitors ?? '',
          earned: item.earned ?? '',
          githubStars: item.github_stars ?? '',
          ratings: item.ratings ?? '',
          numberOfSales: item.number_of_sales ?? '',
          type: item.type,
          siteAge: item.site_age ?? '',
        })),
      )
      setLoading(false)
    }

    fetchProjects()
  }, [])

  return (
    <section id="projects">
      <SectionHeading title={t('projects.title')} />

      {loading ? (
        <div className="my-8 grid grid-cols-1 gap-8 md:my-12 md:grid-cols-2">
          {[1, 2].map((i) => <ProjectSkeleton key={i} />)}
        </div>
      ) : projects.length === 0 ? (
        <p className="my-8 text-sm text-[#607b96] md:my-12">No projects yet.</p>
      ) : (
        <div className="my-8 grid grid-cols-1 gap-8 md:my-12 md:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard key={project.id || project.title} data={project} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}

export default ProjectSection
