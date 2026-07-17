'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { iconMap } from '@/utils/iconMap'
import { useLanguage } from '@/context/LanguageContext'
import SectionHeading from '../SectionHeading/SectionHeading'
import ComputerSupportCard from './ComputerSupportCard'

interface Item {
  id: string
  icon_id: string
  display_order: number
}

const ComputerSupportSection = () => {
  const { t } = useLanguage()
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    const fetchItems = async () => {
      const { data: sections } = await supabase
        .from('sections')
        .select('id')
        .eq('identifier', 'support')
        .single()

      if (sections) {
        const { data: sectionItems } = await supabase
          .from('section_items')
          .select('id, icon_id, display_order')
          .eq('section_id', sections.id)
          .order('display_order')

        setItems(sectionItems ?? [])
      }
    }

    fetchItems()
  }, [])

  return (
    <section id="computer-support" className="my-14">
      <SectionHeading title="" subtitle="" />

      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 md:mt-[3.75rem] md:grid-cols-3">
        {items.map((item, index) => {
          const Icon = iconMap[item.icon_id]
          return (
            <ComputerSupportCard
              key={item.id}
              icon={Icon}
              title={t(`support.${index}.title`)}
              shortDescription={t(`support.${index}.desc`)}
            />
          )
        })}
      </div>
    </section>
  )
}

export default ComputerSupportSection
