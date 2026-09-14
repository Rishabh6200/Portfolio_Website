import { notFound } from "next/navigation"
import { educationService, skillService } from "@/services"
import { EducationForm } from "../_components/education-form"

interface PageProps {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

export default async function EditEducationPage({ params }: PageProps) {
  const { id } = await params

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let education: any = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let skills: any[] = []

  try {
    const [eduDoc, skillDocs] = await Promise.all([
      educationService.getById(id),
      skillService.getAll(),
    ])
    education = eduDoc
    skills = skillDocs
  } catch (err) {
    console.error("Error finding education or skills:", err)
  }

  if (!education) {
    notFound()
  }

  return (
    <div className="w-full space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Edit: {education.degree}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update credential details, highlights, skills, and academic institution.
        </p>
      </div>

      <EducationForm
        isEditing={true}
        initialData={education}
        availableSkills={skills}
      />
    </div>
  )
}
