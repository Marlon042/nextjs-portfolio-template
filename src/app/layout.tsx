import type { Metadata } from 'next'
import './globals.css'

import FooterWrapper from '@/components/Footer/FooterWrapper'
import Navbar from '@/components/Navbar/Navbar'
import LanguageSwitcherWrapper from '@/components/LanguageSwitcher/LanguageSwitcherWrapper'
import { SectionProvider } from '@/context/SectionContext'
import { LanguageProvider } from '@/context/LanguageContext'
import ThemeMenu from '@/components/Theme/ThemeMenu'
import JsonLd from '@/components/JsonLd'
import { Fira_Code } from 'next/font/google'

const firaCode = Fira_Code({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], display: 'swap' })

const title = 'Marlon Gutiérrez V | Full-Stack Web Developer in Costa Rica'

const description =
  "Skilled full-stack web developer in Costa Rica. I build responsive, user-friendly websites with React, NextJS, and NodeJS. Let's bring your vision to life. Hire me today!"

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://marlongv.vercel.app').replace(/\/$/, '')

export const metadata: Metadata = {
  title,
  description,
  category: 'technology',
  authors: [{ name: 'Marlon Gutiérrez V', url: siteUrl }],
  keywords: [
    'Marlon Gutiérrez',
    'Full-Stack Developer Costa Rica',
    'Next.js developer',
    'React developer Costa Rica',
    'Soporte técnico Coto Brus',
    'Desarrollo web Costa Rica',
  ],
  robots: { index: true, follow: true },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: 'Marlon Gutiérrez Portfolio',
    locale: 'es_CR',
    type: 'website',
    images: [{ url: `${siteUrl}/opengraph-image`, width: 1200, height: 630, alt: 'Marlon Gutiérrez | Full-Stack Web Developer in Costa Rica' }],
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
    images: [`${siteUrl}/opengraph-image`],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" data-theme="dark" suppressHydrationWarning>
      <body className={`${firaCode.className}`}>
        <JsonLd />
        <LanguageProvider>
        <SectionProvider>
          <header>
            <Navbar />
          </header>
          {children}
          <ThemeMenu />
          <LanguageSwitcherWrapper />
          <FooterWrapper />
        </SectionProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
