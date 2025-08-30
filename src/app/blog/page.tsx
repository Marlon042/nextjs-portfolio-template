import BlogCard from '@/components/Blog/BlogCard'
import { readdirSync, readFileSync } from 'fs'
import path from 'path'

const blogsDirectory = path.join(process.cwd(), 'content/blogs')

interface BlogPost {
  title: string
  shortDescription: string
  cover: string
  slug: string
  publishDate: string
  estimatedTimeToRead: string
}

const getBlogPosts = (): BlogPost[] => {
  const fileNames = readdirSync(blogsDirectory)

  return fileNames
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => {
      const filePath = path.join(blogsDirectory, fileName)
      const fileContent = readFileSync(filePath, 'utf-8')
      return JSON.parse(fileContent)
    })
}

const BlogPage = () => {
  const blogPosts = getBlogPosts()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Blog</h1>
      <div className="grid gap-5">
        {blogPosts.map((post) => (
          <BlogCard key={post.slug} {...post} />
        ))}
      </div>
    </div>
  )
}

export default BlogPage