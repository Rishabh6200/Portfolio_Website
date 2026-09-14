import { Suspense } from "react"
import { experienceService } from "@/services"
import { ExperienceTable } from "./_components/experience-table"
import { ExperiencesTableSkeleton } from "./_components/experiences-skeleton"
import { AdminPageHeader } from "../_components/admin-page-header"
import { DbConnectionAlert } from "../_components/db-connection-alert"

export const dynamic = "force-dynamic"

export default function AdminExperiencePage() {
  return (
    <div className="w-full space-y-6">
      <AdminPageHeader
        title="Experience"
        description="Manage your career history, roles, milestones, and technical contributions."
        actionLabel="Add Experience"
        actionHref="/admin/experience/new"
      />

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
    return <DbConnectionAlert error={dbError} />
  }

  return (
    <div className="space-y-4">
      <ExperienceTable experiences={experiences} />
    </div>
  )
}
