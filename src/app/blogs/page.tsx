'use client'

import { useLanguage } from '@/context/LanguageContext'
import BlogList from '@/components/Blog/BlogList'

export default function BlogsPage() {
  const { t } = useLanguage()

  return (
    <main className="mx-auto min-h-screen max-w-[1200px] px-4 py-12 md:py-16">
      <div className="mb-10 text-center">
        <h1 className="text-neutral mb-4 text-4xl font-bold md:text-5xl">{t('blog.title')}</h1>
        <p className="text-tertiary-content mx-auto max-w-2xl text-lg">{t('blog.description')}</p>
      </div>

      <BlogList />
    </main>
  )
}
