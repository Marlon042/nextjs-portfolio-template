'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { iconMap } from '@/utils/iconMap'
import {
  getSection, getSectionItems, getItemTranslations,
  updateSection, createSectionItem, deleteSectionItem, updateSectionItem, upsertItemTranslation,
  Section, SectionItem, ItemTranslation,
} from '@/actions/sections'
import { getIcons, Icon } from '@/actions/icons'
import InlineEditableTitle from '@/components/Admin/InlineEditableTitle'

interface Props {
  params: Promise<{ id: string }>
}

const categories = ['all', 'tech', 'social', 'support', 'ui', 'stats', 'custom']
const languages = ['es']

export default function EditSectionPage({ params }: Props) {
  const router = useRouter()
  const [section, setSection] = useState<Section | null>(null)
  const [items, setItems] = useState<SectionItem[]>([])
  const [translations, setTranslations] = useState<Record<string, ItemTranslation[]>>({})
  const [icons, setIcons] = useState<Icon[]>([])
  const [loading, setLoading] = useState(true)
  const [sectionId, setSectionId] = useState('')
  const [iconFilter, setIconFilter] = useState('all')

  useEffect(() => {
    params.then(({ id }) => setSectionId(id))
  }, [params])

  useEffect(() => {
    if (!sectionId) return
    Promise.all([
      getSection(sectionId),
      getSectionItems(sectionId),
      getIcons(),
    ]).then(([sec, secItems, ico]) => {
      setSection(sec)
      setItems(secItems)
      setIcons(ico)
      if (secItems.length > 0) {
        Promise.all(secItems.map((item) => getItemTranslations(item.id))).then((results) => {
          const map: Record<string, ItemTranslation[]> = {}
          secItems.forEach((item, i) => { map[item.id] = results[i] })
          setTranslations(map)
        })
      }
      setLoading(false)
    })
  }, [sectionId])

  const handleAddItem = async (iconId: string) => {
    const maxOrder = items.reduce((max, i) => Math.max(max, i.display_order), 0)
    try {
      const item = await createSectionItem({ section_id: sectionId, icon_id: iconId, display_order: maxOrder + 1 })
      setItems((prev) => [...prev, item])
      await Promise.all(
        languages.map((lang) =>
          upsertItemTranslation({ item_id: item.id, language: lang, title: '', description: '' })
        )
      )
      const t = await getItemTranslations(item.id)
      setTranslations((prev) => ({ ...prev, [item.id]: t }))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add item')
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Delete this item?')) return
    try {
      await deleteSectionItem(id)
      setItems((prev) => prev.filter((i) => i.id !== id))
      setTranslations((prev) => { const n = { ...prev }; delete n[id]; return n })
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  const handleSaveTranslation = async (itemId: string, lang: string, field: 'title' | 'description', value: string) => {
    const existing = translations[itemId]?.find((t) => t.language === lang)
    try {
      const updated = await upsertItemTranslation({
        item_id: itemId,
        language: lang,
        title: field === 'title' ? value : (existing?.title ?? ''),
        description: field === 'description' ? value : (existing?.description ?? ''),
      })
      setTranslations((prev) => ({
        ...prev,
        [itemId]: [...(prev[itemId]?.filter((t) => t.language !== lang) ?? []), updated],
      }))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save')
    }
  }

  const handleChangeOrder = async (itemId: string, newOrder: number) => {
    try {
      const updated = await updateSectionItem(itemId, { display_order: newOrder })
      setItems((prev) => prev.map((i) => (i.id === itemId ? updated : i)))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update order')
    }
  }

  const filteredIcons = iconFilter === 'all' ? icons : icons.filter((i) => i.category === iconFilter)
  const sortedItems = [...items].sort((a, b) => a.display_order - b.display_order)

  if (loading) return <p className="text-[#607b96]">Loading...</p>
  if (!section) return <p className="text-red-400">Section not found</p>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <InlineEditableTitle translationKey={`${section.identifier}.title`} className="text-2xl font-bold text-white capitalize" />
          <p className="text-sm text-[#607b96]">
            Type: {section.section_type} · Order: {section.display_order} · {section.is_active ? 'Active' : 'Inactive'}
          </p>
        </div>
        <button onClick={() => router.push('/admin/sections')}
          className="rounded border border-[#607b96] px-4 py-2 text-sm text-[#607b96] transition hover:bg-[#1a2d4a] hover:text-white">
          Back
        </button>
      </div>

      {/* Items list */}
      <div className="space-y-4">
        {sortedItems.length === 0 && (
          <p className="text-sm text-[#607b96]">No items yet. Add one below.</p>
        )}
        {sortedItems.map((item, idx) => {
          const Icon = iconMap[item.icon_id]
          const customIcon = icons.find((ic) => ic.id === item.icon_id)
          return (
            <div key={item.id} className="rounded-lg border border-[#607b96]/20 bg-[#0d1a3b] p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-[#1a2d4a] text-xs font-bold text-[#607b96]">{idx + 1}</span>
                  {Icon ? <Icon className="size-6 text-white" /> : customIcon?.svg_content ? <span className="inline-flex size-6 items-center justify-center text-white" dangerouslySetInnerHTML={{ __html: customIcon.svg_content }} /> : <span className="text-xs text-[#607b96]">{item.icon_id}</span>}
                  <input
                    type="number"
                    defaultValue={item.display_order}
                    onBlur={(e) => {
                      const v = parseInt(e.target.value, 10)
                      if (!isNaN(v) && v !== item.display_order) handleChangeOrder(item.id, v)
                    }}
                    className="w-14 rounded border border-[#607b96]/40 bg-transparent px-2 py-1 text-center text-sm text-white outline-none focus:border-[#18f2e5]"
                    title="Order"
                  />
                </div>
                <button onClick={() => handleDeleteItem(item.id)}
                  className="rounded bg-red-500/20 px-2 py-0.5 text-xs text-red-400 hover:bg-red-500/30">
                  Delete
                </button>
              </div>

              <div className="rounded border border-[#607b96]/10 bg-[#011627] p-3">
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-[#607b96]">ES — Title & Description</span>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-0.5 block text-xs text-[#607b96]">Title</label>
                    <input
                      defaultValue={translations[item.id]?.find((tr) => tr.language === 'es')?.title ?? ''}
                      onBlur={(e) => handleSaveTranslation(item.id, 'es', 'title', e.target.value)}
                      className="w-full rounded border border-[#607b96]/40 bg-transparent px-2 py-1 text-sm text-white outline-none focus:border-[#18f2e5]"
                    />
                  </div>
                  <div>
                    <label className="mb-0.5 block text-xs text-[#607b96]">Description</label>
                    <input
                      defaultValue={translations[item.id]?.find((tr) => tr.language === 'es')?.description ?? ''}
                      onBlur={(e) => handleSaveTranslation(item.id, 'es', 'description', e.target.value)}
                      className="w-full rounded border border-[#607b96]/40 bg-transparent px-2 py-1 text-sm text-white outline-none focus:border-[#18f2e5]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add new item */}
      <div className="mt-8 rounded-lg border border-[#607b96]/20 bg-[#0d1a3b] p-5">
        <h3 className="mb-3 text-sm font-semibold text-[#607b96] uppercase tracking-wider">Add New Item</h3>

        {icons.length === 0 ? (
          <p className="text-xs text-[#607b96]">No icons available. Create one in /admin/icons first.</p>
        ) : (
          <>
            {/* Category tabs */}
            <div className="mb-3 flex flex-wrap gap-1.5">
              {categories.map((cat) => {
                const count = cat === 'all' ? icons.length : icons.filter((i) => i.category === cat).length
                return (
                  <button
                    key={cat}
                    onClick={() => setIconFilter(cat)}
                    className={`rounded-full px-3 py-1 text-[11px] font-medium transition ${
                      iconFilter === cat
                        ? 'bg-[#5565e8] text-white'
                        : 'bg-[#1a2d4a] text-[#607b96] hover:bg-[#253a5a] hover:text-white'
                    }`}
                  >
                    {cat === 'all' ? 'All' : cat} ({count})
                  </button>
                )
              })}
            </div>

            {/* Icon grid */}
            {filteredIcons.length === 0 ? (
              <p className="text-xs text-[#607b96]">No icons in this category.</p>
            ) : (
              <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto rounded-lg border border-[#607b96]/10 bg-[#011627] p-3">
                {filteredIcons.map((icon) => {
                  const BundledIcon = iconMap[icon.id]
                  return (
                    <button key={icon.id} onClick={() => handleAddItem(icon.id)}
                      className="group flex flex-col items-center gap-0.5 rounded-lg border border-[#607b96]/10 p-2 transition hover:border-[#5565e8] hover:bg-[#5565e8]/10"
                      title={icon.label}>
                      {BundledIcon ? <BundledIcon className="size-6 text-white transition group-hover:scale-110" /> : icon.svg_content ? <span className="inline-flex size-6 items-center justify-center text-white transition group-hover:scale-110" dangerouslySetInnerHTML={{ __html: icon.svg_content }} /> : <span className="text-xs text-[#607b96]">?</span>}
                      <span className="max-w-14 truncate text-[9px] text-[#607b96]">{icon.label}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
