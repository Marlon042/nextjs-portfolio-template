'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSkills, deleteSkill, updateSkill } from '@/actions/skills'
import { getIcons } from '@/actions/icons'
import { iconMap } from '@/utils/iconMap'

interface Skill {
  id: string
  name: string
  icon_id: string
  display_order: number
}

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [customSvgs, setCustomSvgs] = useState<Record<string, string>>({})
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    Promise.all([
      getSkills(),
      getIcons(),
    ]).then(([skillsData, icons]) => {
      setSkills(skillsData)
      const svgMap: Record<string, string> = {}
      icons.forEach((icon) => {
        if (!icon.is_bundled && icon.svg_content) svgMap[icon.id] = icon.svg_content
      })
      setCustomSvgs(svgMap)
      setLoading(false)
    })
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    try {
      await deleteSkill(id)
      setSkills((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  const handleDrop = useCallback(async (fromIdx: number, toIdx: number) => {
    if (fromIdx === toIdx) return
    const reordered = [...skills]
    const [moved] = reordered.splice(fromIdx, 1)
    reordered.splice(toIdx, 0, moved)
    const updated = reordered.map((s, i) => ({ ...s, display_order: i + 1 }))
    setSkills(updated)
    try {
      await Promise.all(updated.map((s) => updateSkill(s.id, { display_order: s.display_order })))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save order')
    }
  }, [skills])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Skills</h1>
        <Link
          href="/admin/skills/new"
          className="rounded bg-[#5565e8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4555d8]"
        >
          + New Skill
        </Link>
      </div>

      {loading ? (
        <p className="text-[#607b96]">Loading...</p>
      ) : skills.length === 0 ? (
        <p className="text-[#607b96]">No skills yet. Create one!</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#607b96]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#607b96] bg-[#0d1a3b]">
              <tr>
                <th className="w-10 px-2 py-3 text-[#607b96]"></th>
                <th className="px-4 py-3 text-[#607b96]">#</th>
                <th className="px-4 py-3 text-[#607b96]">Icon</th>
                <th className="px-4 py-3 text-[#607b96]">Name</th>
                <th className="px-4 py-3 text-[#607b96]">Order</th>
                <th className="px-4 py-3 text-[#607b96]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill, i) => {
                const BundledIcon = iconMap[skill.icon_id]
                const customSvg = customSvgs[skill.icon_id]
                return (
                  <tr
                    key={skill.id}
                    draggable
                    onDragStart={() => setDragIdx(i)}
                    onDragOver={(e) => { e.preventDefault(); if (dragIdx !== null && dragIdx !== i) setDragIdx(i) }}
                    onDragEnd={() => { if (dragIdx !== null && dragIdx !== i) handleDrop(dragIdx, i); setDragIdx(null) }}
                    className={`border-b border-[#607b96]/20 transition ${
                      dragIdx === i ? 'bg-[#5565e8]/10 opacity-50' : 'hover:bg-[#1a2d4a]'
                    }`}
                  >
                    <td className="w-10 px-2 py-3">
                      <span className="flex cursor-grab items-center justify-center text-[#607b96] hover:text-white active:cursor-grabbing">
                        <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm8 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM8 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm8 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM8 22a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm8 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" /></svg>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#607b96]">{i + 1}</td>
                    <td className="px-4 py-3">
                      {BundledIcon ? <BundledIcon className="size-6 text-white" /> : customSvg ? <span className="inline-flex size-6 items-center justify-center text-white" dangerouslySetInnerHTML={{ __html: customSvg }} /> : <span className="text-xs text-[#607b96]">?</span>}
                    </td>
                    <td className="px-4 py-3 font-medium text-white">{skill.name}</td>
                    <td className="px-4 py-3 text-[#607b96]">{skill.display_order}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/admin/skills/${skill.id}`)}
                          className="rounded bg-[#5565e8]/20 px-3 py-1 text-sm text-[#5565e8] transition hover:bg-[#5565e8]/30"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id, skill.name)}
                          className="rounded bg-red-500/20 px-3 py-1 text-sm text-red-400 transition hover:bg-red-500/30"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
