'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getProjects, deleteProject, updateProject } from '@/actions/projects'
import InlineEditableTitle from '@/components/Admin/InlineEditableTitle'

interface Project {
  id: string
  title: string
  type: string
  priority: number
  cover_url: string
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data)
      setLoading(false)
    })
  }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    try {
      await deleteProject(id)
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  const handleDrop = useCallback(async (fromIdx: number, toIdx: number) => {
    if (fromIdx === toIdx) return
    const reordered = [...projects]
    const [moved] = reordered.splice(fromIdx, 1)
    reordered.splice(toIdx, 0, moved)
    const updated = reordered.map((p, i) => ({ ...p, priority: i + 1 }))
    setProjects(updated)
    try {
      await Promise.all(updated.map((p) => updateProject(p.id, { priority: p.priority })))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save order')
    }
  }, [projects])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <InlineEditableTitle translationKey="projects.title" className="text-2xl font-bold text-white" />
        <Link
          href="/admin/projects/new"
          className="rounded bg-[#5565e8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4555d8]"
        >
          + New Project
        </Link>
      </div>

      {loading ? (
        <p className="text-[#607b96]">Loading...</p>
      ) : projects.length === 0 ? (
        <p className="text-[#607b96]">No projects yet. Create one!</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#607b96]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#607b96] bg-[#0d1a3b]">
              <tr>
                <th className="w-10 px-2 py-3 text-[#607b96]"></th>
                <th className="px-4 py-3 text-[#607b96]">#</th>
                <th className="px-4 py-3 text-[#607b96]">Image</th>
                <th className="px-4 py-3 text-[#607b96]">Title</th>
                <th className="px-4 py-3 text-[#607b96]">Type</th>
                <th className="px-4 py-3 text-[#607b96]">Priority</th>
                <th className="px-4 py-3 text-[#607b96]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, i) => (
                <tr
                  key={project.id}
                  draggable
                  onDragStart={() => setDragIdx(i)}
                  onDragOver={(e) => { e.preventDefault(); if (dragIdx !== null && dragIdx !== i) setDragIdx(i) }}
                  onDragEnd={() => { if (dragIdx !== null && dragIdx !== i) handleDrop(dragIdx, i); setDragIdx(null) }}
                  className={`border-b border-[#607b96]/20 transition ${
                    dragIdx === i ? 'bg-[#5565e8]/10 opacity-50' : 'hover:bg-[#1a2d4a]'
                  }`}
                >
                  <td className="w-10 px-2 py-3">
                    <span className="flex cursor-grab items-center justify-center text-[#607b96] hover:text-white active:cursor-grabbing">
                      <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm8 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM8 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm8 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM8 22a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm8 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" /></svg>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#607b96]">{i + 1}</td>
                  <td className="px-4 py-3">
                    <img
                      src={project.cover_url}
                      alt=""
                      className="h-10 w-14 rounded object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-white">{project.title}</td>
                  <td className="px-4 py-3 text-[#607b96]">{project.type}</td>
                  <td className="px-4 py-3 text-[#607b96]">{project.priority}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/admin/projects/${project.id}`)}
                        className="rounded bg-[#5565e8]/20 px-3 py-1 text-sm text-[#5565e8] transition hover:bg-[#5565e8]/30"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id, project.title)}
                        className="rounded bg-red-500/20 px-3 py-1 text-sm text-red-400 transition hover:bg-red-500/30"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
