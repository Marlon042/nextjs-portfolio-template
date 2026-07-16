'use client'

import { computerSupportData } from '../../appData'
import { useLanguage } from '@/context/LanguageContext'
import SectionHeading from '../SectionHeading/SectionHeading'
import ComputerSupportCard from './ComputerSupportCard'

const ComputerSupportSection = () => {
  const { t } = useLanguage()

  return (
    <section id="computer-support" className="my-14">
      <SectionHeading
        title=""
        subtitle=""
      />

      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 md:mt-[3.75rem] md:grid-cols-3">
        {computerSupportData.map((service, index) => (
          <ComputerSupportCard
            key={index}
            icon={service.icon}
            title={t(`support.${index}.title`)}
            shortDescription={t(`support.${index}.desc`)}
          />
        ))}
      </div>
    </section>
  )
}

export default ComputerSupportSection
