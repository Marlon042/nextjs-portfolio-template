import { getSkills } from '@/appData'
import ContactSection from '@/components/Contact/ContactSection'
import Hero from '@/components/Hero/Hero'
import ProjectSection from '@/components/Projects/ProjectSection'
import ClientServiceSection from '@/components/ClientServiceSection'
import ClientComputerSupportSection from '@/components/ComputerSupport/ClientComputerSupportSection'
import Skills from '@/components/Skills/Skills'
// import TestimonialSection from '@/components/Testimonials/TestimonialSection'
import { getAllProjects } from '@/services'
import { getAllTestimonials } from '@/services'

export default async function Home() {
  const [projects, skills] = await Promise.all([
    getAllProjects(),
    getSkills(),
  ])

  const skillsFormatted = skills.map((s) => ({
    name: s.name,
    icon_id: s.icon_id,
  }))

  return (
    <main>
      <Hero />
      <Skills skills={skillsFormatted} />
      <div className="mx-auto my-8 max-w-[1200px] px-4 md:my-[3.75rem]">
        <ProjectSection projects={projects} />
        <ClientServiceSection />
        <ClientComputerSupportSection />
        {/* <TestimonialSection testimonials={testimonials} /> */}
        <ContactSection />
      </div>
    </main>
  )
}
