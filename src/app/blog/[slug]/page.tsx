import { readFileSync, readdirSync } from 'fs'
import path from 'path'

interface BlogPost {
  title: string
  shortDescription: string
  cover: string
  slug: string
  publishDate: string
  estimatedTimeToRead: string
}

const blogsDirectory = path.join(process.cwd(), 'content/blogs')

export async function generateStaticParams() {
  const fileNames = readdirSync(blogsDirectory)

  return fileNames.map((fileName) => ({
    slug: fileName.replace(/\.json$/, ''),
  }))
}


const getBlogPost = (slug: string): BlogPost => {
  const filePath = path.join(blogsDirectory, `${slug}.json`)
  const fileContent = readFileSync(filePath, 'utf-8')
  return JSON.parse(fileContent)
}

interface Props {
  params: {
    slug: string
  }
}

const BlogPostPage = ({ params }: Props) => {
  const { slug } = params
  const blogPost = getBlogPost(slug)

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">{blogPost.title}</h1>
      <p>{blogPost.shortDescription}</p>
    </div>
  )
}

export default BlogPostPage