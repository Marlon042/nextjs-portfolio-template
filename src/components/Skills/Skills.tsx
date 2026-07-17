'use client'
import dynamic from 'next/dynamic'
import { iconMap } from '@/utils/iconMap'

const MarqueeWrapper = dynamic(() => import('../Marquee/MarqueeWrapper'), { ssr: false })

type SkillsProps = {
  skills: { name: string; icon_id: string }[]
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  return (
    <MarqueeWrapper className="from-primary to-primary via-marquee bg-linear-to-r">
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
  )
}

export default Skills
