'use client'

import { useEffect, useState } from 'react'
import { iconMap } from '@/utils/iconMap'
import { getIcons, createIcon, updateIcon, deleteIcon, Icon } from '@/actions/icons'

const categories = ['all', 'tech', 'social', 'support', 'ui', 'stats', 'custom']

export default function AdminIcons() {
  const [icons, setIcons] = useState<Icon[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ id: '', label: '', category: 'custom', svg_content: '' })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getIcons().then((data) => {
      setIcons(data)
      setLoading(false)
    })
  }, [])

  const filtered = filter === 'all' ? icons : icons.filter((i) => i.category === filter)

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      if (editingId) {
        const updated = await updateIcon(editingId, { label: form.label, category: form.category, svg_content: form.svg_content || undefined })
        setIcons((prev) => prev.map((i) => (i.id === editingId ? updated : i)))
      } else {
        const created = await createIcon(form)
        setIcons((prev) => [...prev, created])
      }
      setShowForm(false)
      setForm({ id: '', label: '', category: 'custom', svg_content: '' })
      setEditingId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving icon')
    }
    setSaving(false)
  }

  const handleEdit = (icon: Icon) => {
    setForm({ id: icon.id, label: icon.label, category: icon.category, svg_content: icon.svg_content ?? '' })
    setEditingId(icon.id)
    setShowForm(true)
    setError('')
  }

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Delete icon "${label}" (${id})?`)) return
    try {
      await deleteIcon(id)
      setIcons((prev) => prev.filter((i) => i.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting icon')
    }
  }

  const renderIconPreview = (icon: Icon) => {
    if (icon.is_bundled && iconMap[icon.id]) {
      const Comp = iconMap[icon.id]
      return <Comp className="size-8 text-white" />
    }
    if (icon.svg_content) {
      return (
        <div className="flex size-8 items-center justify-center text-white"
          dangerouslySetInnerHTML={{ __html: icon.svg_content }} />
      )
    }
    return <span className="text-xs text-[#607b96]">No preview</span>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Icons</h1>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ id: '', label: '', category: 'custom', svg_content: '' }); setError('') }}
          className="rounded bg-[#5565e8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4555d8]"
        >
          + New Icon
        </button>
      </div>

      {showForm && (
        <div className="mb-8 rounded-lg border border-[#607b96]/40 bg-[#0d1a3b] p-4">
          <h2 className="mb-4 text-sm font-semibold text-[#607b96] uppercase tracking-wider">
            {editingId ? 'Edit Icon' : 'New Icon'}
          </h2>
          {error && <p className="mb-3 rounded bg-red-500/10 p-2 text-sm text-red-400">{error}</p>}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-[#607b96]">ID *</label>
              <input value={form.id} onChange={(e) => setForm((p) => ({ ...p, id: e.target.value }))}
                disabled={!!editingId}
                className="w-full rounded border border-[#607b96] bg-[#011627] px-3 py-2 text-white outline-none focus:border-[#18f2e5] disabled:opacity-50"
                placeholder="e.g. my-custom-icon" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[#607b96]">Label *</label>
              <input value={form.label} onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                className="w-full rounded border border-[#607b96] bg-[#011627] px-3 py-2 text-white outline-none focus:border-[#18f2e5]"
                placeholder="e.g. My Custom Icon" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[#607b96]">Category</label>
              <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="w-full rounded border border-[#607b96] bg-[#011627] px-3 py-2 text-white outline-none focus:border-[#18f2e5]">
                {categories.filter((c) => c !== 'all').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-xs text-[#607b96]">SVG Markup (for custom icons)</label>
            <textarea value={form.svg_content} onChange={(e) => setForm((p) => ({ ...p, svg_content: e.target.value }))}
              rows={4}
              className="w-full rounded border border-[#607b96] bg-[#011627] px-3 py-2 font-mono text-xs text-white outline-none focus:border-[#18f2e5]"
              placeholder='<svg ...>...</svg>' />
            {form.svg_content && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-[#607b96]">Preview:</span>
                <div className="flex size-8 items-center justify-center text-white"
                  dangerouslySetInnerHTML={{ __html: form.svg_content }} />
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-3">
            <button onClick={handleSave} disabled={saving || !form.id || !form.label}
              className="rounded bg-[#5565e8] px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-[#4555d8] disabled:opacity-50">
              {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            <button onClick={() => { setShowForm(false); setEditingId(null); setError('') }}
              className="rounded border border-[#607b96] px-4 py-1.5 text-sm text-[#607b96] transition hover:bg-[#1a2d4a] hover:text-white">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Category filter tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`rounded px-3 py-1 text-xs font-medium transition ${
              filter === cat
                ? 'bg-[#5565e8] text-white'
                : 'bg-[#0d1a3b] text-[#607b96] hover:bg-[#1a2d4a] hover:text-white'
            }`}>
            {cat === 'all' ? 'All' : cat} {cat !== 'all' && `(${icons.filter((i) => i.category === cat).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-[#607b96]">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-[#607b96]">No icons in this category.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filtered.map((icon) => (
            <div key={icon.id}
              className="group relative flex flex-col items-center gap-2 rounded-lg border border-[#607b96]/20 bg-[#0d1a3b] p-3 transition hover:border-[#607b96]/60">
              {renderIconPreview(icon)}
              <span className="truncate text-xs text-white">{icon.label}</span>
              <span className="text-[10px] text-[#607b96]">{icon.id}</span>
              {icon.is_bundled && (
                <span className="rounded bg-[#5565e8]/20 px-1.5 py-0.5 text-[10px] text-[#5565e8]">bundled</span>
              )}
              <div className="mt-1 flex gap-1 opacity-0 transition group-hover:opacity-100">
                <button onClick={() => handleEdit(icon)}
                  className="rounded bg-[#5565e8]/20 px-2 py-0.5 text-[11px] text-[#5565e8] transition hover:bg-[#5565e8]/30">
                  Edit
                </button>
                {!icon.is_bundled && (
                  <button onClick={() => handleDelete(icon.id, icon.label)}
                    className="rounded bg-red-500/20 px-2 py-0.5 text-[11px] text-red-400 transition hover:bg-red-500/30">
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
