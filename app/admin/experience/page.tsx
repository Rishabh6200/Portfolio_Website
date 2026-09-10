import { Suspense } from "react"
import Link from "next/link"
import { experienceService } from "@/services"
import { ExperienceTable } from "./_components/experience-table"
import { ExperiencesTableSkeleton } from "./_components/experiences-skeleton"
import { buttonVariants } from "@/components/ui/button"
import { Plus, AlertCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default function AdminExperiencePage() {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Experience
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your career history, roles, milestones, and technical contributions.
          </p>
        </div>

        <div>
          <Link
            href="/admin/experience/new"
            className={buttonVariants({ size: "default" })}
          >
            <Plus className="h-4 w-4" />
            <span>Add Experience</span>
          </Link>
        </div>
      </div>

      <Suspense fallback={<ExperiencesTableSkeleton />}>
        <ExperienceTableData />
      </Suspense>
    </div>
  )
}

async function ExperienceTableData() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let experiences: any[] = []
  let dbError: string | null = null

  try {
    experiences = await experienceService.getAll()
  } catch (err: unknown) {
    dbError = err instanceof Error ? err.message : "Failed to connect to database"
  }

  if (dbError) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 space-y-3">
        <div className="flex items-center gap-2 text-destructive font-medium text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>Database Connection Notice</span>
        </div>
        <p className="text-xs font-mono text-muted-foreground leading-relaxed">
          {dbError}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ExperienceTable experiences={experiences} />
    </div>
  )
}
