import { notFound } from "next/navigation"
import { projectService, categoryService } from "@/services"
import { ProjectForm } from "../_components/project-form"

interface PageProps {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let project: any = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let categories: any[] = []

  try {
    const [projectDoc, categoryDocs] = await Promise.all([
      projectService.getById(id),
      categoryService.getAll(),
    ])
    project = projectDoc
    categories = categoryDocs
  } catch (err) {
    console.error("Error finding project or categories:", err)
  }

  if (!project) {
    notFound()
  }

  return (
    <div className="w-full space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Edit: {project.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update system architecture details, ImageKit media, and visibility.
        </p>
      </div>

      <ProjectForm
        initialData={project}
        isEditing={true}
        categories={categories}
      />
    </div>
  )
}
