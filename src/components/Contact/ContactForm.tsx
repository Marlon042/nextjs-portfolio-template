'use client'

import action from '@/actions/contact-form'
import { useActionState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import Button from '../UI/Button'
import Input from '../UI/Input'
import Textarea from '../UI/Textarea'

const ContactForm = () => {
  const [status, formAction, isPending] = useActionState(action, null)
  const { t } = useLanguage()

  if (status?.success) {
    return (
      <p className="text-accent self-center text-center text-2xl font-medium">{status.message}</p>
    )
  }

  return (
    <form action={formAction}>
      <Input label={t('form.fullName')} id="name" name="name" placeholder={t('form.fullNamePlaceholder')} required />
      <Input
        label={t('form.email')}
        id="email"
        type="email"
        name="email"
        placeholder={t('form.emailPlaceholder')}
        required
      />
      <Input label={t('form.subject')} id="subject" name="subject" placeholder={t('form.subjectPlaceholder')} />
      <Textarea
        label={t('form.message')}
        id="message"
        name="message"
        placeholder={t('form.messagePlaceholder')}
        rows={7}
        required
      />
      {!status?.success && <p className="my-2 font-light text-red-600">{status?.message}</p>}
      <Button text={isPending ? t('form.submitting') : t('form.submit')} disabled={isPending} />
    </form>
  )
}

export default ContactForm
