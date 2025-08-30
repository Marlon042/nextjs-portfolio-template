import BlogForm from '@/components/Blog/BlogForm'
import { readdirSync, writeFileSync, readFileSync, unlinkSync } from 'fs'
import path from 'path'
import { useState, useEffect } from 'react'

interface BlogPost {
  title: string
  shortDescription: string
  cover: string
  slug: string
  publishDate: string
  estimatedTimeToRead: string
}

const BlogAdminPage = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([])

  useEffect(() => {
    const fetchBlogs = () => {
      const blogsDirectory = path.join(process.cwd(), 'content/blogs')
      const fileNames = readdirSync(blogsDirectory)

      const blogPosts = fileNames.map((fileName) => {
        const filePath = path.join(blogsDirectory, fileName)
        const fileContent = readFileSync(filePath, 'utf-8')
        return JSON.parse(fileContent)
      })

      setBlogs(blogPosts)
    }

    fetchBlogs();
  }, []);

  const handleEdit = (slug: string) => {
    // Implement edit functionality
    console.log(`Edit blog with slug: ${slug}`)
  }

  const handleDelete = (slug: string) => {
    const filePath = path.join(process.cwd(), 'content/blogs', `${slug}.json`)
    unlinkSync(filePath);
    // Update the list of blogs
    setBlogs((prevBlogs) => prevBlogs.filter((blog: BlogPost) => blog.slug !== slug));
  }

  const handleSubmit = (data: BlogPost) => {
    const filePath = path.join(process.cwd(), 'content/blogs', `${data.slug}.json`)
    writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Blog Admin</h1>
      <p>Aquí podrás administrar tus blogs.</p>
      <BlogForm onSubmit={handleSubmit} />

      <h2 className="text-2xl font-bold mt-5 text-secondary-content">Existing Blogs</h2>
      <ul>
        {blogs.map((blog: BlogPost) => (
          <li key={blog.slug} className="text-secondary-content">
            {blog.title}
            <button
              className="bg-yellow-500 text-white px-2 py-1 rounded-md ml-2"
              onClick={() => handleEdit(blog.slug)}>
              Edit
            </button>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded-md ml-2"
              onClick={() => handleDelete(blog.slug)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BlogAdminPage