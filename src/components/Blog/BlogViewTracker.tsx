'use client'

import { useEffect, useRef } from 'react'

/** Incrementa vistas una vez por montaje (fire-and-forget). */
export default function BlogViewTracker({ slug }: { slug: string }) {
  const sent = useRef(false)

  useEffect(() => {
    if (sent.current) return
    sent.current = true
    fetch(`/api/blogs/${slug}/views`, { method: 'POST' }).catch(() => {})
  }, [slug])

  return null
}
