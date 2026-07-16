import { getProject } from '@/actions/projects'
import ProjectForm from '@/components/Admin/ProjectForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params
  const project = await getProject(id)

  if (!project) {
    return <p className="text-red-400">Project not found</p>
  }

  return (
    <ProjectForm
      action="update"
      projectId={id}
      initialData={{
        title: project.title,
        short_description: project.short_description,
        cover_url: project.cover_url,
        type: project.type,
        priority: project.priority,
        live_preview_url: project.live_preview_url ?? '',
        github_link: project.github_link ?? '',
        visitors: project.visitors ?? '',
        earned: project.earned ?? '',
        github_stars: project.github_stars ?? '',
        number_of_sales: project.number_of_sales ?? '',
        site_age: project.site_age ?? '',
      }}
    />
  )
}
