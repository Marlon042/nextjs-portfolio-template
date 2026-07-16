'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Stat {
  label: string
  count: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const tables = ['projects', 'skills', 'sections', 'testimonials'] as const
      const results = await Promise.all(
        tables.map(async (table) => {
          const { count } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true })
          return { label: table.charAt(0).toUpperCase() + table.slice(1), count: count ?? 0 }
        }),
      )
      setStats(results)
      setLoading(false)
    }

    fetchStats()
  }, [])

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-white">Dashboard</h1>

      {loading ? (
        <p className="text-[#607b96]">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-[#607b96] bg-[#0d1a3b] p-6"
            >
              <p className="text-3xl font-bold text-[#18f2e5]">{stat.count}</p>
              <p className="mt-1 text-sm text-[#607b96]">{stat.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
