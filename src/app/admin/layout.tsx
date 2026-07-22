'use client'

import { useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher'
import { useLanguage } from '@/context/LanguageContext'

const sidebarLinks = [
  { key: 'Dashboard', href: '/admin' },
  { key: 'Projects', href: '/admin/projects' },
  { key: 'Sections', href: '/admin/sections' },
  { key: 'Skills', href: '/admin/skills' },
  { key: 'Icons', href: '/admin/icons' },
  { key: 'Testimonials', href: '/admin/testimonials' },
  { key: 'Translations', href: '/admin/translations' },
  { key: 'Settings', href: '/admin/settings' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { t } = useLanguage()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        router.push('/admin/login')
        return
      }
      setUser(user)
      setLoading(false)
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user)
        setLoading(false)
      } else {
        router.push('/admin/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#011627]">
        <p className="text-[#607b96]">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#011627]">
      <aside className="flex w-64 flex-col border-r border-[#607b96] bg-[#0d1a3b] p-4">
        <h2 className="mb-6 text-lg font-bold text-[#18f2e5]">{t('Admin Panel')}</h2>

        <nav className="flex flex-col gap-2">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded px-3 py-2 text-sm transition ${
                  isActive
                    ? 'bg-[#5565e8] text-white'
                    : 'text-[#607b96] hover:bg-[#1a2d4a] hover:text-white'
                }`}
              >
                {t(link.key)}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto">
          <p className="mb-2 truncate text-xs text-[#607b96]">{user?.email}</p>
          <div className="mb-2">
            <LanguageSwitcher variant="inline" />
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/admin/login')
            }}
            className="w-full rounded bg-red-500/20 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/30"
          >
            {t('Sign Out')}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  )
}
