'use client'

import { useEffect, useState } from 'react'
import { getNestedHeadings } from '@/utils'
import type { Heading } from '@/lib/types'

function slugifyHeading(text: string, index: number): string {
  const slug = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .slice(0, 60)
  return slug || `section-${index}`
}

/** TOC del artículo: asigna ids a h2/h3 y construye el índice. */
export default function BlogTableOfContents({ targetId, title }: { targetId: string; title: string }) {
  const [headings, setHeadings] = useState<Heading[]>([])

  useEffect(() => {
    const container = document.getElementById(targetId)
    if (!container) return
    const elements = Array.from(container.querySelectorAll('h2, h3')) as HTMLElement[]
    elements.forEach((el, i) => {
      if (!el.id) el.id = slugifyHeading(el.textContent ?? '', i)
    })
    setHeadings(getNestedHeadings(elements))
  }, [targetId])

  if (headings.length === 0) return null

  return (
    <nav className="bg-secondary border-border mb-8 rounded-2xl border p-4">
      <p className="text-primary-content font-semibold">{title}</p>
      <ul className="mt-3 list-outside list-[square] space-y-2 ps-6">
        {headings.map(({ id, title: t, items }) => (
          <li key={id}>
            <a href={`#${id}`} className="text-tertiary-content hover:text-neutral text-sm transition-colors">
              {t}
            </a>
            {items.length > 0 && (
              <ul className="list-outside list-[circle] space-y-2 ps-4 pt-2">
                {items.map((child) => (
                  <li key={child.id}>
                    <a href={`#${child.id}`} className="text-tertiary-content hover:text-neutral text-sm transition-colors">
                      {child.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
