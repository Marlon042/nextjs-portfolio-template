'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getAllPosts, deletePost, updatePost, type BlogStatus } from '@/actions/blogs'

interface PostRow {
  id: string
  slug: string
  status: BlogStatus
  cover_url: string | null
  category_id: string | null
  display_order: number
  is_featured: boolean
  views: number
  published_at: string | null
  blog_post_translations: { language: string; title: string }[]
  blog_categories: { slug: string; name_es: string } | null
}

const statusBadge: Record<BlogStatus, string> = {
  draft: 'bg-yellow-500/20 text-yellow-400',
  published: 'bg-green-500/20 text-green-400',
  archived: 'bg-[#607b96]/20 text-[#607b96]',
}

type StatusFilter = 'all' | BlogStatus | 'featured'

export default function AdminBlogs() {
  const [posts, setPosts] = useState<PostRow[]>([])
  const [loading, setLoading] = useState(true)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const router = useRouter()

  const load = useCallback(async () => {
    try {
      const data = await getAllPosts()
      setPosts(data as unknown as PostRow[])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const channel = supabase
      .channel('blogs-admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, () => load())
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [load])

  const titleOf = (p: PostRow) =>
    p.blog_post_translations.find((t) => t.language === 'es')?.title ??
    p.blog_post_translations[0]?.title ??
    p.slug

  const filtered = posts.filter((p) => {
    if (statusFilter === 'all') return true
    if (statusFilter === 'featured') return p.is_featured
    return p.status === statusFilter
  })

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    try {
      await deletePost(id)
      setPosts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  const handleToggleStatus = async (p: PostRow) => {
    const next: BlogStatus = p.status === 'published' ? 'draft' : 'published'
    try {
      setPosts((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: next } : x)))
      await updatePost(p.id, { status: next })
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status')
      load()
    }
  }

  const handleDrop = useCallback(
    async (fromIdx: number, toIdx: number) => {
      if (fromIdx === toIdx) return
      const reordered = [...filtered]
      const [moved] = reordered.splice(fromIdx, 1)
      reordered.splice(toIdx, 0, moved)
      const updated = reordered.map((p, i) => ({ ...p, display_order: i + 1 }))
      const byId = new Map(updated.map((p) => [p.id, p.display_order]))
      setPosts((prev) => prev.map((p) => (byId.has(p.id) ? { ...p, display_order: byId.get(p.id)! } : p)))
      try {
        await Promise.all(updated.map((p) => updatePost(p.id, { display_order: p.display_order })))
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to save order')
      }
    },
    [filtered],
  )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Blog</h1>
        <Link
          href="/admin/blogs/new"
          className="rounded bg-[#5565e8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4555d8]"
        >
          + New Post
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'draft', 'published', 'archived', 'featured'] as StatusFilter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setStatusFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition ${
              statusFilter === f ? 'bg-[#5565e8] text-white' : 'border border-[#607b96] text-[#607b96] hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto self-center text-xs text-[#607b96]">{filtered.length} posts</span>
      </div>

      {loading ? (
        <p className="text-[#607b96]">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-[#607b96]">No posts yet. Create one!</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#607b96]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#607b96] bg-[#0d1a3b]">
              <tr>
                <th className="w-10 px-2 py-3 text-[#607b96]"></th>
                <th className="px-4 py-3 text-[#607b96]">#</th>
                <th className="px-4 py-3 text-[#607b96]">Cover</th>
                <th className="px-4 py-3 text-[#607b96]">Title</th>
                <th className="px-4 py-3 text-[#607b96]">Category</th>
                <th className="px-4 py-3 text-[#607b96]">Status</th>
                <th className="px-4 py-3 text-[#607b96]">Views</th>
                <th className="px-4 py-3 text-[#607b96]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post, i) => (
                <tr
                  key={post.id}
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
                    {post.cover_url ? (
                      <img src={post.cover_url} alt="" className="h-10 w-14 rounded object-cover" />
                    ) : (
                      <span className="text-[#607b96]">—</span>
                    )}
                  </td>
                  <td className="max-w-60 px-4 py-3">
                    <p className="truncate font-medium text-white">
                      {post.is_featured && '⭐ '}
                      {titleOf(post)}
                    </p>
                    <p className="truncate text-xs text-[#607b96]">/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-[#607b96]">{post.blog_categories?.name_es ?? '—'}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(post)}
                      title="Click para publicar/ocultar"
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize transition hover:opacity-80 ${statusBadge[post.status]}`}
                    >
                      {post.status}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-[#607b96]">{post.views}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/admin/blogs/${post.id}`)}
                        className="rounded bg-[#5565e8]/20 px-3 py-1 text-sm text-[#5565e8] transition hover:bg-[#5565e8]/30"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, titleOf(post))}
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
