'use client'

import { useLanguage } from '@/context/LanguageContext'
import { languages } from '@/i18n/translations'
import { useState, useRef, useEffect } from 'react'
import { GlobeIcon } from '@/utils/icons'

interface LanguageSwitcherProps {
  variant?: 'floating' | 'inline'
}

const LanguageSwitcher = ({ variant = 'floating' }: LanguageSwitcherProps) => {
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
    <div ref={ref} className={variant === 'floating' ? 'fixed right-6 bottom-20 z-50 md:right-6 md:bottom-26' : 'relative z-50'}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
          variant === 'floating'
            ? 'bg-neutral cursor-pointer rounded-full p-1 md:p-1.5'
            : 'cursor-pointer border border-[#607b96]/40 bg-[#1e2d50] text-white hover:bg-[#2a3d6b]'
        }`}>
        {variant === 'floating' ? (
          <div className="bg-primary flex items-center gap-1 rounded-full px-2 py-0.5 md:px-3 md:py-1">
            <GlobeIcon className="h-4 w-4 md:h-5 md:w-5" />
            <span className="text-primary-content text-xs font-medium md:text-sm">
              {current?.label || 'ES'}
            </span>
          </div>
        ) : (
          <>
            <GlobeIcon className="size-4 shrink-0" />
            <span>{current?.label || 'ES'}</span>
          </>
        )}
      </button>
      {open && (
        <div className={`z-50 min-w-[140px] rounded-lg border border-[#607b96]/30 bg-[#0d1a3b] py-1 shadow-lg ${
          variant === 'floating'
            ? 'absolute bottom-full left-0 mb-2'
            : 'absolute bottom-full left-0 mb-2'
        }`}>
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code)
                setOpen(false)
              }}
              className={`w-full cursor-pointer px-4 py-2 text-left text-sm transition-colors duration-150 ${
                lang === l.code
                  ? 'text-[#5565e8] cursor-default'
                  : 'text-[#a0b3cc] hover:bg-[#1e2d50] hover:text-white'
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
