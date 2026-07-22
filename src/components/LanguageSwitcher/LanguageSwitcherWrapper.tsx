'use client'

import { usePathname } from 'next/navigation'
import LanguageSwitcher from './LanguageSwitcher'

export default function LanguageSwitcherWrapper() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null
  return <LanguageSwitcher variant="floating" />
}
