'use client'

import { footerLinks } from '@/appData'
import { socials } from '@/appData/personal'
import { useLanguage } from '@/context/LanguageContext'
import Logo from '../Navbar/Logo'

const Footer = () => {
  const { t } = useLanguage()

  return (
    <footer className="bg-secondary relative flex min-h-[560px] flex-col justify-between gap-20 overflow-hidden px-4 py-14 md:p-14">
      <div className="relative z-20 grid grid-cols-1 items-start gap-20 md:grid-cols-2 md:gap-12">
        <div>
          <h5 className="mb-8 flex items-center gap-2">
            <Logo width={30} height={24} />
            <span className="text-neutral text-lg font-medium">{t('footer.resume')}</span>
          </h5>
          <p className="text-tertiary-content">
            {t('footer.description')}
          </p>
          <a
            href="#"
            className="text-neutral mt-4 inline-flex items-center gap-2 text-xs hover:underline">
            {t('footer.moreAboutUs')} <span className="bg-neutral inline-block size-[10px] rounded-full" />
          </a>
        </div>

        <div className="flex flex-wrap gap-8">
          {footerLinks.map((link) => (
            <a
              href={link.href}
              key={link.href}
              className="text-tertiary-content hover:text-neutral transition-colors duration-300 hover:underline">
              {link.title}.
            </a>
          ))}
        </div>
      </div>

      <div className="relative z-20 flex flex-col-reverse gap-20 md:grid md:grid-cols-2 md:gap-12">
        <div className="grid grid-cols-2 gap-4">
          <ul className="flex flex-col gap-4">
            {socials.map((item, index) => (
              <li key={index} className="cursor-pointer bg-transparent">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral hover:text-accent flex items-center gap-2 font-light transition-colors duration-300">
                  {item.icon}
                  <span>{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="text-tertiary-content flex flex-col self-end text-right text-xs md:text-center">
            <span>{t('footer.copyright')}</span>
            <span>{t('footer.rights')}</span>
          </p>
        </div>

        <div className="flex flex-col justify-between gap-[200px] md:flex-row md:gap-8">
          <div className="space-y-10 md:self-end">
            <div className="flex flex-col">
              <h5 className="text-neutral mb-4 text-lg font-medium">{t('footer.contactUs')}</h5>
              <a
                href="mailto:marckgv@gmail.com"
                className="text-tertiary-content hover:text-neutral text-sm font-light transition-colors duration-300">
                marckgv@gmail.com
              </a>
              <a
                href="tel:+506 86748396"
                className="text-tertiary-content hover:text-neutral text-sm font-light transition-colors duration-300">
                +506 86748396
              
              </a>
            </div>
            <div>
              <div>
                <h5 className="text-neutral mb-4 text-lg font-medium">{t('footer.location')}</h5>
                <address className="text-tertiary-content flex flex-col text-sm font-light">
                  <span>60801, Costa Rica</span>
                  <span>San Vito / Coto Brus</span>
                </address>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="bg-neutral/4 absolute top-1/2 -right-[40%] z-0 h-[120dvw] w-[120dvw] -translate-y-1/2 rounded-full p-14 md:top-0 md:-right-[255px] md:-bottom-[450px] md:size-[1030px] md:-translate-y-0 md:p-20">
        <div className="bg-neutral/4 size-full rounded-full p-14 md:p-20">
          <div className="bg-neutral/5 size-full rounded-full" />
        </div>
      </div>
    </footer>
  )
}

export default Footer
