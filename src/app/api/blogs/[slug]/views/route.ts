import { NextResponse } from 'next/server'
import { incrementViews } from '@/actions/blogs'

/** POST /api/blogs/:slug/views — contador fire-and-forget */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  await incrementViews(slug)
  return NextResponse.json({ ok: true })
}
