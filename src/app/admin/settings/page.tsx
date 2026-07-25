'use client'

import { useEffect, useState } from 'react'
import { getSiteConfig, updateSiteConfig } from '@/actions/site-config'

const STYLES = ['pulse', 'shimmer', 'wave', 'gradient', 'cyber', 'neon', 'quantum', 'terminal', 'powershell'] as const

export default function AdminSettings() {
  const [mode, setMode] = useState<'marquee' | 'grid'>('marquee')
  const [marqueeDuration, setMarqueeDuration] = useState(20000)
  const [speedSaving, setSpeedSaving] = useState(false)
  const [speedMsg, setSpeedMsg] = useState('')
  const [slideInterval, setSlideInterval] = useState(4000)
  const [slideSaving, setSlideSaving] = useState(false)
  const [slideMsg, setSlideMsg] = useState('')
  const [skeletonStyle, setSkeletonStyle] = useState<string>('shimmer')
  const [skeletonDelay, setSkeletonDelay] = useState(2000)
  const [skSaving, setSkSaving] = useState(false)
  const [skMsg, setSkMsg] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getSiteConfig().then((config) => {
      if (config.skills_display_mode) setMode(config.skills_display_mode)
      if (config.marquee_duration) setMarqueeDuration(config.marquee_duration)
      if (config.projects_slide_interval) setSlideInterval(config.projects_slide_interval)
      if (config.skeleton_style) setSkeletonStyle(config.skeleton_style)
      if (config.skeleton_delay) setSkeletonDelay(config.skeleton_delay)
      setLoaded(true)
    })
  }, [])

  const handleModeChange = async (newMode: 'marquee' | 'grid') => {
    setMode(newMode)
    try {
      await updateSiteConfig('skills_display_mode', newMode)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save')
    }
  }

  const saveSpeed = async () => {
    setSpeedSaving(true)
    setSpeedMsg('')
    try {
      await updateSiteConfig('marquee_duration', marqueeDuration)
      setSpeedMsg('Speed saved!')
    } catch (err) {
      setSpeedMsg(err instanceof Error ? err.message : 'Error saving speed')
    }
    setSpeedSaving(false)
  }

  const saveSlideInterval = async () => {
    setSlideSaving(true)
    setSlideMsg('')
    try {
      await updateSiteConfig('projects_slide_interval', slideInterval)
      setSlideMsg('Interval saved!')
    } catch (err) {
      setSlideMsg(err instanceof Error ? err.message : 'Error saving interval')
    }
    setSlideSaving(false)
  }

  const saveSkeleton = async () => {
    setSkSaving(true)
    setSkMsg('')
    try {
      await updateSiteConfig('skeleton_style', skeletonStyle)
      await updateSiteConfig('skeleton_delay', skeletonDelay)
      setSkMsg('Saved!')
    } catch (err) {
      setSkMsg(err instanceof Error ? err.message : 'Error saving')
    }
    setSkSaving(false)
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-white">Settings</h1>

      {!loaded ? (
        <p className="text-[#607b96]">Loading...</p>
      ) : (
        <div className="space-y-6">
          {/* Skills Display Mode */}
          <div className="rounded-lg border border-[#607b96]/20 bg-[#0d1a3b] p-5">
            <h2 className="mb-1 text-sm font-semibold text-white">Skills Display Mode</h2>
            <p className="mb-4 text-xs text-[#607b96]">Choose how skills are shown on the main page.</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleModeChange('marquee')}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  mode === 'marquee'
                    ? 'border-[#5565e8] bg-[#5565e8] text-white'
                    : 'border-[#607b96]/40 text-[#607b96] hover:border-[#5565e8] hover:text-white'
                }`}
              >
                Marquee (animated)
              </button>
              <button
                onClick={() => handleModeChange('grid')}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  mode === 'grid'
                    ? 'border-[#5565e8] bg-[#5565e8] text-white'
                    : 'border-[#607b96]/40 text-[#607b96] hover:border-[#5565e8] hover:text-white'
                }`}
              >
                Grid (static)
              </button>
            </div>
          </div>

          {/* Marquee Speed */}
          {mode === 'marquee' && (
            <div className="rounded-lg border border-[#607b96]/20 bg-[#0d1a3b] p-5">
              <h2 className="mb-1 text-sm font-semibold text-white">Marquee Speed</h2>
              <p className="mb-4 text-xs text-[#607b96]">Controls animation speed when Skills Display Mode is set to Marquee.</p>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={5000}
                  max={60000}
                  step={1000}
                  value={marqueeDuration}
                  onChange={(e) => setMarqueeDuration(Number(e.target.value))}
                  className="w-full max-w-xs accent-[#5565e8]"
                />
                <span className="min-w-[80px] text-sm text-white">{marqueeDuration}ms</span>
                <button
                  onClick={saveSpeed}
                  disabled={speedSaving}
                  className="rounded bg-[#5565e8] px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-[#4555d8] disabled:opacity-50"
                >
                  {speedSaving ? 'Saving...' : 'Save'}
                </button>
                {speedMsg && (
                  <span className={`text-sm ${speedMsg === 'Speed saved!' ? 'text-green-400' : 'text-red-400'}`}>
                    {speedMsg}
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs text-[#607b96]">
                Lower = faster, Higher = slower. Default 20000ms.
              </p>
            </div>
          )}

          {/* Projects Slide Interval */}
          <div className="rounded-lg border border-[#607b96]/20 bg-[#0d1a3b] p-5">
            <h2 className="mb-1 text-sm font-semibold text-white">Projects Image Auto-Slide</h2>
            <p className="mb-4 text-xs text-[#607b96]">Controls how fast the project thumbnail images auto-slide (in milliseconds).</p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1000}
                max={12000}
                step={500}
                value={slideInterval}
                onChange={(e) => setSlideInterval(Number(e.target.value))}
                className="w-full max-w-xs accent-[#5565e8]"
              />
              <span className="min-w-[80px] text-sm text-white">{slideInterval}ms</span>
              <button
                onClick={saveSlideInterval}
                disabled={slideSaving}
                className="rounded bg-[#5565e8] px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-[#4555d8] disabled:opacity-50"
              >
                {slideSaving ? 'Saving...' : 'Save'}
              </button>
              {slideMsg && (
                <span className={`text-sm ${slideMsg === 'Interval saved!' ? 'text-green-400' : 'text-red-400'}`}>
                  {slideMsg}
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-[#607b96]">
              Lower = faster, Higher = slower. Default 4000ms.
            </p>
          </div>

          {/* Skeleton Loading */}
          <div className="rounded-lg border border-[#607b96]/20 bg-[#0d1a3b] p-5">
            <h2 className="mb-1 text-sm font-semibold text-white">Skeleton Loading</h2>
            <p className="mb-4 text-xs text-[#607b96]">Choose the skeleton effect and artificial delay for project cards.</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {STYLES.map((st) => (
                <button
                  key={st}
                  onClick={() => setSkeletonStyle(st)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium capitalize transition ${
                    skeletonStyle === st
                      ? 'border-[#5565e8] bg-[#5565e8] text-white'
                      : 'border-[#607b96]/40 text-[#607b96] hover:border-[#5565e8] hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-[#607b96]">Delay:</span>
              <input
                type="range"
                min={0}
                max={5000}
                step={250}
                value={skeletonDelay}
                onChange={(e) => setSkeletonDelay(Number(e.target.value))}
                className="w-full max-w-xs accent-[#5565e8]"
              />
              <span className="min-w-[60px] text-sm text-white">{skeletonDelay}ms</span>
              <button
                onClick={saveSkeleton}
                disabled={skSaving}
                className="rounded bg-[#5565e8] px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-[#4555d8] disabled:opacity-50"
              >
                {skSaving ? 'Saving...' : 'Save'}
              </button>
              {skMsg && (
                <span className={`text-sm ${skMsg === 'Saved!' ? 'text-green-400' : 'text-red-400'}`}>
                  {skMsg}
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-[#607b96]">
              Style: {skeletonStyle} · Delay: {skeletonDelay}ms (0 = no artificial delay). Default shimmer / 2000ms.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
