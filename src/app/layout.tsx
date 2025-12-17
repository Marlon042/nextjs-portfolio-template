import type { Metadata } from 'next'
import './globals.css'

import DisclaimerBanner from '@/components/Disclaimer/DisclaimerBanner'
import Footer from '@/components/Footer/Footer'
import Navbar from '@/components/Navbar/Navbar'
import { SectionProvider } from '@/context/SectionContext'
import ThemeMenu from '@/components/Theme/ThemeMenu'
import { Fira_Code } from 'next/font/google'

const firaCode = Fira_Code({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

const title = 'Marlon Gutiérrez V | Full-Stack Web Developer in Costa Rica'

const description =
  "Skilled full-stack web developer in Costa Rica. I build responsive, user-friendly websites with React, NextJS, and NodeJS. Let's bring your vision to life. Hire me today!"

const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-portfolio-url.com'

export const metadata: Metadata = {
  title,
  description,
  category: 'technology',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://your-portfolio-url.com'),
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description,
    url,
    siteName: 'Marlon Gutiérrez Portfolio',
    type: 'website',
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
    creator: '@Basit_Miyanji',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`${firaCode.className}`}>
        <SectionProvider>
          <header>
            <Navbar />
          </header>
          <DisclaimerBanner />
          {children}
          <ThemeMenu />
          <Footer />
        </SectionProvider>
      </body>
    </html>
  )
}
