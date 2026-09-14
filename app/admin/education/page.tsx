import { Suspense } from "react"
import Link from "next/link"
import { educationService } from "@/services"
import { EducationTable } from "./_components/education-table"
import { EducationTableSkeleton } from "./_components/education-skeleton"
import { buttonVariants } from "@/components/ui/button"
import { Plus, AlertCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default function AdminEducationPage() {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Education & Certifications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage degrees, professional certifications, courses, and academic achievements.
          </p>
        </div>

        <div>
          <Link
            href="/admin/education/new"
            className={buttonVariants({ size: "default" })}
          >
            <Plus className="h-4 w-4" />
            <span>Add Education</span>
          </Link>
        </div>
      </div>

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
      <EducationTable educationList={educationList} />
    </div>
  )
}
