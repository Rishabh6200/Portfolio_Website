import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { projectQueries } from "@/features/project/db/queries"
import { profileQueries } from "@/features/profile/db/queries"
import { ProjectDetailView } from "@/features/project/components/detail"

interface PageProps {
   params: Promise<{ slug: string }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
   const { slug } = await params
   const [data, profile] = await Promise.all([
      projectQueries.getBySlugWithContext(slug),
      profileQueries.getProfile(),
   ])

   if (!data || !data.project) {
      return {
         title: "Project Not Found",
      }
   }

   const { project } = data

   const title = project.tagline
      ? `${project.title} — ${project.tagline} | ${profile.name}`
      : `${project.title} | ${profile.name}`

   const ogTitle = project.tagline
      ? `${project.title} — ${project.tagline}`
      : project.title

   return {
      title,
      description: project.tagline || project.description,
      openGraph: {
         title: ogTitle,
         description: project.tagline || project.description,
         images: project.images?.[0] ? [project.images[0]] : undefined,
      },
   }
}

export default async function ProjectPage({ params }: PageProps) {
   const { slug } = await params
   const data = await projectQueries.getBySlugWithContext(slug)

   if (!data || !data.project) {
      notFound()
   }

   const { project, prevProject, nextProject } = data

   return (
      <ProjectDetailView
         project={project}
         prevProject={prevProject}
         nextProject={nextProject}
      />
   )
}
