'use client'

import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'

export default function BlogsPage() {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            {t('blog.comingSoon')}
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-neutral mb-6 animate-fade-up">
          {t('blog.title')}
        </h1>

        <p className="text-lg md:text-xl text-tertiary-content mb-10 animate-fade-up delay-100">
          {t('blog.description')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-200">
          <Link
            href="/#projects"
            className="bg-accent hover:bg-accent/60 text-secondary w-full sm:w-auto cursor-pointer rounded-lg px-6 py-3 transition-colors duration-300 text-center inline-block"
          >
            {t('blog.viewProjects')}
          </Link>
          <Link
            href="/#contact"
            className="border border-accent hover:bg-accent/10 text-accent w-full sm:w-auto cursor-pointer rounded-lg px-6 py-3 transition-colors duration-300 text-center inline-block"
          >
            {t('blog.contactMe')}
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up delay-300">
          <div className="p-6 rounded-2xl bg-secondary border border-border">
            <div className="text-4xl mb-3">📝</div>
            <h3 className="text-xl font-semibold text-neutral mb-2">{t('blog.futureArticles')}</h3>
            <p className="text-tertiary-content">{t('blog.futureArticlesDesc')}</p>
          </div>
          <div className="p-6 rounded-2xl bg-secondary border border-border">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="text-xl font-semibold text-neutral mb-2">{t('blog.tutorials')}</h3>
            <p className="text-tertiary-content">{t('blog.tutorialsDesc')}</p>
          </div>
          <div className="p-6 rounded-2xl bg-secondary border border-border">
            <div className="text-4xl mb-3">💡</div>
            <h3 className="text-xl font-semibold text-neutral mb-2">{t('blog.tips')}</h3>
            <p className="text-tertiary-content">{t('blog.tipsDesc')}</p>
          </div>
        </div>
      </div>
    </main>
  )
}