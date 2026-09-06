import { getPost } from '@/actions/blogs'
import BlogForm, { type BlogFormData } from '@/components/Admin/BlogForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params
  let post: Awaited<ReturnType<typeof getPost>> | null = null
  try {
    post = await getPost(id)
  } catch {
    post = null
  }

  if (!post) {
    return <p className="text-red-400">Post not found</p>
  }

  const translations = (post.blog_post_translations ?? []) as {
    language: string
    title: string
    excerpt: string
    content_html: string
    content_json: Record<string, unknown>
  }[]

  const byLang = (lang: string) =>
    translations.find((t) => t.language === lang) ?? {
      title: '',
      excerpt: '',
      content_html: '',
      content_json: { type: 'doc', content: [] },
    }

  const initialData: BlogFormData = {
    slug: post.slug,
    status: post.status,
    cover_url: post.cover_url ?? '',
    cover_alt: post.cover_alt ?? '',
    category_id: post.category_id ?? '',
    author_id: post.author_id ?? '',
    tags: post.tags ?? [],
    is_featured: post.is_featured ?? false,
    display_order: post.display_order ?? 1,
    translations: {
      es: {
        title: byLang('es').title,
        excerpt: byLang('es').excerpt,
        content_html: byLang('es').content_html,
        content_json: byLang('es').content_json,
      },
      en: {
        title: byLang('en').title,
        excerpt: byLang('en').excerpt,
        content_html: byLang('en').content_html,
        content_json: byLang('en').content_json,
      },
    },
  }

  return <BlogForm action="update" postId={id} initialData={initialData} />
}
