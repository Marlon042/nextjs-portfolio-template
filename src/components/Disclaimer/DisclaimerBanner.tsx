'use client'

import { useLanguage } from '@/context/LanguageContext'

const DisclaimerBanner = () => {
  const { t } = useLanguage()

  return (
    <div className="bg-accent/10 text-accent border-b border-accent/20 p-3 text-center text-sm">
      <p>{t('disclaimer.text')}</p>
    </div>
  )
}

export default DisclaimerBanner