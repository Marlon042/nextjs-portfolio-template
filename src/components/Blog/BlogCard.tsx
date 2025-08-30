import { formatDate } from '@/utils'

interface BlogCardProps {
  title: string
  shortDescription: string
  cover: string
  slug: string
  publishDate: string
  estimatedTimeToRead: string
}

export const BlogCard: React.FC<BlogCardProps> = ({
  title,
  shortDescription,
  cover,
  slug,
  publishDate,
  estimatedTimeToRead,
}) => {
  return (
    <div key={slug} className="flex flex-col gap-3 rounded-lg border border-border bg-secondary p-3 lg:flex-row">
      <figure className="relative mt-1 h-24 min-w-40 overflow-hidden bg-neutral">
        <img
          className="absolute inset-0 h-full w-full rounded-md object-cover transition-transform duration-300 hover:scale-125"
          src={cover}
          alt={title}
        />
      </figure>

      <a href={`/blog/${slug}`}>
        <h3 className="mb-2 text-xl font-bold text-secondary-content transition-colors duration-200 hover:text-accent">
          {title}
        </h3>
        <p className="text-tertiary-content">{shortDescription}</p>
        <p className="mt-4 text-sm font-semibold text-tertiary-content">
          {formatDate(publishDate)} | {estimatedTimeToRead}
        </p>
      </a>
    </div>
  )
}

export default BlogCard