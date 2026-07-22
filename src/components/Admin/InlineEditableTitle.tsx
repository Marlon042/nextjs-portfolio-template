'use client'

import { useState, useRef, useEffect } from 'react'
import { upsertTranslation } from '@/actions/translations'
import { useLanguage } from '@/context/LanguageContext'

interface InlineEditableTitleProps {
  translationKey: string
  className?: string
}

export default function InlineEditableTitle({ translationKey, className = '' }: InlineEditableTitleProps) {
  const { t, lang } = useLanguage()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(t(translationKey))
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValue(t(translationKey))
  }, [t, translationKey])

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const handleSave = async () => {
    if (!value.trim() || value === t(translationKey)) {
      setEditing(false)
      return
    }
    setSaving(true)
    try {
      await upsertTranslation(translationKey, lang, value.trim())
      setEditing(false)
    } catch {
      setValue(t(translationKey))
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') {
      setValue(t(translationKey))
      setEditing(false)
    }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="rounded border border-[#5565e8] bg-[#0d1a3b] px-2 py-1 text-lg font-bold text-white outline-none"
        />
        {saving && <span className="text-xs text-[#607b96]">saving...</span>}
      </div>
    )
  }

  return (
    <div
      className={`group relative inline-flex cursor-pointer items-center gap-2 ${className}`}
      onClick={() => setEditing(true)}
    >
      <span>{value}</span>
      <svg
        className="size-4 text-[#607b96] opacity-0 transition-opacity group-hover:opacity-100"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    </div>
  )
}
