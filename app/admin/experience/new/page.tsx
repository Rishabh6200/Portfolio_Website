import { skillService } from "@/services"
import { ExperienceForm } from "../_components/experience-form"

export const dynamic = "force-dynamic"

export default async function NewExperiencePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let skills: any[] = []

  try {
    skills = await skillService.getAll()
  } catch (err) {
    console.error("Error fetching skills for experience:", err)
  }

  return (
    <div className="w-full space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          New Experience
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add a career role, company milestone, or leadership chapter to your portfolio.
        </p>
      </div>

      <ExperienceForm isEditing={false} availableSkills={skills} />
    </div>
  )
}
