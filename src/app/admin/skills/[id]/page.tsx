import { getSkill } from '@/actions/skills'
import SkillForm from '@/components/Admin/SkillForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditSkillPage({ params }: Props) {
  const { id } = await params
  const skill = await getSkill(id)

  if (!skill) {
    return <p className="text-red-400">Skill not found</p>
  }

  return (
    <SkillForm
      action="update"
      skillId={id}
      initialData={{
        name: skill.name,
        icon_id: skill.icon_id,
        display_order: skill.display_order,
      }}
    />
  )
}
