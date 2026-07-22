import { getSkills } from '@/appData'
import ContactSection from '@/components/Contact/ContactSection'
import Hero from '@/components/Hero/Hero'
import ProjectsAccordion from '@/components/Projects/ProjectsAccordion'
import DynamicAccordion from '@/components/DynamicAccordion'
import Skills from '@/components/Skills/Skills'

export default async function Home() {
  const skills = await getSkills()

  const skillsFormatted = skills.map((s) => ({
    name: s.name,
    icon_id: s.icon_id,
  }))

  return (
    <main>
      <Hero />
      <Skills skills={skillsFormatted} />
      <div className="mx-auto my-8 max-w-[1200px] px-4 md:my-[3.75rem]">
        <ProjectsAccordion />
        <DynamicAccordion identifier="services" />
        <DynamicAccordion identifier="support" />
        <ContactSection />
      </div>
    </main>
  )
}
