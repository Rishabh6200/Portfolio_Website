import { skillService } from "@/services"
import { ProjectForm } from "../_components/project-form"

export const dynamic = "force-dynamic"

export default async function NewProjectPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let skills: any[] = []

  try {
    skills = await skillService.getAll()
  } catch (err) {
    console.error("Error fetching skills for new project:", err)
  }

  return (
    <div className="w-full space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          New Project
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add a project, backend architecture, or web application to your portfolio.
        </p>
      </div>

      <ProjectForm isEditing={false} availableSkills={skills} />
    </div>
  )
}
