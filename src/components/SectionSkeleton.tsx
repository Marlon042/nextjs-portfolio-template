'use client'

import { FC } from 'react'

interface Props {
  style?: 'pulse' | 'shimmer' | 'wave' | 'gradient'
  columns?: 2 | 3
}

const SkeletonBlock: FC<{ className?: string; delay?: number; style?: string }> = ({ className = '', delay = 0, style = 'shimmer' }) => {
  switch (style) {
    case 'pulse':
      return <div className={`animate-pulse rounded bg-[#1a2d4a] ${className}`} />
    case 'shimmer':
      return (
        <div className={`relative overflow-hidden rounded bg-[#1a2d4a] ${className}`}>
          <div className="absolute inset-0 shimmer" />
        </div>
      )
    case 'wave':
      return (
        <div className={`rounded bg-[#1a2d4a] opacity-20 ${className}`} style={{ animation: 'wave 1.2s ease-in-out infinite', animationDelay: `${delay}s` }} />
      )
    case 'gradient':
      return (
        <div className={`rounded ${className}`} style={{ animation: 'gradientPulse 2s ease-in-out infinite', background: 'linear-gradient(135deg, #1a2d4a 0%, #253a5a 50%, #1a2d4a 100%)', backgroundSize: '200% 200%' }} />
      )
    default:
      return <div className={`animate-pulse rounded bg-[#1a2d4a] ${className}`} />
  }
}

const SectionSkeleton: FC<Props> = ({ style = 'shimmer', columns = 3 }) => {
  const common = { style }

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .shimmer { background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%); animation: shimmer 1.5s ease-in-out infinite; }
        @keyframes wave { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.6; } }
        @keyframes gradientPulse { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      `}</style>
      <div className={`grid grid-cols-1 gap-x-8 gap-y-8 ${columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
        {[1, 2, 3].map((cardIdx) => (
          <div key={cardIdx} className="bg-secondary border-border flex flex-col items-center rounded-[14px] border p-5">
            <SkeletonBlock className="my-1 size-14 rounded-full" delay={0.1 * cardIdx} {...common} />
            <SkeletonBlock className="mt-2 mb-5 h-5 w-3/4" delay={0.1 * cardIdx + 0.05} {...common} />
            <div className="w-full">
              <SkeletonBlock className="h-20 w-full rounded-2xl" delay={0.1 * cardIdx + 0.1} {...common} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default SectionSkeleton
