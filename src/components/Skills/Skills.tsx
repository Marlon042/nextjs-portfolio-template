'use client'
import { useEffect, useState, useRef } from 'react'
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

const IconRenderer = ({ iconId, name }: { iconId: string; name: string }) => {
  const BundledIcon = iconMap[iconId]
  if (BundledIcon) {
    return <BundledIcon className="mx-2 size-11 lg:size-14" />
  }
  const svgContent = customSvgCache.get(iconId)
  if (svgContent) {
    return <span className="mx-2 inline-flex size-11 items-center justify-center lg:size-14 text-current" dangerouslySetInnerHTML={{ __html: svgContent }} />
  }
  return <span className="mx-2 text-xs text-[#607b96]">?</span>
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const { t } = useLanguage()
  const [marqueeDuration, setMarqueeDuration] = useState(20000)
  const cacheLoaded = useRef(false)

  useEffect(() => {
    if (cacheLoaded.current) return
    cacheLoaded.current = true

    Promise.all([
      getSiteConfig(),
      getIcons(),
    ]).then(([config, icons]) => {
      if (config.marquee_duration) setMarqueeDuration(config.marquee_duration)
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
      <MarqueeWrapper duration={marqueeDuration} className="from-primary to-primary via-marquee bg-linear-to-r">
        <div className="flex gap-8 lg:gap-24">
          {skills.map(({ name, icon_id }, index) => (
            <span key={index} className="font-inter text-primary-content flex items-center text-xs lg:text-base">
              <IconRenderer iconId={icon_id} name={name} />
              {name}
            </span>
          ))}
        </div>
      </MarqueeWrapper>
    </section>
  )
}

export default Skills
