'use client'

import { useState } from 'react'
import useOutsideClick from '@/hooks/useOutsideClick'
import { useSectionContext } from '@/context/SectionContext'
import { CloseIcon, ServicesIcon } from '@/utils/icons'

const SectionToggle = () => {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useOutsideClick(() => setShowMenu(false))
  const { showServices, toggleServices } = useSectionContext()

  const handleToggle = () => {
    toggleServices()
    setShowMenu(false)
  }

  return (
    <div ref={menuRef} className="fixed right-6 top-20 z-50 md:right-11 md:top-24">
      <div
        onClick={() => setShowMenu(!showMenu)}
        className="bg-neutral cursor-pointer rounded-full p-1.5 md:p-2">
        <div className="bg-primary grid place-content-center rounded-full p-1.5 md:p-2">
          <ServicesIcon className="h-4 w-4 text-primary-content md:h-5 md:w-5" />
        </div>
      </div>

      {showMenu && (
        <div className="bg-secondary animate-fade-in border-border absolute right-0 top-full mt-5 space-y-3 rounded-xl border p-3 md:space-y-4 md:p-5">
          <div className="text-primary-content border-border flex items-center justify-between border-b pb-3 md:pb-4">
            <span className="text-sm md:text-base">_secciones</span>
            <CloseIcon
              onClick={() => setShowMenu(false)}
              className="h-3 w-3 cursor-pointer md:h-4 md:w-4"
            />
          </div>

          <div
            onClick={handleToggle}
            className="flex cursor-pointer items-center justify-between rounded-lg p-2 md:rounded-xl md:p-4 hover:bg-base-100">
            <span className="text-sm md:text-base">
              {showServices ? '_ocultar-servicios' : '_mostrar-servicios'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default SectionToggle