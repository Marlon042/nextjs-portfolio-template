'use client'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { iconMap } from '@/utils/iconMap'
import { useLanguage } from '@/context/LanguageContext'
import { getSiteConfig } from '@/actions/site-config'
import { getIcons } from '@/actions/icons'
import SectionHeading from '../SectionHeading/SectionHeading'

const MarqueeWrapper = dynamic(() => import('../Marquee/MarqueeWrapper'), { ssr: false })

type SkillsProps = {
  skills: { name: string; icon_id: string }[]
}

const customSvgCache = new Map<string, string>()

const IconRenderer = ({ iconId, size = 'sm' }: { iconId: string; size?: 'sm' | 'lg' }) => {
  const BundledIcon = iconMap[iconId]
  const cls = size === 'lg' ? 'mx-2 size-11 lg:size-14' : 'size-8 shrink-0 lg:size-10'
  if (BundledIcon) {
    return <BundledIcon className={cls} />
  }
  const svgContent = customSvgCache.get(iconId)
  if (svgContent) {
    return <span className={`inline-flex items-center justify-center text-current ${cls}`} dangerouslySetInnerHTML={{ __html: svgContent }} />
  }
  return null
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const { t } = useLanguage()
  const [mode, setMode] = useState<'marquee' | 'grid'>('marquee')
  const [marqueeDuration, setMarqueeDuration] = useState(20000)
  const initLoaded = useRef(false)

  useEffect(() => {
    if (initLoaded.current) return
    initLoaded.current = true

    Promise.all([
      getSiteConfig(),
      getIcons(),
    ]).then(([config, icons]) => {
      if (config.marquee_duration) setMarqueeDuration(config.marquee_duration)
      if (config.skills_display_mode) setMode(config.skills_display_mode)
      icons.forEach((icon) => {
        if (!icon.is_bundled && icon.svg_content) {
          customSvgCache.set(icon.id, icon.svg_content)
        }
      })
    })
  }, [])

  return (
    <section id="skills">
      <div className="mx-auto my-8 max-w-[1200px] px-4 md:my-[3.75rem]">
        <SectionHeading title={t('skills.title')} />
      </div>
      {mode === 'marquee' ? (
        <MarqueeWrapper duration={marqueeDuration} className="from-primary to-primary via-marquee bg-linear-to-r">
          <div className="flex gap-8 lg:gap-24">
            {skills.map(({ name, icon_id }, index) => (
              <span key={index} className="font-inter text-primary-content flex items-center text-xs lg:text-base">
                <IconRenderer iconId={icon_id} size="lg" />
                {name}
              </span>
            ))}
          </div>
        </MarqueeWrapper>
      ) : (
        <div className="from-primary to-primary via-marquee bg-linear-to-r">
          <div className="mx-auto flex max-w-[1200px] flex-wrap justify-center gap-4 px-4 py-6 lg:gap-6 lg:py-8">
            {skills.map(({ name, icon_id }, index) => (
              <div key={index} className="flex items-center gap-2 rounded-lg border border-[#607b96]/20 bg-[#0d1a3b]/50 px-3 py-2 lg:px-4 lg:py-3">
                <IconRenderer iconId={icon_id} />
                <span className="text-primary-content text-xs font-medium lg:text-sm">{name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default Skills
