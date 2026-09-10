import { ExperienceFormSkeleton } from "../_components/experience-form-skeleton"

export default function EditExperienceLoading() {
  return (
    <div className="w-full space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Edit Experience
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update role details, achievements, skills, and timeline.
        </p>
      </div>

      <ExperienceFormSkeleton />
    </div>
  )
}
