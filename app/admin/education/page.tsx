import { Suspense } from "react"
import { educationService } from "@/services"
import { EducationTable } from "./_components/education-table"
import { EducationTableSkeleton } from "./_components/education-skeleton"
import { AdminPageHeader } from "../_components/admin-page-header"
import { DbConnectionAlert } from "../_components/db-connection-alert"

export const dynamic = "force-dynamic"

export default function AdminEducationPage() {
  return (
    <div className="w-full space-y-6">
      <AdminPageHeader
        title="Education & Certifications"
        description="Manage degrees, professional certifications, courses, and academic achievements."
        actionLabel="Add Education"
        actionHref="/admin/education/new"
      />

      <Suspense fallback={<EducationTableSkeleton />}>
        <EducationTableData />
      </Suspense>
    </div>
  )
}

async function EducationTableData() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let educationList: any[] = []
  let dbError: string | null = null

  try {
    educationList = await educationService.getAll()
  } catch (err: unknown) {
    dbError = err instanceof Error ? err.message : "Failed to connect to database"
  }

  if (dbError) {
    return <DbConnectionAlert error={dbError} />
  }

  return (
    <div className="space-y-4">
      <EducationTable educationList={educationList} />
    </div>
  )
}
