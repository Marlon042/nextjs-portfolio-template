'use server'

import { db } from '@/lib/firebase'
import { addDoc, collection } from 'firebase/firestore'

const action = async (_: { success: boolean; message: string } | null, formData: FormData) => {
  try {
    const name = formData.get('name') as string
    if (!name)
      return {
        success: false,
        message: 'Por favor proporciona tu nombre.',
      }

    const email = formData.get('email') as string
    if (!email)
      return {
        success: false,
        message: 'Por favor proporciona tu dirección de email.',
      }

    const subject = formData.get('subject') as string
    if (!subject)
      return {
        success: false,
        message: 'Por favor proporciona un asunto.',
      }

    const message = formData.get('message') as string
    if (!message)
      return {
        success: false,
        message: 'Por favor proporciona un mensaje.',
      }

    // Save to Firestore
    await addDoc(collection(db, 'contactSubmissions'), {
      name,
      email,
      subject,
      message,
      timestamp: new Date(),
      status: 'new'
    })

    return { success: true, message: '¡Gracias por tu mensaje! Te contactaré pronto.' }
    
  } catch (error) {
    console.error('Error submitting contact form: ', error)
    return {
      success: false,
      message: 'Oops! Hubo un problema al enviar tu formulario. Por favor intenta de nuevo.',
    }
  }
}

export default action
