'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSections, createSection, updateSection, deleteSection, Section } from '@/actions/sections'
import { useLanguage } from '@/context/LanguageContext'

export default function AdminSections() {
  const { t } = useLanguage()
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    getSections().then((data) => { setSections(data); setLoading(false) })
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete section "${name}"? This will delete all its items.`)) return
    try {
      await deleteSection(id)
      setSections((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  const handleToggleActive = async (section: Section) => {
    try {
      const updated = await updateSection(section.id, { is_active: !section.is_active })
      setSections((prev) => prev.map((s) => (s.id === section.id ? updated : s)))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update')
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Sections</h1>
      </div>

      {loading ? (
        <p className="text-[#607b96]">Loading...</p>
      ) : sections.length === 0 ? (
        <p className="text-[#607b96]">No sections found.</p>
      ) : (
        <div className="space-y-3">
          {sections.map((section) => (
            <div key={section.id}
              className="flex items-center justify-between rounded-lg border border-[#607b96]/20 bg-[#0d1a3b] p-4 transition hover:border-[#607b96]/40">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleToggleActive(section)}
                  className={`size-3 rounded-full ${section.is_active ? 'bg-green-400' : 'bg-gray-600'}`}
                  title={section.is_active ? 'Active' : 'Inactive'}
                />
                <div>
                  <h3 className="font-medium text-white">{t(`${section.identifier}.title`)}</h3>
                  <p className="text-xs text-[#607b96]">
                    Type: {section.section_type} · Order: {section.display_order}
                    {section.is_active ? ' · Active' : ' · Inactive'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/admin/sections/${section.id}`)}
                  className="rounded bg-[#5565e8]/20 px-3 py-1 text-sm text-[#5565e8] transition hover:bg-[#5565e8]/30"
                >
                  Edit Items
                </button>
                <button
                  onClick={() => handleDelete(section.id, section.identifier)}
                  className="rounded bg-red-500/20 px-3 py-1 text-sm text-red-400 transition hover:bg-red-500/30"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
