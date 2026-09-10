import { Suspense } from "react"
import { experienceService, projectService, skillService } from "@/services"
import { HeroSection } from "@/components/sections/hero"
import { BentoGridSection } from "@/components/sections/bento-grid"
import { BentoGridSkeleton } from "@/components/sections/bento-grid-skeleton"
import { ProjectsSection } from "@/components/sections/projects-section"
import { ProjectsSectionSkeleton } from "@/components/sections/projects-section-skeleton"
import { ExperienceSection } from "@/components/sections/experience-section"
import { ExperienceSectionSkeleton } from "@/components/sections/experience-section-skeleton"
import { ContactSection } from "@/components/sections/contact-section"

export const dynamic = "force-dynamic"

async function AsyncSkillsSection() {
  const categoriesWithSkills = await skillService.getCategoriesWithSkills()
  return <BentoGridSection initialCategories={categoriesWithSkills} />
}

async function AsyncProjectsSection() {
  const projects = await projectService.getPublished()
  return <ProjectsSection initialProjects={projects} />
}

async function AsyncExperienceSection() {
  const experiences = await experienceService.getAll()
  return <ExperienceSection initialExperiences={experiences} />
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={<BentoGridSkeleton />}>
        <AsyncSkillsSection />
      </Suspense>
      <Suspense fallback={<ProjectsSectionSkeleton />}>
        <AsyncProjectsSection />
      </Suspense>
      <Suspense fallback={<ExperienceSectionSkeleton />}>
        <AsyncExperienceSection />
      </Suspense>
      <ContactSection />
    </>
  )
}

