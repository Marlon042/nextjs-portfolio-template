'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    router.push('/admin')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#011627]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-[#607b96] bg-[#0d1a3b] p-8 shadow-lg"
      >
        <h1 className="mb-6 text-center text-2xl font-bold text-[#18f2e5]">
          Admin Login
        </h1>

        {error && (
          <p className="mb-4 rounded bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="mb-1 block text-sm text-[#607b96]" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded border border-[#607b96] bg-[#011627] px-3 py-2 text-white outline-none focus:border-[#18f2e5]"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm text-[#607b96]" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded border border-[#607b96] bg-[#011627] px-3 py-2 text-white outline-none focus:border-[#18f2e5]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-[#5565e8] px-4 py-2 font-semibold text-white transition hover:bg-[#4555d8] disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
