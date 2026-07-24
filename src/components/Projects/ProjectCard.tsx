'use client'

import { Project } from '@/lib/types'
import Image from 'next/image'
import { FC, SVGProps, useState, useEffect, useRef } from 'react'
import { Earning, EyeIcon, GithubIcon, Likes, PreviewIcon, Star, Timer } from '../../utils/icons'

const IconText: React.FC<{ icon: FC<SVGProps<SVGSVGElement>>; text: string }> = ({ icon: Icon, text }) => (
  <li className="flex gap-2">
    <Icon className="size-[18px] md:size-5" />
    <span className="text-neutral text-sm">{text}</span>
  </li>
)

interface ProjectCardProps {
  data: Project
  index?: number
}

const ProjectCard: React.FC<ProjectCardProps> = ({ data, index = 0 }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(0)
  const [visible, setVisible] = useState(false)
  const [galleryIdx, setGalleryIdx] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  const {
    title,
    shortDescription,
    visitors,
    earned,
    ratings,
    githubStars,
    numberOfSales,
    livePreview,
    githubLink,
    siteAge,
    type,
    cover,
    gallery_urls,
  } = data

  const allImages = [cover, ...(gallery_urls ?? [])].filter(Boolean) as string[]
  const hasGallery = allImages.length > 1

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const openLightbox = (idx: number) => {
    setLightboxIdx(idx)
    setLightboxOpen(true)
  }

  return (
    <div
      ref={ref}
      className={`bg-secondary border-border flex flex-col justify-between rounded-[14px] border p-5 transition-all duration-700 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center">
            <h3 className="text-secondary-content text-lg font-medium md:font-semibold">{title}</h3>
            {type && (
              <span
                className={`h-7 w-fit rounded-md bg-[#FFFFFF1A] p-1 text-sm ${type === 'New 🔥' ? 'animate-blink text-tag' : 'text-accent'} backdrop-blur-[80px]`}>
                {type}
              </span>
            )}
          </div>
          <ul className="mt-3 flex flex-col flex-wrap gap-2 sm:flex-row sm:gap-4">
            {(visitors || numberOfSales) && (
              <IconText text={(visitors || numberOfSales)?.toString() || ''} icon={Likes} />
            )}
            {siteAge && <IconText text={siteAge} icon={Timer} />}
            {earned && <IconText text={earned} icon={Earning} />}
            {(ratings || githubStars) && (
              <IconText text={(ratings || githubStars)?.toString() || ''} icon={Star} />
            )}
          </ul>
        </div>
        {cover && (
          <figure
            className="group relative flex cursor-pointer justify-end overflow-hidden rounded-md"
            onClick={() => openLightbox(0)}
          >
            <Image
              src={allImages[galleryIdx] || cover}
              width={150}
              height={80}
              alt="Project Cover"
              className="h-[80px] w-[150px] rounded-md object-cover shadow-[0px_1.66px_3.74px_-1.25px_#18274B1F]"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-1.5 rounded-md bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <EyeIcon className="size-4 text-white" />
              <span className="text-xs font-medium text-white">Ver imagen</span>
            </div>
          </figure>
        )}
      </div>

      <div>
        <div className="bg-primary text-primary-content my-4 rounded-2xl px-4 py-3">
          <p className="text-[14px] font-normal md:text-base">{shortDescription}</p>
        </div>

        {hasGallery && (
          <div className="mb-4">
            <div className="relative overflow-hidden rounded-lg">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${galleryIdx * 100}%)` }}
              >
                {allImages.map((img, i) => (
                  <div key={i} className="min-w-0 shrink-0 grow basis-full">
                    <Image
                      src={img}
                      width={600}
                      height={340}
                      alt={`${title} screenshot ${i + 1}`}
                      className="h-48 w-full cursor-pointer object-cover transition-opacity hover:opacity-90 md:h-56"
                      onClick={() => openLightbox(i)}
                    />
                  </div>
                ))}
              </div>
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setGalleryIdx((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                    className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white transition hover:bg-black/70"
                  >
                    <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button
                    onClick={() => setGalleryIdx((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white transition hover:bg-black/70"
                  >
                    <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                  <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {allImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setGalleryIdx(i)}
                        className={`size-2 rounded-full transition ${
                          i === galleryIdx ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-5">
          {livePreview && (
            <a
              href={livePreview}
              className="text-accent flex gap-2 text-sm underline underline-offset-[3px] transition-all duration-75 ease-linear hover:scale-105 md:text-base"
              target="_blank">
              <PreviewIcon className="h-auto w-[18px] md:w-5" />
              <span>Live Preview</span>
            </a>
          )}
          {githubLink && (
            <a
              href={githubLink}
              className="text-accent flex gap-2 text-sm underline underline-offset-[3px] transition-all duration-75 ease-linear hover:scale-105 md:text-base"
              target="_blank">
              <GithubIcon className="w-[18px] md:w-5" />
              <span>Github Link</span>
            </a>
          )}
        </div>
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 text-2xl text-white hover:text-gray-300"
          >
            ✕
          </button>
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIdx((prev) => (prev === 0 ? allImages.length - 1 : prev - 1)) }}
                className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
              >
                <svg className="size-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIdx((prev) => (prev === allImages.length - 1 ? 0 : prev + 1)) }}
                className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
              >
                <svg className="size-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}
          <Image
            src={allImages[lightboxIdx]}
            width={1200}
            height={800}
            alt={title}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

export default ProjectCard
