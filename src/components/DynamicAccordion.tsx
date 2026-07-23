'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { iconMap } from '@/utils/iconMap'
import { useLanguage } from '@/context/LanguageContext'
import { ChevronRightIcon } from '@/utils/icons'

interface ItemData {
  id: string
  icon_id: string
  display_order: number
  title: string
  description: string
}

interface IconData {
  id: string
  svg_content: string | null
}

interface DynamicAccordionProps {
  identifier: string
  defaultOpen?: boolean
}

const DynamicAccordion: React.FC<DynamicAccordionProps> = ({ identifier, defaultOpen = false }) => {
  const { t, lang } = useLanguage()
  const [open, setOpen] = useState(defaultOpen)
  const [items, setItems] = useState<ItemData[]>([])
  const [count, setCount] = useState<number | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [sectionId, setSectionId] = useState<string | null>(null)
  const [customIcons, setCustomIcons] = useState<Record<string, string>>({})

  useEffect(() => {
    setLoaded(false)
    setItems([])
    setCount(null)
    setSectionId(null)
    setFetching(false)
    setCustomIcons({})

    ;(async () => {
      const [{ data }, { data: iconsRaw }] = await Promise.all([
        supabase.from('sections').select('id').eq('identifier', identifier).eq('is_active', true).single(),
        supabase.from('icons').select('id, svg_content'),
      ])

      const iconMap_: Record<string, string> = {}
      ;(iconsRaw as any[] ?? []).forEach((ic: any) => {
        if (ic.svg_content) iconMap_[ic.id] = ic.svg_content
      })
      setCustomIcons(iconMap_)

      if (data) {
        setSectionId(data.id)
        const { count: c } = await supabase
          .from('section_items')
          .select('id', { count: 'exact', head: true })
          .eq('section_id', data.id)
        setCount(c ?? 0)
      }
    })()
  }, [identifier])

  useEffect(() => {
    if (!open || loaded || fetching || !sectionId) return
    setFetching(true)

    ;(async () => {
      const [{ data: itemsRaw }, { data: transRaw }] = await Promise.all([
        supabase.from('section_items').select('id, icon_id, display_order').eq('section_id', sectionId).order('display_order'),
        supabase.from('section_item_translations').select('item_id, language, title, description'),
      ])

      if (itemsRaw) {
        const transMap: Record<string, Record<string, { title: string; description: string }>> = {}
        ;(transRaw as any[] ?? []).forEach((tr: any) => {
          if (!transMap[tr.item_id]) transMap[tr.item_id] = {}
          transMap[tr.item_id][tr.language] = { title: tr.title, description: tr.description }
        })

        setItems(
          itemsRaw.map((item: any) => {
            const tr = transMap[item.id]?.[lang] ?? transMap[item.id]?.['es']
            return {
              id: item.id,
              icon_id: item.icon_id,
              display_order: item.display_order,
              title: tr?.title ?? item.icon_id,
              description: tr?.description ?? '',
            }
          })
        )
      }
      setLoaded(true)
      setFetching(false)
    })()
  }, [open, loaded, fetching, sectionId, lang])

  const titleKey = identifier === 'services' ? 'services.title'
    : identifier === 'support' ? 'support.title'
    : `${identifier}.title`

  return (
    <section id={identifier} className="my-6">
      <button
        onClick={() => setOpen(!open)}
        className="group flex w-full items-center justify-between rounded-lg border border-[#607b96]/20 bg-[#0d1a3b]/50 p-4 text-left transition hover:border-[#607b96]/40 md:rounded-xl md:p-5"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-white md:text-xl">
            {t(titleKey)}
          </span>
          {count !== null && (
            <span className="flex size-6 items-center justify-center rounded-full bg-[#5565e8] text-xs font-bold text-white">
              {count}
            </span>
          )}
        </div>
        <ChevronRightIcon
          className={`size-5 text-[#607b96] transition-transform duration-300 md:size-6 ${
            open ? 'rotate-90' : ''
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-500 ease-in-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pt-6">
            {fetching && !loaded ? (
              <p className="text-sm text-[#607b96]">Loading...</p>
            ) : items.length === 0 ? (
              <p className="text-sm text-[#607b96]">No items yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
                {items.map((item) => {
                  const Icon = iconMap[item.icon_id]
                  const customSvg = customIcons[item.icon_id]
                  return (
                    <div key={item.id}
                      className="bg-secondary border-border flex flex-col items-center rounded-[14px] border p-5">
                      {Icon ? <Icon className="my-1 size-14" /> : customSvg ? <span className="my-1 inline-flex size-14 items-center justify-center text-white" dangerouslySetInnerHTML={{ __html: customSvg }} /> : null}
                      <h5 className="text-accent mt-2 mb-5 text-center text-base font-semibold">{item.title}</h5>
                      <div className="bg-primary rounded-2xl p-4">
                        <p className="text-primary-content text-center text-sm font-normal">{item.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default DynamicAccordion
