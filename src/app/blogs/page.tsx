import { promises as fs } from 'fs';
import path from 'path';
import BlogCard from '@/components/Blogs/BlogCard';
import SectionHeading from '@/components/SectionHeading/SectionHeading';

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  description: string;
  content: string;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  const blogsDirectory = path.join(process.cwd(), 'content', 'blogs');
  const filenames = await fs.readdir(blogsDirectory);

  const posts = await Promise.all(filenames.map(async (filename) => {
    const filePath = path.join(blogsDirectory, filename);
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  }));

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default async function BlogsPage() {
  const blogPosts = await getBlogPosts();

  return (
    <section className="container py-section">
      <SectionHeading
        title="Últimos Artículos"
        subtitle="Explora nuestros pensamientos y conocimientos"
      />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}