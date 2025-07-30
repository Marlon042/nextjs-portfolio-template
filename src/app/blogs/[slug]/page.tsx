import { promises as fs } from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import SectionHeading from '@/components/SectionHeading/SectionHeading';

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  description: string;
  content: string;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const blogsDirectory = path.join(process.cwd(), 'content', 'blogs');
  const filePath = path.join(blogsDirectory, `${slug}.json`);

  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    return null;
  }
}

export async function generateStaticParams() {
  const blogsDirectory = path.join(process.cwd(), 'content', 'blogs');
  const filenames = await fs.readdir(blogsDirectory);

  return filenames.map((filename) => ({
    slug: filename.replace(/\.json$/, ''),
  }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <section className="container py-section">
      <SectionHeading
        title={post.title}
        subtitle={`Por ${post.author} el ${new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}`}
      />
      <div className="prose dark:prose-invert max-w-none">
        <p>{post.content}</p>
      </div>
    </section>
  );
}