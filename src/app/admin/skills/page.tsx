'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSkills, deleteSkill } from '@/actions/skills'
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
  const router = useRouter()

  useEffect(() => {
    getSkills().then((data) => {
      setSkills(data)
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
                <th className="px-4 py-3 text-[#607b96]">#</th>
                <th className="px-4 py-3 text-[#607b96]">Icon</th>
                <th className="px-4 py-3 text-[#607b96]">Name</th>
                <th className="px-4 py-3 text-[#607b96]">Order</th>
                <th className="px-4 py-3 text-[#607b96]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill, i) => {
                const Icon = iconMap[skill.icon_id]
                return (
                  <tr key={skill.id} className="border-b border-[#607b96]/20 hover:bg-[#1a2d4a]">
                    <td className="px-4 py-3 text-[#607b96]">{i + 1}</td>
                    <td className="px-4 py-3">
                      {Icon && <Icon className="size-6 text-white" />}
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
