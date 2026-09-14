import { skillService } from "@/services"
import { EducationForm } from "../_components/education-form"

export const dynamic = "force-dynamic"

export default async function NewEducationPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let skills: any[] = []

  try {
    skills = await skillService.getAll()
  } catch (err) {
    console.error("Error fetching skills for education:", err)
  }

  return (
    <div className="w-full space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          New Education / Certification
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add a degree, university education, certification, or milestone course to your portfolio.
        </p>
      </div>

      <EducationForm isEditing={false} availableSkills={skills} />
    </div>
  )
}
