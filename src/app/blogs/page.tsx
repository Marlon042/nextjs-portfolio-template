import type { Metadata } from 'next'
import BlogList from '@/components/Blog/BlogList'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://marlongv.vercel.app').replace(/\/$/, '')

export const metadata: Metadata = {
  title: 'Blog | Marlon Gutiérrez V',
  description: 'Artículos, tutoriales e ideas sobre desarrollo web: Next.js, React, Supabase y soporte técnico.',
  alternates: { canonical: `${siteUrl}/blogs` },
  openGraph: {
    title: 'Blog | Marlon Gutiérrez V',
    description: 'Artículos, tutoriales e ideas sobre desarrollo web.',
    url: `${siteUrl}/blogs`,
    type: 'website',
  },
}

export default function BlogsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[1200px] px-4 py-12 md:py-16">
      <div className="mb-10 text-center">
        <h1 className="text-neutral mb-4 text-4xl font-bold md:text-5xl">Blog</h1>
        <p className="text-tertiary-content mx-auto max-w-2xl text-lg">
          Artículos, tutoriales e ideas sobre desarrollo web.
        </p>
      </div>

      <BlogList />
    </main>
  )
}
