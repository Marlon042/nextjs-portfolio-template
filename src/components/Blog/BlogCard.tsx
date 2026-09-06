import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/utils'

interface BlogCardProps {
  slug: string
  cover_url: string | null
  cover_alt: string | null
  categoryName: string | null
  title: string
  excerpt: string
  authorName: string | null
  published_at: string | null
  reading_time: number | null
  views: number
}

export default function BlogCard({
  slug,
  cover_url,
  cover_alt,
  categoryName,
  title,
  excerpt,
  authorName,
  published_at,
  reading_time,
  views,
}: BlogCardProps) {
  return (
    <Link
      href={`/blogs/${slug}`}
      className="bg-secondary border-border group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-[#0d1a3b]">
        {cover_url ? (
          <Image
            src={cover_url}
            alt={cover_alt || title}
            width={640}
            height={360}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">📝</div>
        )}
        {categoryName && (
          <span className="absolute top-3 left-3 rounded-full bg-[#011627]/80 px-3 py-1 text-xs font-semibold text-[#18f2e5]">
            {categoryName}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-neutral group-hover:text-accent mb-2 line-clamp-2 text-lg font-bold transition-colors">
          {title}
        </h3>
        <p className="text-tertiary-content mb-4 line-clamp-2 flex-1 text-sm">{excerpt}</p>
        <div className="text-tertiary-content flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          {authorName && <span className="font-semibold">{authorName}</span>}
          {published_at && <span>{formatDate(published_at)}</span>}
          {reading_time != null && <span>· {reading_time} min</span>}
          <span>· 👁 {views}</span>
        </div>
      </div>
    </Link>
  )
}
