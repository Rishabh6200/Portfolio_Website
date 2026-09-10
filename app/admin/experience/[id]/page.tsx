import { notFound } from "next/navigation"
import { experienceService, skillService } from "@/services"
import { ExperienceForm } from "../_components/experience-form"

interface PageProps {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

export default async function EditExperiencePage({ params }: PageProps) {
  const { id } = await params

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let experience: any = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let skills: any[] = []

  try {
    const [expDoc, skillDocs] = await Promise.all([
      experienceService.getById(id),
      skillService.getAll(),
    ])
    experience = expDoc
    skills = skillDocs
  } catch (err) {
    console.error("Error finding experience or skills:", err)
  }

  if (!experience) {
    notFound()
  }

  return (
    <div className="w-full space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Edit: {experience.role} at {experience.company}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update role details, achievements, skills, and timeline.
        </p>
      </div>

      <ExperienceForm
        initialData={experience}
        isEditing={true}
        availableSkills={skills}
      />
    </div>
  )
}
