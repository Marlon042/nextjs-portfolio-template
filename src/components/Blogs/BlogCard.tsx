import Link from 'next/link';

interface BlogCardProps {
  post: {
    slug: string;
    title: string;
    date: string;
    author: string;
    description: string;
  };
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blogs/${post.slug}`} className="block p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{post.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Por {post.author} el {new Date(post.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <p className="text-gray-700 dark:text-gray-300">{post.description}</p>
    </Link>
  );
}