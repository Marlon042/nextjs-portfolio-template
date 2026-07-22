'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { iconMap } from '@/utils/iconMap'
import { useLanguage } from '@/context/LanguageContext'
import { getSiteConfig } from '@/actions/site-config'
import SectionHeading from '../SectionHeading/SectionHeading'

const MarqueeWrapper = dynamic(() => import('../Marquee/MarqueeWrapper'), { ssr: false })

type SkillsProps = {
  skills: { name: string; icon_id: string }[]
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const { t } = useLanguage()
  const [marqueeDuration, setMarqueeDuration] = useState(20000)

  useEffect(() => {
    getSiteConfig().then((config) => {
      if (config.marquee_duration) setMarqueeDuration(config.marquee_duration)
    })
  }, [])

  return (
    <section id="skills">
      <div className="mx-auto my-8 max-w-[1200px] px-4 md:my-[3.75rem]">
        <SectionHeading title={t('skills.title')} />
      </div>
      <MarqueeWrapper duration={marqueeDuration} className="from-primary to-primary via-marquee bg-linear-to-r">
        <div className="flex gap-8 lg:gap-24">
          {skills.map(({ name, icon_id }, index) => {
            const Icon = iconMap[icon_id]
            return (
              <span
                key={index}
                className="font-inter text-primary-content flex items-center text-xs lg:text-base"
              >
                {Icon ? <Icon className="mx-2 size-11 lg:size-14" /> : null}
                {name}
              </span>
            )
          })}
        </div>
      </MarqueeWrapper>
    </section>
  )
}

export default Skills
