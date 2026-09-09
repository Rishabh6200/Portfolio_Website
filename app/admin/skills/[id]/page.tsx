import { notFound } from "next/navigation"
import { skillService, categoryService } from "@/services"
import { SkillForm } from "../_components/skill-form"

interface PageProps {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

export default async function EditSkillPage({ params }: PageProps) {
  const { id } = await params

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let skill: any = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let categories: any[] = []

  try {
    const [skillDoc, categoryDocs] = await Promise.all([
      skillService.getById(id),
      categoryService.getAll(),
    ])
    skill = skillDoc
    categories = categoryDocs
  } catch (err) {
    console.error("Error finding skill or categories:", err)
  }

  if (!skill) {
    notFound()
  }

  return (
    <div className="w-full space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Edit: {skill.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Modify technical competency details, parent category, and public portfolio visibility.
        </p>
      </div>

      <SkillForm
        categories={categories}
        initialData={skill}
        isEditing={true}
      />
    </div>
  )
}
