'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Project } from '@/lib/types'
import { useLanguage } from '@/context/LanguageContext'
import { ChevronRightIcon } from '@/utils/icons'
import SectionHeading from '../SectionHeading/SectionHeading'
import ProjectCard from './ProjectCard'

const ProjectsAccordion: React.FC = () => {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [count, setCount] = useState<number | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    supabase
      .from('projects')
      .select('id', { count: 'exact', head: true })
      .then(({ count: c }) => setCount(c ?? 0))
  }, [])

  useEffect(() => {
    if (!open || loaded || fetching) return
    setFetching(true)

    supabase
      .from('projects')
      .select('*')
      .order('priority', { ascending: true })
      .then(({ data }) => {
        if (data) {
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
              visitors: item.visitors ?? '',
              earned: item.earned ?? '',
              githubStars: item.github_stars ?? '',
              ratings: item.ratings ?? '',
              numberOfSales: item.number_of_sales ?? '',
              type: item.type,
              siteAge: item.site_age ?? '',
            })),
          )
        }
        setLoaded(true)
        setFetching(false)
      })
  }, [open, loaded, fetching])

  return (
    <section id="projects" className="my-14">
      <button
        onClick={() => setOpen(!open)}
        className="group flex w-full items-center justify-between rounded-lg border border-[#607b96]/20 bg-[#0d1a3b]/50 p-4 text-left transition hover:border-[#607b96]/40 md:rounded-xl md:p-5"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-white md:text-xl">
            {t('projects.title')}
          </span>
          {count !== null && (
            <span className="flex size-6 items-center justify-center rounded-full bg-[#5565e8] text-xs font-bold text-white">
              {count}
            </span>
          )}
        </div>
        <ChevronRightIcon
          className={`size-5 text-[#607b96] transition-transform duration-300 md:size-6 ${
            open ? 'rotate-90' : ''
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-500 ease-in-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pt-6">
            {fetching && !loaded ? (
              <p className="text-sm text-[#607b96]">Loading projects...</p>
            ) : projects.length === 0 ? (
              <p className="text-sm text-[#607b96]">No projects yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {projects.map((project) => (
                  <ProjectCard key={project.id || project.title} data={project} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProjectsAccordion
