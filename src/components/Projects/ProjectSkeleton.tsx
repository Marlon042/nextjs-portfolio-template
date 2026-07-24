'use client'

import { FC } from 'react'

const SkeletonBlock: FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse rounded bg-[#1a2d4a] ${className}`} />
)

const ProjectSkeleton: FC = () => (
  <div className="bg-secondary border-border flex flex-col justify-between rounded-[14px] border p-5">
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SkeletonBlock className="h-5 w-32" />
          <SkeletonBlock className="h-7 w-20 rounded-md" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2 sm:gap-4">
          <SkeletonBlock className="h-4 w-16" />
          <SkeletonBlock className="h-4 w-20" />
          <SkeletonBlock className="h-4 w-14" />
          <SkeletonBlock className="h-4 w-18" />
        </div>
      </div>
      <SkeletonBlock className="h-[80px] w-[150px] shrink-0 rounded-md" />
    </div>

    <div className="my-4">
      <SkeletonBlock className="h-[100px] w-full rounded-2xl" />
    </div>

    <div className="flex gap-5">
      <SkeletonBlock className="h-4 w-28" />
      <SkeletonBlock className="h-4 w-28" />
    </div>
  </div>
)

export default ProjectSkeleton
