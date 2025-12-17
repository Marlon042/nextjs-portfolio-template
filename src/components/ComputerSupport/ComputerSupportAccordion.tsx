'use client'

import { useState } from 'react'
import { ChevronRightIcon } from '@/utils/icons'
import ComputerSupportSection from './ComputerSupportSection'

export default function ComputerSupportAccordion() {
  const [showComputerSupport, setShowComputerSupport] = useState(true)

  const handleToggle = () => {
    setShowComputerSupport(!showComputerSupport)
  }

  return (
    <div className="my-14">
      {/* Accordion Header */}
      <div
        onClick={handleToggle}
        className="bg-base-100 border-border cursor-pointer rounded-lg border p-4 md:rounded-xl md:p-5 transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg md:text-xl font-semibold">
            // Computer Support & Maintenance
          </h3>
          <ChevronRightIcon
            className={`h-5 w-5 md:h-6 md:w-6 transition-transform duration-300 ${
              showComputerSupport ? 'rotate-90' : ''
            }`}
          />
        </div>
        <p className="text-sm md:text-base text-base-content/70 mt-1">
          Click to expand/collapse the accordion content
        </p>
      </div>

      {/* Accordion Content */}
      {showComputerSupport && (
        <div className="animate-fade-in">
          <ComputerSupportSection />
        </div>
      )}
    </div>
  )
}
