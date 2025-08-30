'use client'

import { MsgIcon, PhoneIcon } from '@/utils/icons'
import ContactForm from './ContactForm'

const ContactSection = () => {
  return (
    <section
      id="contact"
      className="bg-secondary my-8 grid grid-cols-1 gap-16 rounded-4xl p-8 md:my-16 md:grid-cols-2 md:gap-8 lg:gap-12">
      <div className="flex flex-col justify-between gap-8">
        <div className="flex flex-col gap-8">
          <div>
            <h3 className="text-neutral text-3xl font-bold">Let's Talk</h3>
            <h4 className="text-accent text-2xl font-bold md:text-3xl">We'd love to help</h4>
            <p className="text-neutral mt-8">
              Crafting innovative solutions to solve real-world problems
            </p>
          </div>

          <button
            onClick={downloadCV}
            aria-label="Download CV"
            className="bg-accent max-w-max cursor-pointer rounded-lg px-[14px] py-[10px] text-center text-sm font-medium text-[#00071E]">
            Descargar CV
          </button>
        </div>

        <div className="space-y-2">
          <p className="text-neutral text-lg font-bold">Contact Information</p>
          <a
            href="mailto:marckgv@gmail.com"
            className="text-neutral hover:text-accent flex items-center gap-1 font-light transition-colors duration-300">
            <MsgIcon /> marckgv@gmail.com
          </a>
          <a
            href="tel:+506 8674-8396"
            className="text-neutral hover:text-accent flex items-center gap-1 font-light transition-colors duration-300">
            <PhoneIcon /> +506 8674-8396
          </a>
        </div>
      </div>

      <ContactForm />
    </section>
  )

  function downloadCV() {
    // Crear un enlace temporal para descargar el CV
    const link = document.createElement('a');
    link.href = '/CV_Marlon_Gutiérrez_V_English.pdf';
    link.download = 'CV_Marlon_Gutiérrez_V_English.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default ContactSection
