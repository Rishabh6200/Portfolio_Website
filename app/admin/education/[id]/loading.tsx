import { EducationFormSkeleton } from "../_components/education-skeleton"

export default function EditEducationLoading() {
  return (
    <div className="w-full space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Edit Education / Certification
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update credential details, highlights, skills, and academic institution.
        </p>
      </div>

      <EducationFormSkeleton />
    </div>
  )
}
