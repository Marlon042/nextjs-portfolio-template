'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { BurgerIcon, CloseIcon, HomeIcon, ProjectsIcon, ServicesIcon, BlogIcon, ContactIcon } from '../../utils/icons'
import Logo from './Logo'
import { useLanguage } from '@/context/LanguageContext'

const navItems = [
  {
    labelKey: 'nav.home' as const,
    href: '/',
    icon: HomeIcon,
  },
  {
    labelKey: 'nav.projects' as const,
    href: '/#projects',
    icon: ProjectsIcon,
  },
  {
    labelKey: 'nav.services' as const,
    href: '/#services',
    icon: ServicesIcon,
  },
  {
    labelKey: 'nav.blogs' as const,
    href: '/blogs',
    icon: BlogIcon,
  },
]

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()
  const { t } = useLanguage()

  const toggleMenu = () => {
    setIsVisible(!isVisible)
  }

  return (
    <nav className="bg-primary border-border h-16 border-b">
      <div className="mx-auto flex h-full w-dvw max-w-[1200px] items-center justify-between pr-4 py-1">
        <Link href="/">
          <div className="animate-fade-up text-primary-content relative flex items-center gap-3 transition-all duration-300 md:static">
            <Logo />
            <span className="text-primary-content">MARLON GUTIÉRREZ</span>
          </div>
        </Link>

        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isVisible ? (
              <CloseIcon className="text-primary-content" />
            ) : (
              <BurgerIcon className="text-primary-content" />
            )}
          </button>
        </div>

        <ul
          className={`${isVisible ? 'flex' : 'hidden'} animate-fade-in bg-primary absolute top-16 left-0 z-10 h-dvh w-dvw flex-col md:static md:top-0 md:flex md:h-full md:w-[72%] md:flex-row lg:w-[70%]`}>
          {navItems.map(({ labelKey, href, icon: Icon }) => (
            <li
              key={href}
              onClick={() => setIsVisible(false)}
              className="border-border flex items-center border-b px-4 text-2xl md:border-y-0 md:border-e md:text-base md:first:border-s lg:px-8">
              <Link
                href={href}
                className={`text-primary-content hover:text-neutral flex w-full items-center gap-2 py-7 transition-all duration-150 md:py-0 ${pathname === href ? 'text-neutral cursor-text' : ''}`}>
                <Icon className="h-6 w-6" />
                {t(labelKey)}
              </Link>
            </li>
          ))}
          <li className="border-border flex items-center border-b px-4 text-2xl md:border-y-0 md:border-e md:text-base lg:px-8">
            <Link
              href="/#contact"
              onClick={() => setIsVisible(false)}
              className="text-primary-content hover:text-neutral flex w-full items-center gap-2 py-7 transition-all duration-150 md:py-0">
              <ContactIcon className="h-6 w-6" />
              {t('nav.contactMe')}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
