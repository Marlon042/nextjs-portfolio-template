'use client'

import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { languages, Language } from '@/i18n/translations'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: ReactNode
}

const translationCache = new Map<string, Record<string, string>>()

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [lang, setLang] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)
  const [dict, setDict] = useState<Record<string, string>>({})
  const loadingRef = useRef(false)

  const loadTranslations = useCallback(async (language: Language) => {
    if (translationCache.has(language)) {
      setDict(translationCache.get(language)!)
      return
    }

    if (loadingRef.current) return
    loadingRef.current = true

    const { data } = await supabase
      .from('translations')
      .select('key, value')
      .eq('language', language)

    const map: Record<string, string> = {}
    if (data) {
      (data as { key: string; value: string }[]).forEach((item) => { map[item.key] = item.value })
    }

    translationCache.set(language, map)
    setDict(map)
    loadingRef.current = false
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language | null
    const initial = saved && languages.some((l) => l.code === saved) ? saved : 'en'
    setLang(initial)
    loadTranslations(initial)
    setMounted(true)
  }, [loadTranslations])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('language', lang)
      document.documentElement.lang = lang
      loadTranslations(lang)
    }
  }, [lang, mounted, loadTranslations])

  const t = (key: string): string => {
    return dict[key] || key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
