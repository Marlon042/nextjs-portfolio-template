'use client'

import { FC } from 'react'

interface Props {
  style?: 'pulse' | 'shimmer' | 'wave' | 'gradient'
}

const pulseClass = 'animate-pulse bg-[#1a2d4a]'

const shimmerBlock: FC<{ cn?: string }> = ({ cn = '' }) => (
  <div className={`relative overflow-hidden rounded bg-[#1a2d4a] ${cn}`}>
    <div className="absolute inset-0 shimmer" />
  </div>
)

const waveBlock: FC<{ cn?: string; delay?: number }> = ({ cn = '', delay = 0 }) => (
  <div className={`rounded bg-[#1a2d4a] opacity-20 ${cn}`} style={{ animation: 'wave 1.2s ease-in-out infinite', animationDelay: `${delay}s` }} />
)

const gradientBlock: FC<{ cn?: string }> = ({ cn = '' }) => (
  <div className={`rounded ${cn}`} style={{ animation: 'gradientPulse 2s ease-in-out infinite', background: 'linear-gradient(135deg, #1a2d4a 0%, #253a5a 50%, #1a2d4a 100%)', backgroundSize: '200% 200%' }} />
)

const SkeletonBlock: FC<{ className?: string; delay?: number; style?: string }> = ({ className = '', delay = 0, style = 'shimmer' }) => {
  switch (style) {
    case 'pulse':
      return <div className={`${pulseClass} ${className}`} />
    case 'shimmer':
      return <>{shimmerBlock({ cn: className })}</>
    case 'wave':
      return <>{waveBlock({ cn: className, delay })}</>
    case 'gradient':
      return <>{gradientBlock({ cn: className })}</>
    default:
      return <div className={`${pulseClass} ${className}`} />
  }
}

const ProjectSkeleton: FC<Props> = ({ style = 'shimmer' }) => {
  const common = { style }

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%);
          animation: shimmer 1.5s ease-in-out infinite;
        }
        @keyframes wave {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
        @keyframes gradientPulse {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <div className="bg-secondary border-border flex flex-col justify-between rounded-[14px] border p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <SkeletonBlock className="h-5 w-32" delay={0} {...common} />
              <SkeletonBlock className="h-7 w-20 rounded-md" delay={0.1} {...common} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2 sm:gap-4">
              <SkeletonBlock className="h-4 w-16" delay={0.2} {...common} />
              <SkeletonBlock className="h-4 w-20" delay={0.3} {...common} />
              <SkeletonBlock className="h-4 w-14" delay={0.4} {...common} />
              <SkeletonBlock className="h-4 w-18" delay={0.5} {...common} />
            </div>
          </div>
          <SkeletonBlock className="h-[80px] w-[150px] shrink-0 rounded-md" delay={0.15} {...common} />
        </div>

        <div className="my-4">
          <SkeletonBlock className="h-[100px] w-full rounded-2xl" delay={0.6} {...common} />
        </div>

        <div className="flex gap-5">
          <SkeletonBlock className="h-4 w-28" delay={0.7} {...common} />
          <SkeletonBlock className="h-4 w-28" delay={0.8} {...common} />
        </div>
      </div>
    </>
  )
}

export default ProjectSkeleton
