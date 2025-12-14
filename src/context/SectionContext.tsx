'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface SectionContextType {
  showServices: boolean
  toggleServices: () => void
}

const SectionContext = createContext<SectionContextType | undefined>(undefined)

export const useSectionContext = () => {
  const context = useContext(SectionContext)
  if (!context) {
    throw new Error('useSectionContext must be used within a SectionProvider')
  }
  return context
}

interface SectionProviderProps {
  children: ReactNode
}

export const SectionProvider = ({ children }: SectionProviderProps) => {
  const [showServices, setShowServices] = useState(true)

  const toggleServices = () => {
    setShowServices(!showServices)
  }

  return (
    <SectionContext.Provider value={{ showServices, toggleServices }}>
      {children}
    </SectionContext.Provider>
  )
}