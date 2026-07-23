'use client'

import { useEffect, useState } from 'react'
import { getSiteConfig, updateSiteConfig } from '@/actions/site-config'

export default function AdminSettings() {
  const [mode, setMode] = useState<'marquee' | 'grid'>('marquee')
  const [marqueeDuration, setMarqueeDuration] = useState(20000)
  const [speedSaving, setSpeedSaving] = useState(false)
  const [speedMsg, setSpeedMsg] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getSiteConfig().then((config) => {
      if (config.skills_display_mode) setMode(config.skills_display_mode)
      if (config.marquee_duration) setMarqueeDuration(config.marquee_duration)
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
        </div>
      )}
    </div>
  )
}
