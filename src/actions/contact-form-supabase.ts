'use server'

import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const action = async (_: { success: boolean; message: string } | null, formData: FormData) => {
  try {
    console.log('Contact form action started')

    const name = formData.get('name') as string
    if (!name) {
      return { success: false, message: 'Por favor proporciona tu nombre.' }
    }

    const email = formData.get('email') as string
    if (!email) {
      return { success: false, message: 'Por favor proporciona tu dirección de email.' }
    }

    const subject = formData.get('subject') as string
    if (!subject) {
      return { success: false, message: 'Por favor proporciona un asunto.' }
    }

    const message = formData.get('message') as string
    if (!message) {
      return { success: false, message: 'Por favor proporciona un mensaje.' }
    }

    console.log('Form data validated:', { name, email, subject, message })

    // Save to Supabase
    console.log('Attempting to save to Supabase...')
    const supabase = getSupabaseAdmin()
    const { error: dbError } = await supabase.from('contact_submissions').insert({
      full_name: name,
      email,
      subject,
      message,
    })

    if (dbError) {
      console.error('Supabase error:', dbError)
      return { success: false, message: 'Error al guardar el mensaje. Por favor intenta de nuevo.' }
    }

    console.log('Form submission saved successfully')

    // Send email notification via Resend
    if (process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL) {
      try {
        console.log('Sending email notification...')
        await resend.emails.send({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: process.env.CONTACT_EMAIL,
          subject: `Nuevo mensaje: ${subject}`,
          html: `
            <h2>Nuevo mensaje de contacto</h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Asunto:</strong> ${subject}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">Enviado desde el formulario de contacto del portfolio</p>
          `,
          replyTo: email,
        })
        console.log('Email sent successfully')
      } catch (emailError) {
        console.error('Error sending email (non-blocking):', emailError)
        // No fallar si el email falla, el mensaje ya está guardado
      }
    } else {
      console.warn('Resend not configured, skipping email notification')
    }

    return { success: true, message: '¡Gracias por tu mensaje! Te contactaré pronto.' }
  } catch (error) {
    console.error('Error submitting contact form:', error)
    if (error instanceof Error) {
      console.error('Error details:', { name: error.name, message: error.message, stack: error.stack })
    } else {
      console.error('Unknown error type:', error)
    }
    return { success: false, message: 'Oops! Hubo un problema al enviar tu formulario. Por favor intenta de nuevo.' }
  }
}

export default action