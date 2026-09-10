import { ExperienceFormSkeleton } from "../_components/experience-form-skeleton"

export default function NewExperienceLoading() {
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

      <ExperienceFormSkeleton />
    </div>
  )
}
