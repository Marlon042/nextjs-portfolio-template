const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://marlongv.vercel.app').replace(/\/$/, '')

export default function JsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#person`,
        name: 'Marlon Gutiérrez V',
        jobTitle: 'Full-Stack Web Developer',
        description:
          'Full-stack web developer in Costa Rica. React, Next.js, Node.js, Supabase. Computer support and maintenance.',
        url: siteUrl,
        email: 'mailto:marckgv@gmail.com',
        telephone: '+506 8674-8396',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'San Vito, Coto Brus',
          postalCode: '60801',
          addressCountry: 'CR',
        },
        sameAs: [
          'https://www.linkedin.com/in/marlon-gutierrez-v/',
          'https://github.com/Marlon042',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Marlon Gutiérrez V | Full-Stack Web Developer in Costa Rica',
        author: { '@id': `${siteUrl}/#person` },
        inLanguage: ['es', 'en'],
      },
      {
        '@type': 'ProfessionalService',
        name: 'Marlon Gutiérrez V — Desarrollo web y soporte técnico',
        url: siteUrl,
        areaServed: 'Costa Rica',
        priceRange: '$$',
        provider: { '@id': `${siteUrl}/#person` },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
