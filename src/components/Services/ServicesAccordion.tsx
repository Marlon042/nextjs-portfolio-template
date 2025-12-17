'use client'

import { useSectionContext } from '@/context/SectionContext'
import { ChevronRightIcon } from '@/utils/icons'
import ServiceSection from './ServiceSection'

export default function ServicesAccordion() {
  const { showServices, toggleServices } = useSectionContext()

  return (
    <div className="my-14">
      {/* Accordion Header */}
      <div
        onClick={toggleServices}
        className="bg-base-100 border-border cursor-pointer rounded-lg border p-4 md:rounded-xl md:p-5 transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg md:text-xl font-semibold">
            // Full Stack development
          </h3>
          <ChevronRightIcon
            className={`h-5 w-5 md:h-6 md:w-6 transition-transform duration-300 ${
              showServices ? 'rotate-90' : ''
            }`}
          />
        </div>
        <p className="text-sm md:text-base text-base-content/70 mt-1">
          I offer a wide range of services to ensure you have the best written code and stay ahead in the competition
        </p>
      </div>

      {/* Accordion Content */}
      {showServices && (
        <div className="animate-fade-in">
          <ServiceSection />
        </div>
      )}
    </div>
  )
}
