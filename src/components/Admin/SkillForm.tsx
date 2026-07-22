'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { iconMap } from '@/utils/iconMap'
import { createSkill, updateSkill } from '@/actions/skills'
import { getIcons, Icon } from '@/actions/icons'

interface SkillData {
  name: string
  icon_id: string
  display_order: number
}

interface SkillFormProps {
  initialData?: SkillData
  skillId?: string
  action: 'create' | 'update'
}

const categories = ['all', 'tech', 'social', 'support', 'ui', 'stats', 'custom']

export default function SkillForm({ initialData, skillId, action }: SkillFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<SkillData>(
    initialData ?? { name: '', icon_id: '', display_order: 1 },
  )
  const [icons, setIcons] = useState<Icon[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getIcons().then(setIcons)
  }, [])

  const filteredIcons = filter === 'all' ? icons : icons.filter((i) => i.category === filter)

  const renderIconPreview = (icon: Icon) => {
    if (icon.is_bundled && iconMap[icon.id]) {
      const Comp = iconMap[icon.id]
      return <Comp className="size-6 text-white" />
    }
    if (icon.svg_content) {
      return <div className="flex size-6 items-center justify-center text-white" dangerouslySetInnerHTML={{ __html: icon.svg_content }} />
    }
    return <span className="text-[10px] text-[#607b96]">N/A</span>
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (action === 'create') {
        await createSkill(form)
      } else if (skillId) {
        await updateSkill(skillId, form)
      }
      window.location.href = '/admin/skills'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-white">
        {action === 'create' ? 'New Skill' : 'Edit Skill'}
      </h1>

      {error && (
        <p className="rounded bg-red-500/10 p-3 text-sm text-red-400">{error}</p>
      )}

      <div>
        <label className="mb-1 block text-sm text-[#607b96]" htmlFor="name">Name *</label>
        <input
          id="name"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          required
          className="w-full rounded border border-[#607b96] bg-[#011627] px-3 py-2 text-white outline-none focus:border-[#18f2e5]"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-[#607b96]" htmlFor="display_order">Display Order</label>
        <input
          id="display_order"
          type="number"
          min={1}
          value={form.display_order}
          onChange={(e) => setForm((prev) => ({ ...prev, display_order: Number(e.target.value) }))}
          className="w-full rounded border border-[#607b96] bg-[#011627] px-3 py-2 text-white outline-none focus:border-[#18f2e5]"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-[#607b96]">Icon *</label>

        {/* Category filter tabs */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button key={cat} type="button" onClick={() => setFilter(cat)}
              className={`rounded px-2 py-0.5 text-[11px] font-medium transition ${
                filter === cat
                  ? 'bg-[#5565e8] text-white'
                  : 'bg-[#0d1a3b] text-[#607b96] hover:bg-[#1a2d4a] hover:text-white'
              }`}>
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
          {filteredIcons.map((icon) => {
            const isSelected = form.icon_id === icon.id
            return (
              <button
                type="button"
                key={icon.id}
                onClick={() => setForm((prev) => ({ ...prev, icon_id: icon.id }) )}
                className={`flex flex-col items-center gap-1 rounded border p-1.5 transition ${
                  isSelected
                    ? 'border-[#18f2e5] bg-[#18f2e5]/10'
                    : 'border-[#607b96]/40 bg-[#011627] hover:border-[#607b96]'
                }`}
                title={icon.label}
              >
                {renderIconPreview(icon)}
                <span className="truncate text-[10px] text-[#607b96]">{icon.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={loading}
          className="rounded bg-[#5565e8] px-6 py-2 font-semibold text-white transition hover:bg-[#4555d8] disabled:opacity-50">
          {loading ? 'Saving...' : action === 'create' ? 'Create Skill' : 'Update Skill'}
        </button>
        <button type="button" onClick={() => router.push('/admin/skills')}
          className="rounded border border-[#607b96] px-6 py-2 text-[#607b96] transition hover:bg-[#1a2d4a] hover:text-white">
          Cancel
        </button>
      </div>
    </form>
  )
}
