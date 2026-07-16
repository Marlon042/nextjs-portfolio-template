'use client'

import { useLanguage } from '@/context/LanguageContext'
import { languages } from '@/i18n/translations'
import { useState, useRef, useEffect } from 'react'
import { GlobeIcon } from '@/utils/icons'

const LanguageSwitcher = () => {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const current = languages.find((l) => l.code === lang)

  return (
    <div ref={ref} className="fixed right-6 bottom-20 z-50 md:right-6 md:bottom-26">
      <button
        onClick={() => setOpen(!open)}
        className="bg-neutral cursor-pointer rounded-full p-1 md:p-1.5">
        <div className="bg-primary flex items-center gap-1 rounded-full px-2 py-0.5 md:px-3 md:py-1">
          <GlobeIcon className="h-4 w-4 md:h-5 md:w-5" />
          <span className="text-primary-content text-xs font-medium md:text-sm">
            {current?.label || 'EN'}
          </span>
        </div>
      </button>
      {open && (
        <div className="bg-secondary border-border animate-fade-in absolute bottom-full left-0 z-20 mb-2 min-w-[120px] rounded-lg border py-1 shadow-lg">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code)
                setOpen(false)
              }}
              className={`w-full cursor-pointer px-4 py-2 text-left text-sm transition-colors duration-150 ${
                lang === l.code
                  ? 'text-accent cursor-default'
                  : 'text-tertiary-content hover:text-neutral hover:bg-neutral/5'
              }`}>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher
