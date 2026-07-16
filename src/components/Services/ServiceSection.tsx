'use client'

import { serviceData } from '../../appData'
import { useLanguage } from '@/context/LanguageContext'
import SectionHeading from '../SectionHeading/SectionHeading'
import ServiceCard from './ServiceCard'

const ServiceSection = () => {
  const { t } = useLanguage()

  return (
    <section id="services" className="my-14">
      <SectionHeading
        title=""
        subtitle=""
      />

      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 md:mt-[3.75rem] md:grid-cols-3">
        {serviceData.map((service, index) => (
          <ServiceCard
            key={index}
            icon={service.icon}
            title={t(`services.${index}.title`)}
            shortDescription={t(`services.${index}.desc`)}
          />
        ))}
      </div>
    </section>
  )
}

export default ServiceSection
