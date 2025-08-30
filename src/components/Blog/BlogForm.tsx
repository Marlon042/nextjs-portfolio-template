import { useState } from 'react'

interface BlogFormProps {
  onSubmit: (data: any) => void
}

const BlogForm: React.FC<BlogFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [cover, setCover] = useState('')
  const [slug, setSlug] = useState('')
  const [publishDate, setPublishDate] = useState('')
  const [estimatedTimeToRead, setEstimatedTimeToRead] = useState('')

  const handleSubmit = (e: any) => {
    e.preventDefault()
    onSubmit({
      title,
      shortDescription,
      cover,
      slug,
      publishDate,
      estimatedTimeToRead,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-border rounded-md px-2 py-1 w-full bg-secondary text-secondary-content"
        />
      </label>
      <label className="text-secondary-content">
        Short Description:
        <textarea
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          className="border border-border rounded-md px-2 py-1 w-full bg-secondary text-secondary-content"
        />
      </label>
      <label className="text-secondary-content">
        Cover Image URL:
        <input
          type="text"
          value={cover}
          onChange={(e) => setCover(e.target.value)}
          className="border border-border rounded-md px-2 py-1 w-full bg-secondary text-secondary-content"
        />
      </label>
      <label className="text-secondary-content">
        Slug:
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="border border-border rounded-md px-2 py-1 w-full bg-secondary text-secondary-content"
        />
      </label>
      <label className="text-secondary-content">
        Publish Date:
        <input
          type="date"
          value={publishDate}
          onChange={(e) => setPublishDate(e.target.value)}
          className="border border-border rounded-md px-2 py-1 w-full bg-secondary text-secondary-content"
        />
      </label>
      <label className="text-secondary-content">
        Estimated Time to Read:
        <input
          type="text"
          value={estimatedTimeToRead}
          onChange={(e) => setEstimatedTimeToRead(e.target.value)}
          className="border border-border rounded-md px-2 py-1 w-full bg-secondary text-secondary-content"
        />
      </label>
      <button type="submit" className="bg-accent text-white px-4 py-2 rounded-md">
        Create Blog
      </button>
    </form>
  )
}

export default BlogForm