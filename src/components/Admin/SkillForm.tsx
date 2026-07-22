'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { iconMap } from '@/utils/iconMap'
import { createSkill, updateSkill } from '@/actions/skills'

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

const iconOptions = Object.entries(iconMap).map(([id, Icon]) => ({ id, Icon }))

export default function SkillForm({ initialData, skillId, action }: SkillFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<SkillData>(
    initialData ?? { name: '', icon_id: '', display_order: 1 },
  )

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
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
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
        <div className="grid grid-cols-6 gap-3 md:grid-cols-8">
          {iconOptions.map(({ id, Icon }) => (
            <button
              type="button"
              key={id}
              onClick={() => setForm((prev) => ({ ...prev, icon_id: id }) )}
              className={`flex flex-col items-center gap-1 rounded border p-2 transition ${
                form.icon_id === id
                  ? 'border-[#18f2e5] bg-[#18f2e5]/10'
                  : 'border-[#607b96]/40 bg-[#011627] hover:border-[#607b96]'
              }`}
              title={id}
            >
              <Icon className="size-6 text-white" />
              <span className="truncate text-[10px] text-[#607b96]">{id}</span>
            </button>
          ))}
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
