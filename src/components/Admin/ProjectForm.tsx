'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from './ImageUpload'
import { createProject, updateProject } from '@/actions/projects'

interface ProjectData {
  title: string
  short_description: string
  cover_url: string
  type: string
  priority: number
  live_preview_url?: string
  github_link?: string
  visitors?: string
  earned?: string
  github_stars?: string
  number_of_sales?: string
  site_age?: string
}

interface ProjectFormProps {
  initialData?: ProjectData
  projectId?: string
  action: 'create' | 'update'
}

export default function ProjectForm({ initialData, projectId, action }: ProjectFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<ProjectData>(
    initialData ?? {
      title: '',
      short_description: '',
      cover_url: '',
      type: 'Free 🔥',
      priority: 1,
      live_preview_url: '',
      github_link: '',
      visitors: '',
      earned: '',
      github_stars: '',
      number_of_sales: '',
      site_age: '',
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: name === 'priority' ? Number(value) : value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (action === 'create') {
        await createProject(form)
      } else if (projectId) {
        await updateProject(projectId, form)
      }
      window.location.href = '/admin/projects'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-white">
        {action === 'create' ? 'New Project' : 'Edit Project'}
      </h1>

      {error && (
        <p className="rounded bg-red-500/10 p-3 text-sm text-red-400">{error}</p>
      )}

      <div>
        <label className="mb-1 block text-sm text-[#607b96]" htmlFor="title">Title *</label>
        <input id="title" name="title" value={form.title} onChange={handleChange} required
          className="w-full rounded border border-[#607b96] bg-[#011627] px-3 py-2 text-white outline-none focus:border-[#18f2e5]" />
      </div>

      <div>
        <label className="mb-1 block text-sm text-[#607b96]" htmlFor="short_description">Description *</label>
        <textarea id="short_description" name="short_description" value={form.short_description} onChange={handleChange} required rows={4}
          className="w-full rounded border border-[#607b96] bg-[#011627] px-3 py-2 text-white outline-none focus:border-[#18f2e5]" />
      </div>

      <ImageUpload
        label="Cover Image *"
        currentImage={form.cover_url}
        onUpload={(url) => setForm((prev) => ({ ...prev, cover_url: url }))}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-[#607b96]" htmlFor="type">Type *</label>
          <select id="type" name="type" value={form.type} onChange={handleChange}
            className="w-full rounded border border-[#607b96] bg-[#011627] px-3 py-2 text-white outline-none focus:border-[#18f2e5]">
            <option>Free 🔥</option>
            <option>Client Work 🙍‍♂️</option>
            <option>University Project</option>
            <option>New 🔥</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm text-[#607b96]" htmlFor="priority">Priority *</label>
          <input id="priority" name="priority" type="number" value={form.priority} onChange={handleChange} required min={1}
            className="w-full rounded border border-[#607b96] bg-[#011627] px-3 py-2 text-white outline-none focus:border-[#18f2e5]" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-[#607b96]" htmlFor="live_preview_url">Live Preview URL</label>
          <input id="live_preview_url" name="live_preview_url" value={form.live_preview_url ?? ''} onChange={handleChange}
            className="w-full rounded border border-[#607b96] bg-[#011627] px-3 py-2 text-white outline-none focus:border-[#18f2e5]" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-[#607b96]" htmlFor="github_link">GitHub Link</label>
          <input id="github_link" name="github_link" value={form.github_link ?? ''} onChange={handleChange}
            className="w-full rounded border border-[#607b96] bg-[#011627] px-3 py-2 text-white outline-none focus:border-[#18f2e5]" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block text-sm text-[#607b96]" htmlFor="visitors">Visitors</label>
          <input id="visitors" name="visitors" value={form.visitors ?? ''} onChange={handleChange}
            className="w-full rounded border border-[#607b96] bg-[#011627] px-3 py-2 text-white outline-none focus:border-[#18f2e5]" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-[#607b96]" htmlFor="earned">Earned</label>
          <input id="earned" name="earned" value={form.earned ?? ''} onChange={handleChange}
            className="w-full rounded border border-[#607b96] bg-[#011627] px-3 py-2 text-white outline-none focus:border-[#18f2e5]" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-[#607b96]" htmlFor="github_stars">GitHub Stars</label>
          <input id="github_stars" name="github_stars" value={form.github_stars ?? ''} onChange={handleChange}
            className="w-full rounded border border-[#607b96] bg-[#011627] px-3 py-2 text-white outline-none focus:border-[#18f2e5]" />
        </div>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={loading}
          className="rounded bg-[#5565e8] px-6 py-2 font-semibold text-white transition hover:bg-[#4555d8] disabled:opacity-50">
          {loading ? 'Saving...' : action === 'create' ? 'Create Project' : 'Update Project'}
        </button>
        <button type="button" onClick={() => router.push('/admin/projects')}
          className="rounded border border-[#607b96] px-6 py-2 text-[#607b96] transition hover:bg-[#1a2d4a] hover:text-white">
          Cancel
        </button>
      </div>
    </form>
  )
}
