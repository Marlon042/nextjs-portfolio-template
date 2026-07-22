'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSkills, deleteSkill } from '@/actions/skills'
import { getSiteConfig, updateSiteConfig } from '@/actions/site-config'
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
  const [marqueeDuration, setMarqueeDuration] = useState(20000)
  const [speedSaving, setSpeedSaving] = useState(false)
  const [speedMsg, setSpeedMsg] = useState('')
  const [customSvgs, setCustomSvgs] = useState<Record<string, string>>({})
  const router = useRouter()

  useEffect(() => {
    Promise.all([
      getSkills(),
      getSiteConfig(),
      getIcons(),
    ]).then(([skillsData, config, icons]) => {
      setSkills(skillsData)
      if (config.marquee_duration) setMarqueeDuration(config.marquee_duration)
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

  const saveSpeed = async () => {
    setSpeedSaving(true)
    setSpeedMsg('')
    try {
      await updateSiteConfig('marquee_duration', marqueeDuration)
      setSpeedMsg('Speed saved!')
    } catch (err) {
      setSpeedMsg(err instanceof Error ? err.message : 'Error saving speed')
    }
    setSpeedSaving(false)
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

      <div className="mb-8 rounded-lg border border-[#607b96]/40 bg-[#0d1a3b] p-4">
        <h2 className="mb-3 text-sm font-semibold text-[#607b96] uppercase tracking-wider">Marquee Speed</h2>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={5000}
            max={60000}
            step={1000}
            value={marqueeDuration}
            onChange={(e) => setMarqueeDuration(Number(e.target.value))}
            className="w-full max-w-xs accent-[#5565e8]"
          />
          <span className="min-w-[80px] text-sm text-white">{marqueeDuration}ms</span>
          <button
            onClick={saveSpeed}
            disabled={speedSaving}
            className="rounded bg-[#5565e8] px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-[#4555d8] disabled:opacity-50"
          >
            {speedSaving ? 'Saving...' : 'Save'}
          </button>
          {speedMsg && (
            <span className={`text-sm ${speedMsg === 'Speed saved!' ? 'text-green-400' : 'text-red-400'}`}>
              {speedMsg}
            </span>
          )}
        </div>
        <p className="mt-2 text-xs text-[#607b96]">
          Lower = faster, Higher = slower. Default 20000ms.
        </p>
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
                const BundledIcon = iconMap[skill.icon_id]
                const customSvg = customSvgs[skill.icon_id]
                return (
                  <tr key={skill.id} className="border-b border-[#607b96]/20 hover:bg-[#1a2d4a]">
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
