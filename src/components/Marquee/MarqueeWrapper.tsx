'use client'
import { ReactNode, useEffect, useRef, useState } from 'react'

type MarqueeWrapperProps = {
  children: ReactNode
  className?: string
  duration?: number
}

type MarqueeAnimationType = (
  element: HTMLElement,
  elementWidth: number,
  windowWidth: number,
  duration: number,
) => void

const marqueeAnimation: MarqueeAnimationType = (element, elementWidth, windowWidth, duration) => {
  element.animate(
    [{ transform: 'translateX(0)' }, { transform: `translateX(${windowWidth - elementWidth}px)` }],
    {
      duration,
      easing: 'linear',
      direction: 'alternate',
      iterations: Infinity,
    },
  )
}

const MarqueeWrapper: React.FC<MarqueeWrapperProps> = ({ children, className = '', duration = 20000 }) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    setWindowWidth(window.innerWidth)

    if (elementRef.current) {
      const elementWidth = elementRef.current.getBoundingClientRect().width
      marqueeAnimation(elementRef.current as HTMLElement, elementWidth, windowWidth, duration)
    }

    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [windowWidth, duration])

  return (
    <div className={`relative overflow-x-hidden ${className}`}>
      <div className="inter w-max whitespace-nowrap p-5 lg:p-7" ref={elementRef}>
        {children}
      </div>
    </div>
  )
}

export default MarqueeWrapper
