'use client'

import { useSectionContext } from '@/context/SectionContext'
import ServiceSection from './Services/ServiceSection'

export default function ClientServiceSection() {
  const { showServices } = useSectionContext()

  return showServices ? <ServiceSection /> : null
}