'use client'
import { ReactNode, useEffect, useRef } from 'react'

type MarqueeWrapperProps = {
  children: ReactNode
  className?: string
  duration?: number
}

const MarqueeWrapper: React.FC<MarqueeWrapperProps> = ({ children, className = '', duration = 20000 }) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<Animation | null>(null)

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    if (animRef.current) {
      animRef.current.cancel()
    }

    const elWidth = el.getBoundingClientRect().width
    const winWidth = window.innerWidth

    if (elWidth > winWidth) {
      animRef.current = el.animate(
        [{ transform: 'translateX(0)' }, { transform: `translateX(${winWidth - elWidth}px)` }],
        { duration, easing: 'linear', direction: 'alternate', iterations: Infinity },
      )
    }

    const handleResize = () => {
      if (animRef.current) animRef.current.cancel()
      const newElWidth = el.getBoundingClientRect().width
      const newWinWidth = window.innerWidth
      if (newElWidth > newWinWidth) {
        animRef.current = el.animate(
          [{ transform: 'translateX(0)' }, { transform: `translateX(${newWinWidth - newElWidth}px)` }],
          { duration, easing: 'linear', direction: 'alternate', iterations: Infinity },
        )
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animRef.current) animRef.current.cancel()
    }
  }, [duration])

  return (
    <div className={`relative overflow-x-hidden pointer-events-none ${className}`}>
      <div className="inter w-max whitespace-nowrap will-change-transform p-5 lg:p-7" ref={elementRef}
        style={{ transform: 'translateZ(0)' }}>
        {children}
      </div>
    </div>
  )
}

export default MarqueeWrapper
