import { Suspense } from "react"
import { webQueries } from "@/features/web/queries"
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
   const categoriesWithSkills = await webQueries.getCategoriesWithSkills()
   return <BentoGridSection initialCategories={categoriesWithSkills} />
}

async function AsyncProjectsSection() {
   const projects = await webQueries.getPublishedProjects()
   return <ProjectsSection initialProjects={projects} />
}

async function AsyncExperienceSection() {
   const { experiences, educations } = await webQueries.getExperiencesAndEducations()
   return <ExperienceSection initialExperiences={experiences} initialEducations={educations} />
}

export default async function HomePage() {
   const profile = await webQueries.getProfile()

   return (
      <>
         <HeroSection initialProfile={profile} />
         <Suspense fallback={<BentoGridSkeleton />}>
            <AsyncSkillsSection />
         </Suspense>
         <Suspense fallback={<ProjectsSectionSkeleton />}>
            <AsyncProjectsSection />
         </Suspense>
         <Suspense fallback={<ExperienceSectionSkeleton />}>
            <AsyncExperienceSection />
         </Suspense>
         <ContactSection initialProfile={profile} />
      </>
   )
}
